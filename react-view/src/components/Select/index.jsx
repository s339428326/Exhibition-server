import propTypes from 'prop-types';

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
  if (!data)
    return console.error('[Component]<Select/> 請按照註釋填入data資料');

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
        {data.map((it, index) => (
          <option
            key={it?.name}
            value={index === 0 ? defaultValue : it?.value}
            disabled={index === 0}
          >
            {it?.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;

Select.PropTypes = {
  labelName: propTypes.string,
  className: propTypes.string,
  register: propTypes.func,
  errors: propTypes.object,
  defaultValue: propTypes.string,
  name: propTypes.string,
};
