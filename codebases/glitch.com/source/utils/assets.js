/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */

const randomColor = require('randomcolor');

const {
    randomId,
    cdnURL,
    blobToImage,
    isTextFile
} = require('../util');

/* istanbul ignore next */
function assets() {
    const MAX = 330; // 1.5x display size for retina
    const MAX_THUMBNAIL = 210;

    // IMAGES

    // eslint-disable-next-line func-names
    const drawCanvasThumbnail = function(image, type) {
        let {
            width,
            height
        } = image;
        const quality = 0.92;
        let sourceCanvas = document.createElement('canvas');
        sourceCanvas.width = width;
        sourceCanvas.height = height;
        const sourceContext = sourceCanvas.getContext('2d');
        sourceContext.drawImage(image, 0, 0, width, height);

        // in case it nevers go through the loop
        let targetCanvas = sourceCanvas;

        /*
        Halves the width/height and draws a new image until it reaches
        the final size. It loops by waiting for the onload to fire on the updated
        image and exits as soon as the new width/height are less than or equal to the
        final size.
        */
        while (width > MAX || height > MAX) {
            width /= 2;
            height /= 2;
            if (width < MAX && height < MAX) {
                const ratio = 330 / Math.max(width, height);
                width = Math.ceil(width * ratio);
                height = Math.ceil(height * ratio);
            }
            targetCanvas = document.createElement('canvas');
            const targetContext = targetCanvas.getContext('2d');

            targetCanvas.width = width;
            targetCanvas.height = height;
            targetContext.drawImage(sourceCanvas, 0, 0, width, height);
            sourceCanvas = targetCanvas;
        }

        // eslint-disable-next-line func-names, no-unused-vars
        return new Promise(function(resolve, reject) {
            return targetCanvas.toBlob(
                // eslint-disable-next-line func-names
                function(blob) {
                    blob.width = width;
                    blob.height = height;
                    return resolve(blob);
                },
                type,
                quality,
            );
        });
    };

    // Takes an HTML5 File and returns a promise for an HTML5 Blob that is fulfilled
    // with a thumbnail for the image. If the image is small enough the original
    // blob is returned. Width and height metadata are added to the blob.
    const createThumbnail = (file) =>
        // eslint-disable-next-line func-names
        blobToImage(file).then(function(image) {
            file.width = image.width;
            file.height = image.height;

            if (image.width < MAX && image.height < MAX) {
                return file;
                // eslint-disable-next-line no-else-return
            } else {
                return drawCanvasThumbnail(image, file.type);
            }
        });
    // OTHERS

    // eslint-disable-next-line func-names
    const createRandomThumbnail = function() {
        const canvas = document.createElement('canvas');
        canvas.width = MAX_THUMBNAIL;
        canvas.height = MAX_THUMBNAIL;
        const center = canvas.width / 2;
        const top = 0;
        const left = 0;
        const right = MAX_THUMBNAIL;
        const bottom = MAX_THUMBNAIL;
        const randomColors = randomColor({
            count: 6,
            format: 'rgb',
        });
        const colors = [];
        // eslint-disable-next-line prefer-const
        for (let color of randomColors) {
            colors.push(color.replace(')', ', 0.60)').replace('rgb', 'rgba'));
        }
        const context = canvas.getContext('2d');

        context.globalComposition = 'multiply';
        // background rect
        // eslint-disable-next-line prefer-destructuring
        context.fillStyle = colors[0];
        context.fillRect(0, 0, MAX_THUMBNAIL, MAX_THUMBNAIL);
        // circle
        context.beginPath();
        // eslint-disable-next-line prefer-destructuring
        context.fillStyle = colors[1];
        const radius = canvas.width / 2;
        context.arc(center, center, radius, 0, 2 * Math.PI, false);
        context.fill();
        context.closePath();
        // diamond
        context.beginPath();
        // eslint-disable-next-line prefer-destructuring
        context.fillStyle = colors[2];
        context.moveTo(left, center);
        context.lineTo(center, top);
        context.lineTo(right, center);
        context.lineTo(center, bottom);
        context.fill();
        context.closePath();
        // inner rect
        // eslint-disable-next-line prefer-destructuring
        context.fillStyle = colors[3];
        context.fillRect(center / 2, center / 2, center, center);
        // TODO: create random shape variations, based on file type or w type badge

        // eslint-disable-next-line func-names, no-unused-vars
        return new Promise(function(resolve, reject) {
            // eslint-disable-next-line func-names
            return canvas.toBlob(function(blob) {
                blob.width = MAX_THUMBNAIL;
                blob.height = MAX_THUMBNAIL;
                return resolve(blob);
            });
        });
    };

    // eslint-disable-next-line func-names
    const AssetData = function(file, url, thumbnail, thumbnailUrl) {
        if (thumbnail == null) {
            thumbnail = file;
        }
        if (thumbnailUrl == null) {
            thumbnailUrl = url;
        }

        return {
            name: file.name,
            date: new Date(),
            url: cdnURL(url),
            type: file.type,
            size: file.size,
            imageWidth: file.width,
            imageHeight: file.height,
            thumbnail: cdnURL(thumbnailUrl),
            thumbnailWidth: thumbnail.width,
            thumbnailHeight: thumbnail.height,
        };
    };

    // eslint-disable-next-line func-names
    return function(application) {
        // Returns a promise fulfilled with asset data
        let self;
        const processImage = (file) =>
            createThumbnail(file).then((thumbnail) =>
                // eslint-disable-next-line func-names, no-unused-vars
                blobToImage(thumbnail).then(function(thumbnailImage) {
                    if (thumbnail === file) {
                        return application.uploadAsset(file).then((fileUrl) => AssetData(file, fileUrl, null, null));
                        // eslint-disable-next-line no-else-return
                    } else {
                        thumbnail.name = `thumbnails/${file.name}`;
                        // eslint-disable-next-line func-names
                        return Promise.all([application.uploadAsset(file, true), application.uploadAsset(thumbnail)]).then(function(...args) {
                            const [fileUrl, thumbnailUrl] = Array.from(args[0]);
                            return AssetData(file, fileUrl, thumbnail, thumbnailUrl);
                        });
                    }
                }),
            );
        const processOther = (file) =>
            // eslint-disable-next-line func-names
            createRandomThumbnail().then(function(thumbnail) {
                thumbnail.name = `thumbnails/${file.name}`;
                // eslint-disable-next-line func-names
                return Promise.all([application.uploadAsset(file, true), application.uploadAsset(thumbnail)]).then(function(...args) {
                    const [fileUrl, thumbnailUrl] = Array.from(args[0]);
                    return AssetData(file, fileUrl, thumbnail, thumbnailUrl);
                });
            });

        function removeDuplicates(file) {
            const duplicateAsset = application.assets().find((asset) => asset.name === file.name);
            if (duplicateAsset) {
                application.deleteAsset(duplicateAsset);
            }
        }

        // eslint-disable-next-line no-return-assign
        return (self = {
            addAssetFile(file) {
                const uuid = randomId();
                const fileType = file.type;

                return (
                    (fileType.match(/(image)/) ? processImage(file) : processOther(file))
                    // eslint-disable-next-line func-names
                    // eslint-disable-next-line consistent-return
                    .then(function(assetData) {
                        // https://app.clubhouse.io/glitch/story/23857/prevent-users-from-uploading-html-files-to-glitch-assets-cdn
                        // We want to prevent .html files from being uploaded
                        if (file.type === 'text/html') {
                            application.notifyUploadFailure(true);
                            return false;
                        }
                        removeDuplicates(file);
                        assetData.uuid = uuid;
                        application.newAsset(assetData);
                        application.jiggleAssetFiletreeEntry(true);
                        application.analytics.track('Asset Uploaded', {
                            fileType: file.type
                        });
                    })
                    // eslint-disable-next-line func-names
                    .catch(function(error) {
                        application.notifyUploadFailure(true);
                        throw error;
                    })
                );
            },

            addFile(file) {
                // eslint-disable-next-line func-names
                return new Promise(function(resolve, reject) {
                    // We have to do a setTimeout because if we prompt in the middle of resolving a paste event
                    // it fires twice https://bugs.chromium.org/p/chromium/issues/detail?id=299805
                    // eslint-disable-next-line func-names
                    setTimeout(function() {
                        // Prompt for a filename if one doesn't exist
                        if (file.name === undefined) {
                            const name = window.prompt('Please enter a name for your file', 'newfile.png');

                            if (name) {
                                file = new File([file], name, {
                                    type: file.type,
                                    lastModified: file.lastModified
                                });
                            } else {
                                throw new Error('You must name the file.');
                            }
                        }

                        if (isTextFile(file)) {
                            application.uploadNewFile(file).then(resolve, reject);
                        } else {
                            // Makes sure asset session is initialized
                            application
                                .showAssets()
                                .then(() => self.addAssetFile(file))
                                .then(resolve, reject);
                        }
                    }, 0);
                });
            },

            createRandomThumbnail,
            drawCanvasThumbnail,
            isTextFile,
            createThumbnail,
        });
    };
}

module.exports = assets();