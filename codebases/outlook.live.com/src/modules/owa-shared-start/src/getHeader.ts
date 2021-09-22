export default function getHeader(response: Response | undefined, headerKey: string) {
    return response?.headers && response.headers.get(headerKey);
}
