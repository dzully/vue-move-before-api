import { describe, it, expect, vi, beforeEach } from "vitest";
import { useVideoTransition } from "../useVideoTransition";

describe("useVideoTransition", () => {
  // Mock DOM environment
  beforeEach(() => {
    // Mock document.startViewTransition
    global.document.startViewTransition = vi.fn((callback) => {
      callback();
      return { ready: Promise.resolve() };
    });

    // Mock Element.prototype.moveBefore
    Element.prototype.moveBefore = vi.fn();

    // Mock Node.DOCUMENT_POSITION_FOLLOWING
    global.Node = { DOCUMENT_POSITION_FOLLOWING: 4 };
  });

  it("detects feature support correctly", () => {
    const {
      isViewTransitionsSupported,
      isMoveBeforeSupported,
      isTransitionSupported,
    } = useVideoTransition({ onError: vi.fn(), onComplete: vi.fn() });

    expect(isViewTransitionsSupported.value).toBe(true);
    expect(isMoveBeforeSupported.value).toBe(true);
    expect(isTransitionSupported.value).toBe(true);
  });

  it("handles error when elements are not provided", async () => {
    const onError = vi.fn();
    const { swapElements } = useVideoTransition({
      onError,
      onComplete: vi.fn(),
    });

    // Call with missing elements
    await expect(swapElements(null, null)).rejects.toThrow(
      "Both elements must be provided"
    );
    expect(onError).toHaveBeenCalled();
  });

  it("swaps elements successfully", async () => {
    const onComplete = vi.fn();
    const { swapElements } = useVideoTransition({
      onError: vi.fn(),
      onComplete,
    });

    // Create test elements
    const parent1 = document.createElement("div");
    const parent2 = document.createElement("div");
    const element1 = document.createElement("div");
    const element2 = document.createElement("div");

    // Set up DOM structure
    parent1.appendChild(element1);
    parent2.appendChild(element2);

    // Mock compareDocumentPosition to simulate element1 before element2
    element1.compareDocumentPosition = vi.fn().mockReturnValue(4); // Node.DOCUMENT_POSITION_FOLLOWING

    // Call swap
    await swapElements(element1, element2);

    // Verify expected behavior
    expect(document.startViewTransition).toHaveBeenCalled();
    expect(parent2.moveBefore).toHaveBeenCalledWith(element1, null);
    expect(parent1.moveBefore).toHaveBeenCalledWith(element2, null);
    expect(onComplete).toHaveBeenCalled();
  });

  it("handles errors during swap process", async () => {
    // Mock an error during moveBefore
    Element.prototype.moveBefore.mockImplementation(() => {
      throw new Error("Mock moveBefore error");
    });

    const onError = vi.fn();
    const { swapElements } = useVideoTransition({
      onError,
      onComplete: vi.fn(),
    });

    // Create test elements
    const parent1 = document.createElement("div");
    const parent2 = document.createElement("div");
    const element1 = document.createElement("div");
    const element2 = document.createElement("div");

    // Set up DOM structure
    parent1.appendChild(element1);
    parent2.appendChild(element2);

    // Mock compareDocumentPosition
    element1.compareDocumentPosition = vi.fn().mockReturnValue(4);

    // Call swap and expect it to handle the error
    await expect(swapElements(element1, element2)).rejects.toThrow(
      "Error swapping elements"
    );
    expect(onError).toHaveBeenCalled();
  });

  it("falls back when View Transitions API is not supported", async () => {
    // Remove View Transitions API
    delete global.document.startViewTransition;

    const onComplete = vi.fn();
    const { swapElements, isViewTransitionsSupported } = useVideoTransition({
      onError: vi.fn(),
      onComplete,
    });

    // Create test elements
    const parent1 = document.createElement("div");
    const parent2 = document.createElement("div");
    const element1 = document.createElement("div");
    const element2 = document.createElement("div");

    // Set up DOM structure
    parent1.appendChild(element1);
    parent2.appendChild(element2);

    // Mock compareDocumentPosition
    element1.compareDocumentPosition = vi.fn().mockReturnValue(4);

    // Check detection
    expect(isViewTransitionsSupported.value).toBe(false);

    // Call swap - should work without View Transitions
    await swapElements(element1, element2);

    // Should still perform the swap
    expect(parent2.moveBefore).toHaveBeenCalledWith(element1, null);
    expect(parent1.moveBefore).toHaveBeenCalledWith(element2, null);
    expect(onComplete).toHaveBeenCalled();
  });
});
