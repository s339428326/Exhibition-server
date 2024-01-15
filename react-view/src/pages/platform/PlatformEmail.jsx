import { useState, useRef, useEffect, useContext } from 'react';
import {
  LiaSortNumericDownAltSolid,
  LiaSortNumericDownSolid,
} from 'react-icons/lia';
import { FaFilter } from 'react-icons/fa';
import DatePicker from '@/components/DatePicker';
import { Editor } from '@tinymce/tinymce-react';
import { AuthContext } from '@/context/AuthProvider';
import useAuth from '@/hooks/useAuth';
import useKeyDown from '@/hooks/useKeyDown';
import useFetch from '@/hooks/useFetch';
import usePost from '@/hooks/usePost';
import useOutSideClick from '@/hooks/useOutSideClick';

// 信箱類型
const EMAIL_TYPES = [
  '全部',
  '分眾促銷',
  '平台活動',
  '節慶促銷',
  '政策公布',
  '重大公佈',
  '其他',
];

//state init state
const FILTER_INIT_DATA = {
  creator: '',
  checker: '',
  type: '',
  isApproved: 'all',
};

const EMAIL_INIT_DATA = {
  subject: '',
  content: '',
  creator: '',
  type: '',
};

// 信箱搜索篩選器
const PlatformFilter = ({
  isShowFilter,
  setIsShowFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  filterData,
  setFilterData,
  getEmailState,
  setEmailList,
  reFetchEmail,
}) => {
  const filterRef = useOutSideClick(() => {
    setIsShowFilter(false);
  });

  return (
    <div
      ref={filterRef}
      className={`transition-all overflow-hidden px-1 ${
        isShowFilter ? 'h-[400px]' : 'h-0'
      }`}
    >
      <button
        className="btn btn-xs"
        type="button"
        onClick={() => {
          // setEmailList(getEmailState?.platformemailData);
          reFetchEmail();
          setFilterData(FILTER_INIT_DATA);
          setStartDate('');
          setEndDate('');
        }}
      >
        清除設定
      </button>
      {/* Filter height: 400px */}
      {/* 時間 */}
      <div>
        <label htmlFor="time-line" className="text-sm text-gray-600">
          信件寄送時間
        </label>
        <div className="flex flex-col gap-2 mb-2">
          <DatePicker
            date={startDate}
            setDate={setStartDate}
            placeholder={'起'}
          />
          <DatePicker date={endDate} setDate={setEndDate} placeholder={'至'} />
        </div>
      </div>

      {/* 是否發送 */}
      <div className="flex flex-col mb-2">
        <label htmlFor="email-classes" className="text-sm text-gray-600">
          信件審核
        </label>
        <select
          value={filterData.isApproved}
          onChange={(e) =>
            setFilterData((pre) => {
              return {
                ...pre,
                isApproved: e.target.options[e.target.selectedIndex].value,
              };
            })
          }
          className="select select-bordered select-sm"
        >
          <option value={'全部'}>全部</option>
          <option value={true}>是</option>
          <option value={false}>否</option>
        </select>
      </div>
      {/* 信件類別 */}
      <div className="flex flex-col mb-2">
        <label htmlFor="email-classes" className="text-sm text-gray-600">
          信件分類
        </label>
        <select
          value={filterData.type}
          onChange={(e) =>
            setFilterData((pre) => {
              return { ...pre, type: e.target.value };
            })
          }
          className="select select-bordered select-sm"
        >
          {EMAIL_TYPES.map((it, index) => (
            <option key={it} value={it}>
              {it}
            </option>
          ))}
        </select>
      </div>
      {/* 寄件人 */}
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">寄件人</span>
        </div>
        <input
          onChange={(e) =>
            setFilterData((pre) => {
              return { ...pre, creator: e.target.value };
            })
          }
          type="text"
          placeholder="寄件人"
          className="input input-sm input-bordered w-full max-w-xs"
        />
      </label>
      {/* 審核人 */}
      <label className="form-control w-full max-w-xs">
        <div className="label">
          <span className="label-text">審核人</span>
        </div>
        <input
          onChange={(e) =>
            setFilterData((pre) => {
              return { ...pre, checker: e.target.value };
            })
          }
          id="checker"
          type="text"
          placeholder="審核人"
          className="input input-sm input-bordered w-full max-w-xs"
        />
      </label>
    </div>
  );
};

