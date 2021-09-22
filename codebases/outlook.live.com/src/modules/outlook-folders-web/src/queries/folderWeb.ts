import type * as Schema from 'owa-graph-schema';
import { foldersWeb } from './foldersWeb';

/**
 * Web resolver responsible for fetching a folder
 */
export const folderWeb: Schema.ResolverFn<
    Schema.MailFolder,
    any,
    any,
    Schema.QueryFolderArgs
> = async (
    parent: any,
    args: Schema.QueryFolderArgs,
    context: Schema.ResolverContext,
    info: any
): Promise<Schema.MailFolder> => {
    const foldersArgs = {
        ids: [args.id],
        options: args.options,
    };
    const folders = await foldersWeb(parent, foldersArgs, context, info);
    return folders[0];
};
