const PartnerControlPanel = () => {
  return (
    <div className="container mx-auto pt-12 px-4">
      <h1 className="font-medium text-xl mb-4">策展帳戶管理</h1>

      <div className="flex flex-col gap-2 mb-4">
        <input
          id="account"
          type="search"
          placeholder="輸入搜索帳戶"
          className="input input-bordered w-full max-w-xs"
        />
      </div>

      <ul className="flex">
        <li></li>
      </ul>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>展覽名稱</th>
              <th>策展公司</th>
              <th>策展帳戶</th>
              <th>策展窗口</th>
              <th>帳戶狀態</th>
              <th>詳細資訊</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <td>
                <div className="flex items-center space-x-3">
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
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img
                        src="https://fakeimg.pl/300/"
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">A 公司</div>
                    <div className="text-sm opacity-50">A 策展窗口</div>
                  </div>
                </div>
              </td>
              <td>
                <p>fadatasi@accc.com</p>
              </td>
              <td>
                <p>X 小姐</p>
                <span className="badge badge-ghost badge-sm">職稱</span>
              </td>
              <td>
                <div className="badge badge-error">已經結束</div>
                {/* <div className="badge badge-info">未開始展覽</div> */}
                {/* <div className="badge badge-success">展覽中</div> */}
              </td>
              <td>
                <button className="btn btn-ghost btn-xs">details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartnerControlPanel;
