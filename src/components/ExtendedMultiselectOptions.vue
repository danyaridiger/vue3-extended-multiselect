<template>
  <div
    ref="optionsWrapper"
    tabindex="-1"
    :class="classes"
    :style="styles"
  >
    <slot name="listHeader"></slot>
    <div
      v-if="showCreateNewOptionBlock"
      class="extended__multiselect-option-create"
      :class="optionHighlightClasses(null)"
      @mousedown="createNewOption"
    >
      {{ searchState.searchValue }}
    </div>
    <slot
      name="moreThanLimit"
      v-if="maxOptionsWereSelected"
    >
      <span>Maximum limit of selected options was achieved</span>
    </slot>
    <slot
      name="lessThanLimit"
      v-if="minOptionsWereNotSelected"
    >
      <span>Minimum amount of selected options was not achieved</span>
    </slot>
    <div class="extended__multiselect-options_container">
      <div
        role="listbox"
        v-for="(option, index) in availableOptions"
        :key="index"
      >
        <div
          v-if="option"
          :aria-setsize="availableOptions.length"
          :aria-posinset="index"
          :aria-labelledby="`option-label-${index}`"
          :aria-disabled="optionIsDisabled(option)"
          :class="optionHighlightClasses(option)"
          :style="optionHeightByProps"
          :enter-locator="index"
          :role="optionCreateRole(option)"
          @click.stop="selectOption(option, $event)"
          @keypress.stop="selectOption(option, $event)"
          @mousedown="triggerOptionBeforeSelection"
          @mouseenter.stop="setEnterIndex"
        >
          <slot
            name="option"
            :option="option"
            :create-custom-option-label="createCustomOptionLabel"
          >
            <div class="extended__multiselect-marker">
              <slot 
                name="marker"
                :option="option"
              >
                <div
                  v-if="showMarker && showCurrentMarker(option)"
                  :class="markerShapeClass(option)"
                  :style="markerShapeMargin"
                >
                </div>
                <div 
                  v-else-if="showMarker"
                  class="extended__multiselect-marker-shape-only"
                >
                </div>
              </slot>
            </div>
            <span :id="`option-label-${index}`">
              {{ optionCreateLabel(option) }}
            </span>
          </slot>
        </div>
      </div>
    </div>
    <slot
      name="noResults"
      v-if="emptySearchResult"
    >
      <span>No results were found by search</span>
    </slot>
    <slot
      name="noOptions"
      v-if="emptyOptionsList"
    >
      <span>Options list is empty</span>
    </slot>
    <slot name="listFooter"></slot>
  </div>
</template>

<script setup>
import {
  computed,
  defineProps,
  inject,
  onBeforeMount,
  onMounted,
  ref,
  toRefs,
} from "vue";

import usePreselectedOptions from "../composition/preselected-options";
import useLabels from "../composition/labels";

import { UnionPropType } from "../sets/sets";

