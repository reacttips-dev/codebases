import { removeComposeLinkViewState } from '../actions/internalActions';
import { deleteLink } from 'owa-link-data';
import * as ReactDOM from 'react-dom';
import { orchestrator } from 'satcheljs';

orchestrator(deleteLink, actionMessage => {
    const linkDOMElement = (actionMessage.targetWindow || window).document.getElementById(
        actionMessage.linkId
    );
    if (!linkDOMElement) {
        return;
    }

    ReactDOM.unmountComponentAtNode(linkDOMElement);

    linkDOMElement.parentNode.removeChild(linkDOMElement);
    removeComposeLinkViewState(actionMessage.linkId);
});
