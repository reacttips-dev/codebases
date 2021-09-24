import React, {useState, useEffect, useContext} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import useKeypress from '../../../utils/hooks/keypress';
import {ASH, CHARCOAL, CATHEDRAL, GUNSMOKE, WHITE} from '../../../../shared/style/colors';
import UnCheckedIcon from '../../icons/unchecked.svg';
import CheckedIcon from '../../icons/checked.svg';
import {sortableContainer, sortableElement, sortableHandle} from 'react-sortable-hoc';
import GrabMoveIcon from '../../icons/grab-move-dots.svg';
import OptionsIcon from '../../icons/options-dots.svg';
import CloseIcon from '../../icons/close-x-circle.svg';
import RadioButton from '../../../../shared/library/inputs/radiobutton';
import MenuPopover from '../../../../shared/library/popovers/menu';
import SimpleButton from '../../../library/buttons/base/simple';
import {PHONE} from '../../../style/breakpoints';
import DeleteStage from './delete-stage';
import {BASE_TEXT} from '../../../../shared/style/typography';
import DeleteIcon from '../../icons/delete.svg';
import RenameIcon from '../../icons/edit.svg';
import {isEqual} from '../../../../shared/utils/lodash-functions';
import InfoIcon from '../../icons/info-icon.svg';
import PopoverWithAnchor from '../../popovers/base-v2';
import {TOP_START} from '../../../constants/placements';
import Confirmation from './confirmation';
import {ApolloContext} from '../../../enhancers/graphql-enhancer';
import {updateStageMutation} from '../../../../data/adoption-stage/mutations';
import {privateMode} from '../../../../data/shared/queries';

const Container = glamorous.div({
  width: 'inherit'
});

const Header = glamorous.div({
  ...BASE_TEXT,
  fontSize: 10,
  fontWeight: 600,
  height: 27,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `1px solid ${ASH}`,
  ' .text': {
    display: 'flex',
    alignItems: 'center',
    ' div': {
      margin: '0 6px 0 9px'
    },
    ' span': {
      display: 'flex',
      '> svg': {
        width: 13,
        height: 13,
        objectFit: 'contain'
      }
    }
  },
  '> svg': {
    margin: '7px 7px 7px 0',
    cursor: 'pointer',
    width: 16,
    height: 16,
    objectFit: 'contain'
  }
});

const ListContainer = glamorous.div(
  {
    display: 'block',
    position: 'relative'
  },
  ({disabled}) => ({
    cursor: disabled && 'default',
    opacity: disabled && 0.69
  })
);

const SortableItemScrollContainer = glamorous.div({
  maxHeight: 250,
  overflowX: 'hidden',
  overflowY: 'auto',
  paddingRight: 2,
  marginRight: 2,
  '::-webkit-scrollbar': {
    width: 5
  },

  '::-webkit-scrollbar-thumb': {
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,.5)',
    boxShadow: ' 0 0 1px rgba(255,255,255,.5)'
  }
});

const ListItem = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  // justifyContent: 'space-between',
  padding: '10px 0 10px 0',
  borderBottom: '1px solid rgba(151,151,151, 0.14)',
  zIndex: 999999,
  ' .content': {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    ' :hover': {
      opacity: 1
    },
    ' .drag': {
      '> svg': {
        height: 10,
        width: 10,
        objectFit: 'contain',
        marginLeft: 11,
        marginRight: 11
      },
      ' :hover': {
        cursor: 'grab'
      }
    },
    ' .stage': {
      margin: 0,
      width: 'calc(100% - 60px - 27px)',
      textAlign: 'initial',
      wordBreak: 'break-word'
    }
  }
});

const InputWrapper = glamorous.div({
  boxSizing: 'content-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 38,
  borderBottom: '1px solid rgba(151,151,151, 0.14)',
  paddingLeft: 4
});

