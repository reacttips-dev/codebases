import React from 'react'

import ClientScript from '~/components/ClientScript'

const scriptBody = () => `
(function (c, p, d, u, id, i) {
  id = ''; // Optional Custom ID for user in your system
  u = 'https://tracking.g2crowd.com/attribution_tracking/conversions/' + c + '.js?p=' + encodeURI(p) + '&e=' + id;
  i = document.createElement('script');
  i.type = 'application/javascript';
  i.async = true;
  i.src = u;
  d.getElementsByTagName('head')[0].appendChild(i);
  }("4822", document.location.href, document));
`

const groupsWithG2Tracking = [
    'Home',
    'SEO Skill Pages',
    'Vertical Landing Page',
    'Enterprise'
]

const G2Scripts = ({
        delay,
        group
    }) =>
    groupsWithG2Tracking.includes(group) ? ( <
        ClientScript body = {
            scriptBody()
        }
        delay = {
            delay
        }
        />
    ) : null

export default G2Scripts