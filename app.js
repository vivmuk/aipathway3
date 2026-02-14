// ====================================
// AI PATHWAY V3 - MAIN APPLICATION
// Single-page intake form + generation
// ====================================

// ── Example Use Cases (pre-populated scenarios) ─────────────

const EXAMPLE_USE_CASES = [
    {
        id: 'marketing_to_ai_strategist',
        badge: 'Marketing',
        title: 'Marketing Manager \u2192 AI Marketing Strategist',
        desc: 'Transition from traditional marketing to leading AI-powered campaigns and personalization.',
        data: {
            current_role: 'Marketing Manager',
            industry: 'marketing_creative',
            ai_experience: 'beginner',
            ai_tools_used: ['chatgpt'],
            technical_background: 'basic_tech',
            current_responsibilities: 'I manage a team of 4 marketers. My day-to-day includes planning and executing multi-channel campaigns (email, social, paid ads), managing a $200K quarterly budget, creating content briefs for writers, analyzing campaign performance in Google Analytics and HubSpot, coordinating with the design team, running weekly status meetings, and reporting ROI to leadership. I also handle our brand voice guidelines and approve all public-facing content.',
            target_job_description: `AI Marketing Strategist

About the Role:
We're looking for a forward-thinking AI Marketing Strategist to lead the integration of AI tools and methodologies across our marketing organization. You'll develop AI-powered strategies for content creation, audience segmentation, predictive analytics, and campaign optimization.

Responsibilities:
- Develop and implement AI-driven marketing strategies across all channels
- Lead adoption of AI tools for content generation, A/B testing, and personalization at scale
- Build and manage AI-powered customer journey mapping and predictive audience segmentation
- Create automated content pipelines using LLMs for email, social, and ad copy
- Design and implement AI agents for marketing workflow automation (brief generation, performance reporting, competitive analysis)
- Partner with data engineering to build marketing data infrastructure for AI/ML models
- Establish AI governance guidelines for brand-safe content generation
- Train marketing team on prompt engineering and AI tool adoption
- Track and report on AI-driven efficiency gains and performance improvements

Requirements:
- 5+ years marketing experience with 2+ years using AI/ML in marketing
- Hands-on experience with LLMs (GPT-4, Claude) for content generation and analysis
- Proficiency in marketing automation platforms (HubSpot, Marketo, or similar)
- Experience with AI-powered analytics and predictive modeling
- Understanding of prompt engineering and AI agent design
- Strong project management and cross-functional leadership skills
- Data-driven mindset with ability to translate AI capabilities into business outcomes`,
            what_excites_you: 'I love the idea of using AI to personalize campaigns at scale and automate the repetitive reporting work that takes up so much of my week.'
        }
    },
    {
        id: 'analyst_to_ai_data_lead',
        badge: 'Data & Analytics',
        title: 'Business Analyst \u2192 AI & Data Analytics Lead',
        desc: 'Level up from spreadsheets and dashboards to AI-powered insights and automated reporting.',
        data: {
            current_role: 'Business Analyst',
            industry: 'finance',
            ai_experience: 'regular',
            ai_tools_used: ['chatgpt', 'copilot', 'perplexity'],
            technical_background: 'some_coding',
            current_responsibilities: 'I build weekly and monthly reports in Excel and Power BI for senior leadership. I analyze customer transaction data to identify trends, create financial forecasts, write SQL queries to pull data from our warehouse, build dashboards tracking KPIs, prepare board presentation decks, conduct ad-hoc analysis when teams need answers, and document business requirements for IT projects. I also run quarterly business reviews with department heads.',
            target_job_description: `AI & Data Analytics Lead

We are seeking an AI & Data Analytics Lead to transform our analytics capabilities using AI and machine learning. You will lead a team that builds intelligent analytics solutions, automates insight generation, and drives data-informed decision-making across the organization.

Key Responsibilities:
- Lead a team of 3-5 analysts in developing AI-enhanced analytics workflows
- Design and implement AI-powered automated reporting and anomaly detection systems
- Build predictive models for customer behavior, churn, and revenue forecasting
- Create AI agents for natural language data querying (text-to-SQL, conversational BI)
- Develop self-service AI analytics tools for business users across departments
- Implement LLM-based solutions for document analysis, summarization, and insight extraction
- Establish data quality frameworks and AI model monitoring processes
- Partner with engineering to integrate AI analytics into production systems
- Present AI-driven insights and recommendations to C-suite and board

Requirements:
- 5+ years in analytics/BI with progressive leadership responsibility
- Strong SQL, Python, and data visualization skills
- Experience with ML/AI frameworks (scikit-learn, TensorFlow, or similar)
- Hands-on experience with LLMs for data analysis and natural language interfaces
- Proven ability to translate complex data into executive-level narratives
- Experience managing and mentoring analysts
- Financial services or regulated industry experience preferred`,
            what_excites_you: 'I want to move beyond static dashboards into predictive analytics and build tools that let anyone in the company ask questions of our data in plain English.'
        }
    },
    {
        id: 'teacher_to_instructional_designer',
        badge: 'Education',
        title: 'Teacher \u2192 AI Instructional Designer',
        desc: 'Leverage classroom expertise to design AI-enhanced learning experiences at scale.',
        data: {
            current_role: 'High School Science Teacher',
            industry: 'education',
            ai_experience: 'beginner',
            ai_tools_used: ['chatgpt', 'gemini'],
            technical_background: 'no_coding',
            current_responsibilities: 'I teach 5 classes of biology and chemistry to 150+ students. I create lesson plans, develop assessments and rubrics, differentiate instruction for various learning levels, grade assignments and provide feedback, communicate with parents, mentor new teachers, lead the science department curriculum committee, organize lab activities, track student progress in our LMS (Canvas), and attend professional development workshops. I also run an after-school STEM club.',
            target_job_description: `AI Instructional Designer — EdTech Company

About Us: We're building the next generation of AI-powered learning platforms.

Role Overview:
Design engaging, adaptive learning experiences powered by AI. You'll work at the intersection of pedagogy and technology to create courses that personalize to each learner.

Responsibilities:
- Design AI-enhanced curricula that adapt to individual learner needs and pace
- Create prompt-based learning activities where students interact with AI tutors
- Develop assessment frameworks that use AI for formative feedback and adaptive testing
- Build AI agent-powered tutoring workflows for personalized student support
- Write instructional content optimized for LLM-based delivery and interaction
- Collaborate with engineers to define AI tutor behavior, guardrails, and pedagogical rules
- Design rubrics and evaluation criteria for AI-generated educational content
- Conduct user research with students and educators to improve AI learning tools
- Stay current with AI in education research and integrate best practices

Requirements:
- 3+ years classroom teaching experience
- Understanding of learning science, backward design, and UDL principles
- Experience with LMS platforms and educational technology tools
- Familiarity with AI tools (ChatGPT, Claude) and prompt engineering basics
- Strong writing skills and ability to create clear, engaging content
- Experience with curriculum design or instructional design preferred
- Passion for making education more accessible and personalized through technology`,
            what_excites_you: 'I see so many students who need personalized attention that I can\'t give with 30 kids in a class. AI tutoring could change that completely, and I want to be the one designing those experiences.'
        }
    },
    {
        id: 'pm_to_ai_product_manager',
        badge: 'Product',
        title: 'Project Manager \u2192 AI Product Manager',
        desc: 'Move from managing timelines to shaping AI-powered products and features.',
        data: {
            current_role: 'Senior Project Manager',
            industry: 'technology',
            ai_experience: 'regular',
            ai_tools_used: ['chatgpt', 'claude', 'copilot'],
            technical_background: 'basic_tech',
            current_responsibilities: 'I manage 3-4 concurrent software projects with cross-functional teams of 8-15 people. I run sprint planning, daily standups, and retrospectives. I create project timelines in Jira, manage scope and budget, write status reports for stakeholders, facilitate requirements gathering sessions, coordinate releases with engineering and QA, manage vendor relationships, resolve blockers and escalations, and present project updates to the VP of Engineering. I also mentor two junior PMs.',
            target_job_description: `AI Product Manager

Join our team to lead the product strategy and execution for our AI-powered platform features.

What You'll Do:
- Define product vision and roadmap for AI/ML-powered features
- Write detailed PRDs for AI features including model requirements, data needs, and user experience
- Conduct user research to identify high-impact AI use cases and prioritize the backlog
- Work closely with ML engineers and data scientists to translate business needs into model requirements
- Design AI agent architectures for customer-facing automation features
- Define success metrics and run experiments to measure AI feature impact
- Manage the full product lifecycle from discovery through launch and iteration
- Develop AI ethics guidelines and responsible AI practices for product decisions
- Communicate AI product strategy to executives, customers, and cross-functional partners
- Stay current with AI/ML trends and competitive landscape

What We're Looking For:
- 5+ years product management experience, 2+ years with AI/ML products
- Understanding of ML concepts (training, inference, fine-tuning, RAG, agents)
- Experience writing product requirements for data-driven and AI features
- Ability to evaluate AI model performance and make build-vs-buy decisions
- Strong analytical skills and experience with experimentation/A/B testing
- Excellent communication skills — can translate technical AI concepts for any audience
- Experience with agile methodologies and product analytics tools
- Technical enough to have meaningful conversations with ML engineers`,
            what_excites_you: 'I\'ve been managing software projects for years but I want to actually shape WHAT gets built, especially AI features. I understand the process side — now I need the AI product knowledge.'
        }
    }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    renderExampleCards();
    renderIntakeForm();
});

