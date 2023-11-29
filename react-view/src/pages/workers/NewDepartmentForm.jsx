import { useEffect, useState, useRef } from 'react';
import Form from '@/components/Form';
import Input from '@/components/Input';
import useFetch from '@/hooks/useFetch';
import newDepartmentSchema from '@/validation/NewDepartmentSchema';

const NewDepartmentForm = () => {
  //[Bug] React Hook over design
  const [postData, setPostData] = useState(null);
  const formRef = useRef(null);
  const { data, isLoading } = useFetch(
    'post',
    '/api/v1/admin/department',
    postData
  );

  useEffect(() => {
    if (data) {
      formRef.current.reset();
      document.getElementById('worker-modal').close();
    }
  }, [isLoading]);

  const onSubmit = (submitData) => {
    setPostData(submitData);
  };

  return (
    <Form
      ref={formRef}
      onSubmit={onSubmit}
      schema={newDepartmentSchema}
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
