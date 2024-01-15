import { useState, useEffect } from 'react';

const useDebounce = (state, delay) => {
  const [debounceState, setDebounceState] = useState();
  useEffect(() => {
    const timerId = setTimeout(() => setDebounceState(state), delay);
    return () => clearTimeout(timerId);
  }, [state, delay]);
  return debounceState;
};

export default useDebounce;
