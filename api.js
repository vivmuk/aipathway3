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
        // Step 1: Generate course outline (0-20%)
        progressCallback(5, 'Analyzing your profile and goals...');
        const outline = await generateCourseOutline(userProfile);

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
                userProfile
            );

            chapters.push(chapterContent);
        }

        // Step 3: Enrich with latest information (80-95%)
        progressCallback(85, 'Adding latest AI insights and resources...');

        for (let i = 0; i < chapters.length; i++) {
            const enrichProgress = 85 + (i / totalChapters) * 10;
            progressCallback(enrichProgress, `Enriching chapter ${i + 1}...`);

            const latestInfo = await fetchLatestInformation(
                chapters[i].title,
                userProfile.industry
            );

            chapters[i].latestUpdates = latestInfo;
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
            estimatedTotalTime: calculateTotalTime(chapters)
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
 * Generate course outline using Venice AI
 */
async function generateCourseOutline(userProfile) {
    const prompt = buildOutlinePrompt(userProfile);

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
 * Generate detailed chapter content
 */
async function generateChapterContent(chapterOutline, userProfile) {
    const prompt = buildChapterPrompt(chapterOutline, userProfile);

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
        max_completion_tokens: 8000,
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
    try {
        content = JSON.parse(contentText);
    } catch (parseError) {
        console.error('Failed to parse chapter content JSON:', contentText);
        throw new Error(`Failed to parse chapter content: ${parseError.message}. Response: ${contentText.substring(0, 200)}...`);
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
 * Call Venice AI API
 */
async function callVeniceAPI(payload) {
    const response = await fetch(`${VENICE_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${VENICE_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

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
        throw new Error(`Venice API error (${response.status}): ${errorMessage}`);
    }

    return await response.json();
}

/**
 * Build outline generation prompt
 */
function buildOutlinePrompt(userProfile) {
    const industryContext = userProfile.industry ? `in the ${userProfile.industry} industry` : '';
    const toolsUsed = Array.isArray(userProfile.aiToolsUsed) && userProfile.aiToolsUsed.length > 0
        ? userProfile.aiToolsUsed.join(', ') : 'none yet';
    const supportNeeds = Array.isArray(userProfile.supportNeeds) && userProfile.supportNeeds.length > 0
        ? userProfile.supportNeeds.join(', ') : 'general guidance';

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
- Support Needs: ${supportNeeds}

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
12. Emphasize the "AI mindset" of experimentation and iteration

Generate a course outline with:
- Engaging course title and subtitle
- Brief description (2-3 sentences)
- ${NUM_CHAPTERS} chapters with titles, learning objectives, and estimated time (in minutes)`;
}

/**
 * Build chapter content generation prompt
 */
function buildChapterPrompt(chapterOutline, userProfile) {
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
- Support Needs: ${Array.isArray(userProfile.supportNeeds) ? userProfile.supportNeeds.join(', ') : 'general guidance'}

**Content Requirements:**

1. **Introduction** (2-3 paragraphs):
   - Why this matters for their goals
   - Real-world scenario from their industry
   - What they'll be able to do after this chapter

2. **Core Concepts** (3-5 key concepts):
   - Clear, jargon-free explanations
   - Relevant examples from their industry
   - Visual analogies where helpful

3. **Prompting Examples** (3-4 examples):
   - Specific prompts they can copy and use
   - What each prompt does and why it works
   - Expected output/results
   - Tips for customization

4. **Agent Prompt Examples** (2-3 examples):
   - More complex agent workflows
   - Step-by-step agent instructions
   - Expected agent behavior
   - Use cases and applications

5. **Try It Yourself** (3-4 exercises):
   - Hands-on activities using free AI tools
   - Clear instructions and expected outcomes
   - Difficulty level (beginner/intermediate/advanced)
   - Connection to their immediate goals

6. **Key Takeaways** (4-6 bullet points):
   - Most important concepts to remember
   - Actionable next steps
   - Common pitfalls to avoid

7. **AI Mindset Reflection**:
   - Question to encourage experimentation
   - Tip for building confidence
   - Ethical consideration if relevant

Make the content:
- Conversational and encouraging
- Practical and immediately applicable
- Specific to their industry when possible
- Confidence-building, not intimidating
- Rich with real examples they can try today`;
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
