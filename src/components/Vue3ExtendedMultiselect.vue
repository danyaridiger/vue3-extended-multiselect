<template>
  <section
    aria-owns="extended-search-field"
    ref="extendedMultiselectWrapper"
    role="combobox"
    :aria-roledescription="roledescription"
    :class="wrapperClasses"
    :tabindex="tabindexIfSearch"
    @click.stop.left="fieldFocus"
    @click.stop.middle="fieldFocus"
    @keyup.stop.esc="rollUp"
    @keyup.stop.enter="selectByEnter"
    @mousedown.stop.left="toggleRestrictor"
    @mousedown.stop.middle="toggleRestrictor"
    @mouseleave.stop="resetEnterIndex"
  >
    <div
      ref="extendedMultiselect"
      :class="classes"
      :style="[displayWrongValue, expanded]"
    >
      <div>
        <extended-multiselect-input
          :accesskey="attrs.accesskey"
          :autocomplete="attrs.autocomplete"
          :name="attrs.name"
          :spellcheck="attrs.spellcheck"
          :tabindex="attrs.tabindex"
          :translate="attrs.translate"
          :auto-select-search-value="autoSelectSearchValue"
          :create-on-the-go="createOnTheGo"
          :disabled="disabled"
          :dropdown-active="dropdownActive"
          :loading="internalLoading"
          :icon-filter="iconFilter"
          :multiple="multiple"
          :search-filter-active="searchFilterActive"
          :show-deselect-icon-loader="showDeselectIconLoader"
          :toggling-saves-search-value="togglingSavesSearchValue"
          :toggle-options-by-select="toggleOptionsBySelect"
          :placeholder="placeholder"
          :show-search-field="showSearchField"
          :empty-objects-placeholder="emptyObjectsPlaceholder"
          :label="label"
          :multiple-blocks-limit-message="multipleBlocksLimitMessage"
          :theme-type="themeType"
          :increase-display-by="increaseDisplayBy"
          :multipleBlocksLimit="multipleBlocksLimit"
          :restricted-options-length="restrictedOptionsLength"
          :toggle-multiple-blocks-limit="toggleMultipleBlocksLimit"
          :selected-options="selectedOptions"
          :emitter="emitter"
          :create-custom-option-label="createCustomOptionLabel"
          :create-option-placeholder="createOptionPlaceholder"
          :external-options-loader="externalOptionsLoader"
          :input-id="inputId"
        >
          <template
            v-if="!showSearchField"
            #labelBlock="{ labelBlockValue }"
          >
            <slot
              name="labelBlock"
              :label="labelBlockValue"
            >
            </slot>
          </template>
          <template #optionBlock="{ label, deselectBlock, index }">
            <slot 
              name="optionBlock"
              :label="label"
              :index="index"
              :deselect-block="deselectBlock"
            >
            </slot>
          </template>
          <template
            #maxElements
          >
            <slot name="maxElements"></slot>
          </template>
          <template
            v-if="toggleMultipleBlocksLimit"
            #showMore="{ showMoreOptions }"
          >
            <slot 
              name="showMore"
              :increase="showMoreOptions"
            >
            </slot>
          </template>
        </extended-multiselect-input>
      </div>
      <div class="extended__multiselect-toggle_wrapper">
        <slot 
          name="toggle"
          :toggle-options-list="toggleOptionsList"
        >
          <extended-multiselect-toggle
            ref="extendedMultiselectToggle"
            :tabindex="attrs.tabindex"
            :disabled="disabled"
            :dropdown-active="dropdownActive"
            :loading="internalLoading"
            :icon-filter="iconFilter"
            :icon-size="iconSize"
            :toggle-icon="toggleIcon"
            :emitter="emitter"
          />
        </slot>
      </div>
      <div class="extended__multiselect-cancel_wrapper">
        <slot
          name="cancel"
          :cancel="cancel"
        >
          <extended-multiselect-cancel
            v-if="showClearIcon"
            :tabindex="attrs.tabindex"
            :disabled="disabled"
            :show-search-field="showSearchField"
            :loading="internalLoading"
            :icon-filter="iconFilter"
            :icon-size="iconSize"
            :selected-options="selectedOptions"
            :emitter="emitter"
          />
        </slot>
    </div>
    </div>
    <transition
      name="extended-toggle"
      type="transition"
    >
      <extended-multiselect-options
        v-if="dropdownActive"
        :auto-select-created-option="autoSelectCreatedOption"
        :clear-by-select-when-multiple="clearBySelectWhenMultiple"
        :create-on-the-go="createOnTheGo"
        :disabled-primitive-options-converted="disabledPrimitiveOptionsConverted"
        :highlight-options="highlightOptions"
        :loading="internalLoading"
        :multiple="multiple"
        :selected-options-shown="selectedOptionsShown"
        :show-insert-warnings="showInsertWarnings"
        :show-marker="showMarker"
        :chosen-toggle-appearance-side="chosenToggleAppearanceSide"
        :create-option-type="createOptionType"
        :disable-by-field="disableByField"
        :empty-objects-placeholder="emptyObjectsPlaceholder"
        :label="label"
        :search-by-field="searchByField"
        :theme-type="themeType"
        :any-option-wrapper-block-height="anyOptionWrapperBlockHeight"
        :max-options-count="maxOptionsCount"
        :min-options-count="minOptionsCount"
        :options-padding="optionsPadding"
        :toggle-max-height="toggleMaxHeight"
        :toggle-min-height="toggleMinHeight"
        :create-option-fields="createOptionFields"
        :options="restrictedOptions"
        :restricted-options="restrictedOptions"
        :selected-options="selectedOptions"
        :special-keys-block="specialKeysBlock"
        :preselected-option="preselectedOption"
        :preselected-options="preselectedOptions"
        :emitter="emitter"
        :create-custom-option-label="createCustomOptionLabel"
        :external-options-loader="externalOptionsLoader"
      >
        <template
          v-if="slots.listHeader"
          #listHeader
        >
          <slot name="listHeader"></slot>
        </template>
        <template
          v-if="maxOptionsCount"
          #moreThanLimit
        >
          <slot name="moreThanLimit"></slot>
        </template>
        <template
          v-if="minOptionsCount"
          #lessThanLimit
        >
          <slot name="lessThanLimit"></slot>
        </template>
        <template #option="{ option, createCustomOptionLabel }">
          <slot 
            name="option"
            :option="option"
            :create-custom-option-label="createCustomOptionLabel"
          >
          </slot>
        </template>
        <template #marker>
          <slot name="marker"></slot>
        </template>
        <template
          v-if="noResultsBlockShown"
          #noResults
        >
          <slot name="noResults"></slot>
        </template>
        <template #noOptions>
          <slot name="noOptions"></slot>
        </template>
        <template
          v-if="slots.listFooter"
          #listFooter
        >
          <slot name="listFooter"></slot>
        </template>
      </extended-multiselect-options>
    </transition>
  </section>
