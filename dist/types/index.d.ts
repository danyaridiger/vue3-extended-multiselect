/**
 * General type for any kind of option
 */
type UnionOptionType =
  | string
  | number
  | boolean
  | object
  | Array<unknown>
  | ((...args: unknown[]) => unknown)
  | null
  | undefined;

/**
 * Method types provided by slot-scope
 */
type Cancel = () => void;
type CreateCustomOptionLabel = (option: UnionOptionType) => null | string;
type Increase = Cancel;
type DeselectBlock = (index: number) => void;
type OptionCreateLabel = CreateCustomOptionLabel;
type ToggleOptionsList = (keyboardEvent?: KeyboardEvent) => void;

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
type CleanEvent = UnionOptionType[] | OptionsList;
type CloseEvent = CleanEvent;
type IncreaseEvent = number | Limit;
type OptionCreatedEvent = UnionOptionType | SingleOption;
type PatternChangedEvent = string | PatternChanged;
type SelectEvent = OptionCreatedEvent;

export type { Cancel, CleanEvent, CloseEvent, CreateCustomOptionLabel, DeselectBlock, Increase, IncreaseEvent, OptionCreateLabel, OptionCreatedEvent, PatternChangedEvent, SelectEvent, ToggleOptionsList, UnionOptionType };
