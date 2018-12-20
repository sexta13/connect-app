/**
 * Panel component for MetaData
 */
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import update from 'react-addons-update'
import ReactJson from 'react-json-view'
import SpecSection from '../../../projects/detail/components/SpecSection'
import TemplateForm from './TemplateForm'
import CoderBroken from '../../../assets/icons/coder-broken.svg'

import './MetaDataPanel.scss'

class MetaDataPanel extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTemplateType: '',
      currentTemplateTypeValue: '',
      currentTemplateName: '',
      primaryKeyName: '',
      template: null,
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
    const { fields, template, currentTemplateTypeValue } = this.state
    const newValues = _.assign({}, template)
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
      if (currentTemplateTypeValue === 'productTemplates') {
        newValues.template = {}
      }

      if (currentTemplateTypeValue === 'projectTemplates') {
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
      template: newValues,
      isNew: true,
    })
  }

  /**
   * save template
   */
  onSaveTemplate(id, data) {
    const {currentTemplateTypeValue, isNew } = this.state
    const omitKeys = ['createdAt', 'createdBy', 'updatedAt', 'updatedBy']
    if (!isNew) {
      if (currentTemplateTypeValue === 'productTemplates') {
        omitKeys.push('aliases')
      }
      const payload = _.omit(data, omitKeys)
      this.props.updateProjectsMetadata(id, currentTemplateTypeValue, payload)
        .then((res) => {
          if (!res.error) {
            this.props.loadProjectsMetadata()
          }
        })
    } else {
      const payload = _.omit(data, omitKeys)
      this.props.createProjectsMetadata(currentTemplateTypeValue, payload)
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
    const {currentTemplateTypeValue} = this.state
    this.props.deleteProjectsMetadata(value, currentTemplateTypeValue)
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
    const { template } = this.state
    const newTemplate = _.assign({}, template, data)
    this.setState({
      template: newTemplate,
    })
  }

  onJSONEdit(updatedObj) {
    console.log(updatedObj)
    const { currentTemplateTypeValue } = this.state
    if (currentTemplateTypeValue === 'productTemplate') {
      this.setState(update(this.state, {
        template: { template : { $set: updatedObj.updated_src } }
      }))
    } else {
      this.setState(update(this.state, {
        template: { scope : { $set: updatedObj.updated_src } }
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
    const { isAdmin, metadataType, metadata, templates } = this.props
    const { fields } = this.state
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
          { metadata && (['projectTemplate', 'productTemplate'].indexOf(metadataType) !== -1)  && (
            <div>
              <ReactJson
                src={templateSections}
                theme="rjv-default"
                onEdit={this.onJSONEdit}
                onAdd={this.onJSONEdit}
                onDelete={this.onJSONEdit}
                collapsed={3}
                indentWidth={2}
                collapseStringsAfterLength={20}
              />
            </div>
          )
          }
        </div>
        <aside className="filters">
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
