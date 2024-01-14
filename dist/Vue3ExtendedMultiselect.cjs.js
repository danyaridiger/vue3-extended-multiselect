'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var vue = require('vue');
var _defineProperty = require('@babel/runtime/helpers/defineProperty');
var ExtendedClickOutside = require('extended-click-outside');

var _documentCurrentScript = typeof document !== 'undefined' ? document.currentScript : null;
/**
 * Set of background- and border- style variants
 * @constant {Array} themeTypes
 */
const themeTypes = ["basic", "slate-grey", "slate-blue", "teal", "strict"];

/**
 * Set of color-style variants for loader
 * @constant {Array} loaderThemeTypes
 */
const loaderThemeTypes = ["loader-default", ...themeTypes];

/**
 * Set of icon filenames
 * @constant {Array} toggleIcons
 */
const toggleIcons = ["base-arrow", "double-arrow", "wide-arrow", "circle-arrow", "inner-arrow", "triangle-arrow", "triangle-circle-arrow"];

/**
 * Set of icon colors filtered by svg
 * @constant {Array} iconFilters
 */
const iconFilters = ["basic", "black", "green"];

/**
 * Set of icons sizes filtered by css
 * @constant {Array} iconSizes
 */
const iconSizes = ["large", "medium", "small"];

/**
 * Set of types for options created by user
 * @constant {Array} createOptionTypes
 */
const createOptionTypes = ["primitive", "array", "object"];

/**
 * Set of keys to combine with cliks on options list and blocking choice
 * @constant {Array} specialKeysToBlock
 */
const specialKeysToBlock = ["alt", "ctrl", "shift"];

/**
 * Set of appearance variants of options list
 * @constant {Array} toggleAppearenceSides
 */
const toggleAppearenceSides = ["auto", "atop", "under"];

/**
 * Set of available types for options
 * @constant {Array} UnionPropType
 * @typedef {(string|number|boolean|Array|Object|Function|null|undefined)} UnionPropType
 */
const UnionPropType = [String, Number, Boolean, Array, Object, Function, null, undefined];

class LocalEmitter {
  constructor() {
    _defineProperty(this, "_eventsStack", {
      payload: null
    });
    _defineProperty(this, "_eventsRegistered", []);
  }
  emit(eventName, payload = null) {
    const proxies = this._eventsRegistered.filter(event => event.eventName === eventName);
    if (!proxies.length) return;
    proxies.forEach(proxy => {
      this._eventsStack.payload = payload;
      proxy.proxy.payload = payload;
    });
  }
  on(eventName, callback) {
    this._eventsRegistered.push({
      eventName,
      proxy: new Proxy(this._eventsStack, {
        set(target) {
          callback(target.payload);
          return target;
        }
      })
    });
  }
}

var localEmitter = new LocalEmitter();

function useToggle(loading, disabled, emitter) {
  /**
   * Toggles classes of slots if "loading"
   * or "disabled" props equals true
   * @function
   * @returns {string} class
   */
  const toggleSlotClass = vue.computed(() => {
    return loading.value || disabled.value ? "extended__multiselect-toggle--disabled" : "extended__multiselect-toggle";
  });

  /**
   * Emits an event which listeners will toggle options list
   * @function
   * @emits extended:toggle-options
   * @param {MouseEvent|KeyboardEvent} event - MouseEvent or KeyboardEvent instance
   */
  const toggleOptionsList = event => {
    if (event && event.code === "Tab") return;
    emitter.value.emit("extended:toggle-options");
  };
  return {
    toggleSlotClass: vue.readonly(toggleSlotClass),
    toggleOptionsList
  };
}

function useSearchValue() {
  /**
   * @property {string|null} searchValue - value of search field
   * @property {string|null} searchPattern - pattern of inner search for available options
   */
  const searchState = vue.reactive({
    searchValue: null,
    searchPattern: null
  });

  /**
   * @function setSearchValue
   * @param {string|null} value - new value of search field
   */
  const setSearchValue = value => {
    searchState.searchValue = value;
  };

  /**
   * @function setSearchPattern
   * @param {string|null} pattern - new pattern of inner search for available options
   */
  const setSearchPattern = pattern => {
    searchState.searchPattern = pattern;
  };
  return {
    searchState: vue.readonly(searchState),
    setSearchValue,
    setSearchPattern
  };
}

function useCancel(disabled, showSearchField, selectedOptions, emitter, setSearchValue, setSearchPattern) {
  /**
   * Removes all selected options or single selected option
   * when "multiple" prop equals false
   * @function
   * @emits extended:skip-block-blur-zeroing
   * @emits extended:deselect-option
   * @emits extended:clean-options
   */
  const cancel = () => {
    if (disabled.value) return;
    const deselectedOptions = selectedOptions.value;
    emitter.value.emit("extended:skip-block-blur-zeroing");
    emitter.value.emit("extended:deselect-option", {
      index: null,
      clearAll: true,
      deselectedOptions
    });
    if (!showSearchField.value) return;
    emitter.value.emit("extended:clean-options");
    setSearchValue(null);
    setSearchPattern(null);
  };
  return {
    cancel
  };
}

function useLabels(label, createCustomOptionLabel, emptyObjectsPlaceholder) {
  /**
   * Creates label of any kind of option
   * @function
   * @param {string} label - label field in options of type "object"
   * @param {option} UnionPropType
   * @returns {string} label
   */
  const optionCreateLabel = option => {
    const isFunction = typeof option === "function";
    if (!option && isFunction) return "";
    const customOptionLabel = createCustomOptionLabel.value(option);
    if (customOptionLabel) return customOptionLabel;
    if (Array.isArray(option) && option.length > 0) {
      return option.join(", ");
    }
    if (typeof option !== "object") return option.toString();
    if (Object.keys(option).length === 0) {
      return emptyObjectsPlaceholder.value;
    }
    const hasLabel = Object.getOwnPropertyNames(option).includes(label.value);
    if (hasLabel) {
      return typeof option[label.value] === "object" ? JSON.stringify(option[label.value]) : option[label.value];
    }
    return "";
  };
  return {
    optionCreateLabel
  };
}

function useEmitter() {
  const emitter = vue.ref(new LocalEmitter());
  return {
    emitter
  };
}

function useClickOutside() {
  const clickOutside = vue.ref(new ExtendedClickOutside());
  return {
    clickOutside
  };
}

function usePreselectedOptions(label, emptyObjectsPlaceholder, showInsertWarnings) {
  /**
   * Creates string label for any kind of option
   * @function
   * @param {string} label - label field in options of type "object"
   * @param {boolean} isObjectOrArray - determines whether option is of type "object" or instance of Array
   * @param {UnionPropType} option - option which needs label
   * @returns {string} label
   */
  const createLabel = (isObjectOrArray, option) => {
    let createdLabel;
    if (isObjectOrArray) {
      if (Array.isArray(option) && option.length > 0) {
        createdLabel = option.join(", ");
      } else {
        createdLabel = typeof option[label.value] === "object" ? JSON.stringify(option[label.value]) : option[label.value];
      }
      if (Object.keys(option).length === 0) {
        createdLabel = emptyObjectsPlaceholder.value;
      }
    } else {
      createdLabel = option.toString();
    }
    return createdLabel;
  };

  /**
   * Restricts wrong types of options in options list
   * @method
   * @param {UnionPropType} option - option to restrict
   * @returns {boolean} restriction
   */
  const optionTypeRestrictor = option => {
    if (!option) return false;
    const isObjectArrayInstance = Object.getPrototypeOf(option).constructor.name !== "Object" && Object.getPrototypeOf(option).constructor.name !== "Array";
    const isAnyInstance = typeof option === "object" && isObjectArrayInstance;
    const isSymbol = typeof option === "symbol";
    if (isSymbol && showInsertWarnings.value) {
      console.warn("vue-extended-multiselect: option can not be of type «symbol»");
    }
    if (isAnyInstance && showInsertWarnings.value) {
      console.warn("vue-extended-multiselect: option can not be an instance of any constructor function");
    }
    if (isSymbol || isAnyInstance) return false;
    return true;
  };
  return {
    createLabel,
    optionTypeRestrictor
  };
}

function useImagePath() {
  const createImagePath = image => {
    const hasRequire = typeof require !== "undefined";
    if (hasRequire) {
      return require(`./assets/images/${image}`);
    } else {
      try {
        return new URL(`./assets/images/${image}`, (typeof document === 'undefined' ? require('u' + 'rl').pathToFileURL(__filename).href : (_documentCurrentScript && _documentCurrentScript.src || new URL('Vue3ExtendedMultiselect.cjs.js', document.baseURI).href))).href;
      } catch (error) {
        throw new ReferenceError("import.meta.url is available in «esnext» libtype only");
      }
    }
  };
  return {
    createImagePath
  };
}

function useSizes(iconSize) {
  /**
   * Defines classes for each kind of icon
   * @function
   * @returns {string} class
   */
  const iconSizeClass = vue.computed(() => {
    let basicIconSize = "extended__multiselect";
    switch (vue.getCurrentInstance().type.__name) {
      case "ExtendedMultiselectLoader":
        basicIconSize += "-loader_icon";
        break;
      case "ExtendedMultiselectToggle":
        basicIconSize += "-toggle_icon";
        break;
      case "ExtendedMultiselectCancel":
        basicIconSize += "-cancel_icon";
        break;
      default:
        basicIconSize += "-toggle_icon";
    }
    switch (iconSize.value) {
      case "large":
        return `${basicIconSize}-large`;
      case "medium":
        return `${basicIconSize}-medium`;
      case "small":
        return `${basicIconSize}-small`;
      case "deselect":
        return `${basicIconSize}-deselect`;
      default:
        return `${basicIconSize}-large`;
    }
  });
  return {
    iconSizeClass: vue.readonly(iconSizeClass)
  };
}

