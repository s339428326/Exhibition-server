import { Route, Routes } from 'react-router-dom';
import { ForgetPassword, Login } from './pages';
import DefaultLayout from './layout/DefaultLayout';

import {
  ExhibitionRoute,
  WorkersRoute,
  PartnerRoute,
  PlatformRoute,
} from './routes';

// Test
import Test from '@/pages/Test';

function App() {
  return (
    <Routes>
      <Route path="/test" element={<Test />} />
      <Route path="/" element={<Login />} />
      <Route path="/forgetPassword" element={<ForgetPassword />} />
      {/* Testing */}
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
