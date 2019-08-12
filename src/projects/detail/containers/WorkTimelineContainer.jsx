/**
 * WorkTimelineContainer container
 * displays content of the work timeline section
 *
 * NOTE data is loaded by the parent ProjectDetail component
 */
import React from 'react'
import PT from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import WorkTimeline from '../components/work-timeline/WorkTimeline'
import spinnerWhileLoading from '../../../components/LoadingSpinner'
import { loadWorkTimelines } from '../../actions/workTimelines'
import * as workTimelineSelectors from '../../selectors/workTimelines'

const spinner = spinnerWhileLoading(props => !props.isLoadingTimelines)
const EnhancedCreateView = spinner(WorkTimeline)


class WorkTimelineContainer extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    // load timeline
    const { workTimelines, loadWorkTimelines, workId } = this.props
    _.isEmpty(workTimelines) && loadWorkTimelines(workId)
  }

  render () {
    return (
      <EnhancedCreateView
        {...this.props}
      />
    )
  }
}

WorkTimelineContainer.PropTypes = {
  workId: PT.number.isRequired,
  editMode: PT.bool.isRequired,
  isLoadingTimelines: PT.bool.isRequired,
  timelines: PT.arrayOf(PT.shape({
    id: PT.number.isRequired,
    startDate: PT.string,
    milestones: PT.arrayOf(PT.shape({
      id: PT.number,
      startDate: PT.string,
      endDate: PT.string,
      name: PT.string,
    })),
  })).isRequired,
  loadWorkTimelines: PT.func.isRequired,
}

const mapStateToProps = (state, { workId }) => {
  return {
    timelines: workTimelineSelectors.getTimelinesByWorkId(state, workId),
    loadedTimelinesWorkId: workId, // work id that already loaded timelines
    isLoadingTimelines: workTimelineSelectors.isLoadingWorkTimelineByWorkId(state, workId),
    workingTimelines: workTimelineSelectors.getWorkTimelinesByWorkId(state, workId),
  }
}

const mapDispatchToProps = {
  loadWorkTimelines
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkTimelineContainer))
