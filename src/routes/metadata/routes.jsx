/**
 * Metadata routes
 */
import React from 'react'
import { Route } from 'react-router-dom'
import { renderApp } from '../../components/App/App'
import TopBarContainer from '../../components/TopBar/TopBarContainer'
import MetaDataToolBar from './components/MetaDataToolBar'
import MetaDataContainer from './containers/MetaDataContainer'

export default (
  <Route path="/metadata" render={renderApp(<TopBarContainer toolbar={MetaDataToolBar} />, <MetaDataContainer />)} />
)
