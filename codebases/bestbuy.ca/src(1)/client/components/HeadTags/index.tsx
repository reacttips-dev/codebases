import * as React from "react";
import Helmet from "react-helmet";
import QueueItLoader from "../QueueItLoader";

export interface Props {
    title?: string;
    metaTags?: Meta[];
    links?: Link[];
    scripts?: Array<React.ScriptHTMLAttributes<HTMLScriptElement>>;
    isQueueItEnabled?: boolean;
    inlineScripts?: InlineScript[];
}

export interface Meta {
    name: string;
    content: string;
}

export interface Link {
    rel: string;
    href: string;
    type?: string;
    hrefLang?: string;
}

export interface InlineScript {
    key: string;
    value: object | string;
    type: string;
}

export class HeadTags extends React.Component<Props> {
    public render() {
        const metaTags = (this.props.metaTags || []).map((meta, index) => {
            return <meta {...meta} key={index} />;
        });

        const links = (this.props.links || []).map((link, index) => {
            return <link {...link} key={index} />;
        });

        const scripts = (this.props.scripts || []).map((script, index) => {
            return <script {...script} key={index} />;
        });

        const inlineScripts = (this.props.inlineScripts || []).map((script: InlineScript) => {
            return (
                <script type={script.type} id={script.key}>
                    {script.value}
                </script>
            );
        });

        return (
            <div>
                <Helmet>
                    {this.props.title && <title>{`${this.props.title} | Best Buy Canada`}</title>}
                    {links}
                    {metaTags}
                    {scripts}
                    {inlineScripts}
                </Helmet>
                {this.props.isQueueItEnabled && <QueueItLoader />}
            </div>
        );
    }
}

export default HeadTags;
