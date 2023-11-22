import { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const useFetch = (method = 'get', dataUrl, backData = null) => {
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  useEffect(() => {
    //用來確認當前元件的生命週期已經在Mounted階段
    let isMounted = true;
    if (import.meta.env?.VITE_ENV === 'DEV')
      console.time(`${dataUrl} 請求時間`);
    //用於取消當前請求 (token:標記清除請求, cancel:請除Fn)
    const { token, cancel } = axios.CancelToken.source();

    if (method.toLocaleLowerCase() === 'post' && !backData) return;

    (async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance?.[method](dataUrl, backData, {
          cancelToken: token,
        });
        if (isMounted) {
          setData(res.data);
          setFetchError(null);
        }
      } catch (error) {
        if (isMounted) {
          console.log('[Err]', error.response.data.message);
          setData(null);
          setFetchError(error.response.data.message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    const cleanUp = () => {
      if (import.meta.env?.VITE_ENV === 'DEV') {
        console.log(
          `[${import.meta.env?.VITE_ENV}] useFetch(${dataUrl}) clean up `
        );
      }

      isMounted = false;
      cancel();
    };

    if (import.meta.env?.VITE_ENV === 'DEV')
      console.timeEnd(`${dataUrl} 請求時間`);
    return cleanUp;
  }, [backData, dataUrl, method]);

  return { data, fetchError, isLoading };
};

export default useFetch;
