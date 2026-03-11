import React from 'react';
import PropTypes from 'prop-types';

const testimonials = [
    { id: 1, name: 'John Doe', rating: 5, image: 'path/to/avatar1.jpg', comment: 'Excellent service! Highly recommended.' },
    { id: 2, name: 'Jane Smith', rating: 4, image: 'path/to/avatar2.jpg', comment: 'Very satisfied with my experience.' },
    { id: 3, name: 'Alice Johnson', rating: 3, image: 'path/to/avatar3.jpg', comment: 'Good service, but there’s room for improvement.' },
];

const Testimonial = ({ name, rating, image, comment }) => {
    return (
        <div className="testimonial">
            <img src={image} alt={`${name}'s avatar`} className="avatar" />
            <h3>{name}</h3>
            <p>Rating: {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</p>
            <p>{comment}</p>
        </div>
    );
};

const Testimonials = () => {
    return (
        <div className="testimonials">
            <h2>Client Testimonials</h2>
            {testimonials.map(testimonial => (
                <Testimonial key={testimonial.id} {...testimonial} />
            ))}
        </div>
    );
};

export default Testimonials;