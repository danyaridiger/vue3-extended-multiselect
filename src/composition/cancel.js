export default function useCancel(
  disabled,
  loading,
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
    if (disabled.value || loading.value) return;

    const deselectedOptions = selectedOptions.value;
      
    emitter.value.emit("extended:skip-block-blur-zeroing");
    emitter.value.emit("extended:deselect-option", { 
      index: null,
      clearAll: true,
      deselectedOptions,
    });
      
    if (!showSearchField.value) return;

    emitter.value.emit("extended:clean-options");

    setSearchValue(null);
    setSearchPattern(null);
  };

  return { cancel };
}