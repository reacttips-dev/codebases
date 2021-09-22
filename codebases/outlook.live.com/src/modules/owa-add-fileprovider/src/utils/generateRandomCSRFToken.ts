export default function generateRandomCSRFToken(): string {
    const alphanumerics = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split(
        ''
    );
    const alphanumericsMaxIndex = alphanumerics.length - 1;
    const randomToken = [];
    for (let i = 0; i < 16; i++) {
        randomToken.push(alphanumerics[Math.round(Math.random() * alphanumericsMaxIndex)]);
    }

    return 'owa_csrf_token_' + randomToken.join('');
}
