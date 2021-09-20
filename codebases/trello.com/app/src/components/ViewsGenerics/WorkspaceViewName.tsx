import React, { useCallback, useState } from 'react';
import styles from './WorkspaceViewName.less';
import { getKey, isSubmitEvent, Key } from '@trello/keybindings';
import { Textfield } from '@trello/nachos/textfield';
import { useUpdateWorkspaceViewNameMutation } from './UpdateWorkspaceViewNameMutation.generated';
import classnames from 'classnames';
import { Tooltip } from '@trello/nachos/tooltip';
type WorkspaceViewNameProps = {
  initialViewName: string;
  editable?: boolean;
} & (
  | {
      editable: true;
      idWorkspaceView: string;
    }
  | {
      editable?: false;
    }
);
const MAX_LENGTH = 100;
const isValidViewName = (viewName: string): boolean =>
  viewName.length > 0 && viewName.length <= MAX_LENGTH;

export const WorkspaceViewNameInput: React.FunctionComponent<{
  initialViewName: string;
  name: string;
  idWorkspaceView: string;
  onCancel: () => void;
  onNameChange: (name: string) => void;
}> = ({ initialViewName, onCancel, onNameChange, idWorkspaceView }) => {
  const [updateWorkspaceviewName] = useUpdateWorkspaceViewNameMutation();
  const onBlur = useCallback(
    (e: { target: HTMLInputElement }) => {
      const newName = e.target.value.trim();
      const isValidChange = isValidViewName(newName);
      if (isValidChange && newName !== initialViewName) {
        onNameChange(newName);
        updateWorkspaceviewName({
          variables: { idOrganizationView: idWorkspaceView, name: newName },
        });
      } else {
        onCancel();
      }
    },
    [
      idWorkspaceView,
      initialViewName,
      onCancel,
      onNameChange,
      updateWorkspaceviewName,
    ],
  );
  const onInputKeyDown = useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement> & { target: HTMLInputElement },
    ) => {
      if (isSubmitEvent(e)) {
        e.target.blur();
      } else if (getKey(e) === Key.Escape) {
        onCancel();
      }
    },
    [onCancel],
  );
  return (
    <Textfield
      className={styles.viewNameWrapper}
      appearance="default"
      onBlur={onBlur}
      onKeyDown={onInputKeyDown}
      defaultValue={initialViewName}
      autoFocus={true}
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      type="text"
      minLength={1}
      maxLength={MAX_LENGTH}
      // eslint-disable-next-line react/jsx-no-bind
      onFocus={(e) => e.currentTarget.select()}
    />
  );
};

export const WorkspaceViewName: React.FunctionComponent<WorkspaceViewNameProps> = ({
  initialViewName,
  ...props
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialViewName);
  const onEdit = useCallback(() => setIsEditing(true), []);
  const onCancel = useCallback(() => setIsEditing(false), []);
  const onNameChange = useCallback((newName: string) => {
    setIsEditing(false);
    setName(newName);
  }, []);

  return isEditing && props.editable ? (
    <WorkspaceViewNameInput
      idWorkspaceView={props.idWorkspaceView}
      initialViewName={name}
      name={name}
      onNameChange={onNameChange}
      onCancel={onCancel}
    />
  ) : (
    <div
      role="textbox"
      onFocus={props.editable ? onEdit : undefined}
      className={classnames(
        styles.viewNameWrapper,
        props.editable && styles.viewNameEditableWrapper,
      )}
      tabIndex={0}
    >
      <span className={styles.viewNameText}>
        <Tooltip
          content={name}
          delay={1000}
          hideTooltipOnClick
          hideTooltipOnMouseDown
        >
          <p className={styles.viewNameText}>{name}</p>
        </Tooltip>
      </span>
    </div>
  );
};
