import { ref } from "vue";

import LocalEmitter from "../events/LocalEmitter";

export default function useEmitter() {
    const emitter = ref(new LocalEmitter());

    return { emitter };
}