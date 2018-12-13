/**
 * Project and product templates actions
 */

import { LOAD_PROJECTS_METADATA, ADD_PROJECTS_METADATA, UPDATE_PROJECTS_METADATA, REMOVE_PROJECTS_METADATA } from '../config/constants'
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
