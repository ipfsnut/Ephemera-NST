import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EventButton from './components/EventButton';
import EventDisplay from './components/EventDisplay';
import ExperimentList from './components/ExperimentList';
import AboutNST from './Experiments/NumberSwitchingTask/AboutNST';
import { fetchEvent } from './redux/eventSlice';
import ExperimentScreen from './components/ExperimentScreen';
import ConfigScreen from './components/ConfigScreen';


const App = () => {
  const dispatch = useDispatch();
  const { currentEvent, status, error } = useSelector(state => state.event);

  const handleEventClick = (eventId) => {
    dispatch(fetchEvent(eventId));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Ephemera</h1>
        <nav>
          <EventButton id="about" label="About" onClick={() => handleEventClick('about')} />
          <EventButton id="experiment-list" label="Experiment List" onClick={() => handleEventClick('experiment-list')} />
          <EventButton id="literature" label="Literature" onClick={() => handleEventClick('literature')} />
        </nav>
      </header>
      <main>
        {status === 'loading' && <div>Loading...</div>}
        {status === 'failed' && <div>Error: {error}</div>}
        {status === 'succeeded' && (
          currentEvent.id === 'experiment-list' ? (
            <ExperimentList />
          ) : currentEvent.id === 'about' ? (
            <AboutNST />
          ) : currentEvent.id === 'nst' ? (
            <ExperimentScreen experimentType="NumberSwitchingTask" />
          ) : currentEvent.id === 'config' ? (
            <ConfigScreen />
          ) : (
            <EventDisplay event={currentEvent} />
          )
        )}
      </main>
    </div>
  );
};

export default App;

