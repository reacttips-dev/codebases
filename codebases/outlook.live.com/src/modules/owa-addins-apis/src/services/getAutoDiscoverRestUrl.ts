export default function getAutoDiscoverRestUrl(smtpAddress: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        if (smtpAddress) {
            const autodiscoverUrl =
                'https://outlook.office365.com/autodiscover/autodiscover.json/v1.0/' +
                smtpAddress +
                '?Protocol=REST';
            const request = new XMLHttpRequest();
            request.open('GET', autodiscoverUrl);

            request.onload = function () {
                if (request.status === 200) {
                    const restUrl = JSON.parse(this.response).Url;
                    resolve(restUrl);
                } else {
                    reject(
                        new Error(
                            'Request failed with status ' +
                                request.status +
                                '. Message: ' +
                                request.responseText
                        )
                    );
                }
            };
            request.send();
        } else {
            reject(new Error('smtpAddress is null or empty'));
        }
    });
}
