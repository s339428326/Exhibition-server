import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { WorkersAccount } from '../pages/index';
import DepartmentPanel from '@/pages/workers/DepartmentPanel';
import WorkerPanel from '@/pages/workers/WorkerPanel';

const WorkersRoute = () => {
  //change modal components
  const [modalTitle, setModalTitle] = useState('');
  //department modal content view data
  const [departmentData, setDepartmentData] = useState();
  //WorkerPanel List view data
  const [workerList, setWorkerList] = useState([]);
  //DepartmentPanel List view data
  const [departmentList, setDepartmentList] = useState([]);

  return (
    <Routes>
      <Route
        path="account"
        element={
          <WorkersAccount
            departmentData={departmentData}
            modalTitle={modalTitle}
          />
        }
      >
        <Route
          index
          path="department"
          element={
            <DepartmentPanel
              setModalTitle={setModalTitle}
              setModalContent={setDepartmentData}
              departmentList={departmentList}
              setDepartmentList={setDepartmentList}
            />
          }
        />
        <Route
          path="worker"
          element={
            <WorkerPanel
              setModalTitle={setModalTitle}
              workerList={workerList}
              setWorkerList={workerList}
            />
          }
        />
      </Route>
    </Routes>
  );
};

export default WorkersRoute;
