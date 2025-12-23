import { useState } from 'react'
import ModalContext from './context/ModalContext.js'

import './App.css'
import Modal from './partials/Modal'

import ErrorBoundary from './components/common/ErrorBoundary'
import ErrorFallback from './components/common/ErrorFallback'
import { AuthProvider } from './context/AuthContext.js'
import Layout from './partials/layout.js'

function App() {
	const [showModal, setShowModal] = useState(false)
	const [modalText, setModalText] = useState({ header: '', body: '' })

	return (
		<AuthProvider>
			<ErrorBoundary fallback={<ErrorFallback />}>
				<ModalContext.Provider
					value={{ showModal, setShowModal, modalText, setModalText }}
				>
					<Modal />
					<div className='min-h-screen flex flex-col gap'>
						<Layout />
					</div>
				</ModalContext.Provider>
			</ErrorBoundary>
		</AuthProvider>
	)
}

export default App
