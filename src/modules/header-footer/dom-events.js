import { doAction } from '@wordpress/hooks';

jQuery( ( $ ) => {
	const addPostBtn = $( '.page-title-action' );

	if ( addPostBtn.length ) {
		const isHeaderFooterBtn = addPostBtn
			.attr( 'href' )
			.includes( 'post_type=gtway_header_footer' );
		if ( ! isHeaderFooterBtn ) return;

		addPostBtn.on( 'click', function ( ev ) {
			ev.preventDefault();
			doAction( 'gutenway.add_header_footer_post' );
			return;
		} );
	}
} );
