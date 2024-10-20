import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAppState, setCurrentView } from './redux/globalState';
import ExperimentList from './components/ExperimentList';
import NumberSwitchingTask from './Experiments/NumberSwitchingTask/NumberSwitchingTask';
import About from './components/About';

function App() {
  const dispatch = useDispatch();
  const { appState, currentView } = useSelector(state => state.globalState);

  useEffect(() => {
    dispatch(setAppState('READY'));
  }, [dispatch]);

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <div>
            <h1>Ephemera-NST</h1>
            <button onClick={() => dispatch(setCurrentView('ABOUT'))}>About</button>
            <button onClick={() => dispatch(setCurrentView('EXPERIMENT_LIST'))}>Experiment List</button>
          </div>
        );
      case 'ABOUT':
        return <About />;
      case 'EXPERIMENT_LIST':
        return <ExperimentList />;
      case 'NUMBER_SWITCHING_TASK':
        return <NumberSwitchingTask />;
      default:
        return <div>Invalid view</div>;
    }
  };

  return (
    <div className="App">
      {appState === 'INITIALIZING' ? (
        <div>Loading...</div>
      ) : (
        renderView()
      )}
    </div>
  );
}

export default App;