import { Dialog, Button, Tooltip } from '@pipedrive/convention-ui-react';
import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getIsUpsellingSent } from '../../selectors/view';
import { useTranslator } from '@pipedrive/react-utils';
import UpsellingSVG from './Upselling.svg';
import { SvgContainer, Title, Content, ContentGray, Container, Buttons } from './StyledComponents';
import striptags from 'striptags';
import { addSnackbarMessage } from '../../components/SnackbarMessage/actions';
import { SnackbarMessages } from '../../components/SnackbarMessage/getMessage';
import { requestUpgrade } from '../../api/viewer';
import { trackUpselling, UPSELLING } from '../../utils/metrics.viewer';
import { ViewerContext } from '../../utils/viewerContext';
import Cookies from 'js-cookie';
import { setViewerUpselling } from '../../actions/view';

export interface UpsellingProps {
	children: React.ReactChild;
}

const Upselling: React.FunctionComponent<UpsellingProps> = ({ children }) => {
	const { isUpsellingSent } = useSelector((state: Viewer.State) => ({
		isUpsellingSent: getIsUpsellingSent(state),
	}));
	const { userId } = useContext(ViewerContext);
	const translator = useTranslator();
	const dispatch = useDispatch();
	const [isUpsellVisible, setUpsellVisible] = useState(false);
	const [isLoading, setLoading] = useState(false);

	const onClose = () => {
		setUpsellVisible(false);
		dispatch(trackUpselling(UPSELLING.DECLINED));
	};

	const onOpen = () => {
		if (!isUpsellingSent) {
			setUpsellVisible(true);
			dispatch(trackUpselling(UPSELLING.DISPLAYED));
		}
	};

	const sendRequest = async () => {
		setLoading(true);

		try {
			await requestUpgrade();

			dispatch(setViewerUpselling());
			dispatch(addSnackbarMessage({ key: SnackbarMessages.ACTION_REQUEST_UPSELL }));
			dispatch(trackUpselling(UPSELLING.REQUESTED));
			setCookie();
		} catch (error) {
			dispatch(addSnackbarMessage({ key: SnackbarMessages.ACTION_FAILURE }));
			dispatch({
				type: SnackbarMessages.ACTION_REQUEST_ERROR,
				error,
			});
		}

		setLoading(false);
		setUpsellVisible(false);
	};

	const setCookie = () => {
		Cookies.set(`upsellingRequest_${userId}`, String(userId), {
			expires: 1,
			secure: true,
		});
	};

	const getDealTile = () => {
		if (isUpsellingSent) {
			return (
				<Tooltip
					placement="right-end"
					content={translator.gettext('Your request to collaborate on deals was already sent to admins')}
				>
					<div>{children}</div>
				</Tooltip>
			);
		}

		return children;
	};

	return (
		<>
			{isUpsellVisible && (
				<Dialog
					actions={
						<Buttons>
							<Button data-test="viewer-upselling-cancel" onClick={onClose}>
								{translator.gettext('Not now')}
							</Button>
							<Button
								data-test="viewer-upselling-request"
								color="green"
								onClick={sendRequest}
								loading={isLoading}
							>
								{translator.gettext('Ask for regular user seat')}
							</Button>
						</Buttons>
					}
					closeOnEsc
					visible={true}
					onClose={onClose}
					data-test="viewer-upselling"
				>
					<Container>
						<SvgContainer>
							<UpsellingSVG />
						</SvgContainer>
						<Title>{translator.gettext('Want to collaborate on deals?')}</Title>

						<Content
							dangerouslySetInnerHTML={{
								__html: striptags(
									translator.gettext(
										'As a regular user, you&lsquo;d be able to %sview specific deals%s and collaborate with your colleagues now.',
										['<strong>', '</strong>', '<strong>', '</strong>'],
									),
									['strong'],
								),
							}}
						/>
						<ContentGray>
							{translator.gettext(
								'Deal viewing and commenting will be available for viewer users in the future.',
							)}
						</ContentGray>
					</Container>
				</Dialog>
			)}
			<div onClick={onOpen}>{getDealTile()}</div>
		</>
	);
};

export default Upselling;
