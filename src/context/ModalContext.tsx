import { createContext } from 'react'
type ModalContextType =
  | {
      showModal: boolean
      setShowModal: () => void
      modalText: {}
      setModalText: () => void
    }
  | {}
const ModalContext = createContext<ModalContextType>({})
export default ModalContext
