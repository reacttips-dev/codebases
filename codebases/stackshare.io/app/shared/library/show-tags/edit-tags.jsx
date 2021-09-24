import React, {useState, useRef, useEffect, useContext} from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import CloseIcon from '../../../shared/library/icons/close-circle.svg';
import {WHITE} from '../../style/colors';
import SimpleButton from '../../../shared/library/buttons/base/simple';
import {AllTagsContext} from '../../../shared/enhancers/all-tags';
import Circular, {BUTTON} from '../indicators/indeterminate/circular';
import useKeypress from '../../utils/hooks/keypress';
import useClickedOutside from '../../utils/hooks/clicked-outside';
import useClickedInside from '../../utils/hooks/clicked-inside';
import {debounce} from '../../../shared/utils/debounce';

const MainContainer = glamorous.div({
  position: 'relative'
});

const Container = glamorous.label({
  width: '100%',
  borderRadius: 3,
  border: 'solid 1px #dddddd',
  background: WHITE,
  display: 'flex',
  flexWrap: 'wrap',
  marginTop: 5,
  marginBottom: -10,
  padding: '10px 15px',
  paddingBottom: 0,
  paddingRight: 85
});

const EditTag = glamorous.div({
  border: '1px solid #e1e1e1',
  borderRadius: 11.5,
  padding: '5px 5px 5px 15px',
  fontSize: 12,
  lineHeight: 1.17,
  color: '#707070',
  marginRight: 10,
  marginBottom: 10,
  minHeight: 24,
  display: 'flex',
  alignItems: 'center',
  wordBreak: 'break-all',
  ' span': {
    width: 'calc(100% - 29px)'
  }
});

const RemoveTag = glamorous(CloseIcon)({
  height: 14,
  width: 14,
  marginLeft: 15,
  cursor: 'pointer'
});

const SaveButton = glamorous(SimpleButton)({
  height: 30,
  fontSize: 11.6,
  fontWeight: 600,
  letterSpacing: 0.2,
  textAlign: 'center',
  color: WHITE,
  position: 'absolute',
  top: 9,
  right: 9
});

const EditTagInput = glamorous.input({
  border: 1,
  fontSize: 13,
  color: '#333333',
  height: 25,
  marginBottom: 10,
  ':focus': {
    outline: 'none'
  }
});

const EditTagContainer = glamorous.div({
  position: 'relative'
});

const DropDown = glamorous.div({
  position: 'absolute',
  zIndex: 101,
  top: 22,
  left: -20,
  width: 215,
  borderRadius: 2,
  boxShadow: '0 6px 7px 0 rgba(171, 171, 171, 0.24)',
  border: 'solid 1px #cacaca',
  background: WHITE,
  padding: 10
});

const DropDownContainer = glamorous.div({
  margin: '5px 0',
  maxHeight: 300,
  overflowX: 'hidden',
  overflowY: 'auto',
  paddingRight: 10,
  '::-webkit-scrollbar': {
    width: 5
  },

  '::-webkit-scrollbar-thumb': {
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,.5)',
    boxShadow: ' 0 0 1px rgba(255,255,255,.5)'
  }
});

const DropdownItems = glamorous.div({
  padding: 13,
  fontSize: 13,
  lineHeight: 1.08,
  color: '#333333',
  cursor: 'pointer',
  ':hover': {
    background: '#f6f6f6'
  }
});

const Loading = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '> div': {
    height: 18,
    width: 18
  }
});

const Notice = glamorous.div(
  {
    position: 'absolute',
    fontSize: 8,
    color: '#6c6c6c',
    right: 0,
    bottom: -13,
    '> span': {
      fontWeight: 900
    }
  },
  ({isLeft, isSidebar}) => ({
    left: isLeft && '0',
    right: isSidebar && -30,
    bottom: isSidebar && -26,
    width: isSidebar && '45%'
  })
);

