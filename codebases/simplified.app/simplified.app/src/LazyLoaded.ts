import { IS_IE } from "./consts";
import Component from "@egjs/component";
import { toArray, isDataAttribute, removeEvent, addEvent } from "./utils";
import { remove as removeAutoSizer, add as addAutoSizer } from "./AutoSizer";

/**
 * @namespace eg.LazyLoaded
 */
/**
 * This module is used to wait for images or videos to load.
 * @ko 이 모듈은 이미지 또는 비디오 로딩을 대기할 수 있습니다.
 * @memberof eg.LazyLoaded
 * @param -
 * @example
 * ## HTML
 * ```html
 * <div>
 *    <img src="./1.jpg" data-width="1280" data-height="853" style="width:100%"/>
 *    <img src="./2.jpg">
 *    <img src="./3.jpg">
 *    <img src="./4.jpg">
 *    <img src="ERR">
 *    <img src="./6.jpg">
 *    <img src="./7.jpg">
 *    <img src="ERR">
 * </div>
 * ```
 * ## Javascript
 * ```js
 * import {check} from "@egjs/lazyloaded";
 *
 * eg.LazyLoaded.check([document.querySelector("div")]).on({
 *   ready: () => console.log("ready"),
 *   finish: () => console.log("finish"),
 *   error: e => console.log("error", e),
 * });
 * ```
 */
export function check(
  elements: HTMLElement[],
  prefix: string = "data-",
): Component {
  const component = new Component();
  let finishCount = 0;
  let readyCount = 0;

  function checkReady() {
    if (--readyCount !== 0) {
      return;
    }
    /**
     * An event occurs when the size of all images is available.
     * @ko 모든 이미지의 사이즈를 구할 수 있는 상태가 된 경우 이벤트가 발생한다.
     * @event eg.LazyLoaded#ready
     * @example
     * ```html
     * <div>
     *    <img src="./1.jpg" data-width="1280" data-height="853" style="width:100%"/>
     *    <img src="./2.jpg"/>
     *    <img src="ERR"/>
     * </div>
     * ```
     * ## Javascript
     * ```js
     * import {check} from "@egjs/lazyloaded";
     *
     * eg.LazyLoaded.check([document.querySelector("div")]).on({
     *   ready: () => console.log("ready"),
     * });
     * ```
     */
    component.trigger("ready");
  }
  function checkFinish() {
    if (--finishCount !== 0) {
      return;
    }
    /**
     * An event occurs when all images have been completed loading.
     * @ko 모든 이미지가 로딩이 완료된 상태가 된 경우 이벤트가 발생한다.
     * @event eg.LazyLoaded#finish
     * @example
     * ```html
     * <div>
     *    <img src="./1.jpg" data-width="1280" data-height="853" style="width:100%"/>
     *    <img src="./2.jpg"/>
     *    <img src="ERR"/>
     * </div>
     * ```
     * ## Javascript
     * ```js
     * import {check} from "@egjs/lazyloaded";
     *
     * eg.LazyLoaded.check([document.querySelector("div")]).on({
     *   finish: () => console.log("finish"),
     * });
     * ```
     */
    component.trigger("finish");
  }
  elements.forEach((el, i) => {
    const tagName = el.tagName;

    if (isDataAttribute(el, prefix) && tagName !== "IMG") {
      addAutoSizer(el, prefix);
      ++finishCount;
      setTimeout(() => {
        check(toArray(el.querySelectorAll("img")), prefix).on("finish", () => {
          removeAutoSizer(el, prefix);
          checkFinish();
        });
      });
      return;
    }
    const images = tagName === "IMG" ? [el as HTMLImageElement] : toArray(el.querySelectorAll("img"));

    if (!images.length) {
      return;
    }
    images.forEach((img, j) => {
      if (img.complete && (!IS_IE || (IS_IE && img.naturalWidth))) {
        if (!img.naturalWidth) {
          setTimeout(() => {
            component.trigger("error", {
              itemTarget: el,
              itemIndex: i,
              target: img,
              index: j,
            });
          });
        }
        return;
      }
      if (isDataAttribute(img, prefix)) {
        addAutoSizer(img, prefix);
      } else {
        ++readyCount;
      }
      ++finishCount;

      function onError() {
        /**
         * An event occurs if the image fails to load.
         * @ko 이미지가 로딩에 실패하면 이벤트가 발생한다.
         * @event eg.LazyLoaded#error
         * @param {object} e - The object of data to be sent to an event <ko>이벤트에 전달되는 데이터 객체</ko>
         * @param {HTMLElement} [e.itemTarget] - The item's element with error images.<ko>오류난 이미지가 있는 아이템의 엘리먼트</ko>
         * @param {number} [e.itemindex] - The item's index with error images. <ko>오류난 이미지가 있는 아이템의 인덱스</ko>
         * @param {HTMLElement} [e.target] - Error image element <ko>오류난 이미지 엘리먼트</ko>
         * @param {number} [e.index] - Error image index <ko>오류난 이미지의 인덱스</ko>
         * @example
         * ```html
         * <div>
         *    <img src="./1.jpg" data-width="1280" data-height="853" style="width:100%"/>
         *    <img src="./2.jpg"/>
         *    <img src="ERR"/>
         * </div>
         * ```
         * ## Javascript
         * ```js
         * import {check} from "@egjs/lazyloaded";
         *
         * eg.LazyLoaded.check([document.querySelector("div")]).on({
         *   error: e => {
         *     // <div>...</div>, 0, <img src="ERR"/>, 2
         *     console.log(e.itemTarget, e.itemIndex, e.target, e.index),
         *   },
         * });
         * ```
         */
        component.trigger("error", {
          itemTarget: el,
          itemIndex: i,
          target: img,
          index: j,
        });
      }
      function onCheck(e: Event) {
        const target = (e.target || e.srcElement) as HTMLImageElement;

        removeEvent(target, "error", onCheck);
        removeEvent(target, "load", onCheck);

        if (isDataAttribute(target, prefix)) {
          removeAutoSizer(target, prefix);
        } else {
          checkReady();
        }
        if (e.type === "error") {
          onError();
        }
        checkFinish();
      }
      addEvent(img, "load", onCheck);
      addEvent(img, "error", onCheck);

      IS_IE && img.setAttribute("src", img.getAttribute("src") as string);
    });
  });

  !readyCount && setTimeout(() => {
    component.trigger("ready");
  });

  !finishCount && setTimeout(() => {
    component.trigger("finish");
  });

  return component;
}


/**
 * Remove the element that was registered in AutoSizer.
 * @ko AutoSizer에 등록됐던 엘리먼트를 제거 한다.
 * @memberof eg.LazyLoaded
 * @function removeAutoSizer
 * @param {HTMLElement} element - Element to be removed
 * @param {string} prefix - data prefix of element to be removed
 * @example
 * ## HTML
 * ```html
 * <div>
 *    <img src="./1.jpg" data-width="1280" data-height="853" style="width:100%"/>
 * </div>
 * ```
 * ## Javascript
 * ```js
 * import { removeAutoSizer } from "@egjs/lazyloaded";
 *
 * if (target.getAttribute("data-width")) {
 *   removeAutoSizer(target, "data-");
 * }
 * ```
 */
export { removeAutoSizer };
