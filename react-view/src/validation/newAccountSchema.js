//[Bug] 確認在 NewPartner 元件中作用時否移除此檔案
import * as yup from 'yup';

//Login schema
const newAccountSchema = yup
  .object({
    email: yup.string().email('信箱不正確').required('請勿為空'),
    password: yup.string().required('請勿為空'),
  })
  .required();

export default newAccountSchema;
