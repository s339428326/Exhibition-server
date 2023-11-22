//React
import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthProvider';
//components
import Form from '@/components/Form';
import Input from '@/components/Input';
//hook
import useFetch from '@/hooks/useFetch';
//plugin
import registerSchema from '@/validation/registerSchema';
import cookie from 'js-cookie';
import { AiOutlineArrowLeft } from 'react-icons/ai';

const ForgetPassword = () => {
  const navigator = useNavigate();
  const { authData, setAuthData } = useContext(AuthContext);

  const [formData, setFormData] = useState(null);
  const { data, fetchError, isLoading } = useFetch(
    'post',
    '/api/v1/worker/singUp',
    formData
  );

  //set Cookie and to main page
  useEffect(() => {
    if (fetchError) return;
    if (data?.token) {
      cookie.set('token', data?.token, {
        expires: Date.now() + parseInt(import.meta.env.VITE_EXPIRE),
      });
      // setAuthData({ ...data });
      // navigator('/exhibition/databoard');
    }
  }, [data]);

  const onSubmit = (getData) => {
    setFormData({ ...getData });
  };

  return (
    <main className="container mx-auto px-4 flex w-screen h-screen justify-center items-center">
      <Form
        onSubmit={onSubmit}
        schema={registerSchema}
        className="flex flex-col w-full md:w-1/2 gap-5 px-4 border rounded-lg p-6 shadow-md relative"
      >
        <Link to="/" className="btn btn-circle absolute top-[8px] left-[8px]">
          <AiOutlineArrowLeft size={16} />
        </Link>
        <h1 className="text-center text-xl font-medium mb-2s">
          忘記密碼(未完成)
        </h1>

        <Input name={'email'} type="email" placeholder="工作信箱" />
        <Input
          name={'password'}
          type="password"
          visible={true}
          placeholder="請輸入密碼"
        />
        <Input
          name={'confirmPassword'}
          type="password"
          visible={true}
          placeholder="請再次輸入密碼"
        />
        <>{fetchError && <p>{fetchError}</p>}</>
        <button type="submit" className="btn">
          {isLoading ? (
            <span className="loading loading-dots loading-sm"></span>
          ) : (
            '註冊'
          )}
        </button>
      </Form>
    </main>
  );
};

export default ForgetPassword;
