import { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const useFetch = (method = 'get', dataUrl, backData = null, path) => {
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    if (method.toLocaleLowerCase() === 'post' && !backData) return;

    (async () => {
      setIsLoading(true);
      if (import.meta.env?.VITE_ENV === 'DEV')
        console.time(`${dataUrl} 請求時間`);
      try {
        const res = await axiosInstance?.[method](dataUrl, backData);
        setData(res.data);
        setFetchError(null);
      } catch (error) {
        console.log('[Err]', error?.response.data.message);
        setData(null);
        setFetchError(error?.response.data.message);
      } finally {
        setIsLoading(false);
        if (import.meta.env?.VITE_ENV === 'DEV')
          console.timeEnd(`${dataUrl} 請求時間`);
      }
    })();
  }, [backData, dataUrl, method, path]);

  return { data, setData, fetchError, isLoading };
};

export default useFetch;