const props = defineProps({
  /**
   * Determines whether to immediately select just now created option
   * @property {boolean} autoSelectCreatedOption
   */
  autoSelectCreatedOption: {
    type: Boolean,
    required: true,
  },

  /**
   * Determines whether to show noResults slot
   * and block with new option's text
   * @property {boolean} createOnTheGo
   */
  createOnTheGo: {
    type: Boolean,
    required: true,
  },

  /**
   * Determines whether to emit clear event
   * by option selection
   * @property {boolean} clearBySelectWhenMultiple
   */
  clearBySelectWhenMultiple: {
    type: Boolean,
    required: true,
  },

  /**
   * Determines whether to define thematic class for
   * every option
   * @property {boolean} highlightOptions
   */
  highlightOptions: {
    type: Boolean,
    required: true,
  },

  /**
   * Determines "loading" state of component
   * that disables option selection
   * @property {boolean} loading
   */
  loading: {
    type: Boolean,
    required: true,
  },

  /**
   * Determines whether to use functionality of
   * multiple select
   * @property {boolean} multiple
   */
  multiple: {
    type: Boolean,
    required: true,
  },

  /**
   * Determines whether to show selected options
   * in options list
   * @property {boolean} selectedOptionsShown
   */
  selectedOptionsShown: {
    type: Boolean,
    required: true,
  },

  /**
   * Determines whether to log warnings about incorrect props
   * @property {boolean} showInsertWarnings
   */
  showInsertWarnings: {
    type: Boolean,
    required: true,
  },

  /**
   * Determines whether to show marker slot
   * @property {boolean} showMarker
   */
  showMarker: {
    type: Boolean,
    required: true,
  },

  /**
   * Defines class of options list placement after expanse
   * @property {string} chosenToggleAppearanceSide
   */
  chosenToggleAppearanceSide: {
    type: String,
    required: true,
  },

  /**
   * Determines type of option that will be created
   * @property {string} createOptionType
   */
  createOptionType: {
    type: String,
    required: true,
  },

  /**
   * Determines a field in options of type "object"
   * which value will be used to disable such options.
   * @property {string} disableByField
   */
  disableByField: {
    type: String,
    required: true,
  },

  /**
   * Sets labels for options of type "object"
   * or Array instances which length/keys length equals 0
   * @property {string} emptyObjectsPlaceholder
   */
  emptyObjectsPlaceholder: {
    type: String,
    required: true,
  },

  /**
   * Determines field of option which will be displayed as label
   * @property {string} label
   */
  label: {
    type: String,
    required: true,
  },

  /**
   * Determines field in options of type "object"
   * to use in internal search.
   * @property {string} searchByField
   */
  searchByField: {
    type: String,
    required: true,
  },

  /**
   * Current theme of extended-multiselect
   * used in class definition
   * @property {string} themeType
   */
  themeType: {
    type: String,
    required: true,
  },

  /**
   * Defines "height" css-property of every option element
   * @property {number} anyOptionWrapperBlockHeight
   */
  anyOptionWrapperBlockHeight: {
    type: Number,
    required: true,
  },

  /**
   * Determines maximal limit of selected options
   * @property {number|null} maxOptionsCount
   */
  maxOptionsCount: {
    type: Number,
    default: null,
  },

  /**
   * Determines minimal limit of selected options
   * @property {number|null} minOptionsCount
   */
  minOptionsCount: {
    type: Number,
    default: null,
  },

  /**
   * Defines value of "max-height" css-property of options list
   * @property {number} toggleMaxHeight
   */
  toggleMaxHeight: {
    type: Number,
    required: true,
  },

  /**
   * Defines value of "min-height" css-property of options list
   * @property {number} toggleMinHeight
   */
  toggleMinHeight: {
    type: Number,
    default: null,
  },

  /**
   * List of fields for new options of type "object" created by user
   * if "createOnTheGo" prop equals true
   * Each field will have basic value of "searchValue" prop
   * @property {Array} createOptionFields
   */
  createOptionFields: {
    type: Array,
    required: true,
  },

  /**
   * Searches for options with listed primitive values
   * and disables it
   * @property {Array} disabledPrimitiveOptionsConverted
   */
  disabledPrimitiveOptionsConverted: {
    type: Array,
    required: true,
  },

  /**
   * Unfiltered options list
   * @property {Array} options
   */
  options: {
    type: Array,
    required: true,
  },

  /**
   * Defines value of "padding" css-property of every option
   * @property {Array} optionsPadding
   */
  optionsPadding: {
    type: Array,
    required: true,
  },
      
  /**
   * List of options which should be selected by default
   * if "multiple" prop equals true
   * @property {Array} preselectedOptions
   */
  preselectedOptions: {
    type: Array,
    required: true,
  },

  /**
   * List of options filtered by maximal available options amount
   * @property {Array} restrictedOptions
   */
  restrictedOptions: {
    type: Array,
    required: true,
  },

  /**
   * List of selected options or list with single selected option
   * if "multiple" prop equals false
   * @property {Array} selectedOptions
   */
  selectedOptions: {
    type: Array,
    required: true,
  },

  /**
   * List of key names that in combination with "enter" key
   * should cancel option selection
   * @property {Array} specialKeysBlock
   */
  specialKeysBlock: {
    type: Array,
    required: true,
  },

  /**
   * Reactive instance of LocalEmitter class
   * @property {object} emitter
   */
  emitter: {
    type: Object,
    required: true,
  },

  /**
   * Creates custom label for every option in options list
   * @property {Function} createCustomOptionLabel
   */
  createCustomOptionLabel: {
    type: Function,
    required: true,
  },

  /**
   * Loader function provided by user.
   * @property {Function} externalOptionsLoader
   * @default null
   * @param {string} value - value of search field
   */
  externalOptionsLoader: {
    type: Function,
    default: null,
  },

  /**
   * Option which should be selected by default
   * if "multiple" prop equals false
   * @property {UnionPropType|null} preselectedOption
   */
  preselectedOption: {
    type: UnionPropType,
    default: null,
  },
});

