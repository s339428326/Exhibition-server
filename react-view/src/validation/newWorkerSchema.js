//[Bug] 確認在 NewPartner 元件中作用時否移除此檔案
import * as yup from 'yup';

//還沒填完
const newWorkerSchema = yup
  .object({
    username: yup.string(),
    email: yup.string().email('信箱不正確').required('請勿為空'),
  })
  .required();

export default newWorkerSchema;
