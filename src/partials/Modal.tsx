import React, { useContext } from 'react'
import ModalContext from '../context/ModalContext'

const Modal = () => {
	const modalContext = useContext(ModalContext)

	if (modalContext) {
		const { showModal, setShowModal, modalText } = modalContext

		return (
			showModal && (
				<div
					className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
					onClick={() => setShowModal(false)}
				>
					<div className='bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 p-6 relative'>
						<button
							className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl leading-none'
							onClick={() => setShowModal(false)}
						>
							&times;
						</button>
						<h3 className='text-xl font-bold mb-4 pr-8'>
							{modalText && modalText.header}
						</h3>
						{modalText && (
							<div dangerouslySetInnerHTML={{ __html: modalText.body }} />
						)}
					</div>
				</div>
			)
		)
	} else {
		console.error('Modal Context not found in Modal!')
	}
}

export default Modal
