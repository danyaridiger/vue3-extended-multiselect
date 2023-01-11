import { computed, readonly } from "vue";

import emitter from "../events/emitter"

export default function useToggle(loading, disabled, internalLoader, emitterUniqueId) {
  /**
   * Toggles classes of slots if "loading"
   * or "disabled" props equals true
   * @function
   * @returns {string} class
   */
  const toggleSlotClass = computed(() => {
    return loading.value || disabled.value || (internalLoader && internalLoader.value)
     ? "extended__multiselect-toggle--disabled"
     : "extended__multiselect-toggle";
  });

  /**
   * Emits an event which listeners will toggle options list
   * @function
   * @emits extended:toggle-options
   * @param {MouseEvent|KeyboardEvent} event - MouseEvent or KeyboardEvent instance
   */
  const toggleOptionsList = (event) => {
    if (event && event.code === "Tab") return;
      
    emitter.emit(`extended:toggle-options-${emitterUniqueId.value}`);
  };

  return {
    toggleSlotClass: readonly(toggleSlotClass),
    toggleOptionsList,
  };
}