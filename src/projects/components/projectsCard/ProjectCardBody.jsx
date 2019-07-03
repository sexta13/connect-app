import React from 'react'
import PT from 'prop-types'
import TextTruncate from 'react-text-truncate'
import { Link } from 'react-router-dom'
import './ProjectCardBody.scss'
import _ from 'lodash'


function ProjectCardBody({ project, descLinesCount = 8, showLink, showLinkURL }) {
  if (!project) return null

  const projectDetailsURL = project.version === 'v3'
    ? `/projects/${project.id}/scope`
    : `/projects/${project.id}/specification`

  return (
    <div className="project-card-body">
      <TextTruncate
        containerClassName="project-description"
        line={descLinesCount}
        truncateText="..."
        text={_.unescape(project.description)}
        textTruncateChild={showLink ? <Link className="read-more-link" to={showLinkURL || projectDetailsURL}>read more</Link> : <span className="read-more-link">read more</span>}
      />
    </div>
  )
}

ProjectCardBody.defaultTypes = {
  projectCanBeActive: true,
  showLink: false,
  showLinkURL: '',
  canEditStatus: true
}

ProjectCardBody.propTypes = {
  project: PT.object.isRequired,
  projectCanBeActive: PT.bool,
  currentMemberRole: PT.string,
  duration: PT.object.isRequired,
  showLink: PT.bool,
  showLinkURL: PT.string,
  canEditStatus: PT.bool
}

export default ProjectCardBody
