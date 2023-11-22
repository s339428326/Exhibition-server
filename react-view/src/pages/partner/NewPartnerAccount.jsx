import useAuth from '@/hooks/useAuth';

import newAccountSchema from '../../validation/newAccountSchema';

import Form from '../../components/Form';
import Input from '../../components/Input';
import Modal from '../../components/Modal/Modal';
import ModalBtn from '../../components/Modal/ModalBtn';

const NewPartnerAccount = () => {
  // JSON to Excel
  // (https://docs.sheetjs.com/docs/demos/frontend/react/)
  const { data } = useAuth();
  const onSubmit = (data) => console.log(data);

  return (
    <div className="container mx-auto px-4 pt-12">
      <Modal modalId={'newAccountModal'}>
        <p>ID: 申請表單ID</p>
        <p>自動使用聯絡信箱作為帳戶</p>
        <p>隨機生成密碼</p>
        <p>展覽名稱</p>
        <p>展覽證明文件上傳</p>
        <p>將公司帳戶拆離目前設計</p>
        <p>審查員工帳戶</p>
        <p>審查紀錄</p>

        {/* From 參考 */}
        {/* <Form className="" onSubmit={onSubmit} schema={newAccountSchema}>
          <Input name={'email'} type="email" placeholder="工作信箱" />
          <Input name={'password'} type="password" placeholder="密碼" />
          <p className="text-sm text-red-500">{fetchError}</p>
        <button type="submit" className="btn btn-wide mx-auto">
          {isLoading && (
            <span className="loading loading-dots loading-sm"></span>
          )}
          登入
        </button>
        </Form> */}
      </Modal>

      <h1 className="text-2xl font-medium  mb-4">帳戶審查</h1>

      {/* Feature JSON to Excel or Number */}
      <ul className="flex justify-end gap-2">
        <li>
          <button className="btn btn-sm">輸出檔案</button>
        </li>
      </ul>

      <table className="table table-xs md:table-sm lg:table-md ">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>審查按鈕</th>
            <th>展覽名稱</th>
            <th>申請時間</th>
            <th>申請狀態</th>
          </tr>
        </thead>
        <tbody>
          {/* row 1 */}
          <tr>
            <td>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </td>
            <td className="">
              <ModalBtn className="btn btn-sm mb-2" modalId="newAccountModal">
                審查
              </ModalBtn>
            </td>
            <td>
              <div className="flex flex-wrap items-center space-x-3">
                <div className="avatar">
                  <div className="mask mask-squircle w-12 h-12">
                    <img
                      src="https://fakeimg.pl/300/"
                      alt="Avatar Tailwind CSS Component"
                    />
                  </div>
                </div>
                <div>
                  <div className="font-bold">展覽名稱</div>
                  <div className="text-sm opacity-50">地區</div>
                </div>
              </div>
            </td>

            <td>
              <p>2023/10/28</p>
            </td>
            <td>
              <div className="badge badge-error">已經結束</div>
              {/* <div className="badge badge-info">未開始展覽</div> */}
              {/* <div className="badge badge-success">展覽中</div> */}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NewPartnerAccount;