// Scroll to intake section
function scrollToIntake() {
    const el = document.getElementById('intake-screen');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ── Render example use case cards ───────────────────────────

function renderExampleCards() {
    const grid = document.getElementById('examples-grid');
    if (!grid) return;

    grid.innerHTML = EXAMPLE_USE_CASES.map(ex => `
        <div class="example-card" onclick="loadExample('${ex.id}')">
            <div class="example-badge">${ex.badge}</div>
            <h4 class="example-title">${ex.title}</h4>
            <p class="example-desc">${ex.desc}</p>
            <span class="example-cta">Try this example &rarr;</span>
        </div>
    `).join('');
}

// Pre-populate the form with an example
function loadExample(exampleId) {
    const example = EXAMPLE_USE_CASES.find(e => e.id === exampleId);
    if (!example) return;

    const data = example.data;

    // Fill text inputs
    setInputValue('current_role', data.current_role);
    setInputValue('current_responsibilities', data.current_responsibilities);
    setInputValue('target_job_description', data.target_job_description);
    setInputValue('what_excites_you', data.what_excites_you || '');

    // Fill select
    const industrySelect = document.getElementById('industry');
    if (industrySelect) industrySelect.value = data.industry;

    // Fill radio groups
    setRadioValue('ai_experience', data.ai_experience);
    setRadioValue('technical_background', data.technical_background);

    // Fill checkbox group
    setCheckboxValues('ai_tools_used', data.ai_tools_used);

    // Scroll to the form
    scrollToIntake();

    // Brief highlight effect
    document.querySelectorAll('.intake-column').forEach(col => {
        col.classList.add('highlight-pulse');
        setTimeout(() => col.classList.remove('highlight-pulse'), 1500);
    });
}

function setInputValue(fieldId, value) {
    const el = document.getElementById(fieldId);
    if (el) {
        el.value = value;
        // Trigger input event for any listeners
        el.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

function setRadioValue(fieldId, value) {
    const group = document.querySelector(`.radio-group[data-field-id="${fieldId}"]`);
    if (!group) return;
    // Clear previous selection
    group.querySelectorAll('.radio-option').forEach(opt => opt.classList.remove('selected'));
    // Select matching
    const match = group.querySelector(`.radio-option[data-value="${value}"]`);
    if (match) {
        match.classList.add('selected');
        group.dataset.selectedValue = value;
    }
}

function setCheckboxValues(fieldId, values) {
    const group = document.querySelector(`.checkbox-group[data-field-id="${fieldId}"]`);
    if (!group) return;
    // Clear all
    group.querySelectorAll('.checkbox-option').forEach(opt => opt.classList.remove('selected'));
    // Select matching
    (values || []).forEach(val => {
        const match = group.querySelector(`.checkbox-option[data-value="${val}"]`);
        if (match) match.classList.add('selected');
    });
}

// ── Render the intake form fields ────────────────────────────────

function renderIntakeForm() {
    renderSectionFields('current-state-fields', intakeFields.currentState.fields);
    renderSectionFields('future-state-fields', intakeFields.futureState.fields);
}

function renderSectionFields(containerId, fields) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    fields.forEach(field => {
        const group = document.createElement('div');
        group.className = 'form-group';
        group.id = `group-${field.id}`;

        const label = document.createElement('label');
        label.className = 'form-label';
        label.setAttribute('for', field.id);
        label.innerHTML = field.label + (field.required ? ' <span class="required">*</span>' : '');
        group.appendChild(label);

        switch (field.type) {
            case 'text':
                group.appendChild(createTextInput(field));
                break;
            case 'select':
                group.appendChild(createSelectInput(field));
                break;
            case 'textarea':
                group.appendChild(createTextareaInput(field));
                break;
            case 'radio':
                group.appendChild(createRadioGroup(field));
                break;
            case 'checkbox':
                group.appendChild(createCheckboxGroup(field));
                break;
        }

        container.appendChild(group);
    });
}

function createTextInput(field) {
    const input = document.createElement('input');
    input.type = 'text';
    input.id = field.id;
    input.name = field.id;
    input.placeholder = field.placeholder || '';
    input.className = 'form-input';
    return input;
}

function createSelectInput(field) {
    const select = document.createElement('select');
    select.id = field.id;
    select.name = field.id;
    select.className = 'form-select';

    field.options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        select.appendChild(option);
    });

    return select;
}