const searchState = inject("searchState");
const setSearchValue = inject("setSearchValue");
const setSearchPattern = inject("setSearchPattern");

const fieldWasShown = ref(false);
const atopWithScroll = ref(null);
const enterIndex = ref(null);
const heightFromMounted = ref(null);
const underWithScroll = ref(null);

/**
 * Element references
 */
const optionsWrapper = ref(null);

const {
  anyOptionWrapperBlockHeight,
  autoSelectCreatedOption,
  chosenToggleAppearanceSide,
  clearBySelectWhenMultiple,
  createOnTheGo,
  createCustomOptionLabel,
  createOptionFields,
  createOptionType,
  disableByField,
  disabledPrimitiveOptionsConverted,
  emitter,
  emptyObjectsPlaceholder,
  highlightOptions,
  loading,
  label,
  searchByField,
  maxOptionsCount,
  minOptionsCount,
  multiple,
  options,
  optionsPadding,
  restrictedOptions,
  selectedOptions,
  selectedOptionsShown,
  showInsertWarnings,
  showMarker,
  specialKeysBlock,
  themeType,
  toggleMaxHeight,
  toggleMinHeight,
  externalOptionsLoader,
} = toRefs(props);

const { createLabel, optionTypeRestrictor } = usePreselectedOptions(
  label,
  emptyObjectsPlaceholder,
  showInsertWarnings,
);
const { optionCreateLabel } = useLabels(
  label, 
  createCustomOptionLabel, 
  emptyObjectsPlaceholder,
);

/**
 * List of options filtered by "disabled" and "selected" signs
 * also by equality to null and undefined primitive values
 * or instance declarations
 * @function
 * @returns {Array} options
 */
const availableOptions = computed(() => {
  let filteredOptions = restrictedOptions.value.filter((option) => {
    const availableOptionType = optionTypeRestrictor(option);

    if (!option || !availableOptionType) return false;

    if (!lookForSimpleOptions(option)) return false;

    if (selectedOptionsShown.value) return true;
            
    return lookForObjectOptions(option);
  });

  let finalOptionsList = filteredOptions;

  if (searchState.searchPattern) {
    finalOptionsList = filterBySearchPattern(filteredOptions);
  }

  return finalOptionsList;
});

/**
 * Defines a list of options list classes
 * @function
 * @returns {Array} classes
 */
const classes = computed(() => {
  let theme = [];

  switch(themeType.value) {
    case "basic":
      theme.push("extended__multiselect-options");
      break;
    case "slate-grey":
      theme.push("extended__multiselect-options-slate-grey");
      break;
    case "slate-blue":
      theme.push("extended__multiselect-options-slate-blue");
      break;
    case "teal":
      theme.push("extended__multiselect-options-teal");
      break;
    case "strict":
      theme.push("extended__multiselect-options-strict");
      break;
    default:
      theme.push("extended__multiselect-options");
  }

  if (showMarker.value) {
    theme.push("extended__multiselect-options--marker");
  }

  if (chosenToggleAppearanceSide.value === "atop") {
    theme.push("extended__multiselect-options--atop");
  }

  return theme;
});

/**
 * Determines whether given options list is empty
 * @function
 * @returns {boolean} emptiness
 */
const emptyOptionsList = computed(() => {
  return (!options.value.length || !options.value.filter((option) => !!option).length
   || !availableOptions.value.length) && !searchState.searchValue;
});

