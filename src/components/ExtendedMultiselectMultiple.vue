<template>
  <div class="extended__multiselect-block extended__multiselect-block--multiple">
    <span
      v-if="placeholderBlockShown"
      class="extended__multiselect-placeholder"
    >
      {{ appropriatePlaceholder }}
    </span>
    <div>
      <slot
        name="multipleBlocks"
        :selected-options="limitRestriction"
        :deselect-block="deselectBlock"
      >
        <div
          v-for="(option, index) in limitRestriction"
          :key="index"
        >
          <slot
            name="optionBlock"
            :label="optionCreateLabel(option)"
            :index="index"
            :deselect-block="deselectBlock"
          >
            <div :class="classes">
              <span>{{ optionCreateLabel(option) }}</span>
              <div 
                :class="deselectClasses" 
                @click.stop="deselectBlock(index)"
              >
                <CancelIcon
                  class="extended__multiselect_deselect-block-icon"
                  v-if="!showLoaderIcon"
                />
                <extended-multiselect-loader
                  v-else
                  :icon-filter="iconFilter"
                  icon-size="deselect"
                />
              </div>
            </div>
          </slot>
        </div>
        <slot
          name="maxElements"
          v-if="optionsLimitAchieved && !toggleMultipleBlocksLimit"
        >
          {{ multipleBlocksLimitMessage(overLimitOptionsCount) }}
        </slot>
        <slot
          name="showMore"
          v-if="optionIncreaserAvailable"
          :show-more-options="showMoreOptions"
        >
          <div 
            :class="[classes, increaserClass]"
            @click.stop="showMoreOptions"
          >
            Show more options
          </div>
        </slot>
      </slot>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  defineProps,
  onBeforeMount,
  ref,
  toRefs,
  watch,
} from "vue";

import useLabels from "../composition/labels";

import ExtendedMultiselectLoader from "./ExtendedMultiselectLoader.vue";
import CancelIcon from "../icons/CancelIcon.vue";

