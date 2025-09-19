/**
 * Filter system for CSS Generator
 * Simplified version of WordPress hooks system
 */

class FilterManager {
    constructor() {
        this.filters = {}
    }


    /**
     * Apply filters
     * @param {string} tag Filter tag
     * @param {...any} args Arguments to pass to filters
     * @returns {any} Filtered value
     */
    applyFilters(tag, ...args) {
        if (!this.filters[tag]) {
            return args[0]
        }

        let value = args[0]
        
        for (const filter of this.filters[tag]) {
            value = filter.callback(value, ...args.slice(1))
        }
        
        return value
    }
}

// Create global instance
const filterManager = new FilterManager()


/**
 * Apply filters
 * @param {string} tag Filter tag
 * @param {...any} args Arguments
 * @returns {any} Filtered value
 */
export const applyFilters = (tag, ...args) => {
    return filterManager.applyFilters(tag, ...args)
}

export default filterManager