const SearchInput = glamorous.input(
  {
    ...BASE_TEXT,
    border: 0,
    color: CATHEDRAL,
    caretColor: CATHEDRAL,
    '::placeholder': {
      ...BASE_TEXT,
      fontSize: 14,
      color: GUNSMOKE
    },
    ':focus': {
      outline: 'none'
    },
    flex: 1,
    marginRight: 8,
    padding: 8,
    height: 'inherit'
  },
  ({disabled}) => ({
    pointerEvents: disabled && 'none'
  })
);

const EditWrapper = glamorous.input({
  ...BASE_TEXT,
  fontSize: 14,
  border: 0,
  color: CHARCOAL,
  '::placeholder': {
    ...BASE_TEXT,
    fontSize: 14,
    color: '#b9b9b9'
  },
  ':focus': {
    outline: 'none'
  },
  flex: 1,
  marginRight: 8,
  paddingLeft: 10
});

const Footer = glamorous.div({
  margin: '23px 16px 17px 16px'
});

const RemoveStageWrapper = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  height: 40,
  borderBottom: '1px solid rgba(151,151,151, 0.14)',
  '> svg': {
    height: 12,
    width: 12,
    objectFit: 'contain',
    marginLeft: 11,
    marginRight: 11,
    cursor: 'pointer'
  }
});

const SaveButton = glamorous(SimpleButton)({
  position: 'relative',
  height: 24,
  [PHONE]: {
    width: 'calc(100vw - 30px)',
    height: 24
  }
});

const HintTextWrapper = glamorous.div({
  ...BASE_TEXT,
  height: 14,
  fontSize: 9,
  lineHeight: 1.56,
  color: '#6c6c6c',
  marginTop: 4,
  marginRight: 17,
  textAlign: 'end',
  ':hover': {
    pointerEvents: 'none'
  }
});

const customMenuCss = {
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  marginRight: 10,
  height: 18,
  width: 18,
  borderRadius: 2,
  cursor: 'pointer',
  ':hover,:active,:visited,:focus': {
    backgroundColor: '#d8d8d8',
    opacity: 0.17
  }
};

const customPopperCss = {
  width: '161px',
  height: '89px',
  minWidth: '161px',
  left: '-18px',
  marginTop: '2px',
  borderRadius: '2px'
};

const options = [
  {
    id: 'DELETE',
    icon: <DeleteIcon />,
    label: 'Delete Stage'
  },
  {
    id: 'RENAME',
    icon: <RenameIcon />,
    label: 'Rename Stage'
  }
];

const actions = {
  updateStage: 'UPDATE_STAGE',
  stageToolLink: 'LINK_STAGE_TOOL',
  stageToolUnlink: 'UNLINK_STAGE_TOOL'
};

