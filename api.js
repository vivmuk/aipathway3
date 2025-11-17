// ====================================
// AI PATHWAY V3 - VENICE API INTEGRATION
// Handles all Venice AI API calls
// ====================================

// Number of chapters to generate
const NUM_CHAPTERS = 10;

// Get API key from window (injected by server) or use fallback
// In Railway, set VENICE_API_KEY environment variable
const VENICE_API_KEY = (typeof window !== 'undefined' && window.VENICE_API_KEY) 
    ? window.VENICE_API_KEY 
    : 'lnWNeSg0pA_rQUooNpbfpPDBaj2vJnWol5WqKWrIEF'; // Fallback for local dev
const VENICE_BASE_URL = 'https://api.venice.ai/api/v1';

// Venice Models (defaults; outline may be auto-selected at runtime)
const MODELS = {
    CHAPTER_FLOW: 'zai-org-glm-4.6',                    // Default for outline (can be overridden dynamically)
    CHAPTER_CONTENT: 'openai-gpt-oss-120b',             // For chapter content generation
    SEARCH_SUMMARIZE: 'google-gemma-3-27b-it'           // For search and summarize
};

// Prefer auto-selecting an outline model that supports response schemas
let cachedOutlineModel = null;
const OUTLINE_MODEL_PREFERENCES = [
    'qwen3-235b',            // strong reasoning + schema support
    'llama-3.3-70b',         // capable general model
    'mistral-31-24b',        // vision-capable variant but often supports schema
    'venice-uncensored'      // Venice default, supports schema per docs
];

async function selectBestOutlineModel() {
    if (cachedOutlineModel) return cachedOutlineModel;
    try {
        const resp = await fetch(`${VENICE_BASE_URL}/models`, {
            headers: {
                'Authorization': `Bearer ${VENICE_API_KEY}`
            }
        });
        if (!resp.ok) {
            // Models endpoint is public, but if it fails, fallback to default
            return MODELS.CHAPTER_FLOW;
        }
        const data = await resp.json();
        const models = Array.isArray(data?.data) ? data.data : [];
        // Filter models that support structured responses
        const structured = models.filter(m => m?.model_spec?.capabilities?.supportsResponseSchema);
        if (structured.length === 0) {
            cachedOutlineModel = MODELS.CHAPTER_FLOW;
            return cachedOutlineModel;
        }
        // Try preference ordering
        for (const preferred of OUTLINE_MODEL_PREFERENCES) {
            const found = structured.find(m => m.id === preferred);
            if (found) {
                cachedOutlineModel = found.id;
                return cachedOutlineModel;
            }
        }
        // Otherwise pick first available structured model
        cachedOutlineModel = structured[0].id;
        return cachedOutlineModel;
    } catch (e) {
        console.warn('Model listing failed, using default outline model.', e);
        cachedOutlineModel = MODELS.CHAPTER_FLOW;
        return cachedOutlineModel;
    }
}

/**
 * Main function to generate complete learning journey
 */
