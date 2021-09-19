import loadable from '@loadable/component';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { AppState } from 'types/app';

const ReviewGallery = loadable(() => import('containers/ReviewGallery'));

interface OwnProps {
  params: {
    productId: string;
    reviewsPage?: string;
    reviewsStart?: string;
    orderBy?: string;
    reviewId?: string;
  };
  returnUrl: string;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export const ReviewGalleryWrapper = (props: Props) => (props.isModalOpen ? <ReviewGallery {...props} /> : null);

const mapStateToProps = (state: AppState) => {
  const { reviews: { reviewGallery: { isModalOpen } } } = state;
  return { isModalOpen };
};

const connector = connect(mapStateToProps);
const ConnectedReviewGalleryWrapper = connector(ReviewGalleryWrapper);
export default withErrorBoundary('ReviewGalleryWrapper', ConnectedReviewGalleryWrapper);
