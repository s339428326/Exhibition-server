import { Route, Routes } from 'react-router-dom';
import {
  Login,
  Register,
  ExhibitionDataBoard,
  ExhibitionControlPanel,
  NewPartnerAccount,
  PartnerControlPanel,
  PlatformEmail,
  PlatformMessage,
  WorkersAccount,
  NewWorkerAccount,
} from './pages/index';
import DefaultLayout from './layout/DefaultLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* 展覽 */}
      <Route path="/exhibition" element={<DefaultLayout />}>
        {/* 展覽統計 */}
        <Route index path="databoard" element={<ExhibitionDataBoard />} />
        {/* 展覽管理 */}
        <Route path="control-panel" element={<ExhibitionControlPanel />} />
      </Route>
      {/* 合作夥伴 */}
      <Route path="/partner" element={<DefaultLayout />}>
        {/* 夥伴帳戶管理 */}
        <Route index path="account" element={<PartnerControlPanel />} />
        {/* 夥伴帳戶申請 */}
        <Route path="apply" element={<NewPartnerAccount />} />
      </Route>

      {/* 平台 */}
      <Route path="/platform" element={<DefaultLayout />}>
        {/* 平台信件 */}
        <Route index path="email" element={<PlatformEmail />} />
        {/* 平台通知 */}
        <Route path="message" element={<PlatformMessage />} />
      </Route>

      {/* 公司 */}
      <Route path="/workers" element={<DefaultLayout />}>
        {/* 公司帳戶管理 */}
        <Route index path="account" element={<WorkersAccount />} />
        {/* 公司帳戶申請 */}
        <Route path="apply" element={<NewWorkerAccount />} />
      </Route>
    </Routes>
  );
}

export default App;
