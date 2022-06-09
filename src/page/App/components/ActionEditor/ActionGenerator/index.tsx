import { FC, useState } from "react"
import { Modal } from "@illa-design/modal"
import { ActionTypeSelector } from "@/page/App/components/ActionEditor/ActionGenerator/ActionTypeSelector"
import { ActionResourceSelector } from "@/page/App/components/ActionEditor/ActionGenerator/ActionResourceSelector"
import { ActionTypeInfo } from "@/page/App/components/ActionEditor/ActionGenerator/ActionTypeSelector/interface"
import { ResourceFormEditor } from "@/page/App/components/ActionEditor/ResourceForm/Editor"
import { modalStyle } from "./style"
import { ActionGeneratorProps, ActionGeneratorSteps } from "./interface"

function onSelectActionType(
  info: ActionTypeInfo,
  props: ActionGeneratorProps,
  setStep: (step: ActionGeneratorSteps) => void,
  setResourceType: (resourceType: string) => void,
) {
  const { category, type } = info
  const { onAddAction } = props

  switch (category) {
    case "jsTransformer": {
      onAddAction?.(info)
      break
    }
    case "apis":
    case "databases": {
      // check if has resource, to create if not, to list if has
      setResourceType(type)
      setStep("resource")
      break
    }
    default:
      break
  }
}

function renderStep(
  step: ActionGeneratorSteps,
  resourceType: string,
  props: ActionGeneratorProps,
  setStep: (step: ActionGeneratorSteps) => void,
  setResourceType: (resourceType: string) => void,
) {
  const { onAddAction } = props
  const [defaultSelectedResourceId, setDefaultSelectedResourceId] = useState("")

  switch (step) {
    case "type":
      return (
        <ActionTypeSelector
          onSelect={(info) => {
            onSelectActionType(info, props, setStep, setResourceType)
          }}
        />
      )
    case "resource":
      return (
        <ActionResourceSelector
          resourceType={resourceType}
          onBack={() => {
            setStep("type")
            setResourceType("")
          }}
          onCreateResource={(resourceType) => {
            setResourceType(resourceType)
            setStep("resource-create")
          }}
          onCreateAction={(resourceType, resourceId) => {
            onAddAction?.({ type: resourceType, resourceId })
          }}
          defaultSelectedResourceId={defaultSelectedResourceId}
        />
      )
    case "resource-create":
      return (
        <ResourceFormEditor
          actionType="configure"
          resourceType={resourceType}
          back={() => {
            setStep("resource")
          }}
          onSubmit={(resourceId) => {
            setStep("resource")
            setDefaultSelectedResourceId(resourceId)
          }}
        />
      )
  }
}

export const ActionGenerator: FC<ActionGeneratorProps> = function(props) {
  const { visible, onClose } = props
  const [step, setStep] = useState<ActionGeneratorSteps>("type")
  const [resourceType, setResourceType] = useState<string>("")

  return (
    <Modal
      _css={modalStyle}
      visible={visible}
      footer={false}
      closable
      maskClosable={false}
      withoutPadding
      onCancel={onClose}
    >
      {renderStep(step, resourceType, props, setStep, setResourceType)}
    </Modal>
  )
}

ActionGenerator.displayName = "ActionGenerator"
