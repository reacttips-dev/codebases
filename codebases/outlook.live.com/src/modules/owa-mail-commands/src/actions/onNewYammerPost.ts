import { lazyOpenYammerPublisher } from 'owa-yammer-publisher';

export default function onNewYammerPost() {
    lazyOpenYammerPublisher.importAndExecute();
}
