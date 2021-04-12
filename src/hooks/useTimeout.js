import { useCallback, useEffect, useRef } from 'react';

const useTimeout = (callback, delay, running = true) => {
    // save id in a ref so we make sure we're always clearing the latest timeout
    const timeoutId = useRef('');
  
    // save callback as a ref so we can update the timeout callback without resetting it
    const savedCallback = useRef();
    useEffect(
      () => {
        savedCallback.current = callback;
      },
      [callback]
    );
  
    // clear the timeout and start a new one, updating the timeoutId ref
    const reset = useCallback(
      () => {
        clearTimeout(timeoutId.current);
  
        const id = setTimeout(savedCallback.current, delay);
        timeoutId.current = id;
      },
      [delay]
    );
  
    // keep the timeout dynamic by resetting it whenever its' deps change
    useEffect(
      () => {
        if (running && delay !== null) {
          reset();
  
          return () => clearTimeout(timeoutId.current);
        }
      },
      [delay, running, reset]
    );
  
    return { reset };
  };

export default useTimeout