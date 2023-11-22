//[Bug] 確認在 NewPartner 元件中作用時否移除此檔案
import * as yup from 'yup';

//Login schema
const newDepartmentSchema = yup
  .object({
    name: yup
      .string()
      .matches(/^[\u4E00-\u9FFF]+$/, '必須輸入中文') //ref to chatGPT regx
      .required('請勿為空'),
    memberCount: yup.number().positive().required('請勿為空'),
  })
  .required();

export default newDepartmentSchema;
