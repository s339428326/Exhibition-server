import propTypes from 'prop-types';

const ModalBtn = ({ className, children, modalId, onClick, ...rest }) => {
  const modalHandler = () => {
    document.getElementById(modalId).showModal();
    onClick();
  };

  return (
    <button className={className} onClick={modalHandler} {...rest}>
      {children}
    </button>
  );
};

ModalBtn.propTypes = {
  className: propTypes.string,
  children: propTypes.node,
  modalId: propTypes.string,
  onClick: propTypes.func,
};

export default ModalBtn;
