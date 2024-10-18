import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvent, generateExperiment } from '../redux/eventSlice';

const EventDetail = ({ id }) => {
  const dispatch = useDispatch();
  const event = useSelector(state => state.event.currentEvent);
  const status = useSelector(state => state.event.status);

  useEffect(() => {
    console.log('useEffect triggered. Status:', status, 'Event:', event);
    if (status === 'idle' && !event) {
      console.log('Dispatching fetchEvent');
      dispatch(fetchEvent(id));
    }
  }, [status, dispatch, id, event]);

  const handleGenerateExperiment = () => {
    const currentConfig = {}; // Fill with actual config
    dispatch(generateExperiment(currentConfig));
  };

  console.log('Rendering EventDetail. Status:', status, 'Event:', event);

  if (status === 'loading') return <div>Loading...</div>;
  if (!event) return <div>No event found</div>;

  return (
    <div>
      <h1>{event.name}</h1>
      <p>{event.description}</p>
      {event.trials ? (
        <div>
          {/* Display trials */}
        </div>
      ) : (
        <button onClick={handleGenerateExperiment}>Generate Experiment</button>
      )}
    </div>
  );
};
export default EventDetail;