import React from 'react';

const EventButton = ({ id, onClick, label }) => (
  <button onClick={onClick}>{label || `Event ${id}`}</button>
);

export default EventButton;