const _hoisted_1$6 = { class: "extended__multiselect-loader" };
const _hoisted_2$6 = ["src"];
const _hoisted_3$5 = /*#__PURE__*/vue.createElementVNode("svg", {
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  width: "0",
  height: "0"
}, [
  /*#__PURE__*/vue.createElementVNode("defs", null, [
    /*#__PURE__*/vue.createElementVNode("filter", {
      x: "0",
      y: "0",
      width: "1",
      height: "1",
      id: "filterLoaderDefault"
    }, [
      /*#__PURE__*/vue.createElementVNode("feFlood", { "flood-color": "#00BFFF" }),
      /*#__PURE__*/vue.createElementVNode("feComposite", {
        out: "SourceGraphic",
        in2: "SourceGraphic",
        operator: "in"
      })
    ]),
    /*#__PURE__*/vue.createElementVNode("filter", {
      x: "0",
      y: "0",
      width: "1",
      height: "1",
      id: "filterLoaderBasic"
    }, [
      /*#__PURE__*/vue.createElementVNode("feFlood", { "flood-color": "#708090" }),
      /*#__PURE__*/vue.createElementVNode("feComposite", {
        out: "SourceGraphic",
        in2: "SourceGraphic",
        operator: "in"
      })
    ]),
    /*#__PURE__*/vue.createElementVNode("filter", {
      x: "0",
      y: "0",
      width: "1",
      height: "1",
      id: "filterLoaderSlateGrey"
    }, [
      /*#__PURE__*/vue.createElementVNode("feFlood", { "flood-color": "#2F4F4F" }),
      /*#__PURE__*/vue.createElementVNode("feComposite", {
        out: "SourceGraphic",
        in2: "SourceGraphic",
        operator: "in"
      })
    ]),
    /*#__PURE__*/vue.createElementVNode("filter", {
      x: "0",
      y: "0",
      width: "1",
      height: "1",
      id: "filterLoaderSlateBlue"
    }, [
      /*#__PURE__*/vue.createElementVNode("feFlood", { "flood-color": "#483D8B" }),
      /*#__PURE__*/vue.createElementVNode("feComposite", {
        out: "SourceGraphic",
        in2: "SourceGraphic",
        operator: "in"
      })
    ]),
    /*#__PURE__*/vue.createElementVNode("filter", {
      x: "0",
      y: "0",
      width: "1",
      height: "1",
      id: "filterLoaderTeal"
    }, [
      /*#__PURE__*/vue.createElementVNode("feFlood", { "flood-color": "#008080" }),
      /*#__PURE__*/vue.createElementVNode("feComposite", {
        out: "SourceGraphic",
        in2: "SourceGraphic",
        operator: "in"
      })
    ]),
    /*#__PURE__*/vue.createElementVNode("filter", {
      x: "0",
      y: "0",
      width: "1",
      height: "1",
      id: "filterLoaderStrict"
    }, [
      /*#__PURE__*/vue.createElementVNode("feFlood", { "flood-color": "#00BFFF" }),
      /*#__PURE__*/vue.createElementVNode("feComposite", {
        out: "SourceGraphic",
        in2: "SourceGraphic",
        operator: "in"
      })
    ])
  ])
], -1 /* HOISTED */);


