// Setup file for Vitest
import { beforeAll, vi } from "vitest";

// This file runs before all tests
beforeAll(() => {
  // Setup global document and window if missing
  if (!global.document) {
    global.document = window.document;
  }

  // Mock DOM APIs that might be missing
  if (!global.Node) {
    global.Node = {
      DOCUMENT_POSITION_FOLLOWING: 4,
    };
  }

  // Mock Element.prototype methods if needed
  if (!Element.prototype.moveBefore) {
    Element.prototype.moveBefore = vi.fn();
  }
});
