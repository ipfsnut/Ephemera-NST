import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EventButton from './components/EventButton';
import EventDisplay from './components/EventDisplay';
import { fetchEvent } from './redux/eventSlice';
import './components/App.css';

const App = () => {
  const dispatch = useDispatch();
  const { currentEvent, status, error } = useSelector(state => state.event);

  const handleEventClick = (eventId) => {
    dispatch(fetchEvent(eventId));
  };

  return (
    <div className="app">
      <header className="app-header">
      <h1>Ephemeral Observer</h1>
      <nav>
        <EventButton id="1" label="About" onClick={() => handleEventClick('1')} />
        <EventButton id="2" label="Experiment List" onClick={() => handleEventClick('2')} />
        <EventButton id="3" label="Literature" onClick={() => handleEventClick('3')} />
      </nav>
      </header>
      <main>
      {status === 'loading' && <div>Loading...</div>}
      {status === 'failed' && <div>Error: {error}</div>}
      {status === 'succeeded' && <EventDisplay event={currentEvent} />}
      </main>
    </div>
  );
};

export default App;
