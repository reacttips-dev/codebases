// The GITIGNORE_GLOBAL array is for things you don't want to appear in the editor (these files will still be accessible by querying the API/ot-server)
//
// If you update this file, you may also need to update:
//   - watcher/source/ot-storage.ts - for things which should never be accessible to the client even via the API/ot-server
//   - app-image/gitignore-global - for things which you want to exclude from being committed in our auto-commits
//   - scrub-volume.sh - for things which you want to exclude from remixes
module.exports = {
    ASSET_FILE_PATH: '.glitch-assets',
    APP_TYPE_CONFIG_FILE_PATH: '.glitchdotcom.json',
    access: {
        NONE: 0,
        MEMBER: 20,
        ADMIN: 30,
    },
    RESOURCE_USAGE_ERROR_THRESHOLD: 90,
    RESOURCE_USAGE_WARNING_THRESHOLD: 75,
    LINE_BREAK_REGEX: /\r\n|[\n\v\f\r\x85\u2028\u2029]/,
    GLITCH_PRO_COLLECTION_URLS: ['extra-memory', 'boosted-apps'],
    BOOSTED_APPS_COLLECTION_NAME: 'boosted-apps',
    GITIGNORE_GLOBAL: [
        '*.log',
        '*.pid',
        '*.pid.lock',
        '*.pyc',
        '*.save.*',
        '*.seed',
        '*.tgz',
        '.bash_history',
        '.bashrc',
        '.bundle',
        '.cache',
        '.cargo',
        '.config',
        '.data',
        '.env',
        '.eslintcache',
        '.glitch-meta',
        '.glitchdotcom.json',
        '.gomix-meta',
        '.grunt',
        '.local',
        '.lock-wscript',
        '.next',
        '.node-gyp',
        '.node_repl_history',
        '.npm',
        '.npmrc',
        '.nuget',
        '.nyc_output',
        '.profile',
        '.pnpm-modules',
        '.pnpm_node_modules',
        '.ssh',
        '.subversion',
        '.viminfo',
        '.yarn-integrity',
        'bower_components',
        'build/Release',
        'coverage',
        'jspm_packages',
        'lib-cov',
        'logs',
        'node_modules',
        'npm-debug.log*',
        'pnpm-debug.log*',
        'package-lock.json',
        'pids',
        'target',
        'typings',
        'yarn-debug.log*',
        'yarn-error.log*',
        // ignored on frontend only
        '.git-credentials',
        'shrinkwrap.yaml',
        '.config',
        // Temporary fix for not detecting binary files
        // "*.png"
        // "*.jpg"
        // "*.gif"
        // "*.ico"
        // "*.mp3"
        // "*.ogg"
        // "*.wav"
        '*.ttf',
        '*.eot',
        '*.woff',
        '*.sqlite3',
        '*.cur',
        '*.zip',
    ],
};