import React, {Component} from 'react';
import {observer} from 'mobx-react';
// import styles                          from './../styles.css'

export default
@observer
class Form extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.props.handleFormChange(name, value);
  };

  componentDidMount() {
    this.widget = uploadcare.SingleWidget(this.refs.image_url);
    this.widget.onUploadComplete(info => {
      this.props.handleFormChange('image_url', info.originalUrl);
    });
    $(this.refs.title).characterCounter({limit: '120', counterCssClass: 'counter'});
    $(this.refs.description).characterCounter({limit: '240', counterCssClass: 'counter'});
  }

  render() {
    return (
      <div
        className={
          `soft-approval-form approval_form ` +
          (this.props.opened ? 'approval_opened' : 'approval_closed')
        }
      >
        <div className="row">
          <div className="col-md-8 col-xs-12">
            <form onSubmit={this.props.onFormSubmit}>
              <input
                value={this.props.service.id}
                readOnly
                required
                type="hidden"
                className="form-control"
                id="serviceId"
              />

              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  value={this.props.service.name}
                  onChange={this.handleChange}
                  type="text"
                  required
                  className="form-control"
                  id="name"
                  name="name"
                  placeholder="eg. ReactJS"
                />
              </div>

              <div className="form-group">
                <label htmlFor="title">One-line description</label>
                <input
                  ref="title"
                  value={this.props.service.title || ''}
                  onChange={this.handleChange}
                  type="text"
                  required
                  className="form-control"
                  id="title"
                  name="title"
                  placeholder="eg. A JavaScript library for building user interfaces"
                />
              </div>

              <div className="form-group">
                <label htmlFor="website_url">Website URL</label>
                <input
                  value={this.props.service.website_url}
                  onChange={this.handleChange}
                  readOnly
                  type="text"
                  required
                  className="form-control"
                  id="website_url"
                  name="website_url"
                  placeholder="eg. http://foobar.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="image_url">Image</label>
              </div>

              <div className="form-group">
                <input
                  ref="image_url"
                  name="image_url"
                  role="uploadcare-uploader"
                  placeholder="Upload image or paste logo URL"
                  type="hidden"
                  pattern=".{3,}"
                  data-images-only="true"
                  data-file-types="png jpeg jpg"
                  data-input-accept-types="image/png image/jpeg"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  ref="description"
                  value={this.props.service.description || ''}
                  onChange={this.handleChange}
                  type="text"
                  maxLength="240"
                  required
                  className="form-control"
                  id="description"
                  name="description"
                  placeholder="eg. The best way to render views in Javascript!"
                />
              </div>

              <div className="form-group">
                <label htmlFor="twitter_username">Twitter Handle</label>
                <input
                  value={this.props.service.twitter_username || ''}
                  onChange={this.handleChange}
                  type="text"
                  className="form-control"
                  id="twitter_username"
                  name="twitter_username"
                  placeholder="eg. reactjs"
                />
              </div>

              <div className="form-group">
                <label htmlFor="features">Features (separated by semicolon;)</label>
                <textarea
                  value={this.props.service.features || ''}
                  onChange={this.handleChange}
                  type="text"
                  maxLength="700"
                  className="form-control"
                  id="features"
                  name="features"
                />
              </div>

              <button
                type="submit"
                className={
                  `btn btn-ss-alt btn-lg ` + (this.props.submissionInProgress ? 'disabled' : '')
                }
              >
                Submit for approval
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
