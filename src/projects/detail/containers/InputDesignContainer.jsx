/**
 * Input design container
 * displays input designs in workstream
 *
 */
import React from 'react'
import _ from 'lodash'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as workTimelineSelectors from '../../selectors/workTimelines'
import { loadWorkTimelines } from '../../actions/workTimelines'

import './InputDesignContainer.scss'

class InputDesignContainer extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    const { workTimelines, workId, loadWorkTimelines } = this.props
    if (_.isEmpty(workTimelines)) {
      loadWorkTimelines(workId)
    }
  }

  render () {
    const { designMilestone } = this.props

    if (!designMilestone) {
      return null
    }
    return (
      <button styleName="btn-input-designs"
        className="tc-btn tc-btn-default"
      >
        Input Designs</button>

    )
  }
}

InputDesignContainer.PropTypes = {
  workId: PT.number,
  workTimelines: PT.object,
  designMilestone: PT.arrayOf(PT.shape({
    id: PT.number,
    startDate: PT.string,
    endDate: PT.string,
    name: PT.string,
  })),

}

const mapStateToProps = (state, { workId }) => {
  return {
    designMilestone: workTimelineSelectors.getDesignWorkActiveMilestone(state, workId),
    workTimelines: workTimelineSelectors.getWorkTimelinesByWorkId(state, workId)
  }
}

const mapDispatchToProps = {
  loadWorkTimelines
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(InputDesignContainer))
