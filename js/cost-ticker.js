/* ============================================
   SLM Command Center - Cost Ticker Module
   Real-time cost comparison: GPT-4 vs SLM
   ============================================ */

const CostTicker = {
    // Pricing configuration (per 1M tokens)
    pricing: {
        'gpt-4': {
            input: 30.00,
            output: 60.00,
            name: 'GPT-4 API'
        },
        'gpt-4o': {
            input: 5.00,
            output: 15.00,
            name: 'GPT-4o API'
        },
        'mistral-7b': {
            input: 0.20,
            output: 0.20,
            name: 'Mistral 7B (Self-hosted)',
            infrastructure: 1.21 // g5.2xlarge per hour
        },
        'phi-3': {
            input: 0.15,
            output: 0.15,
            name: 'Phi-3.5 Mini (Self-hosted)',
            infrastructure: 1.01
        },
        'llama-3.2': {
            input: 0.18,
            output: 0.18,
            name: 'Llama 3.2 3B (Self-hosted)',
            infrastructure: 1.01
        }
    },
    
    // State
    state: {
        isRunning: false,
        gptCost: 0,
        slmCost: 0,
        queryCount: 0,
        dailyVolume: 10000,
        selectedGpt: 'gpt-4',
        selectedSlm: 'mistral-7b',
        avgInputTokens: 500,
        avgOutputTokens: 200
    },
    
    // Initialize module
    init() {
        this.bindEvents();
        this.updateProjections();
        this.setupVolumeSlider();
    },
    
    // Bind event listeners
    bindEvents() {
        // Query input
        const queryInput = document.getElementById('query-input');
        if (queryInput) {
            queryInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.runComparison();
                }
            });
        }
        
        // Run button
        const runBtn = document.getElementById('run-comparison-btn');
        if (runBtn) {
            runBtn.addEventListener('click', () => this.runComparison());
        }
        
        // Model selectors
        const gptSelect = document.getElementById('gpt-model-select');
        if (gptSelect) {
            gptSelect.addEventListener('change', (e) => {
                this.state.selectedGpt = e.target.value;
                this.updateProjections();
            });
        }
        
        const slmSelect = document.getElementById('slm-model-select');
        if (slmSelect) {
            slmSelect.addEventListener('change', (e) => {
                this.state.selectedSlm = e.target.value;
                this.updateProjections();
            });
        }
    },
    
    // Setup volume slider
    setupVolumeSlider() {
        const slider = document.getElementById('volume-slider');
        const display = document.getElementById('volume-display');
        
        if (slider && display) {
            slider.addEventListener('input', (e) => {
                this.state.dailyVolume = parseInt(e.target.value);
                display.textContent = Utils.formatNumber(this.state.dailyVolume);
                this.updateProjections();
            });
        }
    },
    
    // Calculate cost for a single query
    calculateQueryCost(model, inputTokens, outputTokens) {
        const pricing = this.pricing[model];
        if (!pricing) return 0;
        
        const inputCost = (inputTokens / 1000000) * pricing.input;
        const outputCost = (outputTokens / 1000000) * pricing.output;
        
        return inputCost + outputCost;
    },
    
    // Calculate infrastructure cost per query
    calculateInfraCost(model, queriesPerHour = 100) {
        const pricing = this.pricing[model];
        if (!pricing || !pricing.infrastructure) return 0;
        
        return pricing.infrastructure / queriesPerHour;
    },
    
    // Run comparison
    async runComparison() {
        if (this.state.isRunning) return;
        
        const queryInput = document.getElementById('query-input');
        const query = queryInput?.value || 'What are the key benefits of using Small Language Models for enterprise applications?';
        
        this.state.isRunning = true;
        this.state.queryCount++;
        
        // Reset displays
        this.resetCostDisplays();
        
        // Simulate both responses simultaneously
        await Promise.all([
            this.simulateGptResponse(query),
            this.simulateSlmResponse(query)
        ]);
        
        this.state.isRunning = false;
        this.updateProjections();
        
        Toast.success('Comparison complete! See the cost difference.');
    },
    
    // Simulate GPT response
    async simulateGptResponse(query) {
        const responseArea = document.getElementById('gpt-response');
        const costDisplay = document.getElementById('gpt-cost');
        
        if (!responseArea || !costDisplay) return;
        
        responseArea.innerHTML = '<span class="typing-cursor"></span>';
        
        // Simulate typing response
        const response = `Based on my analysis, Small Language Models offer several compelling advantages for enterprise deployments. First, they provide significantly reduced operational costs—often 3-23x lower than frontier models. Second, they enable complete data sovereignty, keeping sensitive information within your infrastructure. Third, they offer faster inference times with lower latency, typically under 100ms. Fourth, they're highly customizable through fine-tuning on domain-specific data. Finally, they reduce dependency on external API providers, eliminating concerns about rate limits and service disruptions.`;
        
        let currentText = '';
        const inputTokens = this.estimateTokens(query);
        const outputTokens = this.estimateTokens(response);
        
        // Animate cost counter during typing
        const startTime = Date.now();
        const typingDuration = response.length * 15;
        const totalCost = this.calculateQueryCost(this.state.selectedGpt, inputTokens, outputTokens);
        
        const costInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / typingDuration, 1);
            const currentCost = totalCost * progress;
            costDisplay.textContent = '$' + currentCost.toFixed(4);
            this.state.gptCost += (totalCost / (typingDuration / 50));
            
            if (progress >= 1) {
                clearInterval(costInterval);
                costDisplay.textContent = '$' + totalCost.toFixed(4);
            }
        }, 50);
        
        // Type out response
        for (let i = 0; i < response.length; i++) {
            currentText += response[i];
            responseArea.innerHTML = currentText + '<span class="typing-cursor"></span>';
            await Utils.sleep(15);
        }
        
        responseArea.innerHTML = currentText;
    },
    
    // Simulate SLM response
    async simulateSlmResponse(query) {
        const responseArea = document.getElementById('slm-response');
        const costDisplay = document.getElementById('slm-cost');
        
        if (!responseArea || !costDisplay) return;
        
        responseArea.innerHTML = '<span class="typing-cursor"></span>';
        
        // Simulate faster typing (SLM is faster)
        const response = `Small Language Models provide enterprise-ready advantages: 1) Cost efficiency - 3-23x lower costs than GPT-4/Claude; 2) Data sovereignty - your data stays on your infrastructure, meeting HIPAA/SOC2/GDPR requirements; 3) Low latency - sub-100ms response times for real-time applications; 4) Customization - fine-tune on your domain data for 20-30% accuracy improvements; 5) Predictable costs - no surprise API bills, fixed infrastructure spend. Our Mistral 7B deployment on AWS g5.2xlarge handles 50+ requests/second at $0.0004 per query.`;
        
        let currentText = '';
        const inputTokens = this.estimateTokens(query);
        const outputTokens = this.estimateTokens(response);
        
        const totalCost = this.calculateQueryCost(this.state.selectedSlm, inputTokens, outputTokens) + 
                          this.calculateInfraCost(this.state.selectedSlm, 100);
        
        const startTime = Date.now();
        const typingDuration = response.length * 10; // Faster typing
        
        const costInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / typingDuration, 1);
            const currentCost = totalCost * progress;
            costDisplay.textContent = '$' + currentCost.toFixed(6);
            this.state.slmCost += (totalCost / (typingDuration / 50));
            
            if (progress >= 1) {
                clearInterval(costInterval);
                costDisplay.textContent = '$' + totalCost.toFixed(6);
            }
        }, 50);
        
        // Type out response (faster)
        for (let i = 0; i < response.length; i++) {
            currentText += response[i];
            responseArea.innerHTML = currentText + '<span class="typing-cursor"></span>';
            await Utils.sleep(10);
        }
        
        responseArea.innerHTML = currentText;
    },
    
    // Estimate tokens (rough approximation)
    estimateTokens(text) {
        return Math.ceil(text.length / 4);
    },
    
    // Reset cost displays
    resetCostDisplays() {
        const gptCost = document.getElementById('gpt-cost');
        const slmCost = document.getElementById('slm-cost');
        
        if (gptCost) gptCost.textContent = '$0.0000';
        if (slmCost) slmCost.textContent = '$0.000000';
    },
    
    // Update projections based on volume
    updateProjections() {
        const volume = this.state.dailyVolume;
        
        // Calculate daily costs
        const gptDailyCost = this.calculateQueryCost(
            this.state.selectedGpt, 
            this.state.avgInputTokens, 
            this.state.avgOutputTokens
        ) * volume;
        
        const slmDailyCost = (
            this.calculateQueryCost(
                this.state.selectedSlm, 
                this.state.avgInputTokens, 
                this.state.avgOutputTokens
            ) + this.calculateInfraCost(this.state.selectedSlm, volume / 24)
        ) * volume;
        
        // Monthly projections
        const gptMonthlyCost = gptDailyCost * 30;
        const slmMonthlyCost = slmDailyCost * 30 + (this.pricing[this.state.selectedSlm].infrastructure * 24 * 30);
        
        // Update displays
        const gptMonthly = document.getElementById('gpt-monthly-cost');
        const slmMonthly = document.getElementById('slm-monthly-cost');
        const savings = document.getElementById('monthly-savings');
        const savingsPercent = document.getElementById('savings-percent');
        
        if (gptMonthly) gptMonthly.textContent = '$' + gptMonthlyCost.toFixed(2);
        if (slmMonthly) slmMonthly.textContent = '$' + slmMonthlyCost.toFixed(2);
        
        const monthlySavings = gptMonthlyCost - slmMonthlyCost;
        const percentSavings = ((monthlySavings / gptMonthlyCost) * 100).toFixed(0);
        
        if (savings) {
            Utils.animateCounter(savings, 0, monthlySavings, 1000, '$', '');
        }
        if (savingsPercent) {
            savingsPercent.textContent = percentSavings + '%';
        }
        
        // Update annual projection
        const annualSavings = document.getElementById('annual-savings');
        if (annualSavings) {
            annualSavings.textContent = '$' + (monthlySavings * 12).toFixed(0);
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    CostTicker.init();
});

// Export for global access
window.CostTicker = CostTicker;
