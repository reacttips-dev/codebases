let nextId = 0;

// Creates a unique ID for each LazyImport
export default function createImportId() {
    return (nextId++).toString();
}
