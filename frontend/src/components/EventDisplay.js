import React from 'react';

const EventDisplay = ({ event }) => {
  if (!event) {
    return <div>No event selected</div>;
  }

  return (
    <div>
      <h2>{event.name}</h2>
      <p>{event.description}</p>
    </div>
  );
};

export default EventDisplay;

