import propTypes from 'prop-types';

const ModalBtn = ({ className, children, modalId }) => {
  return (
    <button
      className={className}
      onClick={() => document.getElementById(modalId).showModal()}
    >
      {children}
    </button>
  );
};

ModalBtn.propTypes = {
  className: propTypes.string,
  children: propTypes.node,
  modalId: propTypes.string,
};

export default ModalBtn;
