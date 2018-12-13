/**
 * Panel component for MetaData
 */
import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import update from 'react-addons-update'
import ReactJson from 'react-json-view'
import SelectDropdown from 'appirio-tech-react-components/components/SelectDropdown/SelectDropdown'
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
    }
    this.renderTemplate = this.renderTemplate.bind(this)
    this.renderSection = this.renderSection.bind(this)
    this.onJSONEdit = this.onJSONEdit.bind(this)
    this.renderCurrentMetadata = this.renderCurrentMetadata.bind(this)
    this.onCreate = this.onCreate.bind(this)

    this.onCreateTemplate = this.onCreateTemplate.bind(this)
    this.onSaveTemplate = this.onSaveTemplate.bind(this)
    this.onDeleteTemplate = this.onDeleteTemplate.bind(this)
    this.onChangeTemplate = this.onChangeTemplate.bind(this)
  }

  componentDidMount() {
    document.title = 'Metadata Management - TopCoder'
    this.setState({
      project: {
        details: { appDefinition: {} }, version: 'v2' },
      dirtyProject: { details: {}, version: 'v2' },
    })
  }

  componentWillReceiveProps() {
    this.setState({
      project: {
        details: {appDefinition: {}}, version: 'v2'
      },
      dirtyProject: {details: {}, version: 'v2'},
    })
  }

  componentWillMount() {
    if (this.props.templates && (!this.props.templates.productTemplates && !this.props.templates.isLoading)) {
      this.props.loadProjectsMetadata()
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
    if (currentTemplateTypeValue === 'productTemplates') {
      omitKeys.push('template')
    } else if (currentTemplateTypeValue === 'projectTemplates') {
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
    if (currentTemplateTypeValue === 'productTemplates') {
      this.setState(update(this.state, {
        template: { template : { $set: updatedObj.updated_src } }
      }))
    } else {
      this.setState(update(this.state, {
        template: { scope : { $set: updatedObj.updated_src } }
      }))
    }

  }

  renderTemplate(option) {
    if (option.value !== '') {
      const { templates } = this.props
      const { currentTemplateType, currentTemplateTypeValue, primaryKeyName } = this.state

      const dataList = templates[currentTemplateTypeValue]
      const entity = _.find(dataList, item => item[primaryKeyName] === option.value)
      let hasTemplate = false
      if (entity.hasOwnProperty('template')) {
        hasTemplate = true
      }
      if (entity.hasOwnProperty('scope')) {
        hasTemplate = true
      }
      this.setState({
        template: entity,
        hasTemplate,
        isNew: false,
        currentTemplateName: currentTemplateType.includes('Templates') ? entity.name : entity.displayName
      })
    } else {
      this.setState({
        template: null,
        hasTemplate: false,
        isNew: false,
        currentTemplateName: ''
      })
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

  renderTemplateTypes(templates) {
    const types = _.remove(Object.keys(templates), key => key !== 'isLoading' && key !== 'error' && key !== 'isProcessing' && key !== 'metadata')
    const list = _.map(types, (type) => {
      return {
        value: type,
        title: _.startCase(type)
      }
    })

    list.unshift({
      title: '- Select Type -',
      value: '',
    })

    return list
  }

  renderCurrentMetadata(option) {
    const { templates } = this.props
    if (templates[option.value] && templates[option.value].length > 0 ) {
      const typeName = templates[option.value][0].hasOwnProperty('id') ? 'id' : 'key'
      const metadataOptions = _.map(templates[option.value], (t) => {
        if (option.value.includes('Templates')) {
          return { value: t.id, title: t.name }
        } else {
          return { value: t.key, title: t.displayName }
        }
      })
      metadataOptions.unshift({
        title: '- Select Item -',
        value: '',
      })
      this.setState({
        fields: this.getFields(templates[option.value][0], option.value),
        metadataOptions,
        currentTemplateType: option.title,
        currentTemplateTypeValue: option.value,
        primaryKeyName: typeName
      })
      this.renderTemplate({
        title: '- Select Item -',
        value: ''
      })
    } else {
      this.setState({
        fields: [],
        metadataOptions: null,
        template: null,
        currentTemplateType: option.title,
        currentTemplateTypeValue: option.value,
        primaryKeyName: ''
      })
    }
  }

  render() {
    const { templates, isAdmin } = this.props
    const { currentTemplateType, currentTemplateName, metadataOptions } = this.state
    let templateSections = null;
    if (this.state.template && this.state.hasTemplate){
      templateSections = this.state.template.hasOwnProperty('template') ? this.state.template.template.questions: this.state.template.scope.sections
      if (!templateSections) templateSections = [];
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

    const metaDataTypes = this.renderTemplateTypes(templates)
    return (
      <div className="meta-data-panel">
        <div className="content">
          <h5>Metadata Type</h5>
          <SelectDropdown
            name="type"
            options={metaDataTypes}
            theme="default"
            onSelect={ this.renderCurrentMetadata }
          />
          {
            metadataOptions && currentTemplateType !== '' && (
              <div className="input-field">
                <h5>{this.state.currentTemplateType} List</h5>
                <SelectDropdown
                  name="template"
                  options={ metadataOptions }
                  onSelect={ this.renderTemplate }
                  theme="default"
                  value={currentTemplateName}
                />
              </div>
            )
          }
          {
            this.state.currentTemplateType && (
              <div className="align-left">
                <button
                  type="submit"
                  className="tc-btn tc-btn-primary align-button"
                  onClick={this.onCreate}
                  disabled={this.state.isNew}
                >
                  Create New {this.state.currentTemplateTypeValue }
                </button>
              </div>
            )
          }
          {this.state.template && this.state.hasTemplate && (
            <div>
              <ReactJson
                src={this.state.template.hasOwnProperty('template') ? this.state.template.template: this.state.template.scope}
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
        {
          this.state.template && (
            <aside className="filters">
              {
                this.state.template && (
                  <TemplateForm
                    template={this.state.template}
                    templateTypeName={currentTemplateType}
                    deleteTemplate={this.onDeleteTemplate}
                    changeTemplate={this.onChangeTemplate}
                    saveTemplate={this.onSaveTemplate}
                    createTemplate={this.onCreateTemplate}
                    isNew={this.state.isNew}
                    fields={this.state.fields}
                    loadProjectMetadata={this.props.loadProjectsMetadata}
                    productCategories={this.props.templates['productCategories']}
                    projectTypes={this.props.templates['projectTypes']}
                  />)
                }

                {
                  //render preview for intake form
                  this.state.template && this.state.hasTemplate && (
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
          )
        }
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
