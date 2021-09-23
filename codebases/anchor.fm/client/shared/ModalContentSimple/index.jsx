import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Box from '../Box';
import Text from '../Text';
import If from '../If';
import Mask from '../Mask';
import Image from '../Image';
import { ButtonWithHoverAndPress } from '../Button';
import { LinkText } from '../Link';
// eslint-disable-next-line import/no-named-as-default
import IconBadge from '../../components/IconBadge';

/**
 * @deprecated Use the `Modal` component
 */
const ModalContentSimple = ({
  image,
  title,
  renderBody,
  primaryButton,
  secondaryButton,
  link,
  titleWidth,
}) => (
  <Box display="flex" direction="column" alignItems="center">
    <If
      condition={image}
      ifRender={() => (
        <Box width="100%" marginBottom={12}>
          <Mask isFullWidth shape="rounded">
            <Image
              width="100%"
              imageUrl={image.url}
              retinaImageUrl={image.retinalUrl}
            />
          </Mask>
        </Box>
      )}
    />
    <Box width="100%" display="flex" justifyContent="center">
      <Box maxWidth={titleWidth} width="100%">
        <Heading>{title}</Heading>
      </Box>
    </Box>
    <If
      condition={renderBody && renderBody()}
      ifRender={() => (
        <Box maxWidth={449} width="100%" marginTop={30}>
          <Text size="md" align="center" color="#7f8287">
            {renderBody()}
          </Text>
        </Box>
      )}
    />
    <If
      condition={primaryButton}
      ifRender={() => (
        <Box marginTop={35} width="100%" maxWidth={300}>
          <ButtonWithHoverAndPress
            isDisabled={false}
            shape="pill"
            type={primaryButton.type || 'unelevated'}
            colorTheme={primaryButton.colorTheme || 'primary'}
            text={primaryButton.text}
            size="md"
            isFullWidth
            onPress={primaryButton.onClick}
          />
        </Box>
      )}
    />
    <If
      condition={secondaryButton}
      ifRender={() => (
        <Box marginTop={20} width="100%" maxWidth={300}>
          <ButtonWithHoverAndPress
            isDisabled={false}
            shape="pill"
            type={secondaryButton.type || 'outlined'}
            colorTheme={secondaryButton.colorTheme || 'primary'}
            text={secondaryButton.text}
            size="md"
            isFullWidth
            onPress={secondaryButton.onClick}
          />
        </Box>
      )}
    />
    <If
      condition={link}
      ifRender={() => (
        <Box marginTop={9}>
          <LinkText to={link.url} target="_blank">
            <Box display="flex" alignItems="center">
              <Box display="flex" alignItems="center" marginRight={6}>
                <IconBadge
                  backgroundColor="gray"
                  padding={0}
                  type="InfoIcon"
                  width={17}
                />
              </Box>
              <Text isBold size="xl" color="rgba(41, 47, 54, 0.6)">
                {link.text}
              </Text>
            </Box>
          </LinkText>
        </Box>
      )}
    />
  </Box>
);

const Heading = styled.h1`
  font-size: 2.4rem;
  font-weight: bold;
  margin: 0;
  padding: 0;
  text-align: center;
`;

ModalContentSimple.defaultProps = {
  image: null,
  primaryButton: null,
  secondaryButton: null,
  link: null,
  titleWidth: 405,
};

ModalContentSimple.propTypes = {
  image: PropTypes.shape({
    url: PropTypes.string.isRequired,
    retinaImageUrl: PropTypes.string,
  }),
  title: PropTypes.string.isRequired,
  renderBody: PropTypes.func.isRequired,
  primaryButton: PropTypes.shape({
    text: PropTypes.string.isRequired,
    type: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    colorTheme: PropTypes.string,
  }),
  secondaryButton: PropTypes.oneOf([
    PropTypes.shape({
      type: PropTypes.string,
      text: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      colorTheme: PropTypes.string,
    }),
    PropTypes.null,
  ]),
  link: PropTypes.oneOf([
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
    PropTypes.null,
  ]),
  titleWidth: PropTypes.number,
};

export { ModalContentSimple };
