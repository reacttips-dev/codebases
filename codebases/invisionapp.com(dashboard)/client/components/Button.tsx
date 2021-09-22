import React from 'react'
import { Button as HeliosButton, LoadingDots } from '@invisionapp/helios'
import { ButtonProps as HeliosButtonProps } from '@invisionapp/helios/components/Button'
import { Check } from '@invisionapp/helios/icons'

type ButtonProps = Omit<HeliosButtonProps, 'disabled'> & {
  status?: 'default' | 'disabled' | 'loading' | 'loaded'
}

export const Button = (props: ButtonProps) => {
  const { children, ...buttonProps } = props

  const isDisabledFromStatus = () => {
    switch (buttonProps.status) {
      case 'loading':
      case 'disabled':
      case 'loaded': {
        return true
      }
      default: {
        return false
      }
    }
  }

  const buttonChildren = () => {
    switch (buttonProps.status) {
      case 'loading': {
        return <LoadingDots color="white" />
      }
      case 'loaded': {
        return <Check fill="white" />
      }
      default: {
        return children
      }
    }
  }

  return (
    <HeliosButton {...buttonProps} disabled={isDisabledFromStatus() ?? false}>
      {buttonChildren()}
    </HeliosButton>
  )
}
