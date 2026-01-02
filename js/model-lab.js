/**
 * Model Development Lab - ShellKode SLM Command Center
 * Demonstrates SLM building capabilities
 */

// Technique Details Data
const techniqueDetails = {
    lora: {
        title: 'LoRA Fine-Tuning (Low-Rank Adaptation)',
        description: 'LoRA injects trainable low-rank matrices into transformer layers, enabling efficient fine-tuning with minimal additional parameters.',
        benefits: [
            'Only 0.1-1% of parameters trained (vs 100% for full fine-tuning)',
            'Preserves base model capabilities while adding domain knowledge',
            'Multiple LoRA adapters can be hot-swapped at inference time',
            'Training on single GPU (24GB VRAM) for 7B models'
        ],
        useCases: [
            'Domain adaptation (medical, legal, financial terminology)',
            'Task-specific fine-tuning (summarization, extraction, classification)',
            'Style and tone customization',
            'Multi-tenant deployments with different adapters'
        ],
        specs: {
            'Typical Rank': 'r=8 to r=64',
            'Alpha': 'Usually 2x rank',
            'Target Modules': 'q_proj, v_proj, k_proj, o_proj',
            'Training Time': '2-8 hours for 10K examples',
            'VRAM Required': '16-24GB for 7B model'
        }
    },
    qlora: {
        title: 'QLoRA (Quantized LoRA)',
        description: 'QLoRA combines 4-bit quantization with LoRA, enabling fine-tuning of large models on consumer hardware.',
        benefits: [
            'Fine-tune 7B models on 8GB VRAM GPUs',
            'Near-identical quality to full LoRA',
            '4-bit NormalFloat quantization preserves information',
            'Paged optimizers prevent OOM errors'
        ],
        useCases: [
            'Resource-constrained environments',
            'Rapid prototyping and experimentation',
            'Edge deployment preparation',
            'Cost-effective training on smaller GPUs'
        ],
        specs: {
            'Quantization': '4-bit NormalFloat (NF4)',
            'Compute Type': 'bfloat16 / float16',
            'VRAM Required': '6-12GB for 7B model',
            'Training Time': '3-10 hours for 10K examples',
            'Quality Loss': '<1% vs full precision'
        }
    },
    distillation: {
        title: 'Knowledge Distillation',
        description: 'Transfer knowledge from a large "teacher" model to a smaller "student" model, maintaining capability while reducing size.',
        benefits: [
            'Compress 70B model knowledge into 7B model',
            '10-100x inference speedup',
            'Deploy on edge devices and mobile',
            'Reduce serving costs dramatically'
        ],
        useCases: [
            'Edge deployment for offline inference',
            'Mobile and embedded applications',
            'High-throughput, low-latency APIs',
            'Cost optimization for production'
        ],
        specs: {
            'Teacher Model': 'GPT-4, Claude, Llama 70B',
            'Student Model': '1B-7B parameters',
            'Data Required': '100K-1M examples',
            'Training Time': '1-7 days',
            'Size Reduction': '10-70x smaller'
        }
    },
    rlhf: {
        title: 'RLHF (Reinforcement Learning from Human Feedback)',
        description: 'Align model outputs with human preferences using reward models and PPO/DPO training.',
        benefits: [
            'Improved safety and helpfulness',
            'Reduced harmful/toxic outputs',
            'Better instruction following',
            'Aligned with organizational values'
        ],
        useCases: [
            'Customer-facing chatbots',
            'Content moderation systems',
            'Enterprise assistants with brand voice',
            'Compliance-critical applications'
        ],
        specs: {
            'Method': 'DPO (Direct Preference Optimization)',
            'Data Required': '5K-50K preference pairs',
            'Training Stages': 'SFT → Reward Model → PPO/DPO',
            'Compute': 'Multi-GPU recommended',
            'Human Labeling': 'Required for preference data'
        }
    },
    continued: {
        title: 'Continued Pre-training',
        description: 'Extend base model training on domain-specific corpora to inject deep specialized knowledge.',
        benefits: [
            'Deepest domain knowledge integration',
            'Model "speaks" domain language natively',
            'Better than fine-tuning for specialized domains',
            'Improved few-shot performance'
        ],
        useCases: [
            'Highly specialized domains (biomedical, legal, scientific)',
            'Proprietary knowledge bases',
            'Non-English language adaptation',
            'Industry-specific terminology'
        ],
        specs: {
            'Data Required': '1B-100B tokens',
            'Compute': 'Multi-GPU / TPU cluster',
            'Training Time': 'Days to weeks',
            'Cost': '$10K-$100K+ in compute',
            'Best For': 'Large organizations with unique data'
        }
    },
    merging: {
        title: 'Model Merging',
        description: 'Combine multiple fine-tuned models into a single model that inherits capabilities from all sources.',
        benefits: [
            'No additional training required',
            'Combine specialists into generalist',
            'Preserve best aspects of each model',
            'Fast experimentation'
        ],
        useCases: [
            'Multi-task models from single-task specialists',
            'Combining domain adapters',
            'A/B testing model combinations',
            'Ensemble-like performance without ensemble cost'
        ],
        specs: {
            'Methods': 'SLERP, TIES, DARE, Linear',
            'Compute': 'CPU sufficient',
            'Time': 'Minutes',
            'Models Required': '2-5 fine-tuned variants',
            'Risk': 'Quality degradation possible'
        }
    }
};

