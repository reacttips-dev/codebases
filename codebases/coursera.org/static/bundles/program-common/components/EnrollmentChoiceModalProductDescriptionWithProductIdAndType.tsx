/** @jsx jsx */
import * as React from 'react';
import { jsx } from '@emotion/react';
import type { Theme } from '@coursera/cds-core';
import { useTheme, Typography } from '@coursera/cds-core';
import Imgix from 'js/components/Imgix';
import Skeleton from 'bundles/program-home/components/cds/Skeleton';
import { compose, getDisplayName, setDisplayName } from 'recompose';
import { graphql } from 'react-apollo';
import type {
  EnrollmentChoiceModalProductDescriptionQuery as EnrollmentChoiceModalProductDescriptionQueryType,
  EnrollmentChoiceModalProductDescriptionQueryVariables,
  EnrollmentChoiceModalProductDescriptionQuery_XdpV1Resource_get_xdpMetadata_XdpV1_sdpMetadataMember as SdpMetadataMember,
  EnrollmentChoiceModalProductDescriptionQuery_XdpV1Resource_get_xdpMetadata_XdpV1_cdpMetadataMember as CdpMetadataMember,
} from 'bundles/program-common/components/__generated__/EnrollmentChoiceModalProductDescriptionQuery';
import { EnrollmentChoiceModalProductDescriptionQuery } from 'bundles/program-common/components/EnrollmentChoiceModalQuery';
import { tupleToStringKey } from 'js/lib/stringKeyTuple';
import { PRODUCT_TYPES, PRODUCT_TYPES_SERVER } from 'bundles/program-common/constants/ProgramActionConstants';
import { getProductCardDisplayProps } from 'bundles/browse/utils';

type PropsFromCaller = { productId?: string; productType?: string };

type PropsFromGraphql = {
  loading: boolean;
  partnerName?: string;
  productLogo?: string;
  productName?: string;
  productTypeText?: string;
};

type Props = PropsFromCaller & PropsFromGraphql;

const styles = {
  logo: {
    borderRadius: 12,
  },
  logoSkeleton: (theme: Theme) => ({
    backgroundColor: theme.palette.gray[100],
    borderRadius: 12,
    width: 80,
    height: 80,
  }),
  productSection: (theme: Theme) => ({
    display: 'flex',
    flexFlow: 'row nowrap',
    borderTop: `1px solid ${theme.palette.gray[500]}`,
    borderBottom: `1px solid ${theme.palette.gray[500]}`,
    margin: theme.spacing(32, 48, 0, 48),
    padding: theme.spacing(16, 0),
    alignItems: 'center' as const,
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(24, 16, 0, 16),
      padding: theme.spacing(16, 0),
    },
  }),
  productDescription: (theme: Theme) => ({
    marginLeft: theme.spacing(16),
    flexGrow: 1,
    overflow: 'hidden' as const,
  }),
  pillTypography: {
    textTransform: 'uppercase' as const,
  },
  pill: (theme: Theme) => ({
    display: 'inline-block' as const,
    backgroundColor: theme.palette.gray[300],
    borderRadius: 4,
    paddingLeft: 6,
    paddingRight: 6,
  }),
  truncateText: {
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden' as const,
    textOverflow: 'ellipsis' as const,
  },
};

export const EnrollmentChoiceModalProductDescription = ({
  loading,
  partnerName,
  productLogo,
  productName,
  productTypeText,
}: Props) => {
  const theme = useTheme();

  const shouldRenderNothing = !loading && !productName;
  if (shouldRenderNothing) {
    return null;
  }

  return (
    <div css={styles.productSection(theme)}>
      {productLogo && productName ? (
        <Imgix css={styles.logo} src={productLogo} alt={productName} width={80} height={80} />
      ) : (
        <Skeleton bonusCSS={styles.logoSkeleton(theme)} />
      )}
      <div css={styles.productDescription(theme)}>
        <Typography variant="h2" component="p" css={styles.truncateText}>
          {productName || <Skeleton width={600} />}
        </Typography>
        <Typography variant="body1" css={styles.truncateText}>
          {partnerName || <Skeleton width={200} />}
        </Typography>
        <Typography variant="body2" css={styles.pillTypography}>
          {productTypeText ? (
            <span css={styles.pill(theme)}>{productTypeText}</span>
          ) : (
            <Skeleton bonusCSS={styles.pill(theme)} width={100} />
          )}
        </Typography>
      </div>
    </div>
  );
};

const enhance = compose<Props, PropsFromCaller>(
  setDisplayName(getDisplayName(EnrollmentChoiceModalProductDescription)),
  graphql<
    PropsFromCaller,
    EnrollmentChoiceModalProductDescriptionQueryType,
    EnrollmentChoiceModalProductDescriptionQueryVariables,
    PropsFromGraphql
  >(EnrollmentChoiceModalProductDescriptionQuery, {
    skip: ({ productId, productType }) => !productId || !productType,
    options: ({ productId, productType }) => {
      const productType0 =
        productType === PRODUCT_TYPES.SPECIALIZATION
          ? PRODUCT_TYPES_SERVER.SPECIALIZATION
          : PRODUCT_TYPES_SERVER.COURSE;
      return {
        variables: {
          // See above skip().
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          productId: tupleToStringKey([productType0, productId!]),
        },
      };
    },
    props: ({ data }) => {
      const xdpMetadata = data?.XdpV1Resource?.get?.xdpMetadata;
      const sdpMetadata = (xdpMetadata as SdpMetadataMember | undefined | null)?.sdpMetadata;
      const cpdMetadata = (xdpMetadata as CdpMetadataMember | undefined | null)?.cdpMetadata;
      const isSpecialization = xdpMetadata?.__typename === 'XdpV1_sdpMetadataMember';
      const isRhymeProject = cpdMetadata?.courseTypeMetadata?.__typename === 'XdpV1_rhymeProjectMember';
      const displayProps = data?.loading
        ? undefined
        : getProductCardDisplayProps({ isRhymeProject, courseIds: sdpMetadata?.courseIds }, isSpecialization);
      return {
        loading: data?.loading ?? true,
        error: Boolean(data?.error),
        productName: sdpMetadata?.name ?? cpdMetadata?.name,
        partnerName: sdpMetadata?.partners?.[0]?.name ?? cpdMetadata?.partners?.[0]?.name,
        productLogo: sdpMetadata?.certificateLogo ?? cpdMetadata?.photoUrl ?? undefined,
        productTypeText: displayProps?.labelAsText,
      };
    },
  })
);

export default enhance(EnrollmentChoiceModalProductDescription);
