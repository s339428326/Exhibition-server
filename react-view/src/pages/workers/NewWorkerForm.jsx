import Form from '@/components/Form';
import Input from '@/components/Input';
import Select from '@/components/Select';

const NewWorkerForm = ({ onSubmit }) => {
  return (
    <Form className="flex flex-col gap-2" onSubmit={onSubmit}>
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
        labelName={'職稱'}
        name={'role'}
        data={[
          { name: '請選擇職稱' },
          { name: '一般員工', value: 'normal' },
          { name: '管理職', value: 'manger' },
          { name: '網站管理員', value: 'admin' },
        ]}
      />
      <Select
        labelName={'部門'}
        name={'department'}
        data={[
          { name: '請選擇部門' },
          { name: '運營', value: '運營' },
          { name: '人資', value: '人資' },
          { name: '客服', value: '客服' },
          { name: '資訊', value: '資訊' },
        ]}
      />
      <button className="btn w-full" type="submit">
        新增
      </button>
    </Form>
  );
};

export default NewWorkerForm;