function createTextareaInput(field) {
    const textarea = document.createElement('textarea');
    textarea.id = field.id;
    textarea.name = field.id;
    textarea.placeholder = field.placeholder || '';
    textarea.className = 'form-textarea';
    textarea.rows = field.rows || 4;
    return textarea;
}

function createRadioGroup(field) {
    const group = document.createElement('div');
    group.className = 'radio-group';
    group.dataset.fieldId = field.id;

    field.options.forEach(opt => {
        const option = document.createElement('div');
        option.className = 'radio-option';
        option.dataset.value = opt.value;
        option.onclick = function () { selectRadio(field.id, opt.value, this); };

        option.innerHTML = `
            <div class="radio-dot"></div>
            <span class="radio-label">${opt.label}</span>
        `;
        group.appendChild(option);
    });

    return group;
}

function createCheckboxGroup(field) {
    const group = document.createElement('div');
    group.className = 'checkbox-group';
    group.dataset.fieldId = field.id;

    field.options.forEach(opt => {
        const option = document.createElement('div');
        option.className = 'checkbox-option';
        option.dataset.value = opt.value;
        option.onclick = function () { toggleCheckbox(field.id, opt.value, this); };

        option.innerHTML = `
            <div class="checkbox-tick"></div>
            <span>${opt.label}</span>
        `;
        group.appendChild(option);
    });

    return group;
}

