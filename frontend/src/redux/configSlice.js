import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5069';

export const fetchConfig = createAsyncThunk(
  'config/fetchConfig',
  async (configId) => {
    const response = await axios.get(`${API_BASE_URL}/api/configs/${configId}`, {
      withCredentials: true
    });
    return response.data;
  }
);

export const saveConfig = createAsyncThunk(
  'config/saveConfig',
  async (configData) => {
    const response = await axios.post(`${API_BASE_URL}/api/configs`, configData, {
      withCredentials: true
    });
    return response.data;
  }
);

export const updateConfig = createAsyncThunk(
  'config/updateConfig',
  async ({ id, configData }) => {
    const response = await axios.put(`${API_BASE_URL}/api/configs/${id}`, configData, {
      withCredentials: true
    });
    return response.data;
  }
);

const configSlice = createSlice({
  name: 'config',
  initialState: {
    currentConfig: null,
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfig.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentConfig = action.payload;
      })
      .addCase(fetchConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(saveConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentConfig = action.payload;
      })
      .addCase(updateConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentConfig = action.payload;
      });
  },
});

export default configSlice.reducer;
