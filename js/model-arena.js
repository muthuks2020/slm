/* ============================================
   SLM Command Center - Model Arena Module
   Side-by-side Model Comparison
   Industry-Specific Benchmarks
   ============================================ */

const ModelArena = {
    industries: {
        general: {
            name: 'General',
            icon: '🔷',
            description: 'General purpose comparison',
            prompts: [
                { label: 'Summarization', text: 'Summarize the key points of this quarterly business report in 3 bullet points.' },
                { label: 'Code Generation', text: 'Write a Python function to validate email addresses using regex.' },
                { label: 'Analysis', text: 'Analyze the pros and cons of remote work policies for enterprise companies.' }
            ],
            evaluationCriteria: ['Accuracy', 'Coherence', 'Completeness', 'Relevance']
        },
        healthcare: {
            name: 'Healthcare',
            icon: '🏥',
            description: 'Clinical accuracy comparison',
            prompts: [
                { label: 'Clinical Summary', text: 'Summarize this patient presentation: 65yo M with HTN, presenting with substernal chest pain radiating to left arm, diaphoresis, and shortness of breath x 2 hours.' },
                { label: 'ICD-10 Coding', text: 'Suggest appropriate ICD-10 codes for: Type 2 diabetes with diabetic chronic kidney disease, stage 4.' },
                { label: 'Drug Interaction', text: 'Identify potential interactions between warfarin, aspirin, and omeprazole.' }
            ],
            evaluationCriteria: ['Medical Accuracy', 'Terminology', 'Safety Awareness', 'HIPAA Compliance']
        },
        financial: {
            name: 'Financial Services',
            icon: '🏦',
            description: 'Financial accuracy comparison',
            prompts: [
                { label: 'Risk Analysis', text: 'Analyze the risk factors from this SEC 10-K excerpt regarding market concentration in APAC region with 40% revenue exposure.' },
                { label: 'Earnings Summary', text: 'Summarize key metrics from Q3 earnings: Revenue $2.4B (+15% YoY), EPS $1.23 vs $1.18 expected, gross margin 42.3%.' },
                { label: 'Compliance Check', text: 'Review this client communication for potential compliance issues: "This investment is guaranteed to double your money within 6 months."' }
            ],
            evaluationCriteria: ['Numerical Accuracy', 'Regulatory Awareness', 'Risk Identification', 'Disclaimer Usage']
        },
        retail: {
            name: 'Retail & E-commerce',
            icon: '🛒',
            description: 'Product content comparison',
            prompts: [
                { label: 'Product Description', text: 'Write an SEO-optimized product description for wireless noise-canceling headphones with 30-hour battery life.' },
                { label: 'Review Analysis', text: 'Analyze sentiment from these reviews: "Great sound but uncomfortable after 2 hours", "Best headphones ever, worth every penny", "Good but not worth $300"' },
                { label: 'Translation', text: 'Translate this product title and description to Spanish: "Premium Wireless Earbuds - Crystal clear sound with active noise cancellation"' }
            ],
            evaluationCriteria: ['Brand Voice', 'SEO Quality', 'Accuracy', 'Engagement']
        },
        customer_service: {
            name: 'Customer Service',
            icon: '💬',
            description: 'Support response comparison',
            prompts: [
                { label: 'Ticket Response', text: 'Draft a response to: "I was charged twice for my subscription this month and I want a refund immediately!"' },
                { label: 'Knowledge Search', text: 'Find relevant KB articles for: Customer unable to reset password, email not receiving reset link' },
                { label: 'Escalation Decision', text: 'Determine if this requires escalation: "This is the third time calling about the same issue. If not resolved today, I will cancel and post negative reviews everywhere."' }
            ],
            evaluationCriteria: ['Empathy', 'Resolution Quality', 'Policy Adherence', 'Escalation Accuracy']
        }
    },

    models: {
        // ShellKode Fine-Tuned Models
        'sk-clinical-7b': { name: 'SK-Clinical-7B', params: '7B', quantization: 'FP16', vram: '14GB', speed: 'Fast', type: 'shellkode', domain: 'healthcare', improvement: '+35%' },
        'sk-finance-7b': { name: 'SK-Finance-7B', params: '7B', quantization: 'FP16', vram: '14GB', speed: 'Fast', type: 'shellkode', domain: 'financial', improvement: '+28%' },
        'sk-legal-3b': { name: 'SK-Legal-3B', params: '3.8B', quantization: 'FP16', vram: '8GB', speed: 'Very Fast', type: 'shellkode', domain: 'legal', improvement: '+41%' },
        'sk-commerce-3b': { name: 'SK-Commerce-3B', params: '3B', quantization: 'FP16', vram: '6GB', speed: 'Very Fast', type: 'shellkode', domain: 'retail', improvement: '+38%' },
        // Base Models
        'mistral-7b': { name: 'Mistral 7B', params: '7B', quantization: 'FP16', vram: '14GB', speed: 'Fast', type: 'base' },
        'phi-3.5': { name: 'Phi-3.5 Mini', params: '3.8B', quantization: 'FP16', vram: '8GB', speed: 'Very Fast', type: 'base' },
        'llama-3.2-3b': { name: 'Llama 3.2 3B', params: '3B', quantization: 'FP16', vram: '6GB', speed: 'Very Fast', type: 'base' },
        'qwen-2.5-7b': { name: 'Qwen 2.5 7B', params: '7B', quantization: 'FP16', vram: '14GB', speed: 'Fast', type: 'base' },
        'gemma-2-9b': { name: 'Gemma 2 9B', params: '9B', quantization: 'INT8', vram: '10GB', speed: 'Medium', type: 'base' }
    },

    state: {
        currentIndustry: 'general',
        selectedModels: ['sk-clinical-7b', 'mistral-7b'],
        quantization: 'FP16',
        isRunning: false,
        results: []
    },

    init() {
        this.renderIndustrySelector();
        this.renderModelSelector();
        this.renderPrompts();
        this.bindEvents();
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
            tab.addEventListener('click', (e) => this.setIndustry(e.currentTarget.dataset.industry));
        });
    },

    setIndustry(industry) {
        this.state.currentIndustry = industry;
        this.state.results = [];

        document.querySelectorAll('.industry-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.industry === industry);
        });

        const desc = document.getElementById('industry-description');
        if (desc) desc.textContent = this.industries[industry].description;

        this.renderPrompts();
        this.clearResults();
    },

    renderModelSelector() {
        const container = document.getElementById('model-selector');
        if (!container) return;

        // Separate ShellKode and base models
        const shellkodeModels = Object.entries(this.models).filter(([id, m]) => m.type === 'shellkode');
        const baseModels = Object.entries(this.models).filter(([id, m]) => m.type !== 'shellkode');

        let html = '<div class="model-section-label" style="font-weight: 600; color: #28a745; margin-bottom: 0.5rem;">🏆 ShellKode Fine-Tuned Models</div>';
        html += '<div class="model-checkboxes" style="margin-bottom: 1.5rem;">';
        for (const [id, model] of shellkodeModels) {
            const checked = this.state.selectedModels.includes(id) ? 'checked' : '';
            html += `<label class="model-checkbox shellkode">
                <input type="checkbox" value="${id}" ${checked}>
                <span class="model-info">
                    <span class="model-name">${model.name} <span class="sk-badge">SK</span></span>
                    <span class="model-meta">${model.params} • ${model.vram} • <span style="color:#28a745;font-weight:600;">${model.improvement}</span></span>
                </span>
            </label>`;
        }
        html += '</div>';

        html += '<div class="model-section-label" style="font-weight: 600; color: #666; margin-bottom: 0.5rem;">Base Models</div>';
        html += '<div class="model-checkboxes">';
        for (const [id, model] of baseModels) {
            const checked = this.state.selectedModels.includes(id) ? 'checked' : '';
            html += `<label class="model-checkbox">
                <input type="checkbox" value="${id}" ${checked}>
                <span class="model-info">
                    <span class="model-name">${model.name}</span>
                    <span class="model-meta">${model.params} • ${model.vram}</span>
                </span>
            </label>`;
        }
        html += '</div>';
        container.innerHTML = html;

        container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', (e) => {
                if (e.target.checked) {
                    if (this.state.selectedModels.length < 4) {
                        this.state.selectedModels.push(e.target.value);
                    } else {
                        e.target.checked = false;
                        Toast.warning('Maximum 4 models can be compared');
                    }
                } else {
                    this.state.selectedModels = this.state.selectedModels.filter(m => m !== e.target.value);
                }
            });
        });
    },

    renderPrompts() {
        const container = document.getElementById('prompt-selector');
        if (!container) return;

        const config = this.industries[this.state.currentIndustry];
        let html = '<div class="prompt-buttons">';
        
        config.prompts.forEach((prompt, i) => {
            html += `<button class="prompt-btn" data-index="${i}">${prompt.label}</button>`;
        });
        
        html += '</div>';
        container.innerHTML = html;

        container.querySelectorAll('.prompt-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                const input = document.getElementById('arena-input');
                if (input) input.value = config.prompts[index].text;
                
                container.querySelectorAll('.prompt-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    },

    bindEvents() {
        const runBtn = document.getElementById('run-arena-btn');
        if (runBtn) runBtn.addEventListener('click', () => this.runComparison());

        const quantSelect = document.getElementById('quantization-select');
        if (quantSelect) {
            quantSelect.addEventListener('change', (e) => {
                this.state.quantization = e.target.value;
            });
        }
    },

    async runComparison() {
        if (this.state.isRunning) return;
        if (this.state.selectedModels.length < 2) {
            Toast.warning('Select at least 2 models to compare');
            return;
        }

        const input = document.getElementById('arena-input');
        if (!input || !input.value.trim()) {
            Toast.warning('Enter a prompt to compare');
            return;
        }

        const prompt = input.value.trim();
        this.state.isRunning = true;

        const resultsContainer = document.getElementById('arena-results');
        if (resultsContainer) {
            // Show attractive loader
            Loader.show(resultsContainer, {
                type: 'comparison',
                title: 'Running Model Comparison',
                subtitle: `Comparing ${this.state.selectedModels.length} models on ${this.industries[this.state.currentIndustry].name} benchmark`,
                showSteps: true,
                stepCount: 5
            });
        }

        // Random delay 3-5 seconds
        const delay = Loader.getRandomDelay();
        await Utils.sleep(delay);

        // Run all models
        const results = await Promise.all(
            this.state.selectedModels.map(modelId => this.runModel(modelId, prompt))
        );

        this.renderResults(results);
        this.state.isRunning = false;
        Toast.success('Comparison complete!');
    },

    async runModel(modelId, prompt) {
        const model = this.models[modelId];
        const config = this.industries[this.state.currentIndustry];
        
        // Minimal delay since main delay is handled by loader
        await Utils.sleep(100);

        // Generate simulated response based on industry and model
        const response = this.generateResponse(modelId, prompt, config);
        
        // Generate metrics - ShellKode models get better scores
        const isShellKode = model.type === 'shellkode';
        const baseQuality = isShellKode ? 88 : 75;
        
        const metrics = {
            latency: Math.round(80 + Math.random() * 60),
            tokensPerSec: Math.round(80 + Math.random() * 120),
            costPer1K: this.getCostPer1K(modelId),
            quality: Math.round(baseQuality + Math.random() * 10)
        };

        return { modelId, model, response, metrics };
    },

    generateResponse(modelId, prompt, config) {
        // Industry-specific response templates
        const templates = {
            healthcare: {
                'mistral-7b': "Based on the clinical presentation, this patient presents with classic symptoms of acute coronary syndrome (ACS). Immediate ECG and troponin levels are indicated. Key differentials include STEMI, NSTEMI, and unstable angina. [Clinical assessment generated with medical terminology alignment]",
                'phi-3.5': "Patient symptoms suggest cardiac etiology. Recommend: 1) Stat ECG 2) Troponin x2 3) Cardiology consult. Risk stratification using HEART score advised. [Compact clinical summary]",
                'default': "Clinical assessment indicates cardiac workup is warranted. Standard ACS protocol should be initiated with appropriate monitoring."
            },
            financial: {
                'mistral-7b': "Risk Analysis: The 40% APAC revenue concentration represents significant geographic risk. Key concerns: 1) Currency exposure 2) Regulatory changes 3) Economic slowdown impact. Recommend diversification strategy. [Comprehensive financial analysis]",
                'qwen-2.5-7b': "Geographic concentration risk identified. APAC 40% exposure creates vulnerability to regional economic cycles. Mitigation strategies should include market diversification and hedging instruments. [Detailed risk assessment with quantitative focus]",
                'default': "Significant concentration risk identified in APAC region. Further diversification analysis recommended."
            },
            retail: {
                'mistral-7b': "Premium Wireless Headphones: Immerse yourself in studio-quality sound with advanced noise cancellation. 30 hours of uninterrupted playback. Comfortable over-ear design. Perfect for travel, work, and everything in between. [SEO Score: 92/100]",
                'phi-3.5': "Experience Superior Sound | 30hr Battery | Active Noise Cancellation | Wireless Freedom. Premium audio meets all-day comfort. Shop now! [Optimized for conversion]",
                'default': "High-quality wireless headphones with excellent battery life and noise cancellation features."
            },
            customer_service: {
                'mistral-7b': "I sincerely apologize for the double charge on your account. I can see both transactions and will process an immediate refund for the duplicate charge. The refund will appear within 3-5 business days. Is there anything else I can help you with today? [Empathy + Resolution]",
                'phi-3.5': "Sorry for the billing error! I've initiated a refund for the duplicate charge - you'll see it in 3-5 days. Reference #RF-12345 for your records. Anything else? [Efficient + Friendly]",
                'default': "I apologize for the inconvenience. A refund has been initiated for the duplicate charge."
            }
        };

        const industryTemplates = templates[this.state.currentIndustry] || templates.general || {};
        return industryTemplates[modelId] || industryTemplates['default'] || 
               `Response generated by ${this.models[modelId].name} for the given prompt. This model demonstrates strong performance on ${config.name} tasks.`;
    },

    getCostPer1K(modelId) {
        const costs = {
            'mistral-7b': 0.0004,
            'phi-3.5': 0.0003,
            'llama-3.2-3b': 0.0003,
            'qwen-2.5-7b': 0.0004,
            'gemma-2-9b': 0.0005
        };
        return costs[modelId] || 0.0004;
    },

    renderResults(results) {
        const container = document.getElementById('arena-results');
        if (!container) return;

        const config = this.industries[this.state.currentIndustry];
        
        // Find winner (highest quality score)
        const winner = results.reduce((a, b) => a.metrics.quality > b.metrics.quality ? a : b);

        let html = `<div class="results-header">
            <h4>Comparison Results</h4>
            <span class="industry-badge">${config.icon} ${config.name}</span>
        </div>`;

        html += '<div class="results-grid">';
        
        results.forEach(result => {
            const isWinner = result.modelId === winner.modelId;
            html += `<div class="result-card ${isWinner ? 'winner' : ''}">
                ${isWinner ? '<span class="winner-badge">🏆 Best</span>' : ''}
                <div class="result-header">
                    <span class="model-name">${result.model.name}</span>
                    <span class="model-params">${result.model.params}</span>
                </div>
                <div class="result-response">${result.response}</div>
                <div class="result-metrics">
                    <div class="metric">
                        <span class="metric-label">Latency</span>
                        <span class="metric-value">${result.metrics.latency}ms</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Tokens/sec</span>
                        <span class="metric-value">${result.metrics.tokensPerSec}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Cost/1K</span>
                        <span class="metric-value">$${result.metrics.costPer1K}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">Quality</span>
                        <span class="metric-value quality-score">${result.metrics.quality}%</span>
                    </div>
                </div>
            </div>`;
        });

        html += '</div>';

        // Evaluation criteria
        html += `<div class="evaluation-criteria">
            <h5>Evaluation Criteria (${config.name})</h5>
            <div class="criteria-list">
                ${config.evaluationCriteria.map(c => `<span class="criterion">${c}</span>`).join('')}
            </div>
        </div>`;

        container.innerHTML = html;
        this.state.results = results;
    },

    clearResults() {
        const container = document.getElementById('arena-results');
        if (container) {
            container.innerHTML = '<div class="no-results">Select models and run comparison</div>';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => ModelArena.init());
window.ModelArena = ModelArena;
