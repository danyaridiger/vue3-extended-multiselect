import { mount, shallowMount } from "@vue/test-utils";
import { reactive } from "vue";

export const mountComponent = (component, shallow, propsData, options) => {
  if (shallow) {
    return shallowMount(component, {
      propsData,
      ...options,
    });
  } else {
    return mount(component, {
      propsData,
      ...options,
    });
  }
};

export const wrapperProvides = (searchValue, searchPattern) => {
  return { 
    provide: {
      searchState: reactive({
        searchValue: searchValue,
        searchPattern: searchPattern,
      }),
    },
  };
};

export const wrapperSlots = {
  slots: {
    moreThanLimit: `<div>${globalThis.MORE_THAN_LIMIT}</div>`,
    lessThanLimit: `<div>${globalThis.LESS_THAN_LIMIT}</div>`,
  },
};

export const SEARCH_PATTERN = /126/;
export const NO_OPTIONS_PATTERN = /No options/i;
export const FIRST_OPTION_PATTERN = /F/i;