import { render } from '@wordpress/element';
import App from './app';

jQuery( ( $ ) => {
	$( 'body' ).append( '<div id="gutenway-header-footer-module"></div>' );
	const container = document.getElementById(
		'gutenway-header-footer-module'
	);

	if ( container ) {
		render( <App />, container );
	}
} );
