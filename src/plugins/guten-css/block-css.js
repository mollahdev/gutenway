/**
 * External dependencies 
 */ 
import { applyFilters } from '@wordpress/hooks'
import { kebabCase } from 'lodash-es'
import { sprintf } from 'sprintf-js'
/**
 * Internal dependencies 
 */ 
import { EDITOR_STYLES_WRAPPER } from './constants.js'
import {
    appendClass,
    getAttributeFunc,
    getBlockUniqueClassname,
    getMediaQuery,
    prependClass,
    getAttributeName,
    getAttrName,
} from './utils.js'


export const BlockCssFunc = props => {
    const {
        selector: _selector = '',
        styleRule: _styleRule = '',
        hoverStyleRule: _hoverStyleRule = '',
        attrName: _attrName = '',
        format = '%s',
        hasUnits = false, // False, or the default unit e.g. 'px' or '%'
        responsive = false,
        hover: _hover = false,
        important = false, // If true, adds !important to the CSS rule

        // Additional options.
        attrNameTemplate = '',
        selectorCallback = null, // Can be used instead of selector.
        hoverSelector: _hoverSelector = '', // You can specify your own hover selector (for saving purposes only)
        hoverSelectorCallback = null,
        hoverCallback = null,
        styleRuleCallback = null, // Allow style rules to be dynamically generated.
        renderIn = '', // edit or save or blank for both
        valuePreCallback = null,
        enabledCallback = null, // Function that if returns false, will not render this style.
        vendorPrefixes = [], // Add vendor prefixes to also generate for the styleRule, e.g. '-webkit-'
        clampCallback = null, // Function that can be used to limit the value in tablet/mobile based on the desktop value
        unitCallback = null, // Function that can override

        compileCssTo = null, // If rendering for saving, the object passed here is used to add the css to (instead of outputting styles).
        attributes = {}, // The attributes used for this style.

        editorMode = true, // If true, this renders css for the editor.
        clientId = '', // The block's clientId, only used if rendering for the editor.
        instanceId = '', // Used by the Query Loop block, this is the instance of the template being displayed.
        blockState = 'normal', // The block's hover state to render the styles for.

        generateForAllBlockStates = false, // If true, it will generate styles for all block states
    } = props

    const getAttribute = getAttributeFunc(attributes, attrNameTemplate)
    const attrName = attrNameTemplate ? getAttrName(attrNameTemplate, _attrName) : _attrName
    const prefix = 'guten'
    const wrapperClass = props.editorMode ? EDITOR_STYLES_WRAPPER : ''

    // Only render in correct place if needed.
    if (renderIn) {
        if (editorMode && renderIn === 'save') {
            return null
        } else if (!editorMode && renderIn === 'edit') {
            return null
        }
    }

    // Allow to be disabled.
    if (enabledCallback) {
        if (!enabledCallback(getAttribute, attributes)) {
            return null
        }
    }

    const getValue = (attrName, device, state) => {
        const unitAttrName = getAttributeName(`${attrName}Unit`, device, state)
        const actualAttrName = getAttributeName(attrName, device, state)

        let unit = hasUnits ? (attributes[unitAttrName] || hasUnits) : ''
        let value = attributes[actualAttrName]

        /**
         * Allow unspecified units to be set based on the larger used
         * unitdesktop/tablet unit if value is empty. For example in `rem`,
         * any mobile value that's automatically applied should also show
         * `rem`
         */
        if (value === '' && (device === 'tablet' || device === 'mobile')) {
            const desktopUnit = attributes[getAttributeName(`${attrName}Unit`, 'desktop', state)]
            const tabletUnit = attributes[getAttributeName(`${attrName}Unit`, 'tablet', state)]
            if (device === 'tablet') {
                unit = desktopUnit
            } else if (device === 'mobile') {
                const tabletValue = attributes[getAttributeName(attrName, 'tablet', state)]
                if (tabletValue !== '') {
                    unit = tabletUnit
                } else {
                    unit = desktopUnit
                }
            }
        }

        // Allow others to override the unit.
        if (unitCallback) {
            unit = unitCallback(unit, device, state, getAttribute)
        }

        // Allow unspecified tablet & mobile values to be clamped based on the desktop value.
        if (clampCallback && responsive) {
            const desktopValue = attributes[getAttributeName(attrName, 'desktop', state)]
            const tabletValue = attributes[getAttributeName(attrName, 'tablet', state)]
            if (value === '' || typeof value === 'undefined') {
                if (device === 'tablet') {
                    value = clampCallback(desktopValue, getAttribute, device, state, unit, attributes)
                } else if (device === 'mobile') {
                    value = clampCallback(tabletValue !== '' ? tabletValue : desktopValue, getAttribute, device, state, unit, attributes)
                }
            }
        }

        // Allow value to be overridden, helpful for when the value is blank.
        if (valuePreCallback) {
            value = valuePreCallback(value, getAttribute, device, state, attributes)
        }

        if (value === '' || typeof value === 'undefined') {
            return undefined
        }

        if (unit && !format.includes('%s')) { // Note: this will only work for non-objects.
            // If the value is `auto` or a CSS variable, don't add units.
            if (!(value === 'auto' || (typeof value === 'string' && value.startsWith('var')))) {
                value = `${value}${unit}`
            }
        }
        if (format !== '%s' && format !== '') {
            value = sprintf(
                format.replace(/%([sd])%/, '%$1%%'), // If the format ends with %, that means it's a percentage sign.
                value
            )
        }

        return value
    }

    const hover = hoverCallback ? hoverCallback(getAttribute, attributes) : _hover

    // Some BlockCss components do not have the responsive prop. This is default behavior of obtaining the desktop value.
    const hasDesktop = responsive === 'all' || responsive === false || (Array.isArray(responsive) && responsive.find(s => s.startsWith('desktop')))
    const hasTablet = responsive === 'all' || (Array.isArray(responsive) && responsive.find(s => s.startsWith('tablet')))
    const hasMobile = responsive === 'all' || (Array.isArray(responsive) && responsive.find(s => s.startsWith('mobile')))

    const hasHover = hover === 'all' || (Array.isArray(hover) && hover.includes('hover'))
    const hasParentHover = hover === 'all' || (Array.isArray(hover) && hover.includes('parent-hover'))
    const hasCollapsed = hover === 'all' || (Array.isArray(hover) && hover.includes('collapsed'))

    let valueDesktop,
        valueDesktopCollapsed,
        valueDesktopHover,
        valueDesktopParentHover,
        valueMobile,
        valueMobileCollapsed,
        valueMobileHover,
        valueMobileParentHover,
        valueTablet,
        valueTabletCollapsed,
        valueTabletHover,
        valueTabletParentHover

    if (hasDesktop) {
        valueDesktop = getValue(attrName, 'desktop', 'normal')
        if (hasHover) {
            valueDesktopHover = getValue(attrName, 'desktop', 'hover')
        }
        if (hasParentHover) {
            valueDesktopParentHover = getValue(attrName, 'desktop', 'parent-hover')
        }
        if (hasCollapsed) {
            valueDesktopCollapsed = getValue(attrName, 'desktop', 'collapsed')
        }
    }

    if (hasTablet) {
        valueTablet = getValue(attrName, 'tablet', 'normal')
        if (hasHover) {
            valueTabletHover = getValue(attrName, 'tablet', 'hover')
        }
        if (hasParentHover) {
            valueTabletParentHover = getValue(attrName, 'tablet', 'parent-hover')
        }
        if (hasCollapsed) {
            valueTabletCollapsed = getValue(attrName, 'tablet', 'collapsed')
        }
    }

    if (hasMobile) {
        valueMobile = getValue(attrName, 'mobile', 'normal')
        if (hasHover) {
            valueMobileHover = getValue(attrName, 'mobile', 'hover')
        }
        if (hasParentHover) {
            valueMobileParentHover = getValue(attrName, 'mobile', 'parent-hover')
        }
        if (hasCollapsed) {
            valueMobileCollapsed = getValue(attrName, 'mobile', 'collapsed')
        }
    }

    // Skip everything if all values are null.
    if (typeof valueDesktop === 'undefined' &&
        typeof valueDesktopHover === 'undefined' &&
        typeof valueDesktopParentHover === 'undefined' &&
        typeof valueDesktopCollapsed === 'undefined' &&
        typeof valueTablet === 'undefined' &&
        typeof valueTabletHover === 'undefined' &&
        typeof valueTabletParentHover === 'undefined' &&
        typeof valueTabletCollapsed === 'undefined' &&
        typeof valueMobile === 'undefined' &&
        typeof valueMobileHover === 'undefined' &&
        typeof valueMobileParentHover === 'undefined' &&
        typeof valueMobileCollapsed === 'undefined') {
        return null
    }

    // Allow style rule to be dynamic.
    let styleRule = _styleRule
    if (styleRuleCallback) {
        styleRule = styleRuleCallback(getAttribute, attributes)
    }
    const hoverStyleRule = _hoverStyleRule || styleRule

    let selector = selectorCallback ? selectorCallback(getAttribute, attributes, clientId, props) : _selector
    let hoverSelector = hoverSelectorCallback ? hoverSelectorCallback(getAttribute, attributes, clientId) : _hoverSelector

    const desktopQuery = (Array.isArray(responsive) ? responsive.find(s => s.startsWith('desktop')) : 'desktop') || 'desktop'
    const tabletQuery = (Array.isArray(responsive) ? responsive.find(s => s.startsWith('tablet')) : 'tablet') || 'tablet'
    const mobileQuery = (Array.isArray(responsive) ? responsive.find(s => s.startsWith('mobile')) : 'mobile') || 'mobile'

    let collapsedSelector = ''
    let parentHoverSelector = ''

    if (hasCollapsed) {
        if (generateForAllBlockStates) {
            collapsedSelector = prependClass(selector, `%h :where(.${prefix}-block-accordion.${prefix}--is-open) .%s`)
        } else if (blockState === 'collapsed') {
            collapsedSelector = prependClass(selector, `:where(.${prefix}-block-accordion.${prefix}--is-open) .%s`)
        } else {
            collapsedSelector = prependClass(selector, `:where(.${prefix}-block-accordion.${prefix}--is-open) .%s`)
        }
    }

    // Use %h as a placeholder to indicate that a hover state class should be prepended to the selector.
    if (hasParentHover) {
        if (generateForAllBlockStates) {
            parentHoverSelector = [prependClass(selector, `%h.%s.${prefix}--is-hovered`), prependClass(selector, `:where(.${prefix}-hover-parent:hover, .${prefix}-hover-parent.${prefix}--is-hovered) .%s`)]
        } else if (blockState === 'parent-hover') {
            parentHoverSelector = prependClass(selector, `.%s.${prefix}--is-hovered`)
        } else {
            parentHoverSelector = prependClass(selector, `:where(.${prefix}-hover-parent:hover, .${prefix}-hover-parent.${prefix}--is-hovered) .%s`)
        }
    }

    // Create the hoverSelector
    if (hasHover) {
        const selectorHasDataBlock = (hoverSelector || selector).includes('[data-block=') && (hoverSelector || selector).endsWith(']')
        if (selectorHasDataBlock) {
            // If there is a [data-block] append the :hover or .prefix-is-hovered directly to it.
            if (generateForAllBlockStates) {
                hoverSelector = [appendClass(selector, `%h.${prefix}--is-hovered`), hoverSelector || appendClass(selector, ':hover')]
            } else if (blockState === 'hover') {
                // In editor, always use the `selector` instead of the hoverSelector.
                hoverSelector = appendClass(selector, `.${prefix}--is-hovered`)
            } else {
                hoverSelector = hoverSelector || appendClass(selector, ':hover')
            }
        } else {
            // Prepend .%s:hover to the selector.
            if (generateForAllBlockStates) {
                hoverSelector = [prependClass(selector, `%h.%s.${prefix}--is-hovered`), hoverSelector || prependClass(selector, '.%s:hover')]
            } else if (blockState === 'hover') { // eslint-disable-line no-lonely-if
                // In editor, always use the `selector` instead of the hoverSelector.
                hoverSelector = prependClass(selector, `.%s.${prefix}--is-hovered`)
            } else {
                hoverSelector = hoverSelector || prependClass(selector, '.%s:hover')
            }
        }
    }

    //
    let blockUniqueClassName = getBlockUniqueClassname(attributes.uniqueId, clientId)
    if (instanceId) {
        if (!blockUniqueClassName.match(/-[\d]$/g)) {
            blockUniqueClassName = blockUniqueClassName + `-${instanceId}`
        }

        if (typeof selector === 'string') {
            // Add instance id to classes. ( e.g. `prefix-abc123` -> `prefix-abc123-2`, where 2 is `instanceId`. )
            selector = selector.replace(/[^^?](.%s)([^-])/g, `$1-${instanceId}$2`)
            hoverSelector = typeof hoverSelector === 'string' ? hoverSelector.replace(/[^^?](.%s)([^-])/g, `$1-${instanceId}$2`) : hoverSelector.map(s => s.replace(/[^^?](.%s)([^-])/g, `$1-${instanceId}$2`))
            parentHoverSelector = typeof parentHoverSelector === 'string' ? parentHoverSelector.replace(/[^^?](.%s)([^-])/g, `$1-${instanceId}$2`) : parentHoverSelector.map(s => s.replace(/[^^?](.%s)([^-])/g, `$1-${instanceId}$2`))
            collapsedSelector = collapsedSelector.replace(/[^^?](.%s)([^-])/g, `$1-${instanceId}$2`)
        }
    }

    if (!props.editorMode) {
        blockUniqueClassName = applyFilters('guten-css.block-css.uniqueClass.save', blockUniqueClassName, attributes)
    } else {
        blockUniqueClassName = applyFilters('guten-css.block-css.uniqueClass.edit', blockUniqueClassName)
    }

    // Selectors can be arrays, flatten them.
    if (Array.isArray(selector)) {
        selector = selector.join(', ')
    }
    if (Array.isArray(hoverSelector)) {
        hoverSelector = hoverSelector.join(', ')
    }
    if (Array.isArray(parentHoverSelector)) {
        parentHoverSelector = parentHoverSelector.join(', ')
    }

    selector = prependCSSClass(selector, blockUniqueClassName, blockUniqueClassName, wrapperClass)
    if (hasHover) {
        hoverSelector = prependCSSClass(hoverSelector, blockUniqueClassName, blockUniqueClassName, wrapperClass, generateForAllBlockStates ? `.${prefix}-preview-state--hover` : '')
    }
    if (hasParentHover) {
        parentHoverSelector = prependCSSClass(parentHoverSelector, blockUniqueClassName, blockUniqueClassName, wrapperClass, generateForAllBlockStates ? `.${prefix}-preview-state--parent-hover` : '')
    }
    if (hasCollapsed) {
        collapsedSelector = prependCSSClass(collapsedSelector, blockUniqueClassName, blockUniqueClassName, wrapperClass, generateForAllBlockStates ? `.${prefix}-preview-state--collapsed` : '')
    }

    let css = ''

    // If rendering for the editor, output the css, if saving, compile css to an object.
    const createCssFunc = editorMode ? 
        (selector, rule, value, device, vendorPrefixes, compileCssTo) => 
            createCssEdit(selector, rule, value, device, vendorPrefixes, important, props.breakDesktop, props.breakTablet) :
        (selector, rule, value, device, vendorPrefixes, compileCssTo) => 
            addCssToCssSaveObject(selector, rule, value, device, vendorPrefixes, compileCssTo, important)

    css += createCssFunc(selector, styleRule, valueDesktop, desktopQuery, vendorPrefixes, compileCssTo)
    if (hasHover) {
        css += createCssFunc(hoverSelector, hoverStyleRule, valueDesktopHover, desktopQuery, vendorPrefixes, compileCssTo)
    }
    if (hasParentHover) {
        css += createCssFunc(parentHoverSelector, hoverStyleRule, valueDesktopParentHover, desktopQuery, vendorPrefixes, compileCssTo)
    }
    if (hasCollapsed) {
        css += createCssFunc(collapsedSelector, styleRule, valueDesktopCollapsed, desktopQuery, vendorPrefixes, compileCssTo)
    }

    if (hasTablet) {
        css += createCssFunc(selector, styleRule, valueTablet, tabletQuery, vendorPrefixes, compileCssTo)
        if (hasHover) {
            css += createCssFunc(hoverSelector, hoverStyleRule, valueTabletHover, tabletQuery, vendorPrefixes, compileCssTo)
        }
        if (hasParentHover) {
            css += createCssFunc(parentHoverSelector, hoverStyleRule, valueTabletParentHover, tabletQuery, vendorPrefixes, compileCssTo)
        }
        if (hasCollapsed) {
            css += createCssFunc(collapsedSelector, styleRule, valueTabletCollapsed, desktopQuery, vendorPrefixes, compileCssTo)
        }
    }

    if (hasMobile) {
        css += createCssFunc(selector, styleRule, valueMobile, mobileQuery, vendorPrefixes, compileCssTo)
        if (hasHover) {
            css += createCssFunc(hoverSelector, hoverStyleRule, valueMobileHover, mobileQuery, vendorPrefixes, compileCssTo)
        }
        if (hasParentHover) {
            css += createCssFunc(parentHoverSelector, hoverStyleRule, valueMobileParentHover, mobileQuery, vendorPrefixes, compileCssTo)
        }
        if (hasCollapsed) {
            css += createCssFunc(collapsedSelector, styleRule, valueMobileCollapsed, desktopQuery, vendorPrefixes, compileCssTo)
        }
    }

    // When saving, allow others to change the output css.
    if (!props.editorMode) {
        css = applyFilters('css-generator.block-styles.save', css, blockUniqueClassName, attributes)
    }

    return css || null
}

