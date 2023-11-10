import * as yup from 'yup';

//Login schema
const loginSchema = yup
  .object({
    email: yup.string().email('信箱不正確').required('請勿為空'),
    password: yup.string().required('請勿為空'),
  })
  .required();

export default loginSchema;
