import { useState } from 'react';
import propTypes from 'prop-types';
import useFetch from '@/hooks/useFetch';
import Form from '@/components/Form';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { useForm } from 'react-hook-form';
//[Feature] 表單驗證未建立
import { yupResolver } from '@hookform/resolvers/yup';

const NewWorkerForm = ({ show, setIsShow }) => {
  //get 部門全資料
  const { data, isLoading, fetchError } = useFetch(
    'get',
    '/api/v1/department/'
  );

  const [page, setPage] = useState(0); //頁數狀態
  //[Feature] 表單驗證未建立
  const { handleSubmit, register, formState, watch } = useForm({
    // resolver: yupResolver(),
  });

  //持續觀看department填寫value
  const watchDepartment = watch('department');

  //表單傳送
  const onSubmit = handleSubmit((data) => console.log(data));

  //上一頁
  const preStepHandler = () => {
    if (page === 0) return;
    setPage((pre) => --pre);
  };
  //下一頁
  const nextStepHandler = () => {
    setPage((pre) => ++pre);
  };

  return (
    <div className="overflow-hidden">
      <div>
        <Form
          register={register}
          formState={formState}
          className={`flex flex-col gap-2`}
        >
          <Input
            labelName={'員工姓名'}
            name={'username'}
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
            data={data?.departmentData?.map((it) => {
              return { name: it.name, value: it._id };
            })}
          />
          <Select
            labelName={'職稱'}
            name={'role'}
            data={
              data?.departmentData?.find((it) => it._id === watchDepartment)
                ?.position
            }
          />
        </Form>
        {/* page 2 */}
        <div>
          <p>申請帳戶詳細資料 + 隱蔽資訊</p>
          <p>帳戶密碼</p>
          <p>入職申請PDF 列印</p>
        </div>
      </div>

      <div className="flex gap-2 justify-between">
        <button className="btn" onClick={preStepHandler} disabled={page === 0}>
          上一步
        </button>
        <button onClick={onSubmit} className="btn">
          下一步
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
