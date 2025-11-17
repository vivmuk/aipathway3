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

    // Table of contents
    const tocHTML = course.chapters.map((c, i) => `
        <div class="toc-item">
            <span class="toc-number">${c.number}</span>
            <span class="toc-title-text">${escapeHtml(c.title)}</span>
        </div>
    `).join('');

    // Learner profile summary
    const p = course.userProfile || {};
    const profileSummary = `
        <div class="profile-summary">
            <h3>Learner Profile</h3>
            <div class="profile-details">
                ${[
                    ['Primary Goal', p.primaryGoal],
                    ['AI Experience', p.aiExperience],
                    ['Industry', p.industry || 'General'],
                    ['Technical Background', p.technicalBackground],
                    ['Learning Style', p.learningStyle]
                ].filter(([k,v]) => v).map(([k,v]) => `
                    <div class="profile-row">
                        <span class="profile-label">${k}:</span>
                        <span class="profile-value">${escapeHtml(String(v))}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // All chapters in a single document (print-friendly)
    const chaptersHTML = course.chapters.map((chapter, index) => `
        <div class="chapter-section" id="chapter-${chapter.number}">
            <div class="chapter-header">
                <div class="chapter-number">Chapter ${chapter.number}</div>
                <h1 class="chapter-title">${escapeHtml(chapter.title)}</h1>
                <p class="chapter-objective">${escapeHtml(chapter.learningObjective || '')}</p>
            </div>
            ${chapter.introduction ? `
                <div class="content-section">
                    <h2 class="section-title">Introduction</h2>
                    <div class="section-content">${formatText(escapeHtml(chapter.introduction))}</div>
                </div>
            ` : ''}
            ${chapter.coreConcepts && chapter.coreConcepts.length ? `
                <div class="content-section">
                    <h2 class="section-title">Core Concepts</h2>
                    ${chapter.coreConcepts.map(c => `
                        <div class="concept-box">
                            <h3 class="concept-title">${escapeHtml(c.concept)}</h3>
                            <p class="concept-text">${formatText(escapeHtml(c.explanation))}</p>
                            ${c.example ? `<div class="concept-example"><strong>Example:</strong> ${formatText(escapeHtml(c.example))}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            ${chapter.promptingExamples && chapter.promptingExamples.length ? `
                <div class="content-section">
                    <h2 class="section-title">Prompting Examples</h2>
                    ${chapter.promptingExamples.map(p => `
                        <div class="example-box">
                            <h3 class="example-title">${escapeHtml(p.title)}</h3>
                            <p class="example-description">${formatText(escapeHtml(p.explanation || ''))}</p>
                            <div class="code-block">
                                <pre><code>${escapeHtml(p.prompt || '')}</code></pre>
                            </div>
                            ${p.expectedOutput ? `<div class="expected-output"><strong>Expected Output:</strong> ${formatText(escapeHtml(p.expectedOutput))}</div>` : ''}
                            ${p.customizationTips ? `<div class="customization-tips"><strong>Customization Tips:</strong> ${formatText(escapeHtml(p.customizationTips))}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            ${chapter.agentPromptExamples && chapter.agentPromptExamples.length ? `
                <div class="content-section">
                    <h2 class="section-title">AI Agent Examples</h2>
                    ${chapter.agentPromptExamples.map(a => `
                        <div class="agent-box">
                            <h3 class="agent-title">${escapeHtml(a.title)}</h3>
                            ${a.scenario ? `<div class="info-row"><span class="info-label">Scenario:</span><span class="info-value">${escapeHtml(a.scenario)}</span></div>` : ''}
                            ${a.agentRole ? `<div class="info-row"><span class="info-label">Agent Role:</span><span class="info-value">${escapeHtml(a.agentRole)}</span></div>` : ''}
                            ${a.agentInstructions ? `
                                <div class="code-block">
                                    <pre><code>${escapeHtml(a.agentInstructions)}</code></pre>
                                </div>
                            ` : ''}
                            ${a.expectedBehavior ? `<div class="info-row"><span class="info-label">Expected Behavior:</span><span class="info-value">${formatText(escapeHtml(a.expectedBehavior))}</span></div>` : ''}
                            ${a.useCase ? `<div class="info-row"><span class="info-label">Use Case:</span><span class="info-value">${escapeHtml(a.useCase)}</span></div>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            ${chapter.tryItYourself && chapter.tryItYourself.length ? `
                <div class="content-section">
                    <h2 class="section-title">Hands-On Exercises</h2>
                    ${chapter.tryItYourself.map(t => `
                        <div class="exercise-box">
                            <div class="exercise-header">
                                <h3 class="exercise-title">${escapeHtml(t.title)}</h3>
                                ${t.difficulty ? `<span class="difficulty-badge ${t.difficulty}">${t.difficulty}</span>` : ''}
                            </div>
                            ${t.instructions ? `<p class="exercise-instructions">${formatText(escapeHtml(t.instructions))}</p>` : ''}
                            ${t.expectedOutcome ? `<div class="exercise-outcome"><strong>Expected Outcome:</strong> ${formatText(escapeHtml(t.expectedOutcome))}</div>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            ${chapter.keyTakeaways && chapter.keyTakeaways.length ? `
                <div class="content-section">
                    <h2 class="section-title">Key Takeaways</h2>
                    <ul class="takeaways-list">
                        ${chapter.keyTakeaways.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            ${chapter.aiMindsetReflection ? `
                <div class="content-section reflection-section">
                    <h2 class="section-title">AI Mindset Reflection</h2>
                    <div class="reflection-box">
                        ${chapter.aiMindsetReflection.question ? `<div class="reflection-item"><strong>Question:</strong> ${escapeHtml(chapter.aiMindsetReflection.question)}</div>` : ''}
                        ${chapter.aiMindsetReflection.confidenceTip ? `<div class="reflection-item"><strong>Confidence Tip:</strong> ${escapeHtml(chapter.aiMindsetReflection.confidenceTip)}</div>` : ''}
                        ${chapter.aiMindsetReflection.ethicalConsideration ? `<div class="reflection-item"><strong>Ethical Consideration:</strong> ${escapeHtml(chapter.aiMindsetReflection.ethicalConsideration)}</div>` : ''}
                    </div>
                </div>
            ` : ''}
            ${chapter.latestUpdates && chapter.latestUpdates.length ? `
                <div class="content-section">
                    <h2 class="section-title">Latest Insights & Updates</h2>
                    <div class="updates-list">
                        ${chapter.latestUpdates.map(u => `
                            <div class="update-item">
                                <h4 class="update-title">${escapeHtml(u.title || 'Update')}</h4>
                                ${u.summary ? `<p class="update-summary">${formatText(escapeHtml(u.summary))}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            ${index < course.chapters.length - 1 ? '<div class="page-break"></div>' : ''}
        </div>
    `).join('');

    const generatedDate = new Date(course.generatedAt || Date.now()).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(course.title)}</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        @media print {
            .page-break { page-break-before: always; }
            body { background: white; }
        }
        
        body {
            font-family: 'Montserrat', sans-serif;
            line-height: 1.7;
            color: #1a1a1a;
            background: #ffffff;
            font-size: 14px;
            padding: 0;
            margin: 0;
        }
        
        .document-container {
            max-width: 900px;
            margin: 0 auto;
            padding: 60px 50px;
            background: white;
        }
        
        .cover-page {
            text-align: center;
            padding: 80px 0 100px;
            border-bottom: 3px solid #1a1a1a;
            margin-bottom: 60px;
        }
        
        .cover-title {
            font-size: 42px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 16px;
            letter-spacing: -0.5px;
        }
        
        .cover-subtitle {
            font-size: 20px;
            font-weight: 400;
            color: #4a4a4a;
            margin-bottom: 40px;
        }
        
        .cover-meta {
            font-size: 14px;
            color: #6a6a6a;
            margin-top: 60px;
        }
        
        .toc-section {
            margin: 60px 0;
            padding: 40px 0;
            border-top: 1px solid #e0e0e0;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .toc-title {
            font-size: 24px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 30px;
        }
        
        .toc-item {
            display: flex;
            align-items: flex-start;
            padding: 12px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .toc-number {
            font-weight: 700;
            color: #1a1a1a;
            min-width: 40px;
            font-size: 14px;
        }
        
        .toc-title-text {
            color: #4a4a4a;
            flex: 1;
        }
        
        .profile-summary {
            background: #f8f9fa;
            padding: 30px;
            border-left: 4px solid #1a1a1a;
            margin: 40px 0;
        }
        
        .profile-summary h3 {
            font-size: 18px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 20px;
        }
        
        .profile-row {
            display: flex;
            margin-bottom: 10px;
        }
        
        .profile-label {
            font-weight: 600;
            color: #1a1a1a;
            min-width: 180px;
        }
        
        .profile-value {
            color: #4a4a4a;
        }
        
        .chapter-section {
            margin: 80px 0;
        }
        
        .chapter-header {
            border-bottom: 2px solid #1a1a1a;
            padding-bottom: 20px;
            margin-bottom: 40px;
        }
        
        .chapter-number {
            font-size: 12px;
            font-weight: 700;
            color: #6a6a6a;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
        }
        
        .chapter-title {
            font-size: 32px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 12px;
            line-height: 1.3;
        }
        
        .chapter-objective {
            font-size: 16px;
            color: #4a4a4a;
            font-weight: 400;
            line-height: 1.6;
        }
        
        .content-section {
            margin: 50px 0;
        }
        
        .section-title {
            font-size: 22px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 24px;
            padding-bottom: 8px;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .section-content {
            color: #4a4a4a;
            line-height: 1.8;
        }
        
        .section-content p {
            margin-bottom: 16px;
        }
        
        .concept-box, .example-box, .agent-box, .exercise-box {
            background: #f8f9fa;
            padding: 24px;
            margin: 24px 0;
            border-left: 3px solid #1a1a1a;
        }
        
        .concept-title, .example-title, .agent-title, .exercise-title {
            font-size: 18px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 12px;
        }
        
        .concept-text, .example-description {
            color: #4a4a4a;
            line-height: 1.8;
            margin-bottom: 12px;
        }
        
        .concept-example {
            background: white;
            padding: 12px;
            border-left: 2px solid #6a6a6a;
            margin-top: 12px;
            font-size: 13px;
            color: #4a4a4a;
        }
        
        .code-block {
            background: #1a1a1a;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
            overflow-x: auto;
        }
        
        .code-block pre {
            margin: 0;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            line-height: 1.6;
            color: #e0e0e0;
            white-space: pre-wrap;
            word-break: break-word;
        }
        
        .code-block code {
            color: #e0e0e0;
        }
        
        .expected-output, .customization-tips {
            background: white;
            padding: 16px;
            margin-top: 16px;
            border-left: 2px solid #4a4a4a;
            font-size: 14px;
            color: #4a4a4a;
        }
        
        .info-row {
            display: flex;
            margin: 12px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .info-label {
            font-weight: 600;
            color: #1a1a1a;
            min-width: 140px;
        }
        
        .info-value {
            color: #4a4a4a;
            flex: 1;
        }
        
        .exercise-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        
        .difficulty-badge {
            font-size: 11px;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .difficulty-badge.beginner {
            background: #e8f5e9;
            color: #2e7d32;
        }
        
        .difficulty-badge.intermediate {
            background: #fff3e0;
            color: #e65100;
        }
        
        .difficulty-badge.advanced {
            background: #fce4ec;
            color: #c2185b;
        }
        
        .exercise-instructions {
            color: #4a4a4a;
            line-height: 1.8;
            margin-bottom: 12px;
        }
        
        .exercise-outcome {
            background: white;
            padding: 12px;
            border-left: 2px solid #4a4a4a;
            font-size: 14px;
            color: #4a4a4a;
        }
        
        .takeaways-list {
            list-style: none;
            padding-left: 0;
        }
        
        .takeaways-list li {
            padding: 12px 0 12px 24px;
            position: relative;
            color: #4a4a4a;
            line-height: 1.8;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .takeaways-list li:before {
            content: "→";
            position: absolute;
            left: 0;
            color: #1a1a1a;
            font-weight: 700;
        }
        
        .reflection-section {
            background: #f8f9fa;
            padding: 30px;
            border-left: 4px solid #1a1a1a;
        }
        
        .reflection-box {
            margin-top: 20px;
        }
        
        .reflection-item {
            margin: 16px 0;
            color: #4a4a4a;
            line-height: 1.8;
        }
        
        .reflection-item strong {
            color: #1a1a1a;
        }
        
        .updates-list {
            margin-top: 20px;
        }
        
        .update-item {
            background: #f8f9fa;
            padding: 20px;
            margin: 16px 0;
            border-left: 3px solid #6a6a6a;
        }
        
        .update-title {
            font-size: 16px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 8px;
        }
        
        .update-summary {
            color: #4a4a4a;
            line-height: 1.8;
        }
        
        .page-break {
            page-break-before: always;
            margin: 60px 0;
        }
    </style>
</head>
<body>
    <div class="document-container">
        <div class="cover-page">
            <h1 class="cover-title">${escapeHtml(course.title)}</h1>
            <p class="cover-subtitle">${escapeHtml(course.subtitle || '')}</p>
            <div class="cover-meta">
                <p>Generated: ${generatedDate}</p>
                ${course.estimatedTotalTime ? `<p>Estimated Time: ${course.estimatedTotalTime} minutes</p>` : ''}
            </div>
        </div>
        
        ${profileSummary}
        
        <div class="toc-section">
            <h2 class="toc-title">Table of Contents</h2>
            ${tocHTML}
        </div>
        
        ${chaptersHTML}
    </div>
</body>
</html>
    `;
}

// Helper functions
function formatText(text) {
    if (!text) return '';
    // Convert line breaks to <br> tags and preserve paragraphs
    return String(text)
        .replace(/\n\n+/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<p>')
        .replace(/$/, '</p>');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}
