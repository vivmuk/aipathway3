// ====================================
// AI PATHWAY V3 - MAIN APPLICATION
// Single-page intake form + generation
// ====================================

// Initialize app
document.addEventListener('DOMContentLoaded', function () {
    renderIntakeForm();
});

// Scroll to intake section
function scrollToIntake() {
    const el = document.getElementById('intake-screen');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
