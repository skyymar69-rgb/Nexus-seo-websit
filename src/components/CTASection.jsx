import React from 'react';
import './CTASection.css';

const CTASection = () => {
    return (
        <div className="cta-section">
            <h2>Join Our Community</h2>
            <p>Stay updated with our latest news and offers!</p>
            <div className="cta-buttons">
                <button className="cta-button">Get Started</button>
                <button className="cta-button">Learn More</button>
            </div>
            <div className="newsletter-signup">
                <input type="email" placeholder="Enter your email" />
                <button className="signup-button">Subscribe</button>
            </div>
        </div>
    );
};

export default CTASection;