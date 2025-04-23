import { computed } from "vue";

/**
 * Composable for handling element transitions and swaps with modern APIs
 * @param {Object} options - Configuration options
 * @param {Function} options.onError - Error callback
 * @param {Function} options.onComplete - Completion callback
 * @returns {Object} - Transition utilities
 */
export function useVideoTransition({ onError, onComplete }) {
  // Feature detection for browser APIs
  const isViewTransitionsSupported = computed(
    () => typeof document !== "undefined" && "startViewTransition" in document
  );

  const isMoveBeforeSupported = computed(
    () =>
      typeof document !== "undefined" &&
      typeof Element.prototype.moveBefore === "function"
  );

  // Unified feature support status
  const isTransitionSupported = computed(
    () => isViewTransitionsSupported.value && isMoveBeforeSupported.value
  );

  /**
   * Swap two DOM elements with proper browser animation
   * @param {HTMLElement} element1 - First element to swap
   * @param {HTMLElement} element2 - Second element to swap
   * @param {Boolean} useTransition - Whether to use View Transitions API
   * @returns {Promise} - Resolves when swap is complete
   */
  const swapElements = async (element1, element2, useTransition = true) => {
    if (!element1 || !element2) {
      const error = new Error("Both elements must be provided for swapping");
      if (onError) onError(error);
      throw error;
    }

    try {
      // Get parent elements for proper DOM manipulation
      const parent1 = element1.parentNode;
      const parent2 = element2.parentNode;

      if (!parent1 || !parent2) {
        throw new Error("Elements must be in the DOM to be swapped");
      }

      // Use View Transitions API if supported and requested
      if (useTransition && isViewTransitionsSupported.value) {
        await document.startViewTransition(() =>
          performElementSwap(element1, element2, parent1, parent2)
        ).ready;
      } else {
        performElementSwap(element1, element2, parent1, parent2);
      }

      if (onComplete) onComplete();
      return true;
    } catch (error) {
      const enhancedError = new Error(
        isMoveBeforeSupported.value
          ? `Error swapping elements: ${error.message}`
          : "This feature requires a browser that supports the moveBefore API. Please use Chrome with the #atomic-move flag enabled."
      );

      if (onError) onError(enhancedError);
      throw enhancedError;
    }
  };

  /**
   * Perform the actual element swap using moveBefore API
   * @private
   */
  const performElementSwap = (element1, element2, parent1, parent2) => {
    if (!isMoveBeforeSupported.value) {
      throw new Error("moveBefore API not supported in this browser");
    }

    // Determine DOM position for optimal swapping
    const isElement1First =
      element1.compareDocumentPosition(element2) &
      Node.DOCUMENT_POSITION_FOLLOWING;

    if (isElement1First) {
      // Move element1 to end of parent2
      parent2.moveBefore(element1, null);
      // Move element2 to end of parent1
      parent1.moveBefore(element2, null);
    } else {
      // Move element2 to end of parent1
      parent1.moveBefore(element2, null);
      // Move element1 to end of parent2
      parent2.moveBefore(element1, null);
    }
  };

  return {
    swapElements,
    isViewTransitionsSupported,
    isMoveBeforeSupported,
    isTransitionSupported,
  };
}
