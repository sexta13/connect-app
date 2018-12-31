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
import CoderBroken from '../../../assets/icons/coder-broken.svg'

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
      projectTypes,
      isLoading,
      isAdmin,
      currentUser,
    } = this.props
    if (!isAdmin) {
      return (
        <section className="content content-error">
          <div className="container">
            <div className="page-error">
              <CoderBroken className="icon-coder-broken" />
              <span>You don't have permission to access Metadata Management</span>
            </div>
          </div>
        </section>
      )
    }
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