import { Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import { WorkersAccount } from '../pages/index';
import DepartmentPanel from '@/pages/workers/DepartmentPanel';
import WorkerPanel from '@/pages/workers/WorkerPanel';

//old Features
import NewWorkerPDF from '@/pages/workers/NewWorkerPDF';

const WorkersRoute = () => {
  //modal show state
  const [show, setIsShow] = useState(false);
  //change modal components
  const [modalTitle, setModalTitle] = useState('');
  //department modal content using departmentId call API view data
  const [departmentId, setDepartmentId] = useState();
  // worker modal content using workerId call API view data
  const [workerId, setWorkerId] = useState();
  //WorkerPanel List view data (delete target)
  const [workerList, setWorkerList] = useState([]);
  //DepartmentPanel List view data
  const [departmentList, setDepartmentList] = useState([]);
  //newWorker data state
  const [workerData, setWorkerData] = useState([]);

  return (
    <Routes>
      <Route
        path="workerForm/:id"
        element={<NewWorkerPDF workerData={workerData} />}
      />

      <Route
        path="account"
        element={
          <WorkersAccount
            workerId={workerId}
            workerList={workerList}
            setWorkerList={setWorkerList}
            workerData={workerData}
            setWorkerData={setWorkerData}
            departmentId={departmentId}
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
              setDepartmentId={setDepartmentId}
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
              show={show}
              setIsShow={setIsShow}
              workerId={workerId}
              setWorkerId={setWorkerId}
              setModalTitle={setModalTitle}
              workerList={workerList}
              setWorkerList={setWorkerList}
            />
          }
        />
      </Route>
    </Routes>
  );
};

export default WorkersRoute;