</template>

<script setup>
import {
  computed,
  defineEmits,
  defineExpose,
  defineProps,
  onBeforeMount,
  onMounted,
  provide,
  ref,
  toRefs,
  useAttrs,
  useSlots,
  watch,
} from "vue";

import {
  themeTypes,
  loaderThemeTypes,
  toggleIcons,
  iconFilters,
  iconSizes,
  createOptionTypes,
  specialKeysToBlock,
  toggleAppearenceSides,
  UnionPropType,
} from "../sets/sets";

import localEmitter from "../tools/instance.js";

import useToggle from "../composition/toggle";
import useCancel from "../composition/cancel";
import useLabels from "../composition/labels";
import useEmitter from "../composition/emitter";
import useClickOutside from "../composition/click-outside";
import usePreselectedOptions from "../composition/preselected-options";
import useSearchValue from "../composition/search-value";

import ExtendedMultiselectCancel from "./ExtendedMultiselectCancel.vue";
import ExtendedMultiselectInput from "./ExtendedMultiselectInput.vue";
import ExtendedMultiselectOptions from "./ExtendedMultiselectOptions.vue";
import ExtendedMultiselectToggle from "./ExtendedMultiselectToggle.vue";

/**
 * @author Ridiger Daniil Dmitrievich, 2022
 * @version 1.8.6
 */

