import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../eventSlice';

const EventList = () => {
  const dispatch = useDispatch();
  const events = useSelector(state => state.events.list);
  const status = useSelector(state => state.events.status);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEvents());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Events</h2>
      {events.map(event => (
        <div key={event.id}>
          <Link to={`/event/${event.id}`}>{event.title}</Link>
        </div>
      ))}
    </div>
  );
};

export default EventList;
