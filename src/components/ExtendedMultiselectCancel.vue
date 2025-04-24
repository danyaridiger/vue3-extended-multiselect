<template>
  <div
    aria-label="Clear options list"
    role="button"
    :class="classes"
    :tabindex="increasedTabindex"
    @click="cancel"
    @keypress.stop="cancel"
  >
    <cancel-icon
      v-if="!loading"
      :class="iconSizeClass"
    />
    <extended-multiselect-loader
      v-else
      :icon-filter="loaderIconFilter"
      :icon-size="iconSize"
    />
  </div>
</template>

<script setup>
import {
  computed,
  defineProps,
  inject,
  ref,
  toRefs,
} from "vue";

import useCancel from "../composition/cancel";
import useSizes from "../composition/sizes";

import ExtendedMultiselectLoader from "./ExtendedMultiselectLoader.vue";
import CancelIcon from "../icons/CancelIcon.vue";

const props = defineProps({
  /**
   * Blocks cancel button
   * @property {boolean} disabled
   */
  disabled: {
    type: Boolean,
    required: true,
  },

  /**
   * Defines a svg-filter for loader icons
   * @property {string} loaderIconFilter
   */
  loaderIconFilter: {
    type: String,
    required: true,
  },
      
  /**
   * Provides size to create special size-class 
   * for each kind of icon
   * @property {string} iconSize
   */
  iconSize: {
    type: String,
    required: true,
  },

  /**
   * Replaces cancel button with loader
   * @property {boolean} loading
   */
  loading: {
    type: Boolean,
    required: true,
  },

  /**
   * Determines whether to clear current value of search field
   * @property {boolean} showSearchField
   */
  showSearchField: {
    type: Boolean,
    required: true,
  },

  /**
   * Defines "tabindex" attribute of cancel button
   * @default null
   * @property {number|null} tabindex
   */
  tabindex: {
    type: Number,
    default: null,
  },

  /**
   * List of selected options
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
});

const setSearchValue = inject("setSearchValue");
const setSearchPattern = inject("setSearchPattern");

const {
  disabled,
  emitter,
  loaderIconFilter,
  iconSize,
  loading,
  selectedOptions,
  showSearchField,
  tabindex,
} = toRefs(props);

const { cancel } = useCancel(
  disabled,
  showSearchField,
  selectedOptions,
  emitter,
  setSearchValue,
  setSearchPattern,
);
const { iconSizeClass } = useSizes(iconSize);

/**
 * Toggles classes of component if "loading"
 * or "disabled" props equals true
 * @function
 * @returns {string} class
 */
const classes = computed(() => {
  return (loading.value || disabled.value)
   ? "extended__multiselect-cancel--disabled"
   : "extended__multiselect-cancel";
});

/**
 * Sets "tabindex" attibute of clear button based on
 * given tabindex
 * @function
 * @returns {number} tabindex
 */
const increasedTabindex = computed(() => {
  return tabindex.value ? tabindex.value + 2 : 0;
});
</script>
