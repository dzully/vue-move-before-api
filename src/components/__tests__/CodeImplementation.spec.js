import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import CodeImplementation from "../CodeImplementation.vue";

describe("CodeImplementation.vue", () => {
  it("renders the image correctly", () => {
    const wrapper = mount(CodeImplementation);
    const img = wrapper.find("img");

    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toContain("code-implementation.png");
    expect(img.attributes("alt")).toBe("Code implementation");
    expect(img.classes()).toContain("overlay-image");
  });

  it("applies correct CSS class for styling", () => {
    const wrapper = mount(CodeImplementation);
    const img = wrapper.find(".overlay-image");

    expect(img.exists()).toBe(true);
  });
});
