import sanitizeHtmlOperation from 'owa-service/lib/operation/sanitizeHtmlOperation';

export default function sanitizeHtml(input: string): Promise<string> {
    return sanitizeHtmlOperation({ input }).catch(onServiceError);
}

function onServiceError() {
    return null;
}
