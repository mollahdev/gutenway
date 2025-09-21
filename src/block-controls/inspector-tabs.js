/**
 * WordPress dependencies
 */
import { memo, useEffect } from '@wordpress/element';
import { createSlotFill } from '@wordpress/components';
import { select, useSelect } from '@wordpress/data';
import {
	InspectorControls,
	useBlockEditContext,
} from '@wordpress/block-editor';
import { useGlobalState } from '@/block-editor/global-state';
import PanelAdvancedSettings from './panel-advanced-settings';

const tabs = [ 'general', 'style', 'advanced' ];
const { Slot: LayoutPanelSlot, Fill: LayoutPanelFill } = createSlotFill(
	'GutenwayLayoutPanel'
);

const InspectorLayoutControls = ( { children } ) => {
	return (
		<InspectorControls>
			<LayoutPanelFill>{ children }</LayoutPanelFill>
		</InspectorControls>
	);
};

const InspectorGeneralControls = ( { children } ) => {
	const { name } = useBlockEditContext();
	const [ activeTab ] = useGlobalState( `tabCache-${ name }`, tabs[ 0 ] );

	if ( activeTab !== 'general' ) {
		return null;
	}

	return <InspectorControls>{ children }</InspectorControls>;
};

const InspectorStyleControls = ( { children } ) => {
	const { name } = useBlockEditContext();
	const [ activeTab ] = useGlobalState( `tabCache-${ name }`, tabs[ 0 ] );

	if ( activeTab !== 'style' ) {
		return null;
	}

	return <InspectorControls>{ children }</InspectorControls>;
};

const InspectorAdvancedControls = ( { children } ) => {
	const { name } = useBlockEditContext();
	const [ activeTab ] = useGlobalState( `tabCache-${ name }`, tabs[ 0 ] );

	if ( activeTab !== 'advanced' ) {
		return null;
	}

	return <InspectorControls>{ children }</InspectorControls>;
};

export {
	InspectorLayoutControls,
	InspectorGeneralControls,
	InspectorStyleControls,
	InspectorAdvancedControls,
};

const InspectorTabs = () => {
	const { name } = useBlockEditContext();
	const selectedBlock = select( 'core/block-editor' ).getSelectedBlock();
	const [ activeTab, setActiveTab ] = useGlobalState(
		`tabCache-${ name }`,
		tabs[ 0 ]
	);
	const sidebar = useSelect( ( select ) => {
		return select( 'core/edit-post' ).isEditorSidebarOpened();
	} );

	useEffect( () => {
		if ( ! selectedBlock || ! sidebar ) {
			return;
		}

		setTimeout( () => {
			const element = document.querySelector( '.editor-sidebar__panel' );
			if ( selectedBlock.name.includes( 'gutenway/' ) ) {
				element?.setAttribute( 'data-gutenway-tab', activeTab );
				return;
			}

			element?.removeAttribute( 'data-gutenway-tab' );
		}, 100 );
	}, [ selectedBlock, sidebar, activeTab ] );

	return (
		<>
			<InspectorControls>
				<h2 onClick={ () => setActiveTab( 'general' ) }>general</h2>
				<h2 onClick={ () => setActiveTab( 'style' ) }>style</h2>
				<h2 onClick={ () => setActiveTab( 'advanced' ) }>advanced</h2>
			</InspectorControls>

			{ /* Make sure the layout panel is the very first one */ }
			<InspectorGeneralControls>
				<PanelAdvancedSettings
					title="Layout"
					id="layout"
					initialOpen={ true }
				>
					<LayoutPanelSlot />
				</PanelAdvancedSettings>
			</InspectorGeneralControls>
		</>
	);
};

export default memo( InspectorTabs );
