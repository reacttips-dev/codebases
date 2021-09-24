import React, {Component} from 'react';
import {observer} from 'mobx-react';

export default
@observer
class ReasonsHeader extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
  }

  render() {
    return (
      <div className="reasons_header__container">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="reasons_header__details">
                <img
                  className="reasons_header__details__avatar"
                  src={window.app_data.current_user.image_url}
                />
                <div className="reasons_header__details__username">
                  {window.app_data.current_user.username}
                </div>
                <div className="reasons_header__details__points_title">Points</div>
                {/* <div className='reasons_header__details__points_value animated'><span>{this.store.points}</span></div> */}
                <div
                  className={`reasons_header__details__points_value animated ${
                    this.store.animatePoints ? 'bounceIn' : ''
                  }`}
                >
                  <span>{this.store.points}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
