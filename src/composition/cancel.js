import useSearchValue from './search-value';

export default function useCancel(
  disabled, 
  showSearchField, 
  selectedOptions, 
  emitter,
  setSearchValue,
  setSearchPattern,
) {
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
      
    emitter.value.emit("extended:skip-block-blur-zeroing");
    emitter.value.emit("extended:deselect-option", { 
      index: null,
      clearAll: true,
    });
      
    if (!showSearchField.value) return;

    emitter.value.emit("extended:clean-options", selectedOptions.value);

    setSearchValue(null);
    setSearchPattern(null);
  };

  return { cancel };
}