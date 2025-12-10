import React, { useContext } from 'react'
import './css/Modal.css'
import ModalContext from '../context/ModalContext'

const Modal = () => {
  const obj = useContext(ModalContext)

  if (obj) {
    const { showModal, setShowModal, modalText } = obj

    return (
      showModal && (
        <div id="modal">
          <div className="modal-content">
            <button className="close" onClick={() => setShowModal(false)}>
              &times;
            </button>
            <h3>{modalText && modalText.header}</h3>
            {modalText && <div dangerouslySetInnerHTML={{ __html: modalText.body }} />}
          </div>
        </div>
      )
    )
  } else {
    console.error('Modal Context not found in Modal!')
  }
}

export default Modal