// ── Radio / Checkbox selection logic ────────────────────────────

function selectRadio(fieldId, value, element) {
    const group = element.parentElement;
    group.querySelectorAll('.radio-option').forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');
    // Store value in a hidden-like way
    element.parentElement.dataset.selectedValue = value;
}

function toggleCheckbox(fieldId, value, element) {
    element.classList.toggle('selected');
}

// ── Collect form data ───────────────────────────────────────────

function collectFormData() {
    const data = {};

    // Collect all sections
    const allFields = [...intakeFields.currentState.fields, ...intakeFields.futureState.fields];

    allFields.forEach(field => {
        switch (field.type) {
            case 'text': {
                const el = document.getElementById(field.id);
                data[field.id] = el ? el.value.trim() : '';
                break;
            }
            case 'select': {
                const el = document.getElementById(field.id);
                data[field.id] = el ? el.value : '';
                break;
            }
            case 'textarea': {
                const el = document.getElementById(field.id);
                data[field.id] = el ? el.value.trim() : '';
                break;
            }
            case 'radio': {
                const group = document.querySelector(`.radio-group[data-field-id="${field.id}"]`);
                data[field.id] = group ? (group.dataset.selectedValue || '') : '';
                break;
            }
            case 'checkbox': {
                const group = document.querySelector(`.checkbox-group[data-field-id="${field.id}"]`);
                if (group) {
                    const selected = group.querySelectorAll('.checkbox-option.selected');
                    data[field.id] = Array.from(selected).map(el => el.dataset.value);
                } else {
                    data[field.id] = [];
                }
                break;
            }
        }
    });

    return data;
}

