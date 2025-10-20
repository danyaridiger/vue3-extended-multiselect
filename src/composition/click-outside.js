import { ref } from "vue";

import ExtendedClickOutside from "extended-click-outside";

export default function useClickOutside() {
  const clickOutside = ref(new ExtendedClickOutside());

  return { clickOutside };
}
