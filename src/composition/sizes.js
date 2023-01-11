import { 
  computed,
  getCurrentInstance,
  readonly,
} from "vue";

export default function useSizes(iconSize) {
  /**
   * Defines classes for each kind of icon
   * @function
   * @returns {string} class
   */
  const iconSizeClass = computed(() => {
    let basicIconSize = "extended__multiselect";

      switch(getCurrentInstance().type.__name) {
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

      switch(iconSize.value) {
        case "large":
          return `${basicIconSize}-large`;
        case "medium":
          return `${basicIconSize}-medium`;
        case "small":
          return `${basicIconSize}-small`;
        default:
          return `${basicIconSize}-large`;
      }
  });

  return { iconSizeClass: readonly(iconSizeClass) };
}