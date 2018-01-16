import React from 'react'
import PT from 'prop-types'
import ModalControl from '../ModalControl'
import SVGIcons from '../Icons/Icons'
import './Wizard.scss'

function Wizard(props) {
  const { step, shouldRenderBackButton, onStepChange, showModal, onCancel } = props
  let backControl
  let modalCloseControl
  if (step && (!shouldRenderBackButton || shouldRenderBackButton(step))) {
    backControl = (
      <ModalControl
        className="back-button"
        icon={<SVGIcons.IconTailLeft className="icon-tail-left"/>}
        label="back"
        onClick={() => onStepChange(step - 1)}
      />
    )
  }
  if (showModal) {
    modalCloseControl = (
      <ModalControl
        className="escape-button"
        icon={<SVGIcons.IconXMark className="icon-x-mark"/>}
        label="esc"
        onClick={ onCancel }
      />
    )
  }
  return (
    <div className={`Wizard ${props.className}`}>
      <div className="content">
        {backControl}
        { modalCloseControl }
        {props.children[step]}
      </div>
    </div>
  )
}

Wizard.proptTypes = {
  children: PT.node.isRequired,
  onCancel: PT.node.isRequired,
  onStepChange: PT.func.isRequired,
  step: PT.number.isRequired,
  showModal: PT.bool,
  shouldRenderBackButton: PT.func
}

export default Wizard
