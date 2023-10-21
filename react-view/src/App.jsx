import { useEffect, useState } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
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
    <>
      <div>
        <p>{JSON.stringify(fetchData, null, 2)}</p>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Express + React</h1>
    </>
  );
}

export default App;
