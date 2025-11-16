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

    // Sidebar links
    const sidebarLinks = course.chapters.map((c, i) => `
        <a href="#" class="nav-link" data-idx="${i}" onclick="showChapter(${i}); return false;">
            <span class="nav-num">${c.number}</span>
            <span class="nav-title">${c.title}</span>
        </a>
    `).join('');

    // Learner profile view
    const p = course.userProfile || {};
    const profileHTML = `
        <div class="panel">
            <h2>Learner Profile</h2>
            <div class="profile-grid">
                ${[
                    ['Primary Goal', p.primaryGoal],
                    ['AI Experience', p.aiExperience],
                    ['Technical Background', p.technicalBackground],
                    ['Learning Style', p.learningStyle],
                    ['Time Commitment', p.timeCommitment],
                    ['Biggest Barrier', p.biggestBarrier],
                    ['Immediate Application', p.immediateApplication],
                    ['AI Tools Used', Array.isArray(p.aiToolsUsed) ? p.aiToolsUsed.join(', ') : (p.aiToolsUsed || '')]
                ].map(([k,v]) => `
                    <div class="profile-item">
                        <div class="profile-key">${k}</div>
                        <div class="profile-value">${v || '-'}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Chapter views (one at a time)
    const chaptersHTML = course.chapters.map((chapter, index) => `
        <div class="chapter-view" id="view-${index}" style="display:${index===0?'block':'none'}">
            <div class="chapter-head">
                <div class="badge">Chapter ${chapter.number}</div>
                <h1>${chapter.title}</h1>
                <p class="objective">${chapter.learningObjective}</p>
            </div>
            ${chapter.introduction ? `
                <div class="section">
                    <h3>Introduction</h3>
                    <div>${formatText(chapter.introduction)}</div>
                </div>
            ` : ''}
            ${chapter.coreConcepts && chapter.coreConcepts.length ? `
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
            ${chapter.promptingExamples && chapter.promptingExamples.length ? `
                <div class="section">
                    <h3>Prompting Examples</h3>
                    ${chapter.promptingExamples.map(p => `
                        <div class="prompt-example">
                            <h4>${p.title}</h4>
                            <p>${p.explanation}</p>
                            <pre class="code">${escapeHtml(p.prompt)}</pre>
                            <p><strong>Expected Output:</strong> ${p.expectedOutput}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            ${chapter.agentPromptExamples && chapter.agentPromptExamples.length ? `
                <div class="section">
                    <h3>Agent Prompt Examples</h3>
                    ${chapter.agentPromptExamples.map(a => `
                        <div class="agent">
                            <h4>${a.title}</h4>
                            <div class="agent-row"><span class="k">Scenario</span><span class="v">${a.scenario || '-'}</span></div>
                            <div class="agent-row"><span class="k">Agent Role</span><span class="v">${a.agentRole || '-'}</span></div>
                            <div class="agent-row"><span class="k">Instructions</span></div>
                            <pre class="code">${escapeHtml(a.agentInstructions || '')}</pre>
                            <div class="agent-row"><span class="k">Expected Behavior</span><span class="v">${a.expectedBehavior || '-'}</span></div>
                            ${a.useCase ? `<div class="agent-row"><span class="k">Use Case</span><span class="v">${a.useCase}</span></div>` : ''}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            ${chapter.tryItYourself && chapter.tryItYourself.length ? `
                <div class="section">
                    <h3>Try It Yourself</h3>
                    ${chapter.tryItYourself.map(t => `
                        <div class="exercise">
                            <div class="exercise-head">
                                <h4>${t.title}</h4>
                                <span class="badge ${t.difficulty || 'beginner'}">${t.difficulty || ''}</span>
                            </div>
                            <p>${t.instructions || ''}</p>
                            <p><strong>Expected Outcome:</strong> ${t.expectedOutcome || ''}</p>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            ${chapter.aiMindsetReflection ? `
                <div class="section">
                    <h3>AI Mindset Reflection</h3>
                    <div class="reflection">
                        <div class="reflection-row"><span class="k">Question</span><span class="v">${chapter.aiMindsetReflection.question || '-'}</span></div>
                        <div class="reflection-row"><span class="k">Confidence Tip</span><span class="v">${chapter.aiMindsetReflection.confidenceTip || '-'}</span></div>
                        ${chapter.aiMindsetReflection.ethicalConsideration ? `<div class="reflection-row"><span class="k">Ethical Consideration</span><span class="v">${chapter.aiMindsetReflection.ethicalConsideration}</span></div>` : ''}
                    </div>
                </div>
            ` : ''}
            ${chapter.latestUpdates && chapter.latestUpdates.length ? `
                <div class="section">
                    <h3>Latest Insights & Updates</h3>
                    <div class="updates">
                        ${chapter.latestUpdates.map(u => `
                            <div class="update">
                                <div class="u-title">${u.title}</div>
                                <div class="u-summary">${u.summary}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            ${chapter.keyTakeaways && chapter.keyTakeaways.length ? `
                <div class="section">
                    <h3>Key Takeaways</h3>
                    <ul>${chapter.keyTakeaways.map(t => `<li>${t}</li>`).join('')}</ul>
                </div>
            ` : ''}
            <div class="pager">
                <button onclick="prevChapter()" ${index===0?'disabled':''}>Previous</button>
                <button onclick="nextChapter()" ${index===course.chapters.length-1?'disabled':''}>Next</button>
            </div>
        </div>
    `).join('');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${course.title}</title>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Montserrat',sans-serif;line-height:1.6;color:#E5E7EB;background:#0F172A}
        .layout{display:grid;grid-template-columns:300px 1fr;gap:24px;max-width:1200px;margin:0 auto;padding:24px}
        .sidebar{position:sticky;top:24px;align-self:start;background:#111827;border:1px solid #1F2937;border-radius:12px;padding:16px}
        .title{font-size:24px;font-weight:800;background:linear-gradient(135deg,#60A5FA,#F472B6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:6px}
        .subtitle{color:#9CA3AF;margin-bottom:16px}
        .tabs{display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap}
        .tab{padding:8px 12px;border-radius:999px;border:1px solid #1F2937;background:#0B1220;color:#CBD5E1;font-weight:600;cursor:pointer}
        .tab.active{background:linear-gradient(135deg,rgba(59,130,246,.15),rgba(236,72,153,.15));border-color:#334155;color:#93C5FD}
        .nav{display:flex;flex-direction:column;gap:6px}
        .nav-link{display:flex;gap:8px;align-items:center;padding:8px 10px;border-radius:8px;color:#E5E7EB;text-decoration:none;border:1px solid #0B1220;background:#0B1220}
        .nav-link:hover{background:#0B1528;border-color:#1F2937}
        .nav-num{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#1F2937;font-size:12px;font-weight:700}
        .nav-title{flex:1}
        .content{background:#0B1220;border:1px solid #1F2937;border-radius:12px;padding:20px;min-height:60vh}
        .chapter-head .badge{display:inline-block;padding:4px 10px;border-radius:999px;background:linear-gradient(135deg,#60A5FA,#F472B6);color:#0B1220;font-weight:800;margin-bottom:8px}
        .chapter-head h1{font-size:26px;margin-bottom:6px;color:#E5E7EB}
        .objective{color:#94A3B8;margin-bottom:14px}
        .section{margin:20px 0}
        pre.code{background:#0A0F1A;color:#E5E7EB;padding:12px;border-radius:8px;overflow-x:auto;white-space:pre-wrap;word-break:break-word;border:1px solid #1F2937}
        .concept,.prompt-example,.agent,.exercise,.update,.panel,.reflection{background:#0F172A;padding:12px;border-radius:8px;margin:10px 0;border:1px solid #1F2937}
        .agent-row,.reflection-row{display:flex;gap:12px;margin:6px 0}
        .k{min-width:160px;color:#93C5FD;font-weight:700}
        .v{color:#E5E7EB}
        .updates{display:grid;gap:10px}
        .u-title{font-weight:700;color:#EAB308}
        .pager{display:flex;justify-content:space-between;gap:8px;margin-top:12px}
        .pager button{padding:8px 12px;border-radius:8px;border:1px solid #1F2937;background:#0B1528;color:#E5E7EB;cursor:pointer;font-weight:600}
        .pager button[disabled]{opacity:.5;cursor:not-allowed}
        .panel{border-style:dashed}
        .profile-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:8px}
        .profile-item{background:#0B1528;border:1px solid #1F2937;border-radius:8px;padding:10px}
        .profile-key{font-weight:700;font-size:12px;color:#93C5FD;margin-bottom:4px}
        .profile-value{color:#E5E7EB}
        .badge.beginner{background:#064E3B;color:#A7F3D0;border:1px solid #065F46}
        .badge.intermediate{background:#78350F;color:#FDE68A;border:1px solid #92400E}
        .badge.advanced{background:#7F1D1D;color:#FCA5A5;border:1px solid #991B1B}
        @media (max-width: 900px){.layout{grid-template-columns:1fr}.sidebar{position:static}}
    </style>
</head>
<body>
    <div class="layout">
        <aside class="sidebar">
            <div class="title">${course.title}</div>
            <div class="subtitle">${course.subtitle}</div>
            <div class="tabs">
                <button class="tab active" id="tab-chapters" onclick="switchView('chapters')">Chapters</button>
                <button class="tab" id="tab-profile" onclick="switchView('profile')">Learner Profile</button>
            </div>
            <nav class="nav" id="nav-chapters">
                ${sidebarLinks}
            </nav>
        </aside>
        <main class="content">
            <div id="profile-view" style="display:none">
                ${profileHTML}
            </div>
            <div id="chapters-view">
                ${chaptersHTML}
            </div>
        </main>
    </div>
    <script>
        let currentIndex = 0;
        function showChapter(i){
            currentIndex = i;
            document.querySelectorAll('.chapter-view').forEach((el,idx)=>{
                el.style.display = idx===i ? 'block' : 'none';
            });
            document.querySelectorAll('.nav-link').forEach((a,idx)=>{
                a.style.background = idx===i ? 'rgba(139,92,246,0.08)' : '';
                a.style.borderColor = idx===i ? '#C7D2FE' : 'transparent';
            });
        }
        function nextChapter(){
            const total = ${course.chapters.length};
            if(currentIndex < total-1){ showChapter(currentIndex+1); }
        }
        function prevChapter(){
            if(currentIndex > 0){ showChapter(currentIndex-1); }
        }
        function switchView(view){
            const tabs = {chapters: document.getElementById('tab-chapters'), profile: document.getElementById('tab-profile')};
            const panes = {chapters: document.getElementById('chapters-view'), profile: document.getElementById('profile-view')};
            Object.keys(tabs).forEach(k=>tabs[k].classList.remove('active'));
            Object.keys(panes).forEach(k=>panes[k].style.display='none');
            tabs[view].classList.add('active');
            panes[view].style.display = 'block';
        }
    </script>
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
