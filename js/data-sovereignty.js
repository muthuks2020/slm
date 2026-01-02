/* ============================================
   SLM Command Center - Data Sovereignty Module
   VPC Architecture & Compliance Visualization
   ============================================ */

const DataSovereignty = {
    // Compliance frameworks
    frameworks: {
        hipaa: {
            name: 'HIPAA',
            icon: '🏥',
            description: 'Health Insurance Portability and Accountability Act',
            requirements: [
                'PHI encryption at rest and in transit',
                'Access control and audit logging',
                'Business Associate Agreements',
                'Data breach notification protocols'
            ],
            industries: ['Healthcare', 'Health Insurance', 'Medical Research']
        },
        soc2: {
            name: 'SOC 2 Type II',
            icon: '🔒',
            description: 'Service Organization Control 2',
            requirements: [
                'Security monitoring and alerting',
                'Change management procedures',
                'Risk assessment processes',
                'Vendor management controls'
            ],
            industries: ['SaaS', 'Cloud Services', 'Technology']
        },
        gdpr: {
            name: 'GDPR',
            icon: '🇪🇺',
            description: 'General Data Protection Regulation',
            requirements: [
                'Data subject rights (access, erasure)',
                'Data Processing Agreements',
                'Privacy by design',
                'Cross-border transfer controls'
            ],
            industries: ['EU Operations', 'Consumer Data', 'Marketing']
        },
        pci: {
            name: 'PCI DSS',
            icon: '💳',
            description: 'Payment Card Industry Data Security Standard',
            requirements: [
                'Cardholder data encryption',
                'Network segmentation',
                'Access restrictions',
                'Regular security testing'
            ],
            industries: ['Financial Services', 'E-commerce', 'Retail']
        },
        fedramp: {
            name: 'FedRAMP',
            icon: '🏛️',
            description: 'Federal Risk and Authorization Management Program',
            requirements: [
                'Continuous monitoring',
                'Incident response plans',
                'Configuration management',
                'Personnel security'
            ],
            industries: ['Government', 'Defense', 'Federal Contractors']
        }
    },

    // Deployment architectures
    architectures: {
        vpc: {
            name: 'Private VPC',
            description: 'Model runs entirely within your AWS/GCP VPC',
            dataFlow: [
                { from: 'User Request', to: 'API Gateway', secure: true },
                { from: 'API Gateway', to: 'Private Subnet', secure: true },
                { from: 'Private Subnet', to: 'SLM Instance', secure: true },
                { from: 'SLM Instance', to: 'Response', secure: true }
            ],
            features: [
                'Zero data egress to public internet',
                'VPC peering for internal services',
                'Private endpoints for AWS services',
                'Network ACLs and security groups'
            ],
            securityControls: {
                encryption: 'AES-256 at rest, TLS 1.3 in transit',
                access: 'IAM roles, MFA required',
                logging: 'CloudTrail, VPC Flow Logs',
                monitoring: 'CloudWatch, GuardDuty'
            }
        },
        onprem: {
            name: 'On-Premises',
            description: 'Air-gapped deployment in your data center',
            dataFlow: [
                { from: 'Internal Network', to: 'Load Balancer', secure: true },
                { from: 'Load Balancer', to: 'GPU Cluster', secure: true },
                { from: 'GPU Cluster', to: 'Response', secure: true }
            ],
            features: [
                'Complete air-gap capability',
                'No cloud dependencies',
                'Full hardware control',
                'Custom security policies'
            ],
            securityControls: {
                encryption: 'Customer-managed keys',
                access: 'Active Directory integration',
                logging: 'SIEM integration',
                monitoring: 'On-prem monitoring stack'
            }
        },
        hybrid: {
            name: 'Hybrid Cloud',
            description: 'Sensitive data on-prem, compute in cloud',
            dataFlow: [
                { from: 'On-Prem Data', to: 'Secure Gateway', secure: true },
                { from: 'Secure Gateway', to: 'Cloud VPC', secure: true },
                { from: 'Cloud VPC', to: 'Processing', secure: true },
                { from: 'Processing', to: 'Results Only', secure: true }
            ],
            features: [
                'Data never leaves your premises',
                'Cloud scalability for compute',
                'Encrypted tunnels only',
                'Result-only data transfer'
            ],
            securityControls: {
                encryption: 'End-to-end encryption',
                access: 'Federated identity',
                logging: 'Unified audit trail',
                monitoring: 'Hybrid monitoring'
            }
        }
    },

    // Comparison with public APIs
    comparison: {
        publicApi: {
            name: 'Public LLM APIs',
            risks: [
                { category: 'Data Exposure', severity: 'critical', description: 'Prompts sent to third-party servers' },
                { category: 'Training Data', severity: 'high', description: 'Your data may train future models' },
                { category: 'Vendor Lock-in', severity: 'medium', description: 'Dependent on provider roadmap' },
                { category: 'Compliance', severity: 'critical', description: 'May violate data residency requirements' },
                { category: 'Cost Control', severity: 'medium', description: 'Unpredictable API costs at scale' }
            ],
            dataPath: 'Your Data → Internet → Third-Party Cloud → Unknown Processing → Response'
        },
        selfHosted: {
            name: 'Self-Hosted SLM',
            benefits: [
                { category: 'Data Sovereignty', severity: 'positive', description: 'Data never leaves your infrastructure' },
                { category: 'Training Control', severity: 'positive', description: 'Your data is never used for training' },
                { category: 'Vendor Freedom', severity: 'positive', description: 'No lock-in, full model portability' },
                { category: 'Compliance Ready', severity: 'positive', description: 'Meet any data residency requirement' },
                { category: 'Cost Predictable', severity: 'positive', description: 'Fixed infrastructure costs' }
            ],
            dataPath: 'Your Data → Your Network → Your VPC → Your GPU → Response (Never Leaves Your Control)'
        }
    },

    state: {
        selectedArchitecture: 'vpc',
        selectedFrameworks: ['soc2'],
        animationRunning: false
    },

    init() {
        this.renderArchitectureSelector();
        this.renderComplianceFrameworks();
        this.renderDataFlowDiagram();
        this.renderComparison();
        this.renderSecurityControls();
        this.bindEvents();
    },

    renderArchitectureSelector() {
        const container = document.getElementById('architecture-selector');
        if (!container) return;

        let html = '<div class="architecture-options">';
        for (const [key, arch] of Object.entries(this.architectures)) {
            const isActive = key === this.state.selectedArchitecture ? 'active' : '';
            html += `<button class="architecture-btn ${isActive}" data-arch="${key}">
                <span class="arch-name">${arch.name}</span>
                <span class="arch-desc">${arch.description}</span>
            </button>`;
        }
        html += '</div>';
        container.innerHTML = html;

        container.querySelectorAll('.architecture-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setArchitecture(e.currentTarget.dataset.arch);
            });
        });
    },

    setArchitecture(arch) {
        this.state.selectedArchitecture = arch;
        
        document.querySelectorAll('.architecture-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.arch === arch);
        });

        this.renderDataFlowDiagram();
        this.renderSecurityControls();
    },

    renderComplianceFrameworks() {
        const container = document.getElementById('compliance-frameworks');
        if (!container) return;

        let html = '<div class="frameworks-grid">';
        for (const [key, framework] of Object.entries(this.frameworks)) {
            const isSelected = this.state.selectedFrameworks.includes(key) ? 'selected' : '';
            html += `<div class="framework-card ${isSelected}" data-framework="${key}">
                <div class="framework-header">
                    <span class="framework-icon">${framework.icon}</span>
                    <span class="framework-name">${framework.name}</span>
                </div>
                <p class="framework-desc">${framework.description}</p>
                <div class="framework-requirements">
                    ${framework.requirements.slice(0, 2).map(r => `<span class="requirement">✓ ${r}</span>`).join('')}
                </div>
                <div class="framework-industries">
                    ${framework.industries.map(i => `<span class="industry-tag">${i}</span>`).join('')}
                </div>
            </div>`;
        }
        html += '</div>';
        container.innerHTML = html;

        container.querySelectorAll('.framework-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const fw = e.currentTarget.dataset.framework;
                this.toggleFramework(fw);
                e.currentTarget.classList.toggle('selected');
            });
        });
    },

    toggleFramework(framework) {
        const index = this.state.selectedFrameworks.indexOf(framework);
        if (index > -1) {
            this.state.selectedFrameworks.splice(index, 1);
        } else {
            this.state.selectedFrameworks.push(framework);
        }
        this.updateComplianceStatus();
    },

    updateComplianceStatus() {
        const status = document.getElementById('compliance-status');
        if (!status) return;

        const selected = this.state.selectedFrameworks;
        if (selected.length === 0) {
            status.innerHTML = '<div class="status-empty">Select compliance frameworks to see requirements</div>';
            return;
        }

        let html = '<div class="compliance-summary">';
        html += `<div class="summary-header">
            <span class="check-icon">✓</span>
            <span>Ready for ${selected.length} compliance framework${selected.length > 1 ? 's' : ''}</span>
        </div>`;
        
        html += '<div class="framework-badges">';
        selected.forEach(fw => {
            const framework = this.frameworks[fw];
            html += `<span class="compliance-badge">${framework.icon} ${framework.name}</span>`;
        });
        html += '</div></div>';

        status.innerHTML = html;
    },

    renderDataFlowDiagram() {
        const container = document.getElementById('data-flow-diagram');
        if (!container) return;

        const arch = this.architectures[this.state.selectedArchitecture];
        
        let html = `<div class="flow-diagram">
            <div class="diagram-header">
                <h4>${arch.name} Data Flow</h4>
                <button class="animate-btn" id="animate-flow-btn">▶ Animate Flow</button>
            </div>
            <div class="flow-visualization">`;

        // Draw the flow
        html += '<div class="flow-nodes">';
        arch.dataFlow.forEach((step, i) => {
            html += `<div class="flow-step" data-step="${i}">
                <div class="flow-node ${step.secure ? 'secure' : 'insecure'}">
                    <span class="node-label">${step.from}</span>
                </div>
                ${i < arch.dataFlow.length - 1 ? '<div class="flow-arrow secure-arrow">→</div>' : ''}
            </div>`;
        });
        html += '</div>';

        // Security boundary
        html += `<div class="security-boundary">
            <span class="boundary-label">🔒 Your Security Boundary - Data Never Leaves</span>
        </div>`;

        html += '</div>';

        // Features
        html += '<div class="arch-features"><h5>Security Features</h5><ul>';
        arch.features.forEach(f => {
            html += `<li>✓ ${f}</li>`;
        });
        html += '</ul></div></div>';

        container.innerHTML = html;

        // Bind animation button
        const animateBtn = document.getElementById('animate-flow-btn');
        if (animateBtn) {
            animateBtn.addEventListener('click', () => this.animateDataFlow());
        }
    },

    async animateDataFlow() {
        if (this.state.animationRunning) return;
        this.state.animationRunning = true;

        const steps = document.querySelectorAll('.flow-step');
        
        // Reset
        steps.forEach(s => s.classList.remove('active', 'complete'));
        
        // Animate each step
        for (let i = 0; i < steps.length; i++) {
            steps[i].classList.add('active');
            await Utils.sleep(600);
            steps[i].classList.remove('active');
            steps[i].classList.add('complete');
        }

        await Utils.sleep(500);
        steps.forEach(s => s.classList.remove('complete'));
        
        this.state.animationRunning = false;
    },

    renderComparison() {
        const container = document.getElementById('sovereignty-comparison');
        if (!container) return;

        const pub = this.comparison.publicApi;
        const self = this.comparison.selfHosted;

        let html = '<div class="comparison-container">';
        
        // Public API side
        html += `<div class="comparison-side public-side">
            <div class="side-header danger">
                <span class="side-icon">⚠️</span>
                <span class="side-title">${pub.name}</span>
            </div>
            <div class="data-path danger-path">
                <span class="path-label">Data Path:</span>
                <span class="path-flow">${pub.dataPath}</span>
            </div>
            <div class="risk-list">`;
        
        pub.risks.forEach(risk => {
            html += `<div class="risk-item ${risk.severity}">
                <span class="risk-category">${risk.category}</span>
                <span class="risk-desc">${risk.description}</span>
            </div>`;
        });
        html += '</div></div>';

        // Self-hosted side
        html += `<div class="comparison-side self-side">
            <div class="side-header success">
                <span class="side-icon">✅</span>
                <span class="side-title">${self.name}</span>
            </div>
            <div class="data-path success-path">
                <span class="path-label">Data Path:</span>
                <span class="path-flow">${self.dataPath}</span>
            </div>
            <div class="benefit-list">`;
        
        self.benefits.forEach(benefit => {
            html += `<div class="benefit-item">
                <span class="benefit-category">${benefit.category}</span>
                <span class="benefit-desc">${benefit.description}</span>
            </div>`;
        });
        html += '</div></div>';

        html += '</div>';

        // Key statistic
        html += `<div class="sovereignty-stat">
            <div class="stat-number">69%</div>
            <div class="stat-label">of enterprises cite AI data leaks as their top security concern</div>
            <div class="stat-source">Source: Enterprise AI Security Survey 2024</div>
        </div>`;

        container.innerHTML = html;
    },

    renderSecurityControls() {
        const container = document.getElementById('security-controls');
        if (!container) return;

        const arch = this.architectures[this.state.selectedArchitecture];
        const controls = arch.securityControls;

        let html = `<div class="controls-grid">
            <div class="control-card">
                <div class="control-icon">🔐</div>
                <div class="control-title">Encryption</div>
                <div class="control-value">${controls.encryption}</div>
            </div>
            <div class="control-card">
                <div class="control-icon">👤</div>
                <div class="control-title">Access Control</div>
                <div class="control-value">${controls.access}</div>
            </div>
            <div class="control-card">
                <div class="control-icon">📋</div>
                <div class="control-title">Audit Logging</div>
                <div class="control-value">${controls.logging}</div>
            </div>
            <div class="control-card">
                <div class="control-icon">📊</div>
                <div class="control-title">Monitoring</div>
                <div class="control-value">${controls.monitoring}</div>
            </div>
        </div>`;

        container.innerHTML = html;
    },

    bindEvents() {
        const exportBtn = document.getElementById('export-architecture-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportArchitecture());
        }
    },

    exportArchitecture() {
        const arch = this.architectures[this.state.selectedArchitecture];
        const selectedFrameworks = this.state.selectedFrameworks.map(f => this.frameworks[f]);

        const exportData = {
            exportDate: new Date().toISOString(),
            architecture: {
                type: this.state.selectedArchitecture,
                name: arch.name,
                description: arch.description,
                features: arch.features,
                securityControls: arch.securityControls
            },
            complianceFrameworks: selectedFrameworks,
            dataFlowSteps: arch.dataFlow,
            sovereigntyGuarantees: [
                'Data never leaves your infrastructure',
                'No third-party data processing',
                'Full audit trail maintained',
                'Customer-controlled encryption keys'
            ]
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `data-sovereignty-architecture-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        Toast.success('Architecture specification exported');
    }
};

document.addEventListener('DOMContentLoaded', () => DataSovereignty.init());
window.DataSovereignty = DataSovereignty;
