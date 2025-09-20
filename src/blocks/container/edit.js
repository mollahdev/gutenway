import { compose } from '@wordpress/compose'
/**
 * Internal dependencies 
 */ 
import blockStyles from './style'
import { useBlockCssGenerator } from '@/hooks'
import {
	withBlockAttributeContext,
	withBlockStyleContext,
} from '@/higher-order'
import { BlockDiv } from '@/block-components'

const edit = ( props ) => {
	const { attributes } = props;

	const blockCss = useBlockCssGenerator( {
		attributes,
		blockStyles,
		clientId: props.clientId,
		context: props.context,
		setAttributes: props.setAttributes,
		blockState: props.blockState,
	} )

	return (
		<>
			{ blockCss && <style key="block-css">{ blockCss }</style> }
			<BlockDiv attributes={attributes}>
				<h2 className='container'>Container Block</h2>
			</BlockDiv>
		</>
	);
}

export default compose(
	withBlockAttributeContext,
	withBlockStyleContext( blockStyles ),
)( edit )
