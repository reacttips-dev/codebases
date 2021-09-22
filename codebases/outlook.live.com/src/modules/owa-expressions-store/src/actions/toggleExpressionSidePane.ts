import { action } from 'satcheljs';

export default action('toggleExpressionSidePane', (showExpressionPane: boolean) => ({
    showExpressionPane,
}));