const props = defineProps({
  /**
   * Blocks deselect block button
   * @property {boolean} disabled
   */
  disabled: {
    type: Boolean,
    required: true,
  },

  /**
   * Hides all deselect buttons if equals true
   * @property {boolean} loading
   */
  loading: {
    type: Boolean,
    required: true,
  },

  /**
   * Determines whether to show extended multiselect 
   * placeholder element
   * @property {boolean} placeholderBlockShown
   */
  placeholderBlockShown: {
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
   * Allows to increase limit of displayed selected option blocks
   * @property {boolean} toggleMultipleBlocksLimit 
   */
  toggleMultipleBlocksLimit: {
    type: Boolean,
    required: true,
  },

  /**
   * Defines placeholder for extended multiselect 
   * placeholder element
   * @property {string} appropriatePlaceholder
   */
  appropriatePlaceholder: {
    type: String,
    default: "",
  },

  /**
   * Defines label for blocks with options of type "object"
   * or Array instances which length/keys length equals 0
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
   * Current theme of extended-multiselect
   * used in class definition
   * @property {string} themeType
   */
  themeType: {
    type: String,
    required: true,
  },

  /**
   * Limit of hidden options amount to be shown next
   * @property {number} increaseDisplayBy
   */
  increaseDisplayBy: {
    type: Number,
    required: true,
  },

  /**
   * Limit of option blocks amount
   * @property {number} multipleBlocksLimit
   */
  multipleBlocksLimit: {
    type: Number,
    default: null,
  },

  /**
   * List of selected options that will be shown as option blocks
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
   * Function that creates custom label for
   * block with selected option
   * @property {Function} createCustomOptionLabel
   */
  createCustomOptionLabel: {
    type: Function,
    required: true,
  },

  /**
   * Function that creates limit message for maximal of selected options
   * @property {Function} multipleBlocksLimitMessage
   */
  multipleBlocksLimitMessage: {
    type: Function,
    required: true,
  },
});

const {
  createCustomOptionLabel,
  disabled,
  emitter,
  emptyObjectsPlaceholder,
  label,
  increaseDisplayBy,
  loading,
  showDeselectIconLoader,
  multipleBlocksLimit,
  selectedOptions,
  themeType,
  toggleMultipleBlocksLimit,
} = toRefs(props);

const optionsLimitIncreaser = ref(null);
const increaserClass = ref("extended__multiselect-increaser");

const { optionCreateLabel } = useLabels(
  label, 
  createCustomOptionLabel, 
  emptyObjectsPlaceholder,
);

/**
 * Defines class for every selected option block
 * depends on current theme of extended multiselect
 * @function
 * @returns {string} class
 */
const classes = computed(() => {
  const basicClassName = "extended__multiselect--multiple";

  switch(themeType.value) {
    case "basic":
      return `${basicClassName}-basic`;
    case "slate-grey":
      return `${basicClassName}-slate-grey`;
    case "slate-blue":
      return `${basicClassName}-slate-blue`;
    case "teal":
      return `${basicClassName}-teal`;
    case "strict":
      return `${basicClassName}-strict`;
    default: 
      return `${basicClassName}-basic`;
  }
});

/**
 * Defines class for every deselect/loader icon in multiple
 * option blocks depends on "loading" prop
 * @function
 * @returns {string} class
 */
const deselectClasses = computed(() => {
  return loading.value
   ? "extended__multiselect-block_cancel-wrapper--loading"
   : "extended__multiselect-block_cancel-wrapper";
});

/**
 * Defines current limited amount of displayed option blocks
 * @function
 * @returns {Array} UnionPropType
 */
const limitRestriction = computed(() => {
  if (!optionsLimitIncreaser.value) return selectedOptions.value;

  return selectedOptions.value.filter((_, index) => {
    const limit = typeof optionsLimitIncreaser.value === "number"
     ? optionsLimitIncreaser.value
     : optionsLimitIncreaser.value.value;

    return ++index <= limit;
  });
});

/**
 * Determines whether user can increase limited amount of displayed option blocks
 * @function
 * @returns {boolean} possibility
 */
const optionIncreaserAvailable = computed(() => {
  return toggleMultipleBlocksLimit.value && optionsLimitAchieved.value;
});

/**
 * Determines whether current limit of displayed option blocks amount
 * was reached
 * @function
 * @returns {boolean} reaching
 */
const optionsLimitAchieved = computed(() => {
  return optionsLimitIncreaser.value && selectedOptions.value.length > optionsLimitIncreaser.value;
});

/**
 * Amount of selected options exceeding the limit
 * determined by "multipleBlocksLimit" prop
 * @function
 * @returns {number|null} amount
 */
const overLimitOptionsCount = computed(() => {
  if (selectedOptions.value.length <= optionsLimitIncreaser.value) return null;
  
  return selectedOptions.value.length - optionsLimitIncreaser.value;
});

/**
 * Determines whether to show loader icon if "loading" prop equals true
 * or show multiple option blocks as usual
 * @function
 * @returns {boolean} restriction
 */
const showLoaderIcon = computed(() => {
  return showDeselectIconLoader.value ? loading.value : false;
});

/**
 * If limit of selected options was achieved restricts further
 * extension of options container if "multiple" prop equals true
 * @function
 * @param {Array} - array of selected options
 */
watch(selectedOptions, (value) => {
  if (!value.length || value.length <= multipleBlocksLimit.value) {
    optionsLimitIncreaser.value = multipleBlocksLimit.value;
  }
}, { deep: true });

/**
 * Deselects option by users click on its element cancel icon 
 * if "multiple" prop equals true
 * @function
 * @emits extended:deselect-option
 * @param {number} index - index of deselected option
 */
const deselectBlock = (index) => {
  if (loading.value || disabled.value) return;

  emitter.value.emit("extended:deselect-option", { index });
};

/**
 * Shows next hidden options
 * This behavior restricts by "toggleMultipleBlocksLimit" prop 
 * if "multiple" prop equals true
 * @function
 * @emits extended:increase-display
 */
const showMoreOptions = () => {
  optionsLimitIncreaser.value += increaseDisplayBy.value;
  emitter.value.emit("extended:increase-display", optionsLimitIncreaser.value);
};

/**
 * "onBeforeMount" hook of ExtendedMultiselectMultiple component
 */
onBeforeMount(() => {
  optionsLimitIncreaser.value = multipleBlocksLimit.value;
});
</script>