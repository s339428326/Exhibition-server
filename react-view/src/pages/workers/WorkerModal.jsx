import { useEffect, useRef, useState, useContext } from 'react';
import { ReducerContext } from '@/context/ReducerProvider';
// import { departmentAction } from '@/reducers/departmentReducer';
import { workerAction } from '@/reducers/workerReducer';
import propTypes from 'prop-types';
import useFetch from '@/hooks/useFetch';
import usePost from '@/hooks/usePost';
import Form from '@/components/Form';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//員工詳細表單
const WorkerModal = ({ workerId }) => {
  const [state, dispatch] = useContext(ReducerContext);
  //api
  const {
    data: workerData,
    isLoading: workerLoad,
    fetchError: workerError,
  } = useFetch('get', `/api/v1/worker/${workerId}`);

  const {
    handlePost: handlerUpdateWorker,
    data: newWorkerData,
    isLoading: newWorkerLoad,
    fetchError: newWorkerError,
  } = usePost('patch');

  const {
    handlePost: handlerDelWorker,
    isLoading: delWorkerLoad,
    fetchError: delWorkerError,
  } = usePost('delete');

  //hook form
  const { handleSubmit, register, formState, setValue, watch, getValues } =
    useForm({
      // resolver: yupResolver(/*vailde Schema*/),
    });

  const watchAll = watch();
  const [disableSubmit, setDisableSubmit] = useState(true);
  //form change state
  let initFormValueRef = useRef();

  //change user information
  //4.Express delete worker
  const handleSendForm = handleSubmit(async (data) => {
    setDisableSubmit(false);
    const res = await handlerUpdateWorker(`/api/v1/worker/${workerId}`, data);
    setDisableSubmit(true);
    if (!res?.data) return console.error('更新員工資料失敗');
    //re-assign current form
    initFormValueRef.current = data;
    //change state view workerList
    const targetDepartment = state.department?.data?.find(
      (it) => it?._id === data?.department
    );
    //[UPDATE]
    dispatch({
      type: workerAction.UPDATE,
      payload: { ...data, _id: workerId, department: [targetDepartment] },
    });
  });

  const deleWorker = async () => {
    const res = await handlerDelWorker(`/api/v1/worker/${workerId}`);
    if (!res?.data) return console.error('[員工刪除失敗]', res);
    console.log(res);
    // dispatch({type:workerAction.DELETE, payload:{_id:workerId}})
  };

  //re-render form state
  useEffect(() => {
    //render worker form current default value
    const targetWorker = workerData?.data;
    setValue('name', targetWorker?.name);
    setValue('department', targetWorker?.department?._id);
    setValue('position', targetWorker?.position);
    initFormValueRef.current = getValues();
  }, [workerData]);

  //check isChange Form Value to Change submit btn disable state
  useEffect(() => {
    let isChange = false;
    Object.keys(watchAll).forEach((currentKey) => {
      if (watchAll[currentKey] !== initFormValueRef.current[currentKey])
        isChange = true;
    });
    setDisableSubmit(!isChange);
  }, [watchAll]);

  return (
    <div>
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-medium mb-4">員工詳細資料</h1>
        {workerLoad && (
          <span className="loading loading-dots loading-md"></span>
        )}
      </div>
      {workerLoad ? (
        <div className="flex flex-col gap-4 animate-pulse">
          <div className="w-24 h-24 rounded-full bg-slate-300 mx-auto"></div>
          <div>
            <div className="mb-1">
              <div className="mb-1 w-14 h-5 bg-slate-300 rounded-sm"></div>
              <div className="w-full h-10 bg-slate-300 rounded-sm"></div>
            </div>
            <div className="mb-1">
              <div className="mb-1 w-14 h-5 bg-slate-300 rounded-sm"></div>
              <div className="w-full h-10 bg-slate-300 rounded-sm"></div>
            </div>
            <div className="mb-1">
              <div className="mb-1 w-14 h-5 bg-slate-300 rounded-sm"></div>
              <div className="w-full h-10 bg-slate-300 rounded-sm"></div>
            </div>
            <button
              className="btn btn-neutral btn-block text-white mt-4"
              disabled={true}
            >
              <span className="loading loading-dots loading-md"></span>
            </button>
            <button
              className="btn btn-neutral btn-block text-white mt-4"
              disabled={true}
            >
              <span className="loading loading-dots loading-md"></span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <img
            className={`relative object-cover w-24 h-24 mx-auto  overflow-hidden rounded-full`}
            src={workerData?.data?.avatar?.imageUrl}
            alt={`${workerData?.data?.name}-avatar`}
          />

          <Form register={register} formState={formState}>
            <Input labelName={'員工姓名'} name={'name'} />
            <Select
              labelName={'部門'}
              name={'department'}
              data={state?.department?.data.map((it) => {
                return { name: it.name, value: it._id };
              })}
            />
            <Select
              labelName={'職稱'}
              name={'position'}
              data={
                state?.department?.data.find(
                  (it) => it._id === watchAll?.department
                )?.position
              }
            />

            <button
              onClick={handleSendForm}
              className="btn btn-neutral btn-block text-white mt-4"
              disabled={disableSubmit || newWorkerLoad}
            >
              更新
            </button>
            <button
              className="btn btn-block btn-error  text-white mt-4"
              onClick={deleWorker}
            >
              刪除
            </button>
          </Form>
        </div>
      )}
    </div>
  );
};

export default WorkerModal;

WorkerModal.propTypes = {
  workerId: propTypes.string,
};
