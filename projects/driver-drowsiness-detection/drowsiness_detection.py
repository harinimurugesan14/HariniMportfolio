"""
Driver Drowsiness Detection System
-----------------------------------
Rings an alarm if the driver's eyes stay closed for more than
CLOSED_EYE_ALARM_SECONDS (default 8 seconds).

Pipeline:
    Webcam -> MediaPipe Face Mesh (landmarks)
           -> Eye Aspect Ratio (EAR) calculation
           -> Closed-eye duration timer
           -> Alarm trigger (threaded, non-blocking)

Run:
    pip install -r requirements.txt
    python drowsiness_detection.py
"""

import os
import time
import wave
import struct
import math
import threading

import cv2
import numpy as np
import mediapipe as mp

# Optional playback backends — script auto-picks whichever is available.
# winsound is built into Python on Windows (no install needed).
import sys

AUDIO_BACKEND = None
if sys.platform == "win32":
    try:
        import winsound
        AUDIO_BACKEND = "winsound"
    except ImportError:
        pass

if AUDIO_BACKEND is None:
    try:
        import simpleaudio as sa
        AUDIO_BACKEND = "simpleaudio"
    except ImportError:
        try:
            from playsound import playsound
            AUDIO_BACKEND = "playsound"
        except ImportError:
            AUDIO_BACKEND = None


# ----------------------------- CONFIG ----------------------------- #
CLOSED_EYE_ALARM_SECONDS = 8.0     # trigger alarm after eyes closed this long
EAR_THRESHOLD = 0.21               # below this = eye considered "closed"
EAR_CONSEC_SMOOTHING = 3           # frames to average EAR over (reduces jitter)
ALARM_WAV_PATH = os.path.join(os.path.dirname(__file__), "alarm.wav")
CAM_INDEX = 0                      # change if you have multiple cameras
SHOW_MESH = True                   # draw eye landmarks on screen

# MediaPipe Face Mesh eye landmark indices (standard 468-point topology)
LEFT_EYE = [33, 160, 158, 133, 153, 144]
RIGHT_EYE = [362, 385, 387, 263, 373, 380]


