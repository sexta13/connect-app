/**
 * Design works section
 */
import React from 'react'
import PT from 'prop-types'
import { withRouter } from 'react-router-dom'

import './DesignWorks.scss'

const DesignWorks = ({ name, text }) => {
  const milestoneName = `${name} milestone reached`
  return (
    <div styleName="container">
      <div styleName="header">
        <span styleName="title">{milestoneName}</span>
      </div>
      <div styleName="content">{text}</div>
      <div styleName="button">
        <button
          styleName="input-design-works"
          className="tc-btn tc-btn-primary tc-btn-sm"
        >Input Design Works</button>
      </div>

    </div>)
}
DesignWorks.defaultProps = {
  name: ''
}

DesignWorks.propTypes = {
  name: PT.string.isRequired,
  text: PT.string
}

export default withRouter(DesignWorks)