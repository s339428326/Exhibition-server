import combineReducer from './combineReducer';
import { workerReducer } from './workerReducer';
import { departmentReducer } from './departmentReducer';

const reducers = combineReducer({
  worker: workerReducer,
  department: departmentReducer,
});

export default reducers;
