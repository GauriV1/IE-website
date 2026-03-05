/**
 * Main JavaScript for IE Website
 * Handles data loading, rendering, and interactions
 */

class IEWebsite {
    constructor() {
        this.search = new IESearch();
        this.allData = {};
        this.currentPage = this.detectCurrentPage();
        this.basePath = this.getBasePath();
    }

    /**
     * Get base path for assets (works for root and pages/ on GitHub Pages)
     */
    getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/pages/')) return '../';
        return './';
    }

    /**
     * Detect current page from URL
     */
    detectCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('tasks-services')) return 'tasks-services';
        if (path.includes('policies-resources')) return 'policies-resources';
        if (path.includes('teams')) return 'teams';
        if (path.includes('tools-applications')) return 'tools-applications';
        if (path.includes('news')) return 'news';
        if (path.includes('directory')) return 'directory';
        if (path.includes('travel-expense-policy')) return 'travel-expense-policy';
        return 'home';
    }

    /**
     * Initialize the website
     */
    async init() {
        await this.loadAllData();
        this.search.initGlobalSearch(this.allData);
        this.setupEventListeners();
        if (this.currentPage !== 'travel-expense-policy') {
            this.renderCurrentPage();
        } else {
            this.renderPolicyPage();
        }
    }

    /**
     * Load all JSON data files
     */
    async loadAllData() {
        const files = [
            'tasks-services',
            'policies-resources',
            'teams',
            'tools-applications',
            'news',
            'directory',
            'travel-expense-policy'
        ];
        const base = this.basePath;
        for (const file of files) {
            try {
                const url = base + 'data/' + file + '.json';
                const response = await fetch(url);
                if (response.ok) {
                    this.allData[file] = await response.json();
                }
            } catch (error) {
                console.warn('Could not load ' + file + '.json:', error);
            }
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        window.addEventListener('pageSearchResults', (e) => {
            this.renderTiles(e.detail.results, e.detail.query);
        });

        window.addEventListener('globalSearchResults', (e) => {
            this.showGlobalSearchResults(e.detail.results, e.detail.query);
        });
    }

    /**
     * Render current page content
     */
    renderCurrentPage() {
        const data = this.allData[this.currentPage];
        if (!data) return;

        let pageData = [];
        if (data.items) pageData = data.items;
        if (data.staff) pageData = data.staff;
        if (data.teams) pageData = data.teams;
        if (data.subcategories) {
            (data.subcategories || []).forEach(sub => {
                pageData = pageData.concat(sub.items || []);
            });
        }

        this.search.initPageSearch(pageData);
        this.renderTiles(pageData);
    }

    /**
     * Render policy detail page from travel-expense-policy.json
     */
    renderPolicyPage() {
        const policy = this.allData['travel-expense-policy'];
        const container = document.getElementById('policy-content');
        if (!container || !policy) return;

        let html = '<div class="policy-header">';
        html += '<h1 class="policy-title">' + this.escapeHtml(policy.title) + '</h1>';
        html += '<div class="policy-meta">Version ' + this.escapeHtml(policy.version) + ' &bull; Effective ' + policy.effectiveDate + ' &bull; Last updated ' + policy.lastUpdated + '</div>';
        html += '</div>';

        (policy.sections || []).forEach(section => {
            html += '<div class="policy-section" id="' + this.escapeHtml(section.id) + '">';
            html += '<h2>' + this.escapeHtml(section.title) + '</h2>';
            if (section.content) {
                html += '<p>' + this.escapeHtml(section.content) + '</p>';
            }
            if (section.subsections && section.subsections.length) {
                section.subsections.forEach(sub => {
                    html += '<h3>' + this.escapeHtml(sub.title) + '</h3>';
                    html += '<p>' + this.escapeHtml(sub.content || '') + '</p>';
                });
            }
            html += '</div>';
        });

        if (policy.appendices && policy.appendices.length) {
            html += '<div class="policy-section"><h2>Appendices</h2>';
            policy.appendices.forEach(app => {
                html += '<h3>' + this.escapeHtml(app.title) + '</h3>';
                if (app.content) html += '<p>' + this.escapeHtml(app.content) + '</p>';
                if (app.link) html += '<p><a href="' + this.escapeHtml(app.link) + '" class="tile-link">' + this.escapeHtml(app.title) + '</a></p>';
            });
            html += '</div>';
        }

        if (policy.contacts) {
            html += '<div class="policy-section"><h2>Contacts</h2><p>Questions: ' + this.escapeHtml(policy.contacts.questions || '') + '; Approvals: ' + this.escapeHtml(policy.contacts.approvals || '') + '</p></div>';
        }

        container.innerHTML = html;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Render tiles to the grid
     */
    renderTiles(items, highlightQuery) {
        const container = document.getElementById('content-grid');
        if (!container) return;

        if (!items || items.length === 0) {
            container.innerHTML = '<div class="no-results"><p>No results found. Try a different search term.</p></div>';
            return;
        }

        container.innerHTML = items.map(item => this.createTileHTML(item, highlightQuery)).join('');
    }

    /**
     * Create HTML for a single tile
     */
    createTileHTML(item, highlightQuery) {
        const title = this.highlightText(item.title || item.name, highlightQuery);
        const description = this.highlightText(
            item.description || item.summary || item.bio || '',
            highlightQuery
        );
        const base = this.basePath;
        const linkBase = base === './' ? '' : base;

        if (item.email && (item.title || item.department)) {
            return '<div class="tile person-card" data-id="' + (item.id || '') + '">' +
                (item.photo ? '<img src="' + linkBase + item.photo + '" alt="' + this.escapeHtml(item.name) + '" class="person-photo">' : '') +
                '<div class="person-info">' +
                '<div class="person-name">' + title + '</div>' +
                '<div class="person-title">' + (item.title || '') + '</div>' +
                '<div class="person-contact">' +
                '<a href="mailto:' + this.escapeHtml(item.email) + '">' + this.escapeHtml(item.email) + '</a>' +
                (item.phone ? '<br>' + this.escapeHtml(item.phone) : '') +
                (item.office ? '<br>' + this.escapeHtml(item.office) : '') +
                '</div></div></div>';
        }

        if (item.date) {
            const href = '#';
            return '<div class="tile news-card" data-id="' + (item.id || '') + '">' +
                '<div class="news-date">' + this.formatDate(item.date) + '</div>' +
                (item.category ? '<span class="news-category">' + this.escapeHtml(item.category) + '</span>' : '') +
                '<h3 class="tile-title">' + title + '</h3>' +
                '<p class="tile-description">' + description + '</p>' +
                this.renderTags(item.tags) +
                '<a href="' + href + '" class="tile-link">Read more →</a></div>';
        }

        const link = item.link || item.url || item.documentUrl || '#';
        let fullLink = link;
        if (link !== '#' && !link.startsWith('http') && !link.startsWith('#')) {
            fullLink = link.indexOf('/') === -1 ? link : (linkBase + link);
        }
        const badge = item.badge ? '<span class="tile-badge">' + this.escapeHtml(item.badge) + '</span>' : '';
        return '<div class="tile" data-id="' + (item.id || '') + '">' +
            badge +
            (item.icon ? '<div class="tile-icon">' + item.icon + '</div>' : '') +
            '<h3 class="tile-title">' + title + '</h3>' +
            '<p class="tile-description">' + description + '</p>' +
            this.renderTags(item.tags) +
            (fullLink !== '#' ? '<a href="' + fullLink + '" class="tile-link">Learn more →</a>' : '') +
            '</div>';
    }

    highlightText(text, query) {
        if (!query || !text) return this.escapeHtml(String(text || ''));
        const escaped = this.escapeHtml(String(text));
        const terms = query.toLowerCase().split(' ').filter(t => t.length > 0);
        let result = escaped;
        terms.forEach(term => {
            const regex = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$1') + ')', 'gi');
            result = result.replace(regex, '<span class="search-highlight">$1</span>');
        });
        return result;
    }

    renderTags(tags) {
        if (!tags || tags.length === 0) return '';
        return '<div class="tile-tags">' + tags.map(t => '<span class="tag">' + this.escapeHtml(t) + '</span>').join('') + '</div>';
    }

    formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    showGlobalSearchResults(results, query) {
        const container = document.getElementById('content-grid');
        if (container && results && results.length > 0) {
            this.renderTiles(results, query);
        }
    }
}

// Base path for fetch (../ when in pages/, else ./)
window.IE_BASE_PATH = (function() {
    var path = window.location.pathname;
    if (path.indexOf('/pages/') !== -1) return '../';
    return './';
})();

document.addEventListener('DOMContentLoaded', function() {
    var site = new IEWebsite();
    site.basePath = window.IE_BASE_PATH || './';
    site.init();
});
