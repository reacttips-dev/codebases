import React, { Component } from 'react';
import PropTypes from 'prop-types';
import translate from 'containers/translation';
import { connect } from 'react-redux';
import SectionHeader from '../sectionHeader';

import linksConfig from './linksConfig';
import Link from './link';

export class QuickLinksComponent extends Component {
	render() {
		const { gettext, userLang, trackExternalLink } = this.props;
		const quickLinks = linksConfig(gettext, userLang);

		return (
			<div className="quickLinks">
				<SectionHeader marginBottom={'4px'} id="quickLinksHeader">{gettext('Quick Links')}</SectionHeader>
				{quickLinks.map((quickLink, i) =>
					<Link
						className="link"
						key={i}
						order={i + 1}
						isDivider={!!quickLinks[i + 1]}
						trackExternalLink={trackExternalLink}
						linkConfig={quickLink}/>)}
			</div>
		);
	}
}

QuickLinksComponent.propTypes = {
	gettext: PropTypes.func.isRequired,
	trackExternalLink: PropTypes.func.isRequired,
	userLang: PropTypes.string,
};

export const mapStateToProps = (state) => {
	return {
		userLang: state.user.userLang,
	};
};

export default translate()(connect(mapStateToProps)(QuickLinksComponent));
