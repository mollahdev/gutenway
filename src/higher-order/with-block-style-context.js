/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'
import { BlockStyleProvider } from '@/hooks'

const withBlockStyleContext = blockStyles => createHigherOrderComponent(
	WrappedComponent => props => {
		return (
			<BlockStyleProvider
				blockStyles={ blockStyles }
			>
				<WrappedComponent { ...props } />
			</BlockStyleProvider>
		)
	},
	'withBlockStyleContext'
)

export default withBlockStyleContext
