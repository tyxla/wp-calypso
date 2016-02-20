/**
 * External dependencies
 */
import React from 'react';

/**
 * Internal dependecies
 */
import PreviewFieldset from './preview-fieldset';
import PreviewLegend from './preview-legend';
import PreviewRequired from './preview-required';

const textField = ( field, index ) => (
	<PreviewFieldset key={ 'contact-form-field-' + index }>
		<PreviewLegend { ...field } />
		<input type="text" />
	</PreviewFieldset>
);

const textarea = ( field, index ) => (
	<PreviewFieldset key={ 'contact-form-field-' + index }>
		<PreviewLegend { ...field } />
		<textarea></textarea>
	</PreviewFieldset>
);

const checkbox = ( field, index ) => (
	<PreviewFieldset key={ 'contact-form-field-' + index }>
		<label><input type="checkbox" />{ field.label }<PreviewRequired required={ field.required } /></label>
	</PreviewFieldset>
);

const dropdown = ( field, index ) => (
	<PreviewFieldset key={ 'contact-form-field-' + index }>
		<PreviewLegend { ...field } />
			<select>
				{ [].concat( field.options ).map( ( option, optionIndex ) => (
					<option key={ 'contact-form-select-option-' + optionIndex }>{ option }</option>
				) ) }
			</select>
	</PreviewFieldset>
);

const radio = ( field, index ) => (
	<PreviewFieldset key={ 'contact-form-field-' + index }>
		<PreviewLegend { ...field } />
		{ [].concat( field.options ).map( ( option, optionIndex ) => (
			<label key={ 'contact-form-radio-' + optionIndex }><input type="radio" /><span>{ option }</span></label>
		) ) }
	</PreviewFieldset>
);

const fieldTypes = {
	name: textField,
	email: textField,
	url: textField,
	text: textField,
	textarea,
	checkbox,
	dropdown,
	radio
};

export default function( field ) {
	return fieldTypes.hasOwnProperty( field.type )
		? fieldTypes[ field.type ].apply( this, arguments )
		: null;
}