export default function useLabels(
  label,
  createCustomOptionLabel,
  emptyObjectsPlaceholder,
) {
  /**
   * Creates label of any kind of option
   * @function
   * @param {string} label - label field in options of type "object"
   * @param {option} UnionPropType
   * @returns {string} label
   */
  const optionCreateLabel = (option) => {
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

  return { optionCreateLabel };
}