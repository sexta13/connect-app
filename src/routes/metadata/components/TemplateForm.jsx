/**
 * Metadata Fields Form
 */
import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import SelectDropdown from '../../../components/SelectDropdown/SelectDropdown'
import FormsyForm from 'appirio-tech-react-components/components/Formsy'
const TCFormFields = FormsyForm.Fields
const Formsy = FormsyForm.Formsy


import './TemplateForm.scss'

class TemplateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      valid: false,
      fields: [],
      textAreaValid: true,
      productCategories: [],
      projectTypes: [],
      values: null,
      dirty: false,
      isFocused: false,
      isChange: false,
      showDeleteConfirm: false,
      primaryKeyType: '',
      primaryKeyValue: null,
      verifyPrimaryKeyValue: null,
      forcedError: {
        verifyPrimaryKeyValue: null,
      }
    }
    this.onValid = this.onValid.bind(this)
    this.onInvalid = this.onInvalid.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onDuplicate = this.onDuplicate.bind(this)
    this.showDelete = this.showDelete.bind(this)
    this.cancelDelete = this.cancelDelete.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
    this.onChangeDropdown = this.onChangeDropdown.bind(this)
    this.onVerifyPrimaryKeyValueChange = this.onVerifyPrimaryKeyValueChange.bind(this)
    this.init = this.init.bind(this)
  }

  componentDidMount() {
    // this.init(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps)
  }

  componentWillMount() {
    this.init(this.props)
  }

  init(props) {
    const { metadata, metadataType } = props
    const name = metadataType
    const type = metadata.hasOwnProperty('id') ? 'number' : 'text'
    const value = type === 'number' ? metadata['id'] : metadata['key']

    this.setState({
      productCategories: metadataType === 'productTemplate' ? this.getProductCategoryOptions() : [],
      projectTypes: metadataType === 'projectTemplate' ? this.getProjectTypeOptions() : [],
      values: metadata,
      name,
      primaryKeyType: type,
      primaryKeyValue: value
    })
  }

  getProductCategoryOptions() {
    const { productCategories } = this.props
    return _.map(productCategories, (category) => {
      return {
        value: category.key,
        title: category.displayName
      }
    })

  }

  getProjectTypeOptions() {
    const { projectTypes } = this.props
    return _.map(projectTypes, (type) => {
      return {
        value: type.key,
        title: type.displayName
      }
    })
  }

  getField(field, isRequired=true) {
    const { metadata, metadataType } = this.props
    const { values, productCategories, projectTypes } = this.state
    const validations = null
    const type = field['type']
    const label = field['key']
    let value
    let isReadOnly = false
    if (values) {
      value = field['type'] === 'object' ? JSON.stringify(values[label]) : values[label]
      if (values.hasOwnProperty('id') && label === 'id') {
        if (!this.props.isNew) {
          isReadOnly = true
        }
      }
      if (!values.hasOwnProperty('id') && label === 'key') {
        if (!this.props.isNew) {
          isReadOnly = true
        }
      }
    } else {
      value = null
    }

    return (
      <div className="field" key={label}>
        <div className="label">{`${type !== 'checkbox' ? label : ''}`}</div>
        {
          type !== 'checkbox' && label !== 'category' && type !== 'object' && (
            <TCFormFields.TextInput
              wrapperClass="input-field"
              type={type}
              name={label}
              validations={validations}
              value={value || ''}
              validationError={`Please enter ${label}`}
              required={isRequired}
              readonly={isReadOnly}
            />
          )
        }
        {
          type === 'text' && label === 'category' && (
            <div className="dropdown-field">
              <SelectDropdown
                name="category"
                options={ metadataType === 'productTemplate' ? productCategories : projectTypes}
                theme="default"
                onSelect={ this.onChangeDropdown }
                value={value}
                required
              />
            </div>
          )
        }
        {
          type === 'checkbox' && (
            <div className="checkbox">
              <TCFormFields.Checkbox
                ref={label}
                name={label}
                label={label}
                value={value}
              />
            </div>
          )
        }
        {
          type === 'object' && (
            <TCFormFields.Textarea
              wrapperClass="textarea-field"
              name={label}
              value={value}
              validations={validations}
              validationError={`Please enter ${label}`}
            />
          )
        }
      </div>
    )
  }

  onValid() {
    this.setState({valid: true})
  }

  onInvalid() {
    this.setState({valid: false})
  }

  /**
   * Validate the id before delete template
   */
  validate(state) {
    const errors = {
      verifyPrimaryKeyValue: null,
    }

    if (state.verifyPrimaryKeyValue !== null && state.verifyPrimaryKeyValue !== state.primaryKeyValue.toString()) {
      errors.verifyPrimaryKeyValue = `The ${state.primaryKeyType === 'number' ? 'id' : 'key'} do not match`
    }
    return errors
  }

  onVerifyPrimaryKeyValueChange(type, value) {
    const newState = {...this.state,
      verifyPrimaryKeyValue: value,
      isFocused: true,
    }
    newState.forcedError = this.validate(newState)
    this.setState(newState)
  }

  onDuplicate() {
    this.props.createTemplate(true)
  }

  onSave() {
    const { saveTemplate } = this.props
    const { primaryKeyValue, values } = this.state
    let payload = values

    if (values.hasOwnProperty('aliases')) {
      const aliases = _.split(values.aliases, ',')
      payload = _.assign({}, payload, { aliases })
    }
    saveTemplate(primaryKeyValue, payload)
  }

  showDelete() {
    this.setState({
      showDeleteConfirm: true,
    })
  }

  cancelDelete() {
    this.setState({
      showDeleteConfirm: false,
    })
  }

  confirmDelete() {
    const { forcedError, primaryKeyValue } = this.state
    if (!forcedError.verifyPrimaryKeyValue) {
      this.setState({
        showDeleteConfirm: false
      })
      this.props.deleteTemplate(primaryKeyValue)
    }
  }

  onChangeDropdown(option) {
    const { values } = this.state
    this.setState({
      values: _.assign({}, values, {category: option.value})
    })
  }

  onChange(currentValues, isChanged) {
    const { changeTemplate } = this.props
    this.setState({ dirty: isChanged })
    if (currentValues.hasOwnProperty('metadata')) {
      try {
        currentValues.metadata = JSON.parse(currentValues.metadata)
        this.setState({ textAreaValid: true})
        changeTemplate(currentValues)
      } catch (e) {
        this.setState({ textAreaValid: false})
      }
    } else if (currentValues.hasOwnProperty('phases')) {
      try {
        currentValues.phases = JSON.parse(currentValues.phases)
        this.setState({ textAreaValid: true})
        changeTemplate(currentValues)
      } catch (e) {
        this.setState({ textAreaValid: false})
      }
    } else {
      changeTemplate(currentValues)
    }
  }

  render() {
    const { fields } = this.props
    const {
      name,
      showDeleteConfirm,
      primaryKeyType,
      verifyPrimaryKeyValue,
      forcedError,
    } = this.state
    const isRequired = true
    return (
      <div className="template-form-container">
        <Formsy.Form
          className="template-form"
          onInvalid={this.onInvalid}
          onValidSubmit={this.onSubmit}
          onValid={this.onValid}
          onChange={this.onChange}
        >
          {
            _.map(fields, (field) => {
              if (this.props.isNew && field.key !== 'id') {
                return this.getField(field)
              } else if (!this.props.isNew){
                return this.getField(field)
              }

            })
          }
          <div className="controls">
            <button
              type="submit"
              className="tc-btn tc-btn-primary"
              disabled={!this.state.valid || !this.state.textAreaValid}
              onClick={this.onSave}
            >
              Save
            </button>
            <button
              type="submit"
              className="tc-btn tc-btn-primary"
              onClick={this.onDuplicate}
              disabled={this.props.isNew}
            >
              Duplicate
            </button>
            <button
              type="submit"
              className="tc-btn tc-btn-warning"
              onClick={this.showDelete}
              disabled={this.props.isNew}
            >
              Delete
            </button>
          </div>
        </Formsy.Form>
        <Modal
          isOpen={ showDeleteConfirm }
          className="delete-template-dialog"
          overlayClassName="delete-template-dialog-overlay"
          onRequestClose={ this.cancelDelete }
          contentLabel=""
        >

          <div className="modal-title">
            Are you sure you want to delete this template?
          </div>
          <div className="modal-body">
            Please enter the {primaryKeyType === 'number' ? 'id' : 'key'} of the template to be deleted
          </div>
          <Formsy.Form>
            <TCFormFields.TextInput
              wrapperClass="input-field"
              type={primaryKeyType}
              name={primaryKeyType}
              validations={null}
              onChange={this.onVerifyPrimaryKeyValueChange}
              forceErrorMessage={forcedError['verifyPrimaryKeyValue']}
              value=""
              validationError={`Please confirm the ${primaryKeyType === 'number' ? 'id' : 'key'} is the same entity as the selected one`}
              required={isRequired}
            />
          </Formsy.Form>

          <div className="button-area flex center action-area">
            <button
              className="tc-btn tc-btn-default tc-btn-sm action-btn btn-cancel"
              onClick={this.cancelDelete}
            >Cancel</button>
            <button
              className="tc-btn tc-btn-warning tc-btn-sm action-btn "
              onClick={this.confirmDelete}
              disabled={!verifyPrimaryKeyValue || forcedError.verifyPrimaryKeyValue}
            >Delete
            </button>
          </div>
        </Modal>
      </div>
    )
  }
}

TemplateForm.propTypes = {
  isNew: PropTypes.bool.isRequired,
  fields: PropTypes.array.isRequired,
  productCategories: PropTypes.array.isRequired,
  projectTypes: PropTypes.array.isRequired,
  metadata: PropTypes.object.isRequired,
  metadataType: PropTypes.string.isRequired,
  deleteTemplate: PropTypes.func.isRequired,
  saveTemplate: PropTypes.func.isRequired,
  changeTemplate: PropTypes.func.isRequired,
  createTemplate: PropTypes.func.isRequired,
  loadProjectMetadata: PropTypes.func.isRequired,
}

export default TemplateForm
