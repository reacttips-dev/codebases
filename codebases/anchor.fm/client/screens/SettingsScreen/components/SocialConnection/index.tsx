/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { FieldInput } from 'components/FieldInput';
import { FieldLabel } from 'components/FieldLabel';
import { FieldValues, UseFormRegister, UseFormWatch } from 'react-hook-form';
import { Icon } from 'shared/Icon';
import {
  ContentContainer,
  IconWrapper,
  ProviderLabel,
  TextInputWrapper,
  Wrapper,
} from './styles';

type Provider = 'twitter' | 'instagram' | 'youtube' | 'facebook' | 'website';

type ReturnProviderData = {
  iconType: 'TwitterLogo' | 'Instagram' | 'Youtube' | 'FacebookLogo' | 'link';
  label: string;
  iconPadding: number;
  color: string;
};

export function SocialConnection({
  provider,
  register,
  watch,
}: {
  provider: Provider;
  register: UseFormRegister<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}) {
  const { iconType, label, iconPadding, color } = getProviderData(provider);
  const fieldName = `${provider}SocialUsername`;
  const shouldFillIcon = watch(fieldName) !== '';
  return (
    <Wrapper>
      <IconWrapper
        css={css`
          padding: ${iconPadding}px;
        `}
      >
        <Icon
          type={iconType}
          isInCircle={true}
          fillColor={shouldFillIcon ? color : '#5F6369'}
        />
      </IconWrapper>
      <ProviderLabel>{label}</ProviderLabel>
      <ContentContainer>
        <TextInputWrapper>
          <FieldLabel htmlFor={fieldName}>
            <p
              css={css`
                margin: 0;
                font-size: 1.6rem;
                font-weight: normal;
                margin-right: 12px;
                color: #292f36;
                @media (max-width: 560px) {
                  width: 120px;
                }
              `}
            >
              {`${provider}.com/`}
            </p>
          </FieldLabel>
          <FieldInput
            {...register(fieldName)}
            cssProp={css`
              flex: 0 0 290px;
              @media (max-width: 560px) {
                flex: 1;
              }
            `}
            id={fieldName}
            type="text"
          />
        </TextInputWrapper>
      </ContentContainer>
    </Wrapper>
  );
}

export function getProviderData(provider: Provider): ReturnProviderData {
  switch (provider) {
    case 'twitter':
      return {
        iconType: 'TwitterLogo',
        label: 'Twitter',
        iconPadding: 12,
        color: '#50ABF1',
      };
    case 'instagram':
      return {
        iconType: 'Instagram',
        label: 'Instagram',
        iconPadding: 12,
        color: '#3f729b',
      };
    case 'youtube':
      return {
        iconType: 'Youtube',
        label: 'YouTube',
        iconPadding: 11,
        color: '#c4302b',
      };
    case 'facebook':
      return {
        iconType: 'FacebookLogo',
        label: 'Facebook',
        iconPadding: 13,
        color: '#3b5998',
      };
    default:
      return {
        iconType: 'link',
        label: 'Website',
        iconPadding: 13,
        color: '#ebebec',
      };
  }
}