async function generateLearningJourney(userProfile, progressCallback) {
    try {
        // Step 0: Analyze job description if provided (0-5%)
        let roleAnalysis = null;
        if (userProfile.jobDescription && userProfile.jobDescription.trim().length > 0) {
            progressCallback(2, 'Analyzing your role and how AI can enhance it...');
            roleAnalysis = await analyzeJobDescription(userProfile.jobDescription, userProfile);
        }

        // Step 1: Generate course outline (5-20%)
        progressCallback(5, 'Analyzing your profile and goals...');
        const outline = await generateCourseOutline(userProfile, roleAnalysis);

        progressCallback(20, 'Creating your personalized course structure...');

        // Validate outline
        if (!outline || !outline.chapters || outline.chapters.length === 0) {
            throw new Error('Failed to generate course outline. Please try again.');
        }

        // Step 2: Generate content for each chapter (20-80%)
        const totalChapters = outline.chapters.length;
        const chapters = [];

        for (let i = 0; i < outline.chapters.length; i++) {
            const chapterProgress = 20 + (i / totalChapters) * 60;
            progressCallback(
                chapterProgress,
                `Creating Chapter ${i + 1}: ${outline.chapters[i].title}...`
            );

            const chapterContent = await generateChapterContent(
                outline.chapters[i],
                userProfile,
                roleAnalysis
            );

            chapters.push(chapterContent);
        }

        // Step 2.5: Generate role-specific chapter if job description provided (80-85%)
        if (roleAnalysis) {
            progressCallback(80, 'Creating personalized role enhancement chapter...');
            const roleChapter = await generateRoleEnhancementChapter(userProfile, roleAnalysis);
            chapters.push(roleChapter);
        }

        // Step 3: Enrich with latest information (85-95%)
        progressCallback(85, 'Adding latest AI insights and resources...');
        const chaptersToEnrich = roleAnalysis ? chapters.slice(0, -1) : chapters; // Don't enrich role chapter

        for (let i = 0; i < chaptersToEnrich.length; i++) {
            const enrichProgress = 85 + (i / chaptersToEnrich.length) * 10;
            progressCallback(enrichProgress, `Enriching chapter ${i + 1}...`);

            const latestInfo = await fetchLatestInformation(
                chaptersToEnrich[i].title,
                userProfile.industry
            );

            chaptersToEnrich[i].latestUpdates = latestInfo;
        }

        // Step 4: Finalize (95-100%)
        progressCallback(95, 'Finalizing your learning journey...');

        const course = {
            id: generateCourseId(),
            title: outline.title,
            subtitle: outline.subtitle,
            description: outline.description,
            userProfile: userProfile,
            chapters: chapters,
            generatedAt: new Date().toISOString(),
            estimatedTotalTime: calculateTotalTime(chapters),
            roleAnalysis: roleAnalysis
        };

        progressCallback(100, 'Your learning journey is ready!');

        return course;

    } catch (error) {
        console.error('Error generating learning journey:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        throw error;
    }
}

/**
 * Analyze job description and extract role insights
 */
async function analyzeJobDescription(jobDescription, userProfile) {
    try {
        const prompt = `Analyze the following job description and determine how AI can enhance this role. Provide specific insights about:
1. Key responsibilities that can be automated or enhanced with AI
2. Specific AI use cases that would be valuable for this role
3. Types of AI agents that could be built to support this role
4. How AI will transform this role in the next 1-2 years

Job Description:
${jobDescription}

Industry: ${userProfile.industry || 'General'}
Technical Background: ${userProfile.technicalBackground || 'No coding'}

Return a structured analysis in JSON format.`;

        const response = await callVeniceAPI({
            model: await selectBestOutlineModel(),
            venice_parameters: {
                include_venice_system_prompt: false,
                strip_thinking_response: true,
                disable_thinking: false
            },
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert AI consultant who analyzes job roles and identifies how AI can enhance productivity, automate tasks, and create new capabilities. Provide specific, actionable insights.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_completion_tokens: 3000,
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'role_analysis',
                    strict: true,
                    schema: {
                        type: 'object',
                        properties: {
                            roleSummary: { type: 'string' },
                            keyResponsibilities: {
                                type: 'array',
                                items: { type: 'string' }
                            },
                            aiEnhancementOpportunities: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        responsibility: { type: 'string' },
                                        aiSolution: { type: 'string' },
                                        impact: { type: 'string' }
                                    },
                                    required: ['responsibility', 'aiSolution', 'impact'],
                                    additionalProperties: false
                                }
                            },
                            useCases: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        useCase: { type: 'string' },
                                        description: { type: 'string' },
                                        tools: { type: 'array', items: { type: 'string' } }
                                    },
                                    required: ['useCase', 'description'],
                                    additionalProperties: false
                                }
                            },
                            aiAgents: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        agentName: { type: 'string' },
                                        purpose: { type: 'string' },
                                        capabilities: { type: 'array', items: { type: 'string' } },
                                        implementation: { type: 'string' }
                                    },
                                    required: ['agentName', 'purpose', 'capabilities'],
                                    additionalProperties: false
                                }
                            },
                            transformationTimeline: { type: 'string' }
                        },
                        required: ['roleSummary', 'keyResponsibilities', 'aiEnhancementOpportunities', 'useCases', 'aiAgents'],
                        additionalProperties: false
                    }
                }
            }
        });

        const contentText = response.choices?.[0]?.message?.content ?? '';
        const parsed = safeParseJSON(contentText);
        if (parsed) {
            return parsed;
        }
        
        // Fallback if parsing fails
        return {
            roleSummary: 'AI can significantly enhance this role through automation and intelligent assistance.',
            keyResponsibilities: [],
            aiEnhancementOpportunities: [],
            useCases: [],
            aiAgents: [],
            transformationTimeline: '1-2 years'
        };
    } catch (error) {
        console.error('Error analyzing job description:', error);
        return null;
    }
}