# ------------------------- ALARM GENERATION ------------------------ #
def generate_alarm_wav(path, freq=1000, duration=1.5, volume=0.5, sample_rate=44100):
    """Synthesizes a simple beeping alarm tone and saves it as a WAV file.
    Runs once; skipped if the file already exists."""
    if os.path.exists(path):
        return

    n_samples = int(sample_rate * duration)
    audio = []
    for i in range(n_samples):
        t = i / sample_rate
        # square-ish pulsing tone (more attention-grabbing than pure sine)
        pulse = 1.0 if math.sin(2 * math.pi * 4 * t) > 0 else 0.0
        sample = volume * pulse * math.sin(2 * math.pi * freq * t)
        audio.append(int(sample * 32767))

    with wave.open(path, "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sample_rate)
        for s in audio:
            wf.writeframes(struct.pack("<h", s))


class AlarmPlayer:
    """Plays the alarm on a loop in a background thread until stopped."""

    def __init__(self, wav_path):
        self.wav_path = wav_path
        self._stop_flag = threading.Event()
        self._thread = None

    def start(self):
        if self._thread and self._thread.is_alive():
            return
        self._stop_flag.clear()
        self._thread = threading.Thread(target=self._loop, daemon=True)
        self._thread.start()

    def stop(self):
        self._stop_flag.set()

    def _loop(self):
        while not self._stop_flag.is_set():
            self._play_once()

    def _play_once(self):
        if AUDIO_BACKEND == "winsound":
            winsound.PlaySound(self.wav_path, winsound.SND_FILENAME)
        elif AUDIO_BACKEND == "simpleaudio":
            wave_obj = sa.WaveObject.from_wave_file(self.wav_path)
            play_obj = wave_obj.play()
            # poll so we can stop quickly instead of blocking the full clip
            while play_obj.is_playing():
                if self._stop_flag.is_set():
                    play_obj.stop()
                    return
                time.sleep(0.05)
        elif AUDIO_BACKEND == "playsound":
            playsound(self.wav_path)
        else:
            # fallback: terminal bell (no extra dependency needed)
            print("\a", end="", flush=True)
            time.sleep(0.5)


# ----------------------------- EAR MATH ----------------------------- #
def euclidean(p1, p2):
    return math.dist(p1, p2)


def eye_aspect_ratio(landmarks, eye_indices, img_w, img_h):
    pts = [(landmarks[i].x * img_w, landmarks[i].y * img_h) for i in eye_indices]
    p1, p2, p3, p4, p5, p6 = pts
    vertical_1 = euclidean(p2, p6)
    vertical_2 = euclidean(p3, p5)
    horizontal = euclidean(p1, p4)
    if horizontal == 0:
        return 0.0
    return (vertical_1 + vertical_2) / (2.0 * horizontal)


# ------------------------------- MAIN -------------------------------- #
def main():
    generate_alarm_wav(ALARM_WAV_PATH)
    if AUDIO_BACKEND is None:
        print("No audio library found (simpleaudio / playsound). "
              "Falling back to terminal beep. "
              "Install one for a real alarm sound: pip install simpleaudio")

    alarm = AlarmPlayer(ALARM_WAV_PATH)

    mp_face_mesh = mp.solutions.face_mesh
    face_mesh = mp_face_mesh.FaceMesh(
        max_num_faces=1,
        refine_landmarks=True,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )

    cap = cv2.VideoCapture(CAM_INDEX)
    if not cap.isOpened():
        raise RuntimeError(f"Could not open camera index {CAM_INDEX}")

    ear_history = []
    eyes_closed_since = None   # timestamp when continuous closure started
    alarm_active = False

    print("Drowsiness detection running. Press 'q' to quit.")

    while True:
        ok, frame = cap.read()
        if not ok:
            print("Camera frame not received, exiting.")
            break

        frame = cv2.flip(frame, 1)
        h, w = frame.shape[:2]
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = face_mesh.process(rgb)

        status_text = "No face detected"
        status_color = (0, 165, 255)

        if results.multi_face_landmarks:
            landmarks = results.multi_face_landmarks[0].landmark

            left_ear = eye_aspect_ratio(landmarks, LEFT_EYE, w, h)
            right_ear = eye_aspect_ratio(landmarks, RIGHT_EYE, w, h)
            raw_ear = (left_ear + right_ear) / 2.0

            ear_history.append(raw_ear)
            if len(ear_history) > EAR_CONSEC_SMOOTHING:
                ear_history.pop(0)
            avg_ear = sum(ear_history) / len(ear_history)

            if SHOW_MESH:
                for idx in LEFT_EYE + RIGHT_EYE:
                    lx, ly = int(landmarks[idx].x * w), int(landmarks[idx].y * h)
                    cv2.circle(frame, (lx, ly), 2, (0, 255, 0), -1)

            eyes_closed = avg_ear < EAR_THRESHOLD

            if eyes_closed:
                if eyes_closed_since is None:
                    eyes_closed_since = time.time()
                closed_duration = time.time() - eyes_closed_since

                if closed_duration >= CLOSED_EYE_ALARM_SECONDS:
                    status_text = f"DROWSINESS ALERT! Eyes closed {closed_duration:.1f}s"
                    status_color = (0, 0, 255)
                    if not alarm_active:
                        alarm.start()
                        alarm_active = True
                else:
                    status_text = f"Eyes closed {closed_duration:.1f}s / {CLOSED_EYE_ALARM_SECONDS:.0f}s"
                    status_color = (0, 255, 255)
            else:
                eyes_closed_since = None
                if alarm_active:
                    alarm.stop()
                    alarm_active = False
                status_text = "Eyes open - Alert"
                status_color = (0, 255, 0)

            cv2.putText(frame, f"EAR: {avg_ear:.3f}", (20, 70),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        else:
            eyes_closed_since = None
            if alarm_active:
                alarm.stop()
                alarm_active = False

        cv2.putText(frame, status_text, (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, status_color, 2)

        cv2.imshow("Driver Drowsiness Detection", frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    alarm.stop()
    cap.release()
    cv2.destroyAllWindows()
    face_mesh.close()


if __name__ == "__main__":
    main()
