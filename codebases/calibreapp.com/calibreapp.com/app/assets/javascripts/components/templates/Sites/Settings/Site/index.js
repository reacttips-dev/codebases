import React, { Suspense } from 'react'

import Form from './Form'
import Slug from './Slug'
import Secret from './Secret'
import Delete from './Delete'

const Team = React.lazy(() => import('./Team'))

const General = ({
  teamId,
  name,
  slug,
  canonicalUrl,
  loading,
  secret,
  onUpdateSettings,
  savingSettings,
  onUpdateSecret,
  savingSecret,
  onUpdateTeam,
  savingTeam,
  onDelete,
  deletingSite
}) => {
  return (
    <>
      <Form
        name={name}
        canonicalUrl={canonicalUrl}
        onUpdate={onUpdateSettings}
        loading={loading}
        saving={savingSettings}
      />
      <Slug loading={loading} slug={slug} />
      <Secret
        loading={loading}
        secret={secret}
        saving={savingSecret}
        onUpdate={onUpdateSecret}
      />
      <Suspense fallback={<div />}>
        <Team
          teamId={teamId}
          loading={loading}
          saving={savingTeam}
          onUpdate={onUpdateTeam}
        />
      </Suspense>
      <Delete
        loading={loading}
        name={name}
        saving={deletingSite}
        onDelete={onDelete}
      />
    </>
  )
}

export default General
