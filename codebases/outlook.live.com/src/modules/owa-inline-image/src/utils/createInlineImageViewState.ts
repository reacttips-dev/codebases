import type InlineImageViewState from '../schema/InlineImageViewState';

export default function createInlineImageViewState(): InlineImageViewState {
    return {
        imageStatusMap: {},
    };
}
