import React, { useContext } from 'react';
import './css/Modal.css';
import ReactHtmlParser from 'react-html-parser';
import ModalContext from '../context/ModalContext';

const Modal = () => {
    const obj = useContext(ModalContext)
    console.log("ModalContext in Modal", JSON.stringify(obj))
    const { showModal, setShowModal, modalText  } = obj
    return (
        showModal && <div id='modal'>
            <div className='modal-content'>
                <button className='close' onClick={() => setShowModal(false)} >&times;</button>
                <h3>{modalText.header}</h3>
                <>{ReactHtmlParser(modalText.body)}</>
            </div>
        </div>
    )
}

export default Modal;