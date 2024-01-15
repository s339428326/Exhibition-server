const initial = {
  data: [],
};

export const exhibitionAction = {
  INIT: 'EXHIBITION_INIT',
  CREATE: 'EXHIBITION_CREATE',
  UPDATE: 'EXHIBITION_UPDATE',
  REMOVE: 'EXHIBITION_REMOVE',
  DELETE: 'EXHIBITION_DELETE',
};

export const exhibitionReducer = (state = initial, action) => {
  let targetIndex = -1;
  if (action.payload?._id) {
    targetIndex = state.data.findIndex((it) => {
      return it?._id === action.payload?._id;
    });
  }

  switch (action.type) {
    case exhibitionAction.INIT:
      return action.payload
        ? { ...state, data: action.payload }
        : { ...state, data: [] };

    //新增
    case exhibitionAction.CREATE:
      if (targetIndex > -1 || !action?.payload) return state;

      return {
        ...state,
        data: [...state.data, { ...action.payload }],
      };
    //更新
    case exhibitionAction.UPDATE:
      console.log('[Bug Log]', targetIndex, action.payload?._id);
      if (targetIndex === -1) {
        console.error('please check, payload exhibition._id');
        return state;
      }
      return {
        ...state,
        data: state.data.map((it, index) =>
          index === targetIndex ? { ...it, ...action.payload } : it
        ),
      };
    //刪除
    case exhibitionAction.REMOVE:
      if (targetIndex === -1) {
        console.error('please check, payload exhibition._id');
        return state;
      }
      return {
        ...state,
        data: state.data.filter((it) => it?._id !== action.payload?._id),
      };

    case exhibitionAction.DELETE:
      return { ...state, data: [] };
    default:
      return state;
  }
};
