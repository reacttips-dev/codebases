/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const compare = require('semver-compare');
const semverValid = require('semver/functions/valid');
const ky = require('ky').default;

const Observable = require('o_0');

const API_KEY = '563e42ca2ae291effe766fbdaaf74200';

// eslint-disable-next-line func-names
module.exports = function(application) {
    const ajax = (url) => ky.get(url).json();
    const post = (url, data) => ky.post(url, {
        json: data
    }).json();
    const latestPackageResults = Observable([]);
    const latestDependencies = Observable({});

    // eslint-disable-next-line no-var
    var self = {
        isValidPackagesFileContent(content) {
            try {
                JSON.parse(content);
            } catch (err) {
                return false;
            }

            return true;
        },

        packageFile() {
            return application.fileByPath('package.json');
        },

        updatePackageLicense(licenseName) {
            // eslint-disable-next-line prefer-const
            let packageFile = application.fileByPath('package.json');
            if (!packageFile) {
                // if it doesn't exist, we don't update the license within it.
                return Promise.resolve();
            }
            const packageJson = JSON.parse(packageFile.content());
            packageJson.license = licenseName;
            const packageJsonString = JSON.stringify(packageJson, null, '  ');
            return application.writeToFile(packageFile, packageJsonString);
        },

        checkForPackages(packages) {
            return post(`https://libraries.io/api/check?api_key=${API_KEY}`, packages);
        },

        markCurrentVersionAndOutdated(result) {
            const currentVersion = latestDependencies()[result.name];

            if (currentVersion) {
                result.current_version = currentVersion;
                if (result.latest_stable_release_number) {
                    result.outdated = compare(result.current_version, result.latest_stable_release_number) === -1;
                }
            }

            return result;
        },

        outdatedPackages() {
            // eslint-disable-next-line no-unused-vars
            const dependencies = latestDependencies();

            return latestPackageResults.map(self.markCurrentVersionAndOutdated).filter((result) => result.outdated);
        },

        checkForPackageUpdates(file) {
            // eslint-disable-next-line func-names
            return Promise.resolve().then(function() {
                const content = file.content();

                const dependencies = self.parse(content);
                latestDependencies(dependencies);

                // Avoid non-npm dependencies (e.g. git URLs) by checking if the version
                // string is semver-compatible.
                const npmDependencies = [];
                for (const [name, versionString] of Object.entries(dependencies)) {
                    if (semverValid(versionString)) {
                        npmDependencies.push(name);
                    }
                }

                const packages = {
                    projects: npmDependencies.map((name) => ({
                        name,
                        platform: 'npm',
                    })),
                };

                return self.checkForPackages(packages).then(latestPackageResults);
            });
        },

        searchForPackages(query) {
            const MAX_RESULTS = 5;
            const platform = 'npm';
            const librariesIO = `https://libraries.io/api/search?q=${query}&platforms=${platform}&api_key=${API_KEY}&per_page=${MAX_RESULTS}`;

            return ajax(librariesIO).then((results) => results.map(self.markCurrentVersionAndOutdated));
        },

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        normalizeVersionNumber,

        // parse returns an object like:
        // {
        //   express: "4.12.4",
        //   underscore: "1.0.3",
        //   ...
        //  }
        parse(content) {
            const {
                dependencies
            } = JSON.parse(content);
            // eslint-disable-next-line no-return-assign, @typescript-eslint/no-use-before-define
            Object.keys(dependencies).forEach((key) => (dependencies[key] = normalizeVersionNumber(dependencies[key])));

            return dependencies;
        },

        add(packageJson, result) {
            const {
                name
            } = result;
            const versionNumber = result.latest_stable_release_number || result.latest_release_number;
            const version = `^${versionNumber}`;

            if (!('dependencies' in packageJson)) {
                packageJson.dependencies = {};
            }

            packageJson.dependencies[name] = version;

            const packageJsonString = JSON.stringify(packageJson, null, '  ');

            // Update dependencies after adding
            latestDependencies(self.parse(packageJsonString));

            return packageJsonString;
        },

        async addAndUpdatePackage(result, skipIfAlreadyExists) {
            let content;
            let packageFile = application.fileByPath('package.json');

            if (!packageFile) {
                content = JSON.stringify({
                    dependencies: {},
                    scripts: {
                        start: "ws --port 3000 --log.format combined --directory . --blacklist '/.env' '/.data' '/.git'",
                    },
                });

                packageFile = await application.newFile('package.json', content, false);
            }

            await application.ensureSession(packageFile);
            const packageJSON = JSON.parse(packageFile.content());
            if (!('dependencies' in packageJSON)) {
                packageJSON.dependencies = {};
            }

            const packageAlreadyExists = packageJSON.dependencies[result.name] != null;

            if (skipIfAlreadyExists && packageAlreadyExists) {
                return;
            }

            const packageJsonString = self.add(packageJSON, result);
            await application.writeToFile(packageFile, packageJsonString);
            // eslint-disable-next-line consistent-return
            return packageAlreadyExists;
        },
    };

    return self;
};

// eslint-disable-next-line no-var, vars-on-top, func-names
var normalizeVersionNumber = function(version, language = 'node') {
    if (language === 'node') {
        // '^1.2.3' to '1.2.3'
        return version.replace(/^\^/, '');
        // eslint-disable-next-line no-else-return
    } else {
        return version;
    }
};