/**
 * WordPress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose';
import { BlockStyleProvider } from '@/hooks';
import InspectorTabs from '@/block-controls/inspector-tabs';

const withBlockStyleContext = ( blockStyles ) =>
	createHigherOrderComponent(
		( WrappedComponent ) => ( props ) => {
			return (
				<BlockStyleProvider blockStyles={ blockStyles }>
					<InspectorTabs />
					<WrappedComponent { ...props } />
				</BlockStyleProvider>
			);
		},
		'withBlockStyleContext'
	);

export default withBlockStyleContext;