var script$6 = {
  __name: 'ExtendedMultiselectLoader',
  props: {
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
},
  setup(__props) {

const props = __props;

const loaderIconFilter = vue.inject("loaderIconFilter");

const { iconSize } = vue.toRefs(props);

const { createImagePath } = useImagePath();

const loaderIcon = vue.ref(createImagePath("loader.svg"));

const { iconSizeClass } = useSizes(iconSize);

/**
 * Defines class for loader icon
 * depends on injected filter name
 * @function
 * @returns {string} class
 */
const iconFilterClass = vue.computed(() => {
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

return (_ctx, _cache) => {
  return (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$6, [
    vue.createElementVNode("img", {
      alt: "",
      class: vue.normalizeClass([iconFilterClass.value, vue.unref(iconSizeClass), 'extended__multiselect-loader-animate']),
      src: loaderIcon.value
    }, null, 10 /* CLASS, PROPS */, _hoisted_2$6),
    _hoisted_3$5
  ]))
}
}

};

script$6.__file = "src/components/ExtendedMultiselectLoader.vue";

const _hoisted_1$5 = ["tabindex"];
const _hoisted_2$5 = ["src"];


var script$5 = {
  __name: 'ExtendedMultiselectCancel',
  props: {
  /**
   * Blocks cancel button
   * @property {boolean} disabled
   */
  disabled: {
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
},
  setup(__props) {

const props = __props;

const setSearchValue = vue.inject("setSearchValue");
const setSearchPattern = vue.inject("setSearchPattern");

const {
  disabled,
  emitter,
  iconFilter,
  iconSize,
  loading,
  selectedOptions,
  showSearchField,
  tabindex,
} = vue.toRefs(props);

const { createImagePath } = useImagePath();

const cancelIcon = vue.ref(createImagePath("cancel.svg"));

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
const classes = vue.computed(() => {
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
const increasedTabindex = vue.computed(() => {
  return tabindex.value ? tabindex.value + 2 : 0;
});

return (_ctx, _cache) => {
  return (vue.openBlock(), vue.createElementBlock("div", {
    "aria-label": "Clear options list",
    id: "extended__multiselect-cancel",
    role: "button",
    class: vue.normalizeClass(classes.value),
    tabindex: increasedTabindex.value,
    onClick: _cache[0] || (_cache[0] = (...args) => (vue.unref(cancel) && vue.unref(cancel)(...args))),
    onKeypress: _cache[1] || (_cache[1] = vue.withModifiers((...args) => (vue.unref(cancel) && vue.unref(cancel)(...args)), ["stop"]))
  }, [
    (!vue.unref(loading))
      ? (vue.openBlock(), vue.createElementBlock("img", {
          key: 0,
          alt: "",
          class: vue.normalizeClass(vue.unref(iconSizeClass)),
          src: cancelIcon.value
        }, null, 10 /* CLASS, PROPS */, _hoisted_2$5))
      : (vue.openBlock(), vue.createBlock(script$6, {
          key: 1,
          "icon-filter": vue.unref(iconFilter),
          "icon-size": vue.unref(iconSize)
        }, null, 8 /* PROPS */, ["icon-filter", "icon-size"]))
  ], 42 /* CLASS, PROPS, NEED_HYDRATION */, _hoisted_1$5))
}
}

};

script$5.__file = "src/components/ExtendedMultiselectCancel.vue";

class Debounce {
  constructor(callback, timer) {
    _defineProperty(this, "_localTimer", null);
    _defineProperty(this, "_localTimeout", null);
    _defineProperty(this, "_callback", null);
    _defineProperty(this, "_timer", 0);
    this._callback = callback;
    this._timer = timer;
  }
  start() {
    this._localTimer = performance.now();
    if (this._localTimeout) {
      clearTimeout(this._localTimeout);
    }
    this._localTimeout = setTimeout(() => {
      this._callback();
    }, this._timer);
  }
}

function useDebounce() {
  const DebounceConstructor = vue.ref(Debounce);
  return {
    DebounceConstructor
  };
}

const _hoisted_1$4 = { class: "extended__multiselect-block extended__multiselect-block--multiple" };
const _hoisted_2$4 = {
  key: 0,
  class: "extended__multiselect-placeholder"
};
const _hoisted_3$4 = ["src", "onClick"];


var script$4 = {
  __name: 'ExtendedMultiselectMultiple',
  props: {
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
},
  setup(__props) {

const props = __props;

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
} = vue.toRefs(props);

const { createImagePath } = useImagePath();

const optionsLimitIncreaser = vue.ref(null);
const increaserClass = vue.ref("extended__multiselect-increaser");
const deselectImage = vue.ref(createImagePath("cancel.svg"));

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
const classes = vue.computed(() => {
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
const deselectClasses = vue.computed(() => {
  return loading.value
   ? "extended__multiselect-block_cancel-wrapper--loading"
   : "extended__multiselect-block_cancel-wrapper";
});

/**
 * Defines current limited amount of displayed option blocks
 * @function
 * @returns {Array} UnionPropType
 */
const limitRestriction = vue.computed(() => {
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
const optionIncreaserAvailable = vue.computed(() => {
  return toggleMultipleBlocksLimit.value && optionsLimitAchieved.value;
});

/**
 * Determines whether current limit of displayed option blocks amount
 * was reached
 * @function
 * @returns {boolean} reaching
 */
const optionsLimitAchieved = vue.computed(() => {
  return optionsLimitIncreaser.value && selectedOptions.value.length > optionsLimitIncreaser.value;
});

/**
 * Amount of selected options exceeding the limit
 * determined by "multipleBlocksLimit" prop
 * @function
 * @returns {number|null} amount
 */
const overLimitOptionsCount = vue.computed(() => {
  if (selectedOptions.value.length <= multipleBlocksLimit.value) return null;

  return selectedOptions.value.length - multipleBlocksLimit.value;
});

/**
 * Determines whether to show loader icon if "loading" prop equals true
 * or show multiple option blocks as usual
 * @function
 * @returns {boolean} restriction
 */
const showLoaderIcon = vue.computed(() => {
  return showDeselectIconLoader.value ? loading.value : false;
});

/**
 * If limit of selected options was achieved restricts further
 * extension of options container if "multiple" prop equals true
 * @function
 * @param {Array} - array of selected options
 */
 vue.watch(selectedOptions, (value) => {
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
vue.onBeforeMount(() => {
  optionsLimitIncreaser.value = multipleBlocksLimit.value;
});

return (_ctx, _cache) => {
  return (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$4, [
    (__props.placeholderBlockShown)
      ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_2$4, vue.toDisplayString(__props.appropriatePlaceholder), 1 /* TEXT */))
      : vue.createCommentVNode("v-if", true),
    vue.createElementVNode("div", null, [
      vue.renderSlot(_ctx.$slots, "multipleBlocks", {
        selectedOptions: limitRestriction.value,
        deselectBlock: deselectBlock
      }, () => [
        (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(limitRestriction.value, (option, index) => {
          return (vue.openBlock(), vue.createElementBlock("div", { key: index }, [
            vue.renderSlot(_ctx.$slots, "optionBlock", {
              label: vue.unref(optionCreateLabel)(option),
              index: index,
              deselectBlock: deselectBlock
            }, () => [
              vue.createElementVNode("div", {
                class: vue.normalizeClass(classes.value)
              }, [
                vue.createElementVNode("span", null, vue.toDisplayString(vue.unref(optionCreateLabel)(option)), 1 /* TEXT */),
                vue.createElementVNode("div", {
                  class: vue.normalizeClass(deselectClasses.value)
                }, [
                  (!showLoaderIcon.value)
                    ? (vue.openBlock(), vue.createElementBlock("img", {
                        key: 0,
                        alt: "",
                        class: "extended__multiselect_deselect-block-icon",
                        src: deselectImage.value,
                        onClick: vue.withModifiers($event => (deselectBlock(index)), ["stop"])
                      }, null, 8 /* PROPS */, _hoisted_3$4))
                    : (vue.openBlock(), vue.createBlock(script$6, {
                        key: 1,
                        "icon-filter": __props.iconFilter,
                        "icon-size": "deselect"
                      }, null, 8 /* PROPS */, ["icon-filter"]))
                ], 2 /* CLASS */)
              ], 2 /* CLASS */)
            ])
          ]))
        }), 128 /* KEYED_FRAGMENT */)),
        (optionsLimitAchieved.value && !vue.unref(toggleMultipleBlocksLimit))
          ? vue.renderSlot(_ctx.$slots, "maxElements", { key: 0 }, () => [
              vue.createTextVNode(vue.toDisplayString(__props.multipleBlocksLimitMessage(overLimitOptionsCount.value)), 1 /* TEXT */)
            ])
          : vue.createCommentVNode("v-if", true),
        (optionIncreaserAvailable.value)
          ? vue.renderSlot(_ctx.$slots, "showMore", {
              key: 1,
              showMoreOptions: showMoreOptions
            }, () => [
              vue.createElementVNode("div", {
                class: vue.normalizeClass([classes.value, increaserClass.value]),
                onClick: vue.withModifiers(showMoreOptions, ["stop"])
              }, " Show more options ", 2 /* CLASS */)
            ])
          : vue.createCommentVNode("v-if", true)
      ])
    ])
  ]))
}
}

};

script$4.__file = "src/components/ExtendedMultiselectMultiple.vue";

const _hoisted_1$3 = { key: 0 };
const _hoisted_2$3 = ["accesskey", "autocomplete", "disabled", "id", "name", "placeholder", "spellcheck", "tabindex", "translate"];
const _hoisted_3$3 = {
  key: 0,
  class: "extended__multiselect-placeholder"
};
const _hoisted_4$1 = { key: 1 };
const _hoisted_5$1 = {
  key: 2,
  class: "extended__multiselect-block"
};
const _hoisted_6$1 = {
  key: 0,
  class: "extended__multiselect-placeholder"
};


var script$3 = {
  __name: 'ExtendedMultiselectInput',
  props: {
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
},
  setup(__props) {

const props = __props;

const searchState = vue.inject("searchState");
const setSearchValue = vue.inject("setSearchValue");
const setSearchPattern = vue.inject("setSearchPattern");

const emitter = vue.toRef(props, "emitter");

const { DebounceConstructor } = useDebounce();

const blurSkip = vue.ref(false);
vue.ref(false);
const searchFieldFocused = vue.ref(false);
const optionWillBeTriggered = vue.ref(false);
const searchValue = vue.ref("");
const singleLabel = vue.ref("");
const blurSkipByToggleIcon = vue.ref(0);
const blurSkipByBlock = vue.ref(0);
vue.ref([]);
const searchDebounce = vue.ref(new DebounceConstructor.value(() => {
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
const extendedInput = vue.ref(null);

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
  selectedOptions,
  toggleOptionsBySelect,
  togglingSavesSearchValue,
} = vue.toRefs(props);

const attrs = vue.useAttrs();

/**
 * Defines "placeholder" attribute of search field
 * @function
 * @returns {string} placeholder
 */
const appropriatePlaceholder = vue.computed(() => {
  return createOnTheGo.value ? createOptionPlaceholder.value : placeholder.value;
});

/**
 * Sets "margin-top" css property to multiple option blocks
 * if search field is shown
 * @function
 * @returns {Object|null} margin-top
 */
const multipleBlocksMargin = vue.computed(() => {
  return searchFieldForwarding.value ? { marginTop: "4px" } : null;
});

/**
 * Determines whether to show placeholder block
 * @function
 * @returns {boolean} display
 */
const placeholderBlockShown = vue.computed(() => {
  if (selectedOptions.value.length || searchFieldForwarding.value) {
    return false;
  }

  return true;
});

/**
 * Defines classes of search field
 * @function
 * @returns {Array} classes
 */
const searchFieldClass = vue.computed(() => {
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
const searchFieldForwarding = vue.computed(() => {
  return searchFieldFocused.value || optionWillBeTriggered.value;
});

/**
 * Determines whether option shall be triggered before selection
 * @function
 * @emits extended:renew-field-forwarding
 * @param {boolean} searchFieldForwarding - restrictor of triggered option 
 */
vue.watch(searchFieldForwarding, (value) => {
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
vue.watch(searchState, (prevState, state) => {
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
vue.watch(searchValue, (value) => {
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
  searchDebounce.value.start();
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
vue.onBeforeMount(() => {
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
vue.onMounted(() => {
  emitter.value.on("extended:field-focus", () => {
    if (showSearchField.value) {
      vue.nextTick(() => {
        extendedInput.value.focus();
      });
    } else {
      extendedInput.value.focus();
    }
  });
});

return (_ctx, _cache) => {
  return (vue.unref(showSearchField))
    ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
        vue.withDirectives(vue.createElementVNode("input", {
          "aria-controls": "extended-search-field",
          ref_key: "extendedInput",
          ref: extendedInput,
          type: "text",
          accesskey: vue.unref(attrs).accesskey,
          autocomplete: vue.unref(attrs).autocomplete,
          class: vue.normalizeClass(searchFieldClass.value),
          disabled: vue.unref(disabled),
          id: __props.inputId,
          name: vue.unref(attrs).name,
          placeholder: appropriatePlaceholder.value,
          spellcheck: vue.unref(attrs).spellcheck,
          tabindex: vue.unref(attrs).tabindex,
          translate: vue.unref(attrs).translate,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((searchValue).value = $event)),
          onBlur: vue.withModifiers(rollUp, ["prevent"]),
          onFocus: vue.withModifiers(expand, ["prevent"]),
          onInput: search
        }, null, 42 /* CLASS, PROPS, NEED_HYDRATION */, _hoisted_2$3), [
          [vue.vModelText, searchValue.value]
        ]),
        vue.withDirectives(vue.createElementVNode("div", {
          class: "extended__multiselect-block",
          onClick: expand
        }, [
          vue.renderSlot(_ctx.$slots, "labelBlock", { labelBlockValue: singleLabel.value }, () => [
            vue.createElementVNode("span", null, vue.toDisplayString(singleLabel.value), 1 /* TEXT */)
          ])
        ], 512 /* NEED_PATCH */), [
          [vue.vShow, !searchFieldForwarding.value && !vue.unref(multiple) && !placeholderBlockShown.value]
        ]),
        (placeholderBlockShown.value)
          ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_3$3, vue.toDisplayString(appropriatePlaceholder.value), 1 /* TEXT */))
          : vue.createCommentVNode("v-if", true),
        vue.withDirectives(vue.createVNode(script$4, {
          style: vue.normalizeStyle(multipleBlocksMargin.value),
          disabled: vue.unref(disabled),
          loading: __props.loading,
          "icon-filter": __props.iconFilter,
          "show-deselect-icon-loader": __props.showDeselectIconLoader,
          "toggle-multiple-blocks-limit": __props.toggleMultipleBlocksLimit,
          "empty-objects-placeholder": __props.emptyObjectsPlaceholder,
          label: __props.label,
          "multiple-blocks-limit-message": __props.multipleBlocksLimitMessage,
          "theme-type": __props.themeType,
          "increase-display-by": vue.unref(increaseDisplayBy),
          multipleBlocksLimit: __props.multipleBlocksLimit,
          "selected-options": vue.unref(selectedOptions),
          emitter: emitter.value,
          "create-custom-option-label": __props.createCustomOptionLabel
        }, vue.createSlots({
          multipleBlocks: vue.withCtx(({ selectedOptions, deselectBlock }) => [
            vue.renderSlot(_ctx.$slots, "multipleBlocks", {
              selectedOptions: selectedOptions,
              deselectBlock: deselectBlock
            })
          ]),
          optionBlock: vue.withCtx(({ label, deselectBlock, index }) => [
            vue.renderSlot(_ctx.$slots, "optionBlock", {
              label: label,
              index: index,
              deselectBlock: deselectBlock
            })
          ]),
          maxElements: vue.withCtx(() => [
            vue.renderSlot(_ctx.$slots, "maxElements")
          ]),
          _: 2 /* DYNAMIC */
        }, [
          (__props.toggleMultipleBlocksLimit)
            ? {
                name: "showMore",
                fn: vue.withCtx(({ showMoreOptions }) => [
                  vue.renderSlot(_ctx.$slots, "showMore", { showMoreOptions: showMoreOptions })
                ]),
                key: "0"
              }
            : undefined
        ]), 1032 /* PROPS, DYNAMIC_SLOTS */, ["style", "disabled", "loading", "icon-filter", "show-deselect-icon-loader", "toggle-multiple-blocks-limit", "empty-objects-placeholder", "label", "multiple-blocks-limit-message", "theme-type", "increase-display-by", "multipleBlocksLimit", "selected-options", "emitter", "create-custom-option-label"]), [
          [vue.vShow, vue.unref(multiple) && !!vue.unref(selectedOptions).length]
        ])
      ]))
    : (!vue.unref(showSearchField) && vue.unref(multiple))
      ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_4$1, [
          vue.createVNode(script$4, {
            disabled: vue.unref(disabled),
            loading: __props.loading,
            "icon-filter": __props.iconFilter,
            "placeholder-block-shown": !vue.unref(selectedOptions).length,
            "show-deselect-icon-loader": __props.showDeselectIconLoader,
            "toggle-multiple-blocks-limit": __props.toggleMultipleBlocksLimit,
            "appropriate-placeholder": appropriatePlaceholder.value,
            "empty-objects-placeholder": __props.emptyObjectsPlaceholder,
            label: __props.label,
            "multiple-blocks-limit-message": __props.multipleBlocksLimitMessage,
            "theme-type": __props.themeType,
            "increase-display-by": vue.unref(increaseDisplayBy),
            multipleBlocksLimit: __props.multipleBlocksLimit,
            "selected-options": vue.unref(selectedOptions),
            emitter: emitter.value,
            "create-custom-option-label": __props.createCustomOptionLabel
          }, vue.createSlots({
            multipleBlocks: vue.withCtx(({ selectedOptions, deselectBlock }) => [
              vue.renderSlot(_ctx.$slots, "multipleBlocks", {
                selectedOptions: selectedOptions,
                deselectBlock: deselectBlock
              })
            ]),
            optionBlock: vue.withCtx(({ label, deselectBlock, index }) => [
              vue.renderSlot(_ctx.$slots, "optionBlock", {
                label: label,
                index: index,
                deselectBlock: deselectBlock
              })
            ]),
            _: 2 /* DYNAMIC */
          }, [
            (__props.toggleMultipleBlocksLimit)
              ? {
                  name: "showMore",
                  fn: vue.withCtx(({ showMoreOptions }) => [
                    vue.renderSlot(_ctx.$slots, "showMore", { showMoreOptions: showMoreOptions })
                  ]),
                  key: "0"
                }
              : undefined
          ]), 1032 /* PROPS, DYNAMIC_SLOTS */, ["disabled", "loading", "icon-filter", "placeholder-block-shown", "show-deselect-icon-loader", "toggle-multiple-blocks-limit", "appropriate-placeholder", "empty-objects-placeholder", "label", "multiple-blocks-limit-message", "theme-type", "increase-display-by", "multipleBlocksLimit", "selected-options", "emitter", "create-custom-option-label"]),
          vue.createElementVNode("input", {
            class: "extended__multiselect-input--hidden",
            ref_key: "extendedInput",
            ref: extendedInput,
            type: "text",
            onBlur: vue.withModifiers(rollUp, ["prevent"]),
            onFocus: vue.withModifiers(expand, ["prevent"])
          }, null, 544 /* NEED_HYDRATION, NEED_PATCH */)
        ]))
      : (vue.openBlock(), vue.createElementBlock("div", _hoisted_5$1, [
          (placeholderBlockShown.value)
            ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_6$1, vue.toDisplayString(appropriatePlaceholder.value), 1 /* TEXT */))
            : vue.createCommentVNode("v-if", true),
          vue.renderSlot(_ctx.$slots, "labelBlock", { labelBlockValue: singleLabel.value }, () => [
            vue.createElementVNode("span", null, vue.toDisplayString(singleLabel.value), 1 /* TEXT */)
          ]),
          vue.createElementVNode("input", {
            class: "extended__multiselect-input--hidden",
            ref_key: "extendedInput",
            ref: extendedInput,
            type: "text",
            onBlur: vue.withModifiers(rollUp, ["prevent"]),
            onFocus: vue.withModifiers(expand, ["prevent"])
          }, null, 544 /* NEED_HYDRATION, NEED_PATCH */)
        ]))
}
}

};

script$3.__file = "src/components/ExtendedMultiselectInput.vue";

const _hoisted_1$2 = /*#__PURE__*/vue.createElementVNode("span", null, "Maximum limit of selected options was achieved", -1 /* HOISTED */);
const _hoisted_2$2 = /*#__PURE__*/vue.createElementVNode("span", null, "Minimum amount of selected options was not achieved", -1 /* HOISTED */);
const _hoisted_3$2 = { class: "extended__multiselect-options_container" };
const _hoisted_4 = ["aria-setsize", "aria-posinset", "aria-labelledby", "aria-disabled", "enter-locator", "role", "onClick", "onKeypress"];
const _hoisted_5 = { class: "extended__multiselect-marker" };
const _hoisted_6 = {
  key: 1,
  class: "extended__multiselect-marker-shape-only"
};
const _hoisted_7 = ["id"];
const _hoisted_8 = /*#__PURE__*/vue.createElementVNode("span", null, "No results were found by search", -1 /* HOISTED */);
const _hoisted_9 = /*#__PURE__*/vue.createElementVNode("span", null, "Options list is empty", -1 /* HOISTED */);


var script$2 = {
  __name: 'ExtendedMultiselectOptions',
  props: {
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
   * Defines "height" css-property of every option element
   * @property {number} anyOptionWrapperBlockHeight
   */
  anyOptionWrapperBlockHeight: {
    type: [Number, String],
    required: true,
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
},
  setup(__props) {

const props = __props;

const searchState = vue.inject("searchState");
const setSearchValue = vue.inject("setSearchValue");
const setSearchPattern = vue.inject("setSearchPattern");

const fieldWasShown = vue.ref(false);
const atopWithScroll = vue.ref(null);
const enterIndex = vue.ref(null);
const heightFromMounted = vue.reactive({});
const underWithScroll = vue.ref(null);

/**
 * Element references
 */
const optionsWrapper = vue.ref(null);

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
} = vue.toRefs(props);

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
const availableOptions = vue.computed(() => {
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
const classes = vue.computed(() => {
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
const emptyOptionsList = vue.computed(() => {
  return (!options.value.length || !options.value.filter((option) => !!option).length
   || !availableOptions.value.length) && !searchState.searchValue;
});

/**
 * Determines whether list of internal search results is empty
 * @function
 * @returns {boolean} emptiness
 */
const emptySearchResult = vue.computed(() => {
  return !availableOptions.value.length && !createOnTheGo.value && searchState.searchValue;
});

/**
 * Defines styles for "min-heigt", "max-height"
 * and "top" css-properties of options wrapper
 * @function
 * @returns {Object} styles
 */
const heightFromProps = vue.computed(() => {
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
const maxOptionsWereSelected = vue.computed(() => {
  return maxOptionsCount.value && multiple.value && selectedOptions.value.length === maxOptionsCount.value;
});

/**
 * Defines styles for "margin-top" css-property of marker element
 * @function
 * @returns {Object} styles 
 */
const markerShapeMargin = vue.computed(() => {
  return { marginTop: "2px" };
});

/**
 * Determines whether minimal amount of options has not been selected
 * @function
 * @returns {boolean} reaching
 */
const minOptionsWereNotSelected = vue.computed(() => {
  return minOptionsCount.value && multiple.value && selectedOptions.value.length < minOptionsCount.value;
});

/**
 * Defines styles for "padding" and "height" css-property
 * of every option element
 * @function
 * @returns {Object} styles
 */
const optionHeightByProps = vue.computed(() => {
  const heightNumeric = typeof anyOptionWrapperBlockHeight.value === "number";
  let height = {
    height: heightNumeric ? `${anyOptionWrapperBlockHeight.value}px` : `${anyOptionWrapperBlockHeight.value}`,
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
const showCreateNewOptionBlock = vue.computed(() => {
  return createOnTheGo.value && !availableOptions.value.length && searchState.searchValue;
});

/**
 * Summarizes styles for options wrapper in combined collection
 * @function
 * @returns {Array} styles 
 */

const styles = vue.computed(() => {
  return [
    heightFromProps.value, 
    heightFromMounted, 
    atopWithScroll.value, 
    underWithScroll.value
  ];
});

/**
 * Toggles "border-bottom-right-radius", "border-bottom-right-radius" 
 * and "top" css-properties of options wrapper
 * @function
 * @param {boolean} afterLoading - loading state flag
 */
const calculateTopOffset = (afterLoading = false) => {
  vue.nextTick(() => {
    if (!optionsWrapper.value) return;
    
    const offsetHeight = optionsWrapper.value.offsetHeight;
    const scrollHeight = optionsWrapper.value.scrollHeight;

    if (chosenToggleAppearanceSide.value === "atop") {
      if (scrollHeight > offsetHeight) {
        atopWithScroll.value = {
          borderTopRightRadius: 0,
        };
      }

      if (toggleMaxHeight.value >= offsetHeight || afterLoading) {
        heightFromMounted.top = `-${offsetHeight - 1}px`;
      }
    } else {
      if (scrollHeight > offsetHeight) {
        underWithScroll.value = {
          borderBottomRightRadius: 0,
        };
      }
    }
  });
};

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
};

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
      const hasLabel = Object.getOwnPropertyNames(option).includes(label.value);

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
};

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
};

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
      const index = selectedOptions.value.findIndex((selectedOption) => {
        return JSON.stringify(selectedOption) === JSON.stringify(option);
      });

      emitter.value.emit("extended:deselect-option", { skipNextRemoval: true, index });
      
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
vue.onBeforeMount(() => {
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
vue.onMounted(() => {
  new ResizeObserver(() => {
    calculateTopOffset();
  }).observe(optionsWrapper.value);
});

return (_ctx, _cache) => {
  return (vue.openBlock(), vue.createElementBlock("div", {
    ref_key: "optionsWrapper",
    ref: optionsWrapper,
    tabindex: "-1",
    class: vue.normalizeClass(classes.value),
    style: vue.normalizeStyle(styles.value)
  }, [
    vue.renderSlot(_ctx.$slots, "listHeader"),
    (showCreateNewOptionBlock.value)
      ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: vue.normalizeClass(["extended__multiselect-option-create", optionHighlightClasses(null)]),
          onMousedown: createNewOption
        }, vue.toDisplayString(vue.unref(searchState).searchValue), 35 /* TEXT, CLASS, NEED_HYDRATION */))
      : vue.createCommentVNode("v-if", true),
    (maxOptionsWereSelected.value)
      ? vue.renderSlot(_ctx.$slots, "moreThanLimit", { key: 1 }, () => [
          _hoisted_1$2
        ])
      : vue.createCommentVNode("v-if", true),
    (minOptionsWereNotSelected.value)
      ? vue.renderSlot(_ctx.$slots, "lessThanLimit", { key: 2 }, () => [
          _hoisted_2$2
        ])
      : vue.createCommentVNode("v-if", true),
    vue.createElementVNode("div", _hoisted_3$2, [
      (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(availableOptions.value, (option, index) => {
        return (vue.openBlock(), vue.createElementBlock("div", {
          role: "listbox",
          key: index
        }, [
          option
            ? (vue.openBlock(), vue.createElementBlock("div", {
                key: 0,
                "aria-setsize": availableOptions.value.length,
                "aria-posinset": index,
                "aria-labelledby": `option-label-${index}`,
                "aria-disabled": optionIsDisabled(option),
                class: vue.normalizeClass(optionHighlightClasses(option)),
                style: vue.normalizeStyle(optionHeightByProps.value),
                "enter-locator": index,
                role: optionCreateRole(option),
                onClick: vue.withModifiers($event => (selectOption(option, $event)), ["stop"]),
                onKeypress: vue.withModifiers($event => (selectOption(option, $event)), ["stop"]),
                onMousedown: triggerOptionBeforeSelection,
                onMouseenter: vue.withModifiers(setEnterIndex, ["stop"])
              }, [
                vue.renderSlot(_ctx.$slots, "option", {
                  option: option,
                  createCustomOptionLabel: vue.unref(createCustomOptionLabel)
                }, () => [
                  vue.createElementVNode("div", _hoisted_5, [
                    vue.renderSlot(_ctx.$slots, "marker", {
                      selected: showCurrentMarker(option)
                    }, () => [
                      (vue.unref(showMarker) && showCurrentMarker(option))
                        ? (vue.openBlock(), vue.createElementBlock("div", {
                            key: 0,
                            class: vue.normalizeClass(markerShapeClass(option)),
                            style: vue.normalizeStyle(markerShapeMargin.value)
                          }, null, 6 /* CLASS, STYLE */))
                        : (vue.unref(showMarker))
                          ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6))
                          : vue.createCommentVNode("v-if", true)
                    ])
                  ]),
                  vue.createElementVNode("span", {
                    id: `option-label-${index}`
                  }, vue.toDisplayString(vue.unref(optionCreateLabel)(option)), 9 /* TEXT, PROPS */, _hoisted_7)
                ])
              ], 46 /* CLASS, STYLE, PROPS, NEED_HYDRATION */, _hoisted_4))
            : vue.createCommentVNode("v-if", true)
        ]))
      }), 128 /* KEYED_FRAGMENT */))
    ]),
    (emptySearchResult.value)
      ? vue.renderSlot(_ctx.$slots, "noResults", { key: 3 }, () => [
          _hoisted_8
        ])
      : vue.createCommentVNode("v-if", true),
    (emptyOptionsList.value)
      ? vue.renderSlot(_ctx.$slots, "noOptions", { key: 4 }, () => [
          _hoisted_9
        ])
      : vue.createCommentVNode("v-if", true),
    vue.renderSlot(_ctx.$slots, "listFooter")
  ], 6 /* CLASS, STYLE */))
}
}

};

script$2.__file = "src/components/ExtendedMultiselectOptions.vue";

const _hoisted_1$1 = ["aria-checked", "tabindex"];
const _hoisted_2$1 = ["src"];
const _hoisted_3$1 = /*#__PURE__*/vue.createElementVNode("svg", {
  version: "1.1",
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  width: "0",
  height: "0"
}, [
  /*#__PURE__*/vue.createElementVNode("defs", null, [
    /*#__PURE__*/vue.createElementVNode("filter", {
      x: "0",
      y: "0",
      width: "1",
      height: "1",
      id: "basicFilter"
    }, [
      /*#__PURE__*/vue.createElementVNode("feFlood", { "flood-color": "#BDBDBD" }),
      /*#__PURE__*/vue.createElementVNode("feComposite", {
        out: "SourceGraphic",
        in2: "SourceGraphic",
        operator: "in"
      })
    ]),
    /*#__PURE__*/vue.createElementVNode("filter", {
      x: "0",
      y: "0",
      width: "1",
      height: "1",
      id: "blackFilter"
    }, [
      /*#__PURE__*/vue.createElementVNode("feFlood", { "flood-color": "#000000" }),
      /*#__PURE__*/vue.createElementVNode("feComposite", {
        out: "SourceGraphic",
        in2: "SourceGraphic",
        operator: "in"
      })
    ]),
    /*#__PURE__*/vue.createElementVNode("filter", {
      x: "0",
      y: "0",
      width: "1",
      height: "1",
      id: "greenFilter"
    }, [
      /*#__PURE__*/vue.createElementVNode("feFlood", { "flood-color": "#068504" }),
      /*#__PURE__*/vue.createElementVNode("feComposite", {
        out: "SourceGraphic",
        in2: "SourceGraphic",
        operator: "in"
      })
    ])
  ])
], -1 /* HOISTED */);


var script$1 = {
  __name: 'ExtendedMultiselectToggle',
  props: {
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
},
  setup(__props) {

const props = __props;

const {
  disabled,
  dropdownActive,
  emitter,
  iconFilter,
  iconSize,
  loading,
  tabindex,
  toggleIcon,
} = vue.toRefs(props);

const { createImagePath } = useImagePath();

const { toggleSlotClass, toggleOptionsList } = useToggle(
  loading,
  disabled,
  emitter,
);
const { iconSizeClass } = useSizes(iconSize);

/**
 * Defines a list of toggle button classes
 * @function
 * @returns {Array} classes
 */
const classesSummary = vue.computed(() => {
  return [
    iconFilterClass.value,
    iconSizeClass.value,
    iconFilterRotationClass.value
  ];
});

/**
 * Determines kind of toggle icon based on
 * "toggleIcon" prop
 * @function
 * @returns {string} icon
 */
const icon = vue.computed(() => {
  const baseArrow = createImagePath("base-arrow.svg");

  switch(toggleIcon.value) {
    case "base-arrow":
      return baseArrow;
    case "double-arrow":
      return createImagePath("double-arrow.svg");
    case "wide-arrow":
      return createImagePath("wide-arrow.svg");
    case "circle-arrow":
      return createImagePath("circle-arrow.svg");
    case "inner-arrow":
      return createImagePath("inner-arrow.svg");
    case "triangle-arrow":
      return createImagePath("triangle-arrow.svg");
    case "triangle-circle-arrow":
      return createImagePath("triangle-circle-arrow.svg");
    default: 
      return baseArrow;
  }
});

/**
 * Defines svg-filter for toggle icon
 * @function
 * @returns {string} svg-filter
 */
const iconFilterClass = vue.computed(() => {
  const basicFilter = "extended__multiselect-filter";
      
  switch(iconFilter) {
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
const iconFilterRotationClass = vue.computed(() => {
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
const increasedTabindex = vue.computed(() => {
  return tabindex.value ? tabindex.value + 1 : 0;
});

return (_ctx, _cache) => {
  return (vue.openBlock(), vue.createElementBlock("div", {
    "aria-label": "Toggle options list",
    id: "extended__multiselect-toggle",
    role: "switch",
    "aria-checked": vue.unref(dropdownActive),
    class: vue.normalizeClass(vue.unref(toggleSlotClass)),
    tabindex: increasedTabindex.value,
    onClick: _cache[0] || (_cache[0] = vue.withModifiers((...args) => (vue.unref(toggleOptionsList) && vue.unref(toggleOptionsList)(...args)), ["stop","left"])),
    onMouseup: _cache[1] || (_cache[1] = vue.withModifiers((...args) => (vue.unref(toggleOptionsList) && vue.unref(toggleOptionsList)(...args)), ["stop","middle"])),
    onKeypress: _cache[2] || (_cache[2] = vue.withModifiers($event => (vue.unref(toggleOptionsList)($event)), ["stop"]))
  }, [
    (!vue.unref(loading))
      ? (vue.openBlock(), vue.createElementBlock("img", {
          key: 0,
          alt: "",
          class: vue.normalizeClass(classesSummary.value),
          src: icon.value
        }, null, 10 /* CLASS, PROPS */, _hoisted_2$1))
      : (vue.openBlock(), vue.createBlock(script$6, {
          key: 1,
          "icon-filter": vue.unref(iconFilter),
          "icon-size": vue.unref(iconSize)
        }, null, 8 /* PROPS */, ["icon-filter", "icon-size"])),
    _hoisted_3$1
  ], 42 /* CLASS, PROPS, NEED_HYDRATION */, _hoisted_1$1))
}
}

};

script$1.__file = "src/components/ExtendedMultiselectToggle.vue";

const _hoisted_1 = ["aria-roledescription", "tabindex", "onKeyup"];
const _hoisted_2 = { class: "extended__multiselect-toggle_wrapper" };
const _hoisted_3 = { class: "extended__multiselect-cancel_wrapper" };

/**
 * @todo Mark optional arguments of functions
 */

/**
 * @author Ridiger Daniil Dmitrievich, 2022
 * @version 2.0.6
 */

var script = {
  __name: 'Vue3ExtendedMultiselect',
  props: {
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
   * Disables dropdown toggle
   * @default false
   * @property {boolean} dropdownDisabled
   */
  dropdownDisabled: {
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
   * Defines "height" css-property for each option in options list
   * @default 30
   * @property {number} anyOptionWrapperBlockHeight
   */
  anyOptionWrapperBlockHeight: {
    type: [Number, String],
    default: "auto",
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
},
  emits: [
  "active",
  "clean",
  "close",
  "increase",
  "option-created",
  "pattern-changed",
  "select",
  "update:modelValue",
],
  setup(__props, { expose: __expose, emit: __emit }) {

const props = __props;

const emit = __emit;

const dropdownActive = vue.ref(false);
const skipNextRemoval = vue.ref(false);
const externalOptionsLoader = vue.ref(null);
const chosenToggleAppearanceSide = vue.ref(null);
const selectedOptionsWatcher = vue.ref(null);
const rawOptions = vue.ref([]);
const selectedOptions = vue.ref([]);
const togglePattern = /^extended__multiselect-toggle_wrapper/i;

/**
 * Element references
 */
const extendedMultiselect = vue.ref(null);
const extendedMultiselectToggle = vue.ref(null);
const extendedMultiselectWrapper = vue.ref(null);

const {
  defaultExpanded,
  disabled,
  dropdownDisabled,
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
} = vue.toRefs(props);

const {
  searchState,
  setSearchValue,
  setSearchPattern,
} = useSearchValue();

vue.provide("loaderIconFilter", loaderIconFilter.value);
vue.provide("searchState", searchState);
vue.provide("setSearchValue", setSearchValue);
vue.provide("setSearchPattern", setSearchPattern);

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
const attrs = vue.useAttrs();
const slots = vue.useSlots();
 
/**
 * Defines a list of extended multiselect wrapper classes
 * @function
 * @returns {Array} classes
 */
const classes = vue.computed(() => {
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
const disabledPrimitiveOptionsConverted = vue.computed(() => {
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
const displayWrongValue = vue.computed(() => {
  return wrongCurrentValue.value ? { borderColor: errorBorderColor.value } : null; 
});

/**
 * Defines styles depending on current options list dropdown state
 * @function
 * @returns {Object|null} styles
 */
const expanded = vue.computed(() => {
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
const internalLoading = vue.computed(() => {
  return loading.value;
});

/**
 * Defines mapped list of previously restricted options
 * @function
 * @returns {Array} options
 */
const mappedOptions = vue.computed(() => {
  return restrictedOptions.value.map((restrictedOption) => {
    return JSON.stringify(restrictedOption);
  });
});

/**
 * Defines a list of options filtered by maximal admissible options amount
 * @function
 * @returns {Array} options
 */
const restrictedOptions = vue.computed(() => {
  if (!rawOptions.value) return [];
  
  return optionsCountRestriction.value
   ? rawOptions.value.filter((_, index) => index + 1 <= optionsCountRestriction.value)
   : rawOptions.value;
});

/**
 * Defines "aria-roledescription" attribute of extended multiselect wrapper
 * @function
 * @returns {string} aria-roledescription
 */
const roledescription = vue.computed(() => {
  return multiple.value ? "Multiselect" : "Select";
});

/**
 * Defines "tabindex" attribute of extended multiselect wrapper if needed
 * @function
 * @returns {number} tabindex
 */
const tabindexIfSearch = vue.computed(() => {
  return showSearchField.value ? attrs.tabindex : -1;
});

/**
 * Defines special class which indicates disabled or loading state
 * of extended multiselect wrapper
 * @function
 * @returns {string} class
 */
const wrapperClasses = vue.computed(() => {
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
vue.watch(dropdownActive, (value) => {
  if (!value) {
    emitter.value.emit("extended:rollup-options");
  }
});

/**
 * Changes selected options based on external modelValue changes
 * @function
 */
vue.watch(modelValue, (value, prevValue) => {
  if (
    JSON.stringify(vue.toRaw(value)) === JSON.stringify(vue.toRaw(prevValue)) 
    || skipNextRemoval.value
  ) {
    skipNextRemoval.value = false;

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
};

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
};

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

    selectedOptionsWatcher.value = vue.watch(selectedOptions, () => {
      updateModelValue();

      if (resetSearchByValue.value) {
        emitter.value.emit("extended:clear-field");
      }
    }, { deep: true });
  }
};

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
  const filteredHasSlot = toggleDetector(mouseEvent, /^extended__multiselect-options(?!_option)/i, true);
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
};

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
  if (internalLoading.value || disabled.value || dropdownDisabled.value) return;

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
};

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
 * @listens extended:create-option
 * @listens extended:increase-display
 * @listens extended:loader-pattern-changed
 * @listens extended:search-pattern-changed
 */
vue.onBeforeMount(() => {
  selectedOptionsWatcher.value = vue.watch(selectedOptions, (value) => {
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

    updateModelValue();
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

      if (payload.skipNextRemoval) {
        skipNextRemoval.value = true;
      }

      selectedOptions.value.splice(payload.index, 1);
      updateModelValue();

      return;
    } else {
      if (!selectedOptions.value.length) return;

      const deselectedOption = payload.deselectedOptions
       ? payload.deselectedOptions
       : selectedOptions.value;
      
      const eventData = simpleEvents.value
       ? deselectedOption
       : createEventFields(deselectedOption, "option");

       /**
        * @event clean
        * @type {Object}
        * @property {string} inputId - id of search field set by "id" prop
        * @property {UnionPropType} options - just now deselected options
        */
      emit("clean", eventData);

      selectedOptions.value = [];
      updateModelValue();
    }
    
    if (toggleOptionsBySelect.value) {
      emitter.value.emit("extended:rollup-options");
    }
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

  emitter.value.on("extended:loader-pattern-changed", (pattern) => {
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
vue.onMounted(() => {
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
    if (dropdownActive.value || dropdownDisabled.value) return;
      
    toggleAppearanceRestrictorActivate();
    activeEmitter();

    dropdownActive.value = true;
  });

  emitter.value.on("extended:loader-pattern-changed", async (pattern) => {
    await loadOptionsByExternalLoader(pattern, false);
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

__expose({
  optionCreateLabel,
});

return (_ctx, _cache) => {
  return (vue.openBlock(), vue.createElementBlock("section", {
    "aria-owns": "extended-search-field",
    ref_key: "extendedMultiselectWrapper",
    ref: extendedMultiselectWrapper,
    role: "combobox",
    "aria-roledescription": roledescription.value,
    class: vue.normalizeClass(wrapperClasses.value),
    tabindex: tabindexIfSearch.value,
    onClick: vue.withModifiers(fieldFocus, ["stop","left"]),
    onMouseup: vue.withModifiers(fieldFocus, ["stop","middle"]),
    onKeyup: [
      vue.withKeys(vue.withModifiers(rollUp, ["stop"]), ["esc"]),
      vue.withKeys(vue.withModifiers(selectByEnter, ["stop"]), ["enter"])
    ],
    onMousedown: [
      vue.withModifiers(toggleRestrictor, ["stop","left"]),
      vue.withModifiers(toggleRestrictor, ["stop","middle"])
    ],
    onMouseleave: vue.withModifiers(resetEnterIndex, ["stop"])
  }, [
    vue.createElementVNode("div", {
      ref_key: "extendedMultiselect",
      ref: extendedMultiselect,
      class: vue.normalizeClass(classes.value),
      style: vue.normalizeStyle([displayWrongValue.value, expanded.value])
    }, [
      vue.createElementVNode("div", null, [
        vue.createVNode(script$3, {
          accesskey: vue.unref(attrs).accesskey,
          autocomplete: vue.unref(attrs).autocomplete,
          name: vue.unref(attrs).name,
          spellcheck: vue.unref(attrs).spellcheck,
          tabindex: vue.unref(attrs).tabindex,
          translate: vue.unref(attrs).translate,
          "auto-select-search-value": __props.autoSelectSearchValue,
          "create-on-the-go": __props.createOnTheGo,
          disabled: vue.unref(disabled),
          loading: internalLoading.value,
          "icon-filter": __props.iconFilter,
          multiple: vue.unref(multiple),
          "search-filter-active": __props.searchFilterActive,
          "show-deselect-icon-loader": __props.showDeselectIconLoader,
          "toggling-saves-search-value": __props.togglingSavesSearchValue,
          "toggle-options-by-select": vue.unref(toggleOptionsBySelect),
          placeholder: __props.placeholder,
          "show-search-field": vue.unref(showSearchField),
          "empty-objects-placeholder": vue.unref(emptyObjectsPlaceholder),
          label: vue.unref(label),
          "multiple-blocks-limit-message": __props.multipleBlocksLimitMessage,
          "theme-type": vue.unref(themeType),
          "increase-display-by": __props.increaseDisplayBy,
          multipleBlocksLimit: __props.multipleBlocksLimit,
          "toggle-multiple-blocks-limit": __props.toggleMultipleBlocksLimit,
          "selected-options": selectedOptions.value,
          emitter: vue.unref(emitter),
          "create-custom-option-label": vue.unref(createCustomOptionLabel),
          "create-option-placeholder": __props.createOptionPlaceholder,
          "external-options-loader": externalOptionsLoader.value,
          "input-id": vue.unref(inputId)
        }, vue.createSlots({ _: 2 /* DYNAMIC */ }, [
          (vue.unref(slots).labelBlock)
            ? {
                name: "labelBlock",
                fn: vue.withCtx(({ labelBlockValue }) => [
                  vue.renderSlot(_ctx.$slots, "labelBlock", { labelBlockValue: labelBlockValue })
                ]),
                key: "0"
              }
            : undefined,
          (vue.unref(slots).multipleBlocks)
            ? {
                name: "multipleBlocks",
                fn: vue.withCtx(({ selectedOptions, deselectBlock }) => [
                  vue.renderSlot(_ctx.$slots, "multipleBlocks", {
                    selectedOptions: selectedOptions,
                    deselectBlock: deselectBlock
                  })
                ]),
                key: "1"
              }
            : undefined,
          (vue.unref(slots).optionBlock)
            ? {
                name: "optionBlock",
                fn: vue.withCtx(({ label, deselectBlock, index }) => [
                  vue.renderSlot(_ctx.$slots, "optionBlock", {
                    label: label,
                    index: index,
                    deselectBlock: deselectBlock
                  })
                ]),
                key: "2"
              }
            : undefined,
          (vue.unref(slots).maxElements)
            ? {
                name: "maxElements",
                fn: vue.withCtx(() => [
                  vue.renderSlot(_ctx.$slots, "maxElements")
                ]),
                key: "3"
              }
            : undefined,
          (__props.toggleMultipleBlocksLimit)
            ? {
                name: "showMore",
                fn: vue.withCtx(({ showMoreOptions }) => [
                  vue.renderSlot(_ctx.$slots, "showMore", { showMoreOptions: showMoreOptions })
                ]),
                key: "4"
              }
            : undefined
        ]), 1032 /* PROPS, DYNAMIC_SLOTS */, ["accesskey", "autocomplete", "name", "spellcheck", "tabindex", "translate", "auto-select-search-value", "create-on-the-go", "disabled", "loading", "icon-filter", "multiple", "search-filter-active", "show-deselect-icon-loader", "toggling-saves-search-value", "toggle-options-by-select", "placeholder", "show-search-field", "empty-objects-placeholder", "label", "multiple-blocks-limit-message", "theme-type", "increase-display-by", "multipleBlocksLimit", "toggle-multiple-blocks-limit", "selected-options", "emitter", "create-custom-option-label", "create-option-placeholder", "external-options-loader", "input-id"])
      ]),
      vue.createElementVNode("div", _hoisted_2, [
        vue.renderSlot(_ctx.$slots, "toggle", { toggleOptionsList: vue.unref(toggleOptionsList) }, () => [
          vue.createVNode(script$1, {
            ref_key: "extendedMultiselectToggle",
            ref: extendedMultiselectToggle,
            tabindex: vue.unref(attrs).tabindex,
            disabled: vue.unref(disabled),
            "dropdown-active": dropdownActive.value,
            loading: internalLoading.value,
            "icon-filter": __props.iconFilter,
            "icon-size": __props.iconSize,
            "toggle-icon": __props.toggleIcon,
            emitter: vue.unref(emitter)
          }, null, 8 /* PROPS */, ["tabindex", "disabled", "dropdown-active", "loading", "icon-filter", "icon-size", "toggle-icon", "emitter"])
        ])
      ]),
      vue.createElementVNode("div", _hoisted_3, [
        vue.renderSlot(_ctx.$slots, "cancel", { cancel: vue.unref(cancel) }, () => [
          (vue.unref(showClearIcon))
            ? (vue.openBlock(), vue.createBlock(script$5, {
                key: 0,
                tabindex: vue.unref(attrs).tabindex,
                disabled: vue.unref(disabled),
                "show-search-field": vue.unref(showSearchField),
                loading: internalLoading.value,
                "icon-filter": __props.iconFilter,
                "icon-size": __props.iconSize,
                "selected-options": selectedOptions.value,
                emitter: vue.unref(emitter)
              }, null, 8 /* PROPS */, ["tabindex", "disabled", "show-search-field", "loading", "icon-filter", "icon-size", "selected-options", "emitter"]))
            : vue.createCommentVNode("v-if", true)
        ])
      ])
    ], 6 /* CLASS, STYLE */),
    vue.createVNode(vue.Transition, {
      name: "extended-toggle",
      type: "transition"
    }, {
      default: vue.withCtx(() => [
        (dropdownActive.value)
          ? (vue.openBlock(), vue.createBlock(script$2, {
              key: 0,
              "auto-select-created-option": __props.autoSelectCreatedOption,
              "clear-by-select-when-multiple": __props.clearBySelectWhenMultiple,
              "create-on-the-go": __props.createOnTheGo,
              "disabled-primitive-options-converted": disabledPrimitiveOptionsConverted.value,
              "highlight-options": __props.highlightOptions,
              loading: internalLoading.value,
              multiple: vue.unref(multiple),
              "selected-options-shown": __props.selectedOptionsShown,
              "show-insert-warnings": vue.unref(showInsertWarnings),
              "show-marker": __props.showMarker,
              "chosen-toggle-appearance-side": chosenToggleAppearanceSide.value,
              "create-option-type": __props.createOptionType,
              "disable-by-field": __props.disableByField,
              "empty-objects-placeholder": vue.unref(emptyObjectsPlaceholder),
              label: vue.unref(label),
              "search-by-field": __props.searchByField,
              "theme-type": vue.unref(themeType),
              "any-option-wrapper-block-height": __props.anyOptionWrapperBlockHeight,
              "max-options-count": __props.maxOptionsCount,
              "min-options-count": __props.minOptionsCount,
              "options-padding": __props.optionsPadding,
              "toggle-max-height": vue.unref(toggleMaxHeight),
              "toggle-min-height": __props.toggleMinHeight,
              "create-option-fields": __props.createOptionFields,
              options: restrictedOptions.value,
              "restricted-options": restrictedOptions.value,
              "selected-options": selectedOptions.value,
              "special-keys-block": __props.specialKeysBlock,
              "preselected-option": vue.unref(preselectedOption),
              "preselected-options": vue.unref(preselectedOptions),
              emitter: vue.unref(emitter),
              "create-custom-option-label": vue.unref(createCustomOptionLabel),
              "external-options-loader": externalOptionsLoader.value
            }, vue.createSlots({ _: 2 /* DYNAMIC */ }, [
              (vue.unref(slots).listHeader)
                ? {
                    name: "listHeader",
                    fn: vue.withCtx(() => [
                      vue.renderSlot(_ctx.$slots, "listHeader")
                    ]),
                    key: "0"
                  }
                : undefined,
              (__props.maxOptionsCount)
                ? {
                    name: "moreThanLimit",
                    fn: vue.withCtx(() => [
                      vue.renderSlot(_ctx.$slots, "moreThanLimit")
                    ]),
                    key: "1"
                  }
                : undefined,
              (__props.minOptionsCount)
                ? {
                    name: "lessThanLimit",
                    fn: vue.withCtx(() => [
                      vue.renderSlot(_ctx.$slots, "lessThanLimit")
                    ]),
                    key: "2"
                  }
                : undefined,
              (vue.unref(slots).option)
                ? {
                    name: "option",
                    fn: vue.withCtx(({ option, createCustomOptionLabel }) => [
                      vue.renderSlot(_ctx.$slots, "option", {
                        option: option,
                        createCustomOptionLabel: createCustomOptionLabel
                      })
                    ]),
                    key: "3"
                  }
                : undefined,
              (vue.unref(slots).marker)
                ? {
                    name: "marker",
                    fn: vue.withCtx(({ selected }) => [
                      vue.renderSlot(_ctx.$slots, "marker", { selected: selected })
                    ]),
                    key: "4"
                  }
                : undefined,
              (__props.noResultsBlockShown)
                ? {
                    name: "noResults",
                    fn: vue.withCtx(() => [
                      vue.renderSlot(_ctx.$slots, "noResults")
                    ]),
                    key: "5"
                  }
                : undefined,
              (vue.unref(slots).noOptions)
                ? {
                    name: "noOptions",
                    fn: vue.withCtx(() => [
                      vue.renderSlot(_ctx.$slots, "noOptions")
                    ]),
                    key: "6"
                  }
                : undefined,
              (vue.unref(slots).listFooter)
                ? {
                    name: "listFooter",
                    fn: vue.withCtx(() => [
                      vue.renderSlot(_ctx.$slots, "listFooter")
                    ]),
                    key: "7"
                  }
                : undefined
            ]), 1032 /* PROPS, DYNAMIC_SLOTS */, ["auto-select-created-option", "clear-by-select-when-multiple", "create-on-the-go", "disabled-primitive-options-converted", "highlight-options", "loading", "multiple", "selected-options-shown", "show-insert-warnings", "show-marker", "chosen-toggle-appearance-side", "create-option-type", "disable-by-field", "empty-objects-placeholder", "label", "search-by-field", "theme-type", "any-option-wrapper-block-height", "max-options-count", "min-options-count", "options-padding", "toggle-max-height", "toggle-min-height", "create-option-fields", "options", "restricted-options", "selected-options", "special-keys-block", "preselected-option", "preselected-options", "emitter", "create-custom-option-label", "external-options-loader"]))
          : vue.createCommentVNode("v-if", true)
      ]),
      _: 3 /* FORWARDED */
    })
  ], 42 /* CLASS, PROPS, NEED_HYDRATION */, _hoisted_1))
}
}

};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".extended__multiselect-wrapper,.extended__multiselect-wrapper--disabled{--basic-color:#708090;--basic-transparent:rgba(112,128,144,.6);--cancel:#b22222;--cancel-backgound-color:rgba(179,33,33,.1);--dark-slate-blue:#483d8b;--dark-slate-blue-transparent:rgba(72,61,139,.6);--dark-slate-grey:#2f4f4f;--dark-slate-grey-transparent:rgba(47,79,79,.6);--disabled:hsla(0,0%,69%,.6);--hover-color:#fff;--default-color:#fff;--loader-color:#00bfff;--placeholder:grey;--strict:#000;--strict-transparent:rgba(0,0,0,.6);--teal:teal;--teal-transparent:rgba(0,128,128,.6);--block-border-radius:4px;--block-cancel-padding:4px;--block-gap:6px;--block-padding:1px 3px 1px 7px;--border-radius:6px;--border-radius-small:3px;--cancel-padding:3px 8px;--grid-columns:1fr 36px 36px;--grid-rows:1fr 36px;--half-size:50%;--icon-size-block:14px;--icon-size-large:18px;--icon-size-medium:15px;--icon-size-small:12px;--increaser-padding:3px 7px;--max-size:100%;--min-block-height:25px;--options-padding:6px 0;--outer-gap:10px;--root-padding:6px 10px;--toggle-icon-gap:1px;--wide-text:700;--wrapper-padding:5px 10px;--z-index-options:10;--border:1px solid;--default-cursor:default;--icons-align-self:start;--icons-justify-self:center;--pointer-cursor:pointer;--wrapper-transition:border-top-left-radius 250ms ease 0s,border-top-right-radius 250ms ease 0s,border-bottom-left-radius 250ms ease-out,border-bottom-right-radius 250ms ease-out}.extended-toggle-enter-active,.extended-toggle-leave-active{transition:opacity .25s}.extended-toggle-enter,.extended-toggle-leave-to{opacity:0}@keyframes loading{0%{transform:rotate(0deg)}to{transform:rotate(2turn)}}.extended__multiselect-wrapper,.extended__multiselect-wrapper--disabled{cursor:var(--pointer-cursor);height:var(--max-size);position:relative;width:var(--max-size)}.extended__multiselect-wrapper *,.extended__multiselect-wrapper--disabled *{box-sizing:border-box;font-family:inherit;font-size:inherit;font-style:inherit}.extended-multiselect-wrapper,.extended__multiselect-options_container{background-color:var(--default-color)}.extended__multiselect-wrapper--disabled .extended__multiselect-container{background-color:var(--disabled);cursor:var(--default-cursor);user-select:none}.extended__multiselect-wrapper--disabled .extended__multiselect-input,.extended__multiselect-wrapper--disabled .extended__multiselect-input--hidden{cursor:--default-cursor}.extended__multiselect-container{align-items:center;transition:var(--wrapper-transition)}.extended__multiselect,.extended__multiselect-slate-blue,.extended__multiselect-slate-grey,.extended__multiselect-strict,.extended__multiselect-teal{background-color:var(--default-color);border:var(--border);border-radius:var(--border-radius);display:grid;padding:var(--wrapper-padding);width:var(--max-size)}.extended__multiselect,.extended__multiselect .extended__multiselect-increaser:active{border-color:var(--basic-color)}.extended__multiselect-slate-grey,.extended__multiselect-slate-grey .extended__multiselect-increaser:active{border-color:var(--dark-slate-grey)}.extended__multiselect-slate-blue,.extended__multiselect-slate-blue .extended__multiselect-increaser:active{border-color:var(--dark-slate-blue)}.extended__multiselect-teal,.extended__multiselect-teal .extended__multiselect-increaser:active{border-color:var(--teal)}.extended__multiselect-strict,.extended__multiselect-strict .extended__multiselect-increaser:active{border-color:var(--strict)}.extended__multiselect-options,.extended__multiselect-options-slate-blue,.extended__multiselect-options-slate-grey,.extended__multiselect-options-strict,.extended__multiselect-options-teal{-webkit-overflow-scrolling:touch;background-color:var(--default-color);border:var(--border);border-bottom-left-radius:var(--border-radius);border-bottom-right-radius:var(--border-radius);border-top:none;border-top-left-radius:0;border-top-right-radius:0;color:inherit;cursor:var(--pointer-cursor);display:flex;flex-flow:column nowrap;overflow:auto;position:absolute;top:var(--max-size);user-select:none;width:var(--max-size);z-index:var(--z-index-options)}.extended__multiselect-options-slate-blue>:not([class^=extended__multiselect-options_option]):not([class=extended__multiselect-options_container]),.extended__multiselect-options-slate-grey>:not([class^=extended__multiselect-options_option]):not([class=extended__multiselect-options_container]),.extended__multiselect-options-strict>:not([class^=extended__multiselect-options_option]):not([class=extended__multiselect-options_container]),.extended__multiselect-options-teal>:not([class^=extended__multiselect-options_option]):not([class=extended__multiselect-options_container]),.extended__multiselect-options>:not([class^=extended__multiselect-options_option]):not([class=extended__multiselect-options_container]){padding:var(--root-padding)}.extended__multiselect-options--atop{border-bottom-left-radius:0;border-bottom-right-radius:0;border-top:var(--border);border-top-left-radius:var(--border-radius);border-top-right-radius:var(--border-radius)}.extended__multiselect-clear--active{grid-template-columns:var(--grid-columns)}.extended__multiselect-clear--locked{grid-template-columns:var(--grid-rows)}.extended__multiselect,.extended__multiselect-options{border-color:var(--basic-color)}.extended__multiselect-options-slate-grey,.extended__multiselect-slate-grey{border-color:var(--dark-slate-grey)}.extended__multiselect-options-slate-blue,.extended__multiselect-slate-blue{border-color:var(--dark-slate-blue)}.extended__multiselect-options-teal,.extended__multiselect-teal{border-color:var(--teal)}.extended__multiselect-options-strict,.extended__multiselect-strict{border-color:var(--strict)}.extended__multiselect-block,.extended__multiselect-input{border:none;min-height:var(--min-block-height);outline:none;width:var(--max-size)}.extended__multiselect-block>span{white-space:pre-line;word-break:break-all}.extended__multiselect-input{color:inherit;cursor:text}.extended__multiselect-input:focus::placeholder{color:var(--strict);font-weight:var(--wide-text)}.extended__multiselect-input--trigger-option::placeholder{color:var(--strict);font-weight:var(--wide-text)}.extended__multiselect-block{align-items:center;color:inherit;display:flex;flex-flow:row nowrap;user-select:none}.extended__multiselect-input--hidden{border:none;cursor:var(--pointer-cursor);height:0;opacity:0;padding:0;position:absolute;width:0}.extended__multiselect-cancel,.extended__multiselect-cancel--disabled,.extended__multiselect-loader,.extended__multiselect-toggle,.extended__multiselect-toggle--disabled{align-items:center;display:flex;flex-flow:row nowrap;justify-content:center;user-select:none}.extended__multiselect-toggle--active{transform:rotate(180deg);transform-origin:50% 50%;transition:transform .2s ease-out}.extended__multiselect-toggle--locked{transform:rotate(0deg);transform-origin:50% 50%;transition:transform .2s ease-out}.extended__multiselect-cancel_wrapper,.extended__multiselect-toggle_wrapper{align-self:var(--icons-align-self);cursor:var(--pointer-cursor);justify-self:var(--icons-justify-self)}.extended__multiselect-toggle{margin-top:var(--toggle-icon-gap)}.extended__multiselect-toggle,.extended__multiselect-toggle--disabled{padding:var(--cancel-padding)}.extended__multiselect-cancel--disabled_icon-large,.extended__multiselect-cancel_icon-large,.extended__multiselect-loader_icon-large,.extended__multiselect-toggle--disabled_icon-large,.extended__multiselect-toggle_icon-large{height:var(--icon-size-large);width:var(--icon-size-large)}.extended__multiselect-cancel--disabled_icon-medium,.extended__multiselect-cancel_icon-medium,.extended__multiselect-loader_icon-medium,.extended__multiselect-toggle--disabled_icon-medium,.extended__multiselect-toggle_icon-medium{height:var(--icon-size-medium);width:var(--icon-size-medium)}.extended__multiselect-cancel--disabled_icon-small,.extended__multiselect-cancel_icon-small,.extended__multiselect-loader_icon-small,.extended__multiselect-toggle--disabled_icon-small,.extended__multiselect-toggle_icon-small{height:var(--icon-size-small);width:var(--icon-size-small)}.extended__multiselect-cancel--disabled_icon-deselect,.extended__multiselect-cancel_icon-deselect,.extended__multiselect-loader_icon-deselect,.extended__multiselect-toggle--disabled_icon-deselect,.extended__multiselect-toggle_icon-deselect{height:var(--icon-size-block);width:var(--icon-size-block)}.extended__multiselect-cancel,.extended__multiselect-cancel--disabled{align-items:center;border:var(--border);border-color:transparent;display:flex;flex-flow:row nowrap;padding:var(--cancel-padding)}.extended__multiselect-cancel:active{background-color:var(--cancel-backgound-color);border-color:var(--cancel);border-radius:var(--border-radius-small)}.extended__multiselect-filter_basic{filter:url(#basicFilter)}.extended__multiselect-filter_black{filter:url(#blackFilter)}.extended__multiselect-filter_green{filter:url(#greenFilter)}.extended__multiselect-loader_default-loader{filter:url(#filterLoaderDefault)}.extended__multiselect-loader_basic{filter:url(#filterLoaderBasic)}.extended__multiselect-loader_slate-grey{filter:url(#filterLoaderSlateGrey)}.extended__multiselect-loader_slate-blue{filter:url(#filterLoaderSlateBlue)}.extended__multiselect-loader_teal{filter:url(#filterLoaderTeal)}.extended__multiselect-loader_strict{filter:url(#filterLoaderStrict)}.extended__multiselect-loader-animate{animation-duration:3s;animation-iteration-count:infinite;animation-name:loading;animation-timing-function:linear}.extended__multiselect-options_container{display:flex;flex-flow:column nowrap}.extended__multiselect-options_option,.extended__multiselect-options_option-slate-blue,.extended__multiselect-options_option-slate-grey,.extended__multiselect-options_option-strict,.extended__multiselect-options_option-teal{align-items:center;color:inherit;display:flex;flex-flow:row nowrap;padding:var(--root-padding)}.extended__multiselect--multiple-basic,.extended__multiselect--multiple-slate-blue,.extended__multiselect--multiple-slate-grey,.extended__multiselect--multiple-strict,.extended__multiselect--multiple-teal{align-items:center;border-radius:var(--block-border-radius);display:flex;flex-flow:row nowrap;gap:var(--block-gap);min-height:var(--min-block-height);padding:var(--block-padding)}.extended__multiselect--multiple-basic,.extended__multiselect-options_option:hover{background-color:var(--basic-transparent);color:var(--hover-color)}.extended__multiselect--multiple-slate-grey,.extended__multiselect-options_option-slate-grey:hover{background-color:var(--dark-slate-grey-transparent);color:var(--hover-color)}.extended__multiselect--multiple-slate-blue,.extended__multiselect-options_option-slate-blue:hover{background-color:var(--dark-slate-blue-transparent);color:var(--hover-color)}.extended__multiselect--multiple-teal,.extended__multiselect-options_option-teal:hover{background-color:var(--teal-transparent);color:var(--hover-color)}.extended__multiselect--multiple-strict,.extended__multiselect-options_option-strict:hover{background-color:var(--strict-transparent);color:var(--hover-color)}.extended__multiselect-marker-shape{border:var(--border);border-color:var(--basic-color);border-radius:var(--half-size);height:var(--icon-size-block);margin-right:var(--block-gap);width:var(--icon-size-block)}.extended__multiselect-marker-shape--selected{border-color:var(--cancel)}.extended__multiselect-marker-shape-only{border:var(--border);border-color:transparent;height:var(--icon-size-block);margin-left:var(--block-gap);width:var(--icon-size-block)}.extended__multiselect-container+.extended__multiselect-options--marker>.extended__multiselect-option-create,.extended__multiselect-container+.extended__multiselect-options--marker>span:not([id^=option-label]){padding-left:30px}.extended__multiselect-options_option--disabled{background-color:var(--disabled);cursor:--default-cursor;user-select:none}.extended__multiselect_deselect-block-icon{height:var(--icon-size-block);width:var(--icon-size-block)}.extended__multiselect-block--multiple>div{display:flex;flex-flow:row wrap;gap:var(--outer-gap)}.extended__multiselect-block_cancel-wrapper,.extended__multiselect-block_cancel-wrapper--loading{align-items:center;border:var(--border);border-color:transparent;display:flex;flex-flow:row nowrap;padding:var(--block-cancel-padding)}.extended__multiselect-block_cancel-wrapper:active{background-color:var(--cancel-backgound-color);border-color:var(--cancel);border-radius:var(--border-radius-small)}.extended__multiselect-increaser{border:var(--border);border-color:transparent;padding:var(--increaser-padding)}.extended__multiselect-placeholder{color:var(--placeholder);margin-left:2px}";
styleInject(css_248z);

script.__file = "src/components/Vue3ExtendedMultiselect.vue";

exports.default = script;
//# sourceMappingURL=Vue3ExtendedMultiselect.cjs.js.map
