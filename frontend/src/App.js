import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EventButton from './components/EventButton';
import EventDisplay from './components/EventDisplay';
import { fetchEvent } from './redux/eventSlice';

const App = () => {
  const dispatch = useDispatch();
  const { currentEvent, status, error } = useSelector(state => state.event);

  const handleEventClick = (eventId) => {
    dispatch(fetchEvent(eventId));
  };

  return (
    <div>
      <h1>Ephemeral Observer</h1>
      <div>
        <EventButton id="1" onClick={() => handleEventClick('1')} />
        <EventButton id="2" onClick={() => handleEventClick('2')} />
        <EventButton id="3" onClick={() => handleEventClick('3')} />
      </div>
      {status === 'loading' && <div>Loading...</div>}
      {status === 'failed' && <div>Error: {error}</div>}
      {status === 'succeeded' && <EventDisplay event={currentEvent} />}
    </div>
  );
};

export default App;
