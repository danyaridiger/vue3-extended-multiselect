import { computed, readonly } from "vue";

export default function useToggle(loading, disabled, internalLoader, emitter) {
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
      
    emitter.value.emit("extended:toggle-options");
  };

  return {
    toggleSlotClass: readonly(toggleSlotClass),
    toggleOptionsList,
  };
}