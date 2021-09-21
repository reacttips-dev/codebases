import { Link } from "gatsby"
import React from "react"
import PropTypes from "prop-types"
import kebabCase from "lodash/kebabCase"

import { getLink } from "../utils/navigation"

const Job = ({ job }) => {
  let header
  if (job.externalLink || job.jobPage) {
    if (job.jobPage) {
      // keep jobPage backwards compatability
      header = (
        <Link
          to={getLink(job.jobPage)}
          css={theme => ({
            "&&": {
              fontWeight: `bold`,
              "&:hover": { color: theme.colors.gatsby },
            },
          })}
        >
          {job.jobTitle}
        </Link>
      )
    }
  } else {
    // at least show the header if no externalLink or jobPage was provideed, just don't break the page
    header = job.jobTitle
  }

  return (
    <div css={theme => ({ marginBottom: theme.space[11] })}>
      <h3
        id={kebabCase(job.jobTitle)}
        css={theme => ({ marginBottom: theme.space[4] })}
      >
        {header}
      </h3>
      <div
        css={theme => ({
          fontSize: theme.fontSizes[1],
          color: theme.colors.grey[70],
        })}
        dangerouslySetInnerHTML={{
          __html:
            job.jobDescription && job.jobDescription.childMarkdownRemark.html,
        }}
      />
    </div>
  )
}

Job.propTypes = {
  job: PropTypes.object.isRequired,
  idx: PropTypes.number,
}

export default Job
