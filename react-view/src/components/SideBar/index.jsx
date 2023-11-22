import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, NavLink, useLocation } from 'react-router-dom';

import cookie from 'js-cookie';
import propTypes from 'prop-types';
//icons
import {
  MdMenu,
  MdOutlineKeyboardArrowLeft,
  MdLogout,
  MdSwitchAccount,
} from 'react-icons/md';

import { BsCardChecklist } from 'react-icons/bs';
import { AiOutlineBarChart, AiFillFund } from 'react-icons/ai';
import { PiTicketDuotone } from 'react-icons/pi';
import { FaUserCheck } from 'react-icons/fa';

//SideBarLinkList
const sideBarLinkList = [
  {
    title: '展覽',
    path: '/exhibition',
    icon: <PiTicketDuotone size={24} />,
    children: [
      {
        path: '/databoard',
        icon: <AiOutlineBarChart size={24} />,
        title: '展覽統計',
      },
      {
        path: '/control-panel',
        icon: <BsCardChecklist size={24} />,
        title: '展覽管理',
      },
    ],
  },
  {
    title: '合作夥伴',
    path: '/partner',
    children: [
      {
        path: '/account',
        icon: <MdSwitchAccount size={24} />,
        title: '夥伴帳戶管理',
      },
      {
        path: '/apply',
        icon: <FaUserCheck size={24} />,
        title: '夥伴帳戶申請',
      },
    ],
  },
  {
    title: '平台',
    path: '/platform',
    children: [
      {
        path: '/email',
        icon: null,
        title: '平台信件',
      },
      {
        path: '/message',
        icon: null,
        title: '平台通知',
      },
    ],
  },
  {
    title: '公司員工',
    path: '/workers',
    children: [
      {
        path: '/account/department',
        icon: null,
        title: '員工帳戶管理',
      },
      {
        path: '/apply',
        icon: null,
        title: '新增員工帳戶',
      },
    ],
  },
];

const LinkList = ({
  data,
  isAllOpen,
  setIsAllOpen,
  isShow,
  setIsShow,
  _rootPath,
}) => {
  return data.map((item) => (
    <li key={item?.title}>
      {item?.children ? (
        <details open={isAllOpen}>
          <summary
            className={`${!isShow && 'after:hidden p-0'}`}
            onClick={() => setIsShow(true)}
          >
            <span>{item.icon}</span>
            {isShow && item?.title}
          </summary>

          <ul>
            {isShow && (
              <LinkList data={item?.children} _rootPath={item?.path} />
            )}
          </ul>
        </details>
      ) : (
        <NavLink to={`${_rootPath}${item?.path}`}>
          {item.icon} {item.title}
        </NavLink>
      )}
    </li>
  ));
};
const SideBar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isShow, setIsShow] = useState(true);
  const [isAllOpen, setIsAllOpen] = useState(true);

  const showHandler = () => {
    setIsShow(!isShow);
    setIsAllOpen(false);
  };

  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth < 768) {
        setIsAllOpen(false);
        setIsShow(false);
      } else {
        setIsShow(true);
      }
    };

    window.addEventListener('resize', handleWindowResize);
    handleWindowResize(); //重新整理也需要, 判定一次

    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsShow(false);
    }
  }, [pathname]);

  //[Feature] 變換
  // const [theme, setTheme] = useState(null);
  // const switchThemeHandler = () => {
  //   setTheme(theme !== 'dark' ? 'dark' : 'light');
  // };

  const logoutHandler = () => {
    cookie.remove('token');
    navigate('/');
  };

  return (
    <>
      {/* 手機模糊背景 */}
      <div
        className={`${
          isShow &&
          ' absolute backdrop-blur-xl top-0 right-0 left-0 bottom-0 z-[1]  md:hidden'
        }`}
      ></div>
      {/* 側邊欄 */}
      <aside
        className={`sm:static flex sm:flex-col sm:h-screen transition-all shadow
      ${
        isShow
          ? 'absolute flex flex-col gap-4 h-screen sm:border-r z-10 w-full md:w-1/4 bottom-0 right-0 left-0 top-0 p-4 sm:p-0'
          : 'absolute bottom-0 right-0 left-0 border sm:w-16 sm:border-r'
      }
      `}
      >
        {/* 顯示 */}
        <button
          className={`btn btn-square ${isShow ? 'sm:ml-auto' : 'sm:mx-auto'}`}
          type="button"
          onClick={showHandler}
        >
          {isShow ? (
            <MdOutlineKeyboardArrowLeft size={24} />
          ) : (
            <MdMenu size={24} />
          )}
        </button>

        <div
          className={`flex sm:flex-col sm:gap-2 sm:pt-10 sm:px-4 sm:flex-1 ${
            isShow && 'flex-col'
          }`}
        >
          {isShow ? (
            <h1 className="text-2xl font-medium pb-10">展覽後台管理</h1>
          ) : (
            <p className="sm:pb-10 sm:mx-auto">Lg</p>
          )}

          {isShow && (
            <button
              className="btn btn-sm me-auto mb-2"
              onClick={() => setIsAllOpen((val) => !val)}
            >
              {`全部${isAllOpen ? '收起' : '展開'}`}
            </button>
          )}

          <ul className="menu p-0 gap-2 sm:justify-center">
            <LinkList
              data={sideBarLinkList}
              isAllOpen={isAllOpen}
              setIsAllOpen={setIsAllOpen}
              isShow={isShow}
              setIsShow={setIsShow}
            />
          </ul>

          <button className="flex gap-2  mb-4 mt-auto" onClick={logoutHandler}>
            <MdLogout size={24} />
            {isShow && <span>登出</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

SideBar.propTypes = {
  isShow: propTypes.bool,
  setIsShow: propTypes.func,
};

export default SideBar;
