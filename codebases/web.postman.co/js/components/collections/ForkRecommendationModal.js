import React from 'react';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../base/Modals';
import { RadioGroup, Radio } from 'react-radio-group';
import { Button } from '../base/Buttons';

import { SAVE_AS, CREATE_FORK } from '../../constants/ForkRecommendationConstants';

const requestOptions = [
  {
    value: SAVE_AS,
    title: 'Save as',
    description: 'Save as a new request in a new or existing collection.'
  },
  {
    value: CREATE_FORK,
    title: 'Create a fork',
    titleTag: 'Recommended',
    description: 'Your changes will be saved in the forked version of this collection.'
  }
];

/**
 * Radio button component.
 *
 * @param {Object} props - react component properties
 */
function RadioButtonOption (props) {
  const optionClassName = props.disabled ? 'fork-recommendation-modal__option-disabled' :
    'fork-recommendation-modal__option';

  return (
    <div className={optionClassName}>
      <label>
        <Radio
          value={props.value}
          className='radio-button fork-recommendation-modal__option-radio-button'
          disabled={props.disabled}
        />
        <strong className='fork-recommendation-modal__option-title'>{props.title}</strong>
        {props.titleTag &&
          <span className='fork-recommendation-modal__option-title-tag'>{props.titleTag}</span>
        }
      </label>
      <div className='fork-recommendation-modal__option-description'>{props.description}</div>
    </div>
  );
}

/**
 * RadioGroup component.
 *
 * @param {Object} props - react component properties
 */
function RadioGroupContainer (props) {
  return (
    <RadioGroup
      name='fork-recommendation-modal-radio-group'
      selectedValue={props.selectedValue}
      onChange={props.onRequestOptionChange}
    >
      {
        (props.radioOptions || []).map((radioOption) => {
          return (
            <RadioButtonOption
              key={radioOption.value}
              value={radioOption.value}
              title={radioOption.title}
              titleTag={radioOption.titleTag}
              description={radioOption.description}
              disabled={radioOption.disabled}
            />
          );
        })
      }
    </RadioGroup>
  );
}

/**
 * Fork recommendation modal component.
 *
 * @param {Object} props - react component properties
 */
export default function RecommendForkModal (props) {
  const requestOptionsForRadioGroup = requestOptions.map((requestOption) => {
    let option = { ...requestOption, disabled: false };

    if (requestOption.value === SAVE_AS && !props.enableSaveAs) {
      option.disabled = !props.enableSaveAs;
    }

    return option;
  });

  return (
    <Modal
      isOpen={props.isOpen}
      onRequestClose={props.onClose}
    >
      <ModalHeader>UNABLE TO SAVE</ModalHeader>
      <ModalContent className='fork-recommendation-modal__content'>
        <p className='fork-recommendation-modal__content-description'>
          You need additional permissions to edit <strong>{props.collectionName}</strong>.
            Try one of these options instead.
        </p>
        <RadioGroupContainer
          radioOptions={requestOptionsForRadioGroup}
          onRequestOptionChange={props.onRequestOptionChange}
          selectedValue={props.defaultSelectedValue}
        />
      </ModalContent>
      <ModalFooter separated>
        <Button
          type='primary'
          onClick={props.onRequestOptionSubmit}
        >
          {props.requestOptionButtonText}
        </Button>
        <Button
          type='secondary'
          onClick={props.onClose}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