/**
 * Determines whether list of internal search results is empty
 * @function
 * @returns {boolean} emptiness
 */
const emptySearchResult = computed(() => {
  return !availableOptions.value.length && !createOnTheGo.value && searchState.searchValue;
});

/**
 * Defines styles for "min-heigt", "max-height"
 * and "top" css-properties of options wrapper
 * @function
 * @returns {Object} styles
 */
const heightFromProps = computed(() => {
  let heightRecord = {};
      
  if (chosenToggleAppearanceSide.value === "atop") {
    Object.defineProperty(heightRecord, "top", {
      enumerable: true,
      value: `-${toggleMaxHeight.value}px`,
    });
  }

  Object.defineProperty(heightRecord, "maxHeight", {
    enumerable: true,
    value: `${toggleMaxHeight.value}px`,
  });

  if (toggleMinHeight.value) {
    if (toggleMinHeight.value > toggleMaxHeight.value) {
      if (showInsertWarnings.value) {
        let errorMessage = "vue-extended-multiselect: «toggleMinHeight» property can not be greater than «toggleMaxHeight» property.";
        errorMessage += "«toggleMaxHeight» property was reset to default value of 400 pixels.";
        console.warn(errorMessage);
      }

      return Object.keys(heightRecord).length ? heightRecord : null;
    }

    Object.defineProperty(heightRecord, "minHeight", {
      enumerable: true,
      value: `${toggleMinHeight.value}px`,
    });
  }

  return Object.keys(heightRecord).length ? heightRecord : null;
});

/**
 * Determines whether maximal amount of options has been selected
 * @function
 * @returns {boolean} reaching
 */
const maxOptionsWereSelected = computed(() => {
  return maxOptionsCount.value && multiple.value && selectedOptions.value.length === maxOptionsCount.value;
});

/**
 * Defines styles for "margin-top" css-property of marker element
 * @function
 * @returns {Object} styles 
 */
const markerShapeMargin = computed(() => {
  return { marginTop: "2px" };
});

/**
 * Determines whether minimal amount of options has not been selected
 * @function
 * @returns {boolean} reaching
 */
const minOptionsWereNotSelected = computed(() => {
  return minOptionsCount.value && multiple.value && selectedOptions.value.length < minOptionsCount.value;
});

/**
 * Defines styles for "padding" and "height" css-property 
 * of every option element
 * @function
 * @returns {Object} styles
 */
const optionHeightByProps = computed(() => {
  let height = {
    height: `${anyOptionWrapperBlockHeight.value}px`,
  };

  if (optionsPadding.value.length) {
    const padding = {
      paddingTop: optionsPadding.value[0] ? `${optionsPadding.value[0]}px` : null,
      paddingLeft: optionsPadding.value[1] ? `${optionsPadding.value[1]}px` : null,
      paddingBottom: optionsPadding.value[2] ? `${optionsPadding.value[2]}px` : null,
      paddingRight: optionsPadding.value[3] ? `${optionsPadding.value[3]}px` : null,
    };

    return Object.assign(height, padding);
  }

  return height;
});

/**
 * Determines whether to show element with new custom option
 * @function
 * @returns {boolean} display
 */
const showCreateNewOptionBlock = computed(() => {
  return createOnTheGo.value && !availableOptions.value.length && searchState.searchValue;
});

/**
 * Summarizes styles for options wrapper in combined collection
 * @function
 * @returns {Array} styles 
 */

const styles = computed(() => {
  return [
    heightFromProps.value, 
    heightFromMounted.value, 
    atopWithScroll.value, 
    underWithScroll.value
  ];
});

/**
 * Restricts repeated selection of option
 * @function
 * @param {string} calculatedOptionLabel - displayed label of option
 */