const props = defineProps({
  /**
   * Determines whether to select just now created option
   * automatically
   * @default false
   * @property {boolean} autoSelectCreatedOption
   */
  autoSelectCreatedOption: {
    type: Boolean,
    default: false,
  },

  /**
   * Determines whether to take search value from current
   * selected option if "multiple" prop equals false
   * @default false
   * @property {boolean} autoSelectSearchValue
   */
  autoSelectSearchValue: {
    type: Boolean,
    default: false,
  },

  /**
   * Determines whether to clear search field by option selection
   * @default false
   * @property {boolean} clearBySelectWhenMultiple
   */
  clearBySelectWhenMultiple: {
    type: Boolean,
    default: false,
  },

  /**
   * Allows user to create new options from search field 
   * @default false
   * @property {boolean} createOnTheGo
   */
  createOnTheGo: {
    type: Boolean,
    default: false,
  },

  /**
   * Determines whether options list should be expanded by default
   * @default false
   * @property {boolean} defaultExpanded
   */
  defaultExpanded: {
    type: Boolean,
    default: false,
  },

  /**
   * Disables extended multiselect
   * @default false
   * @property {boolean} disabled
   */
  disabled: {
    type: Boolean,
    default: false,
  },
    
  /**
   * Switches options highlighting while hovering
   * @default true
   * @property {boolean} highlightOptions
   */
  highlightOptions: {
    type: Boolean,
    default: true,
  },

  /**
   * Switches loading state of extended multiselect
   * @default false
   * @property {boolean} loading
   */
  loading: {
    type: Boolean,
    default: false,
  },

  /**
   * Allows user to select multiple options
   * @default false
   * @property {boolean} multiple
   */
  multiple: {
    type: Boolean,
    default: false,
  },

  /**
   * Determines whether to show special hint if no options were found
   * @default true
   * @property {boolean} noResultsBlockShown
   */
  noResultsBlockShown: {
    type: Boolean,
    default: true,
  },
    
  /**
   * Determines whether to clear search field by selection/deselection of options
   * @default true
   * @property {boolean} resetSearchByValue
   */
  resetSearchByValue: {
    type: Boolean,
    default: true,
  },

  /**
   * Allows user to use internal search for options
   * @default true
   * @property {boolean} searchFilterActive
   */
  searchFilterActive: {
    type: Boolean,
    default: true,
  },

  /**
   * Switches full payload of extended multiselect events
   * @default true
   * @property {boolean} simpleEvents
   */
  simpleEvents: {
    type: Boolean,
    default: true,
  },

  /**
   * Determines whether to show selected options in options list
   * @default false
   * @property {boolean} selectedOptionsShown
   */
  selectedOptionsShown: {
    type: Boolean,
    default: false,
  },

  /**
   * Allows user to deselect all options by special icon
   * @default false
   * @property {boolean} showClearIcon
   */
  showClearIcon: {
    type: Boolean,
    default: false,
  },

  /**
   * Determines whether to show loader icon in multiple
   * options block if "loading" prop equals true
   * @default true
   * @property {boolean} showDeselectIconLoader
   */
  showDeselectIconLoader: {
    type: Boolean,
    default: true,
  },

  /**
   * Determines whether to show useful internal warnings in console
   * @default false
   * @property {boolean} showInsertWarnings
   */
  showInsertWarnings: {
    type: Boolean,
    default: false,
  },

  /**
   * Determines whether to show slot with special marker beside option in options list
   * @default false
   * @property {boolean} showMarker
   */
  showMarker: {
    type: Boolean,
    default: false,
  },

  /**
   * Determines whether to show search field which allows user
   * to search for options with internal search
   * @default true
   * @property {boolean} showSearchField
   */
  showSearchField: {
    type: Boolean,
    default: true,
  },

  /**
   * Allows user to increase limit of shown elements with selected options
   * by special icon
   * @default false
   * @property {boolean} toggleMultipleBlocksLimit
   */
  toggleMultipleBlocksLimit: {
    type: Boolean,
    default: false,
  },

  /**
   * Determines whether to roll up options list by selection of option
   * @default true
   * @property {boolean} toggleOptionsBySelect
   */
  toggleOptionsBySelect: {
    type: Boolean,
    default: true,
  },

  /**
   * Determines whether to save current search value if
   * display of options list was toggled
   * @default true
   * @property {boolean} togglingSavesSearchValue
   */
  togglingSavesSearchValue: {
    type: Boolean,
    default: true,
  },

  /**
   * Determines whether to define special class for extended multiselect
   * if value is wrong
   * Irregularity of value is defined by user
   * @default false
   * @property {boolean} wrongCurrentValue
   */
  wrongCurrentValue: {
    type: Boolean,
    default: false,
  },

  /**
   * Placeholder for the search field to be used if
   * user is allowed to create new options
   * @default "Select or create features"
   * @property {string} createOptionPlaceholder
   */
  createOptionPlaceholder: {
    type: String,
    default: "Select or create features",
  },

  /**
   * Defines kind for all options which will be created by user
   * @default "primitive"
   * @property {string} createOptionType
   */
  createOptionType: {
    type: String,
    default: "primitive",
    validator(value) {
      return createOptionTypes.includes(value);
    },
  },

  /**
   * Determines a field in options of type "object"
   * which value will be used to disable such options.
   * @default "disabled"
   * @property {string} disableByField
   */
  disableByField: {
    type: String,
    default: "disabled",
  },

  /**
   * Placeholder for options of type "object"
   * or Array instances which length/keys length equals 0
   * @default "Empty Object/Array"
   * @property {string} emptyObjectsPlaceholder
   */
  emptyObjectsPlaceholder: {
    type: String,
    default: "Empty Object/Array",
  },

  /**
   * Defines "border-color" css-property for extended multiselect with wrong value
   * @default "#FF0000"
   * @property {string} errorBorderColor
   */
  errorBorderColor: {
    type: String,
    default: "#FF0000",
  },

  /**
   * Defines svg-filter with color settings for all icons except loader
   * @default "basic"
   * @property {string} iconFilter
   */
  iconFilter: {
    type: String,
    default: "basic",
    validator(value) {
      return iconFilters.includes(value);
    },
  },

  /**
   * Defines sizes for all icons in pixels except loader
   * @default "large"
   * @property {string} iconSize
   */
  iconSize: {
    type: String,
    default: "large",
    validator(value) {
      return iconSizes.includes(value);
    },
  },

  /**
   * Defines field in options of type "object" that will be the label of option
   * @default "label"
   * @property {string} label
   */
  label: {
    type: String,
    default: "label",
  },

  /**
   * Defines svg-filter with color settings for loader icon
   * @default "loader-default"
   * @property {string} loaderIconFilter
   */
  loaderIconFilter: {
    type: String,
    default: "loader-default",
    validator(value) {
      return loaderThemeTypes.includes(value);
    },
  },
    
  /**
   * Placeholder for search field to be used if
   * user is not allowed to create new options
   * @default "Select features"
   * @property {string} placeholder
   */
  placeholder: {
    type: String,
    default: "Select features",
  },

  /**
   * Determines field in options of type "object"
   * to use in internal search.
   * @default ""
   * @property {string} searchByField
   */
  searchByField: {
    type: String,
    default: "",
  },

  /**
   * Defines overall color theme for extended multiselect 
   * @default "basic"
   * @property {string} themeType
   */
  themeType: {
    type: String,
    default: "basic",
    validator(value) {
      return themeTypes.includes(value);
    },
  },

  /**
   * Defines which side options list will be displayed on
   * @default "auto"
   * @property {string} toggleAppearanceSide
   */
  toggleAppearanceSide: {
    type: String,
    default: "auto",
    validator(value) {
      return toggleAppearenceSides.includes(value);
    },
  },

  /**
   * Defines kind of toggle icon from icons collection
   * @default "base-arrow"
   * @property {string} toggleIcon
   */
  toggleIcon: {
    type: String,
    default: "base-arrow",
    validator(value) {
      return toggleIcons.includes(value);
    },
  },

  /**
   * Defines "height" css-property for each option in options list
   * @default 30
   * @property {number} anyOptionWrapperBlockHeight
   */
  anyOptionWrapperBlockHeight: {
    type: Number,
    default: 30,
  },

  /**
   * Defines gap which increases limit of displayed elements with selected options
   * @default 5
   * @property {number} increaseDisplayBy
   */
  increaseDisplayBy: {
    type: Number,
    default: 5,
  },
    
  /**
   * Maximal limit of selected options
   * @default null
   * @property {number|null} maxOptionsCount
   */
  maxOptionsCount: {
    type: Number,
    default: null,
  },

  /**
   * Minimal limit of selected options
   * @default null
   * @property {number|null} minOptionsCount
   */
  minOptionsCount: {
    type: Number,
    default: null,
  },

  /**
   * Defines limit of displayed elements with selected options
   * @default null
   * @property {number|null} multipleBlocksLimit
   */
  multipleBlocksLimit: {
    type: Number,
    default: null,
  },

  /**
   * Defines maximal limit of options list length
   * @default null
   * @property {number|null} optionsCountRestriction
   */
  optionsCountRestriction: {
    type: Number,
    default: null,
  },

  /**
   * Defines maximal value in pixels of "max-height" css-property for options list
   * @default 400
   * @property {number} toggleMaxHeight
   */
  toggleMaxHeight: {
    type: Number,
    default: 400,
  },

  /**
   * Defines minimal value in pixels of "max-height" css-property for options list
   * @default null
   * @property {number} toggleMaxHeight
   */
  toggleMinHeight: {
    type: Number,
    default: null,
  },

  /**
   * Defines a list of fields for options of type "object" created by user
   * @default ["label"]
   * @property {Array} createOptionFields
   */
  createOptionFields: {
    type: Array,
      default: () => ["label"],
      validator(value) {
        return !value.some((field) => {
          return typeof field !== "string";
        });
      },
    },

  /**
   * Defines a list of primitive types for options.
   * Options of given types will be disabled for selection.
   * @default []
   * @property {Array} disabledPrimitiveOptions
   */
  disabledPrimitiveOptions: {
    type: Array,
    default: () => [],
    validator(value) {
      return value.every((option) => {
        return typeof option === "string" || Array.isArray(option)
        || typeof option === "number" || typeof option === "boolean"
        || typeof option === "function";
      });
    },
  },

  /**
   * Raw options list
   * @default []
   * @property {Array|Function} options
   */
  options: {
    type: [Array, Function],
    default: () => [],
  },

  /**
   * Defines a list with "padding-top", "padding-left", "padding-bottom"
   * and "padding-right" css-properties for options in options list.
   * Property "padding-top" matches index zero.
   * Property "padding-right" matches index three.
   * @default []
   * @property {Array} optionsPadding
   */
  optionsPadding: {
    type: Array,
    default: () => [],
    validator(value) {
      return value.length < 5
      && !value.some((padding) => {
        return typeof padding !== "number";
      });
    },
  },

  /**
   * Defines a list of options that will be select by default
   * @default []
   * @property {Array} preselectedOptions
   */
  preselectedOptions: {
    type: Array,
    default: () => [],
  },

  /**
   * Defines a list of keys which in combination with mouse buttons or "enter" key
   * will prevent selection of option
   * @default []
   * @property {Array} specialKeysBlock
   */
  specialKeysBlock: {
    type: Array,
    default: () => [],
    validator(value) {
      return value.every((keyBlock) => {
        return specialKeysToBlock.includes(keyBlock);
      });
    },
  },

  /**
   * Defines value of extended multiselect that can be used in "v-model" attribute
   * @default []
   * @property {Array|null} modelValue
   */
  modelValue: {
    type: UnionPropType,
    default: null,
  },

  /**
   * Defines function that creates custom label for each option
   * @default (option)=>null
   * @property {Function} createCustomOptionLabel
   */
  createCustomOptionLabel: {
    type: Function,
    default: (option) => null,
  },

  /**
   * Defines function that creates notification when maximal limit 
   * of selected options has been reached
   * @default (number)=>string
   * @property {Function} multipleBlocksLimitMessage
   */
  multipleBlocksLimitMessage: {
    type: Function,
    default: (number) => `and ${number} more items`,
  },

  /**
   * "id" attribute of search field
   * @default null
   * @property {string|number|null} inputId
   */
  inputId: {
    type: [String, Number],
    default: null,
  },

  /**
   * Defines options that will be select by default
   * @default null
   * @property {UnionPropType|null} preselectedOption
   */
  preselectedOption: {
    type: UnionPropType,
    default: null,
  },
});

