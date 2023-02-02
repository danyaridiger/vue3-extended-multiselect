<template>
  <div v-if="showSearchField">
    <input
      aria-controls="extended-search-field"
      ref="extendedInput"
      type="text"
      :accesskey="attrs.accesskey"
      :autocomplete="attrs.autocomplete"
      :class="searchFieldClass"
      :disabled="disabled"
      :id="inputId"
      :name="attrs.name"
      :placeholder="appropriatePlaceholder"
      :spellcheck="attrs.spellcheck"
      :tabindex="attrs.tabindex"
      :translate="attrs.translate"
      v-model="searchValue"
      @blur.prevent="rollUp"
      @focus.prevent="expand"
      @input="search"
    />
    <div
      class="extended__multiselect-block"
      v-show="!searchFieldForwarding && !multiple"
      @click.stop="expand"
    >
      <slot 
        name="labelBlock"
        :label-block-value="singleLabel"
      >
        <span>{{ singleLabel }}</span>
      </slot>
    </div>
    <extended-multiselect-multiple
      v-show="multiple && !!selectedOptions.length"
      :style="multipleBlocksMargin"
      :disabled="disabled"
      :loading="loading"
      :icon-filter="iconFilter"
      :show-deselect-icon-loader="showDeselectIconLoader"
      :toggle-multiple-blocks-limit="toggleMultipleBlocksLimit"
      :empty-objects-placeholder="emptyObjectsPlaceholder"
      :label="label"
      :multiple-blocks-limit-message="multipleBlocksLimitMessage"
      :theme-type="themeType"
      :increase-display-by="increaseDisplayBy"
      :multipleBlocksLimit="multipleBlocksLimit"
      :selected-options="selectedOptions"
      :emitter="emitter"
      :create-custom-option-label="createCustomOptionLabel"
    >
      <template #optionBlock="{ label, deselectBlock, index }">
        <slot 
          name="optionBlock"
          :label="label"
          :index="index"
          :deselect-block="deselectBlock"
        >
        </slot>
      </template>
      <template #maxElements>
        <slot name="maxElements"></slot>
      </template>
      <template
        v-if="toggleMultipleBlocksLimit"
        #showMore="{ showMoreOptions }"
      >
        <slot 
          name="showMore"
          :show-more-options="showMoreOptions"
        >
        </slot>
      </template>
    </extended-multiselect-multiple>
  </div>
  <div v-else-if="!showSearchField && multiple">
    <extended-multiselect-multiple
      :disabled="disabled"
      :loading="loading"
      :icon-filter="iconFilter"
      :show-deselect-icon-loader="showDeselectIconLoader"
      :toggle-multiple-blocks-limit="toggleMultipleBlocksLimit"
      :empty-objects-placeholder="emptyObjectsPlaceholder"
      :label="label"
      :multiple-blocks-limit-message="multipleBlocksLimitMessage"
      :theme-type="themeType"
      :increase-display-by="increaseDisplayBy"
      :multipleBlocksLimit="multipleBlocksLimit"
      :selected-options="selectedOptions"
      :emitter="emitter"
      :create-custom-option-label="createCustomOptionLabel"
    >
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
        v-if="toggleMultipleBlocksLimit"
        #showMore="{ showMoreOptions }"
      >
        <slot 
          name="showMore"
          :show-more-options="showMoreOptions"
        ></slot>
      </template>
    </extended-multiselect-multiple>
    <input
      class="extended__multiselect-input--hidden"
      ref="extendedInput"
      type="text"
      @blur.prevent="rollUp"
      @focus.prevent="expand"
    />
  </div>
  <div
    class="extended__multiselect-block"
    v-else
  >
    <slot
      name="labelBlock"
      :label-block-value="singleLabel"
    >
      <span>{{ singleLabel }}</span>
    </slot>
    <input
      class="extended__multiselect-input--hidden"
      ref="extendedInput"
      type="text"
      @blur.prevent="rollUp"
      @focus.prevent="expand"
    />
  </div>
