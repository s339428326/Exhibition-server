import { useState } from 'react';
import propTypes from 'prop-types';
import useFetch from '@/hooks/useFetch';
import Form from '@/components/Form';
import Input from '@/components/Input';
import Select from '@/components/Select';
import { useForm } from 'react-hook-form';
import { MdOutlineArrowBackIos } from 'react-icons/md';
//[Feature] add New Worker validation
import { yupResolver } from '@hookform/resolvers/yup';

const NewWorkerForm = ({ onSubmit, show }) => {
  const { data, isLoading, fetchError } = useFetch(
    'get',
    '/api/v1/department/'
  );

  const [page, setPage] = useState(0);

  const { handleSubmit, register, formState, watch } = useForm({
    // resolver: yupResolver(),
  });

  const watchDepartment = watch('department');

  return (
    <>
      {page === 0 && (
        <Form
          register={register}
          formState={formState}
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(onSubmit)}
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
          <button
            type="submit"
            onClick={() => setPage((pre) => pre + 1)}
            className="btn w-full"
          >
            下一步
          </button>
        </Form>
      )}
      {page === 1 && (
        <div>
          <button className="btn btn-circle p-4" type="button">
            <MdOutlineArrowBackIos />
          </button>
          <p>申請帳戶詳細資料 + 隱蔽資訊</p>
          <p>帳戶密碼</p>
          <p>入職申請PDF 列印</p>
          <button className="btn" type="button">
            完成
          </button>
        </div>
      )}
    </>
  );
};

export default NewWorkerForm;

NewWorkerForm.propTypes = {
  show: propTypes.bool,
  onSubmit: propTypes.func,
};
