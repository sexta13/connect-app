/**
 * Container component for MetaData
 */
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  loadProjectsMetadata,
  getProductTemplate,
  saveProductTemplate,
  deleteProjectsMetadata,
  createProjectsMetadata,
  updateProjectsMetadata
} from '../../../actions/templates'
import MetaDataPanel from '../components/MetaDataPanel'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import { requiresAuthentication } from '../../../components/AuthenticatedComponent'
const enhance = spinnerWhileLoading(props => !props.templates.isLoading)
const MetaDataContainerWithLoaderEnhanced = enhance(MetaDataPanel)
const MetaDataContainerWithLoaderAndAuth = requiresAuthentication(MetaDataContainerWithLoaderEnhanced)
import {
  ROLE_ADMINISTRATOR,
  ROLE_CONNECT_ADMIN,
} from '../../../config/constants'
import _ from 'lodash'

import './MetaDataContainer.scss'

class MetaDataContainer extends React.Component {

  render() {
    const {
      loadProjectsMetadata,
      deleteProjectsMetadata,
      createProjectsMetadata,
      updateProjectsMetadata,
      templates,
      isAdmin,
    } = this.props

    return (
      <MetaDataContainerWithLoaderEnhanced
        templates={templates}
        loadProjectsMetadata={loadProjectsMetadata}
        deleteProjectsMetadata={deleteProjectsMetadata}
        createProjectsMetadata={createProjectsMetadata}
        updateProjectsMetadata={updateProjectsMetadata}
        isAdmin={isAdmin}
      />
    )
  }
}



MetaDataContainer.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProjectsMetadata: PropTypes.func.isRequired,
  createProjectsMetadata: PropTypes.func.isRequired,
  updateProjectsMetadata: PropTypes.func.isRequired,
}


const mapStateToProps = ({ templates, loadUser }) => {
  const powerUserRoles = [ROLE_ADMINISTRATOR, ROLE_CONNECT_ADMIN]

  return {
    templates,
    isAdmin: _.intersection(loadUser.user.roles, powerUserRoles).length !== 0
  }
}

const mapDispatchToProps = {
  loadProjectsMetadata,
  getProductTemplate,
  saveProductTemplate,
  deleteProjectsMetadata,
  createProjectsMetadata,
  updateProjectsMetadata,
}

export default connect(mapStateToProps, mapDispatchToProps)(MetaDataContainerWithLoaderAndAuth)
