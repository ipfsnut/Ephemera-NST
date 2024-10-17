import React from 'react';

const EventButton = React.memo(({ id, onClick, label }) => (
  <button onClick={onClick}>{label || `Event ${id}`}</button>
));

export default EventButton;
