import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../services/api';

const About = () => {
  const [aboutContent, setAboutContent] = useState('');
  const currentExperiment = useSelector(state => state.globalState.currentExperiment);

  useEffect(() => {
    if (currentExperiment) {
      api.get(`/api/events/experiments/${currentExperiment._id}/about`)
        .then(response => setAboutContent(response.data.about))
        .catch(error => console.error('Error fetching about info:', error));
    }
  }, [currentExperiment]);

  return (
    <div className="about-container">
      <h2>About {currentExperiment?.name}</h2>
      <div dangerouslySetInnerHTML={{ __html: aboutContent }} />
    </div>
  );
};

export default About;