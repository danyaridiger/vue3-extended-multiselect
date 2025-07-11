# Patch notes

Current `vue3-extended-multiselect` version: **2.3.11**

***

### 0.0.1 (2022-11-29)

Component `vue3-extended-multiselect` was released.

### 0.0.2 (2022-11-29)

Small fixes in documentation.

### 0.0.3 (2022-11-29)

Changing font-size property of "props" table in documentation.

### 0.0.4 (2022-11-30)

Correction of cancel button highlighting while loading.

### 0.0.5 (2022-11-30)

Changing tables format in documentation.

### 0.0.6 (2022-11-30)

Relocation of main.js file for local qa tests.

### 0.1.0 (2022-12-01)

* Changing the style language from `sass` to `css` for greater package accessibility.
* Removal of dev-dependency "sass".
* Removal of dev-dependency "sass-loader".

### 0.1.1 (2022-12-01)

Placeholder color fixes.

### 0.1.2 (2022-12-01)

Removal of excess symbol in styles.

### 0.1.3 (2022-12-05)

Adding .nvmrc file.

### 0.1.4 (2022-12-05)

Adding descriptive comments for some types in typings.

### 0.2.0 (2022-12-07)

* Fixing bug with hidden "noOptions" slot when list of available options is empty.
* Fixing warning with incorrect array type reactive field initialization.
* Adding .eslintignore file.
* Replacing some of default exports with common exports.
* Arranging CSS-variabled in alphabetical order.
* Adding customizing section in documentation.

### 0.2.1 (2022-12-08)

* Replacing all common exports with default exports.
* Removal of excess emitter import in composition api.

### 0.3.0 (2022-12-08)

* Adding vite.config.js file.
* Adding "vite" dependency
* Adding "vite-plugin-require" dependency
* Component adaptation for vite.

### 1.0.0 (2022-12-10)

* Removal of dependency "tiny-emitter".
* Removal of dependency "vite".
* Removal of dependency "vite-plugin-require".
* Adding "mitt" dependency.
* Adding "babel-plugin-transform-import-meta" dev-dependency.
* Removal of .eslintignore file.
* Removal of vite.config.js file.
* Adding "events" directory with emitter.js file using "mitt" dependency.
* Adding image-path.js file with "useImagePath" custom hook.
* Adding emitter import in composition api from "mitt" dependency.
* Adding some new css-variabled.
* Removal of some old css-variables.
* Changing styles of "marker" and "option" slots.
* Adding new fields in "parserOptions" section of .eslintrc.
* Disabling "no-undef" rule in .eslintrc.
* Static file import optimization for different module builders.

### 1.1.0 (2022-12-10)

* Removal of dependency "lodash.debounce".
* Removal of dependency "click-outside".
* Adding "lodash-es" dependency.
* Adding "vue3-click-away" dependency.
* Adding "transformIgnorePatterns" section in jest.config.js.
* Replacing "clickOutside" function in "onMounted" hook with "v-click-outside" directive.
* Fixing bug with rolling up options list when "toggleOptionsBySelect" prop is set to false.
* Fixing bug with reaching "optionsWrapper" ref before initialization.

### 1.1.1 (2022-12-10)

* Replacing package-lock.json file with new one.

### 1.1.2 (2022-12-10)

* Replacing dev-dependency "@vue/cli-plugin-eslint" with its latest version.

### 1.1.3 (2022-12-11)

* Adding "searchByField" optional prop.
* Adding unit-test for new optional prop.

### 1.1.4 (2022-12-13)

* Adding "optionCreateLabel" to expose as utility.
* Fixing bug with wrong name of label field

### 1.1.5 (2022-12-14)

* Fixing bug with empty raw options list when using async loader.

### 1.1.6 (2022-12-14)

* Fixing bug with extra call of async loader by changing value of search field.
* Adding new internal prop "externalOptionsLoader" to ExtendedMultiselectInput.
* Searching for options by async loader is moved to in separate method.

### 1.1.7 (2022-12-15)

* Adding "disableByField" prop for determination of field in options of type "object" which value will be used to disable such options.

