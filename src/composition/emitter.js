import { ref } from "vue";

import LocalEmitter from "../tools/LocalEmitter";

export default function useEmitter() {
  const emitter = ref(new LocalEmitter());

  return { emitter };
}
