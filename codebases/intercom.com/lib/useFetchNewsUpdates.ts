import { useState, useEffect } from 'react'
import { IFooterSectionLink } from '../src/library/elements/FooterSection'

interface IBlogLink {
  title: string
  link: string
  date: string
  description: string
}

export default function useFetchNewsUpdates(number: number) {
  const [links, setLinks] = useState<IFooterSectionLink[]>([])

  useEffect(() => {
    fetch(`/api/blog/posts?number=${number}`)
      .then((res) => res.json())
      .then((json: IBlogLink[]) => {
        setLinks(
          json.map((item) => {
            return {
              text: item.title,
              url: item.link,
            }
          }),
        )
      })
  }, [number])

  return links
}
