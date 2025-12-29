/* ============================================
   SLM Command Center - RAG Citations Module
   Document Q&A with traceable source citations
   ============================================ */

const RAGCitations = {
    // Sample documents (in production, these would be uploaded)
    documents: [
        {
            id: 1,
            title: 'Employee Handbook 2024',
            type: 'Policy Document',
            updatedAt: 'March 2024',
            sections: [
                {
                    id: '1.1',
                    section: 'Section 4.2 - Remote Work Policy',
                    page: 47,
                    content: 'Employees may work remotely up to 3 days per week with manager approval. Remote work arrangements must be documented and reviewed quarterly. All remote workers must maintain a secure home office environment and use company-approved VPN connections.'
                },
                {
                    id: '1.2',
                    section: 'Section 5.1 - PTO Policy',
                    page: 52,
                    content: 'Full-time employees accrue 15 days of paid time off annually during their first 3 years. After 3 years, accrual increases to 20 days. PTO requests must be submitted at least 2 weeks in advance for periods exceeding 3 consecutive days.'
                },
                {
                    id: '1.3',
                    section: 'Section 6.3 - Benefits Enrollment',
                    page: 68,
                    content: 'Open enrollment occurs annually in November. New hires have 30 days from start date to enroll. Changes outside enrollment periods require a qualifying life event such as marriage, birth of child, or loss of other coverage.'
                }
            ]
        },
        {
            id: 2,
            title: 'IT Security Guidelines',
            type: 'Technical Documentation',
            updatedAt: 'January 2024',
            sections: [
                {
                    id: '2.1',
                    section: 'Section 2.1 - Password Requirements',
                    page: 12,
                    content: 'All passwords must be minimum 12 characters with at least one uppercase, lowercase, number, and special character. Passwords expire every 90 days and cannot repeat the last 10 passwords used. Multi-factor authentication is required for all systems.'
                },
                {
                    id: '2.2',
                    section: 'Section 3.4 - Data Classification',
                    page: 28,
                    content: 'Data is classified into four tiers: Public, Internal, Confidential, and Restricted. Restricted data includes PII, financial records, and trade secrets. Restricted data must be encrypted at rest and in transit using AES-256 encryption.'
                }
            ]
        },
        {
            id: 3,
            title: 'Product Specifications Q4',
            type: 'Product Manual',
            updatedAt: 'October 2024',
            sections: [
                {
                    id: '3.1',
                    section: 'Chapter 3 - API Rate Limits',
                    page: 34,
                    content: 'Standard tier allows 1,000 requests per minute with burst capacity of 2,000. Enterprise tier provides 10,000 requests per minute with dedicated infrastructure. Rate limit headers are included in all responses.'
                },
                {
                    id: '3.2',
                    section: 'Chapter 5 - SLA Commitments',
                    page: 56,
                    content: 'We guarantee 99.9% uptime for production APIs. Scheduled maintenance windows occur monthly on the first Sunday, 2-4 AM UTC. Emergency maintenance may occur with 4-hour notice. SLA credits apply for downtime exceeding commitments.'
                }
            ]
        }
    ],
    
    // State
    state: {
        messages: [],
        activeSourceId: null,
        isProcessing: false
    },
    
    // Initialize module
    init() {
        this.renderDocumentsList();
        this.bindEvents();
        this.addWelcomeMessage();
    },
    
    // Bind events
    bindEvents() {
        const input = document.getElementById('rag-input');
        const sendBtn = document.getElementById('rag-send-btn');
        
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendQuery();
                }
            });
        }
        
        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.sendQuery());
        }
        
        // Sample query buttons
        document.querySelectorAll('.sample-query-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.dataset.query;
                if (input) input.value = query;
                this.sendQuery();
            });
        });
    },
    
    // Render documents list
    renderDocumentsList() {
        const container = document.getElementById('documents-list');
        if (!container) return;
        
        container.innerHTML = this.documents.map(doc => `
            <div class="document-item" data-doc-id="${doc.id}">
                <div class="document-icon">📄</div>
                <div class="document-info">
                    <div class="document-title">${doc.title}</div>
                    <div class="document-meta">${doc.type} • Updated ${doc.updatedAt}</div>
                </div>
            </div>
        `).join('');
    },
    
    // Add welcome message
    addWelcomeMessage() {
        const welcomeMsg = {
            type: 'assistant',
            content: 'Hello! I can answer questions about your uploaded documents with precise source citations. Try asking about remote work policies, PTO, security requirements, or API specifications.',
            citations: []
        };
        
        this.state.messages.push(welcomeMsg);
        this.renderMessages();
    },
    
    // Send query
    async sendQuery() {
        const input = document.getElementById('rag-input');
        const query = input?.value.trim();
        
        if (!query || this.state.isProcessing) return;
        
        // Add user message
        this.state.messages.push({
            type: 'user',
            content: query
        });
        
        input.value = '';
        this.renderMessages();
        this.state.isProcessing = true;
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate RAG retrieval and response
        await Utils.sleep(1500);
        
        const response = this.generateResponse(query);
        
        this.hideTypingIndicator();
        
        this.state.messages.push(response);
        this.renderMessages();
        this.renderSources(response.citations);
        
        this.state.isProcessing = false;
    },
    
    // Generate response with citations
    generateResponse(query) {
        const lowerQuery = query.toLowerCase();
        
        // Match query to relevant content
        if (lowerQuery.includes('remote') || lowerQuery.includes('work from home')) {
            return {
                type: 'assistant',
                content: `Based on the Employee Handbook, employees may work remotely up to 3 days per week with manager approval <span class="citation-link" data-source="1.1">1</span>. All remote work arrangements must be documented and reviewed quarterly. Additionally, remote workers must maintain a secure home office environment and use company-approved VPN connections <span class="citation-link" data-source="1.1">1</span>. For security requirements, please refer to the IT Security Guidelines which mandate multi-factor authentication for all systems <span class="citation-link" data-source="2.1">2</span>.`,
                citations: ['1.1', '2.1']
            };
        }
        
        if (lowerQuery.includes('pto') || lowerQuery.includes('vacation') || lowerQuery.includes('time off')) {
            return {
                type: 'assistant',
                content: `According to Section 5.1 of the Employee Handbook, full-time employees accrue 15 days of paid time off annually during their first 3 years of employment <span class="citation-link" data-source="1.2">1</span>. After completing 3 years of service, PTO accrual increases to 20 days per year <span class="citation-link" data-source="1.2">1</span>. Important note: PTO requests must be submitted at least 2 weeks in advance for periods exceeding 3 consecutive days <span class="citation-link" data-source="1.2">1</span>.`,
                citations: ['1.2']
            };
        }
        
        if (lowerQuery.includes('password') || lowerQuery.includes('security') || lowerQuery.includes('mfa')) {
            return {
                type: 'assistant',
                content: `The IT Security Guidelines specify strict password requirements <span class="citation-link" data-source="2.1">1</span>. All passwords must be a minimum of 12 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character. Passwords expire every 90 days and cannot repeat the last 10 passwords used <span class="citation-link" data-source="2.1">1</span>. Additionally, multi-factor authentication (MFA) is required for all company systems <span class="citation-link" data-source="2.1">1</span>. For data handling, refer to the data classification guidelines which require AES-256 encryption for restricted data <span class="citation-link" data-source="2.2">2</span>.`,
                citations: ['2.1', '2.2']
            };
        }
        
        if (lowerQuery.includes('api') || lowerQuery.includes('rate limit')) {
            return {
                type: 'assistant',
                content: `According to the Product Specifications, the standard tier allows 1,000 requests per minute with burst capacity of 2,000 requests <span class="citation-link" data-source="3.1">1</span>. Enterprise tier customers receive 10,000 requests per minute with dedicated infrastructure <span class="citation-link" data-source="3.1">1</span>. Rate limit information is included in response headers for monitoring purposes. Regarding uptime, the SLA guarantees 99.9% availability for production APIs <span class="citation-link" data-source="3.2">2</span>.`,
                citations: ['3.1', '3.2']
            };
        }
        
        if (lowerQuery.includes('benefits') || lowerQuery.includes('enrollment') || lowerQuery.includes('insurance')) {
            return {
                type: 'assistant',
                content: `Benefits enrollment information is covered in Section 6.3 of the Employee Handbook <span class="citation-link" data-source="1.3">1</span>. Open enrollment occurs annually in November. New hires have a 30-day window from their start date to complete enrollment <span class="citation-link" data-source="1.3">1</span>. Changes outside the standard enrollment period require a qualifying life event, such as marriage, birth of a child, or loss of other coverage <span class="citation-link" data-source="1.3">1</span>.`,
                citations: ['1.3']
            };
        }
        
        // Default response
        return {
            type: 'assistant',
            content: `I searched through the available documents but couldn't find specific information matching your query. The documents I have access to include the Employee Handbook (policies on remote work, PTO, benefits), IT Security Guidelines (password requirements, data classification), and Product Specifications (API limits, SLA commitments). Could you rephrase your question or ask about one of these topics?`,
            citations: []
        };
    },
    
    // Render messages
    renderMessages() {
        const container = document.getElementById('rag-messages');
        if (!container) return;
        
        container.innerHTML = this.state.messages.map(msg => `
            <div class="message message-${msg.type}">
                <div class="message-content">
                    ${msg.content}
                </div>
            </div>
        `).join('');
        
        // Add citation click handlers
        container.querySelectorAll('.citation-link').forEach(link => {
            link.addEventListener('click', () => {
                const sourceId = link.dataset.source;
                this.highlightSource(sourceId);
            });
        });
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    },
    
    // Render sources panel
    renderSources(citationIds) {
        const container = document.getElementById('sources-list');
        if (!container || !citationIds.length) return;
        
        const sources = citationIds.map((id, index) => {
            const [docId, sectionId] = id.split('.');
            const doc = this.documents.find(d => d.id === parseInt(docId));
            const section = doc?.sections.find(s => s.id === id);
            
            if (!section) return '';
            
            return `
                <div class="source-card" data-source-id="${id}">
                    <div class="source-header">
                        <span class="source-number">${index + 1}</span>
                        <span class="source-title">${section.section}</span>
                    </div>
                    <div class="source-meta">
                        ${doc.title} • Page ${section.page} • ${doc.updatedAt}
                    </div>
                    <div class="source-excerpt">
                        "${section.content}"
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = sources;
        
        // Add click handlers
        container.querySelectorAll('.source-card').forEach(card => {
            card.addEventListener('click', () => {
                const sourceId = card.dataset.sourceId;
                this.highlightSource(sourceId);
            });
        });
    },
    
    // Highlight source
    highlightSource(sourceId) {
        // Remove previous active state
        document.querySelectorAll('.source-card').forEach(card => {
            card.classList.remove('active');
        });
        
        // Add active state to clicked source
        const sourceCard = document.querySelector(`.source-card[data-source-id="${sourceId}"]`);
        if (sourceCard) {
            sourceCard.classList.add('active');
            sourceCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        this.state.activeSourceId = sourceId;
    },
    
    // Show typing indicator
    showTypingIndicator() {
        const container = document.getElementById('rag-messages');
        if (!container) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'message message-assistant typing-indicator';
        indicator.innerHTML = `
            <div class="message-content">
                <div class="typing-dots">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        container.appendChild(indicator);
        container.scrollTop = container.scrollHeight;
    },
    
    // Hide typing indicator
    hideTypingIndicator() {
        const indicator = document.querySelector('.typing-indicator');
        if (indicator) indicator.remove();
    },
    
    // Export audit log
    exportAuditLog() {
        const log = {
            timestamp: new Date().toISOString(),
            session_id: Utils.generateId(),
            queries: this.state.messages.filter(m => m.type === 'user').map(m => m.content),
            citations_used: [...new Set(this.state.messages.flatMap(m => m.citations || []))],
            documents_accessed: this.documents.map(d => ({ id: d.id, title: d.title }))
        };
        
        const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rag-audit-log-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        Toast.success('Audit log exported successfully');
    }
};

// Add typing indicator styles
const style = document.createElement('style');
style.textContent = `
    .typing-dots {
        display: flex;
        gap: 4px;
        padding: 8px 0;
    }
    .typing-dots span {
        width: 8px;
        height: 8px;
        background: var(--color-primary);
        border-radius: 50%;
        animation: typingBounce 1.4s infinite ease-in-out both;
    }
    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
    @keyframes typingBounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
    }
    .document-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--color-background);
        border-radius: 8px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .document-item:hover {
        background: white;
        box-shadow: var(--shadow-md);
    }
    .document-icon {
        font-size: 24px;
    }
    .document-title {
        font-weight: 600;
        font-size: 0.9rem;
        color: var(--color-dark);
    }
    .document-meta {
        font-size: 0.75rem;
        color: var(--color-text-light);
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    RAGCitations.init();
});

window.RAGCitations = RAGCitations;