/**
 * Generates a CSS string based on the inputs.
 *
 * @param {string} selector Selector
 * @param {string} rule Snake cased css rule, supports custom css properties
 * @param {string} value The value of the style
 * @param {string} device desktop, desktopOnly, desktopTablet, etc the media query where this rule should apply
 * @param {Array} vendorPrefixes List of vendor prefixes e.g. '--webkit-`
 * @param {boolean} important Whether to add !important to the CSS rule
 *
 * @return {string} The generated css style
 */
function createCssEdit(selector, rule, value, device = 'desktop', vendorPrefixes = [], important = false, breakDesktop = 1024, breakTablet = 768) {
    if (typeof value === 'undefined') {
        return ''
    }

    // KebabCase the style rule, but support custom CSS properties (double dashes) and vendor prefixes (one dash).
    const cleanedRuleName = rule.replace(/^(--?)?(.*?$)/, (matches, dashes, rule) => `${dashes || ''}${kebabCase(rule)}`)
    const importantFlag = important ? ' !important' : ''
    let css = `${cleanedRuleName}: ${value}${importantFlag}`
    if (vendorPrefixes.length) {
        vendorPrefixes.forEach(vendorPrefx => {
            css += `;${vendorPrefx}${cleanedRuleName}: ${value}${importantFlag}`
        })
    }
    css = `\n${selector} {\n\t${css}\n}`

    const mediaQuery = getMediaQuery(device, breakDesktop, breakTablet)
    if (mediaQuery) {
        css = `\n${mediaQuery} {${css}\n}`
    }

    return css
}

