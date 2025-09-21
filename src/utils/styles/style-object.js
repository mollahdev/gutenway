/**
 * External dependencies
 */
import { useContext, useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { QueryLoopContext } from '@/higher-order';

export const QUERY_LOOP_UNIQUEID_INSTANCES = {};

/**
 * Function which determines whether the block
 * is inside a query loop > post template block
 * and is a preview of the original inner block
 * (part of 2nd - last inner blocks).
 *
 * @param {Object} postContext
 * @param {string} currentPostId
 *
 * @return {boolean} true or false
 */
const isBlockAQueryLoopPreview = ( postContext, currentPostId ) => {
	// Compare if the consumed context's postId is not equal to the current post id.
	return (
		postContext?.postId &&
		currentPostId &&
		postContext?.postId !== currentPostId
	);
};

export const useQueryLoopInstanceId = ( uniqueId ) => {
	const postContext = useContext( QueryLoopContext );
	const currentPostId = useSelect( ( select ) =>
		select( 'core/editor' )?.getCurrentPostId()
	);
	const [ instanceId, setInstanceId ] = useState( 0 );

	useEffect( () => {
		if ( isBlockAQueryLoopPreview( postContext, currentPostId ) ) {
			if ( uniqueId ) {
				const newInstanceIds =
					QUERY_LOOP_UNIQUEID_INSTANCES[ uniqueId ] || [];
				if ( ! newInstanceIds.includes( postContext?.postId ) ) {
					newInstanceIds.push( postContext?.postId );
				}

				QUERY_LOOP_UNIQUEID_INSTANCES[ uniqueId ] = newInstanceIds;
				setInstanceId(
					newInstanceIds.findIndex(
						( id ) => id === postContext?.postId
					) + 1
				);
			}
		}
	}, [ postContext?.id, currentPostId, uniqueId ] );

	return instanceId;
};