const emit = defineEmits([
  "active",
  "clean",
  "close",
  "increase",
  "option-created",
  "pattern-changed",
  "select",
  "update:modelValue",
  "update:wrapper"
]);

const dropdownActive = ref(false);
const skipNextUpdate = ref(false);
const externalOptionsLoader = ref(null);
const chosenToggleAppearanceSide = ref(null);
const selectedOptionsWatcher = ref(null);
const rawOptions = ref([]);
const selectedOptions = ref([]);
const togglePattern = /^extended__multiselect-toggle_wrapper/i;

/**
 * Element references
 */
const extendedMultiselect = ref(null);
const extendedMultiselectToggle = ref(null);
const extendedMultiselectWrapper = ref(null);

const {
  defaultExpanded,
  disabled,
  disabledPrimitiveOptions,
  emptyObjectsPlaceholder,
  errorBorderColor,
  inputId,
  label,
  loading,
  loaderIconFilter,
  modelValue,
  multiple,
  options,
  optionsCountRestriction,
  preselectedOption,
  preselectedOptions,
  resetSearchByValue,
  simpleEvents,
  showClearIcon,
  showInsertWarnings,
  showSearchField,
  themeType,
  toggleAppearanceSide,
  toggleMaxHeight,
  toggleOptionsBySelect,
  wrongCurrentValue,
  createCustomOptionLabel,
} = toRefs(props);

const {
  searchState,
  setSearchValue,
  setSearchPattern,
} = useSearchValue();

provide("loaderIconFilter", loaderIconFilter.value);
provide("searchState", searchState);
provide("setSearchValue", setSearchValue);
provide("setSearchPattern", setSearchPattern);

const { emitter } = useEmitter();
const { clickOutside } = useClickOutside();
const { toggleOptionsList } = useToggle(
  loading,
  disabled,
  emitter,
);
const { cancel } = useCancel(
  disabled,
  showSearchField,
  selectedOptions,
  emitter,
  setSearchValue,
  setSearchPattern,
);
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
const attrs = useAttrs();
const slots = useSlots();
 
/**
 * Defines a list of extended multiselect wrapper classes
 * @function
 * @returns {Array} classes
 */
const classes = computed(() => {
  let theme;
  const localClassList = [];

  switch(themeType.value) {
    case "basic":
      theme = "extended__multiselect";
      break;
    case "slate-grey":
      theme = "extended__multiselect-slate-grey";
      break;
    case "slate-blue":
      theme = "extended__multiselect-slate-blue";
      break;
    case "teal":
      theme = "extended__multiselect-teal";
      break;
    case "strict":
      theme = "extended__multiselect-strict";
      break;
    default: theme = "extended__multiselect";
  }

  localClassList.push(theme);

  const clear = showClearIcon.value
   ? "extended__multiselect-clear--active"
   : "extended__multiselect-clear--locked";

  localClassList.push(clear);
  localClassList.push("extended__multiselect-container");
      
  return localClassList;
});

