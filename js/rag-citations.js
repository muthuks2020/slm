/* ============================================
   SLM Command Center - RAG Citations Module
   Retrieval-Augmented Generation with Traceable Sources
   Industry-Specific Knowledge Bases
   ============================================ */

const RAGCitations = {
    // Industry configurations with knowledge bases
    industries: {
        general: {
            name: 'General',
            icon: '🔷',
            description: 'Corporate policies & procedures',
            documents: [
                { id: 'DOC-001', title: 'Employee Handbook 2024', type: 'PDF', pages: 45 },
                { id: 'DOC-002', title: 'Remote Work Policy', type: 'PDF', pages: 12 },
                { id: 'DOC-003', title: 'IT Security Guidelines', type: 'PDF', pages: 28 },
                { id: 'DOC-004', title: 'Travel & Expense Policy', type: 'PDF', pages: 15 },
                { id: 'DOC-005', title: 'Code of Conduct', type: 'PDF', pages: 20 }
            ],
            queries: [
                "What is our policy on remote work?",
                "How many PTO days do employees get?",
                "What are the IT security requirements?",
                "How do I submit travel expenses?"
            ],
            responses: {
                "What is our policy on remote work?": {
                    answer: "According to our Remote Work Policy, employees may work remotely up to 3 days per week with manager approval. Key requirements include: maintaining core hours (10am-3pm), using company-approved VPN, and ensuring a dedicated workspace. Remote work arrangements must be documented in the HR system.",
                    citations: [
                        { doc: 'DOC-002', section: 'Section 2.1', page: 3, text: 'Employees may request remote work arrangements for up to 3 days per week' },
                        { doc: 'DOC-002', section: 'Section 3.2', page: 5, text: 'Core hours of 10am-3pm must be maintained regardless of location' },
                        { doc: 'DOC-003', section: 'Section 4.1', page: 8, text: 'All remote connections must use the company-approved VPN solution' }
                    ]
                }
            }
        },
        healthcare: {
            name: 'Healthcare',
            icon: '🏥',
            description: 'Clinical protocols & compliance',
            documents: [
                { id: 'MED-001', title: 'Clinical Treatment Protocols', type: 'PDF', pages: 120 },
                { id: 'MED-002', title: 'HIPAA Compliance Manual', type: 'PDF', pages: 85 },
                { id: 'MED-003', title: 'Medication Administration Guide', type: 'PDF', pages: 60 },
                { id: 'MED-004', title: 'Patient Safety Procedures', type: 'PDF', pages: 45 },
                { id: 'MED-005', title: 'Emergency Response Protocols', type: 'PDF', pages: 35 }
            ],
            queries: [
                "What is the protocol for chest pain assessment?",
                "How do we handle PHI data requests?",
                "What are the medication double-check procedures?",
                "When should a patient be escalated to ICU?"
            ],
            responses: {
                "What is the protocol for chest pain assessment?": {
                    answer: "For chest pain assessment, follow the HEART Score protocol: obtain 12-lead ECG within 10 minutes of arrival, draw troponin levels at 0 and 3 hours, assess risk factors including age >65, known CAD, and diabetes. Patients with HEART score ≥4 require cardiology consult. All findings must be documented in the EHR within 30 minutes.",
                    citations: [
                        { doc: 'MED-001', section: 'Chapter 5.2', page: 42, text: 'HEART Score protocol: ECG within 10 minutes, troponin at 0 and 3 hours' },
                        { doc: 'MED-001', section: 'Chapter 5.3', page: 45, text: 'HEART score ≥4 requires mandatory cardiology consultation' },
                        { doc: 'MED-004', section: 'Section 8.1', page: 28, text: 'All cardiac assessments must be documented in EHR within 30 minutes' }
                    ]
                }
            }
        },
        financial: {
            name: 'Financial Services',
            icon: '🏦',
            description: 'Compliance & regulatory docs',
            documents: [
                { id: 'FIN-001', title: 'SEC Compliance Handbook', type: 'PDF', pages: 200 },
                { id: 'FIN-002', title: 'AML/KYC Procedures', type: 'PDF', pages: 95 },
                { id: 'FIN-003', title: 'Trading Policies Manual', type: 'PDF', pages: 150 },
                { id: 'FIN-004', title: 'Risk Management Framework', type: 'PDF', pages: 80 },
                { id: 'FIN-005', title: 'Client Data Protection Policy', type: 'PDF', pages: 45 }
            ],
            queries: [
                "What are the KYC requirements for new clients?",
                "How do we report suspicious transactions?",
                "What is the policy on insider trading?",
                "When is regulatory disclosure required?"
            ],
            responses: {
                "What are the KYC requirements for new clients?": {
                    answer: "For new client onboarding, KYC requirements include: government-issued ID verification, proof of address within 90 days, source of funds documentation for accounts >$50K, and enhanced due diligence for PEPs or high-risk jurisdictions. All documentation must be retained for 7 years after account closure per BSA requirements.",
                    citations: [
                        { doc: 'FIN-002', section: 'Section 3.1', page: 15, text: 'Standard KYC: government ID, proof of address dated within 90 days' },
                        { doc: 'FIN-002', section: 'Section 3.4', page: 22, text: 'Enhanced due diligence required for PEPs and high-risk jurisdictions' },
                        { doc: 'FIN-002', section: 'Section 7.2', page: 58, text: 'BSA retention requirement: 7 years post-account closure' }
                    ]
                }
            }
        },
        retail: {
            name: 'Retail & E-commerce',
            icon: '🛒',
            description: 'Product & operations docs',
            documents: [
                { id: 'RET-001', title: 'Product Catalog 2024', type: 'PDF', pages: 500 },
                { id: 'RET-002', title: 'Return & Refund Policy', type: 'PDF', pages: 25 },
                { id: 'RET-003', title: 'Shipping Guidelines', type: 'PDF', pages: 35 },
                { id: 'RET-004', title: 'Warranty Information', type: 'PDF', pages: 40 },
                { id: 'RET-005', title: 'Size & Fit Guide', type: 'PDF', pages: 30 }
            ],
            queries: [
                "What is our return policy for electronics?",
                "How long does standard shipping take?",
                "What items are not eligible for returns?",
                "How do I process a warranty claim?"
            ],
            responses: {
                "What is our return policy for electronics?": {
                    answer: "Electronics can be returned within 30 days of purchase with original packaging and receipt. Items must be in original condition with all accessories. Opened software, downloadable products, and items with missing serial numbers are not eligible. Refunds are processed within 5-7 business days to the original payment method.",
                    citations: [
                        { doc: 'RET-002', section: 'Section 2.3', page: 8, text: 'Electronics: 30-day return window with original packaging required' },
                        { doc: 'RET-002', section: 'Section 2.5', page: 10, text: 'Exclusions: opened software, downloads, missing serial numbers' },
                        { doc: 'RET-002', section: 'Section 4.1', page: 18, text: 'Refund processing: 5-7 business days to original payment method' }
                    ]
                }
            }
        },
        customer_service: {
            name: 'Customer Service',
            icon: '💬',
            description: 'Support knowledge base',
            documents: [
                { id: 'SUP-001', title: 'Product Troubleshooting Guide', type: 'PDF', pages: 150 },
                { id: 'SUP-002', title: 'Account Management FAQ', type: 'PDF', pages: 40 },
                { id: 'SUP-003', title: 'Billing Support Manual', type: 'PDF', pages: 55 },
                { id: 'SUP-004', title: 'Escalation Procedures', type: 'PDF', pages: 25 },
                { id: 'SUP-005', title: 'Service Level Agreements', type: 'PDF', pages: 30 }
            ],
            queries: [
                "How do I reset a customer's password?",
                "What is the refund process for billing errors?",
                "When should I escalate to Tier 2 support?",
                "What is the SLA for critical issues?"
            ],
            responses: {
                "How do I reset a customer's password?": {
                    answer: "To reset a customer's password: 1) Verify identity using security questions or last 4 digits of payment method, 2) Send password reset link to registered email (valid 24 hours), 3) If email access is lost, escalate to Tier 2 with identity verification form. Never share temporary passwords verbally. Log all reset requests in CRM.",
                    citations: [
                        { doc: 'SUP-002', section: 'Section 3.2', page: 15, text: 'Identity verification: security questions OR last 4 digits of payment' },
                        { doc: 'SUP-002', section: 'Section 3.3', page: 16, text: 'Password reset link valid for 24 hours; escalate if email inaccessible' },
                        { doc: 'SUP-004', section: 'Section 2.1', page: 8, text: 'Security policy: never share temporary passwords verbally' }
                    ]
                }
            }
        }
    },

    state: {
        currentIndustry: 'general',
        messages: [],
        selectedDocument: null
    },

    init() {
        this.renderIndustrySelector();
        this.renderDocumentList();
        this.renderSampleQueries();
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
        this.state.messages = [];

        document.querySelectorAll('.industry-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.industry === industry);
        });

        const desc = document.getElementById('industry-description');
        if (desc) desc.textContent = this.industries[industry].description;

        this.renderDocumentList();
        this.renderSampleQueries();
        this.clearChat();
    },

    renderDocumentList() {
        const container = document.getElementById('document-list');
        if (!container) return;

        const config = this.industries[this.state.currentIndustry];
        let html = `<div class="document-header"><h4>${config.icon} ${config.name} Knowledge Base</h4>
            <span class="doc-count">${config.documents.length} documents indexed</span></div>`;
        
        html += '<div class="document-items">';
        config.documents.forEach(doc => {
            html += `<div class="document-item" data-doc="${doc.id}">
                <span class="doc-icon">📄</span>
                <div class="doc-info">
                    <span class="doc-title">${doc.title}</span>
                    <span class="doc-meta">${doc.type} • ${doc.pages} pages</span>
                </div>
            </div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    },

    renderSampleQueries() {
        const container = document.getElementById('sample-queries');
        if (!container) return;

        const config = this.industries[this.state.currentIndustry];
        let html = '';
        config.queries.forEach(query => {
            html += `<button class="sample-query-btn">${query}</button>`;
        });
        container.innerHTML = html;

        container.querySelectorAll('.sample-query-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const input = document.getElementById('chat-input');
                if (input) input.value = e.target.textContent;
            });
        });
    },

    bindEvents() {
        const input = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        if (sendBtn) sendBtn.addEventListener('click', () => this.sendMessage());

        const exportBtn = document.getElementById('export-audit-btn');
        if (exportBtn) exportBtn.addEventListener('click', () => this.exportAuditLog());
    },

    async sendMessage() {
        const input = document.getElementById('chat-input');
        if (!input || !input.value.trim()) return;

        const query = input.value.trim();
        input.value = '';

        this.addMessage('user', query);
        await this.generateResponse(query);
    },

    addMessage(role, content, citations = null) {
        const chatContainer = document.getElementById('chat-messages');
        if (!chatContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}-message`;

        let html = `<div class="message-content">${content}</div>`;
        
        if (citations && citations.length > 0) {
            html += '<div class="citations-list"><div class="citations-header">📎 Sources</div>';
            citations.forEach((cite, i) => {
                const doc = this.industries[this.state.currentIndustry].documents.find(d => d.id === cite.doc);
                html += `<div class="citation-item" data-citation="${i}">
                    <span class="citation-number">[${i + 1}]</span>
                    <div class="citation-details">
                        <span class="citation-doc">${doc?.title || cite.doc}</span>
                        <span class="citation-loc">${cite.section} • Page ${cite.page}</span>
                        <span class="citation-text">"${cite.text}"</span>
                    </div>
                </div>`;
            });
            html += '</div>';
        }

        messageDiv.innerHTML = html;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        this.state.messages.push({ role, content, citations, timestamp: new Date().toISOString() });
    },

    async generateResponse(query) {
        const chatContainer = document.getElementById('chat-messages');
        if (!chatContainer) return;

        // Show enhanced typing indicator with loader
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message assistant-message typing';
        typingDiv.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 0.75rem; padding: 0.5rem;">
                <div class="sk-loader-dots">
                    <span></span><span></span><span></span>
                </div>
                <div style="font-size: 0.85rem; color: #666;">
                    <span class="loading-status">Searching knowledge base...</span>
                </div>
            </div>
        `;
        chatContainer.appendChild(typingDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Simulate search steps with random delay
        const delay = Loader.getRandomDelay();
        const steps = ['Searching knowledge base...', 'Computing embeddings...', 'Ranking passages...', 'Generating response...'];
        const statusEl = typingDiv.querySelector('.loading-status');
        
        for (let i = 0; i < steps.length; i++) {
            await Utils.sleep(delay / steps.length);
            if (statusEl) statusEl.textContent = steps[i];
        }

        const config = this.industries[this.state.currentIndustry];
        let response, citations;

        // Find matching response or generate default
        const matchedQuery = Object.keys(config.responses).find(q => 
            query.toLowerCase().includes(q.toLowerCase().split(' ').slice(0, 3).join(' '))
        );

        if (matchedQuery) {
            response = config.responses[matchedQuery].answer;
            citations = config.responses[matchedQuery].citations;
        } else {
            response = `Based on the ${config.name} knowledge base, I found relevant information across ${config.documents.length} documents. The most relevant sections suggest reviewing the ${config.documents[0].title} for detailed guidance on this topic. Would you like me to search for more specific information?`;
            citations = [{ 
                doc: config.documents[0].id, 
                section: 'Multiple sections', 
                page: 1, 
                text: 'Relevant content found across multiple sections' 
            }];
        }

        // Remove typing indicator
        typingDiv.remove();

        // Add response with citations
        this.addMessage('assistant', response, citations);

        // Update sources panel
        this.updateSourcesPanel(citations);
    },

    updateSourcesPanel(citations) {
        const panel = document.getElementById('sources-panel');
        if (!panel) return;

        const config = this.industries[this.state.currentIndustry];
        let html = `<div class="sources-header">
            <h4>Retrieved Sources</h4>
            <span class="source-count">${citations.length} references</span>
        </div>`;

        html += '<div class="sources-list">';
        citations.forEach((cite, i) => {
            const doc = config.documents.find(d => d.id === cite.doc);
            html += `<div class="source-item">
                <div class="source-number">[${i + 1}]</div>
                <div class="source-details">
                    <div class="source-title">${doc?.title || cite.doc}</div>
                    <div class="source-location">${cite.section} • Page ${cite.page}</div>
                    <div class="source-preview">"${cite.text}"</div>
                </div>
            </div>`;
        });
        html += '</div>';

        html += `<div class="audit-info">
            <div class="audit-badge">✓ Full Audit Trail Available</div>
            <div class="audit-note">All queries and source retrievals are logged for compliance</div>
        </div>`;

        panel.innerHTML = html;
    },

    clearChat() {
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) chatContainer.innerHTML = '';
        
        const sourcesPanel = document.getElementById('sources-panel');
        if (sourcesPanel) {
            sourcesPanel.innerHTML = '<div class="sources-empty">Ask a question to see retrieved sources</div>';
        }
    },

    exportAuditLog() {
        const config = this.industries[this.state.currentIndustry];
        const auditLog = {
            exportDate: new Date().toISOString(),
            industry: config.name,
            knowledgeBase: config.documents.map(d => d.title),
            conversations: this.state.messages,
            systemInfo: {
                model: 'Mistral 7B (Self-hosted)',
                ragMethod: 'Vector similarity search',
                embeddingModel: 'all-MiniLM-L6-v2'
            }
        };

        const blob = new Blob([JSON.stringify(auditLog, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rag-audit-log-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        Toast.success('Audit log exported successfully');
    }
};

document.addEventListener('DOMContentLoaded', () => RAGCitations.init());
window.RAGCitations = RAGCitations;
