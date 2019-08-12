/**
 * DesignWorksOverviewContainer container
 * displays design works information
 *
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { MILESTONE_STATUS } from '../../../config/constants'
import * as workTimelineSelectors from '../../selectors/workTimelines'
import DesignWorks from '../components/DesignWorks'


class DesignWorksOverviewContainer extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const { timelines } = this.props
    const milestones = timelines.reduce((agg, val) => agg.concat(val.milestones), [])


    const designMilestone = milestones &&
            milestones.find(m => m.type === 'design-work' && m.status === MILESTONE_STATUS.ACTIVE)
    if (!designMilestone) {
      return null
    }
    return (
      <DesignWorks
        name={designMilestone.name}
        text={designMilestone.activeText !== 'empty' ? designMilestone.activeText : ''}
      />
    )
  }
}

DesignWorksOverviewContainer.PropTypes = {
  milestone: PT.object.isRequired,
}

const mapStateToProps = (state, {workId}) => {
  return {
    timelines: workTimelineSelectors.getTimelinesByWorkId(state, workId),
  }
}

export default connect (mapStateToProps)(withRouter(DesignWorksOverviewContainer))
