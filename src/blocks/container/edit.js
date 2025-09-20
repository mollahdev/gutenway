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
import { InspectorStyleControls } from '@/block-controls'

const edit = ( props ) => {
	const { attributes } = props;
	const blockCss = useBlockCssGenerator()

	return (
		<>
			{ blockCss && <style key="block-css">{ blockCss }</style> }
			<InspectorStyleControls>
				<h2>Style block component</h2>
			</InspectorStyleControls>
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
