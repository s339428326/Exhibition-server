import propTypes from 'prop-types';
import { useEffect } from 'react';

const Modal = ({ children, modalId, setIsShow }) => {
  //addEventListener esc key
  useEffect(() => {
    const listEscKeyHandler = document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setIsShow(false);
      }
    });
    return () => document.removeEventListener('keydown', listEscKeyHandler);
  }, []);

  return (
    <dialog id={modalId} className="modal overflow-hidden">
      <div className="modal-box">
        <form method="dialog">
          <button
            onClick={() => setIsShow(false)}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        {/* 內容 */}
        {children}
      </div>
    </dialog>
  );
};

Modal.propTypes = {
  setIsShow: propTypes.func,
  children: propTypes.node,
  modalId: propTypes.string,
};

export default Modal;
