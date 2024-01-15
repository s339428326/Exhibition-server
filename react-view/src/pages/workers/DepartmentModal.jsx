import { useEffect, useState, useContext, useRef } from 'react';
import propTypes from 'prop-types';
import usePost from '@/hooks/usePost';
import useFetch from '@/hooks/useFetch';
import { AuthContext } from '@/context/AuthProvider';
import useDebounce from '@/hooks/useDebounce';
import { ReducerContext } from '@/context/ReducerProvider';
import { departmentAction } from '@/reducers/departmentReducer';

//icons
import { FaEdit, FaRegCheckSquare } from 'react-icons/fa';
import { FaDeleteLeft } from 'react-icons/fa6';

const PositionField = ({ dispatch, item, departmentId, show }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [currentValue, setCurrentValue] = useState('');

  // patch position handle
  const { handlePost: handlePatchPosition, isLoading: positionPatchLoad } =
    usePost('patch');

  // del position handle
  const { handlePost: handleDeletePosition, isLoading: positionDeleteLoad } =
    usePost('patch');

  useEffect(() => {
    setCurrentValue(item?.name);
    if (!show) {
      setIsEdit(false);
    }
  }, [show]);

  //control current position list
  const handleFieldName = async () => {
    if (item.name === currentValue) return setIsEdit(false);
    const patchData = {
      oldName: item.name,
      newName: currentValue,
    };

    const res = await handlePatchPosition(
      `/api/v1/department/position/${departmentId}`,
      patchData
    );

    if (res) setIsEdit(false);

    dispatch({
      type: departmentAction.UPDATE,
      payload: {
        departmentId,
        position: patchData,
      },
    });
  };

  const handleDelete = async () => {
    //
    const res = await handleDeletePosition(
      `/api/v1/department/position/del/${departmentId}`,
      { position: item?.name }
    );

    dispatch({
      type: departmentAction.REMOVE,
      payload: { _id: departmentId, position: item.name },
    });
  };

  return (
    <div className="flex border-b">
      {isEdit ? (
        <input
          className="flex-1 text-center border-r"
          id={currentValue}
          type="text"
          onChange={(e) => setCurrentValue(e.target.value)}
          defaultValue={currentValue}
        />
      ) : (
        <label
          htmlFor={currentValue}
          onClick={() => setIsEdit(true)}
          className="flex-1 text-center border-r"
        >
          {currentValue}
        </label>
      )}
      <div className="flex-1 flex justify-center gap-4">
        <button
          htmlFor={currentValue}
          onClick={handleFieldName}
          disabled={positionPatchLoad}
        >
          {isEdit ? <FaRegCheckSquare /> : <FaEdit />}
        </button>

        <button disabled={positionDeleteLoad} onClick={handleDelete}>
          <FaDeleteLeft />
        </button>
      </div>
    </div>
  );
};

//部門詳細內容表單
/**
 *
 * @param {String} id
 * @param {boolean} show
 * @returns
 */

