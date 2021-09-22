import React from 'react';
import PropTypes from 'prop-types';
import NativeListener from 'react-native-listener';
import parse from 'html-react-parser';
import Icon from '../icon';
import style from './style.css';

const PopoverContent = ({
	actions,
	content,
	iconUrl,
}) => (
	<div className={style.PopoverContent}>
		<div className={style.PopoverContent__body}>
			{iconUrl && <Icon url={iconUrl} />}

			<div className={style.PopoverContent__text}>
				{parse(content)}
			</div>
		</div>

		<div className={style.PopoverContent__actions}>
			{actions.map(({ handler, label }, i) => (
				<NativeListener onClick={handler} key={i}>
					<div className={style.PopoverContent__action}>
						{label}
					</div>
				</NativeListener>
			))}
		</div>
	</div>
);

PopoverContent.propTypes = {
	actions: PropTypes.array.isRequired,
	content: PropTypes.string,
	iconUrl: PropTypes.string,
};

export default PopoverContent;
