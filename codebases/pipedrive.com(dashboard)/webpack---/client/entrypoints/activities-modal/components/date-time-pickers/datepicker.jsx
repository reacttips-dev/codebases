import React, { Component, createRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Pikaday from 'pikaday';
import moment from 'moment';

import { Input } from '@pipedrive/convention-ui-react';

import { TodayButton } from './datetimepicker-styles';
import modalContext from '../../../../utils/context';
import { DATE_FORMATS, DEFAULT_LOCALE, UTC_DATE_FORMAT } from '../../../../config/constants';

class DatePicker extends Component {
	constructor(props) {
		super(props);

		const locale = props.locale || DEFAULT_LOCALE;
		const localeData = moment().locale(locale).localeData();
		const localeDateFormats = [localeData.longDateFormat('L'), localeData.longDateFormat('LL')];

		this.state = {
			locale,
			dateFormats: [...DATE_FORMATS, ...localeDateFormats],
			pikadayFormat: localeData.longDateFormat('ll'),
			firstDay: localeData._week.dow,
			months: localeData.months(),
			weekdays: localeData.weekdays(),
			weekdaysShort: localeData.weekdaysShort(),
			value: '',
		};

		this.field = createRef();
		this.handleBlur = this.handleBlur.bind(this);
	}

	componentDidMount() {
		this.initPikadays();
		this.updateValue();
		this.updateMaxDate();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.maxDate !== this.props.maxDate && this.datePicker) {
			this.updateMaxDate();
		}

		if (prevProps.value !== this.props.value && this.datePicker) {
			this.updateValue();
		}
	}

	updateValue() {
		const { value } = this.props;

		this.setState({ value: this.toLocaleFormat(value) });
		this.datePicker.setDate(moment(value).toDate(), true);
	}

	updateMaxDate() {
		const { maxDate } = this.props;

		if (!maxDate) {
			return;
		}

		this.datePicker.setMaxDate(moment(maxDate).toDate(), true);
	}

	initPikadays() {
		const { onSelect, translator } = this.props;
		const {
			dateFormats,
			locale,
			firstDay,
			months,
			weekdays,
			weekdaysShort,
			pikadayFormat,
		} = this.state;

		const renderTodayButton = (picker) => {
			const buttonWrapper = document.createElement('div');

			const buttonElement = (
				<TodayButton
					color="ghost"
					tabIndex="-1"
					onClick={() => {
						onSelect(this.fromLocaleFormat(new Date()));
						this.setState({ value: this.toLocaleFormat(new Date()) });
					}}
				>
					{translator.gettext('Today')}
				</TodayButton>
			);

			picker.el.appendChild(buttonWrapper);
			ReactDOM.render(buttonElement, buttonWrapper);
		};

		this.datePicker = new Pikaday({
			field: this.field.current,
			format: pikadayFormat,
			firstDay,
			i18n: {
				months,
				weekdays,
				weekdaysShort,
			},
			showDaysInNextAndPreviousMonths: true,
			showTime: true,
			showMinutes: true,
			onSelect: (value) => {
				onSelect(this.fromLocaleFormat(value));
				this.setState({ value: this.toLocaleFormat(value) });
			},
			toString: (date) => {
				return this.toLocaleFormat(date);
			},
			parse: (dateString) => {
				return moment(dateString, dateFormats, locale).toDate();
			},
			onDraw: (picker) => {
				renderTodayButton(picker);
			},
		});
	}

	toLocaleFormat(date) {
		const { locale, pikadayFormat } = this.state;

		return moment(date).locale(locale).format(pikadayFormat);
	}

	fromLocaleFormat(date) {
		return moment(date).format(UTC_DATE_FORMAT);
	}

	handleBlur() {
		const { value } = this.state;
		const invalidValue = value && !moment(value).isValid();

		if (!value || invalidValue) {
			this.setState({ value: this.toLocaleFormat(this.props.value) });
		}
	}

	render() {
		const { value } = this.state;

		return (
			<Input
				value={value}
				onChange={(e) => this.setState({ value: e.target.value })}
				autoComplete="off"
				onBlur={this.handleBlur}
				{...(this.props.error ? { color: 'red' } : {})}
				inputRef={this.field}
			/>
		);
	}
}

DatePicker.propTypes = {
	value: PropTypes.PropTypes.string,
	maxDate: PropTypes.PropTypes.string,
	onSelect: PropTypes.func.isRequired,
	locale: PropTypes.string,
	error: PropTypes.bool,
	translator: PropTypes.object.isRequired,
};

export default modalContext(DatePicker);
