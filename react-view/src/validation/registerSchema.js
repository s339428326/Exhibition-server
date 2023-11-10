import * as yup from 'yup';

//Login schema
const registerSchema = yup
  .object({
    email: yup.string().email('信箱不正確').required('請勿為空'),
    password: yup.string().required('請勿為空'),
    confirmPassword:
      //disable to wrap object
      yup.string().oneOf([yup.ref('password')], '密碼不相同請重新確認'),
  })
  .required();

export default registerSchema;
