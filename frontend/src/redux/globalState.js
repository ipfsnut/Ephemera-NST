import { createSlice } from '@reduxjs/toolkit';

// Initial state defines the structure of our global application state
const initialState = {
  appState: 'INITIALIZING', // Tracks the overall application state
  currentView: 'HOME', // Manages which view/route is currently active
  error: null, // Stores any global errors that occur
  currentExperiment: null, // Add this line to track the current experiment
};

const globalStateSlice = createSlice({
  name: 'globalState',
  initialState,
  reducers: {
    // Updates the overall application state
    // Used for transitions like INITIALIZING -> READY
    setAppState: (state, action) => {
      state.appState = action.payload;
    },
    // Updates the current view/route
    // Dispatched when navigating between different sections of the app
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    // Sets a global error
    // Used for capturing and displaying application-wide errors
    setError: (state, action) => {
      state.error = action.payload;
    },
    // Clears the global error
    // Called after error has been displayed and acknowledged
    clearError: (state) => {
      state.error = null;
    },
    setCurrentExperiment: (state, action) => {
      state.currentExperiment = action.payload;
    },
  },
});

// Export action creators for use in components and other slices
export const { 
  setAppState, 
  setCurrentView, 
  setError, 
  clearError, 
  setCurrentExperiment 
} = globalStateSlice.actions;

// Export the reducer to be combined in the root reducer
export default globalStateSlice.reducer;
