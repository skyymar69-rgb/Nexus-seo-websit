import React from 'react';
import { Zap, Brain, Target } from 'lucide-react';

const services = [
  { id: 1, icon: <Zap />, title: 'GEO', description: 'Global Environmental Operations' },
  { id: 2, icon: <Brain />, title: 'AEO', description: 'Advanced Engineering Operations' },
  { id: 3, icon: <Target />, title: 'LLMO', description: 'Localized Logistics Management Operations' }
];

const Services = () => {
  return (
    <div className='services-container'>
      {services.map(service => (
        <div key={service.id} className='service-card'>
          <div className='icon'>{service.icon}</div>
          <h3>{service.title}</h3>
          <p>{service.description}</p>
        </div>
      ))}
    </div>
  );
};

export default Services;