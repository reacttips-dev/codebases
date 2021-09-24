import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ServiceTile, {SMALL} from '../../../../shared/library/tiles/service';
import {Container, Heading, Col, Link} from './shared';
import glamorous from 'glamorous';
import {startCase} from '../../../../shared/utils/lodash-functions';

const CompanyLink = glamorous.a({
  cursor: 'pointer'
});

export default class CompanyHeading extends Component {
  static propTypes = {
    company: PropTypes.object
  };

  render() {
    const {name, imageUrl, tags, path} = this.props.company;
    const items = tags.slice(0, 3);
    return (
      <Container>
        <ServiceTile key={name} size={SMALL} name={name} href={path} imageUrl={imageUrl} />
        <Col>
          <Heading>
            <CompanyLink href={path}>{name}</CompanyLink>
          </Heading>
          <div>
            {items.map(({id, name}, index) => {
              return (
                <React.Fragment key={id}>
                  <Link href={`/stacks/${name}`}>{startCase(name)}</Link>
                  {index !== items.length - 1 && ' / '}
                </React.Fragment>
              );
            })}
          </div>
        </Col>
      </Container>
    );
  }
}
