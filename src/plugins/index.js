/**
 * External dependencies
 */
import { registerPlugin } from '@wordpress/plugins'
/**
 * Internal dependencies 
 */ 
import { EditorDom } from './get-editor-dom'

registerPlugin( 'gutenway-editor-dom', { render: EditorDom } )