import React from 'react';

const Pricing = () => {
    const plans = [
        {
            title: 'Explorer',
            price: '$99/month',
            features: [
                'Feature 1',
                'Feature 2',
                'Feature 3'
            ]
        },
        {
            title: 'Professionnel',
            price: '$199/month',
            features: [
                'Feature 1',
                'Feature 2',
                'Feature 3',
                'Feature 4'
            ]
        },
        {
            title: 'Entreprise',
            price: '$299/month',
            features: [
                'Feature 1',
                'Feature 2',
                'Feature 3',
                'Feature 4',
                'Feature 5'
            ]
        },
        {
            title: 'Souveraine',
            price: '$499/month',
            features: [
                'Feature 1',
                'Feature 2',
                'Feature 3',
                'Feature 4',
                'Feature 5',
                'Feature 6'
            ]
        },
    ];

    return (
        <div className="pricing">
            {plans.map((plan) => (
                <div key={plan.title} className="pricing-plan">
                    <h2>{plan.title}</h2>
                    <p>{plan.price}</p>
                    <ul>
                        {plan.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Pricing;