const compareWithSelected = (calculatedOptionLabel) => {
  return !selectedOptions.value.find((selectedOption) => {
    let calculatedSelectedOptionLabel;

    if (typeof selectedOption === "object") {
      if (Object.keys(selectedOption).length === 0) {
        calculatedSelectedOptionLabel = emptyObjectsPlaceholder.value;
      } else if (Array.isArray(selectedOption)) {
        calculatedSelectedOptionLabel = selectedOption.join(", ");
      } else {
        calculatedSelectedOptionLabel = typeof selectedOption[label.value] === "object"
         ? JSON.stringify(selectedOption[label.value])
         : selectedOption[label.value].toString();
      }
    } else {
      calculatedSelectedOptionLabel = selectedOption.toString();
    }

    return calculatedSelectedOptionLabel === calculatedOptionLabel;
  });
};

/**
 * Creates new option by users input
 * if "createOnTheGo" prop equals true
 * @function
 * @emits extended:create-option
 */
const createNewOption = () => {
  if (loading.value) return;

  let newOption;

  switch(createOptionType.value) {
    case "primitive":
      newOption = searchState.searchValue;
      break;
    case "array":
      newOption = [searchState.searchValue];
      break;
    case "object":
      newOption = createObjectOption();
      break;
  }

  options.value.unshift(newOption);
  emitter.value.emit("extended:create-option", newOption);

  if (autoSelectCreatedOption.value) {
    selectOption(newOption, { target: { id: "extended__multiselect" } });
    setSearchValue(null);
    setSearchPattern(null);
  }
};

/**
 * Creates option of type object
 * if "createOptionType" equals "object"
 * @function
 * @returns {UnionPropType} option
 */
const createObjectOption = () => {
  if (!createOptionFields.value) {
    if (showInsertWarnings.value) {
      console.warn("vue-extended-multiselect: if option should be object — option fields should not be empty");
    }

    return searchState.searchValue;
  }

  const newOption = {};

  createOptionFields.value.forEach((field) => {
    Object.defineProperty(newOption, field, {
      enumerable: true,
      writable: true,
      configurable: true,
      value: `${field}-${searchState.searchValue}`,
    });
  });

  return newOption;
};

/**
 * Recognises if option is disabled
 * @function
 * @param {UnionPropType} option - option to recognize
 * @returns {boolean} prohibition
 */
const defineDisabledOption = (option) => {
  if (typeof option === "object" && !Array.isArray(option)) return false;

  let convertedOption;
  if (Array.isArray(option) && !option.length) {
    convertedOption = emptyObjectsPlaceholder.value;
  } else {
    convertedOption = option;
  }

  if (disabledPrimitiveOptionsConverted.value.includes(convertedOption)) return true;

  return false;
};

/**
 * Filters options list by pattern of internal search for available options
 * @function
 * @param {Array} optionsList - pre-filtered list of oprions
 * @returns {boolean} filter
 */
const filterBySearchPattern = (optionsList) => {
  return optionsList.filter((option) => {
    if (typeof option === "object") {
      if (Array.isArray(option)) {
        return searchState.searchPattern.test(option.length ? option.join(", ") : emptyObjectsPlaceholder.value);
      }

      let internalSearchResult;

      if (searchByField.value.length) {
        if (!option[searchByField.value]) return false;

        internalSearchResult = option[searchByField.value].toString();
      } else {
        internalSearchResult = option[label.value].toString();
      }

      return searchState.searchPattern.test(internalSearchResult);
    } else {
      return searchState.searchPattern.test(option.toString());
    }
  });
};

/**
 * Blocks keys pressed in combination with "enter" key
 * for not to select options by them
 * @function
 * @param {KeyboardEvent} keyboardEvent - KeyboardEvent instance
 * @returns {boolean} block
 */
const keyBlocker = (keyboardEvent) => {
  if (!keyboardEvent) return false;

  const altKeyBlock = specialKeysBlock.value.includes("alt");
  const ctrlKeyBlock = specialKeysBlock.value.includes("ctrl");
  const shiftKeyBlock = specialKeysBlock.value.includes("shift");

  if (altKeyBlock && keyboardEvent.altKey) return true;
  if (ctrlKeyBlock && keyboardEvent.ctrlKey) return true;
  if (shiftKeyBlock && keyboardEvent.shiftKey) return true;

  return false;
}

/**
 * Searchs for already selected options in particular
 * for options of type "object"
 * @function
 * @param {UnionPropType} option - option for search
 * @returns {boolean} selected
 */
