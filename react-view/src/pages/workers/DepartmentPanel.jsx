import ModalBtn from '@/components/Modal/ModalBtn';

const DepartmentPanel = ({
  setModalTitle,
  setModalContent,
  departmentList,
  setDepartmentList,
}) => {
  //modalController
  const modalController = (title) => setModalTitle(title);
  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <h2 className="text-xxl font-bold">部門列表</h2>
        <ModalBtn
          className="btn btn-sm"
          modalId="worker-modal"
          onClick={() => modalController('新增部門')}
        >
          + New
        </ModalBtn>
      </div>
      <div className="flex gap-2 items-center">
        <input
          className="input input-bordered w-full max-w-xs mb-4 h-10"
          placeholder="搜尋部門"
          type="text"
        />
        {/* useDebounce */}
        <span className="text-sm">搜索關鍵字：</span>
      </div>
      {/* Data Table View */}
      <div className="grid grid-cols-3 mb-4">
        <div className="col text-center p-3 border-b">部門</div>
        <div className="col text-center p-3 border-b">人數</div>
        <div className="col text-center p-3 border-b"></div>
        {/* 標示head */}
        {/* Table Items  Example */}
        <>
          <div className="col text-center p-3 border-b">人資</div>
          <div className="col text-center p-3 border-b">0/50</div>
          <div className="col text-center p-3 border-b">
            <ModalBtn
              className={'btn btn-sm'}
              onClick={() => {
                modalController('部門詳細資訊');
                setModalContent('1');
              }}
              modalId={'worker-modal'}
            >
              詳細資訊
            </ModalBtn>
          </div>
        </>
      </div>
    </>
  );
};

export default DepartmentPanel;
