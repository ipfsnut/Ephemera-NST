const loggingMiddleware = store => next => action => {
    console.log('Dispatching action:', action.type);
    if (action.type.includes('fetchEvent')) {
      console.log('fetchEvent action details:', action);
    }
    return next(action);
  };
  
  export default loggingMiddleware;