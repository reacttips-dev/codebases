import { SOURCES_TEXT } from "components/widget/widget-types/Widget";
import * as _ from "lodash";
import DurationService from "services/DurationService";
import { PdfExportService } from "../services/PdfExportService";
import {
    DEFAULT_TITLE_HEIGHT,
    IPngExportService,
    L_SCREEN_OFFSET,
    M_SCREEN,
    PNG_WIDTH,
    S_SCREEN,
    S_SCREEN_OFFSET,
} from "./IPngExport";
/**
 * Created by Sahar.Rehani on 10/18/2016.
 */

export class WidgetExporter implements IPngExportService {
    protected _$clonedWidgetElement: any;
    protected _parentOverflowStyle: string;
    protected _$parent: any;
    protected pdfExporter = PdfExportService;

    constructor(
        protected userResource: any,
        protected $window: any,
        protected widget: any,
        protected _$widgetElement: any,
        protected $q: any,
        protected $timeout: any,
        protected chosenSites: any,
        protected $filter: any,
        protected exportOptions: any = {},
        protected utility: any,
    ) {}

    public export() {
        this.init();
        return this.getHTML()
            .then((html) => {
                const title = this.getFileName();
                const width = this.getWidth().toString();
                const height = this.getHeight().toString();
                this.pdfExporter.downloadHtmlPngFedService(html, title, width, height).then(
                    (status) => {
                        this.dispose();
                        return status;
                    },
                    (err) => {
                        this.dispose();
                    },
                );
            })
            .then(() => true);
    }

    protected init() {
        this._$parent = this._$widgetElement.parent();
        this._parentOverflowStyle = this._$parent.css("overflow");
        this.lockParentHeight();
        // set original widget to a fixed width of a PNG file
        this._$widgetElement.css("width", this.exportOptions.pngWidth || PNG_WIDTH);
        this._$widgetElement.find(".chartContainer").children(":first").highcharts().reflow();
        // copy the original widget after the "resize" (in order to send it to the png server)
        this._$clonedWidgetElement = this._$widgetElement.clone();
        // hide it & append it to the dom
        this._$clonedWidgetElement.hide();
        $("body").append(this._$clonedWidgetElement);
        // revert the changes of the original widget to it's original state
        this._$widgetElement.css("width", "");
        this._$widgetElement.find(".chartContainer").children(":first").highcharts().reflow();
    }

    protected lockParentHeight() {
        this._$parent.css({ overflow: "hidden", "max-height": this._$parent.outerHeight() });
    }

    protected getHeight() {
        const offset =
            $(document).width() >= M_SCREEN
                ? L_SCREEN_OFFSET
                : $(document).width() <= S_SCREEN
                ? S_SCREEN_OFFSET
                : 0;
        return DEFAULT_TITLE_HEIGHT + offset + this._$clonedWidgetElement.outerHeight();
    }

    protected getWidth() {
        return this.exportOptions.pngWidth &&
            Number.isInteger(parseInt(this.exportOptions.pngWidth))
            ? this.exportOptions.pngWidth
            : PNG_WIDTH;
    }

    protected getHTML() {
        return this.$q.all([this.getBody(), this.getStyleSheet()]).then(([body, styles]) => {
            return `<meta charset='UTF-8' />
                  <base href='${window.location.origin}'/>
                  ${styles.join("\n")}
                  <body class='widget-png'>${body}</body>`;
        });
    }

    protected getFileName() {
        const duration = DurationService.getDurationData(this.widget._params.duration).forAPI;
        return `${this.widget._viewData.title.trim().replace(/[\s\.:,]/g, "_")} (${
            duration.from + "_" + duration.to
        })`;
    }

    protected getBody() {
        return this.$q
            .all([this.getTitleHTML(), this.getWidgetHTML()])
            .then(([titleHTML, widgetHTML]) => {
                return `
                    <div>
                        ${titleHTML}
                        ${widgetHTML}
                    </div>
            `;
            });
    }

    protected getTitleHTML() {
        const { viewData, webSource } = this.widget;
        const source = SOURCES_TEXT.websites[webSource];
        const duration = viewData.duration;
        const country = viewData.country.text;

        return this.$q.resolve(`
            <div style="padding: 21px 24px; margin-bottom: 12px; border-bottom: 1px solid #e4e4e4; color: #2b3d52; font-family: 'Roboto', Tahoma, sans-serif;">
                <span style="font-size: 35px;">${viewData.title}</span>
                <span style="font-size: 18px; padding-left: 24px;">
                    ${duration ? duration : ""} ${country ? " | " + country : ""} ${
            source ? " | " + source : ""
        }
                </span>
            </div>
        `);
    }

    protected getWidgetHTML() {
        // another clone so that the it won't show on the UI, yet the server gets the clone with a visible: true css
        const htmlStringElement = this._$clonedWidgetElement.clone();
        htmlStringElement.show();
        const parentsHtmlArray = $(this._$widgetElement.parent())
            .parentsUntil("[ui-view]")
            .map((i, e) => {
                const cl = e.cloneNode();
                const el = $(cl).empty();
                $(el).text("@@@");
                const tmp: string = el[0].outerHTML;
                return tmp;
            })
            .toArray();
        const res = (parentsHtmlArray as any[])
            .reduce((prev, current) => current.replace("@@@", prev))
            .replace("@@@", htmlStringElement[0].outerHTML);
        return Promise.resolve(res);
    }

    protected getStyleSheet() {
        return this.$q.resolve(this.pdfExporter.getStylesheets());
    }

    private dispose() {
        this._$clonedWidgetElement.remove();
        this._$parent.css({ overflow: this._parentOverflowStyle, "max-height": "none" });
    }
}