### 1.1.8 (2022-12-18)

* Changing default value of "toggleIcon" prop to "base-arrow".

### 1.2.0 (2022-12-20)

* Adding "uuid" dependency
* Removal of "id" attribute of extended multiselect wrapper.
* Removal of "querySelector" usage in ExtendedMultiselect component. Switching to using event emitter.
* Fixing bug with bound event emitters between two extended multiselects.
* Fixing bug with undefined class in extended multiselect wrapper class list.

### 1.2.1 (2022-12-21)

* Moving transitions of "border-radius" css-property from computed property to css variable.

### 1.2.2 (2022-12-21)

* Removal of excess "transition" css-property.

### 1.2.3 (2022-12-22)

* Fixing bug with excess bottom offset of options list when prop "toggleAppearanceSide" is set to "atop".
* Supplementation of some css-variables.

### 1.2.4 (2022-12-22)

* Fixing bug of too wide extended multiselect with long single selected option.

### 1.3.0 (2023-01-11)

* Adding "autoSelectSearchValue" optional prop.
* Adding unit-test for new optional prop.
* Fixing bug with setting search pattern when deselecting of all options.
* Fixing bug with selected options display when prop "toggleOptionsBySelect" is set to false.

### 1.4.0 (2023-01-14)

* Removal of dependency "mitt".
* Adding LocalEmitter.js file with simplified event emitter instead of dependency "mitt".
* Changing event types in some of props unit-tests.
* Fixing bug with toggle restriction in custom slots.

### 1.4.1 (2023-01-14)

* Small fixes in documentation.

### 1.4.2 (2023-01-15)

* Regenerating of .nvmrc file.

### 1.5.0 (2023-01-21)

* Removal of dependency "uuid".
* Adding "events" prop to child components using LocalEmitter.
* Adding emitter.js file to composition directory with reactive LocalEmitter instace.
* Removal of "emitterUniqueId" prop from child components.
* Removal of emitter.js file from events directory.
* Changing event emitter invocations in some of unit tests.

### 1.5.1 (2023-01-25)

* Fixing bug with missing toggle on option click in single selection.

### 1.5.2 (2023-01-25)

* Fixing bug with empty class list in toggle restrictor when "disabled" prop equals true.

### 1.5.3 (2023-01-25)

* Fixing bug with incorrect setting of preselected options from v-model.
* Fixing bug with incompatible single preselected option.

### 1.5.4 (2023-01-25)

* Removal of restrictions for preselected options from v-model.

### 1.5.5 (2023-01-26)

* Changing some option block styles.

### 1.5.6 (2023-01-26)

* Fixing bug with "noOption" slot being displayed when search field value is not empty.
* Fixing bug with reload of preselected options when using external loader.

### 1.5.7 (2023-01-26)

* Removal of internal loading state because of using "lodash.debounce".

### 1.5.8 (2023-02-01)

* Adding CONTRIBUTING.md file.

### 1.5.9 (2023-02-01)

* "loading" prop no longer disables search field.
* Changing value of css-variable "--min-block-height" from 25px to 26px.

### 1.5.10 (2023-02-01)

* Fixing bug with field focus when selecting an option.
* Removal of validator from "emptyObjectsPlaceholder" prop.

### 1.6.0 (2023-02-02)

* Adding "showDeselectIconLoader" optional prop.
* Adding unit-test for new optional prop.
* Adding loader icon to deselect button of multiple option blocks depending on "showDeselectIconLoader" optional prop.
* Changing styles of multiple option blocks.

### 1.6.1 (2023-02-02)

* Fixing bug with not clotting options list when single option was selected.

### 1.6.2 (2023-02-02)

* Fixing bug with not clotting options list when multiple options were selected.

### 1.6.3 (2023-02-02)

* Fixing bug with duplicate options when using an external loader.

### 1.6.4 (2023-02-02)

* Fixing bug with duplication of selected and found options.

### 1.6.5 (2023-02-03)

* Fixing bug with not clotting options list when slots were used.

### 1.6.6 (2023-02-03)

