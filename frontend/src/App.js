import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAppState, setCurrentView } from './redux/globalState';
import ExperimentList from './components/ExperimentList';
import ExperimentScreen from './components/ExperimentScreen';
import About from './components/About';
import ConfigScreen from './components/ConfigScreen';



function App() {
  const dispatch = useDispatch();
  const { appState, currentView, currentExperiment } = useSelector(state => state.globalState);

  useEffect(() => {
    dispatch(setAppState('READY'));
  }, [dispatch]);

  const renderContent = () => {
    switch (currentView) {
      case 'HOME':
        return (
          <div>
            <h2>Welcome to Ephemera-NST</h2>
            <p>Select an experiment from the Experiment List to begin.</p>
          </div>
        );
      case 'ABOUT':
        return <About />;
      case 'EXPERIMENT_LIST':
        return <ExperimentList />;
                  case 'EXPERIMENT':
                    console.log('App: Current experiment before rendering ExperimentScreen:', currentExperiment);
                    return <ExperimentScreen experiment={currentExperiment} />;
          case 'CONFIG':
            return <ConfigScreen />;
      default:
        return <div>Invalid view</div>;
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Ephemera-NST</h1>
        <nav>
          <button onClick={() => dispatch(setCurrentView('HOME'))}>Home</button>
          <button onClick={() => dispatch(setCurrentView('ABOUT'))}>About</button>
          <button onClick={() => dispatch(setCurrentView('EXPERIMENT_LIST'))}>Experiment List</button>
        </nav>
      </header>
      {appState === 'INITIALIZING' ? (
        <div>Loading...</div>
      ) : (
        renderContent()
      )}
    </div>
  );
}export default App;