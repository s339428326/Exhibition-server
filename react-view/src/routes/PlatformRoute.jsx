import { Route, Routes } from 'react-router-dom';
import DefaultLayout from '../layout/DefaultLayout';
import { PlatformEmail, PlatformMessage } from '../pages/index';

const PlatformRoute = () => (
  <Routes>
    <Route>
      {/* 平台信件 */}
      <Route index path="email" element={<PlatformEmail />} />
      {/* 平台通知 */}
      <Route path="message" element={<PlatformMessage />} />
    </Route>
  </Routes>
);

export default PlatformRoute;
