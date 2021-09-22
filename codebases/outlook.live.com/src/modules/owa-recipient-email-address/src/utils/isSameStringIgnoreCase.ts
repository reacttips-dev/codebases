export default function isSameStringIgnoreCase(str1: string, str2: string): boolean {
    return str1 == str2 || (str1 && str2 && str1.toLowerCase() == str2.toLowerCase());
}
