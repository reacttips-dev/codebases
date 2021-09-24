import React, {Component} from 'react';
import {observer} from 'mobx-react';

export default
@observer
class MatchMoreTools extends Component {
  constructor(props) {
    super(props);

    this.tools = props.tools.filter(t => {
      return !props.matchedTools.find(tt => {
        return tt.id === t.id;
      });
    });
  }

  img(url) {
    return url || 'https://img.stackshare.io/fe/default-img/service.svg';
  }

  render() {
    return (
      <div className="more-tools">
        <div className="more-tools__content">
          {this.tools.map(t => {
            return (
              <a
                key={`${this.props.parentId}-${t.id}`}
                href={`/${t.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hint--top"
                data-hint={t.name}
                data-align="left"
              >
                <img src={this.img(t.image_url)} />
              </a>
            );
          })}
        </div>
      </div>
    );
  }
}
