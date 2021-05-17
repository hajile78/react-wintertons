import React from 'react';
import './css/Modal.css';
import ReactHtmlParser from 'react-html-parser';

const Modal = ({ modalText, showModal, toggleModal }) => {
    return (
        showModal && <div id='modal'>
            <div className='modal-content'>
                <button className='close' onClick={toggleModal} >&times;</button>
                <h3>{modalText.header}</h3>
                <>{ReactHtmlParser(modalText.body)}</>
            </div>
        </div>
    )
}

export default Modal;