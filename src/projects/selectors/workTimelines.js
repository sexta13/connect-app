import _ from 'lodash'
import { MILESTONE_STATUS } from '../../config/constants'

export const getWorkTimelinesByWorkId = (state, workId) => {
  return _.get(state, `workTimelines[${workId}]`, {})
}

export const getTimelinesByWorkId = (state, workId) => {
  return _.get(state, `workTimelines[${workId}].timelines`, [])
}

export const isLoadingWorkTimelineByWorkId = (state, workId) => {
  return _.get(state, `workTimelines[${workId}].isLoading`, false)
}

export const getDesignWorkActiveMilestone = (state, workId) => {
  const timelines = getTimelinesByWorkId(state, workId)
  const milestones = timelines.reduce((agg, val) => agg.concat(val.milestones), [])

  return milestones &&
    milestones.find(m => m.type === 'design-work' && m.status === MILESTONE_STATUS.ACTIVE)
}