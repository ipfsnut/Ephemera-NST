import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EventButton from './components/EventButton';
import EventDisplay from './components/EventDisplay';
import ExperimentList from './components/ExperimentList';
import AboutNST from './Experiments/AboutNST.js';
import { fetchEvent } from './redux/eventSlice';
import './components/App.css';
import ExperimentScreen from './components/ExperimentScreen';


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
          <EventButton id="4" label="Start Experiment" onClick={() => handleEventClick('4')} />
        </nav>
      </header>
      <main>
        {status === 'loading' && <div>Loading...</div>}
        {status === 'failed' && <div>Error: {error}</div>}
        {status === 'succeeded' && (
          currentEvent.id === '2' ? (
            <ExperimentList />
          ) : currentEvent.id === '1' ? (
            <AboutNST />
          ) : currentEvent.id === '4' ? (
            <ExperimentScreen />
          ) : (
            <EventDisplay event={currentEvent} />
          )
        )}
      </main>
    </div>
  );
};

export default App;

