/**
 * Toolbar container
 */
import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import PT from 'prop-types'
import InvisibleIcon from '../../../assets/icons/invisible-12.svg'
import FileIcon from '../../../assets/icons/file.svg'
import MenuList from 'components/MenuList/MenuList'

const MenuListContainer = ({
  isProjectLoading,
  match,
  project,
}) => {
  // we only know which menu items to render when we know project version
  if (isProjectLoading || !project) {
    return null
  }

  // choose set of menu links based on the project version
  const navLinks = project.version === 'v3' ? [
    { icon: <InvisibleIcon/>, label: 'Dashboard', to: `/projects/${match.params.projectId}` },
    { icon: <InvisibleIcon/>, label: 'Scope', to: `/projects/${match.params.projectId}/scope` },
    { icon: <InvisibleIcon/>, label: 'Project Plan', to: `/projects/${match.params.projectId}/plan` },
  ] : [
    {icon: <InvisibleIcon/>, label: 'Dashboard', to: `/projects/${match.params.projectId}` },
    {icon: <InvisibleIcon/>, label: 'Specification', to: `/projects/${match.params.projectId}/specification` },
  ]

  // `Discussions` items can be added as soon as project is loaded
  // if discussions are not hidden for it
  if (!isProjectLoading && project && project.details && !project.details.hideDiscussions) {
    navLinks.push({icon: <InvisibleIcon/>, label: 'Discussions', to: `/projects/${match.params.projectId}/discussions` })
  }
  // Messages, Reports and Assets Library
  navLinks.push(
    {icon: <InvisibleIcon/>, label: 'Messages', to: '#messages'},
    {icon: <InvisibleIcon/>, label: 'Reports', to: '#reports'},
    {icon: <FileIcon/>, label: 'Assets Library', to:'#assets'})
  return (
    <MenuList menuItems={navLinks} />
  )
}

MenuListContainer.propTypes = {
  project: PT.object,
}

const mapStateToProps = (state) => ({
  isProjectLoading: state.projectState.isLoading,
  match: PT.shape({
    params: PT.shape({
      projectId: PT.string,
    })
  }),
  project: state.projectState.project,
})

export default connect(mapStateToProps)(withRouter(MenuListContainer))
