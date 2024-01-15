import { useEffect, useRef } from 'react';

const useOutSideClick = (cb) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        // console.log(e.target);
        cb();
      }
    };
    document.addEventListener('click', handleClick, true);

    return () => document.removeEventListener('click', handleClick, true);
  }, [ref]);

  return ref;
};

export default useOutSideClick;