// Training outputs by domain
const domainOutputs = {
    healthcare: {
        before: {
            query: 'Summarize this patient encounter and suggest ICD-10 codes.',
            output: 'The patient came in with chest pain. They might have heart problems. The doctor did some tests. I would suggest looking up heart-related codes.',
            accuracy: 67
        },
        after: {
            output: '<strong>Clinical Summary:</strong> 58 y/o male presenting with acute substernal chest pain radiating to left arm, onset 2 hours prior. Troponin elevated at 0.8 ng/mL. ECG shows ST elevation in leads V1-V4. Impression: STEMI, anterior wall.\n\n<strong>ICD-10 Codes:</strong>\n• I21.0 - ST elevation myocardial infarction of anterior wall\n• R07.9 - Chest pain, unspecified\n• I25.10 - Atherosclerotic heart disease',
            accuracy: 94,
            modelName: 'SK-Clinical-7B'
        }
    },
    finance: {
        before: {
            query: 'Analyze the risk factors in this SEC 10-K filing excerpt.',
            output: 'This company has some risks. They mention competition and market conditions. There might be issues with their business. You should be careful about investing.',
            accuracy: 62
        },
        after: {
            output: '<strong>Risk Analysis Summary:</strong>\n\n<strong>1. Market Risk (High):</strong> 47% revenue concentration in APAC region exposes company to currency fluctuation and geopolitical tensions.\n\n<strong>2. Operational Risk (Medium):</strong> Single-source supplier dependency for critical components (Note 12, pg. 84).\n\n<strong>3. Regulatory Risk (High):</strong> Pending SEC investigation (Item 3, Legal Proceedings) could result in material fines.\n\n<strong>Quantified Exposure:</strong> Estimated $45-60M contingent liability based on comparable settlements.',
            accuracy: 91,
            modelName: 'SK-Finance-7B'
        }
    },
    legal: {
        before: {
            query: 'Extract key obligations from this contract clause.',
            output: 'This contract says you have to do some things. There are deadlines mentioned. Both parties need to follow the agreement. Check with a lawyer for details.',
            accuracy: 58
        },
        after: {
            output: '<strong>Extracted Obligations:</strong>\n\n<strong>Party A (Licensor):</strong>\n• Deliver source code within 30 days of execution (§3.1)\n• Provide 24/7 technical support during implementation (§5.2)\n• Maintain SOC2 Type II compliance throughout term (§7.4)\n\n<strong>Party B (Licensee):</strong>\n• Payment of $450,000 in 3 tranches per Schedule B\n• Annual audit certification by independent auditor (§8.1)\n• 90-day notice for termination (§12.3)\n\n<strong>Mutual:</strong> Confidentiality survives 5 years post-termination (§9.5)',
            accuracy: 96,
            modelName: 'SK-Legal-3B'
        }
    },
    retail: {
        before: {
            query: 'Write an SEO-optimized product description for this wireless headphone.',
            output: 'These are nice headphones. They are wireless and have good sound. You can use them for music. They are comfortable to wear. Buy them today!',
            accuracy: 55
        },
        after: {
            output: '<strong>ProSound Elite Wireless Headphones</strong>\n\nExperience studio-quality audio without the wires. Our ProSound Elite headphones deliver 40mm driver precision with Active Noise Cancellation that blocks 95% of ambient noise.\n\n<strong>Key Features:</strong>\n✓ 45-hour battery life with quick charge (10 min = 3 hrs)\n✓ Bluetooth 5.3 with multipoint connection\n✓ Memory foam ear cushions for all-day comfort\n✓ Premium aluminum construction, just 8.6 oz\n\n★★★★★ "Best headphones under $200" - TechRadar\n\n<strong>Perfect for:</strong> Remote work, commuting, workouts, gaming\n<strong>Free shipping</strong> on orders over $50 | <strong>30-day returns</strong>',
            accuracy: 93,
            modelName: 'SK-Commerce-3B'
        }
    }
};

