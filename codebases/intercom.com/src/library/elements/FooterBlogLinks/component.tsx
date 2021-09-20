import React from 'react'
import { FooterSection } from '../../elements/FooterSection'
import { TextLink } from '../TextLink'
import { Text } from '../../elements/Text'

import useFetchNewsUpdates from 'marketing-site/lib/useFetchNewsUpdates'

export function FooterBlogLinks() {
  const links = useFetchNewsUpdates(4)
  return (
    <>
      <FooterSection heading="From the blog" links={links} />
      <div className="footer__link footer__link--blog">
        <TextLink url="https://www.intercom.com/blog">
          <Text size="body">Read more</Text>
        </TextLink>
      </div>
    </>
  )
}
