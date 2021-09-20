/* eslint-disable import/no-default-export */
import React from 'react';

import Atom from './Atom';
import DescriptionAtom from './DescriptionAtom';
import FeaturedAtom from './FeaturedAtom';
import ListingAtom from './ListingAtom';
import {
  AtomProps,
  DescriptionAtomProps,
  FeaturedAtomProps,
  PowerUpItemType,
  ListingAtomProps,
} from './types';

export interface PowerUpProps {
  type: PowerUpItemType;
  atomProps: AtomProps | DescriptionAtomProps | FeaturedAtomProps;
}

export const PowerUp: React.FunctionComponent<PowerUpProps> = ({
  type,
  atomProps,
}) => {
  if (type === PowerUpItemType.Featured) {
    return <FeaturedAtom {...(atomProps as FeaturedAtomProps)} />;
  } else if (type === PowerUpItemType.Description) {
    return <DescriptionAtom {...(atomProps as DescriptionAtomProps)} />;
  } else if (type === PowerUpItemType.Listing) {
    return <ListingAtom {...(atomProps as ListingAtomProps)} />;
  }

  return <Atom {...atomProps} />;
};

export default PowerUp;