/**
 * Defines a list of disabled options by types given in "disabledPrimitiveOptions" prop
 * @function
 * @returns {Array} options
 */
const disabledPrimitiveOptionsConverted = computed(() => {
  if (!disabledPrimitiveOptions.value) return null;

  return disabledPrimitiveOptions.value.map((disabledOption) => {
    if (Array.isArray(disabledOption)) {
      if (!disabledOption.length) return emptyObjectsPlaceholder.value;

      return disabledOption.join(", ");
    }

    return disabledOption;
  });
});

/**
 * Determines whether to display irregularity of value by "border-color" css-property
 * @function
 * @returns {Object|null} styles
 */
const displayWrongValue = computed(() => {
  return wrongCurrentValue.value ? { borderColor: errorBorderColor.value } : null; 
});

/**
 * Defines styles depending on current options list dropdown state
 * @function
 * @returns {Object|null} styles
 */
const expanded = computed(() => {
  let borderStyles;

  if (chosenToggleAppearanceSide.value === "atop") {
    borderStyles = {
      borderTopLeftRadius: 0, 
      borderTopRightRadius: 0,
    };
  } else {
    borderStyles = {
      borderBottomLeftRadius: 0, 
      borderBottomRightRadius: 0,
    };
  }

  return dropdownActive.value ? borderStyles : null;
});

/**
 * Determines whether to activate loading state by "loading" prop
 * or by internal loading sign
 * @function
 * @returns {boolean} loading
 */
const internalLoading = computed(() => {
  return loading.value;
});

/**
 * Defines mapped list of previously restricted options
 * @function
 * @returns {Array} options
 */
const mappedOptions = computed(() => {
  return restrictedOptions.value.map((restrictedOption) => {
    return JSON.stringify(restrictedOption);
  });
});

/**
 * Defines a list of options filtered by maximal admissible options amount
 * @function
 * @returns {Array} options
 */
const restrictedOptions = computed(() => {
  if (!rawOptions.value) return [];
  
  return optionsCountRestriction.value
   ? rawOptions.value.filter((option, index) => index + 1 <= optionsCountRestriction.value)
   : rawOptions.value;
});

/**
 * Determines length of options list after filtering by
 * maximal admissible options amount
 * @function
 * @returns {number} length
 */
const restrictedOptionsLength = computed(() => {
  return restrictedOptions.value.length;
});

/**
 * Defines "aria-roledescription" attribute of extended multiselect wrapper
 * @function
 * @returns {string} aria-roledescription
 */
const roledescription = computed(() => {
  return multiple.value ? "Multiselect" : "Select";
});

/**
 * Defines "tabindex" attribute of extended multiselect wrapper if needed
 * @function
 * @returns {number} tabindex
 */
const tabindexIfSearch = computed(() => {
  return showSearchField.value ? attrs.tabindex : -1;
});

/**
 * Defines special class which indicates disabled or loading state
 * of extended multiselect wrapper
 * @function
 * @returns {string} class
 */
const wrapperClasses = computed(() => {
  return disabled.value && !internalLoading.value
   ? "extended__multiselect-wrapper--disabled"
   : "extended__multiselect-wrapper";
});

/**
 * Forcibly rolls up dropdown options list by changing "dropdownActive" flag
 * @function
 * @emits extended:rollup-options
 * @param {boolean} value - "dropdownActive" flag
 */
watch(dropdownActive, (value) => {
  if (!value) {
    emitter.value.emit("extended:rollup-options");
  }
});

/**
 * Changes selected options based on external modelValue changes
 * @function
 */
watch(modelValue, () => {
  if (skipNextUpdate.value) {
    skipNextUpdate.value = false;
    return;
  }

  setPreselectedOptionsByModelValue(true);
}, { deep: true });

/**
 * Emits "active" when dropdown options list is active
 * @function
 * @emits active
 */
const activeEmitter = () => {
  const eventData = simpleEvents.value ? null : {
    inputId: inputId.value,
  };

  /**
   * @event active
   * @type {object|null}
   * @property {string} inputId - id of search field set by "id" prop
   */
  emit("active", eventData);
};

/**
 * Emits "close" when dropdown options list is rolled up
 * @function
 * @emits close
 */
const closeEmitter = () => {
  const eventData = simpleEvents.value
   ? selectedOptions.value
   : createEventFields(selectedOptions.value, "options");

  /**
   * @event close
   * @type {object|Array}
   * @property {string} inputId - id of search field set by "id" prop
   * @property {Array} options - array of selected options
   */
  emit("close", eventData);
}

/**
 * Creates payload for events that can be listened by outer listeners
 * @function
 * @param {UnionPropType} field - main payload of event
 * @param {string} fieldName - name of field with main payload of event
 * @returns {object} payload
 */
const createEventFields = (field, fieldName) => {
  const eventFields = {
    inputId: inputId.value,
  };

  Object.defineProperty(eventFields, fieldName, {
    value: field,
    enumerable: true,
  });

  return eventFields;
};

/**
 * Focuses search field if "click" native event was triggered on available element
 * @function
 * @emits extended:field-focus
 * @param {MouseEvent} mouseEvent - MouseEvent instance
 */
const fieldFocus = (mouseEvent) => {
  if (disabled.value) return;

  if (!toggleOptionsBySelect.value) {
    const customFilteredOptions = toggleOptionsRestrictor(mouseEvent);

    if (customFilteredOptions) return;
  }

  const customFilteredCancel = toggleCustomRestrictor(mouseEvent, 2);
  const customFilteredSelf = toggleCustomRestrictor(mouseEvent, 1);
  const filteredHasCancel = toggleDetector(mouseEvent, /^extended__multiselect-cancel_wrapper/i);
  const filteredHasToggle = toggleDetector(mouseEvent, togglePattern);

  if (customFilteredCancel) return;
  if (customFilteredSelf && dropdownActive.value === false) return;
  if (filteredHasCancel.length) return;
  if (filteredHasToggle.length && dropdownActive.value === false) return;

  emitter.value.emit("extended:field-focus");
};

