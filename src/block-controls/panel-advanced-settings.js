import { memo } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

const PanelAdvancedSettings = memo( props => {
	return <div>{props.children}</div>
} )


export default PanelAdvancedSettings
