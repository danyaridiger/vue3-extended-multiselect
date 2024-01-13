import { fireEvent } from "@testing-library/dom";
import { 
  mountComponent, 
  wrapperProvides,
  wrapperSlots,
  SEARCH_PATTERN,
  NO_OPTIONS_PATTERN,
  FIRST_OPTION_PATTERN,
} from "../utils/mount";
import { 
  mockOptionSelection, 
  expandOptionsList,
  createNewOptionsWrapper,
} from "../utils/utils";

import Vue3ExtendedMultiselect from "../../src/components/Vue3ExtendedMultiselect.vue";
import ExtendedMultiselectMultiple from "../../src/components/ExtendedMultiselectMultiple.vue";
import ExtendedMultiselectLoader from "../../src/components/ExtendedMultiselectLoader.vue";
import ExtendedMultiselectInput from "../../src/components/ExtendedMultiselectInput.vue";
import ExtendedMultiselectOptions from "../../src/components/ExtendedMultiselectOptions.vue";
import ExtendedMultiselectToggle from "../../src/components/ExtendedMultiselectToggle.vue";

let wrapper;

describe("props", () => {
  it("correctly handles 'autoSelectCreatedOption' prop value", async () => {
    const propsData = {
      autoSelectCreatedOption: true,
      createOnTheGo: true,
      defaultExpanded: true,
    };

    wrapper = await mountComponent(
      Vue3ExtendedMultiselect, 
      false, 
      propsData,
      wrapperProvides(globalThis.SEARCH_VALUE, SEARCH_PATTERN),
    );

    await fireEvent.mouseDown(createNewOptionsWrapper(wrapper).element);

    const inputWrapper = wrapper.findComponent(ExtendedMultiselectInput);
    const selectedOption = inputWrapper.find(".extended__multiselect-block").find("span");

    expect(selectedOption.text()).toEqual(globalThis.SEARCH_VALUE);
  });


  it("correctly handles 'autoSelectSearchValue' prop value", async () => {
    const propsData = {
      autoSelectSearchValue: true,
      defaultExpanded: true,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    await mockOptionSelection(wrapper);

    const inputWrapper = wrapper.findComponent(ExtendedMultiselectInput).find("input");

    await fireEvent.focus(inputWrapper.element);
    expect(inputWrapper.element.value).toEqual(globalThis.OPTIONS[0].label);
  });


  it("correctly handles 'clearBySelectWhenMultiple' prop value", async () => {
    const propsData = {
      clearBySelectWhenMultiple: true,
      defaultExpanded: true,
      multiple: true,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const inputWrapper = wrapper.findComponent(ExtendedMultiselectInput).find("input");

    await inputWrapper.setValue(globalThis.SEARCH_VALUE_WITH_RESULTS);
    await mockOptionSelection(wrapper);

    expect(inputWrapper.element.value).toHaveLength(0);
  });


  it("correctly handles 'createOnTheGo' prop value", async () => {
    const propsData = {
      createOnTheGo: true,
      defaultExpanded: true,
    };

    wrapper = await mountComponent(
      Vue3ExtendedMultiselect, 
      false, 
      propsData, 
      wrapperProvides(globalThis.SEARCH_VALUE, SEARCH_PATTERN),
    );

    expect(createNewOptionsWrapper(wrapper).exists()).toBeTruthy();
    expect(createNewOptionsWrapper(wrapper).isVisible()).toBeTruthy();
  });


  it("correctly handles 'defaultExpanded' prop value", (done) => {
    expect.assertions(3);

    const propsData = {
      defaultExpanded: true,
      options: async () => await Promise.resolve(globalThis.OPTIONS),
    };

    wrapper = mountComponent(Vue3ExtendedMultiselect, false, propsData);

    let optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);

    expect(optionsWrapper.exists()).toBeFalsy();

    propsData.options = globalThis.OPTIONS;

    wrapper = mountComponent(Vue3ExtendedMultiselect, false, propsData);

    process.nextTick(async () => {
      optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);

      expect(optionsWrapper.exists()).toBeTruthy();
      expect(optionsWrapper.isVisible()).toBeTruthy();
      
      done();
    });
  });


  it("correctly handles 'disabled' prop value", async () => {
    const propsData = {
      disabled: true,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const inputWrapper = wrapper.findComponent(ExtendedMultiselectInput).find("input");

    expect(inputWrapper.attributes("disabled")).toBeDefined();
  });


  it("correctly handles 'dropdownDisabled' prop value", async () => {
    const propsData = {
      dropdownDisabled: true,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const toggleWrapper = wrapper.find("#extended__multiselect-toggle");
    const inputWrapper = wrapper.findComponent(ExtendedMultiselectInput);

    await fireEvent.click(toggleWrapper.element);

    let optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);

    expect(optionsWrapper.exists()).toBeFalsy();

    await fireEvent.click(inputWrapper.element);

    optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);

    expect(optionsWrapper.exists()).toBeFalsy();
  });


  it("correctly handles 'highlightOptions' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      themeType: "teal",
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);
    const optionsListWrapper = optionsWrapper.find(".extended__multiselect-options_container");
    const optionElement = optionsListWrapper.find("[role=option]");

    await fireEvent.mouseOver(optionElement.element);

    expect(optionElement.classes()).toContain("extended__multiselect-options_option-teal");
  });


  it("correctly handles 'loading' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      loading: true,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const loaderWrapper = wrapper.findComponent(ExtendedMultiselectLoader);
    
    expect(loaderWrapper.exists()).toBeTruthy();
    expect(loaderWrapper.isVisible()).toBeTruthy();

    await mockOptionSelection(wrapper);

    const inputWrapper = wrapper.findComponent(ExtendedMultiselectInput);
    const selectedOptionWrapper = inputWrapper.find(".extended__multiselect-block");

    expect(selectedOptionWrapper.text()).toHaveLength(0);
  });


  it("correctly handles 'multiple' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      multiple: true,
      options: globalThis.OPTIONS,
    };
    
    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const toggleWrapper = wrapper.find("#extended__multiselect-toggle");

    await mockOptionSelection(wrapper);
    await fireEvent.click(toggleWrapper.element);
    await mockOptionSelection(wrapper);

    const multipleWrapper = wrapper.find(".extended__multiselect-block--multiple");
    
    expect(multipleWrapper.text()).toMatch(globalThis.OPTIONS[0].label);
    expect(multipleWrapper.text()).toMatch(globalThis.OPTIONS[1].label);
  });


  it("correctly handles 'noResultsBlockShown' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(
      Vue3ExtendedMultiselect, 
      false, 
      propsData,
      wrapperProvides(globalThis.SEARCH_VALUE, NO_OPTIONS_PATTERN ),
    );

    expect(wrapper.text()).toMatch("No results were found by search");
  });


  it("correctly handles 'resetSearchByValue' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const inputWrapper = wrapper.findComponent(ExtendedMultiselectInput).find("input");

    await inputWrapper.setValue("Value");
    await mockOptionSelection(wrapper);

    expect(inputWrapper.element.value).toHaveLength(0);
  });


  it("correctly handles 'searchFilterActive' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(
      Vue3ExtendedMultiselect, 
      false, 
      propsData,
      wrapperProvides(globalThis.SEARCH_VALUE, FIRST_OPTION_PATTERN),
    );

    const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);
    const optionsListWrapper = optionsWrapper.find(".extended__multiselect-options_container");

    expect(optionsListWrapper.element.children).toHaveLength(1);
  });


  it("correctly handles 'simpleEvents' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      inputId: globalThis.INPUT_ID,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    await mockOptionSelection(wrapper);

    expect(wrapper.emitted().select[0][0].label).toEqual(globalThis.OPTIONS[0].label);

    propsData.simpleEvents = false;
    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    await mockOptionSelection(wrapper);

    expect(wrapper.emitted().select[0][0].inputId).toEqual(globalThis.INPUT_ID);
    expect(wrapper.emitted().select[0][0].option.label).toEqual(globalThis.OPTIONS[0].label);
  });


  it("correctly handles 'selectedOptionsShown' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      selectedOptionsShown: true,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    await mockOptionSelection(wrapper);
    await expandOptionsList(wrapper);

    const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);
    const optionsListWrapper = optionsWrapper.find(".extended__multiselect-options_container");

    expect(optionsListWrapper.element.children).toHaveLength(4);
  });


  it("correctly handles 'showClearIcon' prop value", async () => {
    const propsData = {
      showClearIcon: true,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const cancelWrapper = wrapper.find("#extended__multiselect-cancel");

    expect(cancelWrapper.exists()).toBeTruthy();
    expect(cancelWrapper.isVisible()).toBeTruthy();
  });


  it("correctly handles 'showDeselectIconLoader' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      loading: true,
      multiple: true,
      showDeselectIconLoader: true,
      preselectedOptions: [globalThis.OPTIONS[0]],
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const multipleWrapper = wrapper.find(".extended__multiselect-block--multiple");
    const loaderWrapper = multipleWrapper.findComponent(ExtendedMultiselectLoader).find("img");

    expect(loaderWrapper.exists()).toBeTruthy();
    expect(loaderWrapper.isVisible()).toBeTruthy();
  });


  it("correctly handles 'showInsertWarnings' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      showInsertWarnings: true,
      options: [{ label: { noLabel: "Wrong option" }}],
    };

    console.warn = (warning) => {
      globalThis.warning = warning;
    }

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    expect(globalThis.warning).toEqual("vue-extended-multiselect: «label» property can not be of type «object»");
  });


  it("correctly handles 'showMarker' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      selectedOptionsShown: true,
      showMarker: true,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    await mockOptionSelection(wrapper);
    await expandOptionsList(wrapper);

    const markerWrapper = wrapper.find(".extended__multiselect-marker");

    expect(markerWrapper.exists()).toBeTruthy();
    expect(markerWrapper.isVisible()).toBeTruthy();
  });

  
  it("correctly handles 'showSearchField' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      inputId: globalThis.INPUT_ID,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    let inputWrapper = wrapper.find("input");

    expect(inputWrapper.attributes("id")).toEqual(globalThis.INPUT_ID);

    propsData.showSearchField = false;
    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    await mockOptionSelection(wrapper);

    inputWrapper = wrapper.findComponent(ExtendedMultiselectInput);

    const selectedOptionWrapper = inputWrapper.find(".extended__multiselect-block");
    expect(selectedOptionWrapper.text()).toMatch("First Option");
  });


  it("correctly handles 'toggleMultipleBlocksLimit' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      multiple: true,
      toggleMultipleBlocksLimit: true,
      multipleBlocksLimit: 1,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    await mockOptionSelection(wrapper);
    await expandOptionsList(wrapper);
    await mockOptionSelection(wrapper);

    const increaserWrapper = wrapper.find(".extended__multiselect-increaser");

    expect(increaserWrapper.exists()).toBeTruthy();
    expect(increaserWrapper.isVisible()).toBeTruthy();
  });


  it("correctly handles 'toggleOptionsBySelect' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    await mockOptionSelection(wrapper);

    const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);

    expect(optionsWrapper.exists()).toBeFalsy();
  });

  
  it("correctly handles 'togglingSavesSearchValue' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    let toggleWrapper = wrapper.find("#extended__multiselect-toggle");
    let inputWrapper = wrapper.find("input");

    await inputWrapper.setValue(globalThis.SEARCH_VALUE);
    await fireEvent.blur(inputWrapper.element);

    expect(inputWrapper.element.value).toEqual(globalThis.SEARCH_VALUE);

    propsData.togglingSavesSearchValue = false;
    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);
    toggleWrapper = wrapper.find("#extended__multiselect-toggle");
    inputWrapper = wrapper.find("input");

    await inputWrapper.setValue(globalThis.SEARCH_VALUE);
    await fireEvent.blur(inputWrapper.element);

    expect(inputWrapper.element.value).toHaveLength(0);
  });


  it("correctly handles 'wrongCurrentValue' prop value", async () => {
    const propsData = {
      wrongCurrentValue: true,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData).find(".extended__multiselect-container");

    expect(wrapper.attributes("style")).toMatch("border-color: #ff0000");
  });


  it("correctly handles 'createOptionPlaceholder' prop value", async () => {
    const propsData = {
      createOnTheGo: true,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);
    
    const inputWrapper = wrapper.find("input");

    expect(inputWrapper.attributes("placeholder")).toEqual("Select or create features");
  });


  it("correctly handles 'createOptionType' prop value", async () => {
    const propsData = {
      autoSelectCreatedOption: true,
      createOnTheGo: true,
      defaultExpanded: true,
    };

    wrapper = await mountComponent(
      Vue3ExtendedMultiselect, 
      false, 
      propsData,
      wrapperProvides(globalThis.SEARCH_VALUE, SEARCH_PATTERN),
    );

    await fireEvent.mouseDown(createNewOptionsWrapper(wrapper).element);

    let inputWrapper = wrapper.findComponent(ExtendedMultiselectInput);
    let selectedOption = inputWrapper.find(".extended__multiselect-block").find("span");

    expect(selectedOption.text()).toEqual(globalThis.SEARCH_VALUE);

    propsData.createOptionType = "object";

    wrapper = await mountComponent(
      Vue3ExtendedMultiselect, 
      false, 
      propsData,
      wrapperProvides(globalThis.SEARCH_VALUE, SEARCH_PATTERN),
    );

    const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);
    const createNewOptionsWrapperAfter = optionsWrapper.find("div > div:first-child");

    await fireEvent.mouseDown(createNewOptionsWrapperAfter.element);

    inputWrapper = wrapper.findComponent(ExtendedMultiselectInput);
    selectedOption = inputWrapper.find(".extended__multiselect-block").find("span");

    expect(createNewOptionsWrapperAfter.text()).toEqual(globalThis.SEARCH_VALUE);
    expect(wrapper.vm.selectedOptions[0]).toMatchObject({ label: `label-${globalThis.SEARCH_VALUE}` });
  });


  it("correctly handles 'disableByField' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      disableByField: "searchByField",
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);
    const selectedOptionWrapper = wrapper.find(".extended__multiselect-block");
    const optionElement = optionsWrapper.findAll(".extended__multiselect-options_option").at(2);

    await fireEvent.click(optionElement.element);

    expect(selectedOptionWrapper.text()).toHaveLength(0);
  });


  it("correctly handles 'emptyObjectsPlaceholder' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      options: [[]],
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);
    
    const selectedOptionWrapper = wrapper.find(".extended__multiselect-block");

    await mockOptionSelection(wrapper);

    expect(selectedOptionWrapper.text()).toEqual("Empty Object/Array");
  });
  

  it("correctly handles 'errorBorderColor' prop value", async () => {
    const propsData = {
      wrongCurrentValue: true,
      errorBorderColor: "#DC143C",
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData).find(".extended__multiselect-container");

    expect(wrapper.attributes("style")).toMatch("border-color: #dc143c");
  });


  it("correctly handles 'iconFilter' prop value", async () => {
    const propsData = {
      inputId: globalThis.INPUT_ID,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const toggleWrapper = wrapper.find("#extended__multiselect-toggle").find("img");

    expect(toggleWrapper.classes()).toContain("extended__multiselect-filter_basic");
  });


  it("correctly handles 'iconSize' prop value", async () => {
    const propsData = {
      inputId: globalThis.INPUT_ID,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const toggleWrapper = wrapper.find("#extended__multiselect-toggle").find("img");

    expect(toggleWrapper.classes()).toContain("extended__multiselect-toggle_icon-large");
  });


  it("correctly handles 'label' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      label: "customLabel",
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const selectedOptionWrapper = wrapper.find(".extended__multiselect-block");

    await mockOptionSelection(wrapper);

    expect(selectedOptionWrapper.text()).toEqual(globalThis.OPTIONS[0].customLabel);
  });


  it("correctly handles 'loaderIconFilter' prop value", async () => {
    const propsData = {
      loading: true,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const loaderWrapper = wrapper.findComponent(ExtendedMultiselectLoader).find("img");

    expect(loaderWrapper.classes()).toContain("extended__multiselect-loader_default-loader");
  });


  it("correctly handles 'placeholder' prop value", async () => {
    const propsData = {
      inputId: globalThis.INPUT_ID,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const inputWrapper = wrapper.find("input");

    expect(inputWrapper.attributes("placeholder")).toEqual("Select features");
  });


  it("correctly handles 'searchByField' prop value", async () => {
    const propsData = {
      options: globalThis.OPTIONS,
      searchByField: "searchByField",
    };

    wrapper = await mountComponent(
      Vue3ExtendedMultiselect, 
      false, 
      propsData,
      wrapperProvides(globalThis.SEARCH_VALUE_WITH_RESULTS, SEARCH_PATTERN),
    );

    await expandOptionsList(wrapper);

    const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);
    const optionsListWrapper = optionsWrapper.find(".extended__multiselect-options_container");

    expect(optionsListWrapper.element.children).toHaveLength(1);
  });


  it("correctly handles 'themeType' prop value", async () => {
    expect.assertions(3);

    const propsData = {
      defaultExpanded: true,
      multiple: true,
      options: globalThis.OPTIONS,
      preselectedOptions: [globalThis.OPTIONS[0]],
      inputId: globalThis.INPUT_ID,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const multiselectWrapper = wrapper.find(".extended__multiselect-container");
    const multipleWrapper = wrapper.findComponent(ExtendedMultiselectMultiple);
    const optionWrapper = wrapper.findComponent(ExtendedMultiselectOptions);

    expect(optionWrapper.classes()).toContain("extended__multiselect-options");
    expect(multiselectWrapper.classes()).toContain("extended__multiselect");
    expect(multipleWrapper.find("span").element.parentElement.classList)
     .toContain("extended__multiselect--multiple-basic");
  });


  it("correctly handles 'toggleAppearanceSide' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      toggleAppearanceSide: "atop",
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const optionWrapper = wrapper.findComponent(ExtendedMultiselectOptions);

    expect(optionWrapper.attributes("style")).toMatch("top: -400px; max-height: 400px;");
  });


  it("correctly handles 'toggleIcon' prop value", async () => {
    const propsData = {
      inputId: globalThis.INPUT_ID,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const toggleWrapper = wrapper.findComponent(ExtendedMultiselectToggle);
    const icon = toggleWrapper.find("img");

    expect(toggleWrapper.props("toggleIcon")).toEqual("base-arrow");
    expect(icon.exists()).toBeTruthy();
    expect(icon.isVisible()).toBeTruthy();
  });


  it("correctly handles 'anyOptionWrapperBlockHeight' prop value", async () => {
    const propsData = {
      anyOptionWrapperBlockHeight: 50,
      defaultExpanded: true,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);
    const optionsListWrapper = optionsWrapper.find(".extended__multiselect-options_container");
    const optionElement = optionsListWrapper.find("[role=option]");
    
    expect(optionElement.attributes("style")).toMatch("height: 50px");
  });


  it("correctly handles 'increaseDisplayBy' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      multiple: true,
      toggleMultipleBlocksLimit: true,
      multipleBlocksLimit: 1,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    await mockOptionSelection(wrapper);
    await expandOptionsList(wrapper);
    await mockOptionSelection(wrapper);

    const increaserWrapper = wrapper.find(".extended__multiselect-increaser");

    await fireEvent.click(increaserWrapper.element);

    const multipleWrapper = wrapper.find(".extended__multiselect-block--multiple > div");

    expect(multipleWrapper.element.children).toHaveLength(2);
    expect(multipleWrapper.text()).toMatch(globalThis.OPTIONS[1].label);
  });


  it("correctly handles 'maxOptionsCount' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      multiple: true,
      maxOptionsCount: 1,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(
      Vue3ExtendedMultiselect, 
      false,
      propsData,
      wrapperSlots,
    );

    await mockOptionSelection(wrapper);
    await expandOptionsList(wrapper);
    await mockOptionSelection(wrapper);

    const multipleWrapper = wrapper.find(".extended__multiselect-block--multiple");
    const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);

    expect(multipleWrapper.element.children).toHaveLength(1);
    expect(optionsWrapper.text()).toMatch(globalThis.MORE_THAN_LIMIT);
  });


  it("correctly handles 'minOptionsCount' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      multiple: true,
      minOptionsCount: 2,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(
      Vue3ExtendedMultiselect, 
      false, 
      propsData, 
      wrapperSlots,
    );

    let optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);

    expect(optionsWrapper.text()).toMatch(globalThis.LESS_THAN_LIMIT);
  });


  it("correctly handles 'multipleBlocksLimit' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      multiple: true,
      multipleBlocksLimit: 1,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    await mockOptionSelection(wrapper);
    await expandOptionsList(wrapper);
    await mockOptionSelection(wrapper);

    const multipleWrapper = wrapper.find(".extended__multiselect-block--multiple");

    expect(multipleWrapper.text()).toMatch("and 1 more items");
  });


  it("correctly handles 'optionsCountRestriction' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      multiple: true,
      optionsCountRestriction: 1,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);
    const optionsListWrapper = optionsWrapper.find(".extended__multiselect-options_container");

    expect(optionsListWrapper.element.children).toHaveLength(1);
  });


  it("correctly handles 'toggleMaxHeight' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      toggleMaxHeight: 100,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);

    expect(optionsWrapper.attributes("style")).toMatch("max-height: 100px");
  });


  it("correctly handles 'toggleMinHeight' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      toggleMinHeight: 50,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);

    expect(optionsWrapper.attributes("style")).toMatch("min-height: 50px");
  });


  it("correctly handles 'createOptionFields' prop value", async () => {
    const propsData = {
      autoSelectCreatedOption: true,
      createOnTheGo: true,
      createOptionType: "object",
      createOptionFields: ["label", "id"],
      defaultExpanded: true,
    };

    const createdOption = {
      label: "label-Search for options",
      id: "id-Search for options",
    };

    wrapper = await mountComponent(
      Vue3ExtendedMultiselect, 
      false, 
      propsData,
      wrapperProvides(globalThis.SEARCH_VALUE, SEARCH_PATTERN),
    );

    await fireEvent.mouseDown(createNewOptionsWrapper(wrapper).element);

    expect(wrapper.vm.selectedOptions[0]).toEqual(createdOption);
  });


  it("correctly handles 'disabledPrimitiveOptions' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      disabledPrimitiveOptions: [126],
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);
    const optionsListWrapper = optionsWrapper.find(".extended__multiselect-options_container");
    const optionElement = optionsListWrapper.findAll(".extended__multiselect-options_option").at(3);

    expect(optionElement.classes()).toContain("extended__multiselect-options_option--disabled");
  });


  it("correctly handles 'options' prop value", async () => {
    expect.assertions(2);

    const propsData = {
      defaultExpanded: true,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    let optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);
    let optionsListWrapper = optionsWrapper.find(".extended__multiselect-options_container");

    expect(optionsListWrapper.element.children).toHaveLength(4);

    const optionsLoader = async () => {
      return await Promise.resolve(globalThis.OPTIONS);
    };

    propsData.options = optionsLoader;

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    await process.nextTick(jest.fn());

    expect(wrapper.vm.rawOptions).toHaveLength(4);
  });


  it("correctly handles 'optionsPadding' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      optionsPadding: [5, 10, 10, 5],
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);
    const optionsListWrapper = optionsWrapper.find(".extended__multiselect-options_container");
    const optionElement = optionsListWrapper.find(".extended__multiselect-options_option");

    expect(optionElement.attributes("style")).toMatch("5px 5px 10px 10px");
  });


  it("correctly handles 'preselectedOptions' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      multiple: true,
      preselectedOptions:  [globalThis.OPTIONS[0], globalThis.OPTIONS[1]],
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const multipleWrapper = wrapper.find(".extended__multiselect-block--multiple > div");

    expect(multipleWrapper.element.children).toHaveLength(2);
    
    const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);
    const optionsListWrapper = optionsWrapper.find(".extended__multiselect-options_container");

    expect(optionsListWrapper.element.children).toHaveLength(2);
  });


  it("correctly handles 'specialKeysBlock' prop value", async () => {
    const propsData = {
      defaultExpanded: true,
      specialKeysBlock: ["alt"],
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);
    const optionsListWrapper = optionsWrapper.find(".extended__multiselect-options_container");
    const optionElement = optionsListWrapper.find(".extended__multiselect-options_option");
    const selectedOptionWrapper = wrapper.find(".extended__multiselect-block");

    await fireEvent.mouseOver(optionElement.element);
    await fireEvent.keyPress(optionElement.element, {
      key: "Enter",
      altKey: true,
    });

    expect(selectedOptionWrapper.text()).toHaveLength(0);

    await fireEvent.keyPress(optionElement.element, {
      key: "Enter",
    });
    
    expect(selectedOptionWrapper.text()).toEqual(globalThis.OPTIONS[0].label);
  });


  it("correctly handles v-model", async () => {
    const ApplicationToUse = {
      name: "ApplicationToUse",

      template:
        `<div>
          <vue3-extended-multiselect
            default-expanded
            v-model="value"
            :options="['Test Option']"
          />
        </div>`,

      components: {
        Vue3ExtendedMultiselect,
      },

      data() {
        return { value: null };
      },
    };

    const application = await mountComponent(ApplicationToUse);
    const multiselectWrapper = application.findComponent(Vue3ExtendedMultiselect);

    await mockOptionSelection(multiselectWrapper);

    expect(application.vm.value).toEqual("Test Option");
  });

  
  it("correctly handles 'createCustomOptionLabel' prop value", async () => {
    const propsData = {
      createCustomOptionLabel: (option) => `test-${option.label}`,
      defaultExpanded: true,
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);
    const optionsListWrapper = optionsWrapper.find(".extended__multiselect-options_container");
    const optionElement = optionsListWrapper.find(".extended__multiselect-options_option");

    expect(optionElement.text()).toMatch("test-First Option");
  });


  it("correctly handles 'multipleBlocksLimitMessage' prop value", async () => {
    expect.assertions(1);

    const propsData = {
      multiple: true,
      multipleBlocksLimit: 1,
      multipleBlocksLimitMessage: (amount) => `${amount} more items below`,
      preselectedOptions:  [globalThis.OPTIONS[0], globalThis.OPTIONS[1]],
      options: globalThis.OPTIONS,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const multipleWrapper = wrapper.findComponent(ExtendedMultiselectMultiple);

    expect(multipleWrapper.text()).toMatch("1 more items below");
  });


  it("correctly handles 'inputId' prop value", async () => {
    const propsData = {
      inputId: globalThis.INPUT_ID,
    };

    wrapper = await mountComponent(Vue3ExtendedMultiselect, false, propsData);

    const inputWrapper = wrapper.find("input");

    expect(inputWrapper.attributes("id")).toEqual(globalThis.INPUT_ID);
  });


  it("correctly handles 'preselectedOption' prop value", (done) => {
    expect.assertions(2);
    
    const propsData = {
      preselectedOption: globalThis.OPTIONS[0],
      options: globalThis.OPTIONS,
    };

    wrapper = mountComponent(Vue3ExtendedMultiselect, false, propsData);

    process.nextTick(async () => {
      await expandOptionsList(wrapper);

      const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);
      const optionsListWrapper = optionsWrapper.find(".extended__multiselect-options_container");
      const inputWrapper = wrapper.findComponent(ExtendedMultiselectInput);
      const selectedOption = inputWrapper.find(".extended__multiselect-block").find("span");

      expect(optionsListWrapper.element.children).toHaveLength(3);
      expect(selectedOption.text()).toEqual(globalThis.OPTIONS[0].label);

      done();
    });
  });
});