/**
 * Initialises options list loading by external async method
 * @function
 * @param {string} pattern - value of search field
 * @param {boolean} initialValue - preselected options flag
 */
const loadOptionsByExternalLoader = (pattern, initialValue) => {
  externalOptionsLoader.value = options.value;
  options.value(pattern).then(options => {
    rawOptions.value = options;
    if (initialValue) setPreselectedOptionsByConditions();
  });
};

/**
 * Makes removal of selected options based on external modelValue changes
 * @function
 * @param {boolean} single - "multiple" prop flag
 */
const removeSelectedOptions = (single = false) => {
  if (!single) {
    const modelValueMapped = modelValue.value.map((option) => {
      return JSON.stringify(option);
    });

    selectedOptions.value = selectedOptions.value.filter((option) => {
      return modelValueMapped.includes(JSON.stringify(option));
    });
  } else {
    if (!modelValue.value) cancel();
  }
}

/**
 * Emits event whose listener resets index of "enter" key pressing
 * @function
 * @emits extended:reset-index
 */
const resetEnterIndex = () => {
  emitter.value.emit("extended:reset-index");
};

/**
 * Rolls up dropdown options list
 * @function
 * @emits extended:rollup-options
 */
const rollUp = () => {
  dropdownActive.value = false;
  emitter.value.emit("extended:rollup-options");
};

/**
 * Rolls up dropdown options lists of other instances
 * @function
 * @emits extended:rollup-instances
 */
const rollupInstanses = () => {
  localEmitter.emit("extended:rollup-instances", extendedMultiselectWrapper.value);
};

/**
 * Triggers selection of option by "enter" key pressing
 * @function
 * @emits extended:select-enter
 * @param {KeyboardEvent} keyboardEvent - KeyboardEvent instance
 */
const selectByEnter = (keyboardEvent) => {
  emitter.value.emit("extended:select-enter", keyboardEvent);
};

/**
 * Sets preselected option provided by "preselectedOption" prop
 * @function
 * @emits extended:select-option
 * @param {UnionPropType} preselectedOption - option to be selected
 * @param {boolean} restriction - restriction of preselected option
 */
const setPreselectedOption = (preselectedOption, restriction = true) => {
  const availableOptionType = optionTypeRestrictor(preselectedOption);
  const mappedSelectedOptions = selectedOptions.value.map((selectedOption) => {
    return JSON.stringify(selectedOption);
  });
        
  if (!availableOptionType) return;
  if (
    (!mappedOptions.value.includes(JSON.stringify(preselectedOption)) && restriction)
    && !mappedSelectedOptions.includes(JSON.stringify(preselectedOption))
  ) {
    if (showInsertWarnings.value) {
      console.warn("vue-extended-multiselect: option in «preselectedOption» property should be the same as analogue in «options» property");
    }

    return;
  }

  const isObjectOrArray = typeof preselectedOption === "object";
  const label = createLabel(isObjectOrArray, preselectedOption);

  emitter.value.emit("extended:select-option", {
    label,
    option: preselectedOption,
  });
};

/**
 * Sets preselected options provided by "preselectedOptions" prop 
 * if "multiple" prop equals true
 * @function
 * @emits extended:select-option
 * @param {Array} preselectedOptions - options to be selected
 * @param {boolean} restriction - restriction of preselected options
 */
const setPreselectedOptions = async (preselectedOptions, restriction = true) => {
  let allOptionsWereSelected = 0;
  const mappedSelectedOptions = selectedOptions.value.map((selectedOption) => {
    return JSON.stringify(selectedOption);
  });

  preselectedOptions.forEach((preselectedOption) => {
    const availableOptionType = optionTypeRestrictor(preselectedOption);

    if (!preselectedOption || !availableOptionType) return;
    if (selectedOptions.value.includes(preselectedOption)) return;

    if (
      (mappedOptions.value.includes(JSON.stringify(preselectedOption)) || !restriction)
      && !mappedSelectedOptions.includes(JSON.stringify(preselectedOption))
    ) {
      const isObjectOrArray = typeof option === "object";
      const label = createLabel(isObjectOrArray, preselectedOption);

      allOptionsWereSelected++;

      emitter.value.emit("extended:select-option", {
        label,
        option: preselectedOption,
      });
    }
  });

  if (allOptionsWereSelected !== preselectedOptions.length && showInsertWarnings.value) {
    console.warn("vue-extended-multiselect: options in «preselectedOptions» property should be the same as analogues in «options» property");
  }
};

/**
 * Determines conditions that control preselected options installattion
 * if "modelValue" prop is defined
 * @function
 * @emits update:wrapper
 * @param {boolean} withRemoval - removal of selected options flag
 */
const setPreselectedOptionsByModelValue = (withRemoval = false) => {
  if (!modelValue.value && !withRemoval) return;

  if (withRemoval) selectedOptionsWatcher.value();

  if (multiple.value) {
    if (withRemoval) removeSelectedOptions();

    setPreselectedOptions(modelValue.value, false);
  } else {
    if (withRemoval) removeSelectedOptions(true);

    setPreselectedOption(modelValue.value, false);
  }

  if (withRemoval) {
    updateModelValue();

    skipNextUpdate.value = true;

    selectedOptionsWatcher.value = watch(selectedOptions, (value) => {
      updateModelValue();

      if (resetSearchByValue.value) {
        emitter.value.emit("extended:clear-field");
      }
    }, { deep: true });
  }
}

/**
 * Determines conditions that control preselected options installattion
 * by "preselectedOption" and "preselectedOptions" props
 * @function
 */
