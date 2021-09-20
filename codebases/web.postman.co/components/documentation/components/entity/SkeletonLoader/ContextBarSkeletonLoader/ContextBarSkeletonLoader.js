import React from 'react';
import SkeletonUnit from '../../../SkeletonUnit';

/**
 * Return skeleton loader for Context Bar View
 */
export default function ContextBarSkeletonLoader () {

  const contextBarSkeletonProps = [
    { height: 16, width: 293, top: 60, left: 60, borderRadius: 3 },
    { height: 16, width: 211, top: 88, left: 60, borderRadius: 3 },
    { height: 16, width: 144, top: 124, left: 60, borderRadius: 3 },
    { height: 16, width: 20, top: 156, left: 60, borderRadius: 3 },
    { height: 16, width: 20, top: 186, left: 60, borderRadius: 3 },
    { height: 16, width: 116, top: 156, left: 88, borderRadius: 3 },
    { height: 16, width: 116, top: 186, left: 88, borderRadius: 3 }
  ];

  return (
    <div className='documentation-context-bar-loader'>
      <div className='documentation-context-bar-body'>
        {
          _.map(contextBarSkeletonProps, (contextBarSkeletonProp, index) => {
            return (
              <SkeletonUnit
                key={index}
                height={contextBarSkeletonProp.height}
                width={contextBarSkeletonProp.width}
                top={contextBarSkeletonProp.top}
                left={contextBarSkeletonProp.left}
                borderRadius={contextBarSkeletonProp.borderRadius}
              />
            );
          })
        }
      </div>
    </div>
  );
}
