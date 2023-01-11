import { reactive, readonly } from "vue";

export default function useSearchValue() {
  /**
   * @property {string|null} searchValue - value of search field
   * @property {string|null} searchPattern - pattern of inner search for available options
   */
  const searchState = reactive({
    searchValue: null,
    searchPattern: null,
  });

  /**
   * @function setSearchValue
   * @param {string|null} value - new value of search field
   */
  const setSearchValue = (value) => {
    searchState.searchValue = value;
  };

  /**
   * @function setSearchPattern
   * @param {string|null} pattern - new pattern of inner search for available options
   */
  const setSearchPattern = (pattern) => {
    searchState.searchPattern = pattern;
  };

  return {
    searchState: readonly(searchState), 
    setSearchValue,
    setSearchPattern,
  };
}