* Adding unit-test for "showDeselectIconLoader" optional prop.

### 1.7.0 (2023-02-06)

* Adding "extended-click-outside" dependency.
* Adding click-outside.js file with to composition director with extended-click-outside-instanse.
* Changing "typescript" dependency version to "~4.1.0".
* Removal of "vue3-click-away" dependency.

### 1.7.1 (2023-02-07)

* Adding instance.js file with noт-reactive instance of local event emitter.
* Fixing bug with not clotting options list when clicking on another instance.

### 1.7.2 (2023-02-07)

* Changing event type to collapse the list of options when clicking on another instance.

### 1.7.3 (2023-02-07)

* Fixing bug with disabled removal of selected options based on external modelValue changes.

### 1.7.4 (2023-02-07)
 
* Adding "update:wrapper" event.

### 1.7.5 (2023-02-08)

* Removal of excess condition in toggle restriction.

### 1.8.0 (2023-02-15)

* Adding tools directory.
* Adding Debounce.js file with debounce tool.
* Adding type for "update-wrapper" event.
* Adding tools.spec.js file with unit-tests for tools.
* Moving local emitter files to tools directory.
* Removal of "lodash-es" dependency.

### 1.8.1 (2023-02-21)

* Removal of "update:wrapper" event.
* Fixing bug with incorrect v-model updating in custom wrappers.

### 1.8.2 (2023-02-21)

* Fixing bug with non-updating modelValue by handling preselected options.

### 1.8.3 (2023-02-23)

* Fixing bug with placeholder disappearing on blur.

### 1.8.4 (2023-02-23)

* Fixing bug with single select input focus.

### 1.8.5 (2023-03-07)

* Adding "resize-observer-polyfill" dev-dependency.
* Fixing bug with options wrapper resize when "toggleAppearanceSide" prop is set to "atop".

### 1.8.6 (2023-03-07)

* fixing bug with undefined "offsetHeight" variable.

### 1.9.0 (2023-03-18)

* Adding "dropdownDisabled" optional prop.
* Adding unit-test for new optional prop.
* Adding some new css-variabled.
* Removal of excess type from types.

### 1.9.1 (2023-03-20)

* Fixing bug with "pattern-changed" event with a call to the internal loader method.

### 1.9.2 (2023-03-22)

* Fixing bug with always fixed "height" css-property of option block.
* Setting default value of "anyOptionWrapperBlockHeight" optional prop to "auto".

### 1.9.3 (2023-03-22)

* Fixing bug with v-model not clearing by computed property.

### 1.9.4 (2023-03-23)

* Fixing bug with hidden placeholder when "showSearchField" prop is set to false.
* Fixing bug with deselection of all options when "showSelectedOptions" prop is set to true.

### 1.9.5 (2023-03-23)

* Adding "selected" flag to "marker" slot.

### 1.9.6 (2023-03-23)

* Fixing bug with v-model not updating by clearing of all options.

### 1.9.7 (2023-03-23)

* Fixing bug with non-rendering "labelBlock" slot when "showSearchField" prop is set to false.

### 1.9.8 (2023-03-23)

* Fixing bug with "clean" event payload when all options were deselected.

### 1.10.0 (2023-03-26)

* Adding "multipleBlocks" slot for element with all selected options.
* Adding conditional rendering to all slots.
* Removal of some excess props inside the component.
* Ordering "Events" section in documentation in alphabetic order.
* Ordering props in alphabetic order inside the component.

### 1.10.1 (2023-03-26)

* Fixing bug with incorrect display of multiple option blocks.

### 1.10.2 (2023-09-01)

* Updating dependencies and dev-dependencies.

### 2.0.0 (2024-01-13)

