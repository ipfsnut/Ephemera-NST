import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5069';

export const fetchEvent = createAsyncThunk(
  'event/fetchEvent',
  async (eventId) => {
    const response = await axios.get(`${API_BASE_URL}/api/events/${eventId}`, {
      withCredentials: true
    });
    return response.data;
  }
);
const eventSlice = createSlice({
  name: 'event',
  initialState: {
    currentEvent: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEvent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentEvent = action.payload;
      })
      .addCase(fetchEvent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default eventSlice.reducer;
