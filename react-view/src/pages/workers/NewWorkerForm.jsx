import propTypes from 'prop-types';
import { useEffect, useState, useContext } from 'react';
import { ReducerContext } from '@/context/ReducerProvider';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import useFetch from '@/hooks/useFetch';
import usePost from '@/hooks/usePost';
import Form from '@/components/Form';
import Input from '@/components/Input';
import Select from '@/components/Select';
//[Feature] 表單驗證未建立
import { yupResolver } from '@hookform/resolvers/yup';
import newWorkerSchema from '@/validation/newWorkerSchema';
import { workerAction } from '@/reducers/workerReducer';

const NewWorkerForm = ({ show, setIsShow, setWorkerData }) => {
  const [state, dispatch] = useContext(ReducerContext);
  const navigate = useNavigate();
  //頁數狀態
  const [page, setPage] = useState(0);
  //worker
  const [workerPostData, setWorkerPostData] = useState(null);
  //[Get] 部門全資料
  const { data, isLoading, fetchError } = useFetch(
    'get',
    '/api/v1/department/'
  );

  const {
    handlePost: handleNewWorker,
    data: workerData,
    isLoading: workerLoad,
    fetchError: workerError,
  } = usePost();

  //[Feature] 表單驗證未建立
  const {
    handleSubmit,
    register,
    formState,
    watch,
    trigger,
    reset,
    clearErrors,
  } = useForm({
    resolver: yupResolver(newWorkerSchema),
  });

  //持續觀看form填寫value
  const watchAll = watch();

  //上一頁
  const preStepHandler = () => {
    if (page === 0) return;
    setPage((pre) => pre - 1);
  };

  //下一頁
  const nextStepHandler = async () => {
    if (page === 0) {
      // 觸發表單驗證 trigger
      // return (promise) true:通過, false:不通過
      const res = await trigger();
      if (!res) return;
    }
    //page  1 不翻頁
    if (page === 1) return;
    setPage((pre) => pre + 1);
  };

  const handlerPostForm = handleSubmit(async (data) => {
    const res = await handleNewWorker('/api/v1/worker', data);
    setWorkerData(res?.data?.data);
    //res?.data?.data?.worker

    //find department
    const targetDepartment = state?.department?.data.find(
      (it) => it?._id === res?.data?.data?.worker?.department
    );
    console.log(targetDepartment);
    dispatch({
      type: workerAction.CREATE,
      payload: { ...res?.data?.data?.worker, department: [targetDepartment] },
    });
    //reset modal content
    setPage(0); //page state to 0
    reset(); // clean form state value
    navigate(`/workers/workerForm/${res?.data?.data?.worker?.id}`);
  });

  return (
    <div className="overflow-hidden p-1">
      {/*[BUG] 使用padding 防止 outline 不受 overflow-hidden得屏蔽 */}
      <div
        className={`flex transition-all  
        ${page > 0 && '-translate-x-[101%] pr-1'}`}
      >
        <Form
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              nextStepHandler();
            }
          }}
          register={register}
          formState={formState}
          className="flex flex-col gap-2 w-full mb-4"
        >
          <Input
            labelName={'員工姓名'}
            name={'name'}
            placeholder="請輸入員工姓名"
          />
          <Input
            labelName={'員工信箱'}
            name={'email'}
            placeholder="請輸入員工信箱"
          />
          <Select
            labelName={'部門'}
            name={'department'}
            data={state.department?.data?.map((it) => {
              return { name: it.name, value: it._id };
            })}
          />
          <Select
            labelName={'職稱'}
            name={'position'}
            data={
              state.department?.data?.find(
                (it) => it._id === watchAll?.department
              )?.position
            }
          />
          {/* page 2 */}
          <div
            className={`absolute right-0 left-0 top-0 translate-x-full
            ${page === 1 ? 'block' : 'hidden'}
            `}
          >
            <div className="rounded p-2">
              <div className="flex gap-2 items-center mb-4">
                <p className="text-xl font-medium">員工建立資訊核對</p>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={preStepHandler}
                >
                  修改
                </button>
              </div>

              <ul className="flex flex-col gap-2">
                <li>姓名: {watchAll.name}</li>
                <li>信箱: {watchAll.email}</li>
                <li>
                  部門:{' '}
                  {
                    state?.department?.data?.find(
                      (it) => it._id === watchAll.department
                    )?.name
                  }
                </li>
                <li>
                  職稱:{' '}
                  {
                    data?.departmentData
                      .find((it) => it._id === watchAll.department)
                      ?.position.find((it) => it?.value === watchAll?.position)
                      ?.name
                  }
                </li>
              </ul>
            </div>
          </div>
        </Form>
      </div>
      <p className="mb-2 text-sm text-red-500">{workerError}</p>
      <div className="flex justify-between">
        <button
          className="btn w-full"
          onClick={page === 1 ? handlerPostForm : nextStepHandler}
        >
          {page === 1 ? '下載申請單' : '下一步'}
        </button>
      </div>
    </div>
  );
};

export default NewWorkerForm;

NewWorkerForm.propTypes = {
  show: propTypes.bool,
  setIsShow: propTypes.func,
};
