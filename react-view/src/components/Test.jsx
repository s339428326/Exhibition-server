import axios from 'axios';
import { useEffect, useState } from 'react';

const Test = () => {
  const [fetchData, setFetchData] = useState();

  const getData = async () => {
    try {
      const res = await axios.get('/api/v1/start');
      setFetchData(res.data);
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      Test
      <p>{fetchData}</p>
    </div>
  );
};

export default Test;
