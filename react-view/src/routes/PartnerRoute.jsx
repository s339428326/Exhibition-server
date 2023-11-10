import { Route, Routes } from 'react-router-dom';
import { NewPartnerAccount, PartnerControlPanel } from '../pages/index';
import DefaultLayout from '../layout/DefaultLayout';

const PartnerRoute = () => (
  <Routes>
    <Route path="/" element={<DefaultLayout />}>
      {/* 夥伴帳戶管理 */}
      <Route index path="account" element={<PartnerControlPanel />} />
      {/* 夥伴帳戶申請 */}
      <Route path="apply" element={<NewPartnerAccount />} />
    </Route>
  </Routes>
);

export default PartnerRoute;