/**
 * Generate course outline using Venice AI
 */
async function generateCourseOutline(userProfile, roleAnalysis = null) {
    const prompt = buildOutlinePrompt(userProfile, roleAnalysis);

    // First attempt: structured response (preferred)
    try {
        const outlineModel = await selectBestOutlineModel();
        const response = await callVeniceAPI({
            model: outlineModel,
            venice_parameters: {
                include_venice_system_prompt: false,
                strip_thinking_response: true,
                disable_thinking: false
            },
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert AI education designer specializing in creating personalized learning journeys for women. You understand adult learning principles, the unique challenges women face in tech, and how to make AI education accessible, practical, and empowering.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.2,
            max_completion_tokens: 5000,
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'course_outline',
                    strict: true,
                    schema: {
                        type: 'object',
                        properties: {
                            title: { type: 'string' },
                            subtitle: { type: 'string' },
                            description: { type: 'string' },
                            chapters: {
                                type: 'array',
                            minItems: NUM_CHAPTERS,
                                items: {
                                    type: 'object',
                                    properties: {
                                        number: { type: ['number', 'string'] },
                                        title: { type: 'string' },
                                        learningObjective: { type: 'string' },
                                        estimatedMinutes: { type: ['number', 'string', 'null'] }
                                    },
                                    required: ['number', 'title', 'learningObjective', 'estimatedMinutes'],
                                    additionalProperties: false
                                }
                            }
                        },
                        required: ['title', 'subtitle', 'description', 'chapters'],
                        additionalProperties: false
                    }
                }
            }
        });
        const content = response.choices?.[0]?.message?.content ?? '';
        console.debug('Raw outline response:', content);
        const parsed = safeParseJSON(content);
        if (parsed && Array.isArray(parsed.chapters)) {
            // Normalize numbers if returned as strings
            parsed.chapters = parsed.chapters.map((c, i) => ({
                ...c,
                number: typeof c.number === 'string' ? Number(c.number) || i + 1 : c.number,
                estimatedMinutes: typeof c.estimatedMinutes === 'string' ? Number(c.estimatedMinutes) || 30 : c.estimatedMinutes ?? 30
            }));
            return parsed;
        }
        throw new Error('Outline schema parsed empty.');
    } catch (e) {
        console.warn('Structured outline failed; falling back to unstructured parse.', e);
        // Fallback: no response_format, just ask for JSON but be lenient
        const response2 = await callVeniceAPI({
            model: await selectBestOutlineModel(),
            venice_parameters: {
                include_venice_system_prompt: false,
                strip_thinking_response: true
            },
            messages: [
                {
                    role: 'system',
                    content: 'You output strictly valid JSON with no commentary.'
                },
                { role: 'user', content: prompt }
            ],
            temperature: 0.2,
            max_completion_tokens: 5000
        });
        const content2 = response2.choices?.[0]?.message?.content ?? '';
        console.debug('Raw outline response (fallback):', content2);
        const parsed2 = safeParseJSON(content2);
        if (!parsed2 || !Array.isArray(parsed2.chapters)) {
            throw new Error('Failed to generate course outline. Please try again.');
        }
        parsed2.chapters = parsed2.chapters.map((c, i) => ({
            ...c,
            number: typeof c.number === 'string' ? Number(c.number) || i + 1 : c.number,
            estimatedMinutes: typeof c.estimatedMinutes === 'string' ? Number(c.estimatedMinutes) || 30 : c.estimatedMinutes ?? 30
        }));
        return parsed2;
    }
}

/**
 * Generate role-specific enhancement chapter
 */
