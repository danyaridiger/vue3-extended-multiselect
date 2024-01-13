import { fireEvent } from "@testing-library/dom";

import { mountComponent } from "../utils/mount";

import Vue3ExtendedMultiselect from "../../src/components/Vue3ExtendedMultiselect.vue";
import ExtendedMultiselectOptions from "../../src/components/ExtendedMultiselectOptions.vue";

let wrapper;

describe("tools", () => {
  it("correctly debounces search value changing", (done) => {
    const propsData = {
      defaultExpanded: true,
      options: globalThis.OPTIONS,
    };

    wrapper = mountComponent(Vue3ExtendedMultiselect, false, propsData);

    setTimeout(() => {
      const input = wrapper.find("input");
      const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);
      const optionsListWrapper = optionsWrapper.find(".extended__multiselect-options_container");
  
      fireEvent.input(input.element, { target: { value: globalThis.SEARCH_VALUE_WITH_RESULTS } });
  
      expect(optionsListWrapper.element.children).toHaveLength(4);

      setTimeout(() => {
        expect(optionsListWrapper.element.children).toHaveLength(1);

        done();
      }, 1000);
    }, 1000);
  });


  it("correctly handles outside clicks", async () => {
    const propsData = {
      defaultExpanded: true,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    let optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);

    expect(optionsWrapper.exists()).toBeTruthy();
    expect(optionsWrapper.isVisible()).toBeTruthy();

    await fireEvent.click(document.documentElement);

    optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);

    expect(optionsWrapper.exists()).toBeFalsy();
  });
});