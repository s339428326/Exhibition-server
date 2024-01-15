const initial = {
  data: [],
};

export const departmentAction = {
  INIT: 'DEPARTMENT_INIT',
  CREATE: 'DEPARTMENT_CREATE',
  ADD: 'DEPARTMENT_ADD',
  UPDATE: 'DEPARTMENT_UPDATE',
  REMOVE: 'DEPARTMENT_REMOVE',
  DELETE: 'DEPARTMENT_DELETE',
};

export const departmentReducer = (state = initial, action) => {
  let targetIndex = -1;
  if (action.payload?._id) {
    targetIndex = state.data.findIndex((it) => {
      return it?._id === action.payload?._id;
    });
  }

  //new State
  const newData = [...state.data];
  let targetItem = targetIndex > 0 ? state.data[targetIndex] : state.data[0];

  //dispatch Schema Field
  let member = action?.payload?.member;
  let position = action?.payload?.position;

  switch (action.type) {
    case departmentAction.INIT:
      return action.payload
        ? { ...state, data: action.payload }
        : { ...state, data: [] };

    //新增
    case departmentAction.CREATE:
      if (targetIndex > -1 || !action?.payload) return state;

      return {
        ...state,
        data: [...state.data, { ...action.payload }],
      };

    case departmentAction.ADD:
      console.log(
        '[Bug Log]',
        '[targetIndex]',
        targetIndex,
        '[target action payload]',
        action.payload?._id
      );

      if (targetIndex === -1) {
        console.error('please check, payload department._id');
        return state;
      }
      return {
        ...state,
        data: state.data.map((it, index) =>
          index === targetIndex
            ? {
                ...it,
                ...action.payload,
                member: member ? [...it.member, member] : member,
                position: position
                  ? [...it.position, { ...position }]
                  : position,
              }
            : it
        ),
      };
    //更新
    case departmentAction.UPDATE:
      if (targetIndex === -1) {
        console.error('please check, payload department._id');
        return state;
      }

      if (action?.payload?.memberId || action?.payload?.member) {
        console.error('department NOT allowed UPDATE member array Field');
        return state;
      }

      //newData, targetItem
      targetItem = {
        ...targetItem,
        ...action.payload,
        position: action?.payload?.position
          ? targetItem.position.map((it) =>
              it.name === action?.payload?.position?.oldName
                ? { name: newName, value: newName }
                : it
            )
          : targetItem.position,
      };

      newData.splice(targetIndex, 1, targetItem);

      return newData;
    //刪除
    //{_id, payload}
    //payload?.member
    //移除 員工內屬性項目: {position, member}
    //Ex: DEL department
    //dispatch{type:REMOVE, payload:{_id: department._id, member: memberId}}
    //Ex: DEL member
    //dispatch{type:REMOVE, payload:{_id: department._id, member: memberId}}
    //Ex: DEL position
    //dispatch{type:REMOVE, payload:{_id: department._id, position: name}}
    case departmentAction.REMOVE:
      if (targetIndex === -1) {
        console.error('please check, payload department._id');
        return state;
      }

      targetItem = {
        ...targetItem,
        member: action?.payload?.memberId
          ? targetItem.member.filter((it) => it !== action?.payload?.memberId)
          : targetItem.member,
        position: action?.payload?.position
          ? targetItem.position.filter(
              (it) => it.name !== action?.payload?.position
            )
          : targetItem.position,
      };

      newData.splice(targetIndex, 1, targetItem);

      return {
        ...state,
        data: newData,
      };

    case departmentAction.DELETE:
      return { ...state, data: [] };
    default:
      return state;
  }
};
