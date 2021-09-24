import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Container, Heading, Link, ServiceIcon, Classification} from './service-heading-mobile';
import {startCase} from '../../../../shared/utils/lodash-functions';

export default class MobileCompanyHeading extends Component {
  static propTypes = {
    company: PropTypes.object
  };

  render() {
    const {company} = this.props;
    const items = company.tags.slice(0, 2);

    return (
      <Container>
        <ServiceIcon src={company.imageUrl} />
        <Heading>{company.name}</Heading>
        <Classification>
          {items.map(({id, name}, index) => {
            return (
              <React.Fragment key={id}>
                <Link href={`/stacks/${name}`}>{startCase(name)}</Link>
                {index !== items.length - 1 && `${'\u2008\u00b7\u2008'}`}
              </React.Fragment>
            );
          })}
        </Classification>
      </Container>
    );
  }
}
