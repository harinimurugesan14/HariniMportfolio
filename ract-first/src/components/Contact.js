import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <div className="contact">
      <div className="contact-container">
        <div className="contact-image">
          <img src="/images/contact-support.jpg" alt="Customer Support" />
        </div>
        <div className="contact-content">
          <h1>Get in Touch</h1>
          <div className="contact-info">
            <div className="contact-item">
              <div className="icon">📧</div>
              <div className="details">
                <h3>Email Us</h3>
                <p>support@mobileappstore.com</p>
                <p className="availability">24/7 Support Available</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="icon">📞</div>
              <div className="details">
                <h3>Call Us</h3>
                <p>+1 (555) 123-4567</p>
                <p className="availability">Mon-Fri: 9AM - 6PM EST</p>
              </div>
            </div>
            <div className="contact-item">
              <div className="icon">💬</div>
              <div className="details">
                <h3>Live Chat</h3>
                <p>Chat with our support team</p>
                <button className="chat-btn">Start Chat</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