const setPreselectedOptionsByConditions = () => {
  if (preselectedOption.value && !multiple.value) {
    setPreselectedOption(preselectedOption.value);

    if (selectedOptions.value.length) {
      updateModelValue();
    }
  }

  if (preselectedOptions.value && multiple.value) {
    const initialLength = selectedOptions.value.length;

    setPreselectedOptions(preselectedOptions.value);

    if (initialLength !== selectedOptions.value.length) {
      updateModelValue();
    }
  }
};

/**
 * Defines a position of dropdown appearance
 * @function
 * @returns {string} position
 */
const toggleAppearanceRestrictor = () => {
  if (!window) return "under";

  const innerHeight = window.innerHeight;
  const offsetTop = extendedMultiselect.value
   ? extendedMultiselect.value.getBoundingClientRect().y
   : 0;
  const difference = innerHeight - offsetTop;

  if (difference > toggleMaxHeight.value) {
    return "under";
  } else {
    return "atop";
  }
};

/**
 * Sets a position of dropdown appearance
 * @function
 */
const toggleAppearanceRestrictorActivate = () => {
  if (!dropdownActive.value) {
    chosenToggleAppearanceSide.value = toggleAppearanceSide.value !== "auto"
     ? toggleAppearanceSide.value
     : toggleAppearanceRestrictor();
  }
};

/**
 * Restricts toggling of dropdown options list
 * @function
 * @emits extended:skip-block-blur
 * @param {MouseEvent} mouseEvent - MouseEvent instance
 * @returns {boolean} toggling
 */
 const toggleBlockRestrictor = (mouseEvent) => {
  let generalRestriction;
  let filteredCustomSelf;
  const filteredHasBlock = toggleDetector(mouseEvent, /^extended__multiselect-block/i, true);
  const filteredHasSlot = toggleDetector(mouseEvent, /^extended__multiselect-options(?!_option)/i, true)
  const filteredSelf = toggleDetector(mouseEvent, /^extended__multiselect-clear/i, true);

  if (filteredSelf.length || filteredHasBlock.length || filteredHasSlot.length) {
    filteredCustomSelf = true;
  } else {
    filteredCustomSelf = toggleCustomRestrictor(mouseEvent);
  }

  if (extendedMultiselectToggle.value) {
    generalRestriction = (filteredHasBlock.length && dropdownActive.value && filteredCustomSelf)
     || (filteredSelf.length && dropdownActive.value && filteredCustomSelf)
     || (filteredHasSlot.length && dropdownActive.value && filteredCustomSelf);
  } else {
    generalRestriction = (filteredHasBlock.length && dropdownActive.value)
     || (filteredSelf.length && dropdownActive.value)
     || (filteredHasSlot.length && dropdownActive.value);
  }
  
  if (generalRestriction) {
    emitter.value.emit("extended:skip-block-blur");
    return true;
  }

  return false;
}

/**
 * Restricts toggling of dropdown options list by clicking
 * on particular descendants of toggle wrapper element
 * @function
 * @param {MouseEvent} mouseEvent - MouseEvent instance
 * @param {number} blockType - type of block which needs restriction
 * @returns {boolean} restriction
 */
const toggleCustomRestrictor = (mouseEvent, blockType) => {
  let eventTarget = mouseEvent.target;
  const toggleWrapper = extendedMultiselect.value;
  const customToggle = toggleWrapper.children[blockType];
     
  while(eventTarget) {
    if (eventTarget === customToggle) return true;

    eventTarget = eventTarget.parentNode;
  }

  return false;
};

/**
 * Restricts toggling of dropdown options list by clicking
 * on particular elements defined by given pattern
 * @function
 * @param {MouseEvent} mouseEvent - MouseEvent instance
 * @param {string} pattern - pattern with block class partial name
 * @param {boolean} mode - marks whether restrict by parent element or by current target
 * @returns {Array} classes
 */
const toggleDetector = (mouseEvent, pattern, mode) => {
  let target = mouseEvent.target;
  const optionPattern = /^extended__multiselect-options_option/i;

  let filteredHasToggle = Array.prototype.filter.call(target.classList, (className) => {
    return pattern.test(className) === true;
  });

  while(
    target
    && (target.classList 
      && !target.classList.contains("extended__multiselect-wrapper")
      || target.classList 
      && !target.classList.length)
    && mode
    && !filteredHasToggle.length
  ) {
    filteredHasToggle = Array.prototype.filter.call(target.classList, (className) => {
      return pattern.test(className) === true;
    });

    if (target.classList.contains("extended__multiselect-options_container")) {
      filteredHasToggle.push("extended__multiselect-options_container");
      return filteredHasToggle;
    }

    if (target.classList.contains("extended__multiselect-toggle_wrapper")) {
      filteredHasToggle.push("extended__multiselect-toggle_wrapper");
      return filteredHasToggle;
    }

    target = target.parentNode;
  }

  return filteredHasToggle;
};

/**
 * Toggles dropdown options list and activates
 * necessary methods with relevant events
 * @function
 */
const toggleOptions = () => {
  if (internalLoading.value || disabled.value) return;

  toggleAppearanceRestrictorActivate();

  if (!dropdownActive.value) {
    activeEmitter();
  } else {
    closeEmitter();
  }

  dropdownActive.value = !dropdownActive.value;
};

/**
 * Prevents toggling dropdown options list
 * by selecting/deselecting option
 * @function
 * @param {MouseEvent} mouseEvent - MouseEvent instance
 * @returns {boolean} restriction 
 */
const toggleOptionsRestrictor = (mouseEvent) => {
  try {
    let eventTarget = mouseEvent.target;
    const optionsWrapper = optionsWrapper.value;

    while(eventTarget) {
      if (eventTarget === optionsWrapper) return true;

      eventTarget = eventTarget.parentNode;
    }

    return false;
  } catch(e) {
    return false;
  }
};

/**
 * Collects restrictions from other methods and defines
 * general restriction of toggling dropdown options list
 * @function
 * @emits extended:skip-blur
 * @param {MouseEvent} mouseEvent - MouseEvent instance
 */
