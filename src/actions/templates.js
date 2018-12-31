/**
 * Project and product templates actions
 */

import _ from 'lodash'
import {
  LOAD_PROJECTS_METADATA, ADD_PROJECTS_METADATA, UPDATE_PROJECTS_METADATA, REMOVE_PROJECTS_METADATA,
  PROJECT_TEMPLATES_SORT, PRODUCT_TEMPLATES_SORT, CREATE_PROJECT_TEMPLATE
} from '../config/constants'
import {
  getProjectsMetadata,
  createProjectsMetadata as createProjectsMetadataAPI,
  updateProjectsMetadata as updateProjectsMetadataAPI,
  deleteProjectsMetadata as deleteProjectsMetadataAPI } from '../api/templates'

export function loadProjectsMetadata() {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECTS_METADATA,
      payload: getProjectsMetadata()
    })
  }
}

export function getProductTemplate() {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECTS_METADATA,
      payload: getProjectsMetadata()
    })
  }
}

export function saveProductTemplate() {
  return (dispatch) => {
    return dispatch({
      type: LOAD_PROJECTS_METADATA,
      payload: getProjectsMetadata()
    })
  }
}

export function createProjectsMetadata(type, data) {
  return (dispatch) => {
    return dispatch({
      type: ADD_PROJECTS_METADATA,
      payload: createProjectsMetadataAPI(type, data)
    })
  }
}

export function createProjectTemplate(data) {
  return (dispatch) => {
    return dispatch({
      type: CREATE_PROJECT_TEMPLATE,
      payload: createProjectsMetadataAPI('projectTemplates', data)
    })
  }
}

export function updateProjectsMetadata(metadataId, type, data) {
  return (dispatch) => {
    return dispatch({
      type: UPDATE_PROJECTS_METADATA,
      payload: updateProjectsMetadataAPI(metadataId, type, data)
    })
  }
}

export function deleteProjectsMetadata(metadataId, type) {
  return (dispatch) => {
    return dispatch({
      type: REMOVE_PROJECTS_METADATA,
      payload: deleteProjectsMetadataAPI(metadataId, type)
    })
  }
}

export function sortProjectTemplates(criteria) {
  return (dispatch) => {
    const fieldName = _.split(criteria, ' ')[0]
    const order = _.split(criteria, ' ')[1] || 'asc'
    
    return dispatch({
      type: PROJECT_TEMPLATES_SORT,
      payload: { fieldName, order }
    })
  }
}

export function sortProductTemplates(criteria) {
  return (dispatch) => {
    const fieldName = _.split(criteria, ' ')[0]
    const order = _.split(criteria, ' ')[1] || 'asc'
    
    return dispatch({
      type: PRODUCT_TEMPLATES_SORT,
      payload: { fieldName, order }
    })
  }
}