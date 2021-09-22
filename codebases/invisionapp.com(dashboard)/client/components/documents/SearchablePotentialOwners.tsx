import React from 'react'
import { Text, Truncate } from '@invisionapp/helios'

import { useFetchBffData } from '../../utils/bffRequest'

import { Member } from '../../stores/members'

import { truncate } from '../../helpers/string'
import { UserAvatar } from '../tables/Table'
import { Searchable, SearchableOption } from '../Searchable'
import Avatar from '../ProportionedAvatar'

type SearchablePotentialOwnersProps = {
  id?: string
  onSelect?: (option: any | null) => void
  placeholder?: string
  isToTransferDocs?: boolean
  removeUserID?: number
}

export const SearchablePotentialOwners = (props: SearchablePotentialOwnersProps) => {
  const { onSelect, placeholder, id, isToTransferDocs, removeUserID } = props

  const [usersLoadStatus, users] = useFetchBffData<Member[], any>({
    url: isToTransferDocs ? '/members/for-doc-transfer' : '/members/for-ownership'
  })

  let availableUsers = []
  if (usersLoadStatus === 'loaded') {
    // show them all
    if (removeUserID === undefined) {
      availableUsers = users
    }

    // remove the removeUserID from the list
    availableUsers = users.filter((member: any) => member.userID !== removeUserID)
  }

  return (
    <Searchable
      loading={usersLoadStatus === 'loading'}
      id={id ?? 'choose-teammate'}
      options={availableUsers}
      placeholder={placeholder ?? 'Select a teammate'}
      getKey={option => option.userID.toString()}
      onSelect={onSelect}
      renderInputValue={option => truncate(option?.name, 'end', 40)}
      renderOption={member => {
        return (
          <SearchableOption>
            <UserAvatar color="dark" name={member.name} order="user" src={member.avatarURL} />
            <div>
              <Text order="body">
                <strong>
                  <Truncate placement="end">{member.name}</Truncate>
                  {member.userID === member.user?.id ? ' (you)' : ''}
                </strong>
              </Text>
              <Text order="body" size="smaller" color="text-lightest">
                {member.role.name}
              </Text>
            </div>
          </SearchableOption>
        )
      }}
      renderPrepend={member => {
        return (
          <Avatar
            color="dark"
            name={member?.name}
            order="user"
            src={member?.avatarURL}
            size="smaller"
          />
        )
      }}
    />
  )
}
