/**
 * External dependencies 
 */ 
import classnames from 'classnames/dedupe'
import { memo } from '@wordpress/element'
import { useBlockProps } from '@wordpress/block-editor'
/**
 * Internal dependencies 
 */ 
import { useUniqueId } from '@/hooks'
import { useQueryLoopInstanceId } from '@/utils'
import { getBlockUniqueClassname, createUniqueClassId } from '@/block-editor/guten-css/utils'
import { InspectorControls } from './edit'

export const BlockDiv = memo( props => {
	const {
		clientId,
		attributes,
	} = props

	useUniqueId( attributes )

	const tempUniqueId = createUniqueClassId( clientId )
	const instanceId = useQueryLoopInstanceId( attributes.uniqueId || tempUniqueId )
	let uniqueBlockClass = getBlockUniqueClassname( attributes.uniqueId || tempUniqueId )
	uniqueBlockClass = instanceId ? uniqueBlockClass + `-${ instanceId }` : uniqueBlockClass

	const classNames = classnames(
		[
			'gutenway-block',
			{
				[ uniqueBlockClass ]: true,
			},
		]
	)

	return (
		<>
			<InspectorControls />
			<div
				{ ...useBlockProps( { className: classNames } ) }
				data-block-id={ attributes.uniqueId || tempUniqueId }
			>
				{ props.children }
			</div>
		</>
	)
} )


BlockDiv.Content = props => {
	const {
		attributes,
	} = props

	let uniqueBlockClass = getBlockUniqueClassname( attributes.uniqueId )

	const classNames = classnames([
			'gutenway-block',
			{
				[ uniqueBlockClass ]: true,
			},
		])

	return <div
		{ ...useBlockProps.save( { className: classNames } ) }
		data-block-id={ attributes.uniqueId || undefined }
	>
		{ props.children }
	</div>
}