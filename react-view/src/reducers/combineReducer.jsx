//參考：
//https://medium.com/enjoy-life-enjoy-coding/react-%E5%9C%A8-hooks-%E4%B8%AD%E4%BB%A5-usecontext-%E8%88%87-usereducer-%E5%AF%A6%E7%8F%BE-redux-3a8aa403d9e4

//仿製 Redux
//https://github.com/reduxjs/redux/blob/master/src/combineReducers.ts

/**
 *
 * @param {Object} reducers
 * {worker:workerReducer, department:departmentReducer}
 * @returns reducer function or
 */

const combineReducer = (reducers) => {
  let objectInitState = {}; // 設置當前使用reducers 總初始狀態
  const reducerKeys = Object.keys(reducers); //將所有key naming 做成arr

  reducerKeys.forEach((key) => {
    // 觸發 switch case default 給予objectInitState該reducer初始state
    const initState = reducers[key](undefined, { type: '' });
    if (initState === undefined) {
      throw new Error(
        `${key} reducer 未設置 初始狀態, 請至該設定reducer 設置initState`
      );
    }
    //設置reducers init state
    objectInitState[key] = initState;
  });

  //回傳替代使用useReducer(reducer, initState) reducer 參數位置
  //reducer => function(state, action){...}
  //透過以下統一管理reducers
  return (state, action) => {
    //如果外部上下文使用, action 會新
    if (action) {
      reducerKeys.forEach((key) => {
        //觸發該reducer
        objectInitState[key] = reducers[key](state[key], action);
      });
    }
    //如果沒action 參數, return 目前總reducers 初始狀態
    return { ...objectInitState };
  };
};

export default combineReducer;
