import React from 'react';
import { SvgLoaderSignal } from '@coursera/coursera-ui/svg';

type Props = { iconSize?: number };

const Loader: React.FunctionComponent<Props> = ({ iconSize = 48 }) => (
  <div className="horizontal-box align-items-absolute-center bg-gray p-a-2 m-y-1">
    <SvgLoaderSignal size={iconSize} />
  </div>
);

export default Loader;
