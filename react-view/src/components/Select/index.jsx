import propTypes from 'prop-types';
import { useEffect, useState } from 'react';

/**
 * @param {*} data
 * [
 *  //index 0: default select it
 *  {
 *      name:'選擇部門',
 *  },{
 *      name:'人資'
 *      value:'HR'
 *  }
 * ]
 * @returns
 */
const Select = ({
  labelName,
  className,
  register,
  errors,
  defaultValue = '',
  name,
  data,
  ...rest
}) => {
  const [list, setList] = useState(data ? data : []);

  useEffect(() => {
    setList(data);
  }, [data]);

  const randomId = crypto.randomUUID();

  return (
    <div>
      <label htmlFor={randomId} className="text-sm mb-1">
        {labelName}
      </label>
      <select
        id={randomId}
        className={`select select-bordered w-full ${className}`}
        name={name}
        defaultValue={defaultValue}
        {...register(name)}
        {...rest}
      >
        <option value="" disabled>
          請選擇項目
        </option>
        {list?.map((it, index) => (
          <option key={it?.name} value={it?.value}>
            {it?.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;

Select.propTypes = {
  labelName: propTypes.string,
  className: propTypes.string,
  register: propTypes.func,
  errors: propTypes.object,
  defaultValue: propTypes.string,
  name: propTypes.string,
  data: propTypes.array,
};
