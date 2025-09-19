import { BlockDiv } from '@/block-components';
import metadata from '@blocks/container/block.json';

/**
 * Old version 1 (before you changed to Hello World 2)
 */
const oldSaveV1 = ( props ) => {
	const { attributes } = props;

    console.log(props)

	return (
		<BlockDiv.Content attributes={attributes}>
			<h2 className="container">Hello World 1</h2>
		</BlockDiv.Content>
	);
};

/**
 * Export an array of deprecated versions.
 * Each entry = { attributes, save, migrate? }
 */
export const deprecated = [
	{
		attributes: metadata.attributes, // schema at that time
		save: oldSaveV1,
		// migrate: ( oldAttrs ) => ({ backgroundColor: oldAttrs.background }) // optional
	},
	// Add more here when you change markup/attrs again
];
