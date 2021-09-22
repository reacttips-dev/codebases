import { action } from 'satcheljs';

export const updateIsSuiteHeaderRendered = action(
    'updateIsSuiteHeaderRendered',
    (isRendered: boolean) => ({ isRendered })
);

export const updateShySuiteHeaderMode = action('updateShySuiteHeaderMode', (isShy: boolean) => ({
    isShy,
}));

export const setIsFlexPaneShown = action('setIsFlexPaneShown', (isShown: boolean) => ({ isShown }));