//Email 編輯器
const EmailEdit = ({
  isEdit,
  setIsEdit,
  emailData,
  setEmailData,
  editorRef,
  emailSendErr,
  setEmailSendErr,
}) => {
  const handleBackEdit = () => {
    setIsEdit(false);
    setEmailSendErr('');
    setEmailData(EMAIL_INIT_DATA);
    editorRef.current.setContent('');
  };

  useKeyDown('Escape', handleBackEdit);

  return (
    <div
      className={`absolute top-0 right-0 left-0 bottom-0 bg-stone-50 transition-all px-4 py-2 z-10 ${
        !isEdit && 'translate-x-full'
      }`}
    >
      <button className="btn btn-sm" onClick={handleBackEdit} type="button">
        返回
      </button>

      <p className="text-red-500 text-end h-5">{emailSendErr}</p>
      <div className="flex gap-2 items-end mb-4">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">標題</span>
          </div>
          <input
            value={emailData.subject}
            onChange={(e) =>
              setEmailData((pre) => {
                return { ...pre, subject: e.target.value };
              })
            }
            type="text"
            placeholder="請輸入標題"
            className="input input-sm input-bordered w-full max-w-xs"
          />
        </label>
        <div className="flex-1 flex flex-col">
          <label htmlFor="email-classes" className="text-sm text-gray-600">
            信件分類
          </label>
          <select
            value={emailData.type}
            onChange={(e) =>
              setEmailData((pre) => {
                return { ...pre, type: e.target.value };
              })
            }
            className="select select-bordered select-sm"
          >
            {EMAIL_TYPES.map((it) => (
              <option key={it} value={it}>
                {it}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Editor
        apiKey={import.meta.env.VITE_TINY_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={emailData.content}
        onChange={() =>
          setEmailData((pre) => {
            return { ...pre, content: editorRef.current.getContent() };
          })
        }
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'code',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'link image | ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
    </div>
  );
};

//Email清單 左側 Item
const EmailListItem = ({
  item,
  setEmailList,
  setCurrentEmail,
  setIsShowEmail,
}) => {
  return (
    <div>
      <button
        onClick={() => {
          const media = window.matchMedia('(max-width:768px)');
          setCurrentEmail(item);
          if (media.matches) setIsShowEmail(true);
        }}
        type="button"
        className="border px-3 py-2 shadow-md rounded text-sm w-full text-start"
      >
        <div className="flex items-center">
          <small>{new Date(item?.createAt).toLocaleString()}</small>
          {item?.isApproved ? (
            <div className="ml-auto rounded-full bg-green-500 p-1 text-white text-xs">
              已發送
            </div>
          ) : (
            <div className="ml-auto rounded-full bg-red-500 p-1 text-white text-xs">
              待審核
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <div className="flex-1">
            <p>{item?.subject}</p>
            <p>分類：{item?.type}</p>
          </div>
          <div className="flex-1">
            <p className="truncate">建立人: {item?.creator?.name}</p>
            <p className="truncate">
              審核人: {item?.checker?.name ? item?.checker?.name : '未審核'}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
};

//右側Email觀看
const EmailView = ({
  currentEmail,
  emailList,
  setEmailList,
  setIsShowEmail,
}) => {
  const { authData } = useContext(AuthContext);
  const { handlePost: handleSendEmail, isLoading: sendEmailLoad } =
    usePost('patch');

  const sendEmailHandler = async () => {
    const res = await handleSendEmail(
      `/api/v1/platformEmail/${currentEmail?._id}`,
      {
        checker: authData?.id,
      }
    );
    //find index
    const index = emailList.findIndex((it) => it?.id === currentEmail?._id);
    if (index === -1 || !res?.data)
      return console.log('BUG log', res.data, index);
    setEmailList((pre) => {
      const newList = [...pre];
      newList.splice(index, 1, res.data.data);
      console.log(newList, res.data.data);
      return newList;
    });
  };
  return (
    <div className="p-4">
      {currentEmail ? (
        <div>
          <button
            onClick={() => setIsShowEmail(false)}
            className="md:hidden btn btn-sm"
            type="button"
          >
            返回
          </button>

          <div className="flex items-center gap-4">
            <p>
              發送人: {currentEmail?.creator?.email}
              <span className="text-gray-500 text-sm">{`<${currentEmail?.creator?.position}>`}</span>
            </p>
            <p className="text-sm text-gray-500">
              建立日期:{new Date(currentEmail?.createAt).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p>審核人:</p>
            {currentEmail?.checker?.email ? (
              <>
                <span className="text-gray-500 text-sm">
                  {currentEmail?.checker?.email}
                  {`<${currentEmail?.checker?.position}>`}
                </span>
              </>
            ) : (
              <button
                onClick={sendEmailHandler}
                className="btn btn-sm"
                type="button"
                disabled={sendEmailLoad}
              >
                {sendEmailLoad && (
                  <span className="loading loading-spinner loading-sm"></span>
                )}
                審核
              </button>
            )}
            <p className="text-sm text-gray-500">
              審核日期:
              {currentEmail?.sendAt
                ? new Date(currentEmail?.sendAt).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
          <h1 className="text-2xl font-medium mb-4">{currentEmail?.subject}</h1>
          <div dangerouslySetInnerHTML={{ __html: currentEmail?.content }} />
        </div>
      ) : (
        <p className="absolute top-1/2 right-1/2 text-gray-500 translate-x-1/2">
          目前無平台信件
        </p>
      )}
    </div>
  );
};

//平台信件 main FC.
const PlatformEmail = () => {
  useAuth();
  const { authData } = useContext(AuthContext);
  //send Email handler
  const { handlePost: handleEmail } = usePost();
  const [emailSendErr, setEmailSendErr] = useState('');
  //view is Show state
  const [isEdit, setIsEdit] = useState(false);
  const [isShowFilter, setIsShowFilter] = useState(false);
  const [isShowEmail, setIsShowEmail] = useState(false);
  //filter state
  const [searchTitle, setSearchTitle] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [filterData, setFilterData] = useState(FILTER_INIT_DATA);
  const [emailData, setEmailData] = useState(EMAIL_INIT_DATA);
  //sorting state
  const [sortData, setSortData] = useState({
    time: 'close', // true 新在前, false 舊在前, close 關閉
    isApproved: 'close', // true審核在前, false 未審核在前false, close 關閉
  });
  //email list state
  const [emailList, setEmailList] = useState();
  const {
    data: getEmailState,
    fetchError: emailListError,
    isLoading: emailListLoad,
    reFetchFn: reFetchEmail,
  } = useFetch('get', '/api/v1/platformEmail');

  const [currentEmail, setCurrentEmail] = useState();

  //email view init©
  useEffect(() => {
    if (getEmailState?.platformemailData) {
      setCurrentEmail(getEmailState?.platformemailData[0]);
      setEmailList(getEmailState?.platformemailData);
    }
  }, [emailListLoad]);

  //text edit
  const editorRef = useRef(null);
  const emailHandler = async () => {
    if (!isEdit) return setIsEdit(true);

    if (emailData.subject === '' || emailData.content === '')
      return setEmailSendErr('請確認表格是否正確填寫');
    if (emailData.type === '') return setEmailSendErr('請選擇類型');

    const res = await handleEmail('/api/v1/platformEmail', {
      ...emailData,
      creator: authData.id,
    });

    if (!res?.data) return setEmailSendErr('伺服器錯誤, 請通知資訊部同仁');

    setEmailList((pre) => {
      return [
        {
          ...res.data.data,
          creator: { ...authData, name: authData.username },
        },
        ...pre,
      ];
    });
    //re-setting init emailEdit Data state and errMsg state
    setIsEdit(false);
    setEmailData(EMAIL_INIT_DATA);
    setCurrentEmail({
      ...res.data.data,
      creator: { ...authData, name: authData.username },
    });
    //clean tinyMCE editor
    editorRef.current.setContent('');
  };

  //filterEmails
  const filterEmails = () => {
    let newList = [...getEmailState?.platformemailData];
    const time = (date) => new Date(date).getTime();

    //信件審核
    switch (filterData.isApproved) {
      case 'true':
        newList = newList.filter((it) => it.isApproved);
        break;
      case 'false':
        newList = newList.filter((it) => !it.isApproved);
        break;
    }

    // switch(filterData.type)
    if (filterData.type.length) {
      newList = newList.filter((it) => it.type === filterData.type);
    }

    if (filterData.creator.length) {
      newList = newList.filter((it) => {
        return it.creator?.name === filterData.creator;
      });
    }
    if (filterData.checker.length) {
      newList = newList.filter((it) => it.checker?.name === filterData.checker);
    }

    //信件寄送時間
    if (startDate && endDate) {
      newList = newList.filter(
        (it) =>
          time(it.createAt) > time(startDate) &&
          time(it.createAt) < time(endDate)
      );
    }

    if (startDate && !endDate) {
      newList = newList.filter((it) => time(it.createAt) > time(startDate));
    } else if (endDate && !startDate) {
      newList = newList.filter((it) => time(it.createAt) < time(endDate));
    }

    setEmailList(newList);
  };

  useEffect(() => {
    if (emailList) filterEmails();
  }, [startDate, endDate, filterData]);

  //email list sort
  const sortEmails = () => {
    if (emailList?.length) {
      let list = [...emailList];

      list?.sort((n1, n2) =>
        sortData.time
          ? new Date(n1.createAt).getTime() - new Date(n2.createAt).getTime()
          : new Date(n2.createAt).getTime() - new Date(n1.createAt).getTime()
      );

      list?.sort((n1, n2) =>
        sortData.isApproved
          ? n2.isApproved - n1.isApproved
          : n1.isApproved - n2.isApproved
      );
      setEmailList(list);
    }
  };

  useEffect(() => {
    sortEmails();
  }, [sortData.time, sortData.isApproved]);

  return (
    <div className="my-4 container mx-auto">
      {/* Header */}
      <div className="mx-4">
        <div className="flex items-center rounded-t-xl p-3 bg-indigo-600 drop-shadow-2xl gap-3">
          <h1 className="hidden md:block text-xl font-medium mr-20 text-white">
            平台信件
          </h1>
          <input
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            type="search"
            placeholder="搜索信箱標題"
            className="input input-bordered w-full md:max-w-xs rounded-full h-[36px]"
          />
          <button
            onClick={emailHandler}
            className="btn btn-sm ml-auto"
            type="button"
          >
            {isEdit ? '建立信件' : '新增信件'}
          </button>
        </div>
      </div>
      {/* Body */}
      <div className="relative flex flex-col lg:flex-row gap-2 mx-4  shadow-sm border rounded-b-md h-[80vh] overflow-hidden">
        {/* Left Email side bar */}
        <div
          className={`absolute bg-base-100 top-0 bottom-0 md:static md:bg-transparent w-full lg:w-[28%] p-2 border-r z-10 transition-all ${
            isShowEmail && '-translate-x-full'
          }`}
        >
          <div className="flex items-center">
            <button
              className="btn btn-sm flex items-center gap-1 mb-2 mr-auto"
              onClick={() => setIsShowFilter((pre) => !pre)}
            >
              <FaFilter />
              <p className="text-sm">篩選器</p>
            </button>

            <button
              onClick={() =>
                setSortData((pre) => {
                  return { ...pre, isApproved: !pre.isApproved };
                })
              }
              className="btn btn-xs mr-1"
              type="button"
            >
              {sortData.isApproved ? '已審核' : '未審核'}
            </button>
            <button
              onClick={() =>
                setSortData((pre) => {
                  return { ...pre, time: !pre.time };
                })
              }
              className="btn btn-xs"
              type="button"
            >
              排序時間
              {sortData.time ? (
                <LiaSortNumericDownSolid />
              ) : (
                <LiaSortNumericDownAltSolid />
              )}
            </button>
          </div>

          <PlatformFilter
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            filterData={filterData}
            setFilterData={setFilterData}
            isShowFilter={isShowFilter}
            setIsShowFilter={setIsShowFilter}
            getEmailState={getEmailState}
            setEmailList={setEmailList}
            reFetchEmail={reFetchEmail}
          />
          <ul className="flex flex-col gap-2 overflow-y-scroll h-[80vh]">
            {emailList
              ?.filter((email) =>
                searchTitle ? email.subject.match(searchTitle) : email
              )
              ?.map((it) => (
                <li key={it?._id}>
                  <EmailListItem
                    item={it}
                    setEmailList={setEmailList}
                    setCurrentEmail={setCurrentEmail}
                    setIsShowEmail={setIsShowEmail}
                  />
                </li>
              ))}
          </ul>
        </div>
        {/* Right Email Content */}
        {/* Email View Layout */}
        <div className="flex-1 border-l relative overflow-hidden">
          {/* Email Content Temp. */}
          <EmailView
            currentEmail={currentEmail}
            emailList={emailList}
            setEmailList={setEmailList}
            setIsShowEmail={setIsShowEmail}
          />
          {/* Email Edit */}
          <EmailEdit
            editorRef={editorRef}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
            emailData={emailData}
            setEmailData={setEmailData}
            emailSendErr={emailSendErr}
            setEmailSendErr={setEmailSendErr}
          />
        </div>
      </div>
    </div>
  );
};

export default PlatformEmail;
