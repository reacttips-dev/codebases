export interface Node {
    key: string;
    value: string;
    next: this;
    prev: this;
}

export class LRU {
    private size: number;
    private limit: number;
    private head: Node;
    private tail: Node;
    private cacheMap: Map<string, Node>;

    constructor(limit = 20) {
        this.limit = limit;
        this.size = 0;
        this.head = null;
        this.tail = null;
        this.cacheMap = new Map();
    }

    put(key, value) {
        const existingNode = this.cacheMap.get(key);
        if (existingNode) {
            this.detach(existingNode);
            this.size--;
        } else if (this.size === this.limit) {
            this.cacheMap.delete(this.tail.key);
            this.detach(this.tail);
            this.size--;
        }

        // Write to head of LinkedList
        if (!this.head) {
            this.head = this.tail = {
                key,
                value,
                next: null,
                prev: null,
            };
        } else {
            const node: Node = {
                key,
                value,
                next: this.head,
                prev: null,
            };
            this.head.prev = node;
            this.head = node;
        }

        this.cacheMap.set(key, this.head);
        this.size++;
    }

    get(key: string) {
        const existingNode = this.cacheMap.get(key);
        if (existingNode) {
            const value = existingNode.value;

            if (this.head !== existingNode) {
                this.put(key, value);
            }
            return value;
        }

        console.log(`Cache item missed - key ${key}`);
    }

    detach(node: Node) {
        if (node.prev !== null) {
            node.prev.next = node.next;
        } else {
            this.head = node.next;
        }

        if (node.next !== null) {
            node.next.prev = node.prev;
        } else {
            this.tail = node.prev;
        }
    }

    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.cacheMap = new Map();
    }

    forEach(fn) {
        let node = this.head;
        let counter = 0;
        while (node) {
            fn(node, counter);
            node = node.next;
            counter++;
        }
    }

    *[Symbol.iterator]() {
        let node = this.head;
        while (node) {
            yield node;
            node = node.next;
        }
    }
}
