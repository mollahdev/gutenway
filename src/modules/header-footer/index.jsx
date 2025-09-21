/**
 * External dependencies
 */
import { addAction, removeAction } from '@wordpress/hooks';
import { useEffect, useState } from '@wordpress/element';
/**
 * Internal dependencies
 */
import './dom-events';
import { StyledDrawer } from './style';

export default function HeaderFooter() {
	const [ visible, setVisible ] = useState( false );

	useEffect( () => {
		addAction( 'gutenway.add_header_footer_post', 'gutenway', () => {
			setVisible( true );
		} );
		return () => {
			removeAction( 'gutenway.add_header_footer_post', 'gutenway' );
		};
	}, [] );

	return (
		<>
			<StyledDrawer
				opened={ visible }
				position="right"
				onClose={ () => setVisible( false ) }
				title="Add Header & Footer"
				zIndex={ 9999 }
				style={{
					marginTop: '50px',
				}}
			>
				<h2>Header & Footer Post Type</h2>
				<p>
					This is where you can add or edit header and footer
					templates.
				</p>
			</StyledDrawer>
		</>
	);
}
