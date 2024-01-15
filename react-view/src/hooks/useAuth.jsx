import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthProvider';
import useFetch from '@/hooks/useFetch';

const useAuth = () => {
  const { authData, setAuthData } = useContext(AuthContext);
  const navigator = useNavigate();

  const {
    data, //fetchAuthData
    fetchError,
    isLoading,
  } = useFetch('get', '/api/v1/worker/auth');

  useEffect(() => {
    if (fetchError) {
      console.log(fetchError);
      return navigator('/');
    }

    if (data) {
      setAuthData({ ...data.user });
    }
  }, [isLoading]);

  return { data, fetchError, isLoading };
};

export default useAuth;
