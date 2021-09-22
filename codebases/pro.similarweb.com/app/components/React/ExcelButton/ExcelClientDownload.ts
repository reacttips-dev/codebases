import contentDisposition from "content-disposition";

export type ExcelClientDownloadType = (
    url: string,
    body?: any,
) => Promise<{ success: boolean; error?: any }>;

export default async (url: string, body?: any): Promise<{ success: boolean; error?: any }> => {
    try {
        const response = body
            ? await fetch(url, {
                  method: "POST",
                  body: JSON.stringify(body),
                  headers: {
                      "content-type": "application/json",
                  },
              })
            : await fetch(url);
        const { parameters } = contentDisposition.parse(
            response.headers.get("Content-Disposition"),
        );
        const filename = parameters.filename;
        const csvFile = await response.blob();
        const blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
        if (navigator.msSaveBlob) {
            // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            const link = document.createElement("a");
            if (link.download !== undefined) {
                // feature detection
                // Browsers that support HTML5 download attribute
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
        return { success: true };
    } catch (e) {
        return {
            success: false,
            error: e,
        };
    }
};