const DepartmentModal = ({ id, show, departmentList, setDepartmentList }) => {
  const [state, dispatch] = useContext(ReducerContext);
  const [keyword, setKeyword] = useState('');
  const debounceKeyword = useDebounce(keyword);
  const { authData } = useContext(AuthContext);
  const { data, isLoading, fetchError } = useFetch('get', `/api/v1/worker`);

  const getWorkerData = () =>
    workerList?.[workerList?.findIndex((it) => it._id === controlId)];

  const {
    handlePost: handleRole,
    isLoading: roleLoadState,
    data: roleData,
    fetchError: roleError,
  } = usePost();

  const {
    handlePost: handleActive,
    isLoading: activeLoadState,
    data: activeData,
    fetchError: activeError,
  } = usePost();

  const {
    handlePost: handlePosition,
    isLoading: positionLoad,
    data: positionData,
    fetchError: positionError,
  } = usePost();

  //common state
  const [page, setPage] = useState(0);
  //page1 state
  const [workerList, setWorkerList] = useState([]);
  const [newPositionArr, setNewPositionArr] = useState([]);
  //page2 state
  const [roleBtn, setRoleBtn] = useState(false);
  const [activeBtn, setActive] = useState(false);
  const [controlId, setControlId] = useState('');
  const [controlError, setControlError] = useState('');

  //init modal
  useEffect(() => {
    if (!show) {
      setPage(0);
      setControlError('');
    }
  }, [show]);

  // get worker list state
  useEffect(() => {
    setWorkerList(data?.data?.filter((it) => it?.department[0]?._id === id));
    // setPositionList(
    //   state?.department?.data?.find((it) => it._id === id)?.position
    // );
  }, [data, id]);

  //page 1 user select btn
  const handleBtnUser = (workerId) => () => {
    console.log('[workerId]', workerId);
    const targetUser = workerList.find((it) => it?._id === workerId);
    if (!targetUser) return console.error('[handleBtnUser]未找到用戶');
    setPage((pre) => pre + 1); // next page
    setControlId(workerId); // set current worker id
    setRoleBtn(() => targetUser?.role === 'admin');
    setActive(() => !targetUser?.isActive);
  };

  //page 2 user control panel btn
  const handleBtnRole = async () => {
    if (controlId === authData?.id) return setControlError('無法對本人操作');
    const res = await handleRole(`/api/v1/worker/changeRole/${controlId}`, {
      role:
        workerList.find((it) => it?._id === controlId).role === 'normal'
          ? 'admin'
          : 'normal',
    });
    if (res?.response?.status) return;
    setRoleBtn((pre) => !pre); //toggle btn view state
    //update workerList
    setWorkerList((pre) =>
      pre.map((it) => {
        if (it?._id === controlId) {
          it = {
            ...it,
            role: it?.role === 'normal' ? 'admin' : 'normal',
          };
        }
        return it;
      })
    );
  };

  //
  const handleBtnActive = async () => {
    if (controlId === authData?.id) return setControlError('無法對本人操作');
    //call API
    const res = await handleActive(`/api/v1/worker/changeActive/${controlId}`);
    if (res?.response?.status) return;
    setActive((pre) => !pre); //toggle Btn view
    //update workerList
    setWorkerList((pre) =>
      pre.map((it) => {
        if (it?.id === controlId) {
          it = { ...it, isActive: !it?.isActive };
        }
        return it;
      })
    );

    //update departmentList view member data
    setDepartmentList((pre) =>
      pre.map((it) => {
        if (it._id === id) {
          it = {
            ...it,
            member: activeBtn
              ? [...it.member, controlId]
              : it.member.filter((memberId) => memberId !== controlId),
          };
        }
        return it;
      })
    );
  };

  //new Fields
  const handleNewField = () => {
    if (newPositionArr.length === 3) return;
    setNewPositionArr((pre) => [
      ...pre,
      { id: crypto.randomUUID(), name: '', errorMsg: '' },
    ]);
  };

  //Fields value
  const handlerFieldValue = (id) => (e) => {
    setNewPositionArr((pre) =>
      pre.map((it) => {
        if (it.id === id) {
          return { ...it, name: e.target.value };
        }
        return it;
      })
    );
  };

  //temp handler
  const handlePositionSubmit = (keyId, method) => async () => {
    const targetPosition = newPositionArr.find((it) => it.id === keyId);

    if (method === 'submit') {
      const res = await handlePosition(`/api/v1/department/position/${id}`, {
        name: targetPosition?.name,
      });
      if (!res?.data) return;
      //remove Field
      setNewPositionArr((pre) => pre.filter((it) => it.id !== keyId));
      //re-render department Position List
      dispatch({
        type: departmentAction.ADD,
        payload: {
          _id: id,
          position: {
            name: targetPosition?.name,
            value: targetPosition?.name,
          },
        },
      });
    }
    if (method === 'delete') {
      setNewPositionArr((pre) => pre.filter((it) => it.id !== keyId));
    }
  };

  return (
    <div className="overflow-x-hidden overflow-y-auto h-full">
      <div className="flex gap-2 items-center">
        <h2 className="text-xl font-medium mb-4">部門員工</h2>
        {isLoading && <span className="loading loading-dots loading-md"></span>}
      </div>

      {/* page content */}
      <div
        className={`relative transition-all ${
          page === 1 && '-translate-x-full'
        }`}
      >
        {/* 員工表單 */}
        <div>
          <input
            className="ml-1 input input-bordered mb-2 h-[36px] "
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="請輸入員工名稱"
            type="search"
          />

          <div className="border rounded mb-4">
            <div className="flex items-center border-b mr-4">
              <p className="border-r flex-1 text-center p-1 bg-slate-300">
                員工名稱
              </p>
              <p className="border-r flex-1 text-center p-1 bg-slate-300">
                職位
              </p>
              <p className="flex-1 text-center p-1 bg-slate-300">帳戶狀態</p>
            </div>
            {/* page1 */}

            <ul className="overflow-y-scroll max-h-32">
              {!isLoading &&
                workerList
                  ?.filter((it) => (keyword ? it.name === keyword : it))
                  ?.map((it, index, arr) => (
                    <li
                      className={`flex ${arr.length !== index && 'border-b'}`}
                      key={it?._id}
                    >
                      <p className="border-r flex-1 p-1 text-center">
                        {it?.name}
                      </p>
                      <p className="border-r flex-1 p-1 text-center">
                        {it?.position}
                      </p>
                      <div className="border-r flex-1 p-1 flex items-center justify-between">
                        {it?.isActive ? '啟用' : '關閉'}
                        <button
                          className="btn btn-xs"
                          onClick={handleBtnUser(it?._id)}
                          type="button"
                        >
                          變更
                        </button>
                      </div>
                    </li>
                  ))}
            </ul>
          </div>
          {/* 職位列表 */}
          <div className="border rounded mb-4">
            <div className="flex items-center border-b mr-4">
              <p className="border-r flex-1 text-center p-1 bg-slate-300">
                職位名稱
              </p>
              <p className="border-r flex-1 text-center p-1 bg-slate-300">
                控制
              </p>
            </div>
            <ul className="overflow-y-scroll max-h-32">
              {/* insert component */}
              {newPositionArr.map((it) => (
                <li key={`${it.id}`}>
                  <div className="flex border-b">
                    <div className="relative flex-1 border-r">
                      <input
                        onChange={handlerFieldValue(it.id)}
                        className={'h-[28px] p-1 w-full'}
                        placeholder="請輸入新增"
                        maxLength={10}
                      />
                      {/* Error for position msg */}
                      <p className="absolute top-1/2 right-0 -translate-y-1/2 pr-2 text-red-500 text-sm">
                        {it.errorMsg}
                      </p>
                    </div>
                    <div className="flex-1 flex gap-2 justify-center">
                      <button
                        onClick={handlePositionSubmit(it.id, 'submit')}
                        className="btn btn-sm"
                        type="button"
                      >
                        確認
                      </button>
                      <button
                        onClick={handlePositionSubmit(it.id, 'delete')}
                        className="btn btn-sm"
                        type="button"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                </li>
              ))}
              {/* current position */}
              {/* ul List  */}
              {state?.department?.data
                ?.find((it) => it._id === id)
                ?.position?.map((it, idx) => (
                  <li key={`position-${idx}`}>
                    <PositionField
                      dispatch={dispatch}
                      show={show}
                      item={it}
                      departmentId={id}
                    />
                  </li>
                ))}
            </ul>
            <button
              onClick={handleNewField}
              className="btn btn-block btn-sm rounded-t-none rounded-b-md"
              type="button"
            >
              + 新增
            </button>
          </div>
        </div>

        {/* page2  */}
        <div className="w-full h-fit absolute left-full top-0 flex flex-col ">
          <div className="flex gap-4">
            {/* 員工訊息 */}
            <div className="flex-1 mb-4">
              <img
                className="max-w-[64px] object-cover mb-4"
                src={`${getWorkerData()?.avatar?.imageUrl}`}
                alt={`${getWorkerData()?.name}`}
              />
              <ul>
                <li>姓名:{getWorkerData()?.name}</li>
                <li>暱稱:{getWorkerData()?.username}</li>
                <li>信箱:{getWorkerData()?.email}</li>
                <li>介紹:{getWorkerData()?.intro}</li>
              </ul>
            </div>
            {/* 控制列 */}
            <div className="flex-1 form-control mb-4">
              <h2 className="text-lg font-bold border-b border-black">設定</h2>
              <label
                className="label cursor-pointer"
                htmlFor="btn-role"
                onClick={handleBtnRole}
              >
                <span className="label-text">網站管理權限</span>
                <input
                  id="btn-role"
                  type="checkbox"
                  className="toggle"
                  checked={roleBtn}
                  readOnly
                />
              </label>
              <label
                className="label cursor-pointer"
                htmlFor="btn-active"
                onChange={handleBtnActive}
              >
                <span className="label-text text-red-500">關閉用戶</span>
                <input
                  id="btn-active"
                  type="checkbox"
                  className="toggle"
                  checked={activeBtn}
                  readOnly
                />
              </label>
              <p className="text-sm text-end text-red-500">{controlError}</p>
            </div>
          </div>
          <p className="text-red-500">
            {(roleError || activeError) && '請確認帳戶權限'}
          </p>
          <button
            className="btn btn-md ml-auto"
            onClick={() => {
              setPage((pre) => pre - 1);
              setControlError('');
            }}
          >
            <span>返回部門清單</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentModal;

DepartmentModal.propTypes = {
  data: propTypes.string,
  show: propTypes.bool,
};
