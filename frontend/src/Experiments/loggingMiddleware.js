export const loggingMiddleware = store => next => action => {
  if (action && typeof action === 'object') {
    console.log('Dispatching action:', action.type);
  } else {
    console.log('Dispatching action:', action);
  }
  return next(action);
};
  export default loggingMiddleware;