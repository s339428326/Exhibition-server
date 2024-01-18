import { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import useFetch from '@/hooks/useFetch';
import usePost from '@/hooks/usePost';
//icons
import { CiFilter } from 'react-icons/ci';
//form validation
// import newAccountSchema from '../../validation/newAccountSchema';
//components
// import Form from '../../components/Form';
// import Input from '../../components/Input';
import Modal from '../../components/Modal/Modal';
import ModalBtn from '../../components/Modal/ModalBtn';

const PAGE_LIMIT = 10;

const NewPartnerAccount = () => {
  useAuth();
  // [feature-1] JSON to Excel
  // (https://docs.sheetjs.com/docs/demos/frontend/react/)

  const [show, setIsShow] = useState();
  const [modalData, setModalData] = useState();
  const [partnerList, setPartnerList] = useState([]);
  const [filterData, setFilterData] = useState({
    searchName: '',
    searchAddress: '',
  });
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState();

  //get partnerList Data API
  const { data: getAllPartner, isLoading: partnerListLoad } = useFetch(
    'get',
    '/api/v1/partner'
  );

  //filter input text state handler
  const filterDataHandler = (item) => (e) => {
    if (!filterData.hasOwnProperty(item))
      return console.error(
        `[filterDataHandler]:Not found filterData property ${item}`
      );
    setFilterData((pre) => {
      return {
        ...pre,
        [`${item}`]: e.target.value,
      };
    });
  };

  //更新夥伴開通狀態
  const { handlePost: partnerActiveHandler, isLoading: partnerLoad } =
    usePost();

  const activeHandler = async (id) => {
    const { data } = await partnerActiveHandler(`/api/v1/partner/active/${id}`);

    let newPartner = {};
    setModalData((pre) => {
      newPartner = { ...pre, ...data?.partner };
      return newPartner;
    });
    setPartnerList((pre) => {
      const list = [...pre];
      const index = list.findIndex((it) => it?._id === id);
      list.splice(index, 1, newPartner);
      return list;
    });
  };

  //初始化夥伴Data List
  useEffect(() => {
    if (getAllPartner?.partnerData) {
      let partnerList = [...getAllPartner?.partnerData];

      setPartnerList(partnerList?.slice(0, PAGE_LIMIT));
    }
  }, [partnerListLoad, filterData]);

  //計算最大頁數
  useEffect(() => {
    const total = getAllPartner?.partnerData.length;
    const maxPage = Math.ceil(total / PAGE_LIMIT); //有小數就進位
    setMaxPage(maxPage);
  }, [partnerListLoad]);

  const pageHandler = (method) => (e) => {
    switch (method) {
      case 'next':
        setPage((pre) => pre + 1);
        break;
      case 'pre':
        setPage((pre) => {
          if (pre === 1) return pre;
          return pre - 1;
        });
        break;
      case 'number':
        if (e.target.value === 0) return;
        setPage(parseInt(e.target.value));
        break;
      default:
        console.log(`[pageHandler] not found ${method} method`);
        break;
    }
  };

  //Filter partnerList

  //單頁比數
  useEffect(() => {
    let copyList = getAllPartner?.partnerData.map((it) => it);
    const start = (page - 1) * PAGE_LIMIT; //0 ,
    const end = start + PAGE_LIMIT;

    //
    if (filterData.searchName || filterData.searchAddress) {
      setPage(1);
      copyList = copyList?.filter((it) => {
        return (
          it?.company?.name?.match(filterData.searchName) &&
          it?.company?.address?.match(filterData.searchAddress)
        );
      });
    }

    const newList = copyList?.slice(start, end);
    setPartnerList(newList);
  }, [page, filterData]);

  return (
    <div className="container mx-auto px-4 pt-12">
      {/* Modal content */}
      <Modal modalId={'newAccountModal'}>
        <h2 className="text-xl font-bold">廠商：{modalData?.company?.name}</h2>
        <div className="overflow-x-auto border-b mb-2">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>標題</th>
                <th>內容</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              <tr>
                <td>夥伴Id</td>
                <td>{modalData?._id}</td>
              </tr>
              {/* row 2 */}
              <tr>
                <td>連絡信箱</td>
                <td>{modalData?.company?.email}</td>
              </tr>
              {/* row 3 */}
              <tr>
                <td>預設密碼</td>
                <td>
                  {modalData?.firstPassword ? (
                    modalData?.firstPassword
                  ) : (
                    <p className="text-sm text-gray-300">該帳戶未審核</p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="py-2">
          <p className="text=gray-300 text-sm mb-2">合作內容:</p>
          <p className="min-h-[200px] max-h-[300px] border p-1 overflow-y-scroll">
            {modalData?.comment}
          </p>
        </div>
        <div className=" pt-4 text-end">
          <button
            onClick={() => activeHandler(modalData?._id)}
            className="btn btn-sm "
            disabled={modalData?.isActive || partnerLoad}
            type="button"
          >
            {partnerLoad && (
              <span className="loading loading-spinner loading-sm"></span>
            )}
            審核確認
          </button>
        </div>
      </Modal>

      <h1 className="text-2xl font-medium  mb-4">帳戶審查</h1>
      {/* Filter & output Files */}
      <div className="flex flex-col md:flex-row gap-2">
        {/* Filter */}
        <div className="flex items-center gap-2">
          <input
            className="input input-bordered input-sm w-full max-w-[220px]"
            value={filterData.searchName}
            onChange={filterDataHandler('searchName')}
            placeholder="請輸入廠商名稱"
            type="search"
          />
          <input
            className="input input-bordered input-sm w-full max-w-[220px]"
            value={filterData.searchAddress}
            onChange={filterDataHandler('searchAddress')}
            placeholder="請輸入地區名稱"
            type="search"
          />
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          {filterData?.searchName && <p>廠商：{filterData?.searchName}</p>}
          {filterData?.searchAddress && (
            <p>地區：{filterData?.searchAddress}</p>
          )}
        </div>
        {/* Feature JSON to Excel or Number */}
        <button className="btn btn-sm md:ml-auto" disabled={true}>
          輸出檔案
        </button>
      </div>

      <table className="table table-xs md:table-sm lg:table-md ">
        {/* head */}
        <thead>
          <tr>
            <th>審查按鈕</th>
            <th>廠商名稱</th>
            <th>申請時間</th>
            <th>申請狀態</th>
          </tr>
        </thead>
        <tbody>
          {partnerList?.map((it) => (
            <tr key={it?._id}>
              <td className="">
                <ModalBtn
                  onClick={() => {
                    setModalData(it);
                  }}
                  className="btn btn-sm mb-2"
                  modalId="newAccountModal"
                >
                  審查
                </ModalBtn>
              </td>
              <td>
                <div className="flex flex-wrap items-center space-x-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img
                        src="https://fakeimg.pl/300/"
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold truncate">
                      {it?.company?.name}
                    </div>
                    <div className="text-sm opacity-50">
                      {it?.company?.address}
                    </div>
                  </div>
                </div>
              </td>

              <td>
                <p>{new Date(it?.createAt).toLocaleDateString()}</p>
                <p>{new Date(it?.createAt).toLocaleTimeString()}</p>
              </td>
              <td>
                {it?.isActive ? (
                  <div className="badge badge-accent">已開通</div>
                ) : (
                  <div className="badge badge-error">未開通</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="join mt-4 flex justify-center">
        <button
          type="button"
          onClick={pageHandler('pre')}
          className="join-item btn"
          disabled={getAllPartner?.partnerData?.length}
        >
          «
        </button>
        <input
          className="bg-gray-100 flex items-center w-fit text-center"
          value={page}
          onChange={pageHandler('number')}
          type="number"
          min={1}
        />

        <button
          type="button"
          onClick={pageHandler('next')}
          disabled={page === maxPage || getAllPartner?.partnerData?.length}
          className="join-item btn"
        >
          »
        </button>
      </div>
    </div>
  );
};

export default NewPartnerAccount;