const toggleRestrictor = (mouseEvent) => {
  rollupInstanses();

  const targetContentBlock = toggleBlockRestrictor(mouseEvent);

  if (targetContentBlock) return;

  const filteredHasToggle = toggleDetector(mouseEvent, togglePattern);

  if (filteredHasToggle.length && dropdownActive.value) {

    emitter.value.emit("extended:skip-blur");
  }
};

/**
 * Triggers modelValue updating when v-model has 
 * been changed programmatically
 * @function
 * @emits update:modelValue
 */
const updateModelValue = () => {
  if (multiple.value) {
    emit("update:modelValue", selectedOptions.value);
  } else {
    emit("update:modelValue", selectedOptions.value[0]);
  }
}

/**
 * "onBeforeMount" hook of the Vue3ExtendedMultiselect component
 * @emits select
 * @emits clean
 * @emits option-created
 * @emits increase
 * @emits pattern-changed
 * @emits extended:rollup-options
 * @listens extended:rollup-options
 * @listens extended:toggle-options
 * @listens extended:select-option
 * @listens extended:deselect-option
 * @listens extended:clean-options
 * @listens extended:create-option
 * @listens extended:increase-display
 * @listens extended:search-pattern-changed
 */
onBeforeMount(() => {
  selectedOptionsWatcher.value = watch(selectedOptions, (value) => {
    updateModelValue();

    if (resetSearchByValue.value) {
      emitter.value.emit("extended:clear-field");
    }
  }, { deep: true });

  chosenToggleAppearanceSide.value = toggleAppearanceSide.value;

  emitter.value.on("extended:rollup-options", () => {
    if (!dropdownActive.value) return;

    closeEmitter();
    dropdownActive.value = false;
  });

  emitter.value.on("extended:toggle-options", () => {
    toggleOptions();
  });

  emitter.value.on("extended:select-option", (option) => {
    const eventData = simpleEvents.value
     ? option.option
     : createEventFields(option.option, "option");

    if (multiple.value) {
      selectedOptions.value.push(option.option);
      /**
       * @event select
       * @type {Object}
       * @property {string} inputId - id of search field set by "id" prop
       * @property {UnionPropType} option - just now selected option
       */
      emit("select", eventData);
    } else {
      selectedOptions.value = [option.option];
      /**
       * @see select
       */
      emit("select", eventData);
    }
  });

  emitter.value.on("extended:deselect-option", (payload) => {
    if (multiple.value && (payload && !payload.clearAll)) {
      const deselectedOption = selectedOptions.value[payload.index];

      const eventData = simpleEvents.value
       ? deselectedOption 
       : createEventFields(deselectedOption, "option");
  
      /**
       * @event clean
       * @type {Object}
       * @property {string} inputId - id of search field set by "id" prop
       * @property {UnionPropType} option - just now deselected option
       */
      emit("clean", eventData);

      selectedOptions.value.splice(payload.index, 1);
      return;
    } else {
      selectedOptions.value = [];
    }
    
    if (toggleOptionsBySelect.value) {
      emitter.value.emit("extended:rollup-options");
    }
  });

  emitter.value.on("extended:clean-options", (selectedOptions) => {
    const eventData = simpleEvents.value
     ? selectedOptions.value 
     : createEventFields(selectedOptions, "options");

    /**
     * @see clean
     * @property {Array} options - just now deselected options
     */
    emit("clean", eventData);
  });

  emitter.value.on("extended:create-option", (createdOption) => {
    const eventData = simpleEvents.value
     ? createdOption
     : createEventFields(createdOption, "option");

    /**
     * @event option-created
     * @type {PluginObject}
     * @property {string} inputId - id of search field set by "id" prop
     * @property {UnionPropType} option - option created by user
     */
    emit("option-created", eventData);
  });

  emitter.value.on("extended:increase-display", (limit) => {
    const eventData = simpleEvents.value ? limit : createEventFields(limit, "limit");

    /**
     * @event increase
     * @type {Object}
     * @property {string} inputId - id of search field set by "id" prop
     * @property {limit} - current limit of options to be shown next
     */
    emit("increase", eventData);
  });

  emitter.value.on("extended:search-pattern-changed", (pattern) => {
    const eventData = simpleEvents.value
     ? pattern 
     : createEventFields(pattern, "pattern");

    /**
     * @event pattern-changed
     * @type {Object}
     * @property {string} inputId - id of search field set by "id" prop
     * @property {pattern} - pattern of internal search for available options
     */
    emit("pattern-changed", eventData);
  });
});

/**
 * "onMounted" hook of the Vue3ExtendedMultiselect component
 * @listens extended:expand-options
 * @listens extended:rollup-instances
 * @listens extended:loader-pattern-changed
 */
onMounted(() => {
  if (typeof options.value === "function") {
    loadOptionsByExternalLoader(null, true);
  } else {
    rawOptions.value = options.value;
    setPreselectedOptionsByConditions();
  }

  setPreselectedOptionsByModelValue();

  if (
    defaultExpanded.value
    && !disabled.value
    && typeof options.value !== "function"
  ) {
    dropdownActive.value = true;
  }

  emitter.value.on("extended:expand-options", () => {
    if (dropdownActive.value === true) return;
      
    toggleAppearanceRestrictorActivate();
    activeEmitter();

    dropdownActive.value = true;
  });

  emitter.value.on("extended:loader-pattern-changed", (pattern) => {
    loadOptionsByExternalLoader(pattern, false);
  });

  clickOutside.value.init(extendedMultiselectWrapper.value, () => {
    emitter.value.emit("extended:rollup-options");
  });

  localEmitter.on("extended:rollup-instances", (instanceRef) => {
    if (instanceRef !== extendedMultiselectWrapper.value) {
      emitter.value.emit("extended:rollup-options");
    }
  });
});

defineExpose({
  optionCreateLabel,
});
</script>

<style>

@import "../styles/main.css";

</style>