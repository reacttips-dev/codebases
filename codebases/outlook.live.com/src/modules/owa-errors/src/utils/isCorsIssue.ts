export default function isCorsIssue(message: string): boolean {
    return /^Script error\.?\s*$|^Javascript error: Script error\.? on line 0$/i.test(message);
}