const lookForObjectOptions = (option) => {
  if (typeof option === "object") {
    let calculatedOptionLabel;

    if (Array.isArray(option) && !!option.length) {
      calculatedOptionLabel = option.join(", ");
    } else {
      const hasLabel = Object.getOwnPropertyNames(option).includes("label");

      if (hasLabel) {
        calculatedOptionLabel = typeof option[label.value] === "object" 
         ? JSON.stringify(option[label.value]) 
         : option[label.value].toString();
      } else {
        calculatedOptionLabel = JSON.stringify(option);
      }

      if (Object.keys(option).length === 0) {
        calculatedOptionLabel = emptyObjectsPlaceholder.value;
      }
    }

    return compareWithSelected(calculatedOptionLabel);
  } else {
    return !selectedOptions.value.includes(option);
  }
};

/**
 * Searches for already selected options in particular
 * for options of primitive types or of type "function"
 * @function
 * @param {UnionPropType} option - option for search
 * @returns {boolean} selected
 */
const lookForSimpleOptions = (option) => {
  if (typeof option === "object" && Object.keys(option).length === 0) {
    const emptyObject = selectedOptions.value.find((emptyObject) => {
      return typeof emptyObject === "object" && !Object.keys(emptyObject).length;
    });

    if (!emptyObject || selectedOptionsShown.value) return true;

    return false;
  }

  if (
    typeof option === "object"
     && !Array.isArray(option)
     && !Object.keys(option).includes(label.value)
  ) return false;

  return true;
};

/**
 * Defines a class for "marker" slot content
 * @function
 * @param {UnionPropType} option - option in options list
 * @returns {string} class
 */
const markerShapeClass = (option) => {
  if (lookForSimpleOptions(option) && lookForObjectOptions(option)) {
    return "extended__multiselect-marker-shape--selected";
  }

  return "extended__multiselect-marker-shape";
}

/**
 * Creates role of every option element for accessible applications
 * if it needed
 * @function
 * @param {UnionPropType} option - each option from options list
 * @returns {string|null} role
 */
const optionCreateRole = (option) => {
  if (optionIsDisabled(option)) return null;
  if (!option) return null;

  return "option";
};

/**
 * Determines whether option is disabled
 * @function
 * @param {UnionPropType} option - each option from options list
 * @returns {boolean} blocking
 */
const optionIsDisabled = (option) => {
  if (option[disableByField.value] || defineDisabledOption(option)) return true;

  return false;
}

/**
 * Defines various classes for options dependent from props
 * @function
 * @param {UnionPropType} option - each option from options list
 * @returns {Array} classes
 */
const optionHighlightClasses = (option) => {
  let theme = [];

  if (highlightOptions.value) {
    switch(themeType.value) {
      case "basic":
        theme.push("extended__multiselect-options_option");
        break;
      case "slate-grey":
        theme.push("extended__multiselect-options_option-slate-grey");
        break;
      case "slate-blue":
        theme.push("extended__multiselect-options_option-slate-blue");
        break;
      case "teal":
        theme.push("extended__multiselect-options_option-teal");
        break;
      case "strict":
        theme.push("extended__multiselect-options_option-strict");
        break;
      default: 
        theme.push("extended__multiselect-options_option");
    }
  }

  if (showMarker) {
    theme.push("extended__multiselect-options_option--marker");
  }

  if (option && option[disableByField.value]) {
    theme.push("extended__multiselect-options_option--disabled");
  }

  if (disabledPrimitiveOptionsConverted.value && option && defineDisabledOption(option)) {
    theme.push("extended__multiselect-options_option--disabled");
  }

  return theme;
};

/**
 * Selects option 
 * @function
 * @emits extended:deselect-option
 * @param {UnionPropType} option - option to select
 * @param {MouseEvent|KeyboardEvent} clickEvent - MouseEvent or KeyboardEvent instance
 */
