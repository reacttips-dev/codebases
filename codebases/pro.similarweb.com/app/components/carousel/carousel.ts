import angular, { ITimeoutService, IRootElementService } from "angular";

const swCarouselConfig = {
    maxVisibleItems: 5,
    supportCycle: false, //not working yet
};

class SWCarouselController {
    private slides = [];
    private carouselWidth = 0;
    private config: any = {};
    private currentIndex = 0;
    private supportCycle = false;
    private currentTransitionTarget = 0;
    private carouselTrack;
    private carouselContainer;
    private preDefinedMaxVisibleElements;

    constructor(private $timeout: ITimeoutService, private $element: IRootElementService) {
        this.config = Object.assign({}, swCarouselConfig, this["settings"]);
        this.preDefinedMaxVisibleElements = this.config.maxVisibleItems;
        this.carouselTrack = $element.find(".carousel-inner");
        this.carouselContainer = $element.find(".carousel-container");
        this.$element = $element;
    }

    $postLink() {
        this.$timeout(() => {
            this.carouselContainer.addClass("visible");
        }, 500);
    }

    getCurrentSlide() {
        if (this.slides) {
            return this.slides[this.currentIndex % this.slides.length];
        }
        return undefined;
    }

    addCarouselItem(element) {
        let rootMaxWidth = this.$element.width();
        this.slides.push(element);
        this.carouselWidth += element.width();
        this.carouselTrack.css("width", this.carouselWidth + "px");
        //case the user predefined maxitemsSize is greater than rootMax --> reduce window size to 1(simple solutions)
        if (
            this.preDefinedMaxVisibleElements == 1 ||
            rootMaxWidth <
                this.getMaxBetweenIndexes(0, this.slides.length) * this.preDefinedMaxVisibleElements
        ) {
            //overrideMax Visible windows  : set window to 1
            this.config.maxVisibleItems = 1;
            this.recalcContainer();
            return;
        }
        if (this.slides.length > this.config.maxVisibleItems) {
            this.carouselContainer.css("width", this.config.maxVisibleItems * element.width());
            this.carouselContainer.addClass("has-controls");
            this.$element.removeClass("center");
        } else {
            this.carouselContainer.css("width", this.slides.length * element.width());
            this.$element.addClass("center");
        }
    }

    getSlideByIndex(index: number) {
        if (this.slides && this.slides.length >= index) {
            return this.slides[index];
        }
        return null;
    }

    getMaxBetweenIndexes(startIndex: number, endIndex: number) {
        let maxWidth = 0;
        for (var i = startIndex; i < endIndex; i++) {
            if (this.getSlideByIndex(i).width() > maxWidth) {
                maxWidth = this.getSlideByIndex(i).width();
            }
        }
        return maxWidth;
    }

    recalcContainer() {
        this.carouselContainer.css("width", this.getCurrentSlide().width() + "px");
    }

    next() {
        if (this.isNextDisabled()) {
            return;
        }
        this.animateMove(true);
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        if (this.config.maxVisibleItems == 1) {
            this.recalcContainer();
        }
    }

    prev() {
        if (this.isPrevDisabled()) {
            return;
        }
        this.animateMove(false);
        this.currentIndex =
            this.currentIndex == 0
                ? this.slides.length - 1
                : (this.currentIndex - 1) % this.slides.length;
        if (this.config.maxVisibleItems == 1) {
            this.recalcContainer();
        }
    }

    getNextSlide() {
        let nextSlideIndex = (this.currentIndex + 1) % this.slides.length;
        return this.getSlideByIndex(nextSlideIndex);
    }

    getPreviousSlide() {
        let prevSlideIndex =
            this.currentIndex == 0
                ? this.slides.length - 1
                : (this.currentIndex - 1) % this.slides.length;
        return this.getSlideByIndex(prevSlideIndex);
    }

    animateMove(next) {
        var item_width = this.getCurrentSlide().width();
        var left_value = 0;
        if (next) {
            //support carousel items with different width
            // item_width = this.getMaxBetweenIndexes(this.currentIndex % this.slides.length,(this.currentIndex + this.config.maxVisibleItems)% this.slides.length);

            left_value = item_width * -1;
        } else {
            //support carousel items with different width
            // item_width = this.getMaxBetweenIndexes((this.currentIndex - 1) % this.slides.length,(this.currentIndex + this.config.maxVisibleItems - 1)% this.slides.length);
            var previousSlideWidth = this.getPreviousSlide().width();
            left_value = previousSlideWidth;
        }
        // if(this.config.supportCycle)
        // {
        //     var current = this.getCurrentSlide();
        //     var lastinLine = this.getSlideByIndex((this.currentIndex + (this.slides.length - 1)) % this.slides.length);
        //
        //     this.$timeout(()=> {
        //         if(next) {
        //
        //         }
        //         else {
        //
        //         }
        //     }, 520);
        // }

        // var left_indent = (this.currentTransitionTarget % this.carouselTrack.width()) + left_value;
        var left_indent = this.currentTransitionTarget + left_value;
        //slide the item
        this.carouselTrack.css("transform", "translate3d(" + left_indent + "px, 0, 0)");

        this.currentTransitionTarget = left_indent;
        return false;
    }

    showCarouselControl() {
        return this.slides.length > this.config.maxVisibleItems;
    }

    isPrevDisabled() {
        if (this.config.supportCycle) {
            return false;
        }
        return this.currentIndex == 0;
    }

    isNextDisabled() {
        if (this.config.supportCycle) {
            return false;
        }
        return this.currentIndex + this.config.maxVisibleItems === this.slides.length;
    }
}

angular.module("sw.common").component("swCarousel", {
    transclude: true,
    controller: SWCarouselController,
    templateUrl: "/app/components/carousel/carousel.html",
    bindings: {
        settings: "=",
    },
});
