import { useState, useEffect, useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SideBar from '../components/SideBar';
import { AuthContext } from '../context/AuthProvider';

import useFetch from '../hooks/useFetch';

const DefaultLayout = () => {
  const { authData, setAuthData } = useContext(AuthContext);
  const [isShow, setIsShow] = useState(true);
  const navigate = useNavigate();

  const {
    data: fetchAuthData,
    fetchError,
    isLoading,
  } = useFetch('get', '/api/v1/worker/auth');

  useEffect(() => {
    if (fetchError) {
      console.log(fetchError);
      return navigate('/');
    }

    if (fetchAuthData) {
      setAuthData({ authData, ...fetchAuthData.user });
    }
  }, [isLoading]);

  return (
    <>
      {authData ? (
        <main className="flex">
          <SideBar isShow={isShow} setIsShow={setIsShow} />
          <Outlet context={{ isShow, setIsShow }} />
        </main>
      ) : (
        <span className="loading loading-ring loading-lg"></span>
      )}
    </>
  );
};

export default DefaultLayout;
