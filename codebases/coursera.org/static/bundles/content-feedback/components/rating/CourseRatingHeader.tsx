import PropTypes from 'prop-types';
import React from 'react';
import Imgix from 'js/components/Imgix';
import 'css!./__styles__/CourseRatingHeader';

class CourseRatingHeader extends React.Component {
  static propTypes = {
    catalogPCourse: PropTypes.object, // CatalogP course model
    openCourse: PropTypes.object, // open course model
  };

  render() {
    let partners;
    let photoUrl = '';
    let partnerName = '';
    let courseName = '';

    // @ts-expect-error ts-migrate(2339) FIXME: Property 'catalogPCourse' does not exist on type '... Remove this comment to see the full error message
    if (this.props.catalogPCourse) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'catalogPCourse' does not exist on type '... Remove this comment to see the full error message
      const catalogPCourse = this.props.catalogPCourse;

      if (catalogPCourse.get) {
        photoUrl = catalogPCourse.get('photoUrl');
        partners = catalogPCourse.get('partners');
        partnerName = partners ? partners.at(0).get('name') : '';
        courseName = catalogPCourse.get('name');
      } else {
        // catalogPCourse is actually a Naptime model Course
        const course = catalogPCourse;
        photoUrl = course.photoUrl;
        courseName = course.name;
      }
    } else {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'openCourse' does not exist on type 'Read... Remove this comment to see the full error message
      const openCourse = this.props.openCourse;

      photoUrl = openCourse.get('promoPhoto');

      partners = openCourse.get('universities');
      partnerName = (partners.models && partners.models[0] && partners.models[0].get('name')) || '';
      courseName = openCourse.get('name');
    }

    return (
      <div className="rc-CourseRatingHeader">
        <Imgix width={200} alt={Imgix.DECORATIVE} src={photoUrl} className="c-course-rating-header-img" />

        <div className="c-course-rating-header-content">
          <div className="body-2-text">{partnerName}</div>
          <h3>{courseName}</h3>
        </div>
      </div>
    );
  }
}

export default CourseRatingHeader;
