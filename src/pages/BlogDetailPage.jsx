import React from 'react';
import PropTypes from 'prop-types';

const BlogDetailPage = ({ article, relatedArticles }) => {
    return (
        <div>
            <h1>{article.title}</h1>
            <p><strong>Author:</strong> {article.author}</p>
            <p><strong>Published on:</strong> {new Date(article.publicationDate).toLocaleDateString()}</p>
            <p><strong>Category:</strong> {article.category}</p>
            <p><strong>Read Time:</strong> {article.readTime} min</p>
            <div>
                <h2>Content</h2>
                <p>{article.content}</p>
            </div>
            <div>
                <h2>Related Articles</h2>
                <ul>
                    {relatedArticles.map((relatedArticle, index) => (
                        <li key={index}>{relatedArticle.title}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

BlogDetailPage.propTypes = {
    article: PropTypes.shape({
        title: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        publicationDate: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        readTime: PropTypes.number.isRequired,
        content: PropTypes.string.isRequired,
    }).isRequired,
    relatedArticles: PropTypes.arrayOf(PropTypes.shape({
        title: PropTypes.string.isRequired,
    })).isRequired,
};

export default BlogDetailPage;