import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const usePost = (method = 'post') => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [data, setData] = useState();

  const handlePost = async (url, postData) => {
    setIsLoading(true);
    try {
      const res = await axiosInstance[method](url, postData);
      setData(res);
      return res;
    } catch (error) {
      setFetchError(error?.message);
      return error;
    } finally {
      setIsLoading(false);
    }
  };

  return { handlePost, data, isLoading, fetchError };
};

export default usePost;
