import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { HotKeys } from 'react-hotkeys';
import { Spacing, Input } from '@pipedrive/convention-ui-react';
import './popover.scss';

class Search extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isTrackInteraction: true
		};

		this.onInputChange = this.onInputChange.bind(this);
	}

	focusInput() {
		this.input.inputRef.current.focus();
	}

	onInputChange(value) {
		const { usageTracking = {}, componentName = '', searchInputChange } = this.props;

		// on first interaction track usage
		if (this.state.isTrackInteraction) {
			this.setState({ isTrackInteraction: false });

			usageTracking.sendMetrics(componentName, 'searched');
		}

		searchInputChange(value);
	}

	render() {
		// use allowClear if https://github.com/pipedrive/convention-ui-react/issues/136 is fixed
		const { keyHandlers, spacing = {}, translator } = this.props;

		return (
			<HotKeys handlers={keyHandlers}>
				<Spacing
					top={spacing.top}
					bottom={spacing.bottom}
					left={spacing.left}
					right={spacing.right}
				>
					<Input
						allowClear={true}
						autoFocus={true}
						icon="search"
						onChange={(e) => this.onInputChange(e.target.value)}
						placeholder={translator.gettext('Search')}
						type="search"
						ref={(input) => {
							this.input = input;
						}}
					/>
				</Spacing>
			</HotKeys>
		);
	}
}

Search.propTypes = {
	searchInputChange: PropTypes.func.isRequired,
	translator: PropTypes.object.isRequired,
	componentName: PropTypes.string.isRequired,
	usageTracking: PropTypes.object.isRequired,
	keyHandlers: PropTypes.object,
	spacing: PropTypes.object
};

export default Search;
