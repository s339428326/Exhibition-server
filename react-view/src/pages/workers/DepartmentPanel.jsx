import ModalBtn from '@/components/Modal/ModalBtn';
import useFetch from '@/hooks/useFetch';
import useDebounce from '@/hooks/useDebounce';
import XLSX from 'xlsx';
import { Fragment, useState, useContext } from 'react';
import { departmentAction } from '@/reducers/departmentReducer';
import { ReducerContext } from '@/context/ReducerProvider';

const DepartmentPanel = ({
  show,
  setIsShow,
  setModalTitle,
  setDepartmentId,
}) => {
  const [keyword, setKeyword] = useState('');
  const keywordDebounce = useDebounce(keyword, 700);
  const [fileUrl, setFileUrl] = useState('');
  const [state, dispatch] = useContext(ReducerContext);

  const handleFile = (type) => {
    const raw = data?.departmentData?.filter((it) =>
      it?.name.match(keywordDebounce)
    );

    switch (type) {
      case 'json':
        const blobJSON = new Blob([JSON.stringify(raw, null, 2)], {
          type: 'application/json',
        });
        setFileUrl(URL.createObjectURL(blobJSON));
        break;

      case 'xlsx':
        const sheet = XLSX.utils.json_to_sheet(raw);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');
        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const blobXLSX = new Blob([wbout], {
          type: 'application/octet-stream',
        });
        setFileUrl(URL.createObjectURL(blobXLSX));
        break;
    }
  };

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
        <a
          href={fileUrl}
          target="blank"
          className="btn btn-sm ml-auto"
          onClick={() => handleFile('json')}
          download={`department-${Date.now()}.json`}
        >
          輸出JSON
        </a>

        <a
          href={fileUrl}
          target="blank"
          className="btn btn-sm ml-2"
          onClick={() => handleFile('xlsx')}
          download={`department-${Date.now()}.xlsx`}
        >
          輸出xlxs
        </a>
      </div>
      <div className="flex flex-col">
        <input
          onChange={(e) => setKeyword(e.target.value)}
          className="input input-bordered w-full max-w-xs mb-1 h-10"
          placeholder="搜尋部門"
          type="text"
        />
        <p className="text-sm h-[20px]">
          {keywordDebounce &&
            `搜索關鍵字：${keywordDebounce}(${
              state?.department?.data?.filter((it) =>
                it?.name.match(keywordDebounce)
              ).length
            })`}
        </p>
      </div>
      {/* Data Table View */}
      <div className="grid grid-cols-3 mb-4">
        <div className="col text-center p-3 border-b">部門</div>
        <div className="col text-center p-3 border-b">人數</div>
        <div className="col text-center p-3 border-b">詳細資料</div>
        {state?.department?.data
          ?.filter((it) => it?.name.match(keywordDebounce))
          ?.map((item) => (
            <Fragment key={item?._id}>
              <div className="col text-center p-3 border-b">{item?.name}</div>
              <div className="col text-center p-3 border-b">
                {item?.member?.length}/{item?.memberCount}
              </div>
              <div className="col text-center p-3 border-b">
                <ModalBtn
                  className={'btn btn-sm'}
                  onClick={() => {
                    setIsShow(true);
                    modalController('部門詳細資訊');
                    setDepartmentId(item?._id);
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
