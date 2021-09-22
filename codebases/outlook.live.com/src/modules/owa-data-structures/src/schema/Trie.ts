import type PrefixMap from './PrefixMap';

// A private node in the trie, indexed by a string
class TrieNode<I> {
    private suffixes: { [key: string]: TrieNode<I> }; // [key: string]: TrieNode
    private data: I[];

    constructor() {
        this.suffixes = {};
        this.data = [];
    }

    /**
     * @return if the trie was changed by this operation
     **/
    addData(dataToAdd: I): boolean {
        if (this.data.indexOf(dataToAdd) !== -1) {
            return false;
        }
        this.data.push(dataToAdd);
        return true;
    }

    getData(): I[] {
        return [...this.data];
    }

    /**
     * @return if the trie was changed by this operation
     **/
    removeData(data: I): boolean {
        const index = this.data.indexOf(data);
        if (index === -1) {
            return false;
        }
        this.data.splice(index, 1);
        return true;
    }

    addSuffix(letter: string): TrieNode<I> {
        // If suffix not already in tree, add it
        if (!this.suffixes[letter]) {
            this.suffixes[letter] = new TrieNode<I>();
        }
        return this.suffixes[letter];
    }

    removeSuffix(letter: string): void {
        delete this.suffixes[letter];
    }

    // Gets the suffix indexed by a given letter, null if non existent
    getSuffix(letter: string): TrieNode<I> {
        return this.suffixes[letter];
    }

    getSuffixes(): { [key: string]: TrieNode<I> } {
        return { ...this.suffixes };
    }

    // Fetches data related to every substring of the current trie node
    getAllSubstringData(): I[] {
        let data: I[] = this.getData();
        let keys = Object.keys(this.getSuffixes());

        // Over every suffix letter after this one
        for (let n = 0; n < keys.length; n++) {
            // Recursively fetch data down the tree
            let node = this.getSuffixes()[keys[n]];
            let substringData = node.getAllSubstringData();

            // And merge all points together
            for (let i = 0; i < substringData.length; i++) {
                if (data.indexOf(substringData[i]) === -1) {
                    data.push(substringData[i]);
                }
            }
        }
        return data;
    }
}

/**
 * PrefixMap where words are stored in a Trie with matching data (I)
 * at each endpoint, ie. C -> U -> T (✂) -> E (💟).
 */
export default class Trie<I> implements PrefixMap<I> {
    // array representing beginning of words in the trie
    private root: TrieNode<I>;
    constructor() {
        this.root = new TrieNode();
    }

    /**
     * @return if the trie was changed by this operation
     */
    addWordAndData(keyword: string, data: I): boolean {
        let index = 0;
        let node = this.root;

        // fetches TrieNode for each letter in keyword
        while (index < keyword.length) {
            let letter = keyword[index];
            node = node.addSuffix(letter);
            index++;
        }

        // and adds data to the last node (where the word ends)
        return node.addData(data);
    }

    private getNodeAndPathForKeyword(keyword: string): [TrieNode<I>, TrieNode<I>[]] {
        let index = 0;
        let node = this.root;
        let nodePath = [node];

        // Insert each letter in keyword into appropriate place in trie
        while (index < keyword.length) {
            let letter = keyword[index];
            node = node.getSuffix(letter.toString());
            nodePath.push(node);
            index++;
            if (node == null) {
                break;
            }
        }
        return [node, nodePath];
    }

    getDataForWord(keyword: string, exactDataOnly?: boolean): I[] {
        const [node] = this.getNodeAndPathForKeyword(keyword);
        return node != null ? (exactDataOnly ? node.getData() : node.getAllSubstringData()) : [];
    }

    /**
     * @return if the trie was changed by this operation
     */
    removeDataForWord(keyword: string, data: I): boolean {
        const [node, nodePath] = this.getNodeAndPathForKeyword(keyword);
        if (node == null || !node.removeData(data)) {
            return false;
        }

        // Iterate starting at the last searched node, stopping just before the root.
        for (let i = nodePath.length - 1; i >= 1; i--) {
            // Remove the node from its while if it is empty.
            const node = nodePath[i];
            // The nodePath starts at the root, so it is one longer than the keyword.
            const nodeLetter = keyword[i - 1];
            if (node.getAllSubstringData().length !== 0) {
                break;
            }
            nodePath[i - 1].removeSuffix(nodeLetter);
        }

        return true;
    }
}
