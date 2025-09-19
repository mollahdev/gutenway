/**
 * External dependencies 
 */ 
import { useMemo, useRef } from '@wordpress/element'
/**
 * Internal dependencies 
 */ 
import { useQueryLoopInstanceId } from '@/utils'
import { useRafEffect } from '@/hooks'

export const useBlockCssGenerator = props => {
	const {
		blockStyles,
		clientId,
		context,
		attributes,
		blockState,
	} = props

	// Generate the CSS styles.
	const instanceId = useQueryLoopInstanceId( attributes.uniqueId )

	// Keep the old text attribute for comparison to prevent block style generation when only the text attribute has changed.
	const oldText = useRef( attributes.text )

	// Keep the generated CSS for editor and return it when only the text attribute has changed.
	const oldCss = useRef( null )

	const editCss = useMemo( () => {
		if ( oldText.current !== attributes.text ) {
			oldText.current = attributes.text
			return oldCss.current
		}

		const css = blockStyles.generate( attributes, {
			blockState,
			instanceId, // This is used by the native Query Loop block.
			clientId,
			context, // This is used for dynamic content.
		} )

		oldCss.current = css
		return css
	}, [ attributes, blockState, clientId, attributes.uniqueId, instanceId, context ] )

	useRafEffect( () => {
		if ( oldText.current !== attributes.text ) {
			oldText.current = attributes.text
			return
		}

		const css = blockStyles.generate( attributes, {
			editorMode: false
		} )

		attributes.generatedCss = css
	}, [ attributes ] )

	return editCss
}
