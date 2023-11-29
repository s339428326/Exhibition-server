import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { WorkersAccount } from '../pages/index';
import DepartmentPanel from '@/pages/workers/DepartmentPanel';
import WorkerPanel from '@/pages/workers/WorkerPanel';

const WorkersRoute = () => {
  //modal show state
  const [show, setIsShow] = useState(false);
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
            setDepartmentList={setDepartmentList}
            modalTitle={modalTitle}
            show={show}
            setIsShow={setIsShow}
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
              show={show}
              setIsShow={setIsShow}
            />
          }
        />
        <Route
          path="worker"
          element={
            <WorkerPanel
              setModalTitle={setModalTitle}
              workerList={workerList}
              setWorkerList={setWorkerList}
              show={show}
              setIsShow={setIsShow}
            />
          }
        />
      </Route>
    </Routes>
  );
};

export default WorkersRoute;
