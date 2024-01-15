import { useEffect, useState } from 'react';
import { MdCalendarToday } from 'react-icons/md';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { MdKeyboardArrowRight } from 'react-icons/md';

import useOutSideClick from '@/hooks/useOutSideClick';

/**
 *
 * @param {String, FC} Icon  不使用Icon prop put 'none'
 * @returns
 */

const DatePicker = ({
  date,
  setDate,
  placeholder = '請選擇日期',
  Icon = <MdCalendarToday />,
}) => {
  // 非點擊該元素關閉Hook
  const datePickerRef = useOutSideClick(() => setIsShow(false));
  // 用戶選擇日期
  // const [date, setDate] = useState();
  // 日曆UI show state
  const [isShow, setIsShow] = useState(false);
  // 日曆 日期List
  const [dateView, setDateView] = useState({
    date: new Date(), //2024
    dayHeader: [],
    dayList: [],
    dayFooter: [],
  });

  //arrow button month
  const nextMonthHandler = () => {
    setDateView((pre) => {
      const newDate = new Date(pre.date);
      newDate.setMonth(newDate.getMonth() + 1);
      return { ...pre, date: newDate };
    });
  };

  const preMonthHandler = () => {
    setDateView((pre) => {
      const newDate = new Date(pre.date);
      newDate.setMonth(newDate.getMonth() - 1);
      return { ...pre, date: newDate };
    });
  };

  //select date button
  const selectDateHandler = (day) => () => {
    setDate(
      new Date(dateView.date.getFullYear(), dateView.date.getMonth(), day)
    );
  };

  //Esc key handler
  useEffect(() => {
    const keyCloseHandler = (e) => {
      if (e.key === 'Escape') {
        setIsShow(false);
      }
    };
    window.addEventListener('keydown', keyCloseHandler);
    return () => window.removeEventListener('keydown', keyCloseHandler);
  }, []);

  //select date show toggle
  useEffect(() => {
    setIsShow(false);
  }, [date]);

  //datePicker view render
  useEffect(() => {
    const TOTAL_DATE_COUNT = 42;
    //1. 上一個月份最後日期
    const preLastDay = new Date(
      dateView.date.getFullYear(),
      dateView.date.getMonth(),
      0
    );
    //2. 當月第一個日期
    const firstDay = new Date(
      dateView.date.getFullYear(),
      dateView.date.getMonth(),
      1
    );
    //3. 當月最後一個日期
    const lastDay = new Date(
      dateView.date.getFullYear(),
      dateView.date.getMonth() + 1,
      0
    );

    const dayHeader = Array.from(
      { length: firstDay.getDay() },
      (_, index) => preLastDay.getDate() - firstDay.getDay() + index + 1
    );

    const dayList = Array.from(
      { length: lastDay.getDate() },
      (_, index) => index + 1
    );

    const dayFooter = Array.from(
      {
        length: TOTAL_DATE_COUNT - dayList.length - dayHeader.length,
      },
      (_, index) => index + 1
    );

    setDateView((pre) => {
      return {
        ...pre,
        dayHeader,
        dayList,
        dayFooter,
      };
    });
  }, [dateView.year, dateView.month, dateView.date]);

  return (
    <div
      ref={datePickerRef}
      className="relative px-2 py-1 flex items-center gap-1 border rounded-md "
      onClick={() => setIsShow(true)}
    >
      {/* Icon Component*/}
      {Icon !== 'none' && Icon}
      {/* control Date change */}
      <input
        className="outline-none"
        placeholder={placeholder}
        type="text"
        value={date ? `${date?.toLocaleDateString()}` : ''}
        readOnly
      />
      {/* Date View */}
      <div
        className={`absolute top-[110%] left-0 right-0 transition-all overflow-hidden min-w-[230px] z-[9999] ${
          isShow ? 'h-[252px]' : 'h-0'
        }`}
      >
        <div className="border rounded-md overflow-hidden">
          {/* header */}
          <div className="flex items-center bg-black p-2 ">
            <p className="text-red-500 text-3xl font-medium mr-auto">
              {dateView.date.toLocaleDateString().split('/')[0]}
            </p>
            <strong className="mr-auto text-white">
              {dateView.date.toLocaleDateString().split('/')[1]}月
            </strong>
            <button className="mr-2" onClick={preMonthHandler}>
              <MdKeyboardArrowLeft color="white" />
            </button>
            <button onClick={nextMonthHandler}>
              <MdKeyboardArrowRight color="white" />
            </button>
          </div>
          <div className="grid grid-cols-7 bg-white">
            {/* Date header */}
            <p className="col-span-1 text-center text-gray-500 font-medium">
              日
            </p>
            <p className="col-span-1 text-center text-gray-500 font-medium">
              一
            </p>
            <p className="col-span-1 text-center text-gray-500 font-medium">
              二
            </p>
            <p className="col-span-1 text-center text-gray-500 font-medium">
              三
            </p>
            <p className="col-span-1 text-center text-gray-500 font-medium">
              四
            </p>
            <p className="col-span-1 text-center text-gray-500 font-medium">
              五
            </p>
            <p className="col-span-1 text-center text-gray-500 font-medium">
              六
            </p>
            {/* day header */}
            {dateView?.dayHeader.map((it, index) => (
              <button
                disabled={true}
                key={`dateHeader-${index}`}
                className="col-span-1 font-medium flex items-center justify-center"
              >
                <p className="flex items-center justify-center rounded-full w-[24px] h-[24px] text-gray-200">
                  {it}
                </p>
              </button>
            ))}

            {dateView?.dayList.map((it, index) => (
              <button
                onClick={selectDateHandler(it)}
                key={`dayList-${index}`}
                className="col-span-1 font-medium flex items-center justify-center"
              >
                {/* border border-red-500 */}
                <p
                  className={`hover:bg-gray-300 flex items-center justify-center rounded-full w-[24px] h-[24px] ${
                    it === new Date().getDate() &&
                    dateView.date.getMonth() === new Date().getMonth() &&
                    dateView.date.getFullYear() === new Date().getFullYear() &&
                    'border-2 border-red-500'
                  }`}
                >
                  {it}
                </p>
              </button>
            ))}

            {dateView?.dayFooter.map((it, index) => (
              <button
                disabled={true}
                key={`dateHeader-${index}`}
                className="col-span-1 font-medium flex items-center justify-center"
              >
                <p className="flex items-center justify-center rounded-full w-[24px] h-[24px] text-gray-200">
                  {it}
                </p>
              </button>
            ))}
          </div>
          <div className="border-t flex justify-between bg-white">
            <button
              onClick={() => setDate('')}
              className="text-sm underline px-2 py-1"
              type="button"
            >
              清除
            </button>
            <button
              onClick={() => {
                setDateView((pre) => {
                  return { ...pre, date: new Date() };
                });
              }}
              className="text-sm underline px-2 py-1"
              type="button"
            >
              復原
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
