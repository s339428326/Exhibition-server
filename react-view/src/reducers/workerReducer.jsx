const initial = {
  data: [],
};

export const workerAction = {
  INIT: 'WORKER_INIT',
  CREATE: 'WORKER_CREATE',
  UPDATE: 'WORKER_UPDATE',
  REMOVE: 'WORKER_REMOVE',
  DELETE: 'WORKER_DELETE',
};

export const workerReducer = (state = initial, action) => {
  let targetIndex = -1;
  if (action.payload?._id) {
    targetIndex = state.data.findIndex((it) => it?._id === action.payload?._id);
  }

  switch (action.type) {
    case workerAction.INIT:
      return action.payload
        ? { ...state, data: action.payload }
        : { ...state, data: [] };

    //新增
    case workerAction.CREATE:
      if (targetIndex > -1 || !action?.payload) return state;

      return {
        ...state,
        data: [...state.data, action.payload],
      };
    //更新
    case workerAction.UPDATE:
      if (targetIndex === -1) {
        console.error('please check, payload worker._id');
        return state;
      }
      return {
        ...state,
        data: state.data.map((it, index) =>
          index === targetIndex ? { ...it, ...action.payload } : it
        ),
      };
    //刪除單一員工
    case workerAction.DELETE:
      if (targetIndex === -1) {
        console.error('please check, payload worker._id');
        return state;
      }
      return {
        ...state,
        data: state.data.filter((it) => it?._id !== action.payload?._id),
      };

    case workerAction.REMOVE:
      if (targetIndex === -1) {
        console.error('please check, payload worker._id');
        return state;
      }

      return { ...state, data: [] };
    default:
      return state;
  }
};
