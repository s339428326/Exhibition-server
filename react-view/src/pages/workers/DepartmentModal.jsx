//部門詳細內容表單
const DepartmentModal = ({ data }) => {
  return (
    <div className="border rounded">
      {/* 項目名稱 */}
      <p>Test Modal props data(Modal Content): {data}</p>
      <div className="flex items-center border-b mr-4">
        <p className="border-r flex-1 text-center p-1 bg-slate-300">員工名稱</p>
        <p className="border-r flex-1 text-center p-1 bg-slate-300">職位</p>
        <p className="flex-1 text-center p-1 bg-slate-300">狀態</p>
      </div>
      <ul className="overflow-y-scroll max-h-32">
        <li className="flex border-b">
          <p className="border-r flex-1 p-1">test user1</p>
          <p className="border-r flex-1 p-1">manger</p>
          <p className="border-r flex-1 p-1">false</p>
        </li>
        {/* last index className not included border-b*/}
        <li className="flex">
          <p className="border-r flex-1 p-1">test user1</p>
          <p className="border-r flex-1 p-1">manger</p>
          <p className="border-r flex-1 p-1">false</p>
        </li>
      </ul>
    </div>
  );
};

export default DepartmentModal;
