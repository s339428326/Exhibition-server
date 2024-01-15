import { useEffect } from 'react';

const useKeyDown = (key, cb) => {
  useEffect(() => {
    const listEscKeyHandler = document.addEventListener('keydown', (e) => {
      if (e.key === key) {
        cb();
      }
    });
    return () => document.removeEventListener('keydown', listEscKeyHandler);
  }, []);
};

export default useKeyDown;
