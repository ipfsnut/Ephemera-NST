import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAboutInfo } from '../redux/eventSlice';
import ReactMarkdown from 'react-markdown';

const About = () => {
  const [aboutContent, setAboutContent] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAboutInfo())
      .unwrap()
      .then((result) => setAboutContent(result.content))
      .catch((error) => console.error('Failed to fetch About info:', error));
  }, [dispatch]);

  return (
    <div className="about-container">
      <ReactMarkdown>{aboutContent}</ReactMarkdown>
    </div>
  );
};

export default About;
