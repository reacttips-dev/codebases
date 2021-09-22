import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap-33';

import ProfileImage from 'bundles/phoenix/components/ProfileImage';

import { Instructor } from 'bundles/course-v2/types/Course';

type Props = {
  instructor: Instructor;
};

class InstructorImage extends React.Component<Props> {
  render() {
    const {
      instructor: { id, photo, fullName },
    } = this.props;
    const tooltip = <Tooltip>{fullName}</Tooltip>;

    return (
      <OverlayTrigger placement="top" overlay={tooltip} key={id}>
        <div className="instructor-image-container">
          <ProfileImage
            width={40}
            height={40}
            alt={fullName}
            fullName={fullName}
            profileImageUrl={photo}
            // @ts-expect-error TSMIGRATION
            imgParams={{ auto: 'fit', fit: 'crop' }}
          />
        </div>
      </OverlayTrigger>
    );
  }
}

export default InstructorImage;
