import classnames from 'classnames'
import { getGtmClient } from 'marketing-site/lib/gtm'
import { VALID_EMAIL } from 'marketing-site/lib/validEmail'
import { IInvalid, IValid } from 'marketing-site/src/library/elements/EmailForm'
import { CurrentUILocaleContext } from 'marketing-site/src/library/utils'
import React, { createRef, useContext, useState, useRef } from 'react'
import { useUID } from 'react-uid'
import { LoadingAnimation } from '../LoadingAnimation'
import { Text } from '../Text'
import { VisuallyHidden } from '../VisuallyHidden'
import { IProps } from './index'
import { useMediaQuery } from 'marketing-site/src/library/utils/mediaQuery'
import { mq } from 'marketing-site/src/library/utils'
import { useIsomorphicLayoutEffect } from 'marketing-site/src/library/hooks/useIsomorphicLayoutEffect'
import { useIOsInputScrollEvents } from 'marketing-site/src/library/hooks/useIosInputScrollEvents'

const isFormOverflowing = ({ scrollWidth, clientWidth }: HTMLElement): boolean => {
  return scrollWidth > clientWidth
}

export function EmailForm({
  buttonLabel,
  validity,
  placeholderText,
  value,
  small,
  onChange,
  onSubmit,
  inputRef: passedInputRef,
  loading,
  onFormFocus,
}: IProps) {
  const { ui } = useContext(CurrentUILocaleContext)
  const selfRef = useRef<HTMLFormElement>(null)
  // determines whether form is rendered on one line or two lines (wrapped)
  const [shouldWrapForm, setShouldWrapForm] = useState<boolean>(false)
  const [initiallyOverflows, setInitiallyOverflows] = useState<boolean | null>(null)
  const isMobile = useMediaQuery(`(${mq.mobile})`)
  const { iosOnFocus, iosOnBlur } = useIOsInputScrollEvents()

  // This runs only on first render, checking if the form overflows its parent
  useIsomorphicLayoutEffect(() => {
    if (initiallyOverflows === null) {
      if (
        selfRef.current &&
        selfRef.current.parentElement &&
        isFormOverflowing(selfRef.current.parentElement)
      ) {
        setInitiallyOverflows(true)
      } else {
        setInitiallyOverflows(false)
      }
    }
  }, [])

  useIsomorphicLayoutEffect(() => {
    if (initiallyOverflows) {
      // If the form overflows from its parent container, wrap it
      setShouldWrapForm(true)
    } else if (isMobile) {
      // If on mobile, wrap form
      setShouldWrapForm(true)
    } else {
      // Otherwise, don't wrap
      setShouldWrapForm(false)
    }
  }, [isMobile, shouldWrapForm, initiallyOverflows])

  const componentId = useUID()
  const inputElementId = `email_${componentId}`
  const errorElementId = `signup-cta-error_${componentId}`

  const inputRef = passedInputRef || createRef<HTMLInputElement>()

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value)
  }

  function handleFocus() {
    iosOnFocus()
    if (onFormFocus) {
      onFormFocus()
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(event)
  }

  const formClasses = classnames('email-form', {
    'email-form--small': small,
    'email-form--loading': loading,
    'email-form--error': !validity.isValid,
    'email-form--flex-column': shouldWrapForm,
  })

  const errorMessageClasses = classnames('email-form__error-message', {
    'email-form__error-message--active': !validity.isValid,
  })

  return (
    <form ref={selfRef} className={formClasses} onSubmit={handleSubmit} noValidate>
      <VisuallyHidden>
        <label htmlFor={inputElementId}>
          {placeholderText || ui.localize('EmailForm.defaultEmailFieldPlaceholder')}
        </label>
      </VisuallyHidden>

      <div className="email-form__input-wrapper">
        <input
          type="email"
          id={inputElementId}
          value={value}
          onFocus={handleFocus}
          onBlur={iosOnBlur}
          onChange={handleChange}
          className="email-form__input"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          aria-required="true"
          aria-invalid={!validity.isValid}
          aria-describedby={errorElementId}
          ref={inputRef}
          placeholder={placeholderText || ui.localize('EmailForm.defaultEmailFieldPlaceholder')}
        />
      </div>

      <button
        type="submit"
        className="email-form__submit email-form__submit--black-fill"
        data-testid="submit"
      >
        <Text size="md+">{buttonLabel}</Text>

        {loading && (
          <div className="email-form__submit__loading-indicator">
            <LoadingAnimation />
          </div>
        )}
      </button>

      <span className={errorMessageClasses} id={errorElementId} data-testid="error">
        <Text size="caption">{!validity.isValid && validity.errorText}</Text>
      </span>
      <style jsx>{`
        .email-form {
          $self: &;

          display: flex;
          width: 100%;
          position: relative;
          flex-direction: row;
          align-items: center;

          &__input {
            &::placeholder {
              color: $ui-gray;
            }
          }

          &__input,
          &__submit {
            padding: 12px 21px;
          }

          &__input {
            line-height: 1.4;
          }

          &__input-wrapper {
            flex: 999 0 0;
            width: 100%;
          }

          &__submit {
            @include button;

            flex-shrink: 0;
            font-weight: bold;
            position: relative;

            &__loading-indicator {
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              width: 100%;
              background-color: inherit;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              border-radius: 30px;
            }
          }

          &__input {
            width: 100%;
            outline: 0;
            border: 2px solid;
            color: $black;
            border-radius: 30px;
            font-size: 15px;
            line-height: unset;

            // Next query targets ios devices only
            @supports (-webkit-touch-callout: none) {
              font-size: 16px; // This prevents an undesired zoom in on Safari when the input is focused
            }
          }

          &__error-message {
            background-color: $ui-error;
            color: $white;
            border-radius: 30px;
            padding: 8px;
            text-align: center;
            display: none;
            z-index: 1;

            &--active {
              display: block;
            }
          }

          &__success-message {
            font-size: 16px;
          }

          &--small {
            #{$self}__input,
            #{$self}__submit {
              padding: 6px 14px;
              min-width: 186px;
            }
          }

          &--error {
            #{$self}__input {
              border-color: $ui-error;
            }
          }

          &--loading {
            #{$self}__submit__label {
              opacity: 0;
            }
          }

          @media (${mq.tablet}) {
            &__input {
              min-width: 210px;
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
              line-height: 1.4;
              border-right: 0;
            }

            &__submit {
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            }

            &__error-message {
              position: absolute;
              top: calc(100% + 15px);
              left: 0;
              right: 30%;

              // Callout arrow
              &:before {
                bottom: 100%;
                left: 50%;
                content: ' ';
                position: absolute;
                height: 10px;
                width: 10px;
                background-color: $ui-error;
                border-radius: 2px;
                transform: translateY(50%);
                transform: rotate(45deg);
                top: -4px;
              }
            }
          }

          @media (${mq.desktop}) {
            &__success-message {
              font-size: 26px;
            }
          }
        }

        .email-form--flex-column {
          flex-direction: column;
          align-items: stretch;

          .email-form__input,
          .email-form__submit {
            &::placeholder {
              text-align: center;
            }
          }

          .email-form__input {
            border-top-right-radius: 30px;
            border-bottom-right-radius: 30px;
            border-right-width: 2px;

            @media (${mq.tablet}) {
              border-right: 0;
            }
          }

          .email-form__submit {
            border-top-left-radius: 30px;
            border-bottom-left-radius: 30px;
            margin-block-start: 10px;
          }
        }
      `}</style>
    </form>
  )
}

export function useEmailValidation({
  allowPersonalEmails,
  invalidFormatErrorMessage,
  businessEmailErrorMessage,
}: {
  allowPersonalEmails: boolean
  invalidFormatErrorMessage: string
  businessEmailErrorMessage?: string
}) {
  const [email, setEmail] = useState('')
  const [validity, setValidity] = useState<IValid | IInvalid>({ isValid: true })

  async function validate(): Promise<boolean> {
    if (!email || !VALID_EMAIL.test(email)) {
      setValidity({
        isValid: false,
        errorText: invalidFormatErrorMessage,
      })
      return false
    }

    const gtmClient = await getGtmClient()
    if (!allowPersonalEmails && (await gtmClient.personalEmailDomain(email))) {
      setValidity({
        isValid: false,
        errorText: businessEmailErrorMessage || 'Please enter a business email',
      })
      return false
    }

    return true
  }

  return { email, setEmail, validate, validity }
}
