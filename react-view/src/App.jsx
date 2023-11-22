import { Route, Routes } from 'react-router-dom';
import { ForgetPassword, Login } from './pages';
import DefaultLayout from './layout/DefaultLayout';

import {
  ExhibitionRoute,
  WorkersRoute,
  PartnerRoute,
  PlatformRoute,
} from './routes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/forgetPassword" element={<ForgetPassword />} />
      <Route element={<DefaultLayout />}>
        <Route path="/exhibition/*" element={<ExhibitionRoute />} />
        <Route path="/partner/*" element={<PartnerRoute />} />
        <Route path="/platform/*" element={<PlatformRoute />} />
        <Route path="/workers/*" element={<WorkersRoute />} />
      </Route>
    </Routes>
  );
}

export default App;
