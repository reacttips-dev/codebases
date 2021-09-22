import styles from './ChatWrapper.scss';
import classNames from 'classnames';

const CHAT_WRAPPER_CLASSNAME = 'chat-wrapper';

function addChatWrapper(): HTMLDivElement {
    // Initialize it and append it to the body.
    let chatWrapperDiv = document.createElement('div');
    chatWrapperDiv.className = classNames(CHAT_WRAPPER_CLASSNAME, styles.chatWrapper);
    document.body.appendChild(chatWrapperDiv);

    return chatWrapperDiv;
}

export default addChatWrapper;
