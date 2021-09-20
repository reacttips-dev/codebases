import React, { Fragment, useEffect } from 'react';
import {
  Flex,
  Button,
  Heading,
  Text,
  Modal,
  ModalHeader,
  ModalContent
} from '@postman/aether';
import { reaction } from 'mobx';
import { Observer } from 'mobx-react';
import classnames from 'classnames';

import Markdown from '../base/Markdown';
import { getStore } from '../../stores/get-store';

const DEFAULT_LAYOUT = {
    order: ['cover_image', 'heading', 'content', 'text', 'buttons'],
    display: 'default',
    title: {},
    cover_image: {
      containerProps: {
        padding: {
          paddingBottom: 'spacing-xxl'
        }
      },
      width: '100%',
      height: '100%'
    },
    heading: {
      containerProps: {
        padding: 'spacing-zero spacing-xxl'
      },
      type: 'h2',
      color: 'content-color-primary',
      hasBottomSpacing: false
    },
    content: {
      containerProps: {
        padding: 'spacing-zero spacing-xxl'
      },
      type: 'body-large',
      color: 'content-color-secondary'
    },
    text: {},
    buttons: {
      containerProps: {
        padding: 'spacing-xl spacing-xxl spacing-s spacing-xxl'
      }
    }
  },
  storeName = 'InAppModalStore',
  baseClassName = 'in-app-modal';

const getLayout = (layout) => {
  const { order = DEFAULT_LAYOUT.order, display = DEFAULT_LAYOUT.display } = layout;
  if (display === 'center') {
    return _.merge({}, DEFAULT_LAYOUT, {
      order,
      cover_image: {
        containerProps: {
          padding: { paddingBottom: 'spacing-zero' }
        }
      },
      heading: {
        containerProps: {
          justifyContent: 'center'
        }
      },
      content: {
        containerProps: {
          justifyContent: 'center'
        },
        className: `${baseClassName}-content-center`
      },
      buttons: {
        containerProps: {
          direction: 'column',
          padding: 'spacing-l spacing-xxl spacing-s spacing-xxl'
        }
      }
    });
  }
  return _.merge({}, DEFAULT_LAYOUT, { order });
};


const InAppModal = () => {
  useEffect(() => {
    // This reaction checks if the active info has updated,
    // and if it's available then it fires off the
    // onView handler of that info item
    const activeModalDisposer = reaction(
      () => getStore(storeName).activeModal,
      (activeModal) => {
        if (!activeModal) {
          return;
        }

        _.invoke(activeModal, 'onView');
      },

      // This is done because by the time the component mounts, then it's possible
      // that the InAppModal store already has an active info available in it
      // so the reaction won't be fired, thus the `onView` of that specific info
      // will never get called otherwise
      { fireImmediately: true }
    );
    return () => {
      activeModalDisposer && activeModalDisposer();
    };
  }, []);

  const render = () => {
    const activeModal = getStore(storeName).activeModal;
    if (!activeModal) {
      return null;
    }

    /**
    * @description This function is called when modal is dismissible and onDismiss function is called.
    */
    const onClose = () => (activeModal.isDismissable
      ? activeModal.dismiss()
      : false);


    /**
    * @description Called when primary action is triggered
    */
    const handlePrimaryAction = () => {
      activeModal.primaryAction.onClick &&
        activeModal.primaryAction.onClick();
      activeModal.isDismissable && activeModal.dismiss();
    };

    /**
    * @description Called when secondary action is triggered
    */
    const handleSecondaryAction = () => {
      activeModal.secondaryAction.onClick &&
        activeModal.secondaryAction.onClick();
      activeModal.isDismissable && activeModal.dismiss();
    };

    const size = activeModal.size,
      layout = activeModal.layout || {},
      title = activeModal.title,
      message = activeModal.message,
      isTargeted = !_.isEmpty(activeModal.targets),
      isDismissable = activeModal.isDismissable,
      primaryActionText = _.get(activeModal, 'primaryAction.label'),
      secondaryActionText = _.get(activeModal, 'secondaryAction.label'),
      showSecondaryAction = !!activeModal.secondaryAction,
      showPrimaryAction = !!activeModal.primaryAction,
      updatedLayout = getLayout(layout);

    const renderElement = (key, value, props) => {
      if (_.isEmpty(value)) {
        return null;
      }

      const containerProps = _.get(
          props,
          'containerProps',
          {}
        ),
        elementProps = _.omit(props, 'containerProps');

      switch (key) {
        case 'cover_image':
          return (
            <Flex {...containerProps}>
              <img
                src={value}
                width='100%'
                height='100%'
                alt=''
                {...elementProps}
              />
            </Flex>
          );
        case 'heading':
          return (
            <Flex {...containerProps}>
              <Heading
                type='h1'
                {...elementProps}
                text={value}
              />
            </Flex>
          );
        case 'content':
          return (
            <Flex {...containerProps}>
              <Text {...elementProps}>{value}</Text>
            </Flex>
          );
        case 'text':
          return (
            <Flex
              className={`${baseClassName}-content-markdown`}
              padding='spacing-zero spacing-xl'
              {...containerProps}
            >
              <Markdown
                disableGfm
                source={value}
                {...elementProps}
              />
            </Flex>
          );
        case 'buttons':
          return (
            <Flex
              direction='row-reverse'
              alignItems='center'
              gap='spacing-s'
              padding='spacing-zero spacing-xl'
              {...containerProps}
            >
              {showPrimaryAction && (
                <Button
                  size='medium'
                  type='primary'
                  onClick={handlePrimaryAction}
                  text={primaryActionText || 'Ok'}
                />
              )}
              {showSecondaryAction && (
                <Button
                  size='medium'
                  type='outline'
                  onClick={handleSecondaryAction}
                  text={secondaryActionText || 'Cancel'}
                />
              )}
            </Flex>
          );

        default:
          return null;
      }
    };

    return (
      <div
        className={classnames({
          [`${baseClassName}-container`]: isTargeted
        })}
        key={isTargeted}
      >
        <Modal
          isOpen
          className={baseClassName}
          size={size}
          onClose={onClose}
          {...(isTargeted
            ? {
                parentSelector: () =>
                  document.querySelector(
                    `.${baseClassName}-container`
                  )
              }
            : {})
          }
        >
          {title && (
            <ModalHeader
              heading={title}
              hideCloseButton={!isDismissable}
              className={`${baseClassName}-header`}
            />
          )}
          <ModalContent
            className={`${baseClassName}-content`}
          >
            {_.map(_.uniq(updatedLayout.order), (elem) => (
              <Fragment key={elem}>
                {renderElement(
                  elem,
                  _.get(message, elem),
                  _.get(updatedLayout, elem, {})
                )}
              </Fragment>
            ))}
          </ModalContent>
        </Modal>
      </div>
    );
  };

  return (
    <Observer>{ render }</Observer>
  );
};

export default InAppModal;
