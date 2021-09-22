import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from '@pipedrive/convention-ui-react';

import style from './style.css';

function header({
	title,
	iconStyle,
	closeIconLabel,
	goBackIconLabel,
	displayBack,
	goBack,
	hide,
	gettingStartedClose,
}) {
	return (
		<div className={style.Header}>
			<div className={style.Header__controls}>
				{
					displayBack ?
						<div className={style.Header__back} onClick={goBack}>
							<Icon icon="sm-arrow-back" color="black-88" className={style.Header__icon}/>
							{
								goBackIconLabel ?
									<span className={style.Header__iconLabel}>
										{goBackIconLabel}
									</span> :
									''
							}
						</div> :
						''
				}
				{ title && <span onClick={goBack} className={style.Header__title}>{title}</span> }
				<Button color={'ghost'} className={style.Header__close} onClick={() => {
					gettingStartedClose && gettingStartedClose();
					hide();
				}}>
					{closeIconLabel ? <span className={style.Header__iconLabel}>{closeIconLabel}</span> : ''}
					<Icon icon={iconStyle} size={'s'} color="black-64"/>
				</Button>
			</div>
		</div>
	);
}

header.propTypes = {
	goBack: PropTypes.func.isRequired,
	hide: PropTypes.func.isRequired,
	displayBack: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	iconStyle: PropTypes.string.isRequired,
	closeIconLabel: PropTypes.string,
	goBackIconLabel: PropTypes.string,
	gettingStartedClose: PropTypes.func,
};

export const Header = header;
export default header;
