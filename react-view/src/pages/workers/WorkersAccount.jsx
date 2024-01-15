import propTypes from 'prop-types';
import useAuth from '@/hooks/useAuth';
import { NavLink, Outlet } from 'react-router-dom';
import Modal from '@/components/Modal/Modal';
import NewDepartmentForm from './NewDepartmentForm';
import NewWorkerForm from './NewWorkerForm';
import DepartmentModal from './DepartmentModal';
import WorkerModal from './WorkerModal';
import { useEffect, useState } from 'react';

const WorkerPageModal = ({
  modalTitle,
  show,
  setIsShow,
  workerData,
  setWorkerData,
  workerId,
  setWorkerList,
  setDepartmentList,
  departmentId,
}) => {
  const modalContent = {
    新增員工: (
      <NewWorkerForm
        show={show}
        setIsShow={setIsShow}
        workerData={workerData}
        setWorkerData={setWorkerData}
      />
    ),
    員工資料: <WorkerModal workerId={workerId} setWorkerList={setWorkerList} />,
    新增部門: (
      <NewDepartmentForm
        setDepartmentList={setDepartmentList}
        show={show}
        setIsShow={setIsShow}
      />
    ),
    部門詳細資訊: (
      <DepartmentModal
        id={departmentId}
        show={show}
        setIsShow={setIsShow}
        setDepartmentList={setDepartmentList}
      />
    ),
  };

  return (
    <Modal modalId="worker-modal" setIsShow={setIsShow}>
      {/*  新增員工 Modal  content*/}
      {modalContent[modalTitle]}
    </Modal>
  );
};

const WorkersAccount = ({
  modalTitle,
  departmentId,
  departmentData,
  setWorkerList,
  workerId,
  setWorkerId,
  setDepartmentList,
  show,
  setIsShow,
  workerData,
  setWorkerData,
}) => {
  useAuth();

  return (
    <div className="container mx-auto px-4 pt-12">
      <h1 className="text-xl font-bold mb-4">員工帳戶管理</h1>
      <div className="tabs tabs-bordered mb-4">
        <NavLink
          to={'/workers/account/department'}
          className={({ isActive }) =>
            isActive ? 'tab tab-active border rounded' : 'tab'
          }
        >
          部門
        </NavLink>
        <NavLink
          to={'/workers/account/worker'}
          className={({ isActive }) =>
            isActive ? 'tab tab-active border rounded' : 'tab'
          }
        >
          員工
        </NavLink>
      </div>

      {/* Modal */}
      <WorkerPageModal
        modalTitle={modalTitle}
        departmentId={departmentId}
        departmentData={departmentData}
        setWorkerList={setWorkerList}
        workerId={workerId}
        setWorkerId={setWorkerId}
        setDepartmentList={setDepartmentList}
        show={show}
        setIsShow={setIsShow}
        workerData={workerData}
        setWorkerData={setWorkerData}
      />
      {/* outlet component:DepartmentPanel, WorkerPanel  */}
      <Outlet />
    </div>
  );
};

export default WorkersAccount;

WorkersAccount.propTypes = {
  modalTitle: propTypes.string,
  departmentId: propTypes.string,
  setDepartmentList: propTypes.func,
  show: propTypes.bool,
  setIsShow: propTypes.func,
};
