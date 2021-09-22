import React from 'react';
import { useTranslator } from '@pipedrive/react-utils';
import { Button } from '@pipedrive/convention-ui-react';

interface ShareLinkModalFooterProps {
	onDone: () => void;
}

const ShareLinkModalFooter: React.FC<ShareLinkModalFooterProps> = ({
	onDone,
}) => {
	const t = useTranslator();

	return (
		<footer className="cui4-modal__footer">
			<div>
				<Button
					onClick={onDone}
					data-test="share-link-modal-done-button"
				>
					{t.gettext('Close')}
				</Button>
			</div>
		</footer>
	);
};

export default ShareLinkModalFooter;
