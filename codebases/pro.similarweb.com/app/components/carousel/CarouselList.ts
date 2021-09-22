import { allTrackers } from "services/track/track";

export enum Direction {
    right,
    left,
}

/**
 * A class of list items with carousel functionality
 */
export class CarouselList {
    public hasNext = false;
    public hasPrev = false;

    private currentId = 0;
    private lastId = 0;

    constructor(private items = [], private maxDisplayItems = 5, private trackingName) {
        this.updateBoundaries();
    }

    getDisplayItems() {
        const from = this.currentId * this.maxDisplayItems;
        return this.items.slice(from, from + this.maxDisplayItems);
    }

    updateBoundaries() {
        this.lastId = Math.ceil(this.items.length / this.maxDisplayItems) - 1;
        this.hasNext = this.currentId < this.lastId;
        this.hasPrev = this.currentId > 0;
    }

    move(dir: Direction) {
        // fix for using enum as a s string
        if (typeof dir === "string") {
            dir = +Direction[dir as string];
        }
        switch (dir) {
            case Direction.right:
                this.moveForward();
                break;
            case Direction.left:
                this.moveBack();
                break;
        }

        allTrackers.trackEvent("Pagination", "click", `${this.trackingName}/${Direction[dir]}`);

        this.updateBoundaries();
    }

    moveBack() {
        this.currentId--;
        if (this.currentId <= 0) {
            this.currentId = 0;
        }
    }

    moveForward() {
        this.currentId++;
        if (this.currentId >= this.lastId) {
            this.currentId = this.lastId;
        }
    }
}
