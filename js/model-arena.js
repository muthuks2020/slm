/* ============================================
   SLM Command Center - Model Arena Module
   Side-by-side model comparison
   ============================================ */

const ModelArena = {
    // Available models
    models: [
        {
            id: 'mistral-7b',
            name: 'Mistral 7B',
            params: '7B',
            quantization: 'FP16',
            avgLatency: 120,
            tokensPerSec: 52,
            costPer1K: 0.0004,
            strengths: ['General purpose', 'RAG', 'Code'],
            color: '#146eb4'
        },
        {
            id: 'phi-3-mini',
            name: 'Phi-3.5 Mini',
            params: '3.8B',
            quantization: 'FP16',
            avgLatency: 85,
            tokensPerSec: 78,
            costPer1K: 0.0003,
            strengths: ['Code', 'Reasoning', 'Edge'],
            color: '#4daae8'
        },
        {
            id: 'llama-3.2',
            name: 'Llama 3.2 3B',
            params: '3B',
            quantization: 'INT4',
            avgLatency: 65,
            tokensPerSec: 95,
            costPer1K: 0.0002,
            strengths: ['Mobile', 'Agents', 'Speed'],
            color: '#10b981'
        },
        {
            id: 'qwen-2.5',
            name: 'Qwen 2.5 7B',
            params: '7B',
            quantization: 'FP16',
            avgLatency: 130,
            tokensPerSec: 48,
            costPer1K: 0.0004,
            strengths: ['Multilingual', 'Code', 'Long context'],
            color: '#f59e0b'
        }
    ],
    
    // Selected models for comparison
    selectedModels: ['mistral-7b', 'phi-3-mini', 'llama-3.2'],
    
    // Quantization options
    quantOptions: ['FP16', 'INT8', 'INT4'],
    currentQuant: 'FP16',
    
    // State
    state: {
        isRunning: false,
        currentQuery: '',
        results: [],
        comparisonHistory: []
    },
    
    // Sample responses for demo
    sampleResponses: {
        'mistral-7b': {
            default: `Small Language Models (SLMs) offer compelling advantages for enterprise deployments. They provide significant cost savings—typically 3-23x lower than frontier models like GPT-4. SLMs enable complete data sovereignty, keeping sensitive data within your infrastructure. They're highly customizable through fine-tuning on domain-specific data, and offer predictable, fixed infrastructure costs without surprise API bills.

Key considerations include model selection based on your specific use case, proper quantization for optimal performance-cost tradeoffs, and establishing robust evaluation metrics before deployment.`,
            code: `Here's a Python implementation for connecting to a vLLM endpoint:

\`\`\`python
import openai

client = openai.OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="not-needed"
)

response = client.chat.completions.create(
    model="mistral-7b",
    messages=[{"role": "user", "content": "Hello"}],
    temperature=0.7,
    max_tokens=256
)
print(response.choices[0].message.content)
\`\`\``
        },
        'phi-3-mini': {
            default: `SLMs deliver enterprise value through three key dimensions:

1. **Economics**: Self-hosted inference costs ~$0.0003-0.0005 per 1K tokens versus $5-20 for frontier APIs. ROI typically achieved within 3-6 months.

2. **Control**: Full ownership of model weights, deployment configuration, and data handling. No vendor lock-in or rate limiting.

3. **Compliance**: Data never leaves your VPC. Essential for HIPAA, SOC2, GDPR, and financial regulations.

For implementation, I recommend starting with a proof-of-concept on AWS g5.xlarge instances using vLLM for inference optimization.`,
            code: `Efficient vLLM setup with quantization:

\`\`\`python
from vllm import LLM, SamplingParams

# Initialize with INT4 quantization
llm = LLM(
    model="microsoft/phi-3-mini-4k-instruct",
    quantization="awq",
    gpu_memory_utilization=0.90
)

params = SamplingParams(
    temperature=0.7,
    max_tokens=512
)

outputs = llm.generate(["Your prompt"], params)
\`\`\``
        },
        'llama-3.2': {
            default: `Enterprise SLM benefits:

• Cost efficiency: 90%+ savings vs API providers
• Data privacy: On-premise deployment
• Customization: Domain fine-tuning capability
• Latency: Sub-100ms response times
• Reliability: No external dependencies

Llama 3.2 specifically excels at agent workflows and mobile deployments due to its optimized architecture for lower parameter counts.`,
            code: `Quick Llama 3.2 setup:

\`\`\`python
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3.2-3B-Instruct",
    torch_dtype=torch.float16,
    device_map="auto"
)
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-3B-Instruct")

inputs = tokenizer("Hello!", return_tensors="pt").to("cuda")
outputs = model.generate(**inputs, max_new_tokens=100)
\`\`\``
        },
        'qwen-2.5': {
            default: `From a multilingual and long-context perspective, SLMs provide exceptional value:

**Multilingual Support**: Qwen 2.5 natively handles 29+ languages with consistent quality, crucial for global enterprises.

**Extended Context**: 128K token context window enables processing of lengthy documents, contracts, and codebases without chunking.

**Cost Structure**: Self-hosted deployment eliminates per-token API costs, replacing with predictable infrastructure spend of ~$1,500-3,000/month.

**Compliance**: Local deployment ensures data residency requirements are met for international regulations.`,
            code: `Qwen 2.5 with extended context:

\`\`\`python
from transformers import AutoModelForCausalLM, AutoTokenizer

model = AutoModelForCausalLM.from_pretrained(
    "Qwen/Qwen2.5-7B-Instruct",
    torch_dtype="auto",
    device_map="auto",
    attn_implementation="flash_attention_2"
)

# Supports up to 128K context
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-7B-Instruct")
\`\`\``
        }
    },
    
    // Initialize module
    init() {
        this.renderModelSelector();
        this.renderArena();
        this.bindEvents();
    },
    
    // Render model selector
    renderModelSelector() {
        const container = document.getElementById('model-selector');
        if (!container) return;
        
        container.innerHTML = this.models.map(model => `
            <label class="model-checkbox ${this.selectedModels.includes(model.id) ? 'selected' : ''}" data-model="${model.id}">
                <input type="checkbox" ${this.selectedModels.includes(model.id) ? 'checked' : ''}>
                <span class="model-checkbox-label">
                    <span class="model-checkbox-name">${model.name}</span>
                    <span class="model-checkbox-params">${model.params}</span>
                </span>
            </label>
        `).join('');
    },
    
    // Render arena
    renderArena() {
        const container = document.getElementById('arena-grid');
        if (!container) return;
        
        const selectedModelData = this.models.filter(m => this.selectedModels.includes(m.id));
        
        container.innerHTML = selectedModelData.map(model => `
            <div class="arena-model-card" data-model="${model.id}">
                <div class="arena-model-header">
                    <div class="arena-model-name">${model.name}</div>
                    <span class="arena-model-badge">${model.params}</span>
                </div>
                <div class="arena-model-response" id="response-${model.id}">
                    <span class="text-muted">Response will appear here...</span>
                </div>
                <div class="arena-model-metrics">
                    <div class="arena-metric">
                        <div class="arena-metric-value" id="latency-${model.id}">--</div>
                        <div class="arena-metric-label">Latency (ms)</div>
                    </div>
                    <div class="arena-metric">
                        <div class="arena-metric-value" id="tokens-${model.id}">--</div>
                        <div class="arena-metric-label">Tokens/sec</div>
                    </div>
                    <div class="arena-metric">
                        <div class="arena-metric-value" id="cost-${model.id}">--</div>
                        <div class="arena-metric-label">Cost/1K</div>
                    </div>
                    <div class="arena-metric">
                        <div class="arena-metric-value" id="quality-${model.id}">--</div>
                        <div class="arena-metric-label">Quality</div>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    // Bind events
    bindEvents() {
        // Model checkboxes
        document.querySelectorAll('.model-checkbox input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const modelId = e.target.closest('.model-checkbox').dataset.model;
                this.toggleModel(modelId, e.target.checked);
            });
        });
        
        // Run comparison button
        const runBtn = document.getElementById('run-arena-btn');
        if (runBtn) {
            runBtn.addEventListener('click', () => this.runComparison());
        }
        
        // Query input
        const queryInput = document.getElementById('arena-query');
        if (queryInput) {
            queryInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.runComparison();
            });
        }
        
        // Quantization toggle
        document.querySelectorAll('.quant-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setQuantization(e.target.dataset.quant);
            });
        });
        
        // Sample query buttons
        document.querySelectorAll('.sample-arena-query').forEach(btn => {
            btn.addEventListener('click', () => {
                const queryInput = document.getElementById('arena-query');
                if (queryInput) {
                    queryInput.value = btn.dataset.query;
                    this.runComparison();
                }
            });
        });
    },
    
    // Toggle model selection
    toggleModel(modelId, selected) {
        if (selected) {
            if (this.selectedModels.length < 4) {
                this.selectedModels.push(modelId);
            } else {
                Toast.warning('Maximum 4 models can be compared');
                return;
            }
        } else {
            if (this.selectedModels.length > 1) {
                this.selectedModels = this.selectedModels.filter(id => id !== modelId);
            } else {
                Toast.warning('At least 1 model must be selected');
                return;
            }
        }
        
        this.renderModelSelector();
        this.renderArena();
        this.bindEvents();
    },
    
    // Set quantization
    setQuantization(quant) {
        this.currentQuant = quant;
        
        document.querySelectorAll('.quant-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.quant === quant);
        });
        
        Toast.info(`Quantization set to ${quant}`);
    },
    
    // Run comparison
    async runComparison() {
        if (this.state.isRunning) return;
        
        const queryInput = document.getElementById('arena-query');
        const query = queryInput?.value.trim() || 'What are the benefits of using Small Language Models for enterprise?';
        
        this.state.isRunning = true;
        this.state.currentQuery = query;
        
        // Reset all panels
        this.selectedModels.forEach(modelId => {
            const responseEl = document.getElementById(`response-${modelId}`);
            if (responseEl) {
                responseEl.innerHTML = '<div class="spinner" style="width: 32px; height: 32px; margin: 20px auto;"></div>';
            }
        });
        
        // Run all models in parallel with staggered starts
        const promises = this.selectedModels.map((modelId, index) => 
            this.runModel(modelId, query, index * 200)
        );
        
        await Promise.all(promises);
        
        // Determine winner
        this.highlightWinner();
        
        this.state.isRunning = false;
        Toast.success('Comparison complete!');
    },
    
    // Run single model
    async runModel(modelId, query, delay) {
        await Utils.sleep(delay);
        
        const model = this.models.find(m => m.id === modelId);
        const responseEl = document.getElementById(`response-${modelId}`);
        const latencyEl = document.getElementById(`latency-${modelId}`);
        const tokensEl = document.getElementById(`tokens-${modelId}`);
        const costEl = document.getElementById(`cost-${modelId}`);
        const qualityEl = document.getElementById(`quality-${modelId}`);
        
        if (!model || !responseEl) return;
        
        // Determine response type
        const isCodeQuery = query.toLowerCase().includes('code') || query.toLowerCase().includes('implement');
        const responseKey = isCodeQuery ? 'code' : 'default';
        const response = this.sampleResponses[modelId]?.[responseKey] || this.sampleResponses[modelId]?.default || 'Response generated successfully.';
        
        // Simulate typing with metrics update
        const startTime = performance.now();
        responseEl.innerHTML = '';
        
        // Adjust speed based on quantization
        const quantMultiplier = this.currentQuant === 'FP16' ? 1 : this.currentQuant === 'INT8' ? 1.3 : 1.6;
        const typeSpeed = Math.round(15 / quantMultiplier);
        
        // Calculate metrics
        const baseLatency = model.avgLatency / quantMultiplier;
        const baseTokens = model.tokensPerSec * quantMultiplier;
        const baseCost = model.costPer1K / quantMultiplier;
        
        // Simulate response streaming
        let currentText = '';
        for (let i = 0; i < response.length; i++) {
            currentText += response[i];
            responseEl.innerHTML = this.formatResponse(currentText);
            
            // Update metrics periodically
            if (i % 20 === 0) {
                const elapsed = performance.now() - startTime;
                const jitter = 0.8 + Math.random() * 0.4;
                
                latencyEl.textContent = Math.round(baseLatency * jitter);
                tokensEl.textContent = Math.round(baseTokens * jitter);
                costEl.textContent = '$' + (baseCost * jitter).toFixed(4);
            }
            
            await Utils.sleep(typeSpeed);
        }
        
        // Final metrics
        const qualityScore = this.calculateQualityScore(modelId, response);
        latencyEl.textContent = Math.round(baseLatency + Math.random() * 20);
        tokensEl.textContent = Math.round(baseTokens + Math.random() * 10);
        costEl.textContent = '$' + baseCost.toFixed(4);
        qualityEl.textContent = qualityScore.toFixed(1);
        
        // Store result
        this.state.results.push({
            modelId,
            latency: parseFloat(latencyEl.textContent),
            tokens: parseFloat(tokensEl.textContent),
            cost: parseFloat(costEl.textContent.replace('$', '')),
            quality: qualityScore
        });
    },
    
    // Format response with code highlighting
    formatResponse(text) {
        return text
            .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="code-block"><code>$2</code></pre>')
            .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');
    },
    
    // Calculate quality score
    calculateQualityScore(modelId, response) {
        // Base scores by model
        const baseScores = {
            'mistral-7b': 8.5,
            'phi-3-mini': 8.2,
            'llama-3.2': 7.8,
            'qwen-2.5': 8.4
        };
        
        const base = baseScores[modelId] || 7.5;
        const variation = (Math.random() - 0.5) * 0.8;
        
        return Math.min(10, Math.max(5, base + variation));
    },
    
    // Highlight winner
    highlightWinner() {
        if (this.state.results.length === 0) return;
        
        // Calculate composite score (higher is better)
        const scores = this.state.results.map(r => ({
            modelId: r.modelId,
            score: (r.quality * 10) + (100 / r.latency) + (r.tokens / 10) - (r.cost * 1000)
        }));
        
        const winner = scores.reduce((a, b) => a.score > b.score ? a : b);
        
        // Highlight winner card
        document.querySelectorAll('.arena-model-card').forEach(card => {
            card.classList.remove('winner');
            if (card.dataset.model === winner.modelId) {
                card.classList.add('winner');
            }
        });
        
        // Clear results for next run
        this.state.results = [];
    }
};

// Additional styles
const arenaStyles = document.createElement('style');
arenaStyles.textContent = `
    .model-checkbox {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: var(--color-background);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 2px solid transparent;
    }
    .model-checkbox:hover {
        background: white;
    }
    .model-checkbox.selected {
        border-color: var(--color-primary);
        background: rgba(20, 110, 180, 0.05);
    }
    .model-checkbox input {
        display: none;
    }
    .model-checkbox-name {
        font-weight: 600;
        font-size: 0.9rem;
    }
    .model-checkbox-params {
        font-size: 0.75rem;
        color: var(--color-text-light);
    }
    .code-block {
        background: #1a1a2e;
        color: #4daae8;
        padding: 12px;
        border-radius: 8px;
        overflow-x: auto;
        font-family: var(--font-mono);
        font-size: 0.85rem;
        margin: 8px 0;
    }
    .inline-code {
        background: rgba(77, 170, 232, 0.1);
        color: var(--color-primary);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: var(--font-mono);
        font-size: 0.85em;
    }
`;
document.head.appendChild(arenaStyles);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ModelArena.init();
});

window.ModelArena = ModelArena;
