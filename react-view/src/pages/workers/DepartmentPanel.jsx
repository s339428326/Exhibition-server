import ModalBtn from '@/components/Modal/ModalBtn';
import useFetch from '@/hooks/useFetch';
import { useEffect, Fragment } from 'react';

const DepartmentPanel = ({
  setModalTitle,
  setModalContent,
  departmentList,
  setDepartmentList,
  show,
  setIsShow,
}) => {
  const { data, isLoading } = useFetch('get', '/api/v1/department');
  console.log('[DepartmentPanel]', departmentList);
  //
  useEffect(() => {
    //init get render data
    if (data?.departmentData) {
      setDepartmentList(() => {
        console.log(data.departmentData);
        return data.departmentData;
      });
    }
  }, [isLoading]);

  //modalController
  const modalController = (title) => setModalTitle(title);
  return (
    <>
      <div className="flex gap-2 items-center mb-4">
        <h2 className="text-xxl font-bold">部門列表</h2>
        <ModalBtn
          className="btn btn-sm"
          modalId="worker-modal"
          onClick={() => {
            modalController('新增部門');
            setIsShow(true);
          }}
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
        {departmentList?.map((item) => (
          <Fragment key={item?._id}>
            <div className="col text-center p-3 border-b">{item?.name}</div>
            <div className="col text-center p-3 border-b">
              {item?.member?.length}/{item?.memberCount}
            </div>
            <div className="col text-center p-3 border-b">
              <ModalBtn
                className={'btn btn-sm'}
                onClick={() => {
                  modalController('部門詳細資訊');
                  setModalContent(item?._id);
                }}
                modalId={'worker-modal'}
              >
                詳細資訊
              </ModalBtn>
            </div>
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default DepartmentPanel;
