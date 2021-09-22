import {SyndicationSource} from "models";

export default (syndicationSource: SyndicationSource) =>
    !!syndicationSource && !!Object.keys(syndicationSource).length && !!syndicationSource.name;
