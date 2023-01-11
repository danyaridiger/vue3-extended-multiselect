import emitter from "../events/emitter";

import useSearchValue from './search-value';

export default function useCancel(
  disabled, 
  showSearchField, 
  selectedOptions, 
  emitterUniqueId,
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
      
    emitter.emit(`extended:skip-block-blur-zeroing-${emitterUniqueId.value}`);
    emitter.emit(`extended:deselect-option-${emitterUniqueId.value}`, { 
      index: null,
      clearAll: true,
    });
      
    if (!showSearchField.value) return;

    emitter.emit(`extended:clean-options-${emitterUniqueId.value}`, selectedOptions.value);

    setSearchValue(null);
    setSearchPattern(null);
  };

  return { cancel };
}