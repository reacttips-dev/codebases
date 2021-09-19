import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { stringify } from 'query-string';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import SessionRequired from 'components/common/SessionRequired';
import { AppState } from 'types/app';

interface OwnProps {
  location?: {
    pathname: string;
    search: string;
  };
  link?: string;
  queryParams: {
    widget?: string;
    item?: string | number;
  };
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = OwnProps & PropsFromRedux;

export const JanusPixel = (({ pageLoaded, pixelUrl, referer, queryParams = {} }: Props) => {
  if (!pageLoaded) {
    return null;
  } else {
    const srcQueryParams = stringify({ referer, ...queryParams });
    return (
      <SessionRequired>
        <img alt="" className="hidden" src={`${pixelUrl}${Object.keys(queryParams).length > 0 ? `?${srcQueryParams}` : ''}`}/>
      </SessionRequired>
    );
  }
});

const mapStateToProps = (state: AppState, { location = window.location, link }: OwnProps) => {
  const { pageLoad : { loaded }, environmentConfig : { api, canonical } } = state;
  return {
    pixelUrl : `${api.mafia.url}/janus/recos/bi/ingest/pixel.png`,
    referer : `${canonical.url}${link || `${location.pathname}${location.search}`}`,
    pageLoaded : loaded
  };
};

const connector = connect(mapStateToProps);
const ConnectedJanusPixel = connector(JanusPixel);
export default withErrorBoundary('JanusPixel', ConnectedJanusPixel);
