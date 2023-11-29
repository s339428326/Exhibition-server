import ModalBtn from '@/components/Modal/ModalBtn';

const WorkerPanel = ({
  setModalTitle,
  workerList,
  setWorkerList,
  show,
  setIsShow,
}) => {
  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <h2 className="text-xxl font-bold">員工列表</h2>
        {/* Search worker */}
        <ModalBtn
          className="btn btn-sm"
          modalId="worker-modal"
          onClick={() => {
            setModalTitle('新增員工');
            setIsShow(true);
          }}
        >
          + New
        </ModalBtn>
      </div>
      <div className="flex gap-2 items-center">
        <input
          className="input input-bordered w-full max-w-xs mb-4 h-10"
          placeholder="搜尋員工名稱"
          type="text"
        />
        {/* useDebounce */}
        <span className="text-sm">搜索關鍵字：</span>
      </div>
      <div className="grid grid-cols-4 mb-4">
        <div className="col text-center p-3 border-b">名稱</div>
        <div className="col text-center p-3 border-b">部門</div>
        <div className="col text-center p-3 border-b">職位</div>
        <div className="col text-center p-3 border-b">詳細資訊</div>
        {/* 標示head */}
        {/* Table Items  Example */}
        <div className="col text-center p-3 border-b">Name 1</div>
        <div className="col text-center p-3 border-b">人資</div>
        <div className="col text-center p-3 border-b">管理職</div>
        <div className="col text-center p-3 border-b">
          <ModalBtn
            className={'btn btn-sm'}
            onClick={() => setModalTitle('員工資料')}
            modalId={'worker-modal'}
          >
            詳細資訊
          </ModalBtn>
        </div>
      </div>
    </>
  );
};

export default WorkerPanel;
