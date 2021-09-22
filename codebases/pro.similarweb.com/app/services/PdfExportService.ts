import { DefaultFetchService } from "./fetchService";
import { i18nFilter } from "../filters/ngFilters";
import dayjs from "dayjs";
import { Injector } from "../../scripts/common/ioc/Injector";
import pako from "pako";
import { UserResource } from "user-data/UserResource";

export interface IDownloadOptions {
    pdfType: string; //the name of the folder in PDF internals project
    domain?: string;
    link_text?: string;
    country?: string;
    duration?: string;
}

const fedServiceUrl = "https://pdf.similarweb.com";
const pdfFedServiceUrl = process.env.NODE_ENV === "development" ? "/download_pdf" : fedServiceUrl;
const htmlPdfFedServiceUrl =
    process.env.NODE_ENV === "development" ? "http://localhost:8081" : fedServiceUrl;

export class PdfExportService {
    private static _html: string;

    /**
     * Creates html markup with given body and assigns it to _html
     * @param body
     */
    static setHTML(body, className = "pdf-version"): void {
        const pdf = PdfExportService;
        pdf._html = PdfExportService.getHTMLTop();

        //Append stylesheets
        pdf.getStylesheets().forEach(function (styleSheet) {
            pdf._html += styleSheet;
        });
        //Add Korean fonts support.
        pdf._html +=
            "<style>@import url(//fonts.googleapis.com/earlyaccess/jejugothic.css);</style>";
        //Close head tag.
        pdf._html += "</head>";
        //Append body with .pdf-version
        pdf._html += `<body class=${className}>`;
        //Append body
        pdf._html += body;
        //Close body and html tags
        pdf._html += "</div></body></html>";
    }

    static getHTMLTop() {
        let html = "<!DOCTYPE html><html><head><meta charset='UTF-8'>";
        //Append base url for public assets
        html += "<base href='" + window.location.origin + "'>";

        return html;
    }

    /**
     * Sends _html and title to server in order to receive PDF file after conversion
     * @param title
     * @returns {angular.IPromise<IResourceArray<T>>|angular.IPromise<Array<T>>|angular.IPromise<T>}
     */
    static downloadPDF(title: string, options: IDownloadOptions): Promise<any> {
        const htmlBlob = new Blob([PdfExportService._html], { type: "text/html" });
        const pdfOptions = {
            HtmlString: htmlBlob,
            Title: encodeURIComponent(title),
            Type: options.pdfType,
        };
        const optionalProperties = [
            "domainKey",
            "domain",
            "domains",
            "link",
            "country",
            "duration",
        ];
        optionalProperties.forEach((property) => {
            if (options.hasOwnProperty(property)) {
                if (property === "domains") {
                    pdfOptions[PdfExportService.capitalizeFirstLetter(property)] = JSON.stringify(
                        options[property],
                    );
                } else {
                    pdfOptions[PdfExportService.capitalizeFirstLetter(property)] =
                        options[property];
                }
            }
        });

        return UserResource.htmlToPdf(pdfOptions);
    }

    static capitalizeFirstLetter(input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    }

    /**
     * Returns the main.css and vendor.css bundles
     * @returns {[string,string]}
     */
    static getStylesheets() {
        const styledComponents = Array.from(document.querySelectorAll("style[data-styled]")).map(
            (node) => {
                return node.outerHTML;
            },
        );
        return [
            document.querySelector('link[class="css-to-upload"]').outerHTML,
            ...Array.from(document.querySelectorAll('link[href*=".style.css"]')).map(
                (link) => link.outerHTML,
            ),
            ...styledComponents,
        ];
    }
    static downloadPdfFedService(linkKey: string, titleKey: string): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            const swNavigator = Injector.get("swNavigator") as any;
            const params = swNavigator.getParams();
            const fetchService = DefaultFetchService.getInstance() as any;
            const translate = i18nFilter();

            fetchService
                .post(
                    pdfFedServiceUrl,
                    {
                        page: swNavigator.getStateUrl(swNavigator.current(), params),
                        link: translate(linkKey),
                        title: translate(titleKey),
                        date: dayjs().format("MMMM YYYY"),
                        domains: params.key,
                        keyword: params.keyword,
                        country: params.country,
                        duration: params.duration,
                    },
                    {
                        headers: {},
                        credentials: "include",
                    },
                )
                .then(
                    (res) => {
                        PdfExportService.downloadFileLocal(res.Data);
                        resolve();
                    },
                    (err) => {
                        reject(err);
                    },
                );
        });
    }
    static downloadHtmlPdfFedService(title: string, domains = ""): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            const translate = i18nFilter();
            const htmlBlob = new Blob([pako.deflate(PdfExportService._html)], {
                type: "application/zlib",
            });
            const formData = new FormData();
            formData.append("title", encodeURIComponent(title));
            formData.append("date", dayjs().format("MMMM YYYY"));
            formData.append("domains", domains);
            formData.append("link", translate("wwo.report.link"));
            formData.append("htmlBlob", htmlBlob);

            fetch(`${htmlPdfFedServiceUrl}/savePdf`, {
                method: "POST",
                body: formData,
            }).then(
                async (response) => {
                    const result = await response.json();
                    PdfExportService.downloadFileLocal(result.Data);
                    resolve();
                },
                (err) => {
                    reject(err);
                },
            );
        });
    }

    static downloadHtmlPngFedService(html, title, width, height): Promise<any> {
        return new Promise((resolve, reject) => {
            const htmlBlob = new Blob([html], { type: "text/html" });
            const formData = new FormData();
            formData.append("title", title);
            formData.append("width", width);
            formData.append("height", height);
            formData.append("htmlBlob", htmlBlob);

            fetch(`${htmlPdfFedServiceUrl}/savePng`, {
                method: "POST",
                body: formData,
            }).then(
                async (response) => {
                    const result = await response.json();
                    PdfExportService.downloadFileLocal(result.Data);
                    resolve(response.status);
                },
                (err) => {
                    reject(err);
                },
            );
        });
    }

    static downloadFileLocal(data): void {
        window.location = data;
    }
}
