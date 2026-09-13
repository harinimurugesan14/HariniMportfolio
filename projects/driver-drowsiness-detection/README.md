# Driver Drowsiness Detection — Eyes Closed ≥ 8 Seconds Alarm

Real-time webcam system that rings an alarm when the driver's eyes stay
closed continuously for **8 seconds or more**.

## How it works

1. **MediaPipe Face Mesh** locates 468 facial landmarks per frame, including
   precise points around each eye.
2. **Eye Aspect Ratio (EAR)** is computed from 6 landmark points per eye:
   `EAR = (‖p2-p6‖ + ‖p3-p5‖) / (2 × ‖p1-p4‖)`
   EAR drops sharply when the eyes close.
3. A short rolling average (3 frames) smooths out blink noise so a normal
   blink doesn't false-trigger the timer.
4. If EAR stays below the threshold (`0.21` by default) continuously, a timer
   starts. Once that timer reaches **8 seconds**, an alarm sound plays on a
   loop (in a background thread, so the video feed doesn't freeze) until the
   eyes reopen.

## Setup

```bash
pip install -r requirements.txt
python drowsiness_detection.py
```

Press `q` in the video window to quit.

The first run auto-generates `alarm.wav` (a synthesized pulsing tone) —
no external audio file needed.

## Tuning

Open `drowsiness_detection.py` and adjust the constants near the top:

| Constant | Purpose | Default |
|---|---|---|
| `CLOSED_EYE_ALARM_SECONDS` | How long eyes must stay closed before alarm | `8.0` |
| `EAR_THRESHOLD` | EAR value below which eyes count as "closed" | `0.21` |
| `EAR_CONSEC_SMOOTHING` | Frames averaged to reduce jitter/blink noise | `3` |
| `CAM_INDEX` | Which webcam to use | `0` |

If the alarm triggers too easily during normal blinking, lower
`EAR_THRESHOLD` slightly (e.g. `0.18`). If it misses genuinely closed eyes,
raise it (e.g. `0.23`). Calibrate by watching the on-screen `EAR:` value
with eyes open vs. closed and picking a midpoint.

## Troubleshooting

- **No sound plays**: install `simpleaudio` (`pip install simpleaudio`).
  Without it, the script falls back to a terminal beep.
- **Camera won't open**: try `CAM_INDEX = 1` if you have more than one
  camera device.
- **Face not detected**: ensure good lighting and that the face is roughly
  centered and unobstructed.

## Extending this into the fuller project (report scope)

This script covers the core real-time alarm requirement. For the full
project with the CNN+LSTM temporal model, YOLOv8 face detection, PERCLOS,
yawning detection, and multi-model comparison (RetinaFace/MTCNN/Dlib as
offline benchmarks), this EAR+MediaPipe module becomes the **feature
extraction front-end** — its EAR/eye-closure-duration values feed into the
CNN+LSTM classifier described earlier instead of (or alongside) the fixed
8-second rule-based threshold.
