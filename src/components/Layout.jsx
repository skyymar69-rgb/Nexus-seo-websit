import React from 'react';

const Layout = ({ children }) => {
    return (
        <div>
            <header>
                <h1>Nexus SEO Website</h1>
            </header>
            <main>
                {children}
            </main>
            <footer>
                <p>&copy; {new Date().getFullYear()} Nexus SEO</p>
            </footer>
        </div>
    );
};

export default Layout;