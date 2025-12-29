/* ============================================
   SLM Command Center - Fine-Tuning Module
   Before/After comparison with domain adaptation
   ============================================ */

const FineTuning = {
    // Industry presets
    industries: [
        {
            id: 'healthcare',
            name: 'Healthcare',
            icon: '🏥',
            terminology: ['ICD-10', 'CPT codes', 'HIPAA', 'EHR', 'clinical notes'],
            baseAccuracy: 62,
            tunedAccuracy: 89,
            sampleQueries: [
                'What ICD-10 code should I use for type 2 diabetes with peripheral neuropathy?',
                'Summarize this clinical note and extract relevant diagnoses.',
                'What are the HIPAA requirements for sharing patient data with research institutions?'
            ]
        },
        {
            id: 'financial',
            name: 'Financial Services',
            icon: '💰',
            terminology: ['SEC filings', 'GAAP', 'risk metrics', 'derivatives', 'regulatory compliance'],
            baseAccuracy: 65,
            tunedAccuracy: 91,
            sampleQueries: [
                'Extract key financial metrics from this 10-K filing.',
                'What are the Basel III capital requirements for this exposure?',
                'Analyze the risk factors in this quarterly earnings report.'
            ]
        },
        {
            id: 'legal',
            name: 'Legal',
            icon: '⚖️',
            terminology: ['contract clauses', 'precedent', 'jurisdiction', 'liability', 'indemnification'],
            baseAccuracy: 58,
            tunedAccuracy: 87,
            sampleQueries: [
                'Identify potential liability issues in this service agreement.',
                'Compare the indemnification clauses in these two contracts.',
                'What are the notice requirements under this NDA?'
            ]
        },
        {
            id: 'retail',
            name: 'Retail/E-commerce',
            icon: '🛒',
            terminology: ['SKU', 'inventory', 'conversion', 'cart abandonment', 'customer journey'],
            baseAccuracy: 70,
            tunedAccuracy: 92,
            sampleQueries: [
                'Generate SEO-optimized product descriptions for these items.',
                'Analyze customer review sentiment and extract product improvement suggestions.',
                'Create personalized email copy for cart abandonment recovery.'
            ]
        }
    ],
    
    // Current state
    state: {
        selectedIndustry: 'healthcare',
        isRunning: false
    },
    
    // Sample responses
    responses: {
        healthcare: {
            before: {
                text: `For diabetes with neuropathy, you might want to look at the diabetes codes in the ICD-10 manual. There are several codes related to diabetes complications. I'd recommend consulting with a coding specialist for the most accurate code selection. The combination of diabetes and neuropathy can be complex to code properly.

<span class="highlight-bad">Note: I'm not entirely certain about specific ICD-10 codes, as medical coding requires specialized knowledge.</span>`,
                issues: ['Vague response', 'No specific codes provided', 'Lacks confidence', 'Unhelpful for workflow']
            },
            after: {
                text: `For Type 2 diabetes mellitus with diabetic peripheral neuropathy, use <span class="highlight-good">E11.42</span> (Type 2 diabetes mellitus with diabetic polyneuropathy).

<span class="highlight-good">Key coding guidance:</span>
• If patient also has chronic kidney disease, add E11.22 for diabetic CKD
• For bilateral involvement, this code covers both sides
• Document severity in clinical notes for accurate risk adjustment

<span class="highlight-good">Related codes to consider:</span>
• E11.40 - Type 2 DM with diabetic neuropathy, unspecified
• E11.41 - Type 2 DM with diabetic mononeuropathy
• G63 - Polyneuropathy in diseases classified elsewhere (optional secondary)

<span class="highlight-good">⚠️ Compliance note:</span> Ensure documentation supports medical necessity for all coded conditions per CMS guidelines.`,
                improvements: ['Specific ICD-10 code', 'Detailed guidance', 'Related codes', 'Compliance awareness']
            }
        },
        financial: {
            before: {
                text: `Basel III requirements involve capital ratios that banks need to maintain. These typically include common equity tier 1, tier 1 capital, and total capital ratios. The specific requirements can vary based on the type of exposure and risk weighting.

<span class="highlight-bad">I'd recommend checking with your compliance team for the exact calculations applicable to your situation.</span>`,
                issues: ['Generic response', 'No specific calculations', 'Defers to others', 'Missing current requirements']
            },
            after: {
                text: `<span class="highlight-good">Basel III Capital Requirements Analysis:</span>

For credit risk exposures under the standardized approach:

<span class="highlight-good">Minimum Capital Ratios (as of 2024):</span>
• CET1: 4.5% + 2.5% conservation buffer = <span class="highlight-good">7.0%</span>
• Tier 1: 6.0% + 2.5% buffer = <span class="highlight-good">8.5%</span>
• Total Capital: 8.0% + 2.5% buffer = <span class="highlight-good">10.5%</span>

<span class="highlight-good">Risk Weight Calculation:</span>
RWA = Exposure × Risk Weight
Capital Requirement = RWA × 10.5%

<span class="highlight-good">For your corporate exposure:</span>
• Investment grade: 65% risk weight
• Non-investment grade: 100% risk weight
• Defaulted: 150% risk weight

G-SIB surcharge may apply (1-3.5% additional CET1) based on systemic importance score.`,
                improvements: ['Specific ratios', 'Current requirements', 'Calculation methodology', 'Regulatory context']
            }
        },
        legal: {
            before: {
                text: `Indemnification clauses are important parts of contracts that deal with liability. They typically specify who is responsible for certain types of losses or damages. When comparing contracts, you should look at the scope of indemnification, any limitations, and trigger events.

<span class="highlight-bad">Legal analysis should be performed by qualified legal counsel familiar with applicable jurisdiction.</span>`,
                issues: ['Too general', 'No specific analysis', 'Avoids substantive comparison', 'Lacks legal precision']
            },
            after: {
                text: `<span class="highlight-good">Indemnification Clause Comparison Analysis:</span>

<span class="highlight-good">Contract A - Broad Indemnification:</span>
• Scope: "Any and all claims, losses, damages"
• Standard: Negligence-based trigger
• Carve-outs: Gross negligence, willful misconduct
• Cap: None specified (unlimited exposure)
• ⚠️ <span class="highlight-bad">Risk: Indemnitor bears significant uncapped liability</span>

<span class="highlight-good">Contract B - Limited Indemnification:</span>
• Scope: "Third-party IP claims only"
• Standard: Strict liability for IP matters
• Carve-outs: Modifications by indemnitee
• Cap: Limited to fees paid in prior 12 months
• ✓ <span class="highlight-good">Favorable: Predictable maximum exposure</span>

<span class="highlight-good">Key Differences:</span>
1. Contract A lacks monetary cap - recommend negotiating
2. Contract B's IP-only scope may leave gaps for data breach liability
3. Neither addresses attorney's fee recovery

<span class="highlight-good">Recommendation:</span> Negotiate Contract A's structure with Contract B's cap mechanism.`,
                improvements: ['Structured analysis', 'Risk identification', 'Specific clause review', 'Actionable recommendations']
            }
        },
        retail: {
            before: {
                text: `Here's a product description for the wireless earbuds:

These wireless earbuds offer good sound quality and comfortable fit. They feature Bluetooth connectivity and come with a charging case. The earbuds have decent battery life and are suitable for everyday use.

<span class="highlight-bad">This description could be improved with more specific features and benefits.</span>`,
                issues: ['Generic copy', 'No SEO optimization', 'Lacks persuasive elements', 'Missing specifications']
            },
            after: {
                text: `<span class="highlight-good">🎧 ProSound Elite Wireless Earbuds - Premium Audio Meets All-Day Comfort</span>

Experience <span class="highlight-good">crystal-clear 40mm driver sound</span> with active noise cancellation that blocks 95% of ambient noise. Perfect for commutes, workouts, and focused work sessions.

<span class="highlight-good">✨ Key Features:</span>
• <span class="highlight-good">48-hour total battery</span> (8hrs buds + 40hrs case)
• IPX5 water resistance - sweat-proof for intense workouts
• Bluetooth 5.3 with <10ms latency for gaming
• Touch controls + voice assistant integration
• Memory foam tips in 3 sizes for custom fit

<span class="highlight-good">🏆 Why Customers Love Them:</span>
"Best earbuds under $100" - 4.8★ (2,847 reviews)

<span class="highlight-good">SEO Keywords:</span> wireless earbuds, noise cancelling earbuds, bluetooth earbuds, workout earbuds, long battery earbuds

<span class="highlight-good">📦 Includes:</span> Earbuds, charging case, USB-C cable, 3 ear tip sizes, quick start guide

💰 <span class="highlight-good">Limited Time: $79.99</span> (Save 20%)`,
                improvements: ['SEO-optimized', 'Benefit-focused', 'Social proof', 'Clear specifications', 'Call to action']
            }
        }
    },
    
    // Initialize module
    init() {
        this.renderIndustrySelector();
        this.renderComparison();
        this.bindEvents();
        this.updateMetrics();
    },
    
    // Render industry selector
    renderIndustrySelector() {
        const container = document.getElementById('industry-selector');
        if (!container) return;
        
        container.innerHTML = this.industries.map(ind => `
            <button class="industry-btn ${this.state.selectedIndustry === ind.id ? 'active' : ''}" 
                    data-industry="${ind.id}">
                <span class="industry-icon">${ind.icon}</span>
                <span class="industry-name">${ind.name}</span>
            </button>
        `).join('');
    },
    
    // Render comparison panels
    renderComparison() {
        const industry = this.industries.find(i => i.id === this.state.selectedIndustry);
        const responses = this.responses[this.state.selectedIndustry];
        
        if (!industry || !responses) return;
        
        // Update query selector
        const querySelect = document.getElementById('finetune-query-select');
        if (querySelect) {
            querySelect.innerHTML = industry.sampleQueries.map((q, i) => 
                `<option value="${i}">${q.substring(0, 60)}...</option>`
            ).join('');
        }
        
        // Update before panel
        const beforePanel = document.getElementById('before-response');
        if (beforePanel) {
            beforePanel.innerHTML = responses.before.text;
        }
        
        // Update after panel
        const afterPanel = document.getElementById('after-response');
        if (afterPanel) {
            afterPanel.innerHTML = responses.after.text;
        }
        
        // Update issues list
        const issuesList = document.getElementById('before-issues');
        if (issuesList) {
            issuesList.innerHTML = responses.before.issues.map(issue => 
                `<li class="issue-item"><span class="issue-icon">⚠️</span> ${issue}</li>`
            ).join('');
        }
        
        // Update improvements list
        const improvementsList = document.getElementById('after-improvements');
        if (improvementsList) {
            improvementsList.innerHTML = responses.after.improvements.map(imp => 
                `<li class="improvement-item"><span class="improvement-icon">✓</span> ${imp}</li>`
            ).join('');
        }
    },
    
    // Update metrics display
    updateMetrics() {
        const industry = this.industries.find(i => i.id === this.state.selectedIndustry);
        if (!industry) return;
        
        // Accuracy
        const beforeAccuracy = document.getElementById('before-accuracy');
        const afterAccuracy = document.getElementById('after-accuracy');
        
        if (beforeAccuracy) beforeAccuracy.textContent = industry.baseAccuracy + '%';
        if (afterAccuracy) afterAccuracy.textContent = industry.tunedAccuracy + '%';
        
        // Improvement
        const improvement = document.getElementById('accuracy-improvement');
        if (improvement) {
            const diff = industry.tunedAccuracy - industry.baseAccuracy;
            improvement.textContent = '+' + diff + '%';
        }
        
        // Training stats
        document.getElementById('training-examples')?.textContent && 
            (document.getElementById('training-examples').textContent = '500');
        document.getElementById('training-time')?.textContent && 
            (document.getElementById('training-time').textContent = '4 hours');
        document.getElementById('training-cost')?.textContent && 
            (document.getElementById('training-cost').textContent = '$12');
    },
    
    // Bind events
    bindEvents() {
        // Industry buttons
        document.querySelectorAll('.industry-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectIndustry(btn.dataset.industry);
            });
        });
        
        // Run comparison button
        const runBtn = document.getElementById('run-finetune-comparison');
        if (runBtn) {
            runBtn.addEventListener('click', () => this.runComparison());
        }
        
        // Query selector
        const querySelect = document.getElementById('finetune-query-select');
        if (querySelect) {
            querySelect.addEventListener('change', () => this.runComparison());
        }
    },
    
    // Select industry
    selectIndustry(industryId) {
        this.state.selectedIndustry = industryId;
        this.renderIndustrySelector();
        this.renderComparison();
        this.updateMetrics();
        this.bindEvents();
        
        Toast.info(`Switched to ${this.industries.find(i => i.id === industryId)?.name} domain`);
    },
    
    // Run comparison animation
    async runComparison() {
        if (this.state.isRunning) return;
        this.state.isRunning = true;
        
        const beforePanel = document.getElementById('before-response');
        const afterPanel = document.getElementById('after-response');
        
        // Show loading
        if (beforePanel) beforePanel.innerHTML = '<div class="spinner" style="width: 32px; height: 32px; margin: 40px auto;"></div>';
        if (afterPanel) afterPanel.innerHTML = '<div class="spinner" style="width: 32px; height: 32px; margin: 40px auto;"></div>';
        
        // Simulate base model (slower, less confident)
        await Utils.sleep(1500);
        this.typeResponse('before');
        
        // Simulate fine-tuned model (faster, more accurate)
        await Utils.sleep(500);
        this.typeResponse('after');
        
        this.state.isRunning = false;
    },
    
    // Type response with animation
    async typeResponse(type) {
        const responses = this.responses[this.state.selectedIndustry];
        const panel = document.getElementById(`${type}-response`);
        const response = responses[type].text;
        
        if (!panel) return;
        
        panel.innerHTML = '';
        
        // Type character by character
        let currentText = '';
        const speed = type === 'before' ? 12 : 8; // Fine-tuned model types faster
        
        for (let i = 0; i < response.length; i++) {
            currentText += response[i];
            // Parse HTML tags properly
            if (response[i] === '<') {
                const closeIndex = response.indexOf('>', i);
                if (closeIndex > i) {
                    currentText = response.substring(0, closeIndex + 1);
                    i = closeIndex;
                }
            }
            panel.innerHTML = currentText;
            await Utils.sleep(speed);
        }
    }
};

// Additional styles
const finetuneStyles = document.createElement('style');
finetuneStyles.textContent = `
    .industry-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        padding: 16px 24px;
        background: white;
        border: 2px solid var(--color-border);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        min-width: 120px;
    }
    .industry-btn:hover {
        border-color: var(--color-secondary);
        transform: translateY(-2px);
    }
    .industry-btn.active {
        border-color: var(--color-primary);
        background: rgba(20, 110, 180, 0.05);
    }
    .industry-icon {
        font-size: 2rem;
    }
    .industry-name {
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--color-dark);
    }
    .issue-item, .improvement-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 0;
        font-size: 0.9rem;
        border-bottom: 1px solid var(--color-border);
    }
    .issue-item:last-child, .improvement-item:last-child {
        border-bottom: none;
    }
    .issue-icon {
        color: var(--color-danger);
    }
    .improvement-icon {
        color: var(--color-success);
        font-weight: bold;
    }
`;
document.head.appendChild(finetuneStyles);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    FineTuning.init();
});

window.FineTuning = FineTuning;
