import angular from "angular";
import { gridsterPreferences } from "./gridster.preferences";

/**
 * Created by Eran.Shain on 3/6/2016.
 */
let _tracker: any;
let $timeout: any;
class GridsterServiceFactory {
    static $inject = ["$timeout"];

    constructor(tracker: any, timeout: any) {
        _tracker = tracker;
        $timeout = timeout;
    }

    create(dashboard: any): GridsterService {
        return new GridsterService(dashboard, { ...gridsterPreferences });
    }
}

export class GridsterService {
    constructor(private _dashboard: any, public settings: any) {
        this.settings.draggable.start = this.dragStart;
        this.settings.draggable.drag = this.dragging;
        this.settings.draggable.stop = this.dragEnd;
    }

    private startDrag = 0;
    private currentPosition: any;
    private isDragging = false;
    private dragStart = (event, $element, itemPos) => {};
    private dragging = (event, $element, itemPos) => {
        if (!this.startDrag) {
            this.startDrag = Date.now();
            this.currentPosition = angular.copy(itemPos);
        }
        if (!this.isDragging && Date.now() - this.startDrag >= 100) {
            this.isDragging = true;
            _tracker.all.trackEvent(
                "Dashboards",
                "click",
                `Drag and Drop/start/${this._dashboard.id}`,
            );
        }
    };
    private dragEnd = (event, $element, itemPos) => {
        this.startDrag = 0;
        this.isDragging = false;
        $timeout(() => {
            if (angular.equals(itemPos, this.currentPosition)) {
                _tracker.all.trackEvent(
                    "Dashboards",
                    "click",
                    `Drag and Drop/fail/${this._dashboard.id}`,
                );
            } else {
                _tracker.all.trackEvent(
                    "Dashboards",
                    "click",
                    `Drag and Drop/end/${this._dashboard.id}`,
                );
            }
        }, 1500);
    };

    setColumns(cols: number) {
        this.settings.columns = cols;
    }
}

angular.module("sw.common").service("GridsterServiceFactory", GridsterServiceFactory);
