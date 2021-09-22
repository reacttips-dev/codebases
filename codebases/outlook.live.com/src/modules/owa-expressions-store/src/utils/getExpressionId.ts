let nextExpressionId = 0;

// Create ID to support multiple instances of expression panes
export default function getExpressionId(): string {
    return (nextExpressionId++).toString();
}
