import { InnerBlocks } from '@wordpress/block-editor'
import { memo } from '@wordpress/element'
import { compose } from '@wordpress/compose'
/**
 * Internal dependencies 
 */ 
import blockStyles from './style'
import {
	withBlockAttributeContext,
	withBlockStyleContext,
} from '@/higher-order'

import { useBlockCssGenerator } from '@/block-style-generator/use-block-style-generator'

// const ButtonBlockAppender = memo( props => {
// 	return <InnerBlocks.ButtonBlockAppender { ...props } />
// } )

const Edit = ( props ) => {
	const { clientId, className, isHovered } = props;

	props.attributes.uniqueId = clientId

	const blockCss = useBlockCssGenerator( {
		attributes: props.attributes,
		blockStyles,
		clientId: props.clientId,
		context: props.context,
		setAttributes: props.setAttributes,
		blockState: props.blockState,
		version: '3.0.0',
	} )

	console.log(blockCss)

	return (
		<div>
			{ blockCss && <style key="block-css">{ blockCss }</style> }
            <h2>Hello World</h2>
        </div>
	);
}


export default compose(
	// withBlockWrapperIsHovered,
	// withQueryLoopContext,
	withBlockAttributeContext,
	withBlockStyleContext( blockStyles ),
)( Edit )