async function generateRoleEnhancementChapter(userProfile, roleAnalysis) {
    const prompt = `Create a comprehensive chapter explaining how AI will enhance the learner's specific role.

**Role Analysis:**
- Role Summary: ${roleAnalysis.roleSummary}
- Key Responsibilities: ${roleAnalysis.keyResponsibilities.join(', ')}
- AI Enhancement Opportunities: ${JSON.stringify(roleAnalysis.aiEnhancementOpportunities)}
- Use Cases: ${JSON.stringify(roleAnalysis.useCases)}
- AI Agents: ${JSON.stringify(roleAnalysis.aiAgents)}
- Transformation Timeline: ${roleAnalysis.transformationTimeline || '1-2 years'}

**Learner Context:**
- Industry: ${userProfile.industry}
- Technical Background: ${userProfile.technicalBackground}
- AI Experience: ${userProfile.aiExperience}
- Learning Style: ${userProfile.learningStyle}

**Chapter Requirements:**

This should be Chapter ${NUM_CHAPTERS + 1} (or the final chapter) titled something like "AI-Enhanced [Role]: Transforming Your Work with AI" or "How AI Will Enhance Your Role: Use Cases and Agents You Can Build"

**Content Structure:**

1. **Introduction** (2-3 paragraphs):
   - Overview of how AI will transform their specific role
   - The opportunity to become an AI-enhanced professional
   - What they'll learn in this chapter

2. **How AI Will Enhance Your Role** (detailed section):
   - Explain each AI enhancement opportunity from the analysis
   - Show before/after scenarios for their responsibilities
   - Quantify the impact (time saved, quality improved, new capabilities)
   - Address any concerns about job security positively

3. **Specific Use Cases** (detailed for each use case):
   - For each use case from the analysis:
     * What it is and why it matters for their role
     * Step-by-step how to implement it
     * Tools and platforms needed
     * Expected outcomes and benefits
     * Real-world examples

4. **AI Agents You Can Build** (detailed for each agent):
   - For each agent from the analysis:
     * Agent name and purpose
     * What it does and how it works
     * Step-by-step agent instructions/prompt
     * Capabilities and limitations
     * Implementation guide (no-code or low-code options)
     * Expected behavior and outputs

5. **Getting Started: Your AI Transformation Roadmap**:
   - Prioritized list of AI enhancements to implement
   - Timeline for adoption (30 days, 60 days, 90 days)
   - Quick wins vs. longer-term projects
   - Resources and tools needed

6. **Try It Yourself** (3-4 exercises):
   - Build your first role-specific AI agent
   - Implement a use case from the analysis
   - Create prompts for your daily tasks
   - Measure and track improvements

7. **Key Takeaways**:
   - Summary of how AI enhances their role
   - Next steps for continued learning
   - How to stay current with AI developments

8. **AI Mindset Reflection**:
   - Embracing change and innovation
   - Building confidence as an AI-enhanced professional
   - Ethical considerations for AI in their role

Make it:
- Highly specific to their actual role and responsibilities
- Actionable with clear implementation steps
- Encouraging and confidence-building
- Practical with real examples they can use immediately`;

    const response = await callVeniceAPI({
        model: await selectBestOutlineModel(),
        venice_parameters: {
            include_venice_system_prompt: false,
            strip_thinking_response: true,
            disable_thinking: false
        },
        messages: [
            {
                role: 'system',
                content: 'You are an expert AI consultant and educator specializing in helping professionals understand how AI can transform their specific roles. You provide actionable, role-specific guidance that empowers learners to become AI-enhanced professionals.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.3,
        max_completion_tokens: 15000, // Increased for role chapter
        response_format: {
            type: 'json_schema',
            json_schema: {
                name: 'role_enhancement_chapter',
                strict: true,
                schema: getChapterContentSchema()
            }
        }
    });

    const contentText = response.choices[0].message.content;
    let content;
    
    // Try multiple parsing strategies (same as generateChapterContent)
    try {
        content = JSON.parse(contentText);
    } catch (parseError) {
        console.warn('Direct JSON parse failed for role chapter, trying safeParseJSON:', parseError.message);
        content = safeParseJSON(contentText);
        
        if (!content) {
            console.error('Failed to parse role chapter content JSON:', contentText);
            // Create fallback structure
            content = {
                introduction: 'AI can significantly enhance your role through automation and intelligent assistance.',
                coreConcepts: [],
                promptingExamples: [],
                agentPromptExamples: [],
                tryItYourself: [],
                keyTakeaways: ['AI will transform your role in the coming years.', 'Start with small implementations and scale up.'],
                aiMindsetReflection: {
                    question: 'How will you embrace AI in your role?',
                    confidenceTip: 'Focus on augmenting your capabilities, not replacing them.'
                }
            };
        }
    }

    // Create chapter outline structure
    return {
        number: NUM_CHAPTERS + 1,
        title: `How AI Will Enhance Your Role: Use Cases and Agents You Can Build`,
        learningObjective: `Understand how AI can transform your specific role, identify practical use cases, and learn to build AI agents that enhance your daily work.`,
        estimatedMinutes: 45,
        ...content
    };
}

/**
 * Generate detailed chapter content
 */
async function generateChapterContent(chapterOutline, userProfile, roleAnalysis = null) {
    const prompt = buildChapterPrompt(chapterOutline, userProfile, roleAnalysis);

    const response = await callVeniceAPI({
        model: await selectBestOutlineModel(),
        venice_parameters: {
            include_venice_system_prompt: false,
            strip_thinking_response: true,
            disable_thinking: false
        },
        messages: [
            {
                role: 'system',
                content: 'You are an expert AI educator creating practical, hands-on content for women learning AI. Focus on real-world applications, clear prompting examples, and agent workflows. Make AI feel accessible and empowering, not intimidating.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        temperature: 0.25,
        max_completion_tokens: 12000, // Increased to prevent truncation
        response_format: {
            type: 'json_schema',
            json_schema: {
                name: 'chapter_content',
                strict: true,
                schema: getChapterContentSchema()
            }
        }
    });

    const contentText = response.choices[0].message.content;
    let content;
    
    // Try multiple parsing strategies
    try {
        // First, try direct parsing
        content = JSON.parse(contentText);
    } catch (parseError) {
        console.warn('Direct JSON parse failed, trying safeParseJSON:', parseError.message);
        
        // Try safeParseJSON which handles code blocks and partial JSON
        content = safeParseJSON(contentText);
        
        if (!content) {
            // If still failing, try to extract JSON from truncated response
            console.warn('Safe parse also failed, attempting recovery...');
            
            // Try to find and extract a valid JSON object even if truncated
            const jsonMatch = contentText.match(/\{[\s\S]*/);
            if (jsonMatch) {
                try {
                    // Try to close any unclosed brackets/braces
                    let jsonStr = jsonMatch[0];
                    let openBraces = (jsonStr.match(/\{/g) || []).length;
                    let closeBraces = (jsonStr.match(/\}/g) || []).length;
                    
                    // If we're missing closing braces, try to add them
                    if (openBraces > closeBraces) {
                        jsonStr += '\n' + '}'.repeat(openBraces - closeBraces);
                    }
                    
                    // Try parsing arrays if object fails
                    if (jsonStr.includes('"chapters"') || jsonStr.includes('"coreConcepts"')) {
                        content = JSON.parse(jsonStr);
                    }
                } catch (e) {
                    console.error('Recovery parse failed:', e);
                }
            }
            
            // If all parsing fails, create a fallback structure
            if (!content) {
                console.error('All JSON parsing attempts failed. Creating fallback structure.');
                console.error('Response length:', contentText.length);
                console.error('Response preview:', contentText.substring(0, 500));
                
                // Create a minimal valid structure to prevent complete failure
                content = {
                    introduction: contentText.substring(0, 500) || 'Content generation in progress...',
                    coreConcepts: [],
                    promptingExamples: [],
                    agentPromptExamples: [],
                    tryItYourself: [],
                    keyTakeaways: ['Please try regenerating this chapter if content appears incomplete.'],
                    aiMindsetReflection: {
                        question: 'How can you apply AI to enhance your work?',
                        confidenceTip: 'Start with small experiments and build from there.'
                    }
                };
            }
        }
    }

    // Validate content structure
    if (!content || typeof content !== 'object') {
        throw new Error('Invalid chapter content structure received from API');
    }

    return {
        ...chapterOutline,
        ...content
    };
}

/**
 * Try to parse JSON robustly by extracting the first valid JSON object if needed
 */
function safeParseJSON(text) {
    if (!text || typeof text !== 'string') return null;
    // Fast path
    try {
        return JSON.parse(text);
    } catch (_) {}
    // Extract from code fences ```json ... ```
    const fenceMatch = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/i);
    if (fenceMatch && fenceMatch[1]) {
        try {
            return JSON.parse(fenceMatch[1].trim());
        } catch (_) {}
    }
    // Extract first {...} balanced block
    const start = text.indexOf('{');
    if (start >= 0) {
        let depth = 0;
        for (let i = start; i < text.length; i++) {
            const ch = text[i];
            if (ch === '{') depth++;
            else if (ch === '}') {
                depth--;
                if (depth === 0) {
                    const candidate = text.slice(start, i + 1);
                    try {
                        return JSON.parse(candidate);
                    } catch (_) {
                        break;
                    }
                }
            }
        }
    }
    return null;
}

/**
 * Fetch latest information using web search
 */
async function fetchLatestInformation(chapterTitle, industry) {
    try {
        const prompt = `Search for the latest developments and best practices related to "${chapterTitle}" in the context of AI and ${industry}. Focus on:
        - Recent tool releases or updates
        - Practical applications and case studies
        - Best practices and tips
        - Common pitfalls to avoid

        Provide 3-5 relevant updates with titles and summaries.`;

        const response = await callVeniceAPI({
            model: MODELS.SEARCH_SUMMARIZE,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.5,
            max_completion_tokens: 2000,
            venice_parameters: {
                enable_web_search: 'on',
                enable_web_citations: true
            }
        });

        // Parse response to extract updates
        const content = response.choices[0].message.content;
        return parseLatestUpdates(content);

    } catch (error) {
        console.error('Error fetching latest information:', error);
        return [];
    }
}

/**
 * Call Venice AI API with retry logic
 */
async function callVeniceAPI(payload, retries = 2) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            // Create abort controller for timeout (compatible with older browsers)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes
            
            const response = await fetch(`${VENICE_BASE_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${VENICE_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorMessage = `Venice API error: ${response.statusText}`;
                try {
                    const error = await response.json();
                    const details = error.details || {};
                    const issues = Array.isArray(error.issues) ? error.issues.map(i => i?.message || JSON.stringify(i)).join(' | ') : '';
                    errorMessage = error.error?.message || error.message || details.message || issues || response.statusText;
                    console.error('API Error Response:', error);
                } catch (e) {
                    const text = await response.text();
                    console.error('API Error Text:', text);
                    errorMessage = text || response.statusText;
                }
                
                // Retry on 429 (rate limit) or 500+ errors
                if ((response.status === 429 || response.status >= 500) && attempt < retries) {
                    const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
                    console.warn(`Retrying after ${waitTime}ms (attempt ${attempt + 1}/${retries + 1})`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue;
                }
                
                throw new Error(`Venice API error (${response.status}): ${errorMessage}`);
            }

            return await response.json();
        } catch (error) {
            // Retry on network errors or timeouts
            if (attempt < retries && (error.name === 'AbortError' || error.name === 'TypeError' || error.message.includes('fetch'))) {
                const waitTime = Math.pow(2, attempt) * 1000;
                console.warn(`Network error, retrying after ${waitTime}ms (attempt ${attempt + 1}/${retries + 1}):`, error.message);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            throw error;
        }
    }
}

/**
 * Build outline generation prompt
 */
function buildOutlinePrompt(userProfile, roleAnalysis = null) {
    const industryContext = userProfile.industry ? `in the ${userProfile.industry} industry` : '';
    const toolsUsed = Array.isArray(userProfile.aiToolsUsed) && userProfile.aiToolsUsed.length > 0
        ? userProfile.aiToolsUsed.join(', ') : 'none yet';
    const supportNeeds = Array.isArray(userProfile.supportNeeds) && userProfile.supportNeeds.length > 0
        ? userProfile.supportNeeds.join(', ') : 'general guidance';

    let roleContext = '';
    if (roleAnalysis) {
        roleContext = `

**Role-Specific Context:**
- Role Summary: ${roleAnalysis.roleSummary || 'AI-enhanced professional role'}
- Key Responsibilities: ${roleAnalysis.keyResponsibilities?.join(', ') || 'Various professional tasks'}
- AI Enhancement Opportunities: ${roleAnalysis.aiEnhancementOpportunities?.length || 0} identified areas
- Use Cases: ${roleAnalysis.useCases?.length || 0} specific AI applications
- AI Agents: ${roleAnalysis.aiAgents?.length || 0} agents that can be built

IMPORTANT: Use this role analysis to personalize ALL chapters. Reference specific responsibilities, use cases, and agents throughout the course to make it highly relevant to their actual work.`;
    }

    return `Create a personalized ${NUM_CHAPTERS}-chapter Generative AI learning journey ${industryContext}.

**Learner Profile:**
- Primary Goal: ${userProfile.primaryGoal}
- Current AI Experience: ${userProfile.aiExperience}
- Technical Background: ${userProfile.technicalBackground}
- Learning Style: ${userProfile.learningStyle}
- Time Commitment: ${userProfile.timeCommitment}
- AI Mindset: ${userProfile.aiMindset}
- Biggest Barrier: ${userProfile.biggestBarrier}
- Industry: ${userProfile.industry}
- AI Tools Used: ${toolsUsed}
- Specific Challenge: ${userProfile.specificChallenge || 'general productivity'}
- Immediate Application: ${userProfile.immediateApplication || 'start using AI effectively'}
- Support Needs: ${supportNeeds}${roleContext}

**Requirements:**
1. Create exactly ${NUM_CHAPTERS} progressive chapters
2. Each chapter should build on the previous one
3. Focus heavily on PRACTICAL APPLICATION with real prompting examples
4. Address their specific challenge: ${userProfile.specificChallenge || 'general productivity'}
5. Focus on their immediate application goal: ${userProfile.immediateApplication || 'start using AI'}
6. Include hands-on exercises using the AI tools they've used: ${toolsUsed}
7. Make it relevant to their ${userProfile.industry || 'work'} industry
8. Address their biggest barrier: ${userProfile.biggestBarrier || 'getting started'}
9. Match their learning style: ${userProfile.learningStyle || 'mixed'}
10. Provide the support they need: ${supportNeeds}
11. Build confidence while addressing their barriers
12. Emphasize the "AI mindset" of experimentation and iteration${roleAnalysis ? '\n13. Personalize examples and exercises to their specific role and responsibilities' : ''}

Generate a course outline with:
- Engaging course title and subtitle
- Brief description (2-3 sentences)
- ${NUM_CHAPTERS} chapters with titles, learning objectives, and estimated time (in minutes)`;
}

/**
 * Build chapter content generation prompt
 */
function buildChapterPrompt(chapterOutline, userProfile, roleAnalysis = null) {
    let roleContext = '';
    if (roleAnalysis) {
        roleContext = `
- Role Summary: ${roleAnalysis.roleSummary || 'Professional role'}
- Key Responsibilities: ${roleAnalysis.keyResponsibilities?.slice(0, 5).join(', ') || 'Various tasks'}
- AI Use Cases for This Role: ${roleAnalysis.useCases?.slice(0, 3).map(uc => uc.useCase).join(', ') || 'Multiple applications'}`;
    }

    return `Create detailed, practical content for Chapter ${chapterOutline.number}: ${chapterOutline.title}

**Learning Objective:** ${chapterOutline.learningObjective}

**Complete Learner Context:**
- Primary Goal: ${userProfile.primaryGoal}
- Industry: ${userProfile.industry}
- AI Experience: ${userProfile.aiExperience}
- Technical Background: ${userProfile.technicalBackground}
- Learning Style: ${userProfile.learningStyle}
- Time Commitment: ${userProfile.timeCommitment}
- AI Tools Used: ${Array.isArray(userProfile.aiToolsUsed) ? userProfile.aiToolsUsed.join(', ') : 'none yet'}
- Specific Challenge: ${userProfile.specificChallenge || 'general productivity'}
- Immediate Application: ${userProfile.immediateApplication || 'start using AI'}
- Biggest Barrier: ${userProfile.biggestBarrier || 'getting started'}
- AI Mindset: ${userProfile.aiMindset || 'exploring'}
- Support Needs: ${Array.isArray(userProfile.supportNeeds) ? userProfile.supportNeeds.join(', ') : 'general guidance'}${roleContext}

**Content Requirements:**

1. **Introduction** (2-3 paragraphs):
   - Why this matters for their goals${roleAnalysis ? ' and their specific role' : ''}
   - Real-world scenario from their industry${roleAnalysis ? ' or their actual responsibilities' : ''}
   - What they'll be able to do after this chapter${roleAnalysis ? ' in their role' : ''}

2. **Core Concepts** (3-5 key concepts):
   - Clear, jargon-free explanations
   - Relevant examples from their industry${roleAnalysis ? ' and role-specific applications' : ''}
   - Visual analogies where helpful

3. **Prompting Examples** (3-4 examples):
   - Specific prompts they can copy and use${roleAnalysis ? ' - prioritize examples relevant to their role responsibilities' : ''}
   - What each prompt does and why it works
   - Expected output/results
   - Tips for customization

4. **Agent Prompt Examples** (2-3 examples):
   - More complex agent workflows${roleAnalysis ? ' - include at least one agent example relevant to their role' : ''}
   - Step-by-step agent instructions
   - Expected agent behavior
   - Use cases and applications${roleAnalysis ? ' specific to their work' : ''}

5. **Try It Yourself** (3-4 exercises):
   - Hands-on activities using free AI tools${roleAnalysis ? ' - include exercises that directly relate to their job responsibilities' : ''}
   - Clear instructions and expected outcomes
   - Difficulty level (beginner/intermediate/advanced)
   - Connection to their immediate goals${roleAnalysis ? ' and role' : ''}

6. **Key Takeaways** (4-6 bullet points):
   - Most important concepts to remember
   - Actionable next steps${roleAnalysis ? ' for their specific role' : ''}
   - Common pitfalls to avoid

7. **AI Mindset Reflection**:
   - Question to encourage experimentation
   - Tip for building confidence
   - Ethical consideration if relevant

Make the content:
- Conversational and encouraging
- Practical and immediately applicable${roleAnalysis ? ' to their actual work' : ''}
- Specific to their industry${roleAnalysis ? ' and role' : ''} when possible
- Confidence-building, not intimidating
- Rich with real examples they can try today${roleAnalysis ? ' in their role' : ''}`;
}

/**
 * Get chapter content JSON schema
 */
function getChapterContentSchema() {
    return {
        type: 'object',
        properties: {
            introduction: { type: 'string' },
            coreConcepts: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        concept: { type: 'string' },
                        explanation: { type: 'string' },
                        example: { type: 'string' }
                    },
                    required: ['concept', 'explanation', 'example'],
                    additionalProperties: false
                }
            },
            promptingExamples: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        prompt: { type: 'string' },
                        explanation: { type: 'string' },
                        expectedOutput: { type: 'string' },
                        customizationTips: { type: 'string' }
                    },
                    required: ['title', 'prompt', 'explanation', 'expectedOutput'],
                    additionalProperties: false
                }
            },
            agentPromptExamples: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        scenario: { type: 'string' },
                        agentRole: { type: 'string' },
                        agentInstructions: { type: 'string' },
                        expectedBehavior: { type: 'string' },
                        useCase: { type: 'string' }
                    },
                    required: ['title', 'scenario', 'agentRole', 'agentInstructions', 'expectedBehavior'],
                    additionalProperties: false
                }
            },
            tryItYourself: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        instructions: { type: 'string' },
                        expectedOutcome: { type: 'string' },
                        difficulty: {
                            type: 'string',
                            enum: ['beginner', 'intermediate', 'advanced']
                        }
                    },
                    required: ['title', 'instructions', 'expectedOutcome', 'difficulty'],
                    additionalProperties: false
                }
            },
            keyTakeaways: {
                type: 'array',
                items: { type: 'string' }
            },
            aiMindsetReflection: {
                type: 'object',
                properties: {
                    question: { type: 'string' },
                    confidenceTip: { type: 'string' },
                    ethicalConsideration: { type: 'string' }
                },
                required: ['question', 'confidenceTip'],
                additionalProperties: false
            }
        },
        required: ['introduction', 'coreConcepts', 'promptingExamples', 'agentPromptExamples', 'tryItYourself', 'keyTakeaways', 'aiMindsetReflection'],
        additionalProperties: false
    };
}

/**
 * Parse latest updates from AI response
 */
function parseLatestUpdates(content) {
    // Simple parsing - in production, this would be more sophisticated
    const updates = [];
    const lines = content.split('\n');
    let currentUpdate = null;

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('##') || line.startsWith('**')) {
            if (currentUpdate) {
                updates.push(currentUpdate);
            }
            currentUpdate = {
                title: line.replace(/^##\s*/, '').replace(/^\*\*/, '').replace(/\*\*$/, ''),
                summary: ''
            };
        } else if (currentUpdate && line) {
            currentUpdate.summary += line + ' ';
        }
    });

    if (currentUpdate) {
        updates.push(currentUpdate);
    }

    return updates.slice(0, 5); // Return max 5 updates
}

/**
 * Helper functions
 */
function generateCourseId() {
    return 'course_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function calculateTotalTime(chapters) {
    return chapters.reduce((total, chapter) => {
        return total + (chapter.estimatedMinutes || 30);
    }, 0);
}
