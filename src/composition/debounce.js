import { ref } from "vue";

import Debounce from "../tools/Debounce";

export default function useDebounce() {
  const DebounceConstructor = ref(Debounce);

  return { DebounceConstructor };
}
