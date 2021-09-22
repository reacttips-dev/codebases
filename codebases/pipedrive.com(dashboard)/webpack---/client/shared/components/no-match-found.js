import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Config from '../../../client-config';

const classPrefix = `${Config.appPrefix}-${Config.emailTemplatesPrefix}`;

class NoMatchFound extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={`${classPrefix}-popover__select-no-matches`}>
				<p>{this.props.translator.gettext('No match found')}</p>
				<small>{this.props.translator.gettext('Please check your spelling')}</small>
			</div>
		);
	}
}

NoMatchFound.propTypes = {
	translator: PropTypes.object.isRequired
};

const mapStateToProps = (store) => ({ translator: store.translator });

export default connect(mapStateToProps)(NoMatchFound);
