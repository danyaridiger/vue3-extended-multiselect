# vue3-extended-multiselect v1.5.9

***

### Brief annotation

Vue3 extended multiselect is a component that was created for simplification of custom settings of built-in select element. This component allows developer to escape writing many excess css-rules by using built-in themes and to escape problems with different kinds of provided options. Various decoration of options list by some extra slots will help developer to make it more informative and obvious. More thorough filtering of raw options list given by developer excludes sudden errors if kind of option is not intended for extended multiselect. Switchable useful warnings will help to catch possible errors that may occur while working with options. Tools for working with selected options will allow user to control amount of displayed options and quickly deselect them. Such tools also can be customized by developer. Various slots can help developer to customize to his liking options list, elements with selected options in multiple select or some other interaction elements. You can use this component in your web-applications based on Vue 3 framework.

### Installation with npm

``npm install --save vue3-extended-multiselect``

### Installation with yarn

``yarn install --production vue3-extended-multiselect``

### Importing

```js
import Vue3ExtendedMultiselect from "vue3-extended-multiselect"
```

### Importing types

```js
import { UnionOptionType } from "vue3-extended-multiselect"
```

## Table of contents
* [Props list](#props-list)
* [Slots list](#slots-list)
* [Events list](#events-list)
* [Styling with css](#styling-with-css)
* [Styling with props](#styling-with-props)
* [License](#license)

## Props list
Prop name | Prop type | Prop appointment | Prop default value | Prop values
----------|-----------|------------------|--------------------|------------
**autoSelect<br/>CreatedOption**|Boolean|Determines whether to select just now created option automatically.|false|&mdash;|
**autoSelect<br/>SearchValue**|Boolean|Determines whether to take search value from current selected option if "multiple" prop equals false.|false|&mdash;|
**clearBySelect<br/>WhenMultiple**|Boolean|Determines whether to clear search field by option selection.|false|&mdash;|
**createOnThe<br/>Go**|Boolean|Allows user to create new options from search field.|false|&mdash;|
**default<br/>Expanded**|Boolean|Determines whether options list should be expanded by default.|false|&mdash;|
**disabled**|Boolean|Disables extended multiselect.|false|&mdash;|
**highlight<br/>Options**|Boolean|Switches options highlighting while hovering.|true|&mdash;|
**loading**|Boolean|Switches loading state of extended multiselect.|false|&mdash;|
**multiple**|Boolean|Allows user to select multiple options.|false|&mdash;|
**noResults<br/>BlockShown**|Boolean|Determines whether to show special hint if no options were found.|true|&mdash;|
**resetSearch<br/>ByValue**|Boolean|Determines whether to clear search field by selection/deselection of options.|true|&mdash;|
**searchFilter<br/>Active**|Boolean|Allows user to use internal search for options.|true|&mdash;|
**simpleEvents**|Boolean|Switches full payload of extended multiselect events.|true|&mdash;|
**selected<br/>Options<br/>Shown**|Boolean|Determines whether to show selected options in options list.|false|&mdash;|
**showClearIcon**|Boolean|Allows user to deselect all options by special icon.|false|&mdash;|
**showInsert<br/>Warnings**|Boolean|Determines whether to show useful internal warnings in console.|false|&mdash;|
**showMarker**|Boolean|Determines whether to show slot with special marker beside option in options list.|false|&mdash;|
**showSearch<br/>Field**|Boolean|Determines whether to show search field which allows user to search for options with internal search.|true|&mdash;|
**toggleMultiple<br/>BlocksLimit**|Boolean|Allows user to increase limit of shown elements with selected options by special icon.|false|&mdash;|
**toggleOptions<br/>BySelect**|Boolean|Determines whether to roll up options list by selection of option.|true|&mdash;|
**togglingSaves<br/>SearchValue**|Boolean|Determines whether to save current search value if display of options list was toggled.|true|&mdash;|
**wrongCurrent<br/>Value**|Boolean|Determines whether to define special class for extended multiselect if value is wrong or if irregularity of value is defined by user.|false|&mdash;|
**createOption<br/>Placeholder**|String|Placeholder for the search field to be used if user is allowed to create new options.|"Select or create features"|&mdash;|
**createOption<br/>Type**|String|Defines kind for all options which will be created by user.|"primitive"| "primitive", "array", "object"|
**disableByField**|String|Determines a field in options of type "object" which value will be used to disable such options.|"disabled"|&mdash;|
**emptyObjects<br/>Placeholder**|String|Placeholder for options of type "object" or Array instances which length/keys length equals 0.|"Empty Object/<br/>Array"|&mdash;|
**errorBorder<br/>Color**|String|Defines "border-color" css-property for extended multiselect with wrong value.|"#FF0000"|&mdash;|
**iconFilter**|String|Defines svg-filter with color settings for all icons except loader.|"basic"|"basic", "black", "green"|
**iconSize**|String|Defines sizes for all icons in pixels except loader.|"large"|"large", "medium", "small"|
**label**|String|Defines field in options of type "object" that will be the label of option.|"label"|&mdash;|
**loaderIcon<br/>Filter**|String|Defines svg-filter with color settings for loader icon.|"loader-default"|"loader-default", "basic", "slate-grey", "slate-blue", "teal",<br/> "strict"|
**placeholder**|String|Placeholder for search field to be used if user is not allowed to create new options.|"Select features"|&mdash;|
**searchByField**|String|Determines field in options of type "object" to use in internal search.|""|&mdash;|
**themeType**|String|Defines overall color theme for extended multiselect.|"basic"|"basic", "slate-grey", "slate-blue", "teal",<br/> "strict"|
**toggle<br/>Appearance<br/>Side**|String|Defines which side options list will be displayed on.|"auto"|"auto", "atop", "under"|
**toggleIcon**|String|Defines kind of toggle icon from icons collection.|"base-arrow"|"base-arrow", "double-arrow", "wide-arrow", "circle-arrow", "inner-arrow", "triangle-arrow", "triangle-circle-arrow"|
**anyOption<br/>Wrapper<br/>BlockHeight**|Number|Defines "height" css-property for each option in options list.|30|&mdash;|
**increase<br/>Display<br/>By**|Number|Defines gap which increases limit of displayed elements with selected options.|5|&mdash;|
**maxOptions<br/>Count**|Number|Maximal limit of selected options.|null|&mdash;|
**minOptions<br/>Count**|Number|Minimal limit of selected options.|null|&mdash;|
**multipleBlocks<br/>Limit**|Number|Defines limit of displayed elements with selected options.|null|&mdash;|
**optionsCount<br/>Restriction**|Number|Defines maximal limit of options list length.|null|&mdash;|
**toggleMax<br/>Height**|Number|Defines maximal value in pixels of "max-height" css-property for options list.|400|&mdash;|
**toggleMin<br/>Height**|Number|Defines minimal value in pixels of "max-height" css-property for options list.|null|&mdash;|
**createOption<br/>Fields**|Array|Defines a list of fields for options of type "object" created by user.|["label"]|&mdash;|
**disabled<br/>Primitive<br/>Options**|Array|Defines a list of primitive types for options. Options of given types will be disabled for selection.|[]|&mdash;|
**options**|Array|Raw options list.|[]|&mdash;|
**optionsPadding**|Array|Defines a list with "padding-top", "padding-left", "padding-bottom" and "padding-right" css-properties for options in options list. Property "padding-top" matches index zero. Property "padding-right" matches index three.|[]|&mdash;|
**preselected<br/>Options**|Array|Defines a list of options that will be select by default.|[]|&mdash;|
**specialKeys<br/>Block**|Array|Defines a list of keys which in combination with mouse buttons or "enter" key will prevent selection of option.|[]|"alt",<br/> "ctrl",<br/> "shift"|
**createCustom<br/>OptionLabel**|Function|Defines function that creates custom label for each option.|(option) => null|&mdash;|
**multipleBlocks<br/>LimitMessage**|Function|Defines function that creates notification when maximal limit of selected options has been reached.|(number) => \`and ${number} more items\`|&mdash;|
**inputId**|String, Number|"id" attribute of search field.|null|&mdash;|
**preselected<br/>Option**|UnionPropType (from types)|Defines options that will be select by default.|null|&mdash;|
**value**|Array|Defines value of extended multiselect that can be used in "v-model".|[]|&mdash;|

## Slots list
Slot name | Slot appointment | Slot scope
----------|------------------|-----------
**option**|Option in options list with its label.|``option`` — option from options list,<br/>``createCustomOptionLabel`` — function that creates custom label for each option|
**optionBlock**|Element with selected option and its label.|``label`` — option label,<br/>``deselectBlock`` — function that deselects option and removes element that contained it,<br/>``index`` — option index|
**marker**|Marker that indicates state of option selection.|&mdash;|
**maxElements**|Message displayed if maximal limit of elements with selected options has been shown.|&mdash;|
**showMore**|Button that increases limit of displayed elements with selected options.|``showMoreOptions`` — function that increases limit of displayed elements with selected options|
**noResults**|Message displayed if no options have been found by internal search.|&mdash;|
**noOptions**|Message displayed if given options list is empty.|&mdash;|
**listHeader**|Element at the top of options list for information content.|&mdash;|
**listFooter**|Element at the bottom of options list for information content.|&mdash;|
**toggle**|Button that toggles options list display.|``toggleOptionsList`` — function that toggles options list display|
**labelBlock**|Element with single selected option that is shown if search field display is disabled.|``labelBlockValue`` — option label|
**moreThanLimit**|Message displayed if maximal limit of selected options has been reached.|&mdash;|
**lessThanLimit**|Message displayed if minimal limit of selected options has not been reached.|&mdash;|
**cancel**|Button that deselects all options.|``cancel`` — function that deselects all options|

## Events list
Event name | Event appointment | Listener method | Simplified event payload | Fields of object with full event payload |
-----------|-------------------|-----------------|--------------------------|-----------------------------------------|
**pattern-changed**|Change value of search field.|@pattern-changed|``value`` — pattern of inner search for available options|``value`` — pattern of inner search for available options,<br/>``inputId`` — id of search field set by "id" prop|
**select**|Selection of option.|@select|``option`` — just now selected option|``option`` — just now selected option,<br/>``inputId`` — id of search field set by "id" prop|
**clean**|Removal of all options or singe option.|@clean|``option/options`` — just now deselected option or array with just now deselected options|``option/options`` — just now deselected option or array with just now deselected options,<br/>``inputId`` — id of search field set by "id" prop|
**option-created**|Creation of new option by user.|@option-created|``option`` — option created by user|``option/options`` — option created by user,<br/>``inputId`` — id of search field set by "id" prop|
**active**|Dropdown options list expanding.|@active|&mdash;|``inputId`` — id of search field set by "id" prop|
**close**|Rolling up dropdown options list.|@close|``options`` — array of selected options|``options`` — array of selected options,<br/>``inputId`` — id of search field set by "id" prop|
**increase**|Increasing current limit of displayed elements with selected options.|@increase|``limit`` — current limit of options to be shown next|``limit`` — current limit of options to be shown next,<br/>``inputId`` — id of search field set by "id" prop|

## Styling with css

Vue3 extended multiselect provides following css-variables:

```css
  --basic-color: #708090;
  --basic-transparent: rgba(112, 128, 144, 0.6);
  --cancel: #B22222;
  --cancel-backgound-color: rgba(179, 33, 33, 0.1);
  --dark-slate-blue: #483D8B;
  --dark-slate-blue-transparent: rgba(72, 61, 139, 0.6);
  --dark-slate-grey: #2F4F4F;
  --dark-slate-grey-transparent: rgba(47, 79, 79, 0.6);
  --disabled: rgba(176, 176, 176, 0.6);
  --hover-color: #FFFFFF;
  --loader-color: #00BFFF;
  --strict: #000000;
  --strict-transparent: rgba(0, 0, 0, 0.6);
  --teal: #008080;
  --teal-transparent: rgba(0, 128, 128, 0.6);
  
  --block-border-radius: 4px;
  --block-cancel-padding: 4px;
  --block-gap: 6px;
  --block-padding: 1px 3px 1px 7px;
  --border-radius: 6px;
  --border-radius-small: 3px;
  --cancel-padding: 3px 8px;
  --grid-columns: 1fr 36px 36px;
  --grid-rows: 1fr 36px;
  --half-size: 50%;
  --icon-size-block: 14px;
  --icon-size-large: 18px;
  --icon-size-medium: 15px;
  --icon-size-small: 12px;
  --increaser-padding: 3px 7px;
  --max-size: 100%;
  --min-block-height: 25px;
  --options-padding: 6px 0;
  --outer-gap: 10px;
  --root-padding: 6px 10px;
  --toggle-icon-gap: 1px;
  --wide-text: 700;
  --wrapper-padding: 5px 10px;

  --border: 1px solid;
  --default-cursor: default;
  --icons-align-self: start;
  --icons-justify-self: center;
  --pointer-cursor: pointer;
  --wrapper-transition: border-top-left-radius 250ms ease 0s, border-top-right-radius 250ms ease 0s,
                        border-bottom-left-radius 250ms ease-out, border-bottom-right-radius 250ms ease-out;
```

You can override it globally or by particular instance class name.

```css
:root {
  --basic-color: purple;
  --outer-gap: 2rem;
  --border: 1px dotted;
}
```

```html
  <vue3-extended-multiselect class="instance-class" />
```

```css
.instance-class {
  --basic-color: purple;
  --outer-gap: 2rem;
  --border: 1px dotted;
}
```

## Styling with props

Vue3 extended multiselect provides following props for customizing:

* errorBorderColor
* iconFilter
* iconSize
* loaderIconFilter
* themeType
* toggleIcon
* anyOptionWrapperBlockHeight
* toggleMaxHeight
* toggleMinHeight

#### Customizing examples

Changing border color when extended multiselect value is invalid.

```html
  <vue3-extended-multiselect error-border-color="#8B0000" />
```
Changing svg color filter for icons.

```html
  <vue3-extended-multiselect icon-filter="green" />
```
Resizing icons.

```html
  <vue3-extended-multiselect icon-size="small" />
```
Changing svg color filter for loader icon.

```html
  <vue3-extended-multiselect icon-size="small" />
```
Changing general color theme of extended multiselect.

```html
  <vue3-extended-multiselect theme-type="slate-blue" />
```
Changing toggle icon form.

```html
  <vue3-extended-multiselect toggle-icon="triangle-arrow" />
```
Resizing option blocks in options list.

```html
  <vue3-extended-multiselect :any-option-wrapper-block-height="60" />
```
Changing "max-height" css-property of options list.

```html
  <vue3-extended-multiselect :toggle-max-height="500" />
```

Changing "min-height" css-property of options list.

```html
  <vue3-extended-multiselect :toggle-min-height="500" />
```

## License

[MIT](LICENSE)
