import propTypes from 'prop-types';
import { useState } from 'react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const Input = ({
  labelName,
  register,
  className,
  errors,
  name,
  type,
  visible = false,
  ...rest
}) => {
  const [eye, setEye] = useState('password');
  const visibleHandler = (e) => {
    e.preventDefault();
    setEye(() => {
      if (eye === 'password') {
        return 'text';
      }
      return 'password';
    });
  };
  const randomId = crypto.randomUUID();

  return (
    <div className="relative">
      <label htmlFor={randomId}>
        {labelName && <p className="text-sm mb-1">{labelName}</p>}
        <input
          id={randomId}
          className={`input input-bordered w-full 
        ${className}
        ${errors?.[name] && 'border-red-500'}`}
          type={type === 'password' && visible === true ? eye : type}
          {...register(name)}
          {...rest}
        />
        {errors?.[name] && (
          <p className="text-sm text-red-500 px-1">{errors[name]?.message}</p>
        )}
      </label>
      {visible && (
        <button
          className="absolute right-[4px] top-1/2 -translate-y-1/2"
          onClick={visibleHandler}
        >
          {eye === 'password' ? (
            <AiFillEye size={24} />
          ) : (
            <AiFillEyeInvisible size={24} />
          )}
        </button>
      )}
    </div>
  );
};

Input.propTypes = {
  labelName: propTypes.string,
  className: propTypes.string,
  register: propTypes.any,
  errors: propTypes.object,
  name: propTypes.string,
  type: propTypes.string,
  visible: propTypes.bool,
};

export default Input;