const StageContainer = ({handleStageDismiss, stages, toolAdoption, updateStages}) => {
  const [data, setData] = useState(stages);
  const [isActive, setActive] = useState(false);
  const [activeValue, setActiveValue] = useState('');
  const [editValue, setEditValue] = useState('');
  const [addNewStage, setAddNewStage] = useState('');
  const [removeStage, setRemoveStage] = useState(false);
  const [newStage, setNewStage] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [activeAdoptionStage, setActiveAdoptionStage] = useState(toolAdoption);
  const [showDisabledSaveButton, setDisabledSaveButton] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [stageAction, setStageAction] = useState('');
  const [tempStage, setTempStage] = useState(null);
  const [stageNames, setStageNames] = useState(stages && stages.map(stage => stage.name));
  const [addHintText, setAddHintText] = useState('');
  const [editHintText, setEditHintText] = useState('');
  const enter = useKeypress('Enter');
  const esc = useKeypress('Escape');
  const client = useContext(ApolloContext);

  //Effects

  //Remove stage from the tool
  useEffect(() => {
    if (removeStage) {
      setDisabledSaveButton(false);
      setStageAction(actions.stageToolUnlink);
    } else {
      if (stageAction === actions.stageToolUnlink) setStageAction('');
      let check = isEqual(stageNames, data.map(stage => stage.name));
      if (check && !tempStage) setDisabledSaveButton(true);
    }
  }, [removeStage]);

  //Element can be editable our not...
  useEffect(() => {
    let updatedData =
      data &&
      data.map(item => ({
        ...item,
        isEditable: item.name === activeValue.name ? (isActive ? true : false) : false
      }));
    setEditValue(activeValue.name);
    setData(updatedData);
  }, [activeValue, isActive]);

  //ADD new stage to list...
  useEffect(() => {
    if (addNewStage) {
      let checkStageExistLocally = data.findIndex(stage => stage.name === addNewStage);
      if (checkStageExistLocally === -1) {
        //Add new data
        let newData = [
          ...data,
          {
            name: addNewStage,
            chosen: false,
            isEditable: false
          }
        ];
        setData(newData);
        setNewStage('');
        setDisabledSaveButton(false);
        setStageAction(actions.updateStage);
      } else {
        setNewStage('');
        setAddNewStage('');
      }
    }
  }, [addNewStage]);

  useEffect(() => {
    if (enter || esc) {
      if (isActive) {
        // if Enter is pressed, save the text and case the editor
        if (enter) {
          //Check stage extsts locally
          let checkStageExistLocally = data.findIndex(stage => stage.name === editValue.trim());
          if (checkStageExistLocally === -1) {
            let updatedData = data.map(item => ({
              ...item,
              name: item.name === activeValue.name ? editValue.trim() : item.name
            }));
            if (tempStage && tempStage.name === activeValue.name) tempStage.name = editValue.trim();
            let check = isEqual(stageNames, updatedData.map(stage => stage.name));
            if (!check) {
              setData(updatedData);
              setDisabledSaveButton(false);
              setStageAction(actions.updateStage);
              setActive(false);
              setEditValue('');
            } else {
              setData(updatedData);
              setDisabledSaveButton(true);
              setActive(false);
              setEditValue('');
            }
          } else {
            setActive(false);
            setEditValue('');
            let updatedData = data.map(item => ({
              ...item,
              name: item.name === activeValue.name ? activeValue.name : item.name
            }));
            setData(updatedData);
          }
        }
        // if Escape is pressed, revert the text and close the editor
        if (esc) {
          setActive(false);
          setActiveValue(activeValue);
          setEditValue('');
          let updatedData = data.map(item => ({
            ...item,
            name: item.name === activeValue.name ? activeValue.name : item.name
          }));
          setData(updatedData);
        }
      }

      if (newStage) {
        if (enter) {
          setAddNewStage(newStage.trim());
        }
        // if Escape is pressed, revert the text and close the editor
        if (esc) {
          setAddNewStage('');
          setNewStage('');
        }
      }
    }
  }, [enter, esc]);

  const arrayMove = (data, oldIndex, newIndex) => {
    const currentElm = data[oldIndex];
    data.splice(oldIndex, 1);
    const laterList = data.splice(newIndex);
    return [...data, currentElm, ...laterList];
  };

  //methods
  const onSortEnd = ({oldIndex, newIndex}) => {
    if (oldIndex !== newIndex) {
      let newData = arrayMove(data, oldIndex, newIndex);
      setData(newData);
      stageHandler(newData);
    }
  };

  const handleEditStage = event => setEditValue(event.target.value);

  const removeStageHandler = value => setRemoveStage(value);

  const chooseStage = item => {
    if (item) {
      let updatedData = data.map(value => ({
        ...value,
        chosen: value.name === item.name ? true : false
      }));
      if (activeAdoptionStage && activeAdoptionStage.name === item.name) {
        setData(updatedData);
        if (stageAction === actions.stageToolLink) setStageAction('');
        if (tempStage) setTempStage('');
        setDisabledSaveButton(true);
      } else {
        setData(updatedData);
        setTempStage(item);
        setStageAction(actions.stageToolLink);
        setDisabledSaveButton(false);
      }
    }
  };

  const handleMenuClick = option => {
    if (option === 'RENAME') {
      setActive(true);
    } else if (option === 'DELETE') {
      setShowDeleteModal(true);
    }
  };

  const newStageHandler = e => {
    e.stopPropagation();
    setNewStage(e.target.value);
  };

  const deleteStageHandler = value => {
    if (tempStage && tempStage.name === value.name) setTempStage(null);
    if (activeAdoptionStage && activeAdoptionStage.name === value.name) {
      setTempStage(null);
      setRemoveStage(false);
    }
    let updatedData = data.filter(stage => stage.name !== value.name);
    //Remove stage globally and locally
    let check = stageNames.findIndex(stage => stage === value.name);
    setShowDeleteModal(false);
    if (check === -1) {
      setData(updatedData);
      setActiveValue('');
      let check = isEqual(stageNames, updatedData.map(stage => stage.name));
      if (check && !tempStage) setDisabledSaveButton(true);
    } else {
      setData(updatedData);
      setActiveValue('');
      setRemoveStage(false);
      stageHandler(updatedData);
    }
  };

  const stageHandler = updatedData => {
    client
      .mutate({
        mutation: updateStageMutation,
        variables: {
          companyAdoptionStages: updatedData.map(stage => {
            return {
              id: stage.id,
              name: stage.name
            };
          })
        },
        refetchQueries: [{query: privateMode}],
        awaitRefetchQueries: true
      })
      .then(result => {
        if (result && result.data && result.data.updateAdoptionStages)
          setStageNames(result.data.updateAdoptionStages.map(stage => stage.name));
      })
      // eslint-disable-next-line no-unused-vars
      .catch(error => {
        /* eslint-disable no-console */
        console.log('Something went wrong!');
      });
  };

  const focusHandler = option => {
    if (option === 'ADD') setAddHintText('hit <b>RETURN</b> to add, <b>SAVE</b> to save');
    if (option === 'EDIT') setEditHintText('hit <b>RETURN</b> to rename, <b>SAVE</b> to save');
    if (option === 'CLOSE') {
      if (addHintText) setAddHintText('');
      if (editHintText) {
        setEditHintText('');
        setActive(false);
      }
    }
  };
  return (
    <>
      <Container
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <Header>
          <div className="text">
            <div>Current Stage</div>
            <PopoverWithAnchor
              padding={10}
              placement={TOP_START}
              customStyle={{
                ...BASE_TEXT,
                fontSize: 11,
                width: 264,
                height: 90,
                backgroundColor: WHITE,
                borderRadius: 2,
                border: `1px solid ${ASH}`,
                fontWeight: 'normal',
                lineHeight: 1.64,
                color: '#191919',
                top: -13,
                left: -3
              }}
              activateMode="hover"
              hidden={true}
              anchor={
                <span>
                  <InfoIcon />
                </span>
              }
              arrowStyle={{
                bottom: -7
              }}
            >
              Adding, Re-ordering and Deleting the stages is a global change. The changes will
              impact all the tools in your company.
            </PopoverWithAnchor>
          </div>
          <CloseIcon
            onClick={event => {
              if (!showDisabledSaveButton && (stageAction || tempStage))
                setShowConfirmationModal(true);
              else handleStageDismiss(event);
            }}
          />
        </Header>

        {data && data.length >= 1 && toolAdoption && (
          <>
            {activeAdoptionStage && activeAdoptionStage.name ? (
              removeStage ? (
                <RemoveStageWrapper>
                  <CheckedIcon onClick={() => removeStageHandler(!removeStage)} />{' '}
                  <span>Remove stage for this tool</span>
                </RemoveStageWrapper>
              ) : (
                <RemoveStageWrapper>
                  <UnCheckedIcon onClick={() => removeStageHandler(!removeStage)} />{' '}
                  <span>Remove stage for this tool</span>
                </RemoveStageWrapper>
              )
            ) : null}
          </>
        )}

        <SortableItemScrollContainer>
          <SortableContainer
            onSortEnd={onSortEnd}
            distance={1}
            lockAxis="y"
            useDragHandle
            lockToContainerEdges
          >
            <ListContainer disabled={removeStage}>
              {data.map((item, index) => {
                return (
                  <SortableItem
                    key={item.id ? `item-${item.id}` : `item-${index}`}
                    index={index}
                    value={item}
                    disabled={removeStage}
                    handleEditStage={handleEditStage}
                    activeValue={activeValue}
                    editValue={editValue}
                    removeStage={removeStage}
                    chooseStage={chooseStage}
                    handleMenuClick={handleMenuClick}
                    setActiveValue={setActiveValue}
                    options={options}
                    customMenuCss={customMenuCss}
                    customPopperCss={customPopperCss}
                    editHintText={editHintText}
                    focusHandler={focusHandler}
                  />
                );
              })}
            </ListContainer>
          </SortableContainer>
        </SortableItemScrollContainer>
        <InputWrapper>
          <SearchInput
            placeholder="Add new stage..."
            value={newStage}
            onChange={removeStage ? () => {} : newStageHandler}
            disabled={removeStage}
            onFocus={() => focusHandler('ADD')}
            onBlur={() => focusHandler('CLOSE')}
          />
        </InputWrapper>
        {addHintText && (
          <HintTextWrapper
            dangerouslySetInnerHTML={{
              __html: addHintText
            }}
          />
        )}

        <Footer>
          <SaveButton
            disabled={showDisabledSaveButton}
            onMouseDown={() => updateStages(stageAction, data, tempStage)} //onMouseDown is used to ignore addStage onBlur event getting called first.
            width="100%"
          >
            Save
          </SaveButton>
        </Footer>
      </Container>
      {showDeleteModal && (
        <DeleteStage
          stage={activeValue}
          onDismiss={() => {
            setShowDeleteModal(false);
            setActiveValue('');
          }}
          handleSubmit={deleteStageHandler}
        />
      )}
      {showConfirmationModal && (
        <Confirmation
          onDismiss={() => {
            setShowConfirmationModal(false);
          }}
          handleSubmit={handleStageDismiss}
        />
      )}
    </>
  );
};

