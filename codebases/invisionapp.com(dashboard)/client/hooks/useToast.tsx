import React from 'react'
import { useDispatch } from 'react-redux'
import { showFlash } from '../stores/flash'

const useToast = () => {
  const dispatch = useDispatch()
  const notify = (config: { message: any; status: 'success' | 'danger' | 'warning' }) =>
    dispatch(showFlash(config))

  const successToast = (message: any) => notify({ message, status: 'success' })
  const errorToast = (message: any) => notify({ message, status: 'danger' })
  const warningToast = (message: any) => notify({ message, status: 'warning' })

  return {
    successToast,
    errorToast,
    warningToast
  }
}

export const withToast = (Component: any) => (props: any) => {
  const { successToast, errorToast } = useToast()
  return <Component {...props} successToast={successToast} errorToast={errorToast} />
}

export default useToast
