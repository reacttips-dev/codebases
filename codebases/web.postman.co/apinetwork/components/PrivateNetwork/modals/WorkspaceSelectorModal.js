import React, { Fragment, useState } from 'react';

import { Modal, ModalHeader, ModalContent, ModalFooter, Flex, Button, Heading, Tooltip } from '@postman/aether';
import WorkspaceItems from '../../../common/WorkspaceItems';
import { Input } from '../../../../js/components/base/Inputs';
import LoadingIndicator from '../../../../js/components/base/LoadingIndicator';

/**
 * Modal to choose workspace for navigation
 */
export default function WorkspaceSelectModal (props) {
  const [search, setSearch] = useState(''),
    [highlightedWorkspace, setHighlightedWorkspace] = useState(null);

  return (
    <Modal
      className='workspace-select-modal'
      isOpen={props.isOpen}
      onClose={() => {
        setSearch('');

        setHighlightedWorkspace(null);
        props.onCancel && props.onCancel();
      }}
      size='medium'
    >
      <ModalHeader heading={props.title} />
      <ModalContent>
        {props.loading ?
          <LoadingIndicator className='workspace-select-modal-loading-indicator' /> :
          <Fragment>
            <div className='workspace-select-modal-top'>
            {!props.hideSearch &&
              <Input
                inputStyle='search'
                onChange={(value) => {
                  setSearch(value);
                }}
                value={search}
                placeholder='Search'
              />
              }
              <Heading type='h4' text='Select a Workspace' color='content-color-secondary' />
            </div>
            <WorkspaceItems
              actionText={props.actionText}
              allWorkspaces={props.allWorkspaces}
              currentUser={props.currentUser}
              search={search}
              selectedWorkspace={props.selectedWorkspace}
              workspaces={props.workspaces}
              highlightedWorkspace={highlightedWorkspace}
              isModal
              onSelect={(workspace) => {
                setHighlightedWorkspace(workspace);
              }}
            />
          </Fragment>
        }
      </ModalContent>

      <ModalFooter>
        <Flex justifyContent='flex-end' grow={1} shrink={1}>
          <Button
            type='secondary'
            text='Cancel'
            minWidth='64px'
            onClick={() => {
              setHighlightedWorkspace(null);
              props.onCancel && props.onCancel();
            }}
          />
          <Button
            type='primary'
            text={props.primaryButtonLabel}
            minWidth='64px'
            onClick={() => {
              highlightedWorkspace && props.onWorkspaceSelect(highlightedWorkspace);
            }}
            tooltip={!highlightedWorkspace && <Tooltip content={'Select a Workspace'} placement='top' />}
            isDisabled={!highlightedWorkspace}
            className='workspace-select-modal-cancel'
          />
        </Flex>
      </ModalFooter>
    </Modal>
  );
}
