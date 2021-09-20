import PropTypes from 'prop-types';
import styles from './_link-list.scss';

export default cssModule(
  class extends React.Component {
    static displayName = 'settings/link-list';

    static propTypes = {
      links: PropTypes.arrayOf(
        PropTypes.shape({
          content: PropTypes.node.isRequired,
          className: PropTypes.string,
          href: PropTypes.string,
          modal: PropTypes.any, // type of modal (no matching proptype)
          onShowModal: PropTypes.func,
          onHideModal: PropTypes.func,
          modalProps: PropTypes.objectOf(PropTypes.any),
        })
      ),
    };

    state = {
      activeLink: null,
    };

    handleShowModal = (evt, link) => {
      evt.preventDefault();
      if (link.onShowModal) {
        link.onShowModal();
      }
      this.setState({
        activeLink: link,
      });
    };

    handleHideModal = () => {
      const { activeLink } = this.state;
      if (activeLink.onHideModal) {
        activeLink.onHideModal();
      }
      this.setState({
        activeLink: null,
      });
    };

    _renderModal = () => {
      const { activeLink } = this.state;
      if (activeLink) {
        return (
          <activeLink.modal
            onHide={this.handleHideModal}
            show
            {...activeLink.modalProps}
          />
        );
      }
    };

    _renderLink = (link) => {
      if (link.href) {
        return (
          <a
            href={link.href}
            target={link.target || '_self'}
            onClick={_.defaultTo(link.onClick, _.noop)}
            className={link.className}
          >
            {link.content}
          </a>
        );
      } else if (link.modal) {
        return (
          <a
            href="#"
            className={link.className}
            onClick={(evt) => this.handleShowModal(evt, link)}
          >
            {link.content}
          </a>
        );
      } else {
        return <span>{link.content}</span>;
      }
    };

    _renderLinks = () => {
      return _.chain(this.props.links)
        .map((link, idx) => <li key={idx}>{this._renderLink(link)}</li>)
        .compact()
        .value();
    };

    render() {
      return (
        <ul styleName="link-container">
          {this._renderLinks()}
          {this._renderModal()}
        </ul>
      );
    }
  },
  styles
);
