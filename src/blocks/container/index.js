/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { applyFilters } from '@wordpress/hooks';
/**
 * Internal dependencies
 */
import edit from './edit';
import save from './save';
import metadata from '@blocks/container/block.json';
import { deprecated } from './deprecated-saves';

export const settings = applyFilters( 'gutenway.block.metadata', {
	...metadata,
	edit,
	save,
	deprecated
} );