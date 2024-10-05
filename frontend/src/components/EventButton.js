
import React from 'react';

const EventButton = ({ id, onClick }) => (
  <button onClick={onClick}>Event {id}</button>
);

export default EventButton;
