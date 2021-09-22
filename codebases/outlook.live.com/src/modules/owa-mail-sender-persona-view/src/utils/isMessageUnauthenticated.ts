import type Message from 'owa-service/lib/contract/Message';

const isMessageUnauthenticated = (message: Message) => message.AntispamUnauthenticatedSender;

export default isMessageUnauthenticated;
