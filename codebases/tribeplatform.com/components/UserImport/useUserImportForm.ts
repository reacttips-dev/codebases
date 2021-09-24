import { useEffect, useState } from 'react'

import { ParsedMailbox, parseOneAddress } from 'email-addresses'
import {
  useFieldArray,
  UseFieldArrayMethods,
  useForm,
  UseFormMethods,
} from 'react-hook-form'

import { Role, Space } from 'tribe-api/interfaces'
import { useToast } from 'tribe-components'

import { subtract, uniqueByKey } from 'utils/arrays.utils'
import { guessNameFromEmail } from 'utils/extractor.utils'
import Truthy from 'utils/truthy'
import { isEmail } from 'utils/validator.utils'

import { useUserImportContext } from './UserImportContext'

export type ImportEntry = { email: string; name: string }

export interface UserImportFormProps {
  entries: ImportEntry[]
  spaces: Space[]
  role?: Role
  multipleEmails?: string
  customMessage?: string
}

export interface ImportFormContext extends UseFormMethods {
  entries: UseFieldArrayMethods<ImportEntry>
  manyAtOnce: boolean
  showManyAtOnce: () => void
  hideManyAtOnce: () => void
  parseMultipleEmails: () => void
  appendEntry: () => void
  removeEntry: (index: number) => void
}

export const useUserImportForm = () => {
  const context = useUserImportContext()

  const form = useForm<UserImportFormProps>({
    defaultValues: {
      entries: [{ email: '', name: '' }],
      spaces: context?.defaultSpaces,
    },
    shouldUnregister: false,
  })

  const { control, getValues, setValue } = form

  useEffect(() => {
    if (context?.defaultSpaces) {
      setValue('spaces', context?.defaultSpaces)
    }
  }, [context?.defaultSpaces, setValue])

  const toast = useToast()
  const [manyAtOnce, setManyAtOnce] = useState(false)

  const entries = useFieldArray<ImportEntry>({
    control,
    name: 'entries',
  })

  const appendEntry = () => entries.append({ email: '', name: '' })

  const removeEntry = index => {
    if (entries.fields.length === 1) {
      setValue('entries', [{ email: '', name: '' }])
    } else {
      // If a field has "id" property, first time we call "remove"
      // will just reset it`s state. Only after resetting it's state
      // it can be removed, so we make it happen twice
      if (entries.fields[index].id) {
        entries.remove(index)
      }

      entries.remove(index)
    }
  }

  const showManyAtOnce = () => {
    const { entries } = getValues()
    if (entries) {
      const entriesValues = entries.filter(it => it?.email !== '')
      setValue(
        'multipleEmails',
        entriesValues
          .map(it => {
            return it.name ? `"${it.name}" <${it.email}>` : it.email
          })
          .join(', '),
      )
    }

    setManyAtOnce(true)
  }

  const hideManyAtOnce = () => {
    const { entries } = getValues()
    setValue('entries', entries)
    setValue('multipleEmails', '')
    setManyAtOnce(false)
  }

  const parseMultipleEmails = () => {
    const { entries, multipleEmails } = getValues()
    const entriesValues = entries.filter(it => it?.email !== '')

    const emails = multipleEmails?.split(/[\n\r;,]+/)
    const parsedEntries = emails
      ? emails
          .map(it => {
            try {
              const parsed = parseOneAddress(it) as ParsedMailbox
              const { name, address } = parsed
              if (!isEmail(address)) {
                return null
              }

              if (!name) {
                return { email: address, name: guessNameFromEmail(address) }
              }
              return { email: address, name }
            } catch (e) {
              return null
            }
          })
          .filter(Truthy)
      : []

    let newEntries = [...entriesValues, ...parsedEntries]
    if (newEntries.length === 0) {
      newEntries = [{ email: '', name: '' }]
    }
    newEntries = uniqueByKey(newEntries, 'email')

    setValue('entries', newEntries)
    setValue('multipleEmails', '')
    setManyAtOnce(false)

    const diff = subtract(newEntries, entriesValues, 'email')
    if (diff.length > 0) {
      toast({
        description: `We found ${diff.length} emails addresses to invite. 
        We've done our best to guess a name for each one.
        See if everything looks right, then press invite.`,
      })
    }
  }

  return {
    form,
    entries,
    manyAtOnce,
    showManyAtOnce,
    hideManyAtOnce,
    parseMultipleEmails,
    appendEntry,
    removeEntry,
  }
}
