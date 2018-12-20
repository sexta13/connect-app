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
} from '../../../actions/templates'
import MetaDataProjectTypesGridView from '../components/MetaDataProjectTypesGridView'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import CoderBot from '../../../components/CoderBot/CoderBot'
import { requiresAuthentication } from '../../../components/AuthenticatedComponent'
import {
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_ADMIN,
} from '../../../config/constants'
import _ from 'lodash'

import './MetaDataContainer.scss'

class ProjectTypesContainer extends React.Component {

  constructor(props) {
    super(props)
  }

  componentWillMount() {
    if (!this.props.projectTypes && !this.props.isLoading) {
      this.props.loadProjectsMetadata()
    }
  }

  render() {
    const {
      deleteProjectsMetadata,
      createProjectsMetadata,
      updateProjectsMetadata,
      projectTypes,
      isLoading,
      isAdmin,
      currentUser,
    } = this.props
      return (
        <div>
          <MetaDataProjectTypesGridView
            currentUser={currentUser}
            isLoading={isLoading}
            totalCount={projectTypes ? projectTypes.length : 0}
            pageNum={1}
            projectTypes={projectTypes}
            criteria={{ sort: 'createdAt' }}
          />
        </div>
    )
  }
}



ProjectTypesContainer.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProjectsMetadata: PropTypes.func.isRequired,
}


const mapStateToProps = ({ templates, loadUser }) => {
  const powerUserRoles = [ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]

  return {
    projectTypes: templates.projectTypes,
    isLoading: templates.isLoading,
    currentUser: loadUser.user,
    isAdmin: _.intersection(loadUser.user.roles, powerUserRoles).length !== 0
  }
}

const mapDispatchToProps = {
  loadProjectsMetadata,
  saveProductTemplate,
  deleteProjectsMetadata,
}

const page500 = compose(
  withProps({code:500})
)
const showErrorMessageIfError = hasLoaded =>
  branch(hasLoaded, renderComponent(page500(CoderBot)), t => t)
const errorHandler = showErrorMessageIfError(props => props.error)
const enhance = spinnerWhileLoading(props => !props.isLoading || props.templates)
const ProjectTypesContainerWithLoaderEnhanced = enhance(errorHandler(ProjectTypesContainer))
const ProjectTypesContainerWithLoaderAndAuth = requiresAuthentication(ProjectTypesContainerWithLoaderEnhanced)

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectTypesContainerWithLoaderAndAuth))