// ====================================
// COURSE VIEWER - INTERACTIVE DISPLAY
// Renders course with prompting examples and agent prompts
// ====================================

let currentCourse = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCourse();
});

// Load course from localStorage
function loadCourse() {
    const courseData = localStorage.getItem('aiPathwayV3_course');

    if (!courseData) {
        alert('No course found. Please complete the assessment first.');
        window.location.href = 'index.html';
        return;
    }

    try {
        currentCourse = JSON.parse(courseData);
        renderCourse();
    } catch (error) {
        console.error('Error loading course:', error);
        alert('Error loading course data.');
        window.location.href = 'index.html';
    }
}

// Render the complete course
function renderCourse() {
    // Update hero section
    document.getElementById('course-title').textContent = currentCourse.title;
    document.getElementById('course-subtitle').textContent = currentCourse.subtitle;

    const totalHours = Math.ceil(currentCourse.estimatedTotalTime / 60);
    document.getElementById('total-time').textContent = `${totalHours} hours`;
    document.getElementById('chapter-count').textContent = `${currentCourse.chapters.length} chapters`;

    // Render navigation
    renderChapterNav();

    // Render first chapter
    if (currentCourse.chapters.length > 0) {
        renderChapter(0);
    }
}

// Render chapter navigation
function renderChapterNav() {
    const nav = document.getElementById('chapter-nav');
    let navHTML = '';

    currentCourse.chapters.forEach((chapter, index) => {
        const isActive = index === 0 ? 'active' : '';
        navHTML += `
            <a href="#chapter-${index}" class="chapter-link ${isActive}" data-chapter="${index}" onclick="navigateToChapter(${index}); return false;">
                <span class="chapter-number">${chapter.number}</span>
                <span>${chapter.title}</span>
            </a>
        `;
    });

    nav.innerHTML = navHTML;
}

