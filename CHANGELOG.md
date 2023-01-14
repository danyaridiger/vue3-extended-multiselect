# Patch notes

Current `vue3-extended-multiselect` version: **1.4.0**

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

* Fix bug with hidden "noOptions" slot when list of available options is empty.
* Fix warning with incorrect array type reactive field initialization.
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
* Fix bug with rolling up options list when "toggleOptionsBySelect" prop is set to false.
* Fix bug with reaching "optionsWrapper" ref before initialization.

### 1.1.1 (2022-12-10)

* Replacing package-lock.json file with new one.

### 1.1.2 (2022-12-10)
* Replacing dev-dependency "@vue/cli-plugin-eslint" with its latest version.

### 1.1.3 (2022-12-11)
* Adding "searchByField" optional prop.
* Adding unit-test for new optional prop.

### 1.1.4 (2022-12-13)
* Adding "optionCreateLabel" to expose as utility.
* Fix bug with wrong name of label field

### 1.1.5 (2022-12-14)
* Fix bug with empty raw options list when using async loader.

### 1.1.6 (2022-12-14)
* Fix bug with extra call of async loader by changing value of search field.
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
* Fix bug with bound event emitters between two extended multiselects.
* Fix bug with undefined class in extended multiselect wrapper class list.

### 1.2.1 (2022-12-21)
* Moving transitions of "border-radius" css-property from computed property to css variable.

### 1.2.2 (2022-12-21)
* Removal of excess "transition" css-property.

### 1.2.3 (2022-12-22)
* Fix bug with excess bottom offset of options list when prop "toggleAppearanceSide" is set to "atop".
* Supplementation of some css-variables.

### 1.2.4 (2022-12-22)
* Fix bug of too wide extended multiselect with long single selected option.

### 1.3.0 (2023-01-11)
* Adding "autoSelectSearchValue" optional prop.
* Adding unit-test for new optional prop.
* Fix bug with setting search pattern when deselecting of all options.
* Fix bug with selected options display when prop "toggleOptionsBySelect" is set to false.

### 1.4.0 (2023-01-11)
* Removal of dependency "mitt".
* Adding LocalEmitter.js file with simplified event emitter instead of dependency "mitt".
* Changing event types in some of props unit-tests.
* Fix bug with toggle restriction in custom slots.