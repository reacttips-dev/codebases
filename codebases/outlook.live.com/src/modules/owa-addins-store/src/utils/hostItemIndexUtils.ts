const COMPOSE_PREFIX = 'extCompose';
const READ_PREFIX = 'extRead';

export let getComposeHostItemIndex = (id: string): string => {
    return `${COMPOSE_PREFIX}_${id}`;
};

export let getReadHostItemIndex = (itemId: string): string => {
    return `${READ_PREFIX}_${itemId}`;
};

export let getScenarioFromHostItemIndex = (hostItemIndex: string): string => {
    if (hostItemIndex.indexOf(COMPOSE_PREFIX) === 0) {
        return 'Compose';
    } else if (hostItemIndex.indexOf(READ_PREFIX) === 0) {
        return 'Read';
    }

    return '';
};
