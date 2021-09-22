export function isOneOf(exceptionList: string[], errorMessage: string | undefined): boolean {
    return (
        !!errorMessage &&
        exceptionList.some(
            exception => errorMessage.toLowerCase().indexOf(exception.toLowerCase()) > -1
        )
    );
}
