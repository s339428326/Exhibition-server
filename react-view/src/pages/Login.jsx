//React
import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';
//Components
import Form from '../components/Form';
import Input from '../components/Input';
//hooks
import useFetch from '../hooks/useFetch';
//plugin
import cookie from 'js-cookie';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import loginSchema from '../validation/loginSchema';

const Login = () => {
  const navigator = useNavigate();
  //context state
  const { authData, setAuthData } = useContext(AuthContext);
  //hook form
  const { handleSubmit, register, formState } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: localStorage.getItem('email'),
    },
  });

  //memo account
  const [check, setCheck] = useState(
    localStorage.getItem('email') ? true : false
  );
  //post formData
  const [formData, setFormData] = useState();
  const { data, fetchError, isLoading } = useFetch(
    'post',
    '/api/v1/worker/login',
    formData
  );

  //[Feature] Alert UI 需要重新製作
  const [showAlert, setShowAlert] = useState(false);

  const onSubmit = async (values) => {
    setFormData({ ...values }); //delete
    if (check) {
      localStorage.setItem('email', values.email);
    } else {
      localStorage.removeItem('email');
    }
  };

  //[Bug] 因為Express 身份 執權分立, 請重新檢視handler
  useEffect(() => {
    if (fetchError) return;
    if (data?.token) {
      cookie.set('token', data?.token, {
        expires: Date.now() + parseInt(import.meta.env.VITE_EXPIRE),
      });
      setAuthData(data?.data);
      navigator('/exhibition/databoard');
    }
    //[Feature] Alert use Case
    // setShowAlert(true);
    // setTimeout(() => setShowAlert(false), 3000);
  }, [data]);

  return (
    <main className="container mx-auto px-4 ">
      {showAlert && (
        <div className="sticky top-4 alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>帳戶權限! 使用錯誤</span>
        </div>
      )}
      <div className="flex justify-center items-center h-screen">
        <Form
          className="flex flex-col w-full md:w-1/2 gap-5 px-4 border rounded-lg p-6 shadow-md"
          register={register}
          formState={formState}
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-center text-2xl font-bold">後台管理員</h1>
          <Input name={'email'} type="email" placeholder="工作信箱" />
          <Input name={'password'} type="password" placeholder="密碼" />
          <div className="flex gap-2">
            <label className="label cursor-pointer gap-2">
              <input
                onChange={() => setCheck((val) => !val)}
                type="checkbox"
                className="checkbox"
                defaultChecked={check}
              />
              <span className="label-text">記住登入信箱</span>
            </label>
            {/*  */}
            <Link to="/forgetPassword" className="ml-auto btn btn-sm">
              忘記密碼
            </Link>
          </div>
          <p className="text-sm text-red-500">{fetchError}</p>
          <button type="submit" className="btn btn-neutral">
            {isLoading && (
              <span className="loading loading-dots loading-sm"></span>
            )}
            登入
          </button>
        </Form>
      </div>
    </main>
  );
};

export default Login;
