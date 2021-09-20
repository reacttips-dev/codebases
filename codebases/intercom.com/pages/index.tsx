import { IPage } from 'marketing-site/@types/generated/contentful'
import { getAssignedVariations } from 'marketing-site/lib/abTests'
import getPageByPath from 'marketing-site/lib/getPageByPath'
import EntryMarker from 'marketing-site/src/components/common/EntryMarker'
import Page from 'marketing-site/src/components/common/Page'
import { IAssignedVariations } from 'marketing-site/src/components/context/AssignedVariationsContext'
import { GetServerSideProps } from 'next'
import React from 'react'

interface IProps {
  page: IPage
  assignedVariations: IAssignedVariations
}

export default function ContentfulPage({ page }: IProps) {
  return (
    <EntryMarker entry={page}>
      <Page page={page} />
    </EntryMarker>
  )
}

export const getServerSideProps: GetServerSideProps<IProps> = async function ({ req }) {
  const page = (await getPageByPath('index')) as IPage
  const assignedVariations = await getAssignedVariations(req, page)

  return { props: { page, assignedVariations } }
}
