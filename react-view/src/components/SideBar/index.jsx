import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import cookie from 'js-cookie';
import propTypes from 'prop-types';
//icons
import {
  MdMenu,
  MdOutlineKeyboardArrowRight,
  MdLogout,
  MdSwitchAccount,
} from 'react-icons/md';

import { AiOutlineBarChart } from 'react-icons/ai';
import { PiTicketDuotone } from 'react-icons/pi';
import { FaUserCheck } from 'react-icons/fa';

//nested Render Link List
const LinkList = ({ data, rootPath, isAllOpen }) =>
  data.map((item) => (
    <li key={item?.title}>
      {item?.children ? (
        <details open={isAllOpen}>
          <summary>{item?.title}</summary>
          <ul>
            <LinkList data={item?.children} rootPath={item?.path} />
          </ul>
        </details>
      ) : (
        <Link to={`${rootPath}${item?.path}`}>{item.title}</Link>
      )}
    </li>
  ));

const SideBar = ({ isShow, setIsShow }) => {
  const navigate = useNavigate();
  const [isAllOpen, setIsAllOpen] = useState(true);

  const showHandler = () => {
    setIsShow(!isShow);
  };

  //
  useEffect(() => {
    const handleWindowResize = () => {
      if (window.innerWidth < 768) {
        setIsShow(false);
      }
    };

    window.addEventListener('resize', handleWindowResize);
    handleWindowResize(); //重新整理也需要, 判定一次

    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  //SideBarLinkList
  const sideBarLinkList = [
    {
      title: '展覽',
      path: '/exhibition',
      icon: null,
      children: [
        {
          path: '/databoard',
          icon: <AiOutlineBarChart size={24} />,
          title: '展覽統計',
        },
        {
          path: '/control-panel',
          icon: <PiTicketDuotone size={24} />,
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
      title: '公司',
      path: '/workers',
      children: [
        {
          path: '/account',
          icon: null,
          title: '公司帳戶管理',
        },
        {
          path: '/apply',
          icon: null,
          title: '公司帳戶申請',
        },
      ],
    },
  ];

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
      <div
        className={`${
          isShow &&
          ' absolute backdrop-blur-xl top-0 right-0 left-0 bottom-0 z-[1]  md:hidden'
        }`}
      ></div>
      <aside
        className={`md:static flex flex-col h-screen transition-all shadow
      ${isShow ? 'absolute  w-1/4 border-r z-10' : 'w-16 border-r'}
      `}
      >
        {/* 顯示 */}
        <button
          className={`btn btn-square ${isShow ? 'ml-auto' : 'mx-auto'}`}
          type="button"
          onClick={showHandler}
        >
          {isShow ? (
            <MdOutlineKeyboardArrowRight size={24} />
          ) : (
            <MdMenu size={24} />
          )}
        </button>

        <div className="flex flex-col pt-10 px-4 flex-1">
          {isShow ? (
            <h1 className="text-2xl font-medium pb-10">展覽後台管理</h1>
          ) : (
            <p className="pb-10 mx-auto">Lg</p>
          )}
          <button
            className="btn btn-sm me-auto mb-2"
            onClick={() => setIsAllOpen((val) => !val)}
          >
            {`全部${isAllOpen ? '收起' : '展開'}`}
          </button>
          <ul className="menu p-0 gap-2 justify-center">
            <LinkList data={sideBarLinkList} isAllOpen={isAllOpen} />
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
