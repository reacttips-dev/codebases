import React, {Component} from 'react';
import * as C from '../constants';

export default class NotFoundView extends Component {
  render() {
    return (
      <div className="landing-container">
        <div id="stack-name" style={{textAlign: 'center', paddingTop: '150px'}}>
          Sorry, we couldn&apos;t find that page :(
          <br />
          <br />
          <div className="div-center">
            <a href="/">
              <img style={{maxWidth: '70px'}} alt="StackShare" src={C.IMG_LOGO_TEXTLESS} />
            </a>
          </div>
        </div>
      </div>
    );
  }
}
