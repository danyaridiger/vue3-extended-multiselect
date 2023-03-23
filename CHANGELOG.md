# Patch notes

Current `vue3-extended-multiselect` version: **1.9.3**

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

* Fixing a bug with v-model not clearing by computed property.