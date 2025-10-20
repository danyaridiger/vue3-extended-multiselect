<template>
  <div
    aria-label="Toggle options list"
    role="switch"
    :aria-checked="dropdownActive"
    :class="toggleSlotClass"
    :tabindex="increasedTabindex"
    @click.stop.left="toggleOptionsList"
    @click.stop.middle="toggleOptionsList"
    @keypress.stop="toggleOptionsList($event)"
  >
    <component v-if="!loading" :class="classesSummary" :is="icon" :key="icon" />
    <extended-multiselect-loader
      v-else
      :icon-filter="loaderIconFilter"
      :icon-size="iconSize"
    />
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="0"
      height="0"
    >
      <defs>
        <filter x="0" y="0" width="1" height="1" id="basicFilter">
          <feFlood flood-color="#BDBDBD" />
          <feComposite out="SourceGraphic" in2="SourceGraphic" operator="in" />
        </filter>
        <filter x="0" y="0" width="1" height="1" id="blackFilter">
          <feFlood flood-color="#000000" />
          <feComposite out="SourceGraphic" in2="SourceGraphic" operator="in" />
        </filter>
        <filter x="0" y="0" width="1" height="1" id="greenFilter">
          <feFlood flood-color="#068504" />
          <feComposite out="SourceGraphic" in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
    </svg>
  </div>
</template>

<script setup>
import { computed, defineProps, toRefs } from "vue";

import useToggle from "../composition/toggle";
import useSizes from "../composition/sizes";

import ExtendedMultiselectLoader from "./ExtendedMultiselectLoader.vue";
import BaseArrowIcon from "../icons/BaseArrowIcon.vue";
import CircleArrowIcon from "../icons/CircleArrowIcon.vue";
import DoubleArrowIcon from "../icons/DoubleArrowIcon.vue";
import InnerArrowIcon from "../icons/InnerArrowIcon.vue";
import TriangleCircleArrowIcon from "../icons/TriangleCircleArrowIcon.vue";
import WideArrowIcon from "../icons/WideArrowIcon.vue";
import TriangleArrowIcon from "../icons/TriangleArrowIcon.vue";

const props = defineProps({
  /**
   * Determines what class to use on toggle slot
   * @default false
   * @property {boolean} disabled
   */
  disabled: {
    type: Boolean,
    default: false,
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
   * Defines a svg-filter for icons
   * @property {string} iconFilter
   */
  iconFilter: {
    type: String,
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
   * Replaces toggle button with loader
   * @property {boolean} loading
   */
  loading: {
    type: Boolean,
    required: true,
  },

  /**
   * Determines toggle icon to be used in default toggle slot
   * @property {string} toggleIcon
   */
  toggleIcon: {
    type: String,
    required: true,
  },

  /**
   * Defines "tabindex" attribute of toggle button
   * @default null
   * @property {number|null} tabindex
   */
  tabindex: {
    type: Number,
    default: null,
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

const {
  disabled,
  dropdownActive,
  emitter,
  iconFilter,
  loaderIconFilter,
  iconSize,
  loading,
  tabindex,
  toggleIcon,
} = toRefs(props);

const { toggleSlotClass, toggleOptionsList } = useToggle(loading, disabled, emitter);
const { iconSizeClass } = useSizes(iconSize);

/**
 * Defines a list of toggle button classes
 * @function
 * @returns {Array} classes
 */
const classesSummary = computed(() => {
  return [iconFilterClass.value, iconSizeClass.value, iconFilterRotationClass.value];
});

/**
 * Determines kind of toggle icon based on
 * "toggleIcon" prop
 * @function
 * @returns {string} icon
 */
const icon = computed(() => {
  switch (toggleIcon.value) {
    case "base-arrow":
      return BaseArrowIcon;
    case "double-arrow":
      return DoubleArrowIcon;
    case "wide-arrow":
      return WideArrowIcon;
    case "circle-arrow":
      return CircleArrowIcon;
    case "inner-arrow":
      return InnerArrowIcon;
    case "triangle-arrow":
      return TriangleArrowIcon;
    case "triangle-circle-arrow":
      return TriangleCircleArrowIcon;
    default:
      return BaseArrowIcon;
  }
});

/**
 * Defines svg-filter for toggle icon
 * @function
 * @returns {string} svg-filter
 */
const iconFilterClass = computed(() => {
  const basicFilter = "extended__multiselect-filter";

  switch (iconFilter.value) {
    case "basic":
      return `${basicFilter}_basic`;
    case "black":
      return `${basicFilter}_black`;
    case "green":
      return `${basicFilter}_green`;
    default:
      return `${basicFilter}_basic`;
  }
});

/**
 * Defines rotation class of toggle icon based on
 * "dropdownActive" prop
 * @function
 * @returns {string} class
 */
const iconFilterRotationClass = computed(() => {
  return dropdownActive.value
    ? "extended__multiselect-toggle--active"
    : "extended__multiselect-toggle--locked";
});

/**
 * Sets "tabindex" attibute of toggle button based on
 * given tabindex
 * @function
 * @returns {number} tabindex
 */
const increasedTabindex = computed(() => {
  return tabindex.value ? tabindex.value + 1 : 0;
});
</script>
