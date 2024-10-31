import { Dispatch, SetStateAction } from 'react'

export type ModalTextType = { header: string; body: string } | null

export type ModalContextType = {
  showModal: boolean
  setShowModal: (show: boolean) => void
  modalText: ModalTextType
  setModalText: Dispatch<SetStateAction<{ header: string; body: string }>>
} | null
