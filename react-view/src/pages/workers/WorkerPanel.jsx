import { useState, Fragment, useEffect, useContext } from 'react';
import { ReducerContext } from '@/context/ReducerProvider';
import useDebounce from '@/hooks/useDebounce';
import useFetch from '@/hooks/useFetch';
import ModalBtn from '@/components/Modal/ModalBtn';

const WorkerPanel = ({
  // show,
  // workerId,
  setWorkerId,
  setModalTitle,
  setIsShow,
}) => {
  const [keyword, setKeyWord] = useState();
  const debounceKeyword = useDebounce(keyword, 700);
  const [state, dispatch] = useContext(ReducerContext);

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
        <button className="btn btn-sm ml-auto">輸出JSON</button>
        <button className="btn btn-sm ml-2">輸出xlxs</button>
      </div>
      <div>
        <input
          onChange={(e) => setKeyWord(e.target.value)}
          className="input input-bordered w-full max-w-xs mb-1 h-10"
          placeholder="搜尋員工名稱"
          type="text"
        />
        {/* useDebounce */}
        <p className="text-sm h-[20px]">
          {debounceKeyword && `搜索關鍵字：${debounceKeyword}`}
        </p>
      </div>
      <div className="grid grid-cols-4 mb-4">
        <div className="col text-center p-3 border-b">名稱</div>
        <div className="col text-center p-3 border-b">部門</div>
        <div className="col text-center p-3 border-b">職位</div>
        <div className="col text-center p-3 border-b">詳細資訊</div>
        {/* 標示head */}
        {/* Table Items  Example */}
        {state?.worker?.data
          ?.filter((it) => it?.name.match(debounceKeyword))
          .map((it) => (
            <Fragment key={it?._id}>
              <div className="col text-center p-3 border-b">{it?.name}</div>
              {/* 部門 */}
              <div className="col text-center p-3 border-b">
                {it?.department[0]?.name}
              </div>
              <div className="col text-center p-3 border-b">{it?.position}</div>
              <div className="col text-center p-3 border-b">
                <ModalBtn
                  className={'btn btn-sm'}
                  // setWorkerList
                  onClick={() => {
                    setModalTitle('員工資料');
                    setWorkerId(it?._id);
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

export default WorkerPanel;
