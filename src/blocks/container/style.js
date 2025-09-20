import { GutenStyleGenerator } from '@/block-editor/guten-css'

const callbacks = {
	marginTop: {
		valuePreCallback( value, ...rest ) {
			return value?.top
		},
	},
	marginRight: {
		valuePreCallback: value => value?.right,
	},
	marginBottom: {
		valuePreCallback: value => value?.bottom,
	},
	marginLeft: {
		valuePreCallback: value => value?.left,
	},
}

const blockStyles = new GutenStyleGenerator()

blockStyles.addBlockStyles( 'columnSpacing', [ {
	selector: '.container',
	styleRule: 'marginTop',
	attrName: 'columnSpacing',
	responsive: 'all',
	format: '%spx',
	hasUnits: 'px',
	valuePreCallback: callbacks.marginTop.valuePreCallback,
},
{
	selector: '.container',
	styleRule: 'marginRight',
	attrName: 'columnSpacing',
	responsive: 'all',
	format: '%spx',
	hasUnits: 'px',
	valuePreCallback: callbacks.marginRight.valuePreCallback,
},
{
	selector: '.container',
	styleRule: 'marginBottom',
	attrName: 'columnSpacing',
	responsive: 'all',
	format: '%spx',
	hasUnits: 'px',
	valuePreCallback: callbacks.marginBottom.valuePreCallback,
},
{
	selector: '.container',
	styleRule: 'marginLeft',
	attrName: 'columnSpacing',
	responsive: 'all',
	format: '%spx',
	hasUnits: 'px',
	valuePreCallback: callbacks.marginLeft.valuePreCallback,
},

// The styles below are used purely for the block highligher feature
// where the edges of the element where the padding will be applied
// is highlighted.

{
	renderIn: 'edit',
	selector: '.container',
	styleRule: '--column-spacing-top',
	attrName: 'columnSpacing',
	responsive: 'all',
	format: '%spx',
	hasUnits: 'px',
	valuePreCallback: callbacks.marginTop.valuePreCallback,
},
{
	renderIn: 'edit',
	selector: '.container',
	styleRule: '--column-spacing-right',
	attrName: 'columnSpacing',
	responsive: 'all',
	format: '%spx',
	hasUnits: 'px',
	valuePreCallback: callbacks.marginRight.valuePreCallback,
},
{
	renderIn: 'edit',
	selector: '.container',
	styleRule: '--column-spacing-bottom',
	attrName: 'columnSpacing',
	responsive: 'all',
	format: '%spx',
	hasUnits: 'px',
	valuePreCallback: callbacks.marginBottom.valuePreCallback,
},
{
	renderIn: 'edit',
	selector: '.container',
	styleRule: '--column-spacing-left',
	attrName: 'columnSpacing',
	responsive: 'all',
	format: '%spx',
	hasUnits: 'px',
	valuePreCallback: callbacks.marginLeft.valuePreCallback,
} ] )

export default blockStyles
