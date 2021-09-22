import React, { Component } from 'react';
import PropTypes  from 'prop-types';
import ReactDOM from 'react-dom';
import { debounce } from 'lodash';
import { Icon, Input } from '@pipedrive/convention-ui-react';
import translate from 'containers/translation';

import style from './style.css';

const findDOMNode = 'findDOMNode';
const findNode = ReactDOM[findDOMNode];

export class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {
			query: props.query || '',
		};
		this.search = debounce(props.search, 100);
		this.onSubmit = this.onSubmit.bind(this);
		this.updateQuery = this.updateQuery.bind(this);
		this.clearQuery = this.clearQuery.bind(this);
	}

	updateQuery(value) {
		this.setState({
			query: value,
		});
		this.search(value);
	}

	clearQuery() {
		this.updateQuery('');
	}

	focus(input) {
		if (!input) {
			return;
		}

		findNode(input).getElementsByTagName('INPUT')[0].focus();
	}

	disableAutocomplete(input) {
		if (!input) {
			return;
		}

		findNode(input).getElementsByTagName('INPUT')[0].setAttribute('autocomplete', 'off');
	}

	onSubmit(e) {
		e.preventDefault();
		this.search(this.state.query);
	}

	render() {
		const clearClasses = this.state.query ?
			style.Search__clear :
			[style.Search__clear, style['Search__clear--hidden']].join(' ');

		return (
			<form onSubmit={this.onSubmit} className={style.Search}>
				<div className={style.Search__panel}>
					<Input
						type="text"
						placeholder={this.props.gettext('Search all articles')}
						icon="ac-search"
						name="search"
						value={this.state.query}
						className={style.Search__input}
						onChange={(event) => {
							this.updateQuery(event.target.value);
						}}
						ref={(input) => {
							this.focus(input);
							this.disableAutocomplete(input);
						}}
					/>
					<div className={clearClasses} onClick={this.clearQuery}>
						<Icon icon="cross" color="black-24" size="s"/>
					</div>
				</div>
			</form>
		);
	}
}

Search.propTypes = {
	search: PropTypes.func.isRequired,
	gettext: PropTypes.func.isRequired,
	query: PropTypes.string,
};

export default translate()(Search);
