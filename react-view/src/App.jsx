import { Route, Routes } from 'react-router-dom';
import { Register, Login } from './pages';
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
      <Route path="/register" element={<Register />} />
      <Route path="/exhibition/*" element={<ExhibitionRoute />} />
      <Route path="/partner/*" element={<PartnerRoute />} />
      <Route path="/platform/*" element={<PlatformRoute />} />
      <Route path="/workers/*" element={<WorkersRoute />} />
    </Routes>
  );
}

export default App;
