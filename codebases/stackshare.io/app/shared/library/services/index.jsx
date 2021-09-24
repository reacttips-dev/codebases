import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {grid} from '../../../shared/utils/grid';
import ServiceTile, {SMALL} from '../tiles/service';
import ServiceListPopover from '../popovers/service-list';
import ServiceDetailsPopover from '../popovers/service-details';
import {BASE_TEXT} from '../../../shared/style/typography';
import {FOCUS_BLUE} from '../../../shared/style/colors';

const noop = () => null;

const ThumbnailsContainer = glamorous.div({
  display: 'flex',
  alignItems: 'center'
});

const ThumbnailsWrap = glamorous.span({
  display: 'flex',
  alignItems: 'center',
  marginRight: grid(0.5),
  '& a': {
    marginRight: grid(1)
  }
});

const Link = glamorous.span({
  ...BASE_TEXT,
  color: FOCUS_BLUE,
  textDecoration: 'none',
  cursor: 'pointer'
});

export default class Services extends Component {
  static propTypes = {
    services: PropTypes.array,
    onActivate: PropTypes.func,
    onClick: PropTypes.func,
    showJobs: PropTypes.bool,
    serviceCount: PropTypes.number,
    searchTerms: PropTypes.array,
    showPopOver: PropTypes.bool
  };

  static defaultProps = {
    services: []
  };

  renderThumbnails() {
    const {
      services,
      onActivate,
      onClick,
      showJobs = true,
      serviceCount = 3,
      searchTerms = [],
      showPopOver = true
    } = this.props;

    const terms = new Map(searchTerms.map(s => [s.toLowerCase(), s])).values();
    const matches = [...terms].reduceRight((priortizedItems, item) => {
      const matches = services.filter(i => i.name.toLowerCase() === item.toLowerCase());
      return [...matches, ...priortizedItems];
    }, []);

    const notFound = services.filter(s => !matches.map(m => m.name).includes(s.name));
    const results = [...matches, ...notFound];

    const serviceItems = searchTerms.length ? results : services;

    return serviceItems.slice(0, serviceCount).map(service => {
      const {id, name, imageUrl, path} = service;
      return (
        <>
          {showPopOver && (
            <ServiceDetailsPopover
              showJobs={showJobs}
              key={name}
              service={service}
              onFollowToggle={noop}
              onActivate={() => {
                onActivate(id, name, path);
              }}
              onClick={() => {
                onClick(id, name, path);
              }}
              showFollow={false}
            >
              <ServiceTile size={SMALL} name={name} href={null} imageUrl={imageUrl} />
            </ServiceDetailsPopover>
          )}
          {!showPopOver && <ServiceTile size={SMALL} name={name} href={null} imageUrl={imageUrl} />}
        </>
      );
    });
  }

  render() {
    const {services, onClick, serviceCount} = this.props;
    const numServices = services.length;

    const moreServices = services.slice(serviceCount, numServices + 1);
    const numMoreServices = moreServices.length;
    return (
      <ThumbnailsContainer>
        {numServices > 0 && <ThumbnailsWrap>{this.renderThumbnails(serviceCount)}</ThumbnailsWrap>}
        {numMoreServices > 0 && (
          <ServiceListPopover services={moreServices} onClick={onClick}>
            <Link>+{numMoreServices}</Link>
          </ServiceListPopover>
        )}
      </ThumbnailsContainer>
    );
  }
}
