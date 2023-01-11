export default function usePreselectedOptions(
  label, 
  emptyObjectsPlaceholder, 
  showInsertWarnings,
) {
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
        createdLabel = typeof option[label.value] === "object" 
         ? JSON.stringify(option[label.value]) 
         : option[label.value];
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
  const optionTypeRestrictor = (option) => {
    if (!option) return false;

    const isObjectArrayInstance = Object.getPrototypeOf(option).constructor.name 
     !== "Object"
     && Object.getPrototypeOf(option).constructor.name !== "Array";
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
    optionTypeRestrictor,
  };
}