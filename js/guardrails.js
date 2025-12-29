/* ============================================
   SLM Command Center - Guardrails Module
   Content filtering and safety controls
   ============================================ */

const Guardrails = {
    // Guardrail configurations
    rules: [
        {
            id: 'competitor-block',
            name: 'Block Competitor Mentions',
            description: 'Prevents the model from discussing or recommending competitor products and services.',
            icon: '🚫',
            iconClass: 'block',
            enabled: true,
            action: 'block',
            keywords: ['competitor', 'alternative', 'other vendors', 'aws', 'azure', 'google cloud']
        },
        {
            id: 'compliance-disclaimer',
            name: 'Compliance Disclaimers',
            description: 'Automatically adds appropriate disclaimers to financial, medical, and legal advice.',
            icon: '⚖️',
            iconClass: 'shield',
            enabled: true,
            action: 'modify',
            triggers: ['financial advice', 'medical', 'legal', 'investment', 'diagnosis']
        },
        {
            id: 'pii-detection',
            name: 'PII Detection & Redaction',
            description: 'Identifies and redacts personally identifiable information including SSN, credit cards, and addresses.',
            icon: '🔒',
            iconClass: 'eye',
            enabled: true,
            action: 'redact',
            patterns: [
                { name: 'SSN', regex: /\b\d{3}-\d{2}-\d{4}\b/g },
                { name: 'Credit Card', regex: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g },
                { name: 'Email', regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g },
                { name: 'Phone', regex: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g }
            ]
        },
        {
            id: 'hallucination-guard',
            name: 'Hallucination Prevention',
            description: 'Model gracefully declines to answer when confidence is low or information is not in knowledge base.',
            icon: '🎯',
            iconClass: 'warning',
            enabled: true,
            action: 'block',
            confidenceThreshold: 0.7
        },
        {
            id: 'toxicity-filter',
            name: 'Toxicity Filter',
            description: 'Blocks or flags responses containing harmful, offensive, or inappropriate content.',
            icon: '🛡️',
            iconClass: 'shield',
            enabled: true,
            action: 'block',
            categories: ['hate_speech', 'violence', 'harassment', 'explicit']
        },
        {
            id: 'topic-restriction',
            name: 'Topic Restrictions',
            description: 'Restricts conversations to approved business topics only.',
            icon: '📋',
            iconClass: 'eye',
            enabled: false,
            action: 'flag',
            allowedTopics: ['product', 'support', 'pricing', 'features', 'documentation']
        }
    ],
    
    // Test history
    testHistory: [],
    
    // Initialize module
    init() {
        this.renderGuardrails();
        this.bindEvents();
        this.updateConfigPreview();
    },
    
    // Render guardrails
    renderGuardrails() {
        const container = document.getElementById('guardrails-grid');
        if (!container) return;
        
        container.innerHTML = this.rules.map(rule => `
            <div class="guardrail-card" data-rule-id="${rule.id}">
                <div class="guardrail-header">
                    <div class="guardrail-title">
                        <div class="guardrail-icon ${rule.iconClass}">${rule.icon}</div>
                        <span>${rule.name}</span>
                    </div>
                    <label class="toggle-switch">
                        <input type="checkbox" ${rule.enabled ? 'checked' : ''} data-rule="${rule.id}">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="guardrail-description">${rule.description}</div>
                <div class="guardrail-status">
                    <div class="status-indicator">
                        <span class="status-dot ${rule.enabled ? 'active' : 'inactive'}"></span>
                        <span>${rule.enabled ? 'Active' : 'Inactive'}</span>
                    </div>
                    <span class="badge badge-${rule.action === 'block' ? 'danger' : rule.action === 'flag' ? 'warning' : 'primary'}">
                        ${rule.action.toUpperCase()}
                    </span>
                </div>
            </div>
        `).join('');
    },
    
    // Bind events
    bindEvents() {
        // Toggle switches
        document.querySelectorAll('.toggle-switch input').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const ruleId = e.target.dataset.rule;
                this.toggleRule(ruleId, e.target.checked);
            });
        });
        
        // Test button
        const testBtn = document.getElementById('test-guardrails-btn');
        if (testBtn) {
            testBtn.addEventListener('click', () => this.runTest());
        }
        
        // Test input enter key
        const testInput = document.getElementById('guardrails-test-input');
        if (testInput) {
            testInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.runTest();
            });
        }
        
        // Sample test buttons
        document.querySelectorAll('.sample-test-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const testInput = document.getElementById('guardrails-test-input');
                if (testInput) {
                    testInput.value = btn.dataset.test;
                    this.runTest();
                }
            });
        });
    },
    
    // Toggle rule
    toggleRule(ruleId, enabled) {
        const rule = this.rules.find(r => r.id === ruleId);
        if (rule) {
            rule.enabled = enabled;
            this.renderGuardrails();
            this.bindEvents();
            this.updateConfigPreview();
            
            Toast.info(`${rule.name} ${enabled ? 'enabled' : 'disabled'}`);
        }
    },
    
    // Update config preview
    updateConfigPreview() {
        const preview = document.getElementById('config-preview');
        if (!preview) return;
        
        const config = {
            guardrails: this.rules.filter(r => r.enabled).map(r => ({
                id: r.id,
                action: r.action,
                enabled: true
            }))
        };
        
        preview.textContent = `# Guardrails Configuration (YAML)
guardrails:
${this.rules.filter(r => r.enabled).map(r => `  - id: ${r.id}
    action: ${r.action}
    enabled: true`).join('\n')}

# Total active rules: ${this.rules.filter(r => r.enabled).length}
# Configuration updated: ${new Date().toISOString()}`;
    },
    
    // Run test
    async runTest() {
        const input = document.getElementById('guardrails-test-input');
        const resultContainer = document.getElementById('test-result');
        const testPrompt = input?.value.trim();
        
        if (!testPrompt) {
            Toast.warning('Please enter a test prompt');
            return;
        }
        
        // Show loading
        if (resultContainer) {
            resultContainer.innerHTML = '<div class="spinner" style="width: 24px; height: 24px; margin: 0 auto;"></div>';
            resultContainer.className = 'test-result';
        }
        
        await Utils.sleep(800);
        
        // Run tests against all enabled rules
        const results = this.evaluatePrompt(testPrompt);
        
        // Display results
        this.displayTestResults(results, testPrompt, resultContainer);
        
        // Add to history
        this.testHistory.unshift({
            prompt: testPrompt,
            results: results,
            timestamp: new Date().toISOString()
        });
    },
    
    // Evaluate prompt against rules
    evaluatePrompt(prompt) {
        const results = {
            passed: true,
            blocked: false,
            flagged: false,
            modified: false,
            triggeredRules: [],
            redactions: [],
            modifications: []
        };
        
        const lowerPrompt = prompt.toLowerCase();
        
        // Check each enabled rule
        for (const rule of this.rules.filter(r => r.enabled)) {
            switch (rule.id) {
                case 'competitor-block':
                    if (rule.keywords.some(kw => lowerPrompt.includes(kw.toLowerCase()))) {
                        results.triggeredRules.push({
                            rule: rule.name,
                            action: 'BLOCKED',
                            reason: 'Competitor mention detected'
                        });
                        results.blocked = true;
                        results.passed = false;
                    }
                    break;
                    
                case 'compliance-disclaimer':
                    if (rule.triggers.some(t => lowerPrompt.includes(t.toLowerCase()))) {
                        results.triggeredRules.push({
                            rule: rule.name,
                            action: 'MODIFIED',
                            reason: 'Compliance disclaimer will be added'
                        });
                        results.modified = true;
                        results.modifications.push('⚠️ Disclaimer: This is for informational purposes only and does not constitute professional advice.');
                    }
                    break;
                    
                case 'pii-detection':
                    for (const pattern of rule.patterns) {
                        const matches = prompt.match(pattern.regex);
                        if (matches) {
                            results.triggeredRules.push({
                                rule: rule.name,
                                action: 'REDACTED',
                                reason: `${pattern.name} detected: ${matches.length} instance(s)`
                            });
                            results.redactions.push(...matches.map(m => ({
                                type: pattern.name,
                                value: m.replace(/./g, '•')
                            })));
                        }
                    }
                    break;
                    
                case 'hallucination-guard':
                    if (lowerPrompt.includes('make up') || lowerPrompt.includes('pretend') || lowerPrompt.includes('imagine facts')) {
                        results.triggeredRules.push({
                            rule: rule.name,
                            action: 'BLOCKED',
                            reason: 'Request for fabricated information detected'
                        });
                        results.blocked = true;
                        results.passed = false;
                    }
                    break;
                    
                case 'toxicity-filter':
                    const toxicPatterns = ['hate', 'kill', 'attack', 'destroy', 'harm'];
                    if (toxicPatterns.some(p => lowerPrompt.includes(p))) {
                        results.triggeredRules.push({
                            rule: rule.name,
                            action: 'BLOCKED',
                            reason: 'Potentially harmful content detected'
                        });
                        results.blocked = true;
                        results.passed = false;
                    }
                    break;
                    
                case 'topic-restriction':
                    if (!rule.allowedTopics.some(t => lowerPrompt.includes(t))) {
                        results.triggeredRules.push({
                            rule: rule.name,
                            action: 'FLAGGED',
                            reason: 'Off-topic content detected'
                        });
                        results.flagged = true;
                    }
                    break;
            }
        }
        
        return results;
    },
    
    // Display test results
    displayTestResults(results, prompt, container) {
        if (!container) return;
        
        let statusClass = 'passed';
        let statusIcon = '✓';
        let statusText = 'PASSED';
        
        if (results.blocked) {
            statusClass = 'blocked';
            statusIcon = '✕';
            statusText = 'BLOCKED';
        } else if (results.flagged) {
            statusClass = 'flagged';
            statusIcon = '⚠';
            statusText = 'FLAGGED';
        }
        
        container.className = `test-result ${statusClass}`;
        container.innerHTML = `
            <div class="test-result-header">
                <span class="test-status-icon">${statusIcon}</span>
                <span class="test-status-text">${statusText}</span>
            </div>
            ${results.triggeredRules.length > 0 ? `
                <div class="triggered-rules">
                    <strong>Triggered Rules:</strong>
                    <ul>
                        ${results.triggeredRules.map(r => `
                            <li>
                                <span class="rule-action badge badge-${r.action === 'BLOCKED' ? 'danger' : r.action === 'FLAGGED' ? 'warning' : 'primary'}">${r.action}</span>
                                ${r.rule}: ${r.reason}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : '<p>No rules triggered. Content passed all checks.</p>'}
            ${results.redactions.length > 0 ? `
                <div class="redactions">
                    <strong>Redacted Content:</strong>
                    <ul>
                        ${results.redactions.map(r => `<li>${r.type}: ${r.value}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            ${results.modifications.length > 0 ? `
                <div class="modifications">
                    <strong>Modifications Applied:</strong>
                    <ul>
                        ${results.modifications.map(m => `<li>${m}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        `;
    },
    
    // Export configuration
    exportConfig() {
        const config = {
            version: '1.0',
            exported_at: new Date().toISOString(),
            guardrails: this.rules.map(r => ({
                id: r.id,
                name: r.name,
                enabled: r.enabled,
                action: r.action
            }))
        };
        
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `guardrails-config-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        Toast.success('Configuration exported successfully');
    }
};

// Additional styles
const guardrailStyles = document.createElement('style');
guardrailStyles.textContent = `
    .test-result-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        font-weight: 600;
        font-size: 1.1rem;
    }
    .test-status-icon {
        font-size: 1.5rem;
    }
    .triggered-rules ul,
    .redactions ul,
    .modifications ul {
        margin: 8px 0;
        padding-left: 20px;
    }
    .triggered-rules li,
    .redactions li,
    .modifications li {
        margin: 4px 0;
        font-size: 0.9rem;
    }
    .rule-action {
        margin-right: 8px;
    }
`;
document.head.appendChild(guardrailStyles);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Guardrails.init();
});

window.Guardrails = Guardrails;
