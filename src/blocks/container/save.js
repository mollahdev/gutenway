import { BlockDiv } from '@/block-components';

export default function save( props ) {
	const { attributes } = props;
	
	return (
		<BlockDiv.Content attributes={attributes}>
			<div>
				<h2>Ashraf New Block</h2>
			</div>
            <h2 className='container'>Hello World {attributes.columnSpacing.top}</h2>
        </BlockDiv.Content>
	);
}