const SortableContainer = sortableContainer(({children}) => {
  return <>{children}</>;
});

const SortableItem = sortableElement(
  ({
    value,
    handleEditStage,
    activeValue,
    editValue,
    removeStage,
    chooseStage,
    handleMenuClick,
    setActiveValue,
    options,
    customMenuCss,
    customPopperCss,
    editHintText,
    focusHandler
  }) => {
    return (
      <>
        {value.isEditable ? (
          <>
            <ListItem>
              <EditWrapper
                placeholder={activeValue && activeValue.name}
                value={editValue}
                onChange={handleEditStage}
                onFocus={() => focusHandler('EDIT')}
                onBlur={() => focusHandler('CLOSE')}
                autoFocus
              />
            </ListItem>
            {editHintText && value.isEditable && (
              <HintTextWrapper
                dangerouslySetInnerHTML={{
                  __html: editHintText
                }}
              />
            )}
          </>
        ) : (
          <ListItem>
            <div className="content">
              <DragHandle />
              <RadioButton
                checked={value.chosen}
                disabled={removeStage ? true : false}
                onToggle={() => {
                  chooseStage(value);
                }}
              />
              <div className="stage">{value.name}</div>
              <MenuPopover
                options={options}
                onClick={id => {
                  handleMenuClick(id);
                  setActiveValue(value);
                }}
                icon={<OptionsIcon />}
                isCustom={true}
                customMenuCss={customMenuCss}
                customPopperCss={customPopperCss}
                disabled={removeStage}
              />
            </div>
          </ListItem>
        )}
      </>
    );
  }
);

const DragHandle = sortableHandle(() => (
  <div className="drag">
    <GrabMoveIcon />
  </div>
));

StageContainer.propTypes = {
  handleStageDismiss: PropTypes.func,
  stages: PropTypes.arrayOf(PropTypes.object),
  toolAdoption: PropTypes.object,
  updateStages: PropTypes.func
};
export default StageContainer;
