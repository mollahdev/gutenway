/**
 * External dependencies 
 */ 
import { isArray, isFunction } from 'lodash-es'
import { applyFilters } from '@wordpress/hooks'
/**
 * Internal dependencies 
 */ 
import { getAttrName, getBlockUniqueClassname, getRootAttrName, styleShouldRender, getAttributesWithValues } from './utils.js'
import { BlockCssFunc } from './block-css.js'
import { CssSaveCompiler } from './css-save-compiler.js'


export class GutenStyleGenerator {
    constructor(commonProps) {
        this.commonProps = commonProps
        this._blockStyles = {} // This holds all the blockStyles indices, keys are the attrName
        this._dynamicBlockStyles = [] // Holds functions that will be called when generating blocks styles.
        this._blockStyleNamesWithValuePreCallbacks = [] // This holds all block style keys that have valuePreCallbacks, becuase these will need to be run even if the attribute is blank.
        this._orderedStyles = [] // This holds all the blockStyles added in order
    }

    /**
     * Used to add block styles to the block style generator. The attribute name
     * is important because it is used for looking which styles are generated
     * from a set of attributes.
     *
     * @param {string} attrName The attribute name to add block styles to
     * @param {Array} blockStyles Properties needed to generate the block
     * styles
     * @return {undefined}
     */
    addBlockStyles(attrName, blockStyles) {
        if (!isArray(blockStyles)) {
            this.addBlockStyle(attrName, blockStyles)
        } else {
            blockStyles.forEach(blockStyle => {
                this.addBlockStyle(attrName, blockStyle)
            })
        }
    }

    /**
     * Used to add one block style to the block style generator. The attribute
     * name is important because it is used for looking which styles are
     * generated from a set of attributes.
     *
     * @param {string} _attrName The attribute name to add block styles to
     * @param {Object} blockStyle Properties needed to generate the block styles
     * @return {undefined}
     */
    addBlockStyle(_attrName, blockStyle) {
        if (!_attrName) {
            console.error('Guten CSS: No attribute name provided.')
        }

        // If an attribute name template is provided, use it to format the attrName
        const attrName = blockStyle.attrNameTemplate ? getAttrName(blockStyle.attrNameTemplate, _attrName) : _attrName

        // Remember the block styles that have valuePreCallbacks
        if (blockStyle.valuePreCallback) {
            if(!isFunction(blockStyle.valuePreCallback)) {
                console.error(`Guten CSS: valuePreCallback for attribute ${_attrName} is not a function.`)
            }

            this._blockStyleNamesWithValuePreCallbacks.push(attrName)
        }

        this._orderedStyles.push(blockStyle)
        const blockStyleIndex = this._orderedStyles.length - 1

        if (!this._blockStyles[attrName]) {
            this._blockStyles[attrName] = [blockStyleIndex]
            return
        }
        this._blockStyles[attrName].push(blockStyleIndex)
    }

    /**
     * Normally, block styles are added with `addBlockStyle`. However, when you
     * need to generate a block style that need to use a value from an
     * attribute, you don't have access to the attributes yet. But if you use
     * this function, then you can add the blockStyle dynamically - although
     * this is a less performant way to add block styles.
     *
     * @param {Function} fn function that's called when generating block styles
     */
    addBlockStyleConditionally(fn) {
        this._orderedStyles.push(fn)
        const blockStyleIndex = this._orderedStyles.length - 1
        this._dynamicBlockStyles.push(blockStyleIndex)
    }

    /**
     * Gets all the block styles for the given attribute names
     *
     * @param {Array} attrNames Array of attribute names
     * @param {boolean} getNonCssAttributes returns the blockStyles and the non-css attributes if true
     * @return {Object} Object of blockStyles, keys are the indices
     */
    getBlockStyles(attrNames, getNonCssAttributes = false) {
        if (!attrNames) {
            return this._orderedStyles.reduce((blockStyles, blockStyle, index) => {
                blockStyles[index] = blockStyle
                return blockStyles
            }, {})
        }

        // Since, JavaScript objects are ordered by default, use object with block style indices as keys
        // to maintain the order since attrNames may not follow the correct order.
        const orderdBlockStyles = {}
        const blockStyles = attrNames.reduce((blockStyles, attrName) => {
            if (!blockStyles[attrName] && this._blockStyles[attrName]) {
                blockStyles[attrName] = true
                // iterate over the block style indices, and add them to the array
                this._blockStyles[attrName].forEach(index => {
                    orderdBlockStyles[index] = this._orderedStyles[index]
                })
            }
            const rootAttrName = getRootAttrName(attrName)
            if (!blockStyles[rootAttrName] && this._blockStyles[rootAttrName]) {
                blockStyles[rootAttrName] = true
                this._blockStyles[rootAttrName].forEach(index => {
                    orderdBlockStyles[index] = this._orderedStyles[index]
                })
            }
            return blockStyles
        }, {})

        // Alays include block styles that have valuePreCallbacks.
        this._blockStyleNamesWithValuePreCallbacks.forEach(attrName => {
            if (!blockStyles[attrName]) {
                blockStyles[attrName] = true
                this._blockStyles[attrName].forEach(index => {
                    orderdBlockStyles[index] = this._orderedStyles[index]
                })
            }
        })

        // Add dynamic block styles
        this._dynamicBlockStyles.forEach(index => {
            if (!orderdBlockStyles[index]) {
                orderdBlockStyles[index] = this._orderedStyles[index]
            }
        })

        if (getNonCssAttributes && attrNames) {
            const nonCssAttrs = attrNames.filter(attrName => !(getRootAttrName(attrName) in blockStyles) && attrName !== 'uniqueId')
            return [orderdBlockStyles, nonCssAttrs]
        }

        return orderdBlockStyles
    }