const EditTags = ({tags, saveTags, loading, setEditMode, isSidebar}) => {
  const allTagsContext = useContext(AllTagsContext);
  const [editingTags, setEditingTags] = useState([...tags]);
  const [searchTags, setSearchTags] = useState([...tags]);
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [cantSave, setCantSave] = useState(true);
  const [disregardBlurEvent, setDisregardBlurEvent] = useState(false);
  const [disregardChangeEvent, setDisregardChangeEvent] = useState(false);
  const enter = useKeypress('Enter');
  const space = useKeypress(' ');
  const elmRef = useRef(null);
  useClickedOutside(
    elmRef,
    () => {
      if (cantSave) setEditMode(false);
    },
    [cantSave]
  );
  useClickedInside(elmRef, () => {
    const elm = document.getElementById('inputRef');
    elm.focus();
  });

  useEffect(() => {
    const effectFunctionality = async () => {
      if (enter || space) {
        await setDisregardChangeEvent(true);
        handleBlurEvent();
      }
    };
    effectFunctionality();
  }, [enter, space]);

  useEffect(() => {
    const filteredData = searchTags.filter(item => editingTags.indexOf(item) === -1);
    setSearchTags(filteredData);
  }, [editingTags]);

  useEffect(() => {
    if (allTagsContext.allTags) {
      const tags = [];
      allTagsContext.allTags.map(tag => {
        if (editingTags.indexOf(tag) === -1) {
          tags.push(tag);
        }
      });
      const arr =
        inputValue.trim() === '' || tags.indexOf(inputValue) !== -1
          ? [...tags]
          : [inputValue, ...tags].filter(item => item.indexOf(inputValue) !== -1);
      setSearchTags(arr);
    }
  }, [allTagsContext.allTags]);

  useEffect(() => {
    search();
  }, [inputValue]);

  useEffect(() => {
    const a = [...editingTags].sort();
    const b = [...tags].sort();

    if (a.length === b.length && a.toString() === b.toString()) setCantSave(true);
  }, [editingTags]);

  const search = debounce(async () => {
    allTagsContext.refetchTags({query: inputValue});
  }, 500);

  const setTags = tagList => {
    setCantSave(false);
    setEditingTags([...tagList]);
  };

  const deleteTag = index => {
    let arr = [...editingTags];
    const deletedTag = arr.splice(index, 1);
    setTags(arr);
    const tags = [...searchTags, deletedTag];
    setSearchTags(tags);
  };

  const handleEditInput = event => {
    // returned early cause the useEffect is called before the onChange so that
    // it doesn't have the previous value (if the value was added using space)
    // and doesn't add the first value in tag as space
    if (event.target.value === ' ' || disregardChangeEvent) {
      return;
    }
    if (!event.target.value) setInputValue('');
    if (event.target.value.match(/^[A-Za-z0-9_]+$/)) {
      //Allow only characters, numbers and underscore
      setInputValue(event.target.value);
    }
  };

  const handleBlurEvent = () => {
    if (!disregardBlurEvent && inputValue !== '') {
      let inputText = inputValue.trim();
      if (
        editingTags.findIndex(tag => tag.toLowerCase() === inputText.toLowerCase()) === -1 &&
        inputText !== ''
      ) {
        setTags([...editingTags, inputValue]);
      }
      setInputValue('');
    }

    setDisregardChangeEvent(false);
    setDisregardBlurEvent(false);
    setShowDropdown(false);
  };

  const handleFocusEvent = () => {
    setShowDropdown(true);
  };

  const setItemValue = item => {
    // we need to stop the blur event from firing if we set the value using dropdown
    // otherwise it adds two values 1. the one selected from dropdown and 2. the half
    // value written inside the input box
    setDisregardBlurEvent(true);
    if (editingTags.indexOf(item) === -1) setTags([...editingTags, item]);
    setInputValue('');
  };

  return (
    // Do not make this div as glamorous component
    <div ref={elmRef}>
      <MainContainer>
        <Container key={tags.length} htmlFor={'inputRef'}>
          {editingTags.map((t, index) => {
            return (
              <EditTag key={index}>
                <span>{t}</span>
                <RemoveTag onClick={() => deleteTag(index)} />
              </EditTag>
            );
          })}
          <EditTagContainer>
            <EditTagInput
              autoFocus
              id={'inputRef'}
              placeholder={'Add Tags...'}
              value={inputValue}
              autoComplete="off"
              onChange={e => handleEditInput(e)}
              onBlur={e => handleBlurEvent(e)}
              onFocus={e => handleFocusEvent(e)}
            />
            {showDropdown && searchTags.length !== 0 && (
              <DropDown>
                <DropDownContainer>
                  {searchTags.map((item, index) => (
                    <DropdownItems key={index} onMouseDown={() => setItemValue(item)}>
                      {item}
                    </DropdownItems>
                  ))}
                </DropDownContainer>
              </DropDown>
            )}
          </EditTagContainer>
          <SaveButton disabled={loading || cantSave} onClick={() => saveTags([...editingTags])}>
            {loading ? (
              <Loading>
                <Circular size={BUTTON} />
              </Loading>
            ) : (
              'Save'
            )}
          </SaveButton>
        </Container>
        <Notice isLeft={false} isSidebar={isSidebar}>
          Press <span>SPACE</span> or <span>RETURN</span> {isSidebar && <br />} to add the tag.
        </Notice>
        <Notice isLeft={true} isSidebar={isSidebar}>
          Allows <span>alphanumeric </span>characters and <span>underscore.</span>
        </Notice>
      </MainContainer>
    </div>
  );
};

EditTags.propTypes = {
  tags: PropTypes.array,
  saveTags: PropTypes.func,
  setEditMode: PropTypes.func,
  loading: PropTypes.bool,
  isSidebar: PropTypes.bool
};

export default EditTags;