* Component `vue3-extended-multiselect` was bundled by rollup.
* Updating dependencies and dev-dependencies.
* Changing "vue-jest" plugin to "@vue/vue3-jest" plugin in jest.config.js.
* Changing some asynchronous unit-tests for correct running.
* Adding "@rollup/plugin-babel" dev-dependency.
* Adding "@vue/vue3-jest" dev-dependency.
* Adding "babel-jest" dev-dependency.
* Adding "postcss" dev-dependency.
* Adding "rollup" dev-dependency.
* Adding "rollup-plugin-copy" dev-dependency.
* Adding "rollup-plugin-dts" dev-dependency.
* Adding "rollup-plugin-postcss" dev-dependency.
* Adding "rollup-plugin-vue" dev-dependency.
* Adding "images" directory into "assets" directory.
* Adding "rollup.config.mjs" file.
* Adding "build" script into "package.json" file.
* Moving all images into "images" directory.
* Removal of "vue-jest" dev-dependency.
* Removal of "style" directory with all files. Including styles directly in component.

### 2.0.1 (2024-01-13)

* Adding "files" and "unpkg" sections to package.json file.

### 2.0.2 (2024-01-13)

* Removal "/dist" exception from ".gitignore" and ".npmignore" files.

### 2.0.3 (2024-01-13)

* Adding "main" and "module" sections to package.json file.

### 2.0.4 (2024-01-14)

* Changing some default styles and css-variables.

### 2.0.5 (2024-01-14)

* Changing some default styles.

### 2.0.6 (2024-01-14)

* Adding css-variable --default-color for multiselect background color.

### 2.1.0 (2024-01-28)

* Adding link to page with live examples.
* Fixing bug with always basic icon filter.
* Fixing bug with rendering icon filter instead of loader icon filter.
* Fixing bug with "disabledPrimitiveOptions" prop accepting options of type "Array".

### 2.2.0 (2024-04-03)

* Adding "icon" directory with svg-icon components.
* Adding BaseArrowIcon component.
* Adding CancelIcon component.
* Adding DoubleArrowIcon component.
* Adding InnerArrowIcon component.
* Adding LoaderIcon component.
* Adding TriangleArrowIcon component.
* Adding TriangleCircleArrowIcon component.
* Adding WideArrowIcon component.
* Removal of "copy" plugin and "transform" section from rollup.config.mjs.
* Removal of "rollup-plugin-copy" dev-dependency.
* Removal of "assets" and "images" directories with corresponding files.

### 2.2.1 (2024-04-03)

* Adding "@babel/runtime" dev-dependency.
* Adding JSDoc blocks to tools.
* Fixing bug with the placeholder disappearing after switching the list of options.

### 2.2.2 (2024-04-03)

* Fixing bug with incorrect extended multiselect base height.

### 2.2.3 (2024-04-03)

* Changing rotation of toggle icon.

### 2.3.0 (2024-04-04)

* Changing behaviour of "select" event: it no longer fires after setting preselected options.
* Fixing bug with incorrect modelValue type in preselected options setter method.

### 2.3.1 (2024-04-04)

* Fixing bug with incorrect options list placement.

### 2.3.2 (2024-04-04)

* Fixing bug with co-appearance of search field and placeholder.

### 2.3.3 (2024-04-04)

* Fixing bug with incorrect options list appearance side after changing available options.

### 2.3.4 (2024-04-16)

* Fixing incorrect path to "types" folder in package.json file.

### 2.3.5 (2024-06-28)

* Fixing incorrect css-variables interpolation.

### 2.3.6 (2024-10-29)

* Fixing bug with the wrong number of blocks in the displayed limit message.

### 2.3.7 (2025-04-24)

* Removal of unnecessary identifiers.
* Changing default value of "--icons-align-self" css-variable to "center".

### 2.3.8 (2025-05-01)

* Fixing bug with a working cancel button during loading.
* Fixing bug with search field flickering when selecting an option if some option was selected.
* Fixing bug with the generation of a layout shift that occurred when automatically calculating the height of the options block.
* Removal of unnecessary "loading" prop in ExtendedMultiselectLoader component.

### 2.3.9 (2025-05-01)

* Fixing bug with incorrect multiple option blocks height.

### 2.3.10 (2025-05-01)

* Fixing last build version.

### 2.3.11 (2025-07-02)

* Updating dependencies and dev-dependencies.
* Updating eslint config file for 8x compatibility.