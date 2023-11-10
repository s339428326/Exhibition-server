import propTypes from 'prop-types';

const Modal = ({ children, modalId }) => {
  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg">展覽名稱</h3>
        {/* 內容 */}
        {children}
      </div>
    </dialog>
  );
};

Modal.propTypes = {
  children: propTypes.node,
  modalId: propTypes.string,
};

export default Modal;
