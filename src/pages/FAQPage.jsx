import React, { useState } from 'react';
import './FAQPage.css';

const FAQPage = () => {
    const [expanded, setExpanded] = useState(null);

    const faqs = [
        { question: 'What is Nexus SEO?', answer: 'Nexus SEO refers to the optimization techniques specifically designed for platforms and technologies associated with Nexus systems.' },
        { question: 'How can I improve my Nexus SEO?', answer: 'Improving Nexus SEO involves keyword optimization, content creation, and technical SEO tailored for Nexus platforms.' },
        { question: 'Is Nexus SEO different from regular SEO?', answer: 'Yes, Nexus SEO focuses on specific parameters and guidelines set by Nexus frameworks, making it distinct from general SEO practices.' },
        { question: 'What tools are recommended for Nexus SEO?', answer: 'Tools such as Google Analytics, SEMrush, and Nexus-specific plugins can help optimize your SEO for Nexus platforms.' },
    ];

    const toggleAccordion = (index) => {
        setExpanded(expanded === index ? null : index);
    };

    return (
        <div className="faq-container">
            <h1>Frequently Asked Questions</h1>
            {faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                    <div className="faq-question" onClick={() => toggleAccordion(index)}>
                        {faq.question}
                        <span>{expanded === index ? '-' : '+'}</span>
                    </div>
                    {expanded === index && <div className="faq-answer">{faq.answer}</div>}
                </div>
            ))}
        </div>
    );
};

export default FAQPage;
