import { BlockDiv } from '@/block-components';

export default function save( props ) {
	const { attributes } = props;
	
	return (
		<BlockDiv.Content attributes={attributes}>
            <h2>Hello World</h2>
        </BlockDiv.Content>
	);
}