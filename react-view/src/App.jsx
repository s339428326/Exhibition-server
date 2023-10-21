import { Route, Routes } from 'react-router-dom';
import DefaultLayout from './layout/DefaultLayout';
import Test from './components/Test';
import Test2 from './components/Test2';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        {/* 
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='*' element={<NoMatch />} />
        */}
        <Route index element={<Test />} />
        <Route path="test2" element={<Test2 />} />
      </Route>
    </Routes>
  );
}

export default App;
