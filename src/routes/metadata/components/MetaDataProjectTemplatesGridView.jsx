import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import moment from 'moment'
import GridView from '../../../components/Grid/GridView'
// import { PROJECTS_LIST_PER_PAGE } from '../../../../config/constants'
// import TextTruncate from 'react-text-truncate'
// import IconProjectStatusTitle from '../../../assets/icons/status-ico.svg'

import './MetaDataProjectTemplatesGridView.scss'

const MetaDataProjectTemplatesGridView = props => {
  const { totalCount, criteria, pageNum,
    error, isLoading, infiniteAutoload, setInfiniteAutoload,
    applyFilters, projectTemplates } = props

  const currentSortField = _.get(criteria, 'sort', '')
  // This 'little' array is the heart of the list component.
  // it defines what columns should be displayed and more importantly
  // how they should be displayed.
  const columns = [
    {
      id: 'id',
      headerLabel: 'ID',
      classes: 'item-id',
      sortable: false,
      renderText: item => {
        const url = `/metadata/projectTemplates/${item.id}`
        const recentlyCreated = moment().diff(item.createdAt, 'seconds') < 3600
        return (
          <Link to={url} className="spacing">
            {recentlyCreated && <span className="blue-border" />}
            {item.id}
          </Link>
        )
      }
    }, {
      id: 'templateName',
      headerLabel: 'Template',
      classes: 'item-project-templates',
      sortable: false,
      renderText: item => {
        const url = `/metadata/projectTemplates/${item.id}`
        return (
          <div className="spacing project-template-container">
            <div className="template-title">
              <Link to={url} className="link-title">{_.unescape(item.name)}</Link>
            </div>
          </div>
        )
      }
    }, {
      id: 'updatedAt',
      headerLabel: 'Updated At',
      sortable: false,
      classes: 'item-status-date',
      renderText: item => {
        const time = moment(item.updatedAt)
        return (
          <div className="spacing time-container">
            <div className="txt-normal">{time.year() === moment().year() ? time.format('MMM D, h:mm a') : time.format('MMM D YYYY, h:mm a')}</div>
          </div>
        )
      }
    }, {
      id: 'createdAt',
      headerLabel: 'Created At',
      sortable: false,
      classes: 'item-status-date',
      renderText: item => {
        const time = moment(item.createdAt)
        return (
          <div className="spacing time-container">
            <div className="txt-normal">{time.year() === moment().year() ? time.format('MMM D, h:mm a') : time.format('MMM D YYYY, h:mm a')}</div>
          </div>
        )
      }
    }, {
      id: 'status',
      headerLabel: 'Status',
      sortable: false,
      classes: 'item-disable-status',
      renderText: item => {
        return (
          <div className="spacing">
            { item.disabled ? 'Disabled' : 'Active' }
          </div>
        )
      }
    }, {
        id: 'hidden',
        headerLabel: 'Hidden',
        sortable: false,
        classes: 'item-hidden-status',
        renderText: item => {
          return (
            <div className="spacing">
              { item.hidden ? 'Hidden' : 'Visible' }
            </div>
          )
        }
      }
  ]
  console.log(projectTemplates)

  const gridProps = {
    error,
    isLoading,
    columns,
    // onPageChange,
    // sortHandler,
    currentSortField,
    resultSet: projectTemplates,
    totalCount,
    currentPageNum: pageNum,
    pageSize: 50,
    infiniteAutoload,
    infiniteScroll: true,
    setInfiniteAutoload,
    // projectsStatus,
    applyFilters
  }

  return (
    <div className="project-templates-grid-view">
      <button
        type="button"
        className="tc-btn tc-btn-primary align-button"
      >
        Create
      </button>
      <GridView {...gridProps} />
    </div>
  )
}


MetaDataProjectTemplatesGridView.propTypes = {
  currentUser: PropTypes.object.isRequired,
  totalCount: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  // onPageChange: PropTypes.func.isRequired,
  // sortHandler: PropTypes.func.isRequired,
  pageNum: PropTypes.number.isRequired,
  // criteria: PropTypes.object.isRequired,
  projectTemplates: PropTypes.array.isRequired,
}

export default MetaDataProjectTemplatesGridView
