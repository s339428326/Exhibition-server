# Reducer style note

---

# combine Reducer Slice

使用 combineReducer function 於 index.jsx

```javascript
const reducers = combineReducer({
  worker: workerReducer,
  department: departmentReducer,
});
```

combineReducer 設計

1. 使用Object.key(reducers).forEach 將 reducers中 switch case(行為) default 回傳 init state給內部 objectInitState物件作為combine Reducer 初始狀態
2. 設計callback function 回傳 (state, action) => {...} 當開發者使用 action 參數時透過forEach 遍歷所有 reducer slice => reducers[key](state[key], action) 重新賦予值給objectInitState Object 最後回傳 return { ...objectInitState } 實現全reducer合併。

```javascript
return (state, action) => {
  if (action) {
    reducerKeys.forEach((key) => {
      //觸發該reducer
      objectInitState[key] = reducers[key](state[key], action);
    });
  }
  //如果沒action 參數, return 目前總reducers 初始狀態
  return { ...objectInitState };
};
```

# reducer slice

## Reducer Slice

### action method

Ex: worker

```javascript
export const departmentAction = {
  INIT: 'DEPARTMENT_INIT',
  CREATE: 'DEPARTMENT_CREATE',
  ADD: 'DEPARTMENT_ADD',
  UPDATE: 'DEPARTMENT_UPDATE',
  REMOVE: 'DEPARTMENT_REMOVE',
  DELETE: 'DEPARTMENT_DELETE',
};
```

- INIT 初始化
- CREATE 賦予新狀態
- ADD 新增欄位狀態
- UPDATE 更新指定欄位狀態
- REMOVE 刪除指定欄位狀態
- DELETE 清空狀態
