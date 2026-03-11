import React from 'react';

const SEOAuditPage = () => {
    return (
        <div>
            <h1>Free SEO Audit Tool</h1>
            <p>Welcome to our SEO audit page! Use our free tool to analyze your website's SEO performance.</p>
            <form>
                <label htmlFor="url">Enter your website URL:</label>
                <input type="url" id="url" name="url" required />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default SEOAuditPage;