</template>

<script setup>
import {
  computed,
  defineProps,
  inject,
  nextTick,
  onBeforeMount,
  onMounted,
  ref,
  toRef,
  toRefs,
  useAttrs,
  watch,
} from "vue";

import { debounce } from "lodash-es";

import ExtendedMultiselectMultiple from "./ExtendedMultiselectMultiple.vue";

const props = defineProps({
  /**
   * Determines whether to take search value from current
   * selected option if "multiple" prop equals false
   * @property {boolean} autoSelectSearchValue
   */
  autoSelectSearchValue: {
    type: Boolean,
    required: true,
  },

  /**
   * Determines which placeholder to use
   * depending on the options creation mode
   * @property {boolean} createOnTheGo
   */
  createOnTheGo: {
    type: Boolean,
    required: true,
  },

  /**
   * Blocks search field
   * @property {boolean} disabled
   */
  disabled: {
    type: Boolean,
    required: true,
  },

  /**
   * Determines whether option list expanded or not
   * @property {boolean} dropdownActive
   */
  dropdownActive: {
    type: Boolean,
    required: true,
  },
    
  /**
   * Provides "loading" state of component
   * to ExtendedMultiselectMultiple child component
   * @property {boolean} loading
   */
  loading: {
    type: Boolean,
    required: true,
  },
    
  /**
   * Determines whether to use ExtendedMultiselectMultiple 
   * child component and some other related functionality
   * @property {boolean} multiple
   */
  multiple: {
    type: Boolean,
    required: true,
  },

  /**
   * Renews the pattern of internal search for available options
   * @property {boolean} searchFilterActive
   */
  searchFilterActive: {
    type: Boolean,
    required: true,
  },

  /**
   * Determines whether to show search field
   * @property {boolean} showSearchField
   */
  showSearchField: {
    type: Boolean,
    required: true,
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
   * Determines whether to allow user to increase limit of shown 
   * elements with selected options by special icon
   * @property {boolean} toggleMultipleBlocksLimit
   */
  toggleMultipleBlocksLimit: {
    type: Boolean,
    required: true,
  },

  /**
   * Determines whether to roll up options list
   * by option selection
   * @property {boolean} toggleOptionsBySelect
   */
  toggleOptionsBySelect: {
    type: Boolean,
    required: true,
  },

  /**
   * Determines whether to clear value of search field
   * after next switch of search field display
   * @property {boolean} togglingSavesSearchValue
   */
  togglingSavesSearchValue: {
    type: Boolean,
    required: true,
  },

  /**
   * Placeholder which will be shown
   * if "createOnTheGo" prop equals true
   * @property {string} createOptionPlaceholder
   */
  createOptionPlaceholder: {
    type: String,
    required: true,
  },

  /**
   * Placeholder used in internal options filters
   * and provided to ExtendedMultiselectMultiple child component
   * @property {string} emptyObjectsPlaceholder
   */
  emptyObjectsPlaceholder: {
    type: String,
    required: true,
  },

  /**
   * Defines a svg-filter for icons
   * @property {string} iconFilter
   */
  iconFilter: {
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
   * "placeholder" attribute for search field
   * @property {string} placeholder
   */
  placeholder: {
    type: String,
    required: true,
  },
    
  /**
   * Provides current theme of extended multiselect
   * to ExtendedMultiselectMultiple child component
   * @property {string} themeType
   */
  themeType: {
    type: String,
    required: true,
  },

  /**
   * Provides limit of hidden options amount to be shown next
   * @property {number} increaseDisplayBy
   */
  increaseDisplayBy: {
    type: Number,
    required: true,
  },

  /**
   * Provides limit of multiple option blocks amount
   * to ExtendedMultiselectMultiple child component
   * @default null
   * @property {number} multipleBlocksLimit
   */
  multipleBlocksLimit: {
    type: Number,
    default: null,
  },

  /**
   * Provides list of selected options
   * to ExtendedMultiselectMultiple child component
   * @property {Array} selectedOptions
   */
  selectedOptions: {
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
   * Provides function that creates custom label for
   * block with selected option to ExtendedMultiselectMultiple 
   * child component
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
   * Provides function that creates limit message for maximal of selected
   * options to ExtendedMultiselectMultiple child component
   * @property {Function} multipleBlocksLimitMessage
   */
  multipleBlocksLimitMessage: {
    type: Function,
    required: true,
  },

  /**
   * "id" attribute of search field
   * @default null
   * @property {string|number} inputId
   */
  inputId: {
    type: [String, Number],
    default: null,
  },
});

const searchState = inject("searchState");
const setSearchValue = inject("setSearchValue");
const setSearchPattern = inject("setSearchPattern");

const emitter = toRef(props, "emitter");

const blurSkip = ref(false);
const reversePrevented = ref(false);
const searchFieldFocused = ref(false);
const optionWillBeTriggered = ref(false);
const searchValue = ref("");
const singleLabel = ref("");
const blurSkipByToggleIcon = ref(0);
const blurSkipByBlock = ref(0);
const labelBlocks = ref([]);
const searchDebounce = ref(debounce(() => {
  const searchPattern = searchValue.value ? new RegExp(`${searchValue.value}`, "i") : null;
        
  if (externalOptionsLoader.value) {
    emitter.value.emit("extended:loader-pattern-changed", searchValue.value);
  } else {
    emitter.value.emit("extended:search-pattern-changed", searchValue.value);
    setSearchPattern(searchPattern);
  }
}, 250));

/**
 * Element references
 */
const extendedInput = ref(null);

const {
  autoSelectSearchValue,
  createOnTheGo,
  createOptionPlaceholder,
  disabled,
  externalOptionsLoader,
  increaseDisplayBy,
  multiple,
  placeholder,
  searchFilterActive,
  showSearchField,
  toggleOptionsBySelect,
  togglingSavesSearchValue,
} = toRefs(props);

const attrs = useAttrs();

/**
 * Defines "placeholder" attribute of search field
 * @function
 * @returns {string} placeholder
 */
const appropriatePlaceholder = computed(() => {
  return createOnTheGo.value ? createOptionPlaceholder.value : placeholder.value;
});

/**
 * Sets "margin-top" css property to multiple option blocks
 * if search field is shown
 * @function
 * @returns {Object|null} margin-top
 */
const multipleBlocksMargin = computed(() => {
  return searchFieldForwarding.value ? { marginTop: "4px" } : null;
});

/**
 * Defines classes of search field
 * @function
 * @returns {Array} classes
 */
const searchFieldClass = computed(() => {
  const mainClass = searchFieldForwarding.value
   ? "extended__multiselect-input"
   : "extended__multiselect-input--hidden";
  const searchFieldClasses = [];

  if (optionWillBeTriggered.value) {
    searchFieldClasses.push("extended__multiselect-input--trigger-option");
  }

  searchFieldClasses.push(mainClass);
      
  return searchFieldClasses;
});

/**
 * Determines whether to show search field
 * over element with selected option
 * @function
 * @returns {boolean} display
 */
const searchFieldForwarding = computed(() => {
  return searchFieldFocused.value || optionWillBeTriggered.value;
});

/**
 * Determines whether option shall be triggered before selection
 * @function
 * @emits extended:renew-field-forwarding
 * @param {boolean} searchFieldForwarding - restrictor of triggered option 
 */
watch(searchFieldForwarding, (value) => {
  if (value && autoSelectSearchValue.value && !multiple.value && singleLabel.value) {
    searchValue.value = singleLabel.value;
  }
  emitter.value.emit("extended:renew-field-forwarding", value);
});

/**
 * Sets pattern of internal search for available options from search field to store
 * @function
 * @param {string} pattern - pattern of internal search for available options
 */
watch(searchState, (prevState, state) => {
  if (state.searchPattern === prevState.searchPattern) return;

  if (searchFilterActive.value) {
    setSearchPattern(state.pattern);
  }
}, { deep: true });

/**
 * Sets value of search field from search field to store
 * @function
 * @param {string} value - value of search field
 */
watch(searchValue, (value) => {
  if (searchFilterActive.value) {
    setSearchValue(value);
  }
});

/**
 * Expands options list
 * @function
 * @emits extended:expand-options
 */
const expand = () => {
  if (disabled.value) return;
      
  searchFieldFocused.value = true;
  emitter.value.emit("extended:expand-options");
};

/**
 * Describes behavour of input blur event
 * when "multiple" prop equals true
 * @function
 */
const multipleBlur = () => {
  if (!multiple.value) {
    searchFieldFocused.value = false;
    return;
  }

  if (blurSkipByBlock.value < 1) {
    searchFieldFocused.value = false;
  }
};

/**
 * Rolls up options list if it needed
 * @function
 * @emits extended:rollup-options
 */
const rollUp = () => {
  if (disabled.value) return;

  multipleBlur();

  if (!togglingSavesSearchValue.value) {
    searchValue.value = "";
    setSearchValue(null);
    setSearchPattern(null);
  }

  if (blurSkipByToggleIcon.value > 0) {
    blurSkipByToggleIcon.value = 0;
    return;
  }

  if (blurSkipByBlock.value > 0) {
    blurSkipByBlock.value = 0;
    return;
  }

  blurSkip.value = true;
  blurSkipByBlock.value = 0;
  blurSkipByToggleIcon.value = 0;

  emitter.value.emit("extended:rollup-options", true);
};

/**
 * Activates debounced version of options list filter
 * @function
 */
const search = () => {
  searchDebounce.value();
};

/**
 * "onBeforeMount" hook of the ExtendedMultiselectInput component
 * @listens extended:field-focus
 * @listens extended:rollup-options
 * @listens extended:select-option
 * @listens extended:deselect-option
 * @listens extended:clean-options
 * @listens extended:clear-field
 * @listens extended:skip-blur
 * @listens extended:skip-block-blur
 * @listens extended:skip-block-blur-zeroing
 * @listens extended:trigger-selection
 */
onBeforeMount(() => {
  emitter.value.on("extended:rollup-options", (internalRollup) => {
    if (blurSkip.value === true) {
      blurSkip.value = false;
      return;
    }

    if (internalRollup) {
      return;
    }
      
    rollUp();
  });

  emitter.value.on("extended:select-option", (option) => {

    if (toggleOptionsBySelect.value) {
      rollUp();
    }

    if (multiple.value) {
      return;
    } else {
      singleLabel.value = option.label;
    }
  });

  emitter.value.on("extended:deselect-option", () => {
    if (multiple.value) {
      return;
    } else {
      singleLabel.value = "";
    }
  });

  emitter.value.on("extended:clean-options", () => {
    searchValue.value = null;
  });

  emitter.value.on("extended:clear-field", () => {
    searchValue.value = null;
  });

  emitter.value.on("extended:skip-blur", () => {
    blurSkipByToggleIcon.value++;
  });

  emitter.value.on("extended:skip-block-blur", () => {
    blurSkipByBlock.value++;
  });

  emitter.value.on("extended:skip-block-blur-zeroing", () => {
    blurSkipByBlock.value = 0;
  });

  emitter.value.on("extended:trigger-selection", (triggerState) => {
    if (!toggleOptionsBySelect.value) {
      searchFieldFocused.value = false;
    }
    optionWillBeTriggered.value = triggerState;
  });
});

/**
 * "onMounted" hook of the ExtendedMultiselectInput component
 * @listens extended:field-focus
 */
onMounted(() => {
  emitter.value.on("extended:field-focus", () => {
    if (showSearchField.value) {
      nextTick(() => {
        extendedInput.value.focus();
      });
    } else {
      extendedInput.value.focus();
    }
  });
});
</script>