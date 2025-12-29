/* ============================================
   SLM Command Center - Infrastructure Recommender
   Intelligent Model + GPU + Platform recommendations
   ============================================ */

const InfraRecommender = {
    // Configuration options
    options: {
        industries: [
            { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
            { id: 'financial', name: 'Financial Services', icon: '💰' },
            { id: 'retail', name: 'Retail/E-commerce', icon: '🛒' },
            { id: 'legal', name: 'Legal', icon: '⚖️' },
            { id: 'customer-service', name: 'Customer Service', icon: '💬' },
            { id: 'general', name: 'General Purpose', icon: '🎯' }
        ],
        useCases: [
            { id: 'chatbot', name: 'Chatbot/Assistant', icon: '💬' },
            { id: 'rag', name: 'RAG/Document Q&A', icon: '📄' },
            { id: 'code', name: 'Code Generation', icon: '💻' },
            { id: 'summarization', name: 'Summarization', icon: '📝' },
            { id: 'classification', name: 'Classification', icon: '🏷️' },
            { id: 'extraction', name: 'Data Extraction', icon: '🔍' }
        ],
        volumes: [
            { id: 'low', name: '< 10K/day', queries: 5000 },
            { id: 'medium', name: '10K-100K/day', queries: 50000 },
            { id: 'high', name: '100K-1M/day', queries: 500000 },
            { id: 'enterprise', name: '1M+/day', queries: 2000000 }
        ],
        latencyReqs: [
            { id: 'realtime', name: '< 100ms', ms: 100 },
            { id: 'interactive', name: '< 500ms', ms: 500 },
            { id: 'standard', name: '< 2s', ms: 2000 },
            { id: 'batch', name: 'Batch OK', ms: 30000 }
        ],
        compliance: [
            { id: 'hipaa', name: 'HIPAA' },
            { id: 'soc2', name: 'SOC 2' },
            { id: 'gdpr', name: 'GDPR' },
            { id: 'pci', name: 'PCI-DSS' },
            { id: 'none', name: 'None Required' }
        ],
        budgets: [
            { id: 'startup', name: '< $2K/mo', max: 2000 },
            { id: 'growth', name: '$2K-10K/mo', max: 10000 },
            { id: 'enterprise', name: '$10K-50K/mo', max: 50000 },
            { id: 'unlimited', name: '$50K+/mo', max: 100000 }
        ]
    },
    
    // Model database
    models: [
        { id: 'mistral-7b', name: 'Mistral 7B', params: '7B', vram: 14, strengths: ['rag', 'chatbot', 'general'], quality: 8.5 },
        { id: 'phi-3-mini', name: 'Phi-3.5 Mini', params: '3.8B', vram: 8, strengths: ['code', 'extraction', 'classification'], quality: 8.2 },
        { id: 'llama-3.2-3b', name: 'Llama 3.2 3B', params: '3B', vram: 6, strengths: ['chatbot', 'summarization', 'classification'], quality: 7.8 },
        { id: 'llama-3.2-1b', name: 'Llama 3.2 1B', params: '1B', vram: 2, strengths: ['classification', 'extraction'], quality: 7.0 },
        { id: 'qwen-2.5-7b', name: 'Qwen 2.5 7B', params: '7B', vram: 14, strengths: ['code', 'rag', 'summarization'], quality: 8.4 },
        { id: 'gemma-2-9b', name: 'Gemma 2 9B', params: '9B', vram: 18, strengths: ['chatbot', 'rag', 'general'], quality: 8.3 }
    ],
    
    // GPU database
    gpus: [
        { id: 'a10g', name: 'NVIDIA A10G', vram: 24, costHr: 1.21, instance: 'g5.2xlarge', provider: 'AWS', throughput: 50 },
        { id: 'a10g-xl', name: 'NVIDIA A10G', vram: 24, costHr: 1.01, instance: 'g5.xlarge', provider: 'AWS', throughput: 40 },
        { id: 't4', name: 'NVIDIA T4', vram: 16, costHr: 0.53, instance: 'g4dn.xlarge', provider: 'AWS', throughput: 25 },
        { id: 'l4', name: 'NVIDIA L4', vram: 24, costHr: 0.84, instance: 'g2-standard-4', provider: 'GCP', throughput: 55 },
        { id: 'a100-40', name: 'NVIDIA A100 40GB', vram: 40, costHr: 3.67, instance: 'p4d.24xlarge', provider: 'AWS', throughput: 120 },
        { id: 'inf2', name: 'AWS Inferentia2', vram: 32, costHr: 0.76, instance: 'inf2.xlarge', provider: 'AWS', throughput: 60 }
    ],
    
    // Platform options
    platforms: [
        { id: 'ec2', name: 'Amazon EC2', complexity: 'low', scaling: 'manual', bestFor: 'Simple deployments' },
        { id: 'sagemaker', name: 'Amazon SageMaker', complexity: 'low', scaling: 'auto', bestFor: 'Managed MLOps' },
        { id: 'eks', name: 'Amazon EKS', complexity: 'high', scaling: 'advanced', bestFor: 'Multi-model, microservices' },
        { id: 'gke', name: 'Google GKE', complexity: 'high', scaling: 'advanced', bestFor: 'Multi-cloud, GPU sharing' }
    ],
    
    // Current selections
    selections: {
        industry: null,
        useCase: null,
        volume: null,
        latency: null,
        compliance: [],
        budget: null
    },
    
    // State
    state: {
        isProcessing: false,
        recommendation: null
    },
    
    // Initialize
    init() {
        this.renderForm();
        this.bindEvents();
        this.updateFormProgress();
    },
    
    // Render form
    renderForm() {
        this.renderOptionGroup('industry', 'industries');
        this.renderOptionGroup('useCase', 'useCases');
        this.renderOptionGroup('volume', 'volumes');
        this.renderOptionGroup('latency', 'latencyReqs');
        this.renderComplianceOptions();
        this.renderOptionGroup('budget', 'budgets');
    },
    
    // Render option group
    renderOptionGroup(selectionKey, optionsKey) {
        const container = document.getElementById(`${selectionKey}-options`);
        if (!container) return;
        
        const options = this.options[optionsKey];
        
        container.innerHTML = options.map(opt => `
            <button class="option-btn ${this.selections[selectionKey] === opt.id ? 'selected' : ''}" 
                    data-selection="${selectionKey}" 
                    data-value="${opt.id}">
                ${opt.icon ? `<span class="option-icon">${opt.icon}</span>` : ''}
                <span class="option-name">${opt.name}</span>
            </button>
        `).join('');
    },
    
    // Render compliance options
    renderComplianceOptions() {
        const container = document.getElementById('compliance-options');
        if (!container) return;
        
        container.innerHTML = this.options.compliance.map(opt => `
            <button class="option-btn ${this.selections.compliance.includes(opt.id) ? 'selected' : ''}" 
                    data-selection="compliance" 
                    data-value="${opt.id}">
                <span class="option-name">${opt.name}</span>
            </button>
        `).join('');
    },
    
    // Bind events
    bindEvents() {
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const selection = btn.dataset.selection;
                const value = btn.dataset.value;
                this.handleSelection(selection, value);
            });
        });
        
        const generateBtn = document.getElementById('generate-recommendation');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateRecommendation());
        }
        
        const resetBtn = document.getElementById('reset-form');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetForm());
        }
    },
    
    // Handle selection
    handleSelection(key, value) {
        if (key === 'compliance') {
            if (value === 'none') {
                this.selections.compliance = ['none'];
            } else {
                this.selections.compliance = this.selections.compliance.filter(c => c !== 'none');
                const index = this.selections.compliance.indexOf(value);
                if (index > -1) {
                    this.selections.compliance.splice(index, 1);
                } else {
                    this.selections.compliance.push(value);
                }
            }
            this.renderComplianceOptions();
        } else {
            this.selections[key] = value;
            this.renderOptionGroup(key, key === 'useCase' ? 'useCases' : key === 'latency' ? 'latencyReqs' : key + 's');
        }
        
        this.bindEvents();
        this.updateFormProgress();
    },
    
    // Update form progress
    updateFormProgress() {
        const required = ['industry', 'useCase', 'volume', 'latency', 'budget'];
        const completed = required.filter(key => this.selections[key] !== null).length;
        const progress = (completed / required.length) * 100;
        
        const progressBar = document.getElementById('form-progress');
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        
        const generateBtn = document.getElementById('generate-recommendation');
        if (generateBtn) {
            generateBtn.disabled = progress < 100;
            generateBtn.style.opacity = progress < 100 ? '0.5' : '1';
        }
    },
    
    // Generate recommendation
    async generateRecommendation() {
        if (this.state.isProcessing) return;
        this.state.isProcessing = true;
        
        const resultContainer = document.getElementById('recommendation-result');
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div class="thinking-animation">
                    <div class="spinner"></div>
                    <p class="thinking-text">Analyzing requirements...</p>
                    <div class="thinking-steps" id="thinking-steps"></div>
                </div>
            `;
        }
        
        const steps = [
            'Analyzing requirements',
            'Evaluating models',
            'Calculating costs',
            'Optimizing latency',
            'Checking compliance',
            'Finalizing'
        ];
        
        for (let i = 0; i < steps.length; i++) {
            await Utils.sleep(500);
            const stepsContainer = document.getElementById('thinking-steps');
            const thinkingText = document.querySelector('.thinking-text');
            
            if (thinkingText) thinkingText.textContent = steps[i] + '...';
            
            if (stepsContainer) {
                const step = document.createElement('span');
                step.className = 'thinking-step';
                step.textContent = steps[i];
                step.style.animationDelay = `${i * 0.1}s`;
                stepsContainer.appendChild(step);
                setTimeout(() => step.classList.add('active'), 200);
            }
        }
        
        await Utils.sleep(300);
        
        const recommendation = this.calculateRecommendation();
        this.state.recommendation = recommendation;
        this.renderRecommendation(recommendation);
        this.state.isProcessing = false;
        
        Toast.success('Recommendation generated!');
    },
    
    // Calculate recommendation
    calculateRecommendation() {
        const { industry, useCase, volume, latency, compliance, budget } = this.selections;
        
        const volumeData = this.options.volumes.find(v => v.id === volume);
        const latencyData = this.options.latencyReqs.find(l => l.id === latency);
        const budgetData = this.options.budgets.find(b => b.id === budget);
        
        // Score models
        const modelScores = this.models.map(model => {
            let score = model.quality * 10;
            if (model.strengths.includes(useCase)) score += 20;
            if (latency === 'realtime' && model.vram <= 8) score += 15;
            return { ...model, score };
        }).sort((a, b) => b.score - a.score);
        
        const recommendedModel = modelScores[0];
        
        // Select GPU
        const suitableGPUs = this.gpus.filter(gpu => 
            gpu.vram >= recommendedModel.vram &&
            gpu.costHr * 730 <= budgetData.max
        ).sort((a, b) => (b.throughput / b.costHr) - (a.throughput / a.costHr));
        
        const recommendedGPU = suitableGPUs[0] || this.gpus[0];
        
        // Select platform
        let recommendedPlatform;
        if (volume === 'enterprise' || compliance.includes('hipaa') || compliance.includes('pci')) {
            recommendedPlatform = this.platforms.find(p => p.id === 'eks');
        } else if (volume === 'high') {
            recommendedPlatform = this.platforms.find(p => p.id === 'sagemaker');
        } else {
            recommendedPlatform = this.platforms.find(p => p.id === 'ec2');
        }
        
        // Calculate costs
        const instancesNeeded = Math.max(1, Math.ceil(volumeData.queries / (recommendedGPU.throughput * 3600 * 24)));
        const monthlyCost = recommendedGPU.costHr * 730 * instancesNeeded;
        const costPerQuery = monthlyCost / (volumeData.queries * 30);
        const gpt4CostPerQuery = 0.03;
        const savingsPercent = ((gpt4CostPerQuery - costPerQuery) / gpt4CostPerQuery * 100).toFixed(0);
        
        return {
            model: recommendedModel,
            gpu: recommendedGPU,
            platform: recommendedPlatform,
            instances: instancesNeeded,
            monthlyCost: monthlyCost,
            costPerQuery: costPerQuery,
            savingsPercent: savingsPercent,
            estimatedLatency: Math.round(1000 / recommendedGPU.throughput),
            throughput: recommendedGPU.throughput * instancesNeeded
        };
    },
    
    // Render recommendation
    renderRecommendation(rec) {
        const container = document.getElementById('recommendation-result');
        if (!container) return;
        
        container.innerHTML = `
            <div class="recommendation-card animate-fade-in">
                <div class="recommendation-header">
                    <h3 class="recommendation-title">🎯 Recommended Configuration</h3>
                    <p class="recommendation-subtitle">Optimized for your ${this.selections.industry} ${this.selections.useCase} workload</p>
                </div>
                
                <div class="recommendation-body">
                    <div class="rec-item">
                        <div class="rec-item-icon">🤖</div>
                        <div class="rec-item-content">
                            <div class="rec-item-label">Recommended Model</div>
                            <div class="rec-item-value">${rec.model.name}</div>
                            <div class="rec-item-detail">${rec.model.params} parameters • Quality Score: ${rec.model.quality}/10</div>
                        </div>
                    </div>
                    
                    <div class="rec-item">
                        <div class="rec-item-icon">⚡</div>
                        <div class="rec-item-content">
                            <div class="rec-item-label">GPU / Instance</div>
                            <div class="rec-item-value">${rec.gpu.name}</div>
                            <div class="rec-item-detail">${rec.gpu.instance} • ${rec.gpu.vram}GB VRAM • $${rec.gpu.costHr}/hr</div>
                        </div>
                    </div>
                    
                    <div class="rec-item">
                        <div class="rec-item-icon">☁️</div>
                        <div class="rec-item-content">
                            <div class="rec-item-label">Deployment Platform</div>
                            <div class="rec-item-value">${rec.platform.name}</div>
                            <div class="rec-item-detail">${rec.platform.bestFor} • ${rec.platform.scaling} scaling</div>
                        </div>
                    </div>
                    
                    <div class="rec-item">
                        <div class="rec-item-icon">📊</div>
                        <div class="rec-item-content">
                            <div class="rec-item-label">Recommended Scale</div>
                            <div class="rec-item-value">${rec.instances} Instance${rec.instances > 1 ? 's' : ''}</div>
                            <div class="rec-item-detail">${rec.throughput} queries/sec capacity</div>
                        </div>
                    </div>
                </div>
                
                <div class="cost-comparison-row">
                    <div>
                        <div class="cost-label">Estimated Monthly Cost</div>
                        <div class="cost-monthly">$${rec.monthlyCost.toFixed(0)}/mo</div>
                    </div>
                    <div class="text-right">
                        <div class="cost-label">vs GPT-4 API</div>
                        <div class="cost-savings">Save ${rec.savingsPercent}%</div>
                    </div>
                </div>
                
                <div class="live-metrics">
                    <div class="live-metric">
                        <div class="live-metric-value">${rec.estimatedLatency}ms</div>
                        <div class="live-metric-label">Est. Latency</div>
                    </div>
                    <div class="live-metric">
                        <div class="live-metric-value">${rec.throughput}</div>
                        <div class="live-metric-label">Queries/sec</div>
                    </div>
                    <div class="live-metric">
                        <div class="live-metric-value">$${(rec.costPerQuery * 1000).toFixed(4)}</div>
                        <div class="live-metric-label">Cost/1K Queries</div>
                    </div>
                </div>
                
                <div style="padding: 1.5rem; display: flex; gap: 1rem;">
                    <button class="btn btn-primary" onclick="InfraRecommender.exportConfig()">
                        📥 Export Configuration
                    </button>
                    <button class="btn btn-outline" onclick="InfraRecommender.scheduleDemo()">
                        📅 Schedule Demo
                    </button>
                </div>
            </div>
        `;
    },
    
    // Export configuration
    exportConfig() {
        if (!this.state.recommendation) return;
        
        const config = {
            generated_at: new Date().toISOString(),
            inputs: this.selections,
            recommendation: {
                model: this.state.recommendation.model.name,
                model_params: this.state.recommendation.model.params,
                gpu: this.state.recommendation.gpu.name,
                instance_type: this.state.recommendation.gpu.instance,
                platform: this.state.recommendation.platform.name,
                instance_count: this.state.recommendation.instances,
                estimated_monthly_cost: this.state.recommendation.monthlyCost,
                estimated_latency_ms: this.state.recommendation.estimatedLatency,
                throughput_qps: this.state.recommendation.throughput
            }
        };
        
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `slm-config-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        Toast.success('Configuration exported!');
    },
    
    // Schedule demo
    scheduleDemo() {
        Toast.info('Contact sales@shellkode.com to schedule a demo');
    },
    
    // Reset form
    resetForm() {
        this.selections = { industry: null, useCase: null, volume: null, latency: null, compliance: [], budget: null };
        this.state.recommendation = null;
        this.renderForm();
        this.bindEvents();
        this.updateFormProgress();
        
        const resultContainer = document.getElementById('recommendation-result');
        if (resultContainer) {
            resultContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--color-text-light);">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
                    <p>Complete the form to get your personalized infrastructure recommendation</p>
                </div>
            `;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => InfraRecommender.init());
window.InfraRecommender = InfraRecommender;
