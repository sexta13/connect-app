/**
 * Container component for MetaData
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { branch, renderComponent, compose, withProps } from 'recompose'
import {
  loadProjectsMetadata,
  saveProductTemplate,
  deleteProjectsMetadata,
  createProjectsMetadata,
  updateProjectsMetadata,
} from '../../../actions/templates'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import CoderBot from '../../../components/CoderBot/CoderBot'
import { requiresAuthentication } from '../../../components/AuthenticatedComponent'
import MetaDataPanel from '../components/MetaDataPanel'
import {
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_ADMIN,
} from '../../../config/constants'
import _ from 'lodash'

import './MetaDataContainer.scss'

class ProjectTemplateDetails extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    if (!this.props.templates && !this.props.isLoading) {
      this.props.loadProjectsMetadata()
    }
  }

  render() {
    const {
      loadProjectsMetadata,
      deleteProjectsMetadata,
      createProjectsMetadata,
      updateProjectsMetadata,
      templates,
      isLoading,
      isAdmin,
      currentUser,
      match,
    } = this.props
    const projectTemplates = templates.projectTemplates
    let templateId = match.params.templateId
    templateId = templateId ? parseInt(templateId) : null
    const projectTemplate = _.find(projectTemplates, t => t.id === templateId)
    console.log(projectTemplate)
    return (
        <div>
            <MetaDataPanel
            templates={templates}
            isAdmin={isAdmin}
            metadataType="projectTemplate"
            metadata={projectTemplate}
            loadProjectsMetadata={loadProjectsMetadata}
            deleteProjectsMetadata={deleteProjectsMetadata}
            createProjectsMetadata={createProjectsMetadata}
            updateProjectsMetadata={updateProjectsMetadata}
            />
        </div>
    )
  }
}



ProjectTemplateDetails.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProjectsMetadata: PropTypes.func.isRequired,
  createProjectsMetadata: PropTypes.func.isRequired,
  updateProjectsMetadata: PropTypes.func.isRequired,
}


const mapStateToProps = ({ templates, loadUser }) => {
  const powerUserRoles = [ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]

  return {
    templates: templates,
    isLoading: templates.isLoading,
    currentUser: loadUser.user,
    isAdmin: _.intersection(loadUser.user.roles, powerUserRoles).length !== 0
  }
}

const mapDispatchToProps = {
  loadProjectsMetadata,
  saveProductTemplate,
  deleteProjectsMetadata,
  createProjectsMetadata,
  updateProjectsMetadata,
}

const page500 = compose(
  withProps({code:500})
)
const showErrorMessageIfError = hasLoaded =>
  branch(hasLoaded, renderComponent(page500(CoderBot)), t => t)
const errorHandler = showErrorMessageIfError(props => props.error)
const enhance = spinnerWhileLoading(props => !props.isLoading || props.templates)
const ProjectTemplateDetailsWithLoaderEnhanced = enhance(errorHandler(ProjectTemplateDetails))
const ProjectTemplateDetailsWithLoaderAndAuth = requiresAuthentication(ProjectTemplateDetailsWithLoaderEnhanced)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectTemplateDetailsWithLoaderAndAuth))