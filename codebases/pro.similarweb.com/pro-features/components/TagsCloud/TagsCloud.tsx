import * as React from "react";
import "../../../scripts/Vendor/jquery.awesomeCloud-0.2.js";

interface ITag {
    Name: string;
    Value: number;
}

interface ITagsCloudProps {
    tags: ITag[];
}

export class TagsCloud extends React.PureComponent<ITagsCloudProps, any> {
    private elementRef: React.RefObject<HTMLDivElement>;

    static defaultProps = {
        tags: [],
    };

    constructor(props) {
        super(props);
        this.elementRef = React.createRef();
    }

    componentDidMount() {
        this.applyAwsomeCloud();
    }

    componentDidUpdate(
        prevProps: Readonly<ITagsCloudProps>,
        prevState: Readonly<any>,
        snapshot?: any,
    ): void {
        if (this.props !== prevProps) {
            this.applyAwsomeCloud();
        }
    }

    render() {
        return (
            <div style={{ height: 200 }} ref={this.elementRef}>
                {this.renderTags()}
            </div>
        );
    }

    renderTags() {
        return this.props.tags.map((t, index) => {
            return (
                <li key={`tag-${index}`} data-weight={t.Value * 1000} value={t.Value}>
                    {t.Name}
                </li>
            );
        });
    }

    private applyAwsomeCloud = () => {
        const settings = {
            size: {
                grid: 3, // word spacing, smaller is more tightly packed
                factor: 0, // font resize factor, 0 means automatic
                normalize: false, // reduces outliers for more attractive output (NOTE: turned to false due to bug in their algo)
            },
            wordColor: function () {
                return "#2B3B67";
            },
            color: {
                start: "#CDE", // color of the smallest font, if options.color = "gradient""
                end: "#F52", // color of the largest font, if options.color = "gradient"
            },
            options: {
                color: "", // if "random-light" or "random-dark", color.start and color.end are ignored
                rotationRatio: 0, // 0 is all horizontal, 1 is all vertical
                printMultiplier: 1, // set to 3 for nice printer output; higher numbers take longer
                sort: "random", // "highest" to show big words first, "lowest" to do small words first, "random" to not care
            },
            font: "Roboto, sans-serif", // the CSS font-family string
            shape: "ellipse", // the selected shape keyword, or a theta function describing a shape
        };
        const $element: any = $(this.elementRef.current);
        $element.attr("id", new Date().getTime());
        $element.awesomeCloud(settings);
    };
}
