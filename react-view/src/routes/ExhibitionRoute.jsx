import { Route, Routes } from 'react-router-dom';
import { ExhibitionDataBoard, ExhibitionControlPanel } from '../pages/index';

const ExhibitionRoute = () => (
  <Routes>
    <Route>
      {/* 展覽統計 */}
      <Route index path="databoard" element={<ExhibitionDataBoard />} />
      {/* 展覽管理 */}
      <Route path="control-panel" element={<ExhibitionControlPanel />} />
    </Route>
  </Routes>
);

export default ExhibitionRoute;