// Navigate to specific chapter
function navigateToChapter(index) {
    // Update active state
    document.querySelectorAll('.chapter-link').forEach((link, i) => {
        if (i === index) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Render chapter
    renderChapter(index);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Render a specific chapter
function renderChapter(index) {
    const chapter = currentCourse.chapters[index];
    const content = document.getElementById('chapter-content');

    let html = `
        <div class="chapter-section" id="chapter-${index}">
            <div class="chapter-header">
                <div class="chapter-badge">Chapter ${chapter.number}</div>
                <h1 class="chapter-title-main">${chapter.title}</h1>
                <p class="chapter-objective">${chapter.learningObjective}</p>
            </div>

            ${renderIntroduction(chapter)}
            ${renderCoreConcepts(chapter)}
            ${renderPromptingExamples(chapter)}
            ${renderAgentExamples(chapter)}
            ${renderExercises(chapter)}
            ${renderKeyTakeaways(chapter)}
            ${renderMindsetReflection(chapter)}
            ${renderLatestUpdates(chapter)}
        </div>
    `;

    content.innerHTML = html;
}

// Render introduction section
function renderIntroduction(chapter) {
    if (!chapter.introduction) return '';

    return `
        <div class="content-section">
            <h2 class="section-title">
                <span class="section-icon">📖</span>
                Introduction
            </h2>
            <div class="content-text">${formatText(chapter.introduction)}</div>
        </div>
    `;
}

// Render core concepts
function renderCoreConcepts(chapter) {
    if (!chapter.coreConcepts || chapter.coreConcepts.length === 0) return '';

    let html = `
        <div class="content-section">
            <h2 class="section-title">
                <span class="section-icon">💡</span>
                Core Concepts
            </h2>
            <div class="concept-grid">
    `;

    chapter.coreConcepts.forEach(concept => {
        html += `
            <div class="concept-card">
                <h3 class="concept-title">${concept.concept}</h3>
                <p class="concept-explanation">${concept.explanation}</p>
                <div class="concept-example">
                    <strong>Example:</strong> ${concept.example}
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

// Render prompting examples with copy-to-clipboard
function renderPromptingExamples(chapter) {
    if (!chapter.promptingExamples || chapter.promptingExamples.length === 0) return '';

    let html = `
        <div class="content-section">
            <h2 class="section-title">
                <span class="section-icon">✨</span>
                Prompting Examples
            </h2>
            <div class="prompting-examples">
    `;

    chapter.promptingExamples.forEach((example, index) => {
        const promptId = `prompt-${chapter.number}-${index}`;

        html += `
            <div class="prompt-card">
                <div class="prompt-header">
                    <h3 class="prompt-title">${example.title}</h3>
                    <button class="copy-btn" onclick="copyToClipboard('${promptId}')">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        Copy
                    </button>
                </div>
                <p class="prompt-explanation">${example.explanation}</p>
                <div class="prompt-code" id="${promptId}">${escapeHtml(example.prompt)}</div>
                <div class="expected-output">
                    <div class="output-label">Expected Output</div>
                    <div class="output-text">${example.expectedOutput}</div>
                </div>
                ${example.customizationTips ? `
                    <div class="customization-tips">
                        <strong>💡 Customization Tips:</strong> ${example.customizationTips}
                    </div>
                ` : ''}
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

// Render agent prompt examples
function renderAgentExamples(chapter) {
    if (!chapter.agentPromptExamples || chapter.agentPromptExamples.length === 0) return '';

    let html = `
        <div class="content-section">
            <h2 class="section-title">
                <span class="section-icon">🤖</span>
                Agent Prompt Examples
            </h2>
            <div class="agent-examples">
    `;

    chapter.agentPromptExamples.forEach((example, index) => {
        const agentId = `agent-${chapter.number}-${index}`;

        html += `
            <div class="agent-card">
                <h3 class="agent-title">${example.title}</h3>
                <div class="agent-scenario">
                    <div class="scenario-label">Scenario</div>
                    <div class="scenario-text">${example.scenario}</div>
                </div>
                <div class="agent-role">Agent Role: ${example.agentRole}</div>
                <div style="position: relative;">
                    <button class="copy-btn copy-btn-agent" onclick="copyToClipboard('${agentId}')">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        Copy
                    </button>
                    <div class="agent-instructions" id="${agentId}">${escapeHtml(example.agentInstructions)}</div>
                </div>
                <div class="expected-behavior">
                    <div class="behavior-label">Expected Agent Behavior</div>
                    <div class="output-text">${example.expectedBehavior}</div>
                </div>
                ${example.useCase ? `
                    <div class="use-case">
                        <strong>🎯 Use Case:</strong> ${example.useCase}
                    </div>
                ` : ''}
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

// Render try it yourself exercises
function renderExercises(chapter) {
    if (!chapter.tryItYourself || chapter.tryItYourself.length === 0) return '';

    let html = `
        <div class="content-section">
            <h2 class="section-title">
                <span class="section-icon">🎯</span>
                Try It Yourself
            </h2>
            <div class="exercises">
    `;

    chapter.tryItYourself.forEach(exercise => {
        html += `
            <div class="exercise-card">
                <div class="exercise-header">
                    <h3 class="exercise-title">${exercise.title}</h3>
                    <span class="difficulty-badge ${exercise.difficulty}">${exercise.difficulty}</span>
                </div>
                <div class="exercise-instructions">${exercise.instructions}</div>
                <div class="exercise-outcome">
                    <strong>Expected Outcome:</strong> ${exercise.expectedOutcome}
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

// Render key takeaways
function renderKeyTakeaways(chapter) {
    if (!chapter.keyTakeaways || chapter.keyTakeaways.length === 0) return '';

    let html = `
        <div class="content-section">
            <h2 class="section-title">
                <span class="section-icon">⭐</span>
                Key Takeaways
            </h2>
            <div class="takeaways-list">
    `;

    chapter.keyTakeaways.forEach(takeaway => {
        html += `
            <div class="takeaway-item">
                <span class="takeaway-icon">✓</span>
                <div class="takeaway-text">${takeaway}</div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

// Render AI mindset reflection
function renderMindsetReflection(chapter) {
    if (!chapter.aiMindsetReflection) return '';

    const reflection = chapter.aiMindsetReflection;

    return `
        <div class="mindset-reflection">
            <h2 class="mindset-title">
                🌟 AI Mindset Reflection
            </h2>
            <div class="mindset-question">"${reflection.question}"</div>
            <div class="mindset-tip">
                <div class="tip-label">💪 Confidence Tip</div>
                <div class="tip-text">${reflection.confidenceTip}</div>
            </div>
            ${reflection.ethicalConsideration ? `
                <div class="mindset-tip">
                    <div class="tip-label">⚖️ Ethical Consideration</div>
                    <div class="tip-text">${reflection.ethicalConsideration}</div>
                </div>
            ` : ''}
        </div>
    `;
}

// Render latest updates
function renderLatestUpdates(chapter) {
    if (!chapter.latestUpdates || chapter.latestUpdates.length === 0) return '';

    let html = `
        <div class="content-section">
            <h2 class="section-title">
                <span class="section-icon">🔍</span>
                Latest Insights & Updates
            </h2>
            <div class="latest-updates">
    `;

    chapter.latestUpdates.forEach(update => {
        html += `
            <div class="update-card">
                <div class="update-title">${update.title}</div>
                <div class="update-summary">${update.summary}</div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    return html;
}

// Copy to clipboard function
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;

    navigator.clipboard.writeText(text).then(() => {
        showToast();
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    });
}

// Show copy confirmation toast
function showToast() {
    const toast = document.getElementById('copy-toast');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Export course to HTML
function exportCourse() {
    const exportHtml = generateExportHTML();

    const blob = new Blob([exportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'My_AI_Learning_Journey.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Your learning journey has been exported!');
}

// Generate standalone HTML for export
function generateExportHTML() {
    const course = currentCourse;

    let chaptersHTML = '';
    course.chapters.forEach((chapter, index) => {
        chaptersHTML += `
            <div class="chapter" id="chapter-${index}">
                <h2 class="chapter-number">Chapter ${chapter.number}</h2>
                <h1 class="chapter-title">${chapter.title}</h1>
                <p class="chapter-objective">${chapter.learningObjective}</p>

                ${chapter.introduction ? `
                    <div class="section">
                        <h3>Introduction</h3>
                        <p>${formatText(chapter.introduction)}</p>
                    </div>
                ` : ''}

                ${chapter.coreConcepts && chapter.coreConcepts.length > 0 ? `
                    <div class="section">
                        <h3>Core Concepts</h3>
                        ${chapter.coreConcepts.map(c => `
                            <div class="concept">
                                <h4>${c.concept}</h4>
                                <p>${c.explanation}</p>
                                <p><strong>Example:</strong> ${c.example}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                ${chapter.promptingExamples && chapter.promptingExamples.length > 0 ? `
                    <div class="section">
                        <h3>Prompting Examples</h3>
                        ${chapter.promptingExamples.map(p => `
                            <div class="prompt-example">
                                <h4>${p.title}</h4>
                                <p>${p.explanation}</p>
                                <pre>${escapeHtml(p.prompt)}</pre>
                                <p><strong>Expected Output:</strong> ${p.expectedOutput}</p>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                ${chapter.keyTakeaways && chapter.keyTakeaways.length > 0 ? `
                    <div class="section">
                        <h3>Key Takeaways</h3>
                        <ul>
                            ${chapter.keyTakeaways.map(t => `<li>${t}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${course.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Montserrat', sans-serif;
            line-height: 1.6;
            color: #1F2937;
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem;
            background: #F9FAFB;
        }
        h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 1rem; color: #8B5CF6; }
        h2 { font-size: 2rem; font-weight: 700; margin: 2rem 0 1rem; color: #7C3AED; }
        h3 { font-size: 1.5rem; font-weight: 600; margin: 1.5rem 0 1rem; color: #374151; }
        h4 { font-size: 1.25rem; font-weight: 600; margin: 1rem 0 0.5rem; color: #4B5563; }
        p { margin-bottom: 1rem; }
        .chapter {
            background: white;
            padding: 2rem;
            margin-bottom: 2rem;
            border-radius: 1rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .chapter-number {
            display: inline-block;
            background: linear-gradient(135deg, #8B5CF6, #EC4899);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 999px;
            font-size: 1rem;
            margin-bottom: 1rem;
        }
        .section { margin: 2rem 0; }
        pre {
            background: #1F2937;
            color: #E5E7EB;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1rem 0;
        }
        ul { margin-left: 2rem; margin-bottom: 1rem; }
        li { margin-bottom: 0.5rem; }
        .concept, .prompt-example {
            background: #F3F4F6;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 1rem;
        }
        @media print {
            .chapter { page-break-after: always; }
        }
    </style>
</head>
<body>
    <h1>${course.title}</h1>
    <p style="font-size: 1.25rem; color: #6B7280; margin-bottom: 2rem;">${course.subtitle}</p>
    ${chaptersHTML}
    <footer style="text-align: center; margin-top: 3rem; color: #9CA3AF;">
        <p>Generated by AI Pathway V3 &copy; 2025</p>
        <p>Your personalized AI learning journey</p>
    </footer>
</body>
</html>
    `;
}

// Helper functions
function formatText(text) {
    // Convert line breaks to <br> tags
    return text.replace(/\n/g, '<br>');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
