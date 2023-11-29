import { useEffect, useState, useRef } from 'react';
import Form from '@/components/Form';
import Input from '@/components/Input';
import useFetch from '@/hooks/useFetch';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import newDepartmentSchema from '@/validation/newDepartmentSchema';

const NewDepartmentForm = ({ setDepartmentList }) => {
  //[Bug] React Hook over design
  //[POST] useHook API
  const [postData, setPostData] = useState(null);
  const [viewErrMsg, setViewErrorMsg] = useState(false);
  const formRef = useRef(null);
  const { data, isLoading, fetchError } = useFetch(
    'post',
    '/api/v1/department',
    postData
  );
  const { handleSubmit, register, formState, watch } = useForm({
    resolver: yupResolver(newDepartmentSchema),
  });
  const resetHandler = () => {
    setViewErrorMsg(false);
    formRef.current.reset();
    document.getElementById('worker-modal').close();
  };

  //Reset Form value
  useEffect(() => {
    if (data) {
      resetHandler();
    }
  }, [isLoading]);

  //rerender data
  useEffect(() => {
    if (!postData || fetchError) return;
    if (data?.data) setDepartmentList((pre) => [...pre, data.data]);
    setPostData(null);
  }, [data]);

  const onSubmit = async (submitData) => {
    setPostData(submitData);
    if (fetchError) {
      setViewErrorMsg(true);
      setTimeout(() => {
        setViewErrorMsg(false);
      }, 2500);
    }
  };

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
        {isLoading ? (
          <span className="loading loading-dots loading-sm"></span>
        ) : (
          '建立'
        )}
      </button>
    </Form>
  );
};

export default NewDepartmentForm;
