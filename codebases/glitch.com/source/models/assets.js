/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Observable = require('o_0');
const S3Uploader = require('../s3-uploader');

const {
    ASSET_FILE_PATH
} = require('../const');

// eslint-disable-next-line func-names
module.exports = function(I, self) {
    // eslint-disable-next-line func-names
    const updateAssetData = function(session) {
        const assetData = session
            .getValue()
            .split('\n')
            // eslint-disable-next-line consistent-return, func-names, array-callback-return
            .map(function(line) {
                try {
                    return JSON.parse(line);
                    // eslint-disable-next-line no-empty
                } catch (error) {}
            })
            .filter((data) => data != null);

        return self.assets(self.parseAssets(assetData));
    };

    const ensureAssetSession = (assetsFile) =>
        // eslint-disable-next-line func-names
        self.ensureSession(assetsFile).then(function(session) {
            self.editor().swapDoc(session);

            if (assetsFile.assetsListener) {
                return session;
            }

            assetsFile.assetsListener = session;

            const updateAssetDataFromSession = () => updateAssetData(session);

            session.on('change', updateAssetDataFromSession);

            updateAssetDataFromSession();

            return session;
        });
    return self.extend({
        async assetSession() {
            let assetsFile = self.fileByPath(ASSET_FILE_PATH);

            if (!assetsFile) {
                assetsFile = await self.newFile(ASSET_FILE_PATH);
            }

            return ensureAssetSession(assetsFile);
        },

        parseAssets(assetData) {
            const assets = {};

            // eslint-disable-next-line func-names
            assetData.forEach(function(datum) {
                const id = datum.uuid;

                if (datum.deleted) {
                    return delete assets[id];
                    // eslint-disable-next-line no-else-return
                } else {
                    // eslint-disable-next-line no-return-assign
                    return (assets[id] = datum);
                }
            });

            return Object.keys(assets).map((key) => assets[key]);
        },

        newAsset(assetData) {
            // eslint-disable-next-line func-names
            return self.showAssets().then(function(session) {
                const position = {
                    line: session.lastLine(),
                    ch: 0,
                };

                // eslint-disable-next-line prefer-template
                return session.replaceRange(JSON.stringify(assetData) + '\n', position);
            });
        },

        deleteAsset(assetData) {
            // eslint-disable-next-line func-names
            return self.showAssets().then(function(session) {
                const position = {
                    line: session.lastLine(),
                    ch: 0,
                };

                const deleteEvent = {
                    uuid: assetData.uuid,
                    deleted: true,
                };

                // eslint-disable-next-line prefer-template
                return session.replaceRange(JSON.stringify(deleteEvent) + '\n', position);
            });
        },

        generateUploadProgressEventHandler(uploadData) {
            // eslint-disable-next-line func-names
            return function({
                lengthComputable,
                loaded,
                total
            }) {
                if (lengthComputable) {
                    return uploadData.ratio(loaded / total);
                    // eslint-disable-next-line no-else-return
                } else {
                    // Fake progress with each event: 0, 0.5, 0.75, 0.875, ...
                    return uploadData.ratio((1 + uploadData.ratio()) / 2);
                }
            };
        },

        // Returns a promise that will be fulfilled with the url of the uploaded
        // asset or rejected with an error.
        uploadAsset(file, isUploadedByUser = false) {
            const uploadData = {
                ratio: Observable(0),
                isUploadedByUser
            };

            self.pendingUploads.push(uploadData);

            return (
                self
                .getPolicy()
                .then((policy) =>
                    S3Uploader(policy).upload({
                            key: file.name,
                            blob: file,
                        },
                        self.generateUploadProgressEventHandler(uploadData),
                    ),
                )
                .catch((error) => {
                    console.error(error);
                })
                // eslint-disable-next-line func-names
                .finally(function() {
                    self.pendingUploads.remove(uploadData);
                    self.currentProject().updatedAt(new Date().toISOString());
                    return self.touchProject();
                })
            );
        },

        // Returns a promise that will be fulfilled with the url of the uploaded
        // project asset or rejected with an error.
        uploadProjectAvatarAsset(file, project) {
            /* istanbul ignore else */
            if (project == null) {
                project = self.currentProject();
            }

            const url = URL.createObjectURL(file);
            /* istanbul ignore else */

            if (project != null) {
                project.temporaryAvatar(url);
            }

            const uploadData = {
                ratio: Observable(0)
            };

            self.pendingUploads.push(uploadData);

            return (
                self
                .getProjectAvatarPolicy(project)
                .then((policy) =>
                    S3Uploader(policy).upload({
                            key: '',
                            blob: file,
                            cacheControl: 60,
                        },
                        self.generateUploadProgressEventHandler(uploadData),
                    ),
                )
                // eslint-disable-next-line func-names, no-shadow
                .then(function(url) {
                    project.avatarUpdatedAt(new Date().toISOString());
                    project.save(self.glitchApi());

                    return url;
                })
                // eslint-disable-next-line no-shadow, no-unused-vars
                .finally((url) => self.pendingUploads.remove(uploadData))
            );
        },
    });
};