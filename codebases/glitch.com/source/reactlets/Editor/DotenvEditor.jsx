import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { textToNodes, appendKeyValue, changeKey, changeValue, removeKeyValue, nodesToText, COMMENT, KEY_VALUE, setQuote } from '@glitchdotcom/dotenv';
import { Button, Icon, Notification, TextInput, UnstyledButton } from '@glitchdotcom/shared-components';
import Stack from '../../components/primitives/Stack';
import Row from '../../components/primitives/Row';
import useApplication from '../../hooks/useApplication';
import useObservable from '../../hooks/useObservable';
import useUserPref from '../../hooks/useUserPref';
import copyToClipboard from '../../utils/copyToClipboard';

const DotenvContainer = styled.div`
  width: 100%;
  padding: 12px 20px;
  overflow: auto;
`;

const SmallIcon = styled(Icon)`
  transform: scale(0.75);
`;

const Header = styled.h1`
  font-size: 1.6em;
  margin-top: 0px;
`;

const FixedWidthTextInput = ({ containerProps = {}, width = '250px', ...rest }) => {
  const styleFromProps = containerProps.style || {};
  const style = {
    ...styleFromProps,
    width,
    maxWidth: width,
    marginBottom: '8px',
  };
  return <TextInput {...rest} containerProps={{ ...containerProps, style }} />;
};

const KeyNameTextInput = styled(FixedWidthTextInput)`
  font-weight: bold;
`;

const ValueTextInput = styled(FixedWidthTextInput)`
  width: 200px;
`;

function KeyValue({ name, value, onNameChange, onValueChange, onDelete, className }) {
  const application = useApplication();

  const nameStartsWithNumber = name.match(/^\d/) !== null;
  const showCopyButton = nameStartsWithNumber === false && name.length > 0;

  return (
    <div className={className}>
      <KeyNameTextInput
        label="Variable Name"
        value={name}
        placeholder="Variable Name"
        onChange={(newName) => {
          onNameChange(newName);
        }}
        postfix={
          showCopyButton ? (
            <Button
              onClick={() => {
                copyToClipboard(name);
                application.notifyCopied(true);
              }}
              className="no-button-styles"
              variant="secondary"
              size="small"
            >
              copy
            </Button>
          ) : null
        }
        error={nameStartsWithNumber ? "Variable names can't start with a number" : null}
      />

      <ValueTextInput
        type="text"
        label="Variable Value"
        value={value}
        placeholder="Variable Value"
        onChange={(newValue) => {
          onValueChange(newValue);
        }}
      />
      <UnstyledButton onClick={onDelete} className="no-button-styles">
        <SmallIcon icon="x" />
      </UnstyledButton>
    </div>
  );
}

const StyledKeyValue = styled(KeyValue)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    width: 100%;
    justify-content: flex-start;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StyledStack = styled(Stack)`
  max-width: 620px;
`;

const StyledAddVariableRow = styled(Row)`
  margin: 32px 0px 16px;
`;

function Comment({ comment, className }) {
  return (
    <div className={className}>
      <p># {comment}</p>
    </div>
  );
}

const StyledComment = styled(Comment)`
  background-color: var(--colors-secondaryBackground);
  font-family: monospace;
  border-radius: 3px;
  font-size: 14px;

  p {
    margin: 10px;
    padding: 10px 0px;
  }
`;

function textToNodesWithForcedQuotes(text) {
  const nodes = textToNodes(text);
  return nodes.reduce((acc, node, index) => {
    if (node.type === KEY_VALUE && node.value.match(/\s/) && node.quote === '') {
      return setQuote(acc, index, '"');
    }
    return acc;
  }, nodes);
}

function changeValueWithForcedQuotes(nodes, i, value) {
  const nextNodes = changeValue(nodes, i, value);
  if (nextNodes[i].value.match(/\s/) && nextNodes[i].quote === '') {
    return setQuote(nextNodes, i, '"');
  }
  return nextNodes;
}

function useTextAndNodesSynchronization(selectedFile) {
  const application = useApplication();
  const text = useObservable(useCallback(() => selectedFile && selectedFile.content(), [selectedFile]));
  const [nodes, setNodes] = useState(() => textToNodesWithForcedQuotes(text));

  const lastText = useRef(text);
  const lastNodes = useRef(nodes);

  useEffect(() => {
    if (text === lastText.current) {
      return;
    }

    lastText.current = text;
    setNodes((currentNodes) => {
      let nextNodes = textToNodesWithForcedQuotes(lastText.current);
      // maintain empty value at end on desync
      const lastNode = currentNodes[currentNodes.length - 1];
      if (lastNode && lastNode.type === KEY_VALUE && lastNode.key === '' && lastNode.value === '') {
        nextNodes = nextNodes.concat(lastNode);
      }
      lastNodes.current = nextNodes;
      return nextNodes;
    });
  }, [application, text]);

  useEffect(() => {
    if (nodes === lastNodes.current) {
      return;
    }

    lastNodes.current = nodes;
    lastText.current = nodesToText(nodes);
    application.writeToFile(selectedFile, lastText.current);
  }, [application, selectedFile, nodes]);

  return [nodes, setNodes];
}

