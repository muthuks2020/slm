/* ============================================
   SLM Command Center - Main JavaScript
   Core functionality and navigation
   ============================================ */

// Application State
const AppState = {
    currentModule: 'dashboard',
    isLoading: false,
    settings: {
        animationsEnabled: true,
        darkMode: false
    }
};

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupNavigation();
    setupModuleCards();
    animateOnLoad();
    updateDateTime();
    setInterval(updateDateTime, 60000);
}

// Navigation Setup
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const module = item.dataset.module;
            if (module) {
                navigateToModule(module);
            }
        });
    });
}

// Navigate to Module
function navigateToModule(module) {
    // Update active state
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.module === module) {
            item.classList.add('active');
        }
    });
    
    AppState.currentModule = module;
    
    // Detect if we're in the pages subdirectory
    const isInPagesDir = window.location.pathname.includes('/pages/');
    const basePath = isInPagesDir ? '../' : '';
    
    // Navigate to page
    const modulePages = {
        'dashboard': basePath + 'index.html',
        'cost-ticker': basePath + 'pages/cost-ticker.html',
        'rag-citations': basePath + 'pages/rag-citations.html',
        'guardrails': basePath + 'pages/guardrails.html',
        'model-arena': basePath + 'pages/model-arena.html',
        'fine-tuning': basePath + 'pages/fine-tuning.html',
        'infra-recommender': basePath + 'pages/infra-recommender.html'
    };
    
    if (modulePages[module]) {
        window.location.href = modulePages[module];
    }
}

// Setup Module Cards (Dashboard)
function setupModuleCards() {
    const moduleCards = document.querySelectorAll('.module-card');
    
    moduleCards.forEach(card => {
        card.addEventListener('click', () => {
            const module = card.dataset.module;
            if (module) {
                navigateToModule(module);
            }
        });
    });
}

// Animation on Load
function animateOnLoad() {
    const animatedElements = document.querySelectorAll('[data-animate]');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Update Date/Time
function updateDateTime() {
    const dateTimeEl = document.getElementById('current-datetime');
    if (dateTimeEl) {
        const now = new Date();
        const options = { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        dateTimeEl.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Utility Functions
const Utils = {
    // Format currency
    formatCurrency(amount, decimals = 4) {
        return '$' + amount.toFixed(decimals);
    },
    
    // Format large numbers
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },
    
    // Animate counter
    animateCounter(element, start, end, duration = 1000, prefix = '', suffix = '') {
        const startTime = performance.now();
        const difference = end - start;
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = start + (difference * easeProgress);
            
            element.textContent = prefix + current.toFixed(4) + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    },
    
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Generate unique ID
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    },
    
    // Sleep function
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // Type text animation
    async typeText(element, text, speed = 20) {
        element.textContent = '';
        for (let i = 0; i < text.length; i++) {
            element.textContent += text[i];
            await this.sleep(speed);
        }
    }
};

// Toast Notifications
const Toast = {
    container: null,
    
    init() {
        this.container = document.createElement('div');
        this.container.className = 'toast-container';
        this.container.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(this.container);
    },
    
    show(message, type = 'info', duration = 3000) {
        if (!this.container) this.init();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#146eb4'
        };
        
        toast.style.backgroundColor = colors[type] || colors.info;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        toast.innerHTML = `
            <span style="font-size: 18px;">${icons[type] || icons.info}</span>
            <span>${message}</span>
        `;
        
        this.container.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.transform = 'translateX(0)';
        });
        
        // Remove after duration
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },
    
    success(message) { this.show(message, 'success'); },
    error(message) { this.show(message, 'error'); },
    warning(message) { this.show(message, 'warning'); },
    info(message) { this.show(message, 'info'); }
};

// Modal System
const Modal = {
    create(title, content, options = {}) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            max-width: ${options.width || '500px'};
            width: 90%;
            max-height: 90vh;
            overflow: hidden;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="padding: 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; color: #1a1a2e;">${title}</h3>
                <button class="modal-close" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #718096;">&times;</button>
            </div>
            <div style="padding: 20px; overflow-y: auto; max-height: 60vh;">
                ${content}
            </div>
            ${options.footer ? `<div style="padding: 15px 20px; border-top: 1px solid #e2e8f0; background: #f2f2f2;">${options.footer}</div>` : ''}
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Animate in
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        });
        
        // Close handlers
        const close = () => {
            overlay.style.opacity = '0';
            modal.style.transform = 'scale(0.9)';
            setTimeout(() => overlay.remove(), 300);
        };
        
        overlay.querySelector('.modal-close').addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
        
        return { overlay, modal, close };
    }
};

// Loading State
const Loading = {
    show(container) {
        const loader = document.createElement('div');
        loader.className = 'loading-overlay';
        loader.innerHTML = `
            <div class="spinner"></div>
            <p style="margin-top: 1rem; color: var(--color-text-light);">Loading...</p>
        `;
        loader.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 100;
        `;
        
        container.style.position = 'relative';
        container.appendChild(loader);
        
        return () => loader.remove();
    }
};

// Export for use in other modules
window.AppState = AppState;
window.Utils = Utils;
window.Toast = Toast;
window.Modal = Modal;
window.Loading = Loading;
