import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import propTypes from 'prop-types';
import { MdCheckBoxOutlineBlank } from 'react-icons/md';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const NewWorkerPDF = ({ workerData }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const captureRef = useRef();

  const pdfHandler = async () => {
    const capture = captureRef.current;
    setIsLoading(false);
    try {
      const canvas = await html2canvas(capture);
      const pdf = new jsPDF('p', 'mm', 'a4');
      //get Base64
      const imgData = canvas.toDataURL('img/png');
      const componentWidth = pdf.internal.pageSize.getWidth();
      const componentHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
      pdf.save(
        `${workerData?.worker?.name}-${workerData?.worker?.id}-${Date.now()}`
      );
    } catch (error) {
      console.error('[PDF reader Error]', error);
    }
  };

  return (
    <div className="container mx-auto pt-12 px-12">
      <div
        ref={captureRef}
        className="w-[595px] h-[842px] px-3 mx-auto text-xs"
      >
        <p className="text-center text-4xl font-bold py-4">Logo</p>
        <div className="flex justify-between items-center">
          <h1 className="text-xl mb-2">員工入職表</h1>
          <div className="flex flex-col items-end">
            <p>建置文件於:{new Date().toLocaleDateString()}</p>
            <p>文件編號:{workerData?.worker?.id}</p>
          </div>
        </div>
        <div className="grid grid-cols-12 border-2 border-black">
          {/* row-1 start */}
          <div className="col-span-3 p-2 border-r border-b border-black">
            姓名:{workerData?.worker?.name}
          </div>
          <div className="col-span-3 p-2 border-r border-b border-black">
            出生日期:
          </div>
          <div className="col-span-3 p-2 border-r border-b border-black">
            身分證:
          </div>
          <div className="col-span-2 p-2 border-black"></div>
          {/* row-1 end */}
          {/* row-2 start */}
          <div className="col-span-2 p-2 border-r border-b border-black">
            血型:
          </div>
          <div className="col-span-3 p-2 border-r border-b border-black flex gap-1">
            <span className="mr-1">婚姻:</span>
            <div className="flex gap-1 items-center">
              <MdCheckBoxOutlineBlank />
              <span>未婚</span>
            </div>
            <div className="flex gap-1 items-center">
              <MdCheckBoxOutlineBlank />
              <span>未婚</span>
            </div>
          </div>
          <div className="col-span-4 p-2 border-r border-b border-black flex gap-1">
            <span className="mr-1">駕照:</span>
            <div className="flex items-center">
              <MdCheckBoxOutlineBlank />
              <span>無</span>
            </div>
            <div className="flex items-center">
              <MdCheckBoxOutlineBlank />
              <span>機車</span>
            </div>
            <div className="flex items-center">
              <MdCheckBoxOutlineBlank />
              <span>汽車</span>
            </div>
          </div>
          <div className="col-span-2"></div>
          {/* row-2 end*/}
          {/* row-3 start */}
          <div className="col-span-9 p-2  border-r border-b border-black">
            戶籍地址:
          </div>
          <div className="col-span-3 flex justify-center items-center">
            員工照片
          </div>
          {/* row-3 end */}
          {/* row-4 start */}
          <div className="col-span-9 p-2 border-r border-b border-black">
            聯絡地址:
          </div>
          {/* row-4 end */}
          {/* row-5 start */}
          <div className="col-span-4 p-2 border-r border-black">聯絡電話:</div>
          <div className="col-span-5 p-2 border-r border-black">手機</div>
          {/* row-5 end */}
          {/* row-6 start */}
          <div className="col-span-full p-2 text-center border-t border-b border-black bg-slate-300">
            學歷
          </div>
          <div className="p-2 col-span-3 border-r border-b border-black text-center">
            學校名稱
          </div>
          <div className="p-2 col-span-3 border-r border-b border-black text-center">
            科系
          </div>
          <div className="p-2 col-span-3 border-r border-b border-black text-center">
            在學期間
          </div>
          <div className="p-2 col-span-3 border-b border-black text-center">
            畢肄業
          </div>
          {Array.from(Array(8).keys()).map((item) => (
            <div
              key={`s1-${item}`}
              className={`p-2 col-span-3 ${
                (item + 1) % 4 !== 0 && 'border-r'
              } border-b border-black text-center text-transparent`}
            >
              1
            </div>
          ))}
          <div className="col-span-full p-2 border-b border-black text-center bg-slate-300">
            工作經歷
          </div>
          <div className="p-2 col-span-3 border-r border-b border-black text-center">
            服務單位
          </div>
          <div className="p-2 col-span-3 border-r border-b border-black text-center">
            職稱
          </div>
          <div className="p-2 col-span-3 border-r border-b border-black text-center">
            工作說明
          </div>
          <div className="p-2 col-span-3 border-b border-black text-center">
            在職期間
          </div>
          {Array.from(Array(8).keys()).map((item) => (
            <div
              key={`s2-${item}`}
              className={`p-2 col-span-3 ${
                (item + 1) % 4 !== 0 && 'border-r'
              } border-b border-black text-center text-transparent`}
            >
              1
            </div>
          ))}
          <div className="col-span-6 p-2 text-center border-r border-b border-black bg-slate-300">
            語言
          </div>
          <div className="col-span-6 p-2 text-center border-b border-black bg-slate-300">
            證照
          </div>
          <div className="col-span-3 p-2 border-r border-b border-black text-center">
            名稱
          </div>
          <div className="col-span-3 p-2 border-r border-b border-black text-center">
            評比
          </div>
          <div className="col-span-3 p-2 border-r border-b border-black text-center">
            名稱
          </div>
          <div className="col-span-3 p-2  border-b border-black text-center">
            評比
          </div>
          {Array.from(Array(8).keys()).map((item) => (
            <div
              key={`s3-${item}`}
              className={`p-2 col-span-3 ${
                (item + 1) % 4 !== 0 && 'border-r'
              } border-b border-black text-center text-transparent`}
            >
              1
            </div>
          ))}
          <div className="col-span-6 border-r border-b border-black p-2">
            緊急聯絡人:
          </div>
          <div className="col-span-6 border-b border-black p-2">
            緊急聯絡人電話:
          </div>
          <div className="col-span-3 p-2">入職人員簽名:</div>
          <div className="col-span-3 p-2">審核人員:</div>
          <div className="col-span-3 p-2">部門主管:</div>
          <div className="col-span-3 p-2">執行長:</div>
        </div>
        <ul className="list-decimal pl-4 mb-2">
          <li>開發部門請填寫, 工作用筆電清單</li>
          <li>表中提及證照及學歷請提供複本</li>
          <li>填寫完成後請將正本交於人資部作業, 請勿列印或備份</li>
        </ul>
        <p>員工帳戶預設密碼:{workerData?.password}</p>
        <p>密碼請自行保管, 並在登入後更改密碼保證帳戶安全</p>
      </div>
      <div className="flex gap-4 justify-center my-4">
        <button className="btn btn-lg" onClick={pdfHandler}>
          下載表單 {isLoading && 'reading..'}
        </button>
        <Link to={`/workers/account/worker`} className="btn btn-lg">
          回到員工列表
        </Link>
      </div>
      <p className="text-center ">
        資訊部同仁請注意, 偽照個資及串改文件公司將追娑法律責任及賠償
      </p>
    </div>
  );
};

export default NewWorkerPDF;

NewWorkerPDF.propTypes = {
  workerData: propTypes.any,
};
