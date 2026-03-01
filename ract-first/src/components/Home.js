import React from 'react';
import './Home.css';

function Home() {
  const featuredApps = [
    {
      id: 1,
      name: 'Social Connect',
      image: '/images/social-app.jpg',
      description: 'Stay connected with friends and family'
    },
    {
      id: 2,
      name: 'Fitness Tracker',
      image: '/images/fitness-app.jpg',
      description: 'Track your workouts and health goals'
    },
    {
      id: 3,
      name: 'Photo Editor Pro',
      image: '/images/photo-app.jpg',
      description: 'Professional photo editing tools'
    },
    {
      id: 4,
      name: 'Weather Forecast',
      image: '/images/weather-app.jpg',
      description: 'Real-time weather updates'
    }
  ];

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to Mobile App Store</h1>
        <p className="hero-description">Your one-stop destination for all your mobile application needs.</p>
      </div>
      
      <div className="featured-apps">
        <h2>Featured Apps</h2>
        <div className="app-grid">
          {featuredApps.map(app => (
            <div key={app.id} className="app-card">
              <div className="app-image-container">
                <img src={app.image} alt={app.name} className="app-image" />
              </div>
              <h3>{app.name}</h3>
              <p>{app.description}</p>
              <button className="download-btn">Download Now</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
