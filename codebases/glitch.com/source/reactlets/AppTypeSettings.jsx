import React from 'react';
import styled from 'styled-components';
import { TextInput } from '@glitchdotcom/shared-components';
import useApplication from '../hooks/useApplication';
import useObservable from '../hooks/useObservable';

const appTypeOptions = [
  { id: 'static', label: 'Static' },
  { id: 'generated_static', label: 'Generated Static', hasBuildDirectory: true },
  { id: 'node', label: 'Node.js' },
  { id: 'custom', label: 'Custom' },
];

const Container = styled.div`
  padding: 2em;
`;

const Item = styled.div`
  margin-bottom: 1em;
  display: flex;
  align-items: center;
`;

const Label = styled.label`
  padding: 0 1em;
`;

const DirectoryInput = styled(TextInput)`
  width: 400px;
`;

export default function AppTypeSettings() {
  const application = useApplication();
  const { appType, buildDirectory } = useObservable(application.appTypeConfig);
  const onChangeAppType = (value) => application.updateAppTypeConfig({ appType: value, buildDirectory });
  const onChangeBuildDirectory = (value) => application.updateAppTypeConfig({ appType, buildDirectory: value });

  return (
    <Container>
      {appTypeOptions.map((option) => (
        <Item key={option.id}>
          <input type="radio" id={`appTypeSetting_${option.id}`} checked={option.id === appType} onChange={() => onChangeAppType(option.id)} />
          <Label htmlFor={`appTypeSetting_${option.id}`}>{option.label}</Label>
          {option.hasBuildDirectory && (
            <DirectoryInput
              value={buildDirectory}
              onChange={onChangeBuildDirectory}
              label="Build directory, e.g. /build"
              disabled={option.id !== appType}
            />
          )}
        </Item>
      ))}
    </Container>
  );
}
