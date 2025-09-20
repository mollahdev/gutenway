import { InspectorGeneralControls, InspectorStyleControls, InspectorAdvancedControls } from '@/block-controls'

export const InspectorControls = () => {
	
    return (
        <>
            <InspectorGeneralControls>
                <h2>General Settings</h2>
            </InspectorGeneralControls>
            <InspectorStyleControls>
                <h2>Style Settings</h2>
            </InspectorStyleControls>
            <InspectorAdvancedControls>
                <h2>Advanced Settings</h2>
            </InspectorAdvancedControls>
            <InspectorGeneralControls>
                <h2>General Settings 2</h2>
            </InspectorGeneralControls>
        </>
    )
}
