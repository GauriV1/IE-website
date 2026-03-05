/**
 * Search functionality for the IE Website
 * Handles both global search and page-specific search
 */

class IESearch {
    constructor() {
        this.searchIndex = [];
        this.currentPageData = [];
    }

    /**
     * Initialize search with data from all JSON files
     * @param {Object} allData - Combined data from all JSON files
     */
    initGlobalSearch(allData) {
        this.searchIndex = this.buildSearchIndex(allData);
        this.setupGlobalSearchListeners();
    }

    /**
     * Initialize page-specific search
     * @param {Array} pageData - Data for the current page
     */
    initPageSearch(pageData) {
        this.currentPageData = pageData;
        this.setupPageSearchListeners();
    }

    /**
     * Build a flat search index from nested data
     */
    buildSearchIndex(data) {
        const index = [];
        
        // Process each data category
        Object.keys(data).forEach(category => {
            const categoryData = data[category];
            if (!categoryData) return;
            
            if (categoryData.items) {
                categoryData.items.forEach(item => {
                    index.push({
                        ...item,
                        category: category,
                        searchText: this.createSearchText(item)
                    });
                });
            }
            
            if (categoryData.staff) {
                categoryData.staff.forEach(person => {
                    index.push({
                        ...person,
                        category: 'directory',
                        searchText: this.createSearchText(person)
                    });
                });
            }
            
            if (categoryData.teams) {
                categoryData.teams.forEach(team => {
                    index.push({
                        ...team,
                        category: 'teams',
                        searchText: this.createSearchText(team)
                    });
                });
            }

            if (categoryData.subcategories) {
                categoryData.subcategories.forEach(subcat => {
                    (subcat.items || []).forEach(item => {
                        index.push({
                            ...item,
                            category: category,
                            subcategory: subcat.name,
                            searchText: this.createSearchText(item)
                        });
                    });
                });
            }
        });
        
        return index;
    }

    /**
     * Create searchable text from an item
     */
    createSearchText(item) {
        const fields = ['title', 'name', 'description', 'content', 'summary', 'bio'];
        let text = '';
        
        fields.forEach(field => {
            if (item[field]) {
                text += ' ' + String(item[field]).toLowerCase();
            }
        });
        
        if (item.tags && Array.isArray(item.tags)) {
            text += ' ' + item.tags.join(' ').toLowerCase();
        }
        
        return text;
    }

    /**
     * Search function
     */
    search(query, dataSet = this.searchIndex) {
        if (!query || query.length < 2) return dataSet;
        
        const terms = query.toLowerCase().split(' ').filter(t => t.length > 0);
        
        return dataSet.filter(item => {
            const searchText = item.searchText || this.createSearchText(item);
            return terms.every(term => searchText.includes(term));
        });
    }

    /**
     * Setup global search event listeners
     */
    setupGlobalSearchListeners() {
        const input = document.getElementById('global-search-input');
        const btn = document.getElementById('global-search-btn');
        
        if (input) {
            input.addEventListener('input', (e) => {
                this.handleGlobalSearch(e.target.value);
            });
            
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleGlobalSearch(e.target.value);
                }
            });
        }
        
        if (btn && input) {
            btn.addEventListener('click', () => {
                this.handleGlobalSearch(input.value);
            });
        }
    }

    /**
     * Setup page search event listeners
     */
    setupPageSearchListeners() {
        const input = document.getElementById('page-search-input');
        
        if (input) {
            input.addEventListener('input', (e) => {
                this.handlePageSearch(e.target.value);
            });
        }
    }

    /**
     * Handle global search
     */
    handleGlobalSearch(query) {
        const results = this.search(query);
        window.dispatchEvent(new CustomEvent('globalSearchResults', {
            detail: { results, query }
        }));
    }

    /**
     * Handle page search
     */
    handlePageSearch(query) {
        const results = this.search(query, this.currentPageData);
        window.dispatchEvent(new CustomEvent('pageSearchResults', {
            detail: { results, query }
        }));
    }
}

// Export for use
window.IESearch = IESearch;
