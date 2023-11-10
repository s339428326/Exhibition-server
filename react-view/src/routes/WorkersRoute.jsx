import { Route, Routes } from 'react-router-dom';
import DefaultLayout from '../layout/DefaultLayout';
import { WorkersAccount, NewWorkerAccount } from '../pages/index';

const WorkersRoute = () => (
  <Routes>
    <Route element={<DefaultLayout />}>
      {/* 公司帳戶管理 */}
      <Route index path="account" element={<WorkersAccount />} />
      {/* 公司帳戶申請 */}
      <Route path="apply" element={<NewWorkerAccount />} />
    </Route>
  </Routes>
);

export default WorkersRoute;