// ── Validation & submission ─────────────────────────────────────

function submitIntake() {
    // Clear previous errors
    clearErrors();

    const formData = collectFormData();
    const errors = validateIntake(formData);

    if (errors.length > 0) {
        showErrors(errors);
        // Scroll to first error
        const firstErrorField = document.getElementById(errors[0].field);
        if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }

    // Build user profile and start generation
    const userProfile = generateUserProfile(formData);
    generateCourse(userProfile);
}

function showErrors(errors) {
    const errorsDiv = document.getElementById('form-errors');
    if (!errorsDiv) return;

    errorsDiv.style.display = 'block';
    errorsDiv.innerHTML = '<ul>' + errors.map(e => `<li>${e.message}</li>`).join('') + '</ul>';

    // Highlight individual fields
    errors.forEach(e => {
        const input = document.getElementById(e.field);
        if (input) input.classList.add('error');
    });
}

function clearErrors() {
    const errorsDiv = document.getElementById('form-errors');
    if (errorsDiv) {
        errorsDiv.style.display = 'none';
        errorsDiv.innerHTML = '';
    }

    // Remove error highlights
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

// ── Generate user profile from form data ────────────────────────

function generateUserProfile(formData) {
    return {
        // Current State
        currentRole: formData.current_role || '',
        industry: formData.industry || 'other',
        aiExperience: formData.ai_experience || 'none',
        aiToolsUsed: formData.ai_tools_used || [],
        technicalBackground: formData.technical_background || 'no_coding',
        currentResponsibilities: formData.current_responsibilities || '',

        // Future State
        targetJobDescription: formData.target_job_description || '',
        whatExcitesYou: formData.what_excites_you || '',

        // Metadata
        timestamp: new Date().toISOString()
    };
}

// ── Show / Hide Sections ────────────────────────────────────────

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ── Course generation ───────────────────────────────────────────

async function generateCourse(userProfile) {
    // Show loading screen, hide welcome + intake
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('intake-screen').classList.remove('active');
    document.getElementById('loading-screen').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    startTipRotation();
    chapterTrackingInitialized = false;

    try {
        console.log('User Profile:', userProfile);

        const course = await generateLearningJourney(userProfile, updateLoadingProgress);

        stopTipRotation();

        localStorage.setItem('aiPathwayV3_course', JSON.stringify(course));
        localStorage.setItem('aiPathwayV3_profile', JSON.stringify(userProfile));

        window.location.href = 'course-viewer.html';

    } catch (error) {
        console.error('Error generating course:', error);
        stopTipRotation();
        const errorMessage = error.message || 'Unknown error occurred';
        alert(`Sorry, there was an error generating your course:\n\n${errorMessage}\n\nPlease check the console for more details and try again.`);
        // Show the form again
        document.getElementById('loading-screen').classList.remove('active');
        document.getElementById('welcome-screen').classList.add('active');
        document.getElementById('intake-screen').classList.add('active');
    }
}

// ── AI Tips Rotation ────────────────────────────────────────────

const aiTips = [
    "AI is not about replacing human intelligence \u2014 it's about augmenting it!",
    "The best AI prompts are specific, clear, and provide context.",
    "AI learns from patterns in data, just like you learn from experience.",
    "Experimenting with AI is the fastest way to master it \u2014 there's no 'wrong' question!",
    "AI can help you work smarter, not harder, in nearly every field.",
    "The future belongs to those who learn to collaborate with AI.",
    "Think of AI as your tireless research assistant, available 24/7.",
    "Great AI results come from iterative refinement \u2014 don't expect perfection on the first try!",
    "AI democratizes access to expertise and knowledge like never before.",
    "Your creativity combined with AI's capabilities is a powerful combination!"
];

let currentTipIndex = 0;
let tipRotationInterval = null;
let chapterTrackingInitialized = false;

function rotateTips() {
    const tipElement = document.getElementById('ai-tip');
    if (tipElement) {
        currentTipIndex = (currentTipIndex + 1) % aiTips.length;
        tipElement.style.opacity = '0';
        setTimeout(() => {
            tipElement.textContent = aiTips[currentTipIndex];
            tipElement.style.opacity = '1';
        }, 300);
    }
}

function startTipRotation() {
    if (!tipRotationInterval) {
        tipRotationInterval = setInterval(rotateTips, 5000);
    }
}

function stopTipRotation() {
    if (tipRotationInterval) {
        clearInterval(tipRotationInterval);
        tipRotationInterval = null;
    }
}

// ── Loading progress tracking ───────────────────────────────────

function updateStepIndicator(step, status) {
    const stepElement = document.getElementById(`step-${step}`);
    if (!stepElement) return;
    stepElement.classList.remove('active', 'completed');
    if (status === 'active') stepElement.classList.add('active');
    else if (status === 'completed') stepElement.classList.add('completed');
}

function initializeChapterTracking(chapterTitles) {
    if (chapterTrackingInitialized) return;

    const chapterProgress = document.getElementById('chapter-progress');
    const chapterList = document.getElementById('chapter-list');
    if (!chapterProgress || !chapterList) return;

    chapterProgress.style.display = 'block';
    chapterList.innerHTML = '';

    chapterTitles.forEach((title, index) => {
        const item = document.createElement('div');
        item.className = 'chapter-item';
        item.id = `chapter-item-${index}`;
        item.innerHTML = `
            <div class="chapter-item-number">${index + 1}</div>
            <div class="chapter-item-title">${title}</div>
            <div class="chapter-item-status">Waiting...</div>
        `;
        chapterList.appendChild(item);
    });

    chapterTrackingInitialized = true;
}

function updateChapterStatus(chapterIndex, status) {
    const item = document.getElementById(`chapter-item-${chapterIndex}`);
    if (!item) return;

    const statusText = item.querySelector('.chapter-item-status');
    item.classList.remove('creating', 'completed');

    if (status === 'creating') {
        item.classList.add('creating');
        if (statusText) statusText.textContent = 'Creating...';
    } else if (status === 'completed') {
        item.classList.add('completed');
        if (statusText) statusText.textContent = 'Complete \u2713';
    }
}

function updateLoadingProgress(progress, message, metadata = {}) {
    const progressBar = document.getElementById('loading-bar-fill');
    const progressText = document.getElementById('loading-percentage');
    const messageText = document.getElementById('loading-message');

    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `${Math.round(progress)}%`;
    if (messageText && message) messageText.textContent = message;

    // Update step indicators based on progress
    if (progress <= 5) {
        updateStepIndicator('analyze', 'active');
    } else if (progress <= 20) {
        updateStepIndicator('analyze', 'completed');
        updateStepIndicator('outline', 'active');
    } else if (progress <= 80) {
        updateStepIndicator('analyze', 'completed');
        updateStepIndicator('outline', 'completed');
        updateStepIndicator('chapters', 'active');

        if (metadata.chapterTitles && !chapterTrackingInitialized) {
            initializeChapterTracking(metadata.chapterTitles);
        }

        if (metadata.currentChapter !== undefined) {
            updateChapterStatus(metadata.currentChapter, 'creating');
            for (let i = 0; i < metadata.currentChapter; i++) {
                updateChapterStatus(i, 'completed');
            }
        }
    } else if (progress <= 95) {
        updateStepIndicator('analyze', 'completed');
        updateStepIndicator('outline', 'completed');
        updateStepIndicator('chapters', 'completed');
        updateStepIndicator('enrich', 'active');

        if (metadata.totalChapters) {
            for (let i = 0; i < metadata.totalChapters; i++) {
                updateChapterStatus(i, 'completed');
            }
        }
    } else if (progress < 100) {
        updateStepIndicator('analyze', 'completed');
        updateStepIndicator('outline', 'completed');
        updateStepIndicator('chapters', 'completed');
        updateStepIndicator('enrich', 'completed');
        updateStepIndicator('finalize', 'active');
    } else {
        updateStepIndicator('analyze', 'completed');
        updateStepIndicator('outline', 'completed');
        updateStepIndicator('chapters', 'completed');
        updateStepIndicator('enrich', 'completed');
        updateStepIndicator('finalize', 'completed');
    }
}
