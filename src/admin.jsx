/**
 * Internal dependencies
 */
import { render, StrictMode } from '@wordpress/element';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
/**
 * Internal dependencies
 */
import './admin.scss';
import HeaderFooter from './modules/header-footer';

function App() {
	return (
		<StrictMode>
			<div>
                <MantineProvider>
                    <HeaderFooter />
                </MantineProvider>
            </div>
		</StrictMode>
	);
}

jQuery( ( $ ) => {
	$( 'body' ).append( '<div id="gutenway-admin-ui-container"></div>' );
	const container = document.getElementById( 'gutenway-admin-ui-container' );

	if ( container ) {
		render( <App />, container );
	}
} );
