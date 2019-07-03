import React from 'react'
import './Administration.scss'
import ProjectStatus from '../../components/ProjectStatus/ProjectStatus'
import editableProjectStatus from '../../components/ProjectStatus/editableProjectStatus'
import ProjectDirectLinks from '../../projects/list/components/Projects/ProjectDirectLinks'
import {  PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER, PROJECT_STATUS_COMPLETED, PROJECT_STATUS_ACTIVE, PHASE_STATUS_ACTIVE, PHASE_STATUS_REVIEWED } from '../../config/constants'
import _ from 'lodash'

function Administration ({directLinks, isSuperUser, canEditStatus, project, onChangeStatus, phases, currentMemberRole}) {

  const hasReviewedOrActivePhases = !!_.find(phases, (phase) => _.includes([PHASE_STATUS_REVIEWED, PHASE_STATUS_ACTIVE], phase.status))
  const isProjectActive = project.status === PROJECT_STATUS_ACTIVE
  const isV3Project = project.version === 'v3'
  const projectCanBeActive =  !isV3Project || (!isProjectActive && hasReviewedOrActivePhases) || isProjectActive

  const canEdit = canEditStatus && (
    project.status !== PROJECT_STATUS_COMPLETED && (isSuperUser || (currentMemberRole
    && (_.indexOf([PROJECT_ROLE_COPILOT, PROJECT_ROLE_MANAGER], currentMemberRole) > -1)))
  )
  const EnhancedProjectStatus = editableProjectStatus(ProjectStatus)

  return (<div className="administration-container">
    <div className="section">
      <div className="title">
        administration
      </div>
      <ProjectDirectLinks
        directLinks={directLinks}
      />
      <div className="project-status">
        {
          <EnhancedProjectStatus
            status={project.status}
            projectCanBeActive={projectCanBeActive}
            showText
            withoutLabel
            currentMemberRole={currentMemberRole}
            canEdit={canEdit}
            unifiedHeader={false}
            onChangeStatus={onChangeStatus}
            projectId={project.id}
          />
        }
      </div>
    </div>
  </div>)

}

export default Administration