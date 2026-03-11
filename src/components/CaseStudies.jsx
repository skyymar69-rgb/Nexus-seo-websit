import React from 'react';

const CaseStudies = () => {
    const studies = [
        { title: "E-commerce Fashion", description: "A detailed case study on effective strategies in the fashion e-commerce space." },
        { title: "SaaS B2B", description: "Insights into successful business-to-business software as a service models." },
        { title: "Cabinet Juridique", description: "An overview of legal cabinet operations and client engagement strategies." }
    ];

    return (
        <div>
            <h1>Case Studies</h1>
            {studies.map((study, index) => (
                <div key={index}>
                    <h2>{study.title}</h2>
                    <p>{study.description}</p>
                </div>
            ))}
        </div>
    );
};

export default CaseStudies;