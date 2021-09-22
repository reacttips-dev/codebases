import { MdVisibility, MdModeEdit } from "react-icons/md"
import { CheckIcon } from "gatsby-interface"
import { BoltIcon } from "../../shared/icons/BoltIcon"

export const cloudFeatures = [
  {
    emText: `Incremental Cloud Builds`,
    text: `1000x faster builds`,
    Icon: BoltIcon,
  },
  {
    emText: `Global Edge Network`,
    text: `optimized CDN`,
    Icon: MdVisibility,
  },
  {
    emText: `Real-Time Previews`,
    text: `each build is shareable`,
    Icon: MdModeEdit,
  },
  {
    emText: `Testing + Rollbacks`,
    text: `deploy with confidence`,
    Icon: CheckIcon,
  },
]
