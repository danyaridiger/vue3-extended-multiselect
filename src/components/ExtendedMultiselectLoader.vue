<template>
  <div class="extended__multiselect-loader">
    <img
      alt=""
      :class="[iconFilterClass, iconSizeClass, 'extended__multiselect-loader-animate']"
      :src="loaderIcon"
    />
    <svg
      version="1.1" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlns:xlink="http://www.w3.org/1999/xlink" 
      width="0" 
      height="0"
    >  
      <defs>
        <filter 
          x="0" 
          y="0" 
          width="1" 
          height="1" 
          id="filterLoaderDefault"
        >
          <feFlood flood-color="#00BFFF"/>
          <feComposite 
            out="SourceGraphic" 
            in2="SourceGraphic" 
            operator="in" 
          />
        </filter>
        <filter 
          x="0" 
          y="0" 
          width="1" 
          height="1" 
          id="filterLoaderBasic"
        >
          <feFlood flood-color="#708090"/>
          <feComposite 
            out="SourceGraphic" 
            in2="SourceGraphic" 
            operator="in" 
          />
        </filter>   
        <filter 
          x="0" 
          y="0" 
          width="1" 
          height="1" 
          id="filterLoaderSlateGrey"
        >
          <feFlood flood-color="#2F4F4F"/>
          <feComposite 
            out="SourceGraphic" 
            in2="SourceGraphic" 
            operator="in"
          />
        </filter>
        <filter 
          x="0" 
          y="0" 
          width="1" 
          height="1" 
          id="filterLoaderSlateBlue"
        >
          <feFlood flood-color="#483D8B"/>
          <feComposite 
            out="SourceGraphic" 
            in2="SourceGraphic" 
            operator="in" 
          />
        </filter>
        <filter
          x="0" 
          y="0" 
          width="1" 
          height="1" 
          id="filterLoaderTeal"
        >
          <feFlood flood-color="#008080"/>
          <feComposite 
            out="SourceGraphic" 
            in2="SourceGraphic" 
            operator="in" 
          />
        </filter>   
        <filter 
          x="0" 
          y="0" 
          width="1" 
          height="1" 
          id="filterLoaderStrict"
        >
          <feFlood flood-color="#00BFFF"/>
          <feComposite 
            out="SourceGraphic" 
            in2="SourceGraphic" 
            operator="in" 
          />
        </filter>
      </defs>
    </svg>
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

import useImagePath from "../composition/image-path";
import useSizes from "../composition/sizes";

const props = defineProps({
  /**
   * Defines svg-filter for loader icon
   * @property {string} iconFilter
   */
  iconFilter: {
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
});

const loaderIconFilter = inject("loaderIconFilter");

const { iconSize } = toRefs(props);

const { createImagePath } = useImagePath();

const loaderIcon = ref(createImagePath("loader.svg"));

const { iconSizeClass } = useSizes(iconSize);

/**
 * Defines class for loader icon
 * depends on injected filter name
 * @function
 * @returns {string} class
 */
const iconFilterClass = computed(() => {
  let basicFilter = "extended__multiselect-loader";
      
  switch(loaderIconFilter) {
    case "default-loader":
      basicFilter = `${basicFilter}_default-loader`;
      break;
    case "basic":
      basicFilter = `${basicFilter}_basic`;
      break;
    case "slate-grey":
      basicFilter = `${basicFilter}_slate-grey`;
      break;
    case "slate-blue":
      basicFilter = `${basicFilter}_slate-blue`;
      break;
    case "teal":
      basicFilter = `${basicFilter}_teal`;
      break;
    case "strict":
      basicFilter = `${basicFilter}_strict`;
      break;
    default:
      basicFilter = `${basicFilter}_default-loader`;
  }

  return basicFilter;
});
</script>
