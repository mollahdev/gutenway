/**
 * Utility functions for CSS generation
 * Extracted and adapted from Stackable
 */
import { pickBy, isFunction } from 'lodash-es'

/**
 * Forms a media query string for the given devices.
 *
 * @param {string} devices A list of devices: desktop, tablet or mobile
 * @param {number} breakDesktop Tablet breakpoint
 * @param {number} breakTablet Mobile breakpoint
 * @return {string} A media query
 */
export const getMediaQuery = (devices = 'desktop', breakDesktop = 1024, breakTablet = 768) => {
    // This should be identical to styles/breakpoints.scss
    if (devices === 'desktopTablet') {
        return '@media screen and (min-width: ' + breakTablet + 'px)'
    } else if (devices === 'desktopOnly') {
        return '@media screen and (min-width: ' + breakDesktop + 'px)'
    } else if (devices === 'tablet') {
        return '@media screen and (max-width: ' + (breakDesktop - 1) + 'px)'
    } else if (devices === 'tabletOnly') {
        return '@media screen and (min-width: ' + breakTablet + 'px) and (max-width: ' + (breakDesktop - 1) + 'px)'
    } else if (devices === 'mobile') {
        return '@media screen and (max-width: ' + (breakTablet - 1) + 'px)'
    }
    return null
}

/**
 * Gets the unique class name for the block, e.g
 *
 * @param {string} uniqueId The uniqueId attribute of the block
 * @param {string} clientId The clientId of the block - if in the editor, supply this. If rendering for the save function, leave this blank.
 *
 * @return {string} The block's unique class name
 */
export const createUniqueClassId = uid => `${ uid?.substring( 0, 7 ) }`
export const getBlockUniqueClassname = (uniqueId, clientId = '') => {
    return `gway${createUniqueClassId(uniqueId || clientId)}`
}

/**
 * Prepends a class
 *
 * @param {string} selector
 * @param {string} prependString Prepend a class to the selector
 *
 * @return {string} New selector
 */
export const prependClass = (selector, prependString) => {
    const getSelector = s => {
        // Pseudoselectors should not be delimited by spaces.
        return `${prependString || ''}${s.startsWith(':') ? '' : ' '}${s || ''}`.trim()
    }

    if (Array.isArray(selector)) {
        return selector.map(getSelector).join(', ')
    }

    return getSelector(selector)
}

/**
 * Appends a class
 *
 * @param {string} selector
 * @param {string} appendString Class to append
 *
 * @return {string} New selector
 */
export const appendClass = (selector, appendString) => {
    const getSelector = s => {
        return `${s}${appendString || ''}`.trim()
    }

    if (Array.isArray(selector)) {
        return selector.map(getSelector).join(', ')
    }

    return getSelector(selector)
}

/**
 * Creates a getAttribute function for easy getting of values for the current block.
 *
 * @param {Object} attributes Block attributes
 * @param {string} attrNameTemplate Attribute name template
 *
 * @return {Function} A getAttribute function that uses the attributes and the name template.
 */
export const getAttributeFunc = (attributes, attrNameTemplate = '') => {
    const getAttribute = (_attrName, device = 'desktop', state = 'normal', getInherited = false) => {
        const attrName = attrNameTemplate ? getAttrName(attrNameTemplate, _attrName) : _attrName
        const value = attributes[getAttributeName(attrName, device, state)]

        if (!getInherited) {
            return value
        }

        // If inheriting, return the value if we got one.
        if (value !== '' && typeof value !== 'undefined') {
            return value
        }

        // This is the last inheritance that we can get.
        if (device === 'desktop') {
            return value
        }

        // Try and get an inherited value (e.g. if no tablet is supplied, get the desktop value)
        const nextDevice = device === 'mobile' ? 'tablet' : 'desktop'
        return getAttribute(_attrName, nextDevice, state, getInherited)
    }

    return getAttribute
}

/**
 * Gets attribute name with device and state suffixes
 * @param {string} attrName Base attribute name
 * @param {string} device Device (desktop, tablet, mobile)
 * @param {string} state State (normal, hover, parent-hover, collapsed)
 * @returns {string} Full attribute name
 */
export const getAttributeName = (attrName, device = 'desktop', state = 'normal') => {
    let fullName = attrName
    
    if (device !== 'desktop') {
        fullName += device.charAt(0).toUpperCase() + device.slice(1)
    }
    
    if (state !== 'normal') {
        const stateMap = {
            'hover': 'Hover',
            'parent-hover': 'ParentHover',
            'collapsed': 'Collapsed'
        }
        fullName += stateMap[state] || ''
    }
    
    return fullName
}

/**
 * Gets attribute name with template
 * @param {string} template Template string with %s placeholder
 * @param {string} attrName Attribute name
 * @returns {string} Formatted attribute name
 */
export const getAttrName = (template, attrName) => {
    return template.replace('%s', attrName)
}

/**
 * Removes any suffixes from the attribute name.
 *
 * @param {string} attrName Attribute name
 * @return {string} Root attribute name
 */
export const getRootAttrName = (attrName) => {
    return attrName.replace(/(Hover|ParentHover|Collapsed|Tablet|TabletHover|TabletParentHover|TabletCollapsed|Mobile|MobileHover|MobileParentHover|MobileCollapsed|Unit|UnitHover|UnitParentHover|UnitCollapsed|UnitTablet|UnitTabletHover|UnitTabletParentHover|UnitTabletCollapsed|UnitMobile|UnitMobileHover|UnitMobileParentHover|UnitMobileCollapsed)$/, '')
}

export const getAttributesWithValues = (attributes) => {
    const test = value => typeof value !== 'undefined' && value !== ''
    return Object.keys(pickBy(attributes, test))
}


/**
 * Checks the `renderCondition` property in blockStyle if it matches the
 * condition to render this, if present.
 *
 * @param {Object} blockStyle The block style object
 * @param {Object} attributes The block attributes
 */
export const styleShouldRender = (blockStyle, attributes) => {
    if (blockStyle.renderCondition) {
        if (isFunction(blockStyle.renderCondition)) {
            return blockStyle.renderCondition(attributes)
        }
        // renderCondition is an attribute name.
        return !!attributes[blockStyle.renderCondition]
    }
    return true
}