export default function isFileDotenv(file) {
    if (!file) {
        return false;
    }

    return file.path() === '.env';
}