import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvent } from '../redux/eventSlice';
import EventButton from './EventButton';
import { createSelector } from '@reduxjs/toolkit';

const selectCachedEvents = state => state.event.cachedEvents;

const selectCachedEventIds = createSelector(
  [selectCachedEvents],
  (cachedEvents) => Object.keys(cachedEvents)
);

const ExperimentList = () => {
  const dispatch = useDispatch();
  const cachedEventIds = useSelector(selectCachedEventIds);

  const handleStartExperiment = useCallback((eventId) => {
    if (!cachedEventIds.includes(eventId)) {
      dispatch(fetchEvent(eventId));
    } else {
      // Optionally, you can add logic here to handle already cached events
      console.log(`Event ${eventId} is already cached`);
    }
  }, [dispatch, cachedEventIds]);
  return (
    <div className="experiment-list">
      <h2>Available Experiments</h2>
      <ul>
        <li>
          <h3 className="experiment-title">Number Switching Task</h3>
          <div className="button-group">
            <EventButton id="aboutNST" onClick={() => handleStartExperiment('aboutNST')} label="About" />
            <EventButton id="config" onClick={() => handleStartExperiment('config')} label="Custom Experiment" />
            <EventButton id="nst" onClick={() => handleStartExperiment('nst')} label="Standard Experiment" />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default React.memo(ExperimentList);
