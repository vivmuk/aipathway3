// ====================================
// AI PATHWAY V3 - MAIN APPLICATION
// Quiz flow and navigation logic
// ====================================

// Global state
let currentQuestionIndex = 0;
let userAnswers = {};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('AI Pathway V3 initialized');
});

// Start the assessment
function startAssessment() {
    showSection('assessment-screen');
    currentQuestionIndex = 0;
    userAnswers = {};
    renderQuestion();
}

// Show specific section
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Render current question
function renderQuestion() {
    const question = assessmentQuestions[currentQuestionIndex];
    const questionCard = document.getElementById('question-card');

    // Update progress
    updateProgress();

    // Build question HTML
    let html = `
        <h2 class="question-title">${question.title}</h2>
        <p class="question-description">${question.description}</p>
    `;

    // Render based on question type
    if (question.type === 'single') {
        html += renderSingleChoice(question);
    } else if (question.type === 'multiple') {
        html += renderMultipleChoice(question);
    } else if (question.type === 'textarea') {
        html += renderTextarea(question);
    }

    questionCard.innerHTML = html;
    questionCard.classList.add('animate-slide-up');

    // Update navigation buttons
    updateNavigationButtons();

    // Restore previous answer if exists
    restoreAnswer(question);
}

// Render single choice question
function renderSingleChoice(question) {
    let html = '<div class="question-options">';

    question.options.forEach((option, index) => {
        const isSelected = userAnswers[question.id] === option.value;
        html += `
            <div class="option-card ${isSelected ? 'selected' : ''}"
                 onclick="selectSingleOption('${question.id}', '${option.value}', ${index})">
                <div class="option-radio"></div>
                <div class="option-content">
                    <div class="option-label">${option.label}</div>
                    <div class="option-description">${option.description}</div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    return html;
}

// Render multiple choice question
function renderMultipleChoice(question) {
    let html = '<div class="question-options">';

    question.options.forEach((option, index) => {
        const currentAnswers = userAnswers[question.id] || [];
        const isSelected = currentAnswers.includes(option.value);

        html += `
            <div class="option-card ${isSelected ? 'selected' : ''}"
                 onclick="toggleMultipleOption('${question.id}', '${option.value}', ${index})">
                <div class="option-checkbox"></div>
                <div class="option-content">
                    <div class="option-label">${option.label}</div>
                    <div class="option-description">${option.description}</div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    return html;
}

// Render textarea question
function renderTextarea(question) {
    const currentAnswer = userAnswers[question.id] || '';

    return `
        <div class="question-options">
            <textarea
                class="input-field textarea-field"
                id="textarea-${question.id}"
                placeholder="${question.placeholder || 'Enter your answer here...'}"
                oninput="updateTextareaAnswer('${question.id}')"
            >${currentAnswer}</textarea>
        </div>
    `;
}

// Select single option
function selectSingleOption(questionId, value, index) {
    userAnswers[questionId] = value;

    // Update UI
    const options = document.querySelectorAll('.option-card');
    options.forEach((opt, i) => {
        if (i === index) {
            opt.classList.add('selected');
        } else {
            opt.classList.remove('selected');
        }
    });

    updateNavigationButtons();
}

// Toggle multiple option
function toggleMultipleOption(questionId, value, index) {
    if (!userAnswers[questionId]) {
        userAnswers[questionId] = [];
    }

    const currentAnswers = userAnswers[questionId];
    const valueIndex = currentAnswers.indexOf(value);

    if (valueIndex > -1) {
        currentAnswers.splice(valueIndex, 1);
    } else {
        currentAnswers.push(value);
    }

    // Update UI
    const options = document.querySelectorAll('.option-card');
    options[index].classList.toggle('selected');

    updateNavigationButtons();
}

// Update textarea answer
function updateTextareaAnswer(questionId) {
    const textarea = document.getElementById(`textarea-${questionId}`);
    userAnswers[questionId] = textarea.value;
    updateNavigationButtons();
}

// Restore previous answer
function restoreAnswer(question) {
    if (question.type === 'single') {
        const savedValue = userAnswers[question.id];
        if (savedValue) {
            const options = document.querySelectorAll('.option-card');
            question.options.forEach((opt, i) => {
                if (opt.value === savedValue) {
                    options[i].classList.add('selected');
                }
            });
        }
    } else if (question.type === 'multiple') {
        const savedValues = userAnswers[question.id] || [];
        if (savedValues.length > 0) {
            const options = document.querySelectorAll('.option-card');
            question.options.forEach((opt, i) => {
                if (savedValues.includes(opt.value)) {
                    options[i].classList.add('selected');
                }
            });
        }
    }
}

// Update progress bar
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100;
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Question ${currentQuestionIndex + 1} of ${assessmentQuestions.length}`;
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const currentQuestion = assessmentQuestions[currentQuestionIndex];

    // Enable/disable previous button
    prevBtn.disabled = currentQuestionIndex === 0;

    // Check if current answer is valid
    const currentAnswer = userAnswers[currentQuestion.id];
    const isValid = isAnswerValid(currentQuestion, currentAnswer);

    // Update next button
    if (currentQuestionIndex === assessmentQuestions.length - 1) {
        nextBtn.textContent = 'Generate My Learning Journey';
        nextBtn.innerHTML = 'Generate My Learning Journey <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    } else {
        nextBtn.textContent = 'Next';
        nextBtn.innerHTML = 'Next <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }

    nextBtn.disabled = !isValid;
}

// Next question
function nextQuestion() {
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        // Submit and generate course
        generateCourse();
    }
}

// Previous question
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

// Generate course
async function generateCourse() {
    showSection('loading-screen');

    // Start tip rotation
    startTipRotation();

    // Reset chapter tracking
    chapterTrackingInitialized = false;

    try {
        // Generate user profile from answers
        const userProfile = generateUserProfile(userAnswers);

        console.log('User Profile:', userProfile);

        // Call Venice API to generate course
        const course = await generateLearningJourney(userProfile, updateLoadingProgress);

        // Stop tip rotation
        stopTipRotation();

        // Save course to localStorage
        localStorage.setItem('aiPathwayV3_course', JSON.stringify(course));
        localStorage.setItem('aiPathwayV3_profile', JSON.stringify(userProfile));

        // Redirect to course viewer
        window.location.href = 'course-viewer.html';

    } catch (error) {
        console.error('Error generating course:', error);
        stopTipRotation();
        const errorMessage = error.message || 'Unknown error occurred';
        alert(`Sorry, there was an error generating your course:\n\n${errorMessage}\n\nPlease check the console for more details and try again.`);
        showSection('assessment-screen');
    }
}

// AI Tips for rotation
const aiTips = [
    "AI is not about replacing human intelligence—it's about augmenting it!",
    "The best AI prompts are specific, clear, and provide context.",
    "AI learns from patterns in data, just like you learn from experience.",
    "Experimenting with AI is the fastest way to master it—there's no 'wrong' question!",
    "AI can help you work smarter, not harder, in nearly every field.",
    "The future belongs to those who learn to collaborate with AI.",
    "Think of AI as your tireless research assistant, available 24/7.",
    "Great AI results come from iterative refinement—don't expect perfection on the first try!",
    "AI democratizes access to expertise and knowledge like never before.",
    "Your creativity combined with AI's capabilities is a powerful combination!"
];

let currentTipIndex = 0;
let tipRotationInterval = null;
let chapterTrackingInitialized = false;

// Rotate AI tips
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

// Start tip rotation
function startTipRotation() {
    if (!tipRotationInterval) {
        tipRotationInterval = setInterval(rotateTips, 5000); // Rotate every 5 seconds
    }
}

// Stop tip rotation
function stopTipRotation() {
    if (tipRotationInterval) {
        clearInterval(tipRotationInterval);
        tipRotationInterval = null;
    }
}

// Update step indicators
function updateStepIndicator(step, status) {
    const stepElement = document.getElementById(`step-${step}`);
    if (!stepElement) return;

    // Remove all status classes
    stepElement.classList.remove('active', 'completed');

    // Add appropriate class
    if (status === 'active') {
        stepElement.classList.add('active');
    } else if (status === 'completed') {
        stepElement.classList.add('completed');
    }
}

// Initialize chapter tracking
function initializeChapterTracking(chapterTitles) {
    if (chapterTrackingInitialized) return;

    const chapterProgress = document.getElementById('chapter-progress');
    const chapterList = document.getElementById('chapter-list');

    if (!chapterProgress || !chapterList) return;

    // Show chapter progress section
    chapterProgress.style.display = 'block';

    // Create chapter items
    chapterList.innerHTML = '';
    chapterTitles.forEach((title, index) => {
        const chapterItem = document.createElement('div');
        chapterItem.className = 'chapter-item';
        chapterItem.id = `chapter-item-${index}`;
        chapterItem.innerHTML = `
            <div class="chapter-item-number">${index + 1}</div>
            <div class="chapter-item-title">${title}</div>
            <div class="chapter-item-status">Waiting...</div>
        `;
        chapterList.appendChild(chapterItem);
    });

    chapterTrackingInitialized = true;
}

// Update chapter status
function updateChapterStatus(chapterIndex, status, title) {
    const chapterItem = document.getElementById(`chapter-item-${chapterIndex}`);
    if (!chapterItem) return;

    const statusText = chapterItem.querySelector('.chapter-item-status');

    // Remove all status classes
    chapterItem.classList.remove('creating', 'completed');

    if (status === 'creating') {
        chapterItem.classList.add('creating');
        if (statusText) statusText.textContent = 'Creating...';
    } else if (status === 'completed') {
        chapterItem.classList.add('completed');
        if (statusText) statusText.textContent = 'Complete ✓';
    }
}

// Enhanced loading progress with step tracking
function updateLoadingProgress(progress, message, metadata = {}) {
    // Update progress bar
    const progressBar = document.getElementById('loading-bar-fill');
    const progressText = document.getElementById('loading-percentage');
    const messageText = document.getElementById('loading-message');

    if (progressBar) {
        progressBar.style.width = `${progress}%`;
    }

    if (progressText) {
        progressText.textContent = `${Math.round(progress)}%`;
    }

    if (messageText && message) {
        messageText.textContent = message;
    }

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

        // Initialize chapter tracking if we have chapter data
        if (metadata.chapterTitles && !chapterTrackingInitialized) {
            initializeChapterTracking(metadata.chapterTitles);
        }

        // Update current chapter status
        if (metadata.currentChapter !== undefined) {
            updateChapterStatus(metadata.currentChapter, 'creating', metadata.chapterTitle);

            // Mark previous chapters as completed
            for (let i = 0; i < metadata.currentChapter; i++) {
                updateChapterStatus(i, 'completed');
            }
        }
    } else if (progress <= 95) {
        updateStepIndicator('analyze', 'completed');
        updateStepIndicator('outline', 'completed');
        updateStepIndicator('chapters', 'completed');
        updateStepIndicator('enrich', 'active');

        // Mark all chapters as completed
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

// Generate user profile from answers
function generateUserProfile(answers) {
    return {
        primaryGoal: answers.primary_goal || 'general_learning',
        aiExperience: answers.ai_experience || 'complete_beginner',
        industry: answers.industry || 'other',
        specificChallenge: answers.specific_challenge || 'general_productivity',
        aiToolsUsed: answers.ai_tools_used || [],
        learningStyle: answers.learning_style || 'mixed',
        timeCommitment: '3-5 hours per week', // Default value
        technicalBackground: answers.technical_background || 'no_coding',
        biggestBarrier: answers.biggest_barrier || 'too_technical',
        immediateApplication: 'start using AI effectively', // Default value
        aiMindset: 'exploring', // Default value
        supportNeeds: ['templates', 'examples'], // Default values
        timestamp: new Date().toISOString()
    };
}
