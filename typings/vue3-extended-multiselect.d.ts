/**
 * General type for any kind of option
 */
export type UnionOptionType = string | number | boolean | object | Array<unknown> | Function | null | undefined;

/**
 * Method types provided by slot-scope
 */
export type Cancel = () => void;
export type CreateCustomOptionLabel = (option: UnionOptionType) => null | string;
export type Increase = Cancel;
export type DeselectBlock = (index: number) => void;
export type OptionCreateLabel = CreateCustomOptionLabel;
export type ToggleOptionsList = (keyboardEvent?: KeyboardEvent) => void;

interface InputIdInPayload {
  inputId?: string;
}

interface Limit extends InputIdInPayload {
  limit: number;
}

interface OptionsList extends InputIdInPayload {
  options: UnionOptionType[];
}

interface PatternChanged extends InputIdInPayload {
  pattern: string;
}

interface SingleOption extends InputIdInPayload {
  option: UnionOptionType;
}

/**
 * Event types
 */
export type CleanEvent = UnionOptionType[] | OptionsList;
export type CloseEvent = CleanEvent;
export type IncreaseEvent = number | Limit;
export type OptionCreatedEvent = UnionOptionType | SingleOption;
export type PatternChangedEvent = string | PatternChanged;
export type SelectEvent = OptionCreatedEvent;