const selectOption = (option, clickEvent) => {

  emitter.value.emit("extended:trigger-selection", false);

  if (!clickEvent) return;
  if (keyBlocker(clickEvent)) return;
  if (loading.value) return;
  if (maxOptionsWereSelected.value) return;
  if (option[disableByField.value] || defineDisabledOption(option)) return;
  if (
    clickEvent.target.id === "extended__multiselect-toggle"
    || clickEvent.target.id === "extended__multiselect-cancel"
  ) return;

  if (selectedOptionsShown.value || externalOptionsLoader.value) {
    const optionDeselected = lookForObjectOptions(option);

    if (!optionDeselected) {
      emitter.value.emit("extended:deselect-option");
      return;
    }
  }

  const isObject = typeof option === "object" && !Array.isArray(option);

  if (isObject && !Object.keys(option).includes(label.value)) {
    if (showInsertWarnings.value) {
      console.warn("vue-extended-multiselect: wrong label type inserted");
    }
  }

  selectOptionEmitter(option);
};

/**
 * Emits select events or clear event
 * if prop "clearBySelectWhenMultiple" equals true
 * @function
 * @emits extended:clear-field
 * @emits extended:select-option
 * @param {UnionPropType} - option to select
 */
const selectOptionEmitter = (option) => {
  const isObjectOrArray = typeof option === "object";
  const label = createLabel(isObjectOrArray, option);
      
  if (multiple.value) {
    if (clearBySelectWhenMultiple.value) {
      emitter.value.emit("extended:clear-field");
    }

    emitter.value.emit("extended:select-option", {
      label,
      option,
     });
  } else {
    emitter.value.emit("extended:select-option", {
      label,
      option,
    });
  }
};

/**
 * Determines an option which will be selected
 * by pressing "enter" key on it
 * @function
 * @param {MouseEvent} event - MouseEvent instance
 */
const setEnterIndex = (event) => {
  enterIndex.value = event.target.getAttribute("enter-locator");
};

/**
 * Determines whether to show marker beside option by its selection
 * @function
 * @param {UnionPropType} option - each option from options list
 * @returns {boolean} display
 */
const showCurrentMarker = (option) => {
  if (!lookForSimpleOptions(option) || !lookForObjectOptions(option)) {
    return true;
  }

  return false;
};

/**
 * Emits event which listener will add special class
 * to search field before option selection
 * @function
 * @emits extended:trigger-selection
 */
const triggerOptionBeforeSelection = () => {
  if (fieldWasShown.value) {
    emitter.value.emit("extended:trigger-selection", true);
  }
};

/**
 * "onBeforeMount" hook of ExtendedMultiselectOptions component
 * @listens extended:select-enter
 * @listens extended:renew-field-forwarding
 * @listens extended:reset-index
 */
onBeforeMount(() => {
  const objectFields = restrictedOptions.value.filter((option) => {
    if (!option) return false;

    return typeof option === "object" && typeof option[label.value] === "object";
  });

  if (objectFields.length && showInsertWarnings.value) {
    console.warn("vue-extended-multiselect: «label» property can not be of type «object»");
  }

  emitter.value.on("extended:select-enter", (keyboardEvent) => {
    if (!enterIndex.value) return;

    const option = availableOptions.value[enterIndex.value];
    selectOption(option, keyboardEvent);
  });

  emitter.value.on("extended:renew-field-forwarding", (value) => {
    fieldWasShown.value = value;
  });

  emitter.value.on("extended:reset-index", () => {
    enterIndex.value = null;
  });
});

/**
 * "onMounted" hook of ExtendedMultiselectOptions component
 */
onMounted(() => {
  const offsetHeight = optionsWrapper.value.offsetHeight;
  const scrollHeight = optionsWrapper.value.scrollHeight;

  if (chosenToggleAppearanceSide.value === "atop") {
    if (scrollHeight > offsetHeight) {
      atopWithScroll.value = {
        borderTopRightRadius: 0,
      };
    }

    if (toggleMaxHeight.value > offsetHeight) {
      heightFromMounted.value = {
        top: `-${offsetHeight - 1}px`,
      };
    }
  } else {
    if (scrollHeight > offsetHeight) {
      underWithScroll.value = {
        borderBottomRightRadius: 0,
      };
    }
  }
});
</script>