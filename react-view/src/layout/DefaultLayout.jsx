import { Outlet } from 'react-router-dom';
import SideBar from '../components/SideBar';

const DefaultLayout = () => {
  //<span className="loading loading-ring loading-lg"></span>
  return (
    <main className="flex">
      <SideBar />
      <Outlet />
    </main>
  );
};

export default DefaultLayout;
