import {
    createContext,
    useContext
} from 'react'
/**
 * Context for "Modal" <-> "Modal.Content" communication
 */
export const ModalContext = createContext({})

/**
 * Returns result of useContext(ModalContext)
 * Note: it is also easier to mock it in unit tests
 */
export const useModalContext = () => useContext(ModalContext)

/**
 * Identifier is needed to find host element when rendering using React Portal
 */
export const HOST_ELEMENT_ID = 'modal-host'