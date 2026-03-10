import { fireEvent } from "@testing-library/dom";

import ExtendedMultiselectOptions from "../../src/components/ExtendedMultiselectOptions.vue";

export const mockOptionSelection = async (wrapper) => {
  const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);
  const optionsListWrapper = optionsWrapper.find(
    ".extended__multiselect-options_container",
  );
  const optionElement = optionsListWrapper.find(".extended__multiselect-options_option");

  await fireEvent.click(optionElement.element);
};

export const mockOptionsLoader = async () => {
  return await Promise.resolve(globalThis.OPTIONS);
};

export const expandOptionsList = async (wrapper) => {
  const toggle = wrapper.find(".extended__multiselect-toggle");

  await fireEvent.click(toggle.element);
};

export const createNewOptionsWrapper = (wrapper) => {
  const optionsWrapper = wrapper.findComponent(ExtendedMultiselectOptions);

  return optionsWrapper.find("div > div:first-child");
};
