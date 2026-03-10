export default function useLabels(
  label,
  createCustomOptionLabel,
  emptyObjectsPlaceholder,
) {
  /**
   * Creates label of any kind of option
   * @function
   * @param {option} UnionPropType
   * @returns {string} label
   */
  const optionCreateLabel = (option) => {
    const isFunction = typeof option === "function";

    if (!option && isFunction) return "";

    if (createCustomOptionLabel.value) {
      return createCustomOptionLabel.value(option);
    }

    if (Array.isArray(option) && option.length > 0) {
      return option.join(", ");
    }

    if (typeof option !== "object") return option.toString();

    if (Object.keys(option).length === 0) {
      return emptyObjectsPlaceholder.value;
    }

    const hasLabel = Object.getOwnPropertyNames(option).includes(label.value);

    if (hasLabel) {
      return option[label.value] && typeof option[label.value] === "object"
        ? JSON.stringify(option[label.value])
        : option[label.value];
    }

    return "";
  };

  return { optionCreateLabel };
}