export default function DotenvEditor() {
  const application = useApplication();
  const selectedFile = useObservable(application.selectedFile);
  const isMember = useObservable(application.projectIsMemberOrMoreForCurrentUser);
  const [shownUpdatesNotification, setShownUpdatesNotification] = useState(false);
  const [showTipForDotenv, setShowTipForDotenv] = useUserPref('showTipForDotenv', true, { application });
  const [showTipForDotenvKeys, setShowTipForDotenvKeys] = useUserPref('showTipForDotenvKeys', true, { application });

  const [nodes, setNodes] = useTextAndNodesSynchronization(selectedFile);
  let isItAComment = false;

  const addKeyValuePair = () => {
    const lastNode = nodes[nodes.length - 1];
    // do nothing if there's already an empty node at the end.
    if (nodes.length > 0 && (lastNode.type === KEY_VALUE && lastNode.key === '' && lastNode.value === '')) {
      return;
    }
    const newValue = appendKeyValue(nodes, '', '');
    setNodes(newValue);
    if (shownUpdatesNotification === false) {
      application.notifyDotenvUpdatesAsYouType(true);
      setShownUpdatesNotification(true);
    }
  };

  nodes.forEach((e) => {
    if (e.type === 'COMMENT') {
      isItAComment = true;
    }
  });

  return (
    <DotenvContainer>
      <Header>Environment Variables</Header>
      <StyledStack>
        {!isMember && (
          <Notification message="Only project members can see the contents of a .env file." variant="onboarding" persistent>
            <Stack>
              <span>Only project members can see the contents of a .env file.</span>
              <Row>
                <Button
                  as="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://glitch.com/help/kb/article/18-how-do-i-store-secrets-credentials-or-private-data/"
                  className="no-button-styles"
                  variant="secondary"
                  size="small"
                >
                  Learn More
                </Button>
              </Row>
            </Stack>
          </Notification>
        )}
        {showTipForDotenvKeys && isMember && isItAComment && (
          <Notification message="Comments are visible in remixes. Make sure there are no secrets in your comments!" variant="onboarding" persistent>
            <Stack>
              <span>Comments are visible in remixes. Make sure there are no secrets in your comments!</span>
              <Row>
                <Button
                  className="no-button-styles"
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    setShowTipForDotenvKeys(false);
                  }}
                >
                  Hide
                </Button>
              </Row>
            </Stack>
          </Notification>
        )}
        {showTipForDotenv && isMember && (
          <Notification
            message="The .env file is for storing secrets for your app, like an API key. Any project member can see the contents in the same way
          that you can, and everyone else can just see the variable names."
            variant="onboarding"
            persistent
          >
            <Stack>
              <span>
                <b>The .env file is for storing secrets for your app, like an API key.</b> Any project member can see the contents in the same way
                that you can, and everyone else can just see the variable names.
              </span>
              <Row>
                <Button
                  as="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://glitch.com/help/kb/article/18-how-do-i-store-secrets-credentials-or-private-data/"
                  className="no-button-styles"
                  variant="secondary"
                  size="small"
                >
                  Learn How to Use Environment Variables
                </Button>
                <Button
                  className="no-button-styles"
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    setShowTipForDotenv(false);
                  }}
                >
                  Hide
                </Button>
              </Row>
            </Stack>
          </Notification>
        )}
        <form>
          {nodes.map(({ key: name, value, type, comment }, i) => {
            /* eslint-disable react/no-array-index-key */
            if (type === COMMENT) {
              return <StyledComment key={i} comment={comment} />;
            }
            if (type === KEY_VALUE) {
              return (
                <StyledKeyValue
                  key={i}
                  name={name}
                  value={value}
                  onNameChange={(newName) => {
                    setNodes((currentNodes) => changeKey(currentNodes, i, newName));
                  }}
                  onValueChange={(newValue) => {
                    setNodes((currentNodes) => changeValueWithForcedQuotes(currentNodes, i, newValue));
                  }}
                  onDelete={() => {
                    setNodes(removeKeyValue(nodes, i));
                    application.notifyDotenvRemovedVariable(true);
                  }}
                />
              );
            }
            return null;
            /* eslint-enable react/no-array-index-key */
          })}
        </form>
        {isMember && (
          <StyledAddVariableRow>
            <Button className="no-button-styles" onClick={addKeyValuePair}>
              Add a Variable
            </Button>
          </StyledAddVariableRow>
        )}
      </StyledStack>
    </DotenvContainer>
  );
}