/**
 * Generates a CSS string based on the inputs. Similar to createCss, but instead
 * of generating a string, it populates the provided CssSaveCompiler object.
 *
 * @param {string} selector Selector
 * @param {string} rule Snake cased css rule, supports custom css properties
 * @param {string} value The value of the style
 * @param {string} device desktop, desktopOnly, desktopTablet, etc the media
 * query where this rule should apply
 * @param {Array} vendorPrefixes List of vendor prefixes e.g. '--webkit-`
 * @param {CssSaveCompiler} compileToObject The CssSaveCompiler object where the
 * css will be added to
 * @param {boolean} important Whether to add !important to the CSS rule
 *
 * @return {string} Always returns an empty string.
 */
function addCssToCssSaveObject(selector, rule, value, device = 'desktop', vendorPrefixes = [], compileToObject = {}, important = false) {
    if (typeof value === 'undefined') {
        return ''
    }

    // KebabCase the style rule, but support custom CSS properties (double dashes) and vendor prefixes (one dash).
    const cleanedRuleName = rule.replace(/^(--?)?(.*?$)/, (matches, dashes, rule) => `${dashes || ''}${kebabCase(rule)}`)
    const importantFlag = important ? ' !important' : ''

    compileToObject.addStyle(selector, cleanedRuleName, `${value}${importantFlag}`, device)
    if (vendorPrefixes.length) {
        vendorPrefixes.forEach(vendorPrefx => {
            compileToObject.addStyle(selector, `${vendorPrefx}${cleanedRuleName}`, `${value}${importantFlag}`, device)
        })
    }

    return ''
}

/**
 * Prepends CSS class to selector
 * @param {string} selector CSS selector
 * @param {string} blockUniqueClassName Unique block class name
 * @param {string} placeholder Placeholder for class
 * @param {string} wrapSelector Wrapper selector
 * @param {string} stateClass State class
 * @returns {string} Modified selector
 */
function prependCSSClass(selector, blockUniqueClassName, placeholder, wrapSelector, stateClass = '') {
    if (!selector) return selector
    
    // Replace %s placeholder with actual class name
    let modifiedSelector = selector.replace(/%s/g, blockUniqueClassName)
    
    // If no %s placeholder was found, prepend the unique class
    if (modifiedSelector === selector && !selector.includes('%s')) {
        modifiedSelector = `.${blockUniqueClassName} ${modifiedSelector}`
    }
    
    // Add state class if provided
    if (stateClass) {
        modifiedSelector = stateClass + ' ' + modifiedSelector
    }
    
    // Add wrapper if provided
    if (wrapSelector) {
        modifiedSelector = wrapSelector + ' ' + modifiedSelector
    }
    
    return modifiedSelector
}
