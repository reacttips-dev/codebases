import { GraphQLError } from 'graphql';
import { HxFallbackReason } from './HxFallbackReason';
import type { HxFallbackResult } from './HxFallbackResult';

/**
 * Type returned from a graphql resolver that represents the intent
 * "this operation is not supported by Hx, the caller should fall back
 * to using the web resolver instead"
 */
export type HxNotSupportedResult = HxFallbackResult<HxFallbackReason.NotSupportedByHx>;
export const hxNotSupportedResult = (msg: string): HxFallbackResult => {
    const extensions = {
        hxFallbackReason: HxFallbackReason.NotSupportedByHx,
        message: msg ?? '',
    };

    const err = new GraphQLError(
        extensions.message,
        null,
        null,
        null,
        null,
        null,
        extensions
    ) as Required<GraphQLError>;
    return err;
};
