export default function getExtensionFromFileName(fileName: string): string | null {
    if (!fileName) {
        return null;
    }

    const start: number = fileName.lastIndexOf('.');
    if (start > 0) {
        return fileName.substr(start).toLowerCase();
    }

    return null;
}

export function getExtensionWithoutDotFromFileName(fileName: string): string | null {
    const extension = getExtensionFromFileName(fileName);
    return extension ? extension.replace('.', '') : null;
}

// getExtensionWithoutDotFromFileName will log everything that comes after the dot, which becomes a PII leak if users create weird file names.
// They don't do that often enough to affect the data, but they do it often enough to be a risk to GDPR compliance.
export function getExtensionWithoutDotFromFileNameForLogging(fileName: string): string {
    return getExtensionWithoutDotFromFileName(fileName)?.substring(0, 4) || '';
}
