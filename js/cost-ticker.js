/* ============================================
   SLM Command Center - Cost Ticker Module
   Real-time cost comparison: GPT-4 vs SLM
   With Industry-Specific Scenarios
   ============================================ */

const CostTicker = {
    // Industry configurations
    industries: {
        general: {
            name: 'General',
            icon: '🔷',
            description: 'General enterprise use cases',
            queries: [
                "Summarize this quarterly report and highlight key metrics",
                "Draft a professional email response to this customer inquiry",
                "Analyze this document and extract the main action items"
            ],
            responses: {
                gpt: "Based on my analysis, I've identified the following key points from the document. The quarterly revenue increased by 15% year-over-year, with particularly strong performance in the enterprise segment. Key action items include: reviewing the marketing budget allocation, scheduling follow-up meetings with stakeholders, and preparing the board presentation for next month.",
                slm: "DOCUMENT ANALYSIS COMPLETE\n\nKey Metrics:\n• Revenue: +15% YoY\n• Enterprise segment: Strong performance\n\nAction Items:\n1. Review marketing budget allocation\n2. Schedule stakeholder meetings\n3. Prepare board presentation\n\n[Processed on-premise | Full audit trail available]"
            },
            avgInputTokens: 800,
            avgOutputTokens: 400
        },
        healthcare: {
            name: 'Healthcare',
            icon: '🏥',
            description: 'Clinical documentation & HIPAA compliance',
            queries: [
                "Summarize this patient's clinical notes and highlight medication changes",
                "Extract ICD-10 codes from this discharge summary",
                "Generate a HIPAA-compliant patient visit summary"
            ],
            responses: {
                gpt: "Patient Summary: The clinical notes indicate a 65-year-old male with hypertension presenting with chest pain. Recent medication changes include: Lisinopril increased from 10mg to 20mg daily, addition of Metoprolol 25mg BID. Lab results show elevated troponin levels requiring cardiac monitoring. Recommend cardiology consult and continuous telemetry monitoring.",
                slm: "CLINICAL SUMMARY [HIPAA-Compliant]\n\nPatient: 65y/o M | Chief Complaint: Chest pain\n\nMedication Changes:\n• Lisinopril: 10mg → 20mg daily\n• NEW: Metoprolol 25mg BID\n\nKey Findings: Elevated troponin, HTN\nRecommendation: Cardiology consult, telemetry\n\n[Generated on-premise | PHI retained in VPC | Audit ID: HC-2024-1847]"
            },
            avgInputTokens: 1200,
            avgOutputTokens: 600
        },
        financial: {
            name: 'Financial Services',
            icon: '🏦',
            description: 'SEC filings, compliance & risk analysis',
            queries: [
                "Analyze this SEC 10-K filing and summarize risk factors",
                "Extract key metrics from this earnings call transcript",
                "Generate a compliance report summary for regulatory review"
            ],
            responses: {
                gpt: "SEC 10-K Risk Analysis: The filing identifies several material risk factors including: market volatility exposure with 23% revenue concentration in APAC region, cybersecurity vulnerabilities following two minor incidents in Q3, supply chain dependencies on three primary vendors, and regulatory compliance challenges in emerging markets. Year-over-year revenue growth of 12% is offset by margin compression of 2.3 percentage points.",
                slm: "SEC 10-K RISK ANALYSIS [Confidential]\n\nMaterial Risks Identified:\n• Market Risk: 23% APAC concentration\n• Cyber Risk: 2 incidents Q3 (contained)\n• Supply Chain: 3 vendor dependencies\n• Regulatory: Emerging market compliance\n\nFinancials: +12% YoY revenue, -2.3pp margin\n\n[Processed on-premise | SOC2 compliant | No data shared externally | Audit: FIN-10K-2024-0892]"
            },
            avgInputTokens: 2000,
            avgOutputTokens: 800
        },
        retail: {
            name: 'Retail & E-commerce',
            icon: '🛒',
            description: 'Product content & customer analytics',
            queries: [
                "Generate SEO-optimized product descriptions for these items",
                "Analyze customer reviews and categorize sentiment themes",
                "Translate this product catalog to Spanish and French"
            ],
            responses: {
                gpt: "Product Description - Premium Wireless Earbuds: Experience crystal-clear audio with our latest wireless earbuds featuring active noise cancellation. Enjoy up to 32 hours of battery life with the charging case. IPX5 water resistance makes them perfect for workouts. Bluetooth 5.3 ensures seamless connectivity with all your devices. Premium memory foam tips provide all-day comfort.",
                slm: "PRODUCT DESCRIPTION [SEO-Optimized]\n\nPremium Wireless Earbuds - Model X500\n\n✓ Active Noise Cancellation (ANC)\n✓ 32-Hour Battery (with case)\n✓ IPX5 Water Resistant\n✓ Bluetooth 5.3\n✓ Memory Foam Tips\n\nKeywords: wireless earbuds, ANC, long battery, workout earbuds\nReadability: Grade 8 | SEO Score: 94/100\n\n[Batch processed: 50 items/min | Cost: $0.002/description]"
            },
            avgInputTokens: 500,
            avgOutputTokens: 300
        },
        customer_service: {
            name: 'Customer Service',
            icon: '💬',
            description: 'Support automation & ticket routing',
            queries: [
                "Classify this support ticket and suggest response template",
                "Search knowledge base and draft response for this inquiry",
                "Analyze this conversation and determine escalation need"
            ],
            responses: {
                gpt: "Ticket Classification: Billing Inquiry - Priority Medium\n\nSuggested Response: Thank you for contacting us regarding your recent charge. I've reviewed your account and can see the charge of $49.99 on March 15th for your monthly subscription renewal. If you believe this charge was made in error or would like to discuss your subscription options, I'd be happy to help. Would you like me to explain the charges in detail or explore alternative plans?",
                slm: "TICKET ANALYSIS [Auto-Classification]\n\nCategory: Billing | Priority: Medium | SLA: 4hrs\nSentiment: Neutral-Concerned | Escalation: No\n\nSUGGESTED RESPONSE:\n\"Thank you for reaching out about your $49.99 charge (Mar 15). This is your monthly subscription renewal. I can:\n• Explain charges in detail\n• Review alternative plans\n• Process refund if error\n\nHow would you like to proceed?\"\n\n[Response time: 0.3s | Confidence: 94% | KB Match: 3 articles]"
            },
            avgInputTokens: 400,
            avgOutputTokens: 250
        }
    },

    // Pricing configuration (per 1M tokens)
    pricing: {
        // API Providers
        'gpt-4': { input: 30.00, output: 60.00, name: 'GPT-4 API', type: 'api' },
        'gpt-4o': { input: 5.00, output: 15.00, name: 'GPT-4o API', type: 'api' },
        'claude-3': { input: 15.00, output: 75.00, name: 'Claude 3.5 API', type: 'api' },
        // ShellKode Self-Hosted Models
        'sk-clinical-7b': { input: 0.20, output: 0.20, name: 'SK-Clinical-7B', infrastructure: 1.21, type: 'shellkode', improvement: '+35%' },
        'sk-finance-7b': { input: 0.20, output: 0.20, name: 'SK-Finance-7B', infrastructure: 1.21, type: 'shellkode', improvement: '+28%' },
        'sk-legal-3b': { input: 0.15, output: 0.15, name: 'SK-Legal-3B', infrastructure: 1.01, type: 'shellkode', improvement: '+41%' },
        'sk-commerce-3b': { input: 0.18, output: 0.18, name: 'SK-Commerce-3B', infrastructure: 1.01, type: 'shellkode', improvement: '+38%' },
        // Base Models (Self-Hosted)
        'mistral-7b': { input: 0.20, output: 0.20, name: 'Mistral 7B (Base)', infrastructure: 1.21, type: 'base' },
        'phi-3': { input: 0.15, output: 0.15, name: 'Phi-3.5 Mini (Base)', infrastructure: 1.01, type: 'base' },
        'llama-3.2': { input: 0.18, output: 0.18, name: 'Llama 3.2 3B (Base)', infrastructure: 1.01, type: 'base' }
    },
    
    // State
    state: {
        isRunning: false,
        gptCost: 0,
        slmCost: 0,
        queryCount: 0,
        dailyVolume: 10000,
        selectedGpt: 'gpt-4',
        selectedSlm: 'sk-clinical-7b',
        currentIndustry: 'general',
        avgInputTokens: 800,
        avgOutputTokens: 400
    },
    
    init() {
        this.renderIndustrySelector();
        this.bindEvents();
        this.updateProjections();
        this.setupVolumeSlider();
        this.loadSampleQueries();
    },
    
    renderIndustrySelector() {
        const container = document.getElementById('industry-selector');
        if (!container) return;
        
        let html = '<div class="industry-tabs">';
        for (const [key, industry] of Object.entries(this.industries)) {
            const isActive = key === this.state.currentIndustry ? 'active' : '';
            html += `<button class="industry-tab ${isActive}" data-industry="${key}">
                <span class="industry-icon">${industry.icon}</span>
                <span class="industry-name">${industry.name}</span>
            </button>`;
        }
        html += '</div>';
        container.innerHTML = html;
        
        container.querySelectorAll('.industry-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.setIndustry(e.currentTarget.dataset.industry);
            });
        });
    },
    
    setIndustry(industry) {
        this.state.currentIndustry = industry;
        const config = this.industries[industry];
        this.state.avgInputTokens = config.avgInputTokens;
        this.state.avgOutputTokens = config.avgOutputTokens;
        
        document.querySelectorAll('.industry-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.industry === industry);
        });
        
        const desc = document.getElementById('industry-description');
        if (desc) desc.textContent = config.description;
        
        this.loadSampleQueries();
        this.updateProjections();
    },
    
    loadSampleQueries() {
        const container = document.getElementById('sample-queries');
        if (!container) return;
        
        const config = this.industries[this.state.currentIndustry];
        let html = '';
        config.queries.forEach((query, i) => {
            html += `<button class="sample-query-btn" data-query="${i}">${query.substring(0, 50)}...</button>`;
        });
        container.innerHTML = html;
        
        container.querySelectorAll('.sample-query-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const queryInput = document.getElementById('query-input');
                if (queryInput) queryInput.value = config.queries[parseInt(e.target.dataset.query)];
            });
        });
    },
    
    bindEvents() {
        const queryInput = document.getElementById('query-input');
        if (queryInput) {
            queryInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') this.runComparison(); });
        }
        
        const runBtn = document.getElementById('run-comparison-btn');
        if (runBtn) runBtn.addEventListener('click', () => this.runComparison());
        
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
    
    calculateQueryCost(model, inputTokens, outputTokens) {
        const pricing = this.pricing[model];
        if (!pricing) return 0;
        return (inputTokens / 1000000) * pricing.input + (outputTokens / 1000000) * pricing.output;
    },
    
    calculateInfraCost(model, queriesPerHour = 100) {
        const pricing = this.pricing[model];
        if (!pricing || !pricing.infrastructure) return 0;
        return pricing.infrastructure / queriesPerHour;
    },
    
    async runComparison() {
        if (this.state.isRunning) return;
        
        const queryInput = document.getElementById('query-input');
        const config = this.industries[this.state.currentIndustry];
        const query = queryInput?.value || config.queries[0];
        
        this.state.isRunning = true;
        this.state.queryCount++;
        
        // Show loader in both response areas
        const gptResponse = document.getElementById('gpt-response');
        const slmResponse = document.getElementById('slm-response');
        
        if (gptResponse) {
            gptResponse.innerHTML = Loader.dotsHTML('Querying API...');
        }
        if (slmResponse) {
            slmResponse.innerHTML = Loader.dotsHTML('Processing locally...');
        }
        
        // Random delay 3-5 seconds
        const delay = Loader.getRandomDelay();
        await Utils.sleep(delay);
        
        this.resetCostDisplays();
        await Promise.all([this.simulateGptResponse(query), this.simulateSlmResponse(query)]);
        
        this.state.isRunning = false;
        this.updateProjections();
        Toast.success(`${config.name} comparison complete! See the cost difference.`);
    },
    
    async simulateGptResponse(query) {
        const responseArea = document.getElementById('gpt-response');
        const costDisplay = document.getElementById('gpt-cost');
        if (!responseArea || !costDisplay) return;
        
        responseArea.innerHTML = '<span class="typing-cursor"></span>';
        const config = this.industries[this.state.currentIndustry];
        const response = config.responses.gpt;
        
        const inputTokens = this.estimateTokens(query);
        const outputTokens = this.estimateTokens(response);
        const totalCost = this.calculateQueryCost(this.state.selectedGpt, inputTokens, outputTokens);
        const typingDuration = response.length * 15;
        const startTime = Date.now();
        
        const costInterval = setInterval(() => {
            const progress = Math.min((Date.now() - startTime) / typingDuration, 1);
            costDisplay.textContent = '$' + (totalCost * progress).toFixed(4);
            if (progress >= 1) { clearInterval(costInterval); costDisplay.textContent = '$' + totalCost.toFixed(4); }
        }, 50);
        
        let currentText = '';
        for (let i = 0; i < response.length; i++) {
            currentText += response[i];
            responseArea.innerHTML = currentText + '<span class="typing-cursor"></span>';
            await Utils.sleep(15);
        }
        responseArea.innerHTML = currentText;
    },
    
    async simulateSlmResponse(query) {
        const responseArea = document.getElementById('slm-response');
        const costDisplay = document.getElementById('slm-cost');
        if (!responseArea || !costDisplay) return;
        
        responseArea.innerHTML = '<span class="typing-cursor"></span>';
        const config = this.industries[this.state.currentIndustry];
        const response = config.responses.slm;
        
        const inputTokens = this.estimateTokens(query);
        const outputTokens = this.estimateTokens(response);
        const totalCost = this.calculateQueryCost(this.state.selectedSlm, inputTokens, outputTokens) + this.calculateInfraCost(this.state.selectedSlm, 100);
        const typingDuration = response.length * 8;
        const startTime = Date.now();
        
        const costInterval = setInterval(() => {
            const progress = Math.min((Date.now() - startTime) / typingDuration, 1);
            costDisplay.textContent = '$' + (totalCost * progress).toFixed(6);
            if (progress >= 1) { clearInterval(costInterval); costDisplay.textContent = '$' + totalCost.toFixed(6); }
        }, 50);
        
        let currentText = '';
        for (let i = 0; i < response.length; i++) {
            currentText += response[i];
            responseArea.innerHTML = currentText.replace(/\n/g, '<br>') + '<span class="typing-cursor"></span>';
            await Utils.sleep(8);
        }
        responseArea.innerHTML = currentText.replace(/\n/g, '<br>');
    },
    
    estimateTokens(text) { return Math.ceil(text.length / 4); },
    
    resetCostDisplays() {
        const gptCost = document.getElementById('gpt-cost');
        const slmCost = document.getElementById('slm-cost');
        if (gptCost) gptCost.textContent = '$0.0000';
        if (slmCost) slmCost.textContent = '$0.000000';
    },
    
    updateProjections() {
        const volume = this.state.dailyVolume;
        const gptDailyCost = this.calculateQueryCost(this.state.selectedGpt, this.state.avgInputTokens, this.state.avgOutputTokens) * volume;
        const slmDailyCost = (this.calculateQueryCost(this.state.selectedSlm, this.state.avgInputTokens, this.state.avgOutputTokens) + this.calculateInfraCost(this.state.selectedSlm, volume / 24)) * volume;
        
        const gptMonthlyCost = gptDailyCost * 30;
        const slmMonthlyCost = slmDailyCost * 30 + (this.pricing[this.state.selectedSlm].infrastructure * 24 * 30);
        
        const gptMonthly = document.getElementById('gpt-monthly-cost');
        const slmMonthly = document.getElementById('slm-monthly-cost');
        const savings = document.getElementById('monthly-savings');
        const savingsPercent = document.getElementById('savings-percent');
        
        if (gptMonthly) gptMonthly.textContent = '$' + gptMonthlyCost.toFixed(2);
        if (slmMonthly) slmMonthly.textContent = '$' + slmMonthlyCost.toFixed(2);
        
        const monthlySavings = gptMonthlyCost - slmMonthlyCost;
        const percentSavings = gptMonthlyCost > 0 ? ((monthlySavings / gptMonthlyCost) * 100).toFixed(0) : 0;
        
        if (savings) Utils.animateCounter(savings, 0, monthlySavings, 1000, '$', '');
        if (savingsPercent) savingsPercent.textContent = percentSavings + '%';
        
        const annualSavings = document.getElementById('annual-savings');
        if (annualSavings) annualSavings.textContent = '$' + (monthlySavings * 12).toFixed(0);
        
        const industryNote = document.getElementById('industry-note');
        if (industryNote) {
            const config = this.industries[this.state.currentIndustry];
            industryNote.innerHTML = `<strong>${config.icon} ${config.name}:</strong> ${config.description}`;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => CostTicker.init());
window.CostTicker = CostTicker;
