/**
 * Panel component for MetaData
 */
import React from 'react'
import PropTypes from 'prop-types'
import JSONInput from 'react-json-editor-ajrm'
import locale    from 'react-json-editor-ajrm/locale/en'
import _ from 'lodash'
import update from 'react-addons-update'
import Sticky from '../../../components/Sticky'
import MediaQuery from 'react-responsive'
// import ReactJson from 'react-json-view'
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
    this.init = this.init.bind(this)
    this.getMetadata = this.getMetadata.bind(this)
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
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps)
  }

  componentWillMount() {
    const { templates } = this.props
    if (templates && (!templates.productTemplates && !templates.isLoading)) {
      this.props.loadProjectsMetadata()
    } else {
      this.init(this.props)
    }
  }

  init(props) {
    const { metadata, metadataType, isNew, templates } = props
    this.setState({
      project: {
        details: {appDefinition: {}}, version: 'v2'
      },
      dirtyProject: {details: {}, version: 'v2'},
      fields: this.getFields(metadata, metadataType),
      metadata: this.getMetadata(props),
      metadataType,
      isNew,
      isUpdating: templates.isLoading,
    })
  }

  getMetadata(props) {
    const { metadata, metadataType, isNew } = props
    const { metadata : dirtyMetadata } = this.state
    if (isNew && !metadata && !dirtyMetadata) {
      if (metadataType === 'projectTemplate') {
        return { scope: {} }
      }
      if (metadataType === 'productTemplate') {
        return { template: {} }
      }
      return {}
    }
    return metadata ? metadata : dirtyMetadata
  }

  /**
   * get all fields of metadata
   */
  getFields(metadata, metadataType) {
    let fields = []
    if (metadataType === 'productTemplate') {
      fields = fields.concat([
        { key: 'id', type: 'number' },
        { key: 'name', type: 'text' },
        { key: 'productKey', type: 'text' },
        { key: 'category', type: 'text' },
        { key: 'subCategory', type: 'text' },
        { key: 'icon', type: 'text' },
        { key: 'brief', type: 'text' },
        { key: 'details', type: 'text' },
        { key: 'aliases', type: 'array' },
      ])
    } else if (metadataType === 'projectTemplate') {
      fields = fields.concat([
        { key: 'id', type: 'number' },
        { key: 'name', type: 'text' },
        { key: 'key', type: 'text' },
        { key: 'category', type: 'text' },
        { key: 'icon', type: 'text' },
        { key: 'question', type: 'text' },
        { key: 'info', type: 'text' },
        { key: 'aliases', type: 'array' },
        { key: 'phases', type: 'json' },
      ])
    }
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
      const metadataResource = metadataType + 's'
      this.props.updateProjectsMetadata(id, metadataResource, payload)
        .then((res) => {
          if (!res.error) {
            this.props.loadProjectsMetadata()
          }
        })
    } else {
      const payload = _.omit(data, omitKeys)
      // const metadataResource = metadataType + 's'
      this.props.createProjectsMetadata(payload)
        .then((res) => {
          if (!res.error) {
            const createdMetadata = res.action.payload
            window.location = `/metadata/${metadataType}s/${createdMetadata.id}`
          }
        })
    }
  }

  /**
   * delete template
   */
  onDeleteTemplate(value) {
    const {metadataType} = this.state
    const metadataResource = metadataType + 's'
    this.props.deleteProjectsMetadata(value, metadataResource)
      .then((res) => {
        if (!res.error) {
          window.location = `/metadata/${metadataResource}`
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
      const updateQuery = { template : { $set : jsObject } }
      this.setState(update(this.state, { metadata: updateQuery }))
    }
    if (metadataType === 'projectTemplate') {
      const updateQuery = { scope : { $set : jsObject } }
      this.setState(update(this.state, { metadata: updateQuery }))
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
    const { fields, metadata, isNew } = this.state
    let template = {}
    let templateSections = []
    if (metadata && metadataType === 'projectTemplate' && metadata.scope) {
      template = metadata.scope
      templateSections = template.sections
    } else if (metadata && metadataType === 'productTemplate' && metadata.template) {
      template = metadata.template
      templateSections = template.questions
    }
    // console.log(templates)

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
                  <MediaQuery minWidth={SCREEN_BREAKPOINT_MD}>
                    <Sticky top={110}>
                      <Formsy.Form
                        ref="form"
                      >
                        {templateSections.map(this.renderSection)}
                      </Formsy.Form>
                    </Sticky>
                  </MediaQuery>
                </div>
              </div>
            )
          }
        </div>
        <aside className="filters">
          { (metadata || isNew) && (['projectTemplate', 'productTemplate'].indexOf(metadataType) !== -1)  && (
            <div className="json_editor_wrapper">
              <JSONInput
                id="templateJSON"
                placeholder ={ template }
                theme="dark_vscode_tribute"
                locale={ locale }
                height="450px"
                // width='0px'
                onChange={this.onJSONEdit}
              />
              {/* <ReactJson
                src={template}
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
          { !templates.isLoading && (!!metadata || isNew ) && (
            <TemplateForm
              metadata={metadata}
              metadataType={metadataType}
              deleteTemplate={this.onDeleteTemplate}
              changeTemplate={this.onChangeTemplate}
              saveTemplate={this.onSaveTemplate}
              createTemplate={this.onCreateTemplate}
              isNew={isNew}
              fields={fields}
              loadProjectMetadata={this.props.loadProjectsMetadata}
              productCategories={templates['productCategories']}
              projectTypes={templates['projectTypes']}
            />)
          }
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
