import { logUsage } from 'owa-analytics';
import { lazyBootstrapYammer } from 'owa-yammer-bootstrap';
import { lazyOpenYammerPublisher } from 'owa-yammer-publisher';

export default function initializeYammerPublisher() {
    // Prefetch and bootstrap yammer
    lazyBootstrapYammer.import().then(bootstrapYammer => bootstrapYammer());
    logUsage('YammerPublisher_PrefetchHit');

    // Prefetch main dialog code
    lazyOpenYammerPublisher.import();
}
