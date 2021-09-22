import * as React from "react";

export abstract class KeywordGeneratorToolPageTableAbstract<P, S> extends React.Component<P, S> {
    protected abstract tableSettings;
    protected abstract tableApiUrl;
    protected abstract tableApiExcelUrl;
    protected abstract tableStorageKey;
    protected abstract dropdownAppendTo;
    protected abstract transformData;
    protected abstract groupsData;
}
