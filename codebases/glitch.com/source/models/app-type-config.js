import Observable from 'o_0';
import {
    APP_TYPE_CONFIG_FILE_PATH
} from '../const';

const defaultConfig = {
    appType: 'static',
    buildDirectory: ''
};

export default function AppTypeModel(I, self) {
    function updateConfigData(session) {
        try {
            const text = session.getValue();
            self.appTypeConfig(JSON.parse(text));
        } catch (e) {
            console.error(e);
            self.appTypeConfig(defaultConfig);
        }
    }

    async function getConfigFile() {
        let configFile = self.fileByPath(APP_TYPE_CONFIG_FILE_PATH);

        if (!configFile) {
            configFile = await self.newFile(APP_TYPE_CONFIG_FILE_PATH, JSON.stringify(defaultConfig));
        }
        return configFile;
    }

    const ensureConfigSession = (appTypeConfigFile) =>
        self.ensureSession(appTypeConfigFile).then((session) => {
            self.editor().swapDoc(session);

            if (appTypeConfigFile.assetsListener) {
                return session;
            }

            appTypeConfigFile.assetsListener = session;

            const updateData = () => updateConfigData(session);

            session.on('change', updateData);

            updateData();

            return session;
        });

    self.extend({
        appTypeConfig: Observable(defaultConfig),
        async updateAppTypeConfig(nextConfig) {
            // set local state
            self.appTypeConfig(nextConfig);
            // save to file
            const file = await getConfigFile();
            self.writeToFile(file, JSON.stringify(nextConfig));
            // TODO: POST to command server to update it there
        },
        async appTypeConfigSession() {
            const configFile = await getConfigFile();
            return ensureConfigSession(configFile);
        },
    });
}