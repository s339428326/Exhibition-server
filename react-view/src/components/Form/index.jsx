/* 針對React Hook Form 了解, React props.children,  React.Children.map 用法 */
import { Children, createElement } from 'react';
import propTypes from 'prop-types';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

const Form = ({ defaultValues, schema, children, onSubmit, ...rest }) => {
  //Tips.1 使用React Hook Form 的 useFrom Hook(:13)
  //Tips.2 針對useForm 得 解構出 方法(:14)
  //Tips.3 使用React預設 props.children 取得 子元件, 並使用React.Children.map 建立createElement(:6, :32)
  //Tips.4 React.Children(:32)
  //(參數1:當前要遍歷得props.children, 參數2:(參數:1陣列元素, 參數:2陣列位置))

  //resolver 使用 yup 驗證
  const { handleSubmit, register, formState } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  //[Dev] 觀看children type => Array
  //useEffect(() => console.log('children', children), []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} {...rest} noValidate>
      {Children.map(children, (child) => {
        return child.props.name
          ? createElement(child.type, {
              ...child.props,
              register,
              errors: formState.errors,
              key: child.props.name,
            })
          : child;
      })}
    </form>
  );
};

Form.propTypes = {
  onSubmit: propTypes.func,
  defaultValues: propTypes.object,
  schema: propTypes.object,
  children: propTypes.node,
  type: propTypes.string,
};

export default Form;
