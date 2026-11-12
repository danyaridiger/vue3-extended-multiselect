import { mount } from "@vue/test-utils";
import Vue3ExtendedMultiselect from "../../src/components/Vue3ExtendedMultiselect.vue";

describe("disabling an open dropdown", () => {
  it("closes the options and ignores stale selection", async () => {
    const wrapper = mount(Vue3ExtendedMultiselect, {
      attachTo: document.body,
      props: {
        modelValue: "Draft",
        options: ["Draft", "Confirmed"],
      },
    });

    try {
      await wrapper.find(".extended__multiselect-toggle").trigger("click");
      const option = wrapper
        .findAll(".extended__multiselect-options_option")
        .find((item) => item.text() === "Confirmed");
      expect(option).toBeDefined();

      await wrapper.setProps({ disabled: true });
      await option.trigger("click");

      expect(wrapper.find(".extended__multiselect-options_container").exists()).toBe(false);
      expect(wrapper.emitted("select")).toBeUndefined();
      expect(wrapper.emitted("update:modelValue") ?? []).not.toContainEqual(["Confirmed"]);
    } finally {
      wrapper.unmount();
    }
  });
});
