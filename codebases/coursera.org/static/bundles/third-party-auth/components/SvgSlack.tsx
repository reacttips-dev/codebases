/* eslint-disable import/no-mutable-exports */
import * as React from 'react';
import { pure } from 'recompose';
import { SvgIcon } from '@coursera/coursera-ui';

let SvgSlack = ({ title = 'Slack', ...props }) => (
  <SvgIcon title={title} {...props} viewBox="0 50 200 200">
    <g>
      <g>
        <path
          className="st0"
          style={{ fill: '#E01E5A' }}
          d="M99.4,151.2c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h12.9V151.2z"
        />
        <path
          className="st0"
          style={{ fill: '#E01E5A' }}
          d="M105.9,151.2c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v32.3c0,7.1-5.8,12.9-12.9,12.9
			s-12.9-5.8-12.9-12.9V151.2z"
        />
      </g>
      <g>
        <path
          className="st1"
          style={{ fill: '#36C5F0' }}
          d="M118.8,99.4c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9s12.9,5.8,12.9,12.9v12.9H118.8z"
        />
        <path
          className="st1"
          style={{ fill: '#36C5F0' }}
          d="M118.8,105.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9H86.5c-7.1,0-12.9-5.8-12.9-12.9
			s5.8-12.9,12.9-12.9H118.8z"
        />
      </g>
      <g>
        <path
          className="st2"
          style={{ fill: '#2EB67D' }}
          d="M170.6,118.8c0-7.1,5.8-12.9,12.9-12.9c7.1,0,12.9,5.8,12.9,12.9s-5.8,12.9-12.9,12.9h-12.9V118.8z"
        />
        <path
          className="st2"
          style={{ fill: '#2EB67D' }}
          d="M164.1,118.8c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9V86.5c0-7.1,5.8-12.9,12.9-12.9
			c7.1,0,12.9,5.8,12.9,12.9V118.8z"
        />
      </g>
      <g>
        <path
          className="st3"
          style={{ fill: '#ECB22E' }}
          d="M151.2,170.6c7.1,0,12.9,5.8,12.9,12.9c0,7.1-5.8,12.9-12.9,12.9c-7.1,0-12.9-5.8-12.9-12.9v-12.9H151.2z"
        />
        <path
          className="st3"
          style={{ fill: '#ECB22E' }}
          d="M151.2,164.1c-7.1,0-12.9-5.8-12.9-12.9c0-7.1,5.8-12.9,12.9-12.9h32.3c7.1,0,12.9,5.8,12.9,12.9
			c0,7.1-5.8,12.9-12.9,12.9H151.2z"
        />
      </g>
    </g>
  </SvgIcon>
);

// @ts-ignore ts-migrate(2322) FIXME: Type 'ComponentType<{ [x: string]: any; title?: st... Remove this comment to see the full error message
SvgSlack = pure(SvgSlack);
// @ts-ignore ts-migrate(2339) FIXME: Property 'displayName' does not exist on type '({ ... Remove this comment to see the full error message
SvgSlack.displayName = 'SvgSlack';

export default SvgSlack;
