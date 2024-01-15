import { createContext, useEffect, useReducer, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import useFetch from '@/hooks/useFetch';
import reducers from '@/reducers/index';
import { workerAction } from '@/reducers/workerReducer';
import { departmentAction } from '@/reducers/departmentReducer';

export const ReducerContext = createContext();

const initState = reducers(); //直接invoke回傳, 當前default state

const ReducerProvider = ({ children }) => {
  const { pathname } = useLocation();
  const [state, dispatch] = useReducer(reducers, initState);

  useEffect(() => {
    if (pathname === '/' || pathname === '/forgetPassword') {
      dispatch({ type: workerAction.INIT });
      dispatch({ type: departmentAction.INIT });
      return;
    }
  }, [pathname]);

  return (
    <ReducerContext.Provider value={[state, dispatch]}>
      {children}
    </ReducerContext.Provider>
  );
};

export default ReducerProvider;
