import type { Component } from 'svelte';
import TextField from './fields/text-field.svelte';
import TextareaField from './fields/textarea-field.svelte';
import SelectField from './fields/select-field.svelte';
import ChipGroupField from './fields/chip-group-field.svelte';
import DatetimeField from './fields/datetime-field.svelte';

// Directus field.meta.interface -> renderer. A lookup, not a chain of ifs: adding a new
// field interface later means adding one entry here, not touching the form's render logic.
export const fieldRegistry: Record<string, Component<{ schema: import('$lib/types/content').FormFieldSchema; value: string }>> = {
	input: TextField,
	'input-multiline': TextareaField,
	'select-dropdown': SelectField,
	'select-radio': ChipGroupField,
	datetime: DatetimeField
};

export const defaultField = TextField;
