import { useContext, useState, useRef, useEffect } from 'react';
import { ReducerContext } from '@/context/ReducerProvider';

import Form from '@/components/Form';
import Input from '@/components/Input';

import usePost from '@/hooks/usePost';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import newDepartmentSchema from '@/validation/newDepartmentSchema';
import { departmentAction } from '@/reducers/departmentReducer';

const NewDepartmentForm = () => {
  const [state, dispatch] = useContext(ReducerContext);
  const [viewErrMsg, setViewErrorMsg] = useState(false);
  const formRef = useRef(null);

  const {
    handlePost: handleNewDepartment,
    data: departmentData,
    isLoading: departmentLoad,
    fetchError: departmentError,
  } = usePost();

  const { handleSubmit, register, formState, reset } = useForm({
    resolver: yupResolver(newDepartmentSchema),
  });

  const onSubmit = async (data) => {
    const res = await handleNewDepartment('/api/v1/department', data);
    reset({ name: '', memberCount: '' }); //clear fields value

    if (res.response) {
      setViewErrorMsg(true); // show error
      setTimeout(() => setViewErrorMsg(false), 2500); //time out hidden error
      return;
    }
    // render
    dispatch({ type: departmentAction.CREATE, payload: res?.data?.data });
    //close modal
    document.getElementById('worker-modal').close();
  };

  const deleteWorker = async () => {};

  return (
    <Form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      register={register}
      formState={formState}
      className="flex flex-col gap-4"
    >
      <Input
        labelName={'部門名稱'}
        name={'name'}
        placeholder={'請輸入部門名稱'}
      />
      {/* Schema */}
      <Input
        labelName={'部門人數'}
        name={'memberCount'}
        placeholder={'請輸入部門人數'}
      />
      <p className="text-red-500">{viewErrMsg && '請注意部門名稱是否錯誤'}</p>
      <button className="btn ">
        {departmentLoad ? (
          <span className="loading loading-dots loading-sm"></span>
        ) : (
          '建立'
        )}
      </button>
    </Form>
  );
};

export default NewDepartmentForm;
