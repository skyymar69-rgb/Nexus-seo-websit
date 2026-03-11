import React, { useState } from 'react';

const NewsletterPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        // Handle the subscription logic here, e.g., API call
        setMessage(`Thanks for subscribing with ${email}!`);
        setEmail('');
    };

    return (
        <div>
            <h1>Subscribe to our Newsletter</h1>
            <form onSubmit={handleSubscribe}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Subscribe</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default NewsletterPage;