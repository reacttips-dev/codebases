import { createContext } from 'react'

const EditingContext = createContext<boolean>(false)

EditingContext.displayName = 'EditorUIContext'

export default EditingContext
