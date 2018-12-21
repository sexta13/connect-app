/**
 * Panel component for MetaData
 */
import React from 'react'
import PropTypes from 'prop-types'
import JSONInput from 'react-json-editor-ajrm';
import locale    from 'react-json-editor-ajrm/locale/en';
import _ from 'lodash'
import update from 'react-addons-update'
import Sticky from '../../../components/Sticky'
import MediaQuery from 'react-responsive'
import ReactJson from 'react-json-view'
import SpecSection from '../../../projects/detail/components/SpecSection'
import TemplateForm from './TemplateForm'
import CoderBroken from '../../../assets/icons/coder-broken.svg'
import { SCREEN_BREAKPOINT_MD } from '../../../config/constants'

import './MetaDataPanel.scss'

class MetaDataPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTemplateType: '',
      metadataType: '',
      currentTemplateName: '',
      primaryKeyName: '',
      metadata: null,
      isNew: false,
      isProcessing: false,
      project: {},
      fields: []
    }
    this.renderSection = this.renderSection.bind(this)
    this.onJSONEdit = this.onJSONEdit.bind(this)
    this.onCreate = this.onCreate.bind(this)

    this.onCreateTemplate = this.onCreateTemplate.bind(this)
    this.onSaveTemplate = this.onSaveTemplate.bind(this)
    this.onDeleteTemplate = this.onDeleteTemplate.bind(this)
    this.onChangeTemplate = this.onChangeTemplate.bind(this)
  }

  componentDidMount() {
    document.title = 'Metadata Management - TopCoder'
    // this.setState({
    //   project: {
    //     details: { appDefinition: {} }, version: 'v2' },
    //   dirtyProject: { details: {}, version: 'v2' },
    // })
  }

  componentWillReceiveProps(nextProps) {
    const { metadata, metadataType } = nextProps
    this.setState({
      project: {
        details: {appDefinition: {}}, version: 'v2'
      },
      dirtyProject: {details: {}, version: 'v2'},
      fields: this.getFields(metadata, metadataType),
      metadata,
      metadataType,
    })
  }

  componentWillMount() {
    const { metadata, metadataType, templates } = this.props
    if (templates && (!templates.productTemplates && !templates.isLoading)) {
      this.props.loadProjectsMetadata()
    } else {
      this.setState({
        project: {
          details: {appDefinition: {}}, version: 'v2'
        },
        dirtyProject: {details: {}, version: 'v2'},
        fields: this.getFields(metadata, metadataType),
        metadata,
        metadataType,
      })
    }
  }

  /**
   * get field type
   */
  getFieldType(obj) {
    const type = ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    switch (type) {
    case 'boolean':
      return 'checkbox'
    case 'string':
      return 'text'
    case 'number':
      return 'number'
    case 'object':
      return 'object'
    default:
      return type
    }
  }

  /**
   * get all fields of template
   */
  getFields(template, currentTemplateTypeValue) {
    const omitKeys = ['createdAt', 'updatedAt', 'createdBy', 'updatedBy']
    if (currentTemplateTypeValue === 'productTemplate') {
      omitKeys.push('template')
    } else if (currentTemplateTypeValue === 'projectTemplate') {
      omitKeys.push('scope')
    }
    const keys = Object.keys(_.omit(template, omitKeys))
    const fields = []
    _.forEach(keys, (key) => {
      const obj = {
        key,
        type: this.getFieldType(template[key])
      }
      fields.push(obj)
    })
    return fields
  }

  onCreate() {
    this.onCreateTemplate(false)
  }

  /**
   * create new template
   */
  onCreateTemplate(isDuplicate) {
    const { fields, metadata, metadataType } = this.state
    const newValues = _.assign({}, metadata)
    if (!isDuplicate) {
      _.forEach(fields, (field) => {
        switch (field.type) {
        case 'checkbox':
          newValues[field.key] = false
          break
        default:
          newValues[field.key] = null
          break
        }
      })
      if (metadataType === 'productTemplate') {
        newValues.template = {}
      }

      if (metadataType === 'projectTemplate') {
        newValues.scope = {}
      }
    } else {
      if (newValues.hasOwnProperty('id')) {
        newValues.id = null
      } else {
        newValues.key = null
      }
    }

    this.setState({
      metadata: newValues,
      isNew: true,
    })
  }

  /**
   * save template
   */
  onSaveTemplate(id, data) {
    const {metadataType, isNew } = this.state
    const omitKeys = ['createdAt', 'createdBy', 'updatedAt', 'updatedBy']
    if (!isNew) {
      if (metadataType === 'productTemplates') {
        omitKeys.push('aliases')
      }
      const payload = _.omit(data, omitKeys)
      this.props.updateProjectsMetadata(id, metadataType, payload)
        .then((res) => {
          if (!res.error) {
            this.props.loadProjectsMetadata()
          }
        })
    } else {
      const payload = _.omit(data, omitKeys)
      this.props.createProjectsMetadata(metadataType, payload)
        .then((res) => {
          if (!res.error) {
            this.props.loadProjectsMetadata()
          }
        })
    }
  }

  /**
   * delete template
   */
  onDeleteTemplate(value) {
    const {metadataType} = this.state
    this.props.deleteProjectsMetadata(value, metadataType)
      .then((res) => {
        if (!res.error) {
          this.props.loadProjectsMetadata()
        }
      })
  }

  /**
   * change current template
   */
  onChangeTemplate(data) {
    const { metadata } = this.state
    const newTemplate = _.assign({}, metadata, data)
    this.setState({
      metadata: newTemplate,
    })
  }

  onJSONEdit({ jsObject }) {
    const { metadataType } = this.state
    if (metadataType === 'productTemplate') {
      this.setState(update(this.state, {
        metadata: { template : { questions : { $set: jsObject } } }
      }))
    } else {
      this.setState(update(this.state, {
        metadata: { scope : { sections : { $set: jsObject } } }
      }))
    }

  }

  renderSection(section, idx) {
    return (
      <div key={idx}>
        <SpecSection
          {...section}
          project={this.state.project}
          dirtyProject={this.state.dirtyProject}
          isProjectDirty={this.state.isProjectDirty}
          sectionNumber={idx + 1}
          resetFeatures={ () => {} }
          showFeaturesDialog={() => {} }
          // TODO we shoudl not update the props (section is coming from props)
          validate={(isInvalid) => section.isInvalid = isInvalid}
          showHidden={false}
          addAttachment={ () => {} }
          updateAttachment={ () => {} }
          removeAttachment={ () => {} }
          attachmentsStorePath={'dummy'}
          canManageAttachments
        />
        <div className="section-footer section-footer-spec">
          <button className="tc-btn tc-btn-primary tc-btn-md" type="submit">Save Changes</button>
        </div>
      </div>
    )
  }

  render() {
    const { isAdmin, metadataType, templates } = this.props
    const { fields, metadata } = this.state
    let templateSections = []
    if (metadata && metadataType === 'projectTemplate') {
      templateSections = metadata.scope.sections
    } else if (metadata && metadataType === 'productTemplate') {
      templateSections = metadata.template.questions
    }

    if (!isAdmin) {
      return (
        <section className="content content-error">
          <div className="container">
            <div className="page-error">
              <CoderBroken className="icon-coder-broken" />
              <span>You don't have permission to access Metadata Management</span>
            </div>
          </div>
        </section>
      )
    }

    return (
      <div className="meta-data-panel">
        <div className="content">
          {
              //render preview for intake form
              templateSections && (
                <div className="ProjectWizard">
                  <div className="FillProjectDetails">
                  <h1>Template form preview</h1>
                    <Formsy.Form
                      ref="form"
                    >
                      {templateSections.map(this.renderSection)}
                    </Formsy.Form>
                  </div>
                </div>
              )}
            )
          }
        </div>
        <aside className="filters">
          <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
            <Sticky top={110}>
              { metadata && (['projectTemplate', 'productTemplate'].indexOf(metadataType) !== -1)  && (
                <div className="json_editor_wrapper">
                  <JSONInput
                      id='templateJSON'
                      placeholder ={ templateSections }
                      theme='dark_vscode_tribute'
                      locale={ locale }
                      height='450px'
                      // width='0px'
                      onChange={this.onJSONEdit}
                  />
                  {/* <ReactJson
                    src={templateSections}
                    theme="rjv-default"
                    onEdit={this.onJSONEdit}
                    onAdd={this.onJSONEdit}
                    onDelete={this.onJSONEdit}
                    collapsed={3}
                    indentWidth={2}
                    collapseStringsAfterLength={20}
                  /> */}
                </div>
              )
              }
              { !!metadata && (
                <TemplateForm
                  metadata={metadata}
                  metadataType={metadataType}
                  deleteTemplate={this.onDeleteTemplate}
                  changeTemplate={this.onChangeTemplate}
                  saveTemplate={this.onSaveTemplate}
                  createTemplate={this.onCreateTemplate}
                  isNew={this.state.isNew}
                  fields={fields}
                  loadProjectMetadata={this.props.loadProjectsMetadata}
                  productCategories={templates['productCategories']}
                  projectTypes={templates['projectTypes']}
                />)
              }
              </Sticky>
            </MediaQuery>
        </aside>
      </div>
    )
  }
}

MetaDataPanel.propTypes = {
  loadProjectsMetadata: PropTypes.func.isRequired,
  deleteProjectsMetadata: PropTypes.func.isRequired,
  createProjectsMetadata: PropTypes.func.isRequired,
  updateProjectsMetadata: PropTypes.func.isRequired,
  templates: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
}

export default MetaDataPanel
