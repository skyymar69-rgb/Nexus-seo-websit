import React from 'react';

const Footer = () => {
    return (
        <footer>
            <div>
                <h2>Company Links</h2>
                <ul>
                    <li><a href="/about">About Us</a></li>
                    <li><a href="/services">Services</a></li>
                    <li><a href="/contact">Contact</a></li>
                </ul>
            </div>
            <div>
                <h2>Social Media</h2>
                <ul>
                    <li><a href="https://facebook.com">Facebook</a></li>
                    <li><a href="https://twitter.com">Twitter</a></li>
                    <li><a href="https://instagram.com">Instagram</a></li>
                </ul>
            </div>
            <div>
                <p>&copy; {new Date().getFullYear()} Skyymar69, All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
