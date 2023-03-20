import { fireEvent } from "@testing-library/dom";
import { 
  mountComponent, 
  wrapperProvides,
  SEARCH_PATTERN,
} from "../utils/mount";
import { 
  mockOptionSelection,
  mockOptionsLoader,
  createNewOptionsWrapper,
} from "../utils/utils";

import Vue3ExtendedMultiselect from "../../src/components/Vue3ExtendedMultiselect.vue";
import ExtendedMultiselectInput from "../../src/components/ExtendedMultiselectInput.vue";
import ExtendedMultiselectMultiple from "../../src/components/ExtendedMultiselectMultiple.vue";

let wrapper;

describe("events", () => {
  it("correctly emits 'pattern-changed' event", async () => {
    const propsData = {
      options: globalThis.OPTIONS,
    };
    
    wrapper = await mountComponent(Vue3ExtendedMultiselect, true, propsData);

    wrapper.vm.emitter.emit(
      "extended:search-pattern-changed", 
      globalThis.SEARCH_VALUE,
    );

    expect(wrapper.emitted()['pattern-changed'][0][0]).toEqual(globalThis.SEARCH_VALUE);

    propsData.options = mockOptionsLoader;
    wrapper = await mountComponent(Vue3ExtendedMultiselect, true, propsData);

    wrapper.vm.emitter.emit(
      "extended:loader-pattern-changed", 
      globalThis.SEARCH_VALUE_WITH_RESULTS,
    );

    expect(wrapper.emitted()['pattern-changed'][0][0]).toEqual(globalThis.SEARCH_VALUE_WITH_RESULTS);
  });


  it("correctly emits 'select' event", async () => {
    const propsData = {
      defaultExpanded: true,
      simpleEvents: false,
      inputId: globalThis.INPUT_ID,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    await mockOptionSelection(wrapper);

    expect(wrapper.emitted().select[0][0].option.label).toEqual("First Option");
    expect(wrapper.emitted().select[0][0].inputId).toEqual(globalThis.INPUT_ID);
  });


  it("correctly emits 'clean' event", async () => {
    const propsData = {
      showClearIcon: true,
      defaultExpanded: true,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const cleanButton = wrapper.find("#extended__multiselect-cancel");

    await fireEvent.click(cleanButton.element);

    expect(wrapper.emitted().clean).toBeDefined();
  });
  

  it("correctly emits 'option-created' event", async () => {
    const propsData = {
      defaultExpanded: true,
      createOnTheGo: true,
      inputId: globalThis.INPUT_ID,
    };

    wrapper = await mountComponent(
      Vue3ExtendedMultiselect, 
      false, 
      propsData, 
      wrapperProvides(globalThis.SEARCH_VALUE, SEARCH_PATTERN),
    );

    await fireEvent.mouseDown(createNewOptionsWrapper(wrapper).element);
    
    expect(wrapper.emitted()["option-created"][0][0]).toEqual(globalThis.SEARCH_VALUE);
  });


  it("correctly emits 'active' event", async () => {
    wrapper = await mountComponent(Vue3ExtendedMultiselect, false);

    const inputWrapper = wrapper.findComponent(ExtendedMultiselectInput);
    const field = inputWrapper.find("input");

    await fireEvent.focus(field.element);

    expect(wrapper.emitted().active[0][0]).toBeNull();
  });


  it("correctly emits 'close' event", async () => {
    const propsData = {
      defaultExpanded: true,
      simpleEvents: false,
      inputId: globalThis.INPUT_ID,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    await mockOptionSelection(wrapper);

    expect(wrapper.emitted().close[0][0].inputId).toEqual(globalThis.INPUT_ID);
    expect(wrapper.emitted().close[0][0].options).toHaveLength(1);
  });
  

  it("correctly emits 'increase' event", async () => {
    expect.assertions(1);
    
    const propsData = {
      multiple: true,
      toggleMultipleBlocksLimit: true,
      multipleBlocksLimit: 1,
      increaseDisplayBy: 1,
      preselectedOptions: globalThis.OPTIONS,
      options: globalThis.OPTIONS,
    };
    const wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);
    const multipleWrapper = wrapper.findComponent(ExtendedMultiselectMultiple);
    const increaserWrapper = multipleWrapper.find(".extended__multiselect-increaser");

    await fireEvent.click(increaserWrapper.element);
      
    expect(wrapper.emitted().increase[0][0]).toEqual(2);
  });
});