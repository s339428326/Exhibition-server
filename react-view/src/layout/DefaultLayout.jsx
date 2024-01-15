import { useContext, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SideBar from '../components/SideBar';

import { ReducerContext } from '@/context/ReducerProvider';
import { departmentAction } from '@/reducers/departmentReducer';
import { workerAction } from '@/reducers/workerReducer';

import useFetch from '@/hooks/useFetch';

const DefaultLayout = () => {
  const [state, dispatch] = useContext(ReducerContext);
  const { pathname } = useLocation();

  const {
    data: workerData,
    isLoading: workerLoad,
    fetchError: workerError,
  } = useFetch(
    'get',
    '/api/v1/worker',
    undefined,
    (pathname === '/workers/account/department' ||
      pathname === '/workers/account/worker') &&
      pathname
  );

  const {
    data: departmentData,
    isLoading: departmentLoad,
    fetchError: departmentError,
  } = useFetch(
    'get',
    '/api/v1/department',
    undefined,
    (pathname === '/workers/account/department' ||
      pathname === '/workers/account/worker') &&
      pathname
  );

  useEffect(() => {
    dispatch({
      type: departmentAction.INIT,
      payload: departmentData?.departmentData,
    });
    dispatch({ type: workerAction.INIT, payload: workerData?.data });
  }, [departmentData, workerData]);

  //<span className="loading loading-ring loading-lg"></span>
  return (
    <main className="flex">
      <SideBar />
      <Outlet />
    </main>
  );
};

export default DefaultLayout;
