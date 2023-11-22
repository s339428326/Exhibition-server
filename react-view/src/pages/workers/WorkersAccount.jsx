import useAuth from '@/hooks/useAuth';
import { NavLink, Outlet } from 'react-router-dom';
import Modal from '@/components/Modal/Modal';
import NewDepartmentForm from './NewDepartmentForm';
import NewWorkerForm from './NewWorkerForm';
import DepartmentModal from './DepartmentModal';
import WorkerModal from './WorkerModal';

const WorkersAccount = ({ modalTitle, departmentData }) => {
  useAuth();

  //新增員工表單傳送
  const newWorkerSubmit = (data) => {
    console.log('newWorkerSubmit', data);
  };

  //新增部門表單傳送
  const departmentSubmit = (data) => {
    console.log('departmentSubmit', data);
  };

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
      <Modal modalId="worker-modal">
        <h2 className="text-xl font-medium mb-4">{modalTitle}</h2>
        {/*  新增員工 Modal  content*/}
        {modalTitle === '新增員工' && (
          <NewWorkerForm onSubmit={newWorkerSubmit} />
        )}
        {/*  員工詳細資訊  */}
        {modalTitle === '員工資料' && <WorkerModal />}
        {/* 新增部門 Modal  content */}
        {modalTitle === '新增部門' && (
          <NewDepartmentForm onSubmit={departmentSubmit} />
        )}
        {/* 查看部門詳細資訊 */}
        {modalTitle === '部門詳細資訊' && (
          <DepartmentModal data={departmentData} />
        )}
      </Modal>
      {/* outlet component:DepartmentPanel, WorkerPanel  */}
      <Outlet />
    </div>
  );
};

export default WorkersAccount;
