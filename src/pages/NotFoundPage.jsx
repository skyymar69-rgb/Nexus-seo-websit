import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div>
            <Header />
            <main>
                <h1>404: Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
                <Link to="/">Return to Home</Link>
            </main>
            <Footer />
        </div>
    );
};

export default NotFoundPage;