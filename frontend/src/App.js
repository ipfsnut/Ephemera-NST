import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import EventButton from './components/EventButton';
import EventDisplay from './components/EventDisplay';
import ExperimentList from './components/ExperimentList';
import AboutNST from './Experiments/NumberSwitchingTask/AboutNST';
import ExperimentScreen from './components/ExperimentScreen';
import ConfigScreen from './components/ConfigScreen';
import { fetchEvent } from './redux/eventSlice';



const App = () => {
  const dispatch = useDispatch();
  const { currentEvent, status, error, cachedEvents } = useSelector(state => state.event);

  const handleEventClick = useCallback((eventId) => {
    if (!cachedEvents[eventId]) {
      dispatch(fetchEvent(eventId));
    }
  }, [dispatch, cachedEvents]);
  console.log('Current event in App:', currentEvent);

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
        {console.log('Rendering decision in App:', { status, currentEventId: currentEvent?.id })}
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
  );};

export default App;