    #generateBlockStylesForEditor(attributes, blockStyles, args) {
        const generatedCss = []

        // Generate block styles based on the attributes that have values
        Object.values(blockStyles).forEach(blockStyle => {
            // Call block styles that are added conditionally
            if (isFunction(blockStyle)) {
                const fn = blockStyle
                const _BlockCssFunc = _blockStyle => {
                    if (!styleShouldRender(_blockStyle, attributes)) {
                        return
                    }
                    const css = BlockCssFunc({
                        ...this.commonProps,
                        ..._blockStyle,
                        blockState: args.blockState,
                        clientId: args.clientId,
                        uniqueId: args.uniqueId,
                        instanceId: args.instanceId,
                        attributes,
                        editorMode: true,
                        generateForAllBlockStates: args.generateForAllBlockStates,
                    })
                    if (css) {
                        generatedCss.push(css)
                    }
                }
                fn(attributes, _BlockCssFunc)
                return
            }

            if (!styleShouldRender(blockStyle, attributes)) {
                return
            }

            const css = BlockCssFunc({
                ...this.commonProps,
                ...blockStyle,
                blockState: args.blockState,
                clientId: args.clientId,
                uniqueId: args.uniqueId,
                instanceId: args.instanceId,
                attributes,
                editorMode: true,
                generateForAllBlockStates: args.generateForAllBlockStates,
            })

            if (css) {
                generatedCss.push(css)
            }
        })

        let output = generatedCss.join('')
        return applyFilters('guten-css.block-css.edit', output, getBlockUniqueClassname(attributes.uniqueId, args.clientId))
    }

    /**
     * Compiles the blockStyles based on the attributes given. Make sure to pass
     * the same CssSaveCompiler instance for the same block for a more optimized
     * way of compiling.
     *
     * @param {CssSaveCompiler} cssCompiler An instance of CssSaveCompiler
     * @param {Object} attributes
     * @param {Array} blockStyles
     * @param {Object} args
     *
     * @return {string} Compiled css
     */
    #generateBlockStylesForSave(cssCompiler, attributes, blockStyles) {
        // Generate block styles based on the attributes that have values
        Object.values(blockStyles).forEach(blockStyle => {
            // Call block styles that are added conditionally
            if (typeof blockStyle === 'function') {
                const fn = blockStyle
                const _BlockCssFunc = _blockStyle => {
                    if (!styleShouldRender(_blockStyle, attributes)) {
                        return
                    }

                    return BlockCssFunc({
                        ...this.commonProps,
                        ..._blockStyle,
                        uniqueId: attributes.uniqueId,
                        attributes,
                        editorMode: false,
                        compileCssTo: cssCompiler,
                    })
                }
                fn(attributes, _BlockCssFunc)
                return
            }

            if (!styleShouldRender(blockStyle, attributes)) {
                return
            }

            BlockCssFunc({
                ...this.commonProps,
                ...blockStyle,
                uniqueId: attributes.uniqueId,
                attributes,
                editorMode: false,
                compileCssTo: cssCompiler,
            })
        })

        return cssCompiler.compile()
    }

    /**
     * Generate CSS for given attributes
     * @param {Object} attributes - Block attributes
     * @param {Object} options - Generation options
     * @returns {string} Generated CSS
     */
    generate(attributes, options = {}) {
        const {
            clientId,
            blockState = 'normal',
            editorMode = true,
            ...otherOptions
        } = options

        
        const attrNamesWithValues = getAttributesWithValues(attributes)
        const blockStyles = this.getBlockStyles(attrNamesWithValues)
        
        if (editorMode) {
            return this.#generateBlockStylesForEditor(attributes, blockStyles, {
                blockState,
                clientId,
                ...otherOptions
            })
        } else {
            const cssCompiler = new CssSaveCompiler()
            return this.#generateBlockStylesForSave(
                cssCompiler,
                attributes,
                blockStyles,
            )
        }
    }
}
