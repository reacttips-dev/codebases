import React, { useMemo, useState, useCallback } from 'react'

import { Image } from '@chakra-ui/react'
import ArrowDownSLineIcon from 'remixicon-react/ArrowDownSLineIcon'

import {
  Dropdown,
  Text,
  ButtonProps,
  DropdownButton,
  DropdownItem,
  DropdownList,
  Icon,
} from 'tribe-components'

import useUpdateMember from 'containers/Member/hooks/useUpdateMember'

import { setUILanguage, getUILanguage, LangTitles } from 'lib/i18n'

const langCodeFlagMap = {
  // eslint-disable-next-line i18next/no-literal-string
  en: 'us',
}

const options = Object.keys(LangTitles)?.map((value: string) => {
  const langFlagCode = langCodeFlagMap[value] || value

  return {
    value,
    icon: `https://www.countryflags.io/${langFlagCode}/shiny/16.png`,
    label: LangTitles[value],
  }
})

type LanguageSelectorProps = ButtonProps

/**
 * Renders a box with dropdown
 * menu of language choices
 */
export default function LanguageSelector(props: LanguageSelectorProps) {
  const [language, setLanguage] = useState(getUILanguage())

  const { updateMember } = useUpdateMember()

  // Save language to backend, state, cookie and update UI
  const saveLanguage = useCallback(
    (lang: string) => {
      setLanguage(lang)
      setUILanguage(lang)

      updateMember({ attributes: { locale: lang } })
    },
    [updateMember],
  )

  const selectedOption = useMemo(
    () => options.find(({ value }) => value === language),
    [language],
  )

  if (!language || !selectedOption) return null

  return (
    <Dropdown>
      <DropdownButton
        data-testid="language-selector-box"
        width={200}
        justifyContent="space-between"
        variant="outline"
        rightIcon={<Icon as={ArrowDownSLineIcon} size={20} />}
        leftIcon={
          <Image src={selectedOption.icon} alt={selectedOption.label} />
        }
        {...props}
      >
        {selectedOption.label}
      </DropdownButton>
      <DropdownList>
        {options.map(({ value, icon, label }) => (
          <DropdownItem key={label} onClick={() => saveLanguage(value)}>
            <Image src={icon} alt={label} />
            <Text flexGrow={1} textAlign="left" pl="2">
              {label}
            </Text>
          </DropdownItem>
        ))}
      </DropdownList>
    </Dropdown>
  )
}