// Training simulation state
let trainingInterval = null;
let elapsedSeconds = 0;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initTechniqueCards();
    initTrainingSimulation();
    showTechniqueDetails('lora');
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

function updateDateTime() {
    const now = new Date();
    const formatted = now.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('current-datetime').textContent = formatted;
}

function initTechniqueCards() {
    const cards = document.querySelectorAll('.technique-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            cards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            showTechniqueDetails(this.dataset.technique);
        });
    });
}

function showTechniqueDetails(technique) {
    const details = techniqueDetails[technique];
    const container = document.getElementById('technique-details');
    
    if (!details) return;
    
    container.innerHTML = `
        <h3>${details.title}</h3>
        <p style="color: #666; margin-bottom: 1.5rem;">${details.description}</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem;">
            <div>
                <h4 style="color: #146eb4; margin-bottom: 0.75rem;">✓ Benefits</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    ${details.benefits.map(b => `<li style="padding: 0.3rem 0; font-size: 0.9rem; color: #333;">• ${b}</li>`).join('')}
                </ul>
            </div>
            <div>
                <h4 style="color: #146eb4; margin-bottom: 0.75rem;">🎯 Use Cases</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    ${details.useCases.map(u => `<li style="padding: 0.3rem 0; font-size: 0.9rem; color: #333;">• ${u}</li>`).join('')}
                </ul>
            </div>
            <div>
                <h4 style="color: #146eb4; margin-bottom: 0.75rem;">📊 Specifications</h4>
                <div style="background: #f8f9fa; border-radius: 8px; padding: 1rem;">
                    ${Object.entries(details.specs).map(([k, v]) => `
                        <div style="display: flex; justify-content: space-between; padding: 0.3rem 0; font-size: 0.85rem;">
                            <span style="color: #666;">${k}:</span>
                            <span style="font-weight: 600; color: #333;">${v}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function initTrainingSimulation() {
    const startBtn = document.getElementById('start-training-btn');
    startBtn.addEventListener('click', startTraining);
}

async function startTraining() {
    const progressSection = document.getElementById('training-progress');
    const comparisonSection = document.getElementById('comparison-section');
    const startBtn = document.getElementById('start-training-btn');
    
    // Show initial loader
    startBtn.disabled = true;
    startBtn.innerHTML = '<span class="sk-inline-loader"><span class="sk-spinner"></span><span>Initializing...</span></span>';
    
    // Show loader in progress section first
    progressSection.style.display = 'block';
    comparisonSection.style.display = 'none';
    
    // Create and show overlay loader
    const loaderOverlay = document.createElement('div');
    loaderOverlay.id = 'training-loader-overlay';
    loaderOverlay.innerHTML = `
        <div class="sk-section-loader" style="min-height: 300px; background: white; width: 100%;">
            <div class="sk-loader-brain">
                <div class="sk-loader-brain-ring"></div>
                <div class="sk-loader-brain-ring"></div>
                <div class="sk-loader-brain-ring"></div>
                <span class="sk-loader-brain-icon">🧠</span>
            </div>
            <div class="sk-loader-text">Preparing Training Environment</div>
            <div class="sk-loader-subtext">Allocating GPU resources and loading model weights...</div>
            <div class="sk-loader-progress"></div>
            <div class="sk-loader-steps">
                <div class="sk-loader-step" id="prep-step-1">
                    <span class="sk-loader-step-icon">●</span>
                    <span>Checking GPU availability...</span>
                </div>
                <div class="sk-loader-step" id="prep-step-2">
                    <span class="sk-loader-step-icon">●</span>
                    <span>Loading base model...</span>
                </div>
                <div class="sk-loader-step" id="prep-step-3">
                    <span class="sk-loader-step-icon">●</span>
                    <span>Preparing dataset...</span>
                </div>
                <div class="sk-loader-step" id="prep-step-4">
                    <span class="sk-loader-step-icon">●</span>
                    <span>Configuring optimizer...</span>
                </div>
            </div>
        </div>
    `;
    loaderOverlay.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: white; z-index: 10; display: flex; align-items: center; justify-content: center;';
    progressSection.style.position = 'relative';
    progressSection.appendChild(loaderOverlay);
    
    // Animate steps with random delay (3-5 seconds)
    const delay = Loader.getRandomDelay();
    const stepDelay = delay / 4;
    
    for (let i = 1; i <= 4; i++) {
        await Utils.sleep(stepDelay);
        const prevStep = document.getElementById(`prep-step-${i - 1}`);
        const currStep = document.getElementById(`prep-step-${i}`);
        
        if (prevStep) {
            prevStep.classList.remove('active');
            prevStep.classList.add('complete');
            prevStep.querySelector('.sk-loader-step-icon').textContent = '✓';
        }
        if (currStep) {
            currStep.classList.add('active');
        }
    }
    
    // Mark last step complete
    await Utils.sleep(300);
    const lastStep = document.getElementById('prep-step-4');
    if (lastStep) {
        lastStep.classList.remove('active');
        lastStep.classList.add('complete');
        lastStep.querySelector('.sk-loader-step-icon').textContent = '✓';
    }
    
    // Remove loader overlay
    await Utils.sleep(500);
    loaderOverlay.remove();
    
    // Now start actual training
    startBtn.innerHTML = '<span class="btn-icon">⏳</span> Training in Progress...';
    elapsedSeconds = 0;
    
    // Get config
    const baseModel = document.getElementById('base-model-select').value;
    const domain = document.getElementById('domain-select').value;
    const technique = document.getElementById('technique-select').value;
    const examples = document.getElementById('examples-select').value;
    
    // Clear log
    const log = document.getElementById('training-log');
    log.innerHTML = '';
    
    // Training stages
    const stages = [
        { progress: 0, status: 'Initializing training environment...', icon: '⏳' },
        { progress: 5, status: 'Loading base model weights...', icon: '📥' },
        { progress: 10, status: 'Preparing dataset...', icon: '📊' },
        { progress: 15, status: 'Tokenizing training examples...', icon: '🔤' },
        { progress: 20, status: 'Injecting LoRA adapters...', icon: '🔧' },
        { progress: 25, status: 'Starting Epoch 1/3...', icon: '🚀', epoch: 1 },
        { progress: 40, status: 'Epoch 1 complete. Loss: 2.341', icon: '✓', loss: 2.341 },
        { progress: 45, status: 'Starting Epoch 2/3...', icon: '🚀', epoch: 2 },
        { progress: 65, status: 'Epoch 2 complete. Loss: 1.124', icon: '✓', loss: 1.124 },
        { progress: 70, status: 'Starting Epoch 3/3...', icon: '🚀', epoch: 3 },
        { progress: 90, status: 'Epoch 3 complete. Loss: 0.487', icon: '✓', loss: 0.487 },
        { progress: 92, status: 'Saving adapter weights...', icon: '💾' },
        { progress: 95, status: 'Running evaluation benchmarks...', icon: '📈' },
        { progress: 98, status: 'Optimizing for inference...', icon: '⚡' },
        { progress: 100, status: 'Training complete!', icon: '🎉' }
    ];
    
    let stageIndex = 0;
    
    // Timer
    const timerInterval = setInterval(() => {
        elapsedSeconds++;
        const mins = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
        const secs = (elapsedSeconds % 60).toString().padStart(2, '0');
        document.getElementById('elapsed-time').textContent = `${mins}:${secs}`;
    }, 1000);
    
    // Progress simulation
    trainingInterval = setInterval(() => {
        if (stageIndex >= stages.length) {
            clearInterval(trainingInterval);
            clearInterval(timerInterval);
            showTrainingComplete(baseModel, domain, examples);
            return;
        }
        
        const stage = stages[stageIndex];
        
        // Update progress bar
        document.getElementById('progress-bar').style.width = stage.progress + '%';
        document.getElementById('progress-percent').textContent = stage.progress + '%';
        
        // Update status
        document.getElementById('status-icon').textContent = stage.icon;
        document.getElementById('status-text').textContent = stage.status;
        
        // Update metrics
        if (stage.epoch) {
            document.getElementById('epoch-value').textContent = `${stage.epoch} / 3`;
        }
        if (stage.loss) {
            document.getElementById('loss-value').textContent = stage.loss.toFixed(3);
        }
        
        // GPU memory simulation
        const gpuUsage = Math.min(95, 50 + stage.progress * 0.4);
        document.getElementById('gpu-value').textContent = gpuUsage.toFixed(0) + '%';
        
        // Add log entry
        addLogEntry(stage.status, stage.progress === 100 ? 'success' : '');
        
        stageIndex++;
    }, 800);
}

function addLogEntry(message, className = '') {
    const log = document.getElementById('training-log');
    const entry = document.createElement('div');
    entry.className = 'log-entry ' + className;
    const timestamp = new Date().toLocaleTimeString();
    entry.textContent = `[${timestamp}] ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function showTrainingComplete(baseModel, domain, examples) {
    const startBtn = document.getElementById('start-training-btn');
    startBtn.disabled = false;
    startBtn.innerHTML = '<span class="btn-icon">🚀</span> Start Training Simulation';
    
    // Show comparison section
    const comparisonSection = document.getElementById('comparison-section');
    comparisonSection.style.display = 'block';
    
    // Get domain data
    const data = domainOutputs[domain];
    
    // Update before panel
    document.getElementById('base-model-name').textContent = getModelDisplayName(baseModel);
    document.getElementById('before-output').innerHTML = `
        <div style="color: #666; font-size: 0.85rem; margin-bottom: 0.5rem;"><strong>Query:</strong> ${data.before.query}</div>
        <div>${data.before.output}</div>
    `;
    document.getElementById('before-accuracy').style.width = data.before.accuracy + '%';
    document.getElementById('before-accuracy-value').textContent = data.before.accuracy + '%';
    
    // Update after panel
    document.getElementById('finetuned-model-name').textContent = data.after.modelName;
    document.getElementById('after-output').innerHTML = `
        <div style="color: #666; font-size: 0.85rem; margin-bottom: 0.5rem;"><strong>Query:</strong> ${data.before.query}</div>
        <div>${data.after.output}</div>
    `;
    document.getElementById('after-accuracy').style.width = data.after.accuracy + '%';
    document.getElementById('after-accuracy-value').textContent = data.after.accuracy + '%';
    
    // Update improvement stats
    const improvement = data.after.accuracy - data.before.accuracy;
    document.getElementById('accuracy-improvement').textContent = '+' + improvement + '%';
    document.getElementById('training-examples').textContent = parseInt(examples).toLocaleString();
    
    // Training time based on examples
    const hours = (parseInt(examples) / 5000 * 1.25).toFixed(1);
    document.getElementById('training-time').textContent = hours + ' hrs';
    
    // Adapter size
    document.getElementById('adapter-size').textContent = '18 MB';
    
    // Scroll to comparison
    comparisonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getModelDisplayName(model) {
    const names = {
        'mistral-7b': 'Mistral 7B',
        'llama-3.2-3b': 'Llama 3.2 3B',
        'phi-3.5': 'Phi-3.5 Mini',
        'qwen-2.5-7b': 'Qwen 2.5 7B'
    };
    return names[model] || model;
}
