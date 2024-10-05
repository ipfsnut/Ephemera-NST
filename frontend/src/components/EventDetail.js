import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchEventById, deleteEvent } from '../eventSlice';

const EventDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const event = useSelector(state => state.events.currentEvent);

  useEffect(() => {
    dispatch(fetchEventById(id));
  }, [dispatch, id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  const handleDelete = () => {
    dispatch(deleteEvent(id));
    // Redirect to home page after deletion
    // You might want to use react-router's history object for this
  };

  return (
    <div>
      <h2>{event.title}</h2>
      <p>{event.description}</p>
      <Link to={`/edit/${event.id}`}>Edit</Link>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default EventDetail;
