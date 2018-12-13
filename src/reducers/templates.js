import {
  LOAD_PROJECTS_METADATA_PENDING,
  LOAD_PROJECTS_METADATA_SUCCESS,
  ADD_PROJECTS_METADATA_PENDING,
  UPDATE_PROJECTS_METADATA_PENDING,
  REMOVE_PROJECT_ATTACHMENT_PENDING,
  ADD_PROJECTS_METADATA_FAILURE,
  UPDATE_PROJECTS_METADATA_FAILURE,
  REMOVE_PROJECT_ATTACHMENT_FAILURE,
  ADD_PROJECTS_METADATA_SUCCESS,
  UPDATE_PROJECTS_METADATA_SUCCESS,
  REMOVE_PROJECTS_METADATA_SUCCESS,
} from '../config/constants'
import Alert from 'react-s-alert'

export const initialState = {
  projectTemplates: null,
  projectTypes: null,
  productTemplates: null,
  productCategories: null,
  milestoneTemplates: null,
  isLoading: false,
  error: false,
}

export default function(state = initialState, action) {
  switch (action.type) {
  case LOAD_PROJECTS_METADATA_PENDING:
    return {
      ...state,
      isLoading: true
    }
  case LOAD_PROJECTS_METADATA_SUCCESS: {
    const { projectTemplates, projectTypes, productTemplates, productCategories, milestoneTemplates } = action.payload
    return {
      ...state,
      projectTemplates,
      projectTypes,
      productTemplates,
      productCategories,
      milestoneTemplates,
      isLoading: false,
    }
  }
  case ADD_PROJECTS_METADATA_PENDING:
  case UPDATE_PROJECTS_METADATA_PENDING:
  case REMOVE_PROJECT_ATTACHMENT_PENDING:
    return {
      ...state,
      isLoading: true
    }
  case ADD_PROJECTS_METADATA_FAILURE:
    Alert.error(`PROJECT METADATA CREATE FAILED: ${action.payload.response.data.result.content.message}`)
    return {
      ...state,
      isLoading: false,
      error: action.payload.response.data.result.content.message
    }
  case UPDATE_PROJECTS_METADATA_FAILURE:
    Alert.error(`PROJECT METADATA UPDATE FAILED: ${action.payload.response.data.result.content.message}`)
    return {
      ...state,
      isLoading: false,
      error: action.payload.response.data.result.content.message
    }
  case REMOVE_PROJECT_ATTACHMENT_FAILURE:
    Alert.error(`PROJECT METADATA DELETE FAILED: ${action.payload.response.data.result.content.message}`)
    return {
      ...state,
      isLoading: false,
      error: action.payload.response.data.result.content.message
    }
  case ADD_PROJECTS_METADATA_SUCCESS:
    Alert.success('PROJECT METADATA CREATE SUCCESS')
    return {
      ...state,
      isLoading: false,
      metadata: action.payload,
      error: false,
    }
  case UPDATE_PROJECTS_METADATA_SUCCESS:
    Alert.success('PROJECT METADATA UPDATE SUCCESS')
    return {
      ...state,
      isLoading: false,
      metadata: action.payload,
      error: false,
    }
  case REMOVE_PROJECTS_METADATA_SUCCESS:
    Alert.success('PROJECT METADATA DELETE SUCCESS')
    return {
      ...state,
      isLoading: false,
      error: false,
      metadata: null
    }
  default: return state
  }
}
