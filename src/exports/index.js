// @ts-check

/**
 * @typedef {object} NavigateParams
 * @property {string} NavigateParams.location - Where the "href" of the anchorElement points to
 * @property {Event} NavigateParams.event - The event that triggered the navigation
 * @property {null | HTMLAnchorElement} NavigateParams.anchorElement - The anchorElement found.
 */

/**
* @example
*   const linkClickObserver = new LinkClickObserver(document);
*   linkClickObserver.shouldStopNativeNavigation = ({location, event, anchorElement}) => {
*     return true
*   }
*
*   linkClickObserver.navigate = ({location, event, anchorElement}) => {
*     route(path)
*   };
*   linkClickObserver.start();
*/
export class LinkClickObserver {
  /**
   * @param {EventTarget} [eventTarget=document] - top level element to attach to. Defaults to `document`
   */
  constructor(eventTarget = document) {
    /** @type {EventTarget} */
    this.eventTarget = eventTarget;

    /** @type {(params: NavigateParams) => void} */
    this.navigate = () => void 0;

    /**
     * if true, calls `event.preventDefault`, `event.stopPropagation`, `event.stopImmediatePropagation`
     * @type {(params: NavigateParams) => boolean}
     */
    this.shouldStopNativeNavigation = () => true;

    /** @type {boolean} */
    this.started = false

    /**
    * @private
    * These have special meaning, so we dont operate on them.
    * @type {string[]}
    */
    this.disallowedAnchorTargets = ["_blank", "_top", "_parent"]
  }

  /**
   * Starts the link click observer via event listeners
   * @returns {void}
   */
  start() {
    if (!this.started) {
      this.eventTarget.addEventListener("click", this.clickCaptured, true);
      this.started = true;
    }
  }

  /**
   * Removes event listeners and stops listening for clicks
   * @returns {void}
   */
  stop() {
    if (this.started) {
      this.eventTarget.removeEventListener("click", this.clickCaptured, true);
      this.started = false;
    }
  }

  /**
   * @private
   * @param {Event} _event
   * @returns {void}
   */
  clickCaptured = (_event) => {
    this.eventTarget.removeEventListener("click", this.clickBubbled, false);
    this.eventTarget.addEventListener("click", this.clickBubbled, false);
  };

  /**
   * @private
   * @param {Event} event - click event
   * @returns {void}
   */
  clickBubbled = (event) => {
    if (event instanceof MouseEvent && this.clickEventIsSignificant(event)) {
      const composedPath = event.composedPath();
      const link = this.findLinkFromComposedPath(composedPath);

      if (link && this.doesNotTargetIFrame(link)) {
        const location = this.getLocationForLink(link);

        if (this.shouldStopNativeNavigation({ location, event, anchorElement: link }) === false) {
          return;
        }

        event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();

        this.navigate?.({ location, event, anchorElement: link });
      }
    }
  };

  /**
   * @private
   * @param {MouseEvent} event
   * @returns {boolean}
   */
  clickEventIsSignificant(event) {
    return !(
      // @ts-expect-error
      (event.target && event.target.isContentEditable) ||
      event.defaultPrevented ||
      event.which > 1 ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    );
  }


  /**
   * @public
   * @param {EventTarget[]} composedPath
   * @return {HTMLAnchorElement | undefined}
   */
  findLinkFromComposedPath(composedPath) {
    /** @type {HTMLAnchorElement | undefined} */
    // @ts-expect-error
    return composedPath.find((el) => {
      if (!(el instanceof Element)) return false;

      const anchorTarget = el.getAttribute("target") || "";
      const isAllowedAnchorTarget =
        !this.disallowedAnchorTargets.includes(anchorTarget);
      const isNotDownloadAnchor = !el.hasAttribute("download");

      return (
        el instanceof HTMLAnchorElement &&
        isAllowedAnchorTarget &&
        isNotDownloadAnchor
      );
    });

    // "a[href]:not([target^=_]):not([download])"
  }

  /**
   * @private
   * @param {Element} link
   * @return {string}
   */
  getLocationForLink(link) {
    return link.getAttribute("href") || "";
  }

  /**
   * @private
   * @param {HTMLAnchorElement} anchor
   * @return {boolean}
   */
  doesNotTargetIFrame(anchor) {
    const elements = document.getElementsByName(anchor.target);
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (element instanceof HTMLIFrameElement) return false;
    }

    return true;
  }
}


