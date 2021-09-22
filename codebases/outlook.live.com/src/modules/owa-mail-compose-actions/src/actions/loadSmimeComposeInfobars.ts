import { action } from 'satcheljs';
import type { ComposeViewState } from 'owa-mail-compose-store';

export default action('loadSmimeComposeInfobars', (viewState: ComposeViewState) => ({ viewState }));
