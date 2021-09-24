import React, {useState} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Checkbox from '../../../shared/library/inputs/checkbox';
import TextField from '../../../shared/library/inputs/text';
import {ERROR_RED, CHARCOAL} from '../../../shared/style/colors';
import BitbucketIcon from '../../../shared/library/icons/social/bitbucket.svg';
import GithubIcon from '../../../shared/library/icons/social/github.svg';
import GitlabIcon from '../../../shared/library/icons/social/gitlab.svg';
import AzureIcon from '../../../shared/library/icons/social/azure_blue.svg';
import {DESKTOP} from '../../../shared/style/breakpoints';

const Container = glamorous.div({
  marginTop: 23
});

const CheckBoxesContainer = glamorous.div({
  [DESKTOP]: {display: 'flex', flexDirection: 'column', flexWrap: 'wrap', height: 221}
});

const CheckboxContent = glamorous.div({
  display: 'flex',
  alignItems: 'center'
});

const ErrorMessage = glamorous.span({
  fontSize: 13,
  fontStyle: 'italic',
  lineHeight: 1.15,
  color: ERROR_RED,
  marginLeft: 9
});

const Bitbucket = glamorous(BitbucketIcon)({
  width: 18,
  height: 17,
  marginRight: 7
});

const Github = glamorous(GithubIcon)({
  width: 18,
  height: 17,
  marginRight: 7
});

const Gitlab = glamorous(GitlabIcon)({
  width: 18,
  height: 17,
  marginRight: 7
});

const Azure = glamorous(AzureIcon)({
  width: 18,
  height: 17,
  marginRight: 7
});

const CheckBoxes = ({mobile, elementDetails, handleOnChange, error}) => {
  const [toggleOther, setToggleOther] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [otherValue, setOtherValues] = useState('');
  const {id, label, options, hasOther} = elementDetails;

  const markAsSelected = value => {
    const alreadyPresent = selectedValues.indexOf(value) !== -1;
    let currentList = selectedValues;

    if (alreadyPresent) {
      currentList.splice(selectedValues.indexOf(value), 1);
    } else {
      currentList = [...currentList, value];
    }

    setSelectedValues([...currentList]);
    handleOnChange(currentList.toString(), elementDetails);
  };

  const setOther = value => {
    let currentList = selectedValues;
    const currentOtherValue = otherValue;
    if (selectedValues.indexOf(currentOtherValue) !== -1)
      currentList.splice(selectedValues.indexOf(currentOtherValue), 1);

    setOtherValues(value);
  };

  const updateTheOtheValueToRepos = () => {
    if (selectedValues.indexOf(otherValue) === -1) {
      let currentList = [...selectedValues, otherValue];
      setSelectedValues(currentList);
      handleOnChange(currentList.toString(), elementDetails);
    }
  };

  const toggleOtherValue = toggleVal => {
    setToggleOther(toggleVal);
    let currentList = selectedValues;

    if (toggleVal) {
      if (otherValue) {
        currentList = [...currentList, otherValue];
      }
    } else {
      if (selectedValues.indexOf(otherValue) !== -1)
        currentList.splice(selectedValues.indexOf(otherValue), 1);
    }

    setSelectedValues([...currentList]);
    handleOnChange(currentList.toString(), elementDetails);
  };

  return (
    <Container>
      <label htmlFor={id}>
        {label}
        {Boolean(error) && <ErrorMessage>Make atleast one selection</ErrorMessage>}
      </label>
      <CheckBoxesContainer>
        {options.map((optn, index) => (
          <Checkbox
            title={optn.name}
            key={index}
            onToggle={() => markAsSelected(optn.name)}
            checked={selectedValues.indexOf(optn.name) !== -1}
            customStyle={{
              alignItems: 'center',
              fontSize: 13,
              color: CHARCOAL,
              marginBottom: 15
            }}
          >
            <CheckboxContent>
              {optn.icon === 'github' && <Github />}
              {optn.icon === 'gitlab' && <Gitlab />}
              {optn.icon === 'bitbucket' && <Bitbucket />}
              {optn.icon === 'azure' && <Azure />}
              {optn.name}
            </CheckboxContent>
          </Checkbox>
        ))}
        {hasOther && (
          <Checkbox
            title={'Other'}
            customStyle={{
              alignItems: 'center',
              fontSize: 13,
              color: CHARCOAL,
              marginBottom: 15
            }}
            onToggle={() => toggleOtherValue(!toggleOther)}
            checked={toggleOther}
          >
            <CheckboxContent>{'Others'}</CheckboxContent>
          </Checkbox>
        )}

        {toggleOther && (
          <TextField
            placeholder={'Add other host name'}
            type={'text'}
            style={{
              height: 34,
              fontSize: 13,
              width: mobile ? '100%' : '33%'
            }}
            inputBoxStyle={{height: 34}}
            value={otherValue}
            onChange={e => setOther(e.target.value)}
            onBlur={() => updateTheOtheValueToRepos()}
          />
        )}
      </CheckBoxesContainer>
    </Container>
  );
};

CheckBoxes.propTypes = {
  handleOnChange: PropTypes.func,
  elementDetails: PropTypes.object,
  mobile: PropTypes.bool,
  error: PropTypes.any
};

export default CheckBoxes;
