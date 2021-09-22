import { lazyLaunchInAppFeedback } from 'owa-uservoice';

export default function feedbackPaneRouteHandler() {
    lazyLaunchInAppFeedback.importAndExecute();
}
