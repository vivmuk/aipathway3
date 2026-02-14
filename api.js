// ====================================
// AI PATHWAY V3 - VENICE API INTEGRATION
// Gap-analysis driven, deeply personalized
// ====================================

const NUM_CHAPTERS = 10;

// Get API key from window (injected by server) or use fallback
const VENICE_API_KEY = (typeof window !== 'undefined' && window.VENICE_API_KEY)
    ? window.VENICE_API_KEY
    : 'lnWNeSg0pA_rQUooNpbfpPDBaj2vJnWol5WqKWrIEF';
const VENICE_BASE_URL = 'https://api.venice.ai/api/v1';

// Venice Models — explicit assignments
const MODELS = {
    GAP_ANALYSIS: 'openai-gpt-52',              // Deep reasoning for gap analysis
    GENERATION: 'gemini-3-flash-preview',        // Primary for outline + chapters
    GENERATION_BACKUP: 'grok-41-fast',           // Backup if primary fails
    SEARCH_SUMMARIZE: 'google-gemma-3-27b-it'    // Web search enrichment
};

// =====================================================================
// MAIN GENERATION PIPELINE
// =====================================================================

async function generateLearningJourney(userProfile, progressCallback) {
    try {
        // Step 0: Deep gap analysis (0-10%)
        progressCallback(2, 'Analyzing the gap between your current role and target position...');
        const gapAnalysis = await performGapAnalysis(userProfile);
        progressCallback(10, 'Gap analysis complete. Designing your learning path...');

        // Step 1: Generate course outline based on gap (10-20%)
        progressCallback(12, 'Creating your personalized course structure...');
        const outline = await generateCourseOutline(userProfile, gapAnalysis);
        progressCallback(20, 'Course structure ready. Building chapters...');

        if (!outline || !outline.chapters || outline.chapters.length === 0) {
            throw new Error('Failed to generate course outline. Please try again.');
        }

        // Step 2: Generate chapters IN PARALLEL (20-80%)
        const totalChapters = outline.chapters.length;

        // Pass chapter titles for tracking UI
        progressCallback(20, `Starting chapter generation (parallel)...`, {
            chapterTitles: outline.chapters.map(c => c.title)
        });

        // Use primary generation model for all chapters
        const chapterModel = MODELS.GENERATION;

        // Launch all chapter generations concurrently with a concurrency limiter
        const CHAPTER_CONCURRENCY = 3; // max parallel chapter API calls
        let completedChapters = 0;

        const chapterResults = await runWithConcurrency(
            outline.chapters.map((chapterOutline, i) => async () => {
                progressCallback(
                    20 + (i / totalChapters) * 60,
                    `Creating Chapter ${i + 1}: ${chapterOutline.title}...`,
                    { currentChapter: i, chapterTitle: chapterOutline.title }
                );

                const result = await generateChapterContent(
                    chapterOutline,
                    userProfile,
                    gapAnalysis,
                    chapterModel
                );

                completedChapters++;
                progressCallback(
                    20 + (completedChapters / totalChapters) * 60,
                    `Completed ${completedChapters}/${totalChapters} chapters...`,
                    { currentChapter: i, chapterTitle: chapterOutline.title }
                );

                return result;
            }),
            CHAPTER_CONCURRENCY
        );

        // Maintain original chapter order
        const chapters = chapterResults;

        // Step 3: Enrich with latest information IN PARALLEL (80-95%)
        progressCallback(80, 'Adding latest AI insights and resources...', { totalChapters });

        const ENRICH_CONCURRENCY = 5; // enrichment calls are lighter
        let completedEnrich = 0;

        const enrichResults = await runWithConcurrency(
            chapters.map((chapter, i) => async () => {
                const latestInfo = await fetchLatestInformation(chapter.title, userProfile.industry);
                completedEnrich++;
                progressCallback(
                    80 + (completedEnrich / chapters.length) * 15,
                    `Enriched ${completedEnrich}/${chapters.length} chapters...`
                );
                return latestInfo;
            }),
            ENRICH_CONCURRENCY
        );

        enrichResults.forEach((info, i) => {
            chapters[i].latestUpdates = info;
        });

        // Step 4: Finalize (95-100%)
        progressCallback(95, 'Finalizing your learning journey...');

        const course = {
            id: generateCourseId(),
            title: outline.title,
            subtitle: outline.subtitle,
            description: outline.description,
            userProfile: userProfile,
            gapAnalysis: gapAnalysis,
            chapters: chapters,
            generatedAt: new Date().toISOString(),
            estimatedTotalTime: calculateTotalTime(chapters)
        };

        progressCallback(100, 'Your learning journey is ready!');
        return course;

    } catch (error) {
        console.error('Error generating learning journey:', error);
        throw error;
    }
}

// =====================================================================
// STEP 0: GAP ANALYSIS — the foundation for everything
// =====================================================================

async function performGapAnalysis(userProfile) {
    const prompt = `You are an expert career coach and AI skills assessor. Perform a thorough gap analysis between this person's CURRENT capabilities and their TARGET role.

=== CURRENT STATE ===
- Current Role: ${userProfile.currentRole}
- Industry: ${userProfile.industry}
- AI Experience: ${userProfile.aiExperience}
- AI Tools Used: ${(userProfile.aiToolsUsed || []).join(', ') || 'None'}
- Technical Background: ${userProfile.technicalBackground}
- Current Responsibilities:
${userProfile.currentResponsibilities}

=== TARGET STATE (Job Description) ===
${userProfile.targetJobDescription}

${userProfile.whatExcitesYou ? `=== WHAT EXCITES THEM ABOUT THIS ROLE ===\n${userProfile.whatExcitesYou}` : ''}

=== YOUR TASK ===
Analyze DEEPLY and produce:

1. **targetRoleSummary**: A clear 2-3 sentence summary of the target role and what it demands.

2. **currentStrengths**: An array of 3-6 specific strengths this person ALREADY has that are relevant to the target role. Be specific — reference their actual responsibilities and experience. These become confidence-builders in the course.

3. **skillGaps**: An array of 5-10 specific skill/knowledge gaps between where they are now and the target role. Each gap should have:
   - "gap": The specific skill or knowledge area they need
   - "currentLevel": Honest assessment of where they are now (reference their background)
   - "targetLevel": What the job description requires
   - "priority": "critical" | "important" | "nice_to_have"
   - "aiCanHelp": A specific explanation of how AI tools/skills can help them bridge THIS gap

4. **aiOpportunities**: An array of 4-8 specific ways AI can be applied in the TARGET role. Each should have:
   - "opportunity": What the AI application is
   - "description": How it works in context of the role
   - "toolsToLearn": Specific AI tools relevant to this
   - "impact": Expected impact (time saved, quality improved, etc.)

5. **learningPriorities**: An ordered array of 8-12 learning topics, ranked by importance for bridging the gap. Each should have:
   - "topic": The learning topic
   - "reason": Why this matters for their specific transition
   - "connects_to_gaps": Which skill gaps this addresses (reference gap names)

6. **quickWins**: 3-5 things they can start doing THIS WEEK with AI to build momentum toward the target role.

7. **transitionNarrative**: A 3-4 sentence encouraging narrative about how their current experience positions them well, what the key bridge topics are, and how AI skills will be their differentiator.

Be brutally specific. Reference their ACTUAL responsibilities and the ACTUAL job description requirements. No generic advice.`;

    try {
        const response = await callVeniceAPI({
            model: MODELS.GAP_ANALYSIS,
            venice_parameters: {
                include_venice_system_prompt: false,
                strip_thinking_response: true,   // Strip thinking tokens from output
                disable_thinking: false           // REASONING MODE ON — let it think deeply
            },
            messages: [
                {
                    role: 'system',
                    content: 'You are an elite career transition strategist and AI skills consultant. You produce deeply specific, actionable gap analyses that reference exact details from the person\'s background and target job description. Never give generic advice. Always be encouraging but honest.'
                },
                { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_completion_tokens: 8000,          // More room for reasoning + output
            response_format: {
                type: 'json_schema',
                json_schema: {
                    name: 'gap_analysis',
                    strict: true,
                    schema: {
                        type: 'object',
                        properties: {
                            targetRoleSummary: { type: 'string' },
                            currentStrengths: {
                                type: 'array',
                                items: { type: 'string' }
                            },
                            skillGaps: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        gap: { type: 'string' },
                                        currentLevel: { type: 'string' },
                                        targetLevel: { type: 'string' },
                                        priority: { type: 'string' },
                                        aiCanHelp: { type: 'string' }
                                    },
                                    required: ['gap', 'currentLevel', 'targetLevel', 'priority', 'aiCanHelp'],
                                    additionalProperties: false
                                }
                            },
                            aiOpportunities: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        opportunity: { type: 'string' },
                                        description: { type: 'string' },
                                        toolsToLearn: { type: 'array', items: { type: 'string' } },
                                        impact: { type: 'string' }
                                    },
                                    required: ['opportunity', 'description', 'toolsToLearn', 'impact'],
                                    additionalProperties: false
                                }
                            },
                            learningPriorities: {
                                type: 'array',
                                items: {
                                    type: 'object',
                                    properties: {
                                        topic: { type: 'string' },
                                        reason: { type: 'string' },
                                        connects_to_gaps: { type: 'array', items: { type: 'string' } }
                                    },
                                    required: ['topic', 'reason', 'connects_to_gaps'],
                                    additionalProperties: false
                                }
                            },
                            quickWins: {
                                type: 'array',
                                items: { type: 'string' }
                            },
                            transitionNarrative: { type: 'string' }
                        },
                        required: ['targetRoleSummary', 'currentStrengths', 'skillGaps', 'aiOpportunities', 'learningPriorities', 'quickWins', 'transitionNarrative'],
                        additionalProperties: false
                    }
                }
            }
        });

        const contentText = response.choices?.[0]?.message?.content ?? '';
        const parsed = safeParseJSON(contentText);
        if (parsed) return parsed;

        // Fallback
        return {
            targetRoleSummary: 'Target role analysis pending.',
            currentStrengths: ['Your existing experience provides a strong foundation.'],
            skillGaps: [],
            aiOpportunities: [],
            learningPriorities: [],
            quickWins: ['Start experimenting with ChatGPT for your daily tasks.'],
            transitionNarrative: 'Your unique background is an asset. This course will help bridge the gap with AI skills.'
        };
    } catch (error) {
        console.error('Error performing gap analysis:', error);
        return {
            targetRoleSummary: 'Analysis in progress.',
            currentStrengths: [],
            skillGaps: [],
            aiOpportunities: [],
            learningPriorities: [],
            quickWins: [],
            transitionNarrative: 'We\'ll help you bridge the gap to your target role with AI.'
        };
    }
}

// =====================================================================
// STEP 1: COURSE OUTLINE — structured around the gap
// =====================================================================

async function generateCourseOutline(userProfile, gapAnalysis) {
    const prompt = buildOutlinePrompt(userProfile, gapAnalysis);

    try {
        const response = await callVeniceAPI({
            model: MODELS.GENERATION,
            venice_parameters: {
                include_venice_system_prompt: false,
                strip_thinking_response: true,
                disable_thinking: false
            },
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert curriculum designer who builds personalized learning journeys based on gap analyses. You create courses that systematically bridge the gap between a learner\'s current capabilities and their target role, using AI as the accelerator. Every chapter must directly address identified skill gaps and reference the learner\'s actual context.'
                },
                { role: 'user', content: prompt }
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
                                        addressesGaps: { type: 'string' },
                                        estimatedMinutes: { type: ['number', 'string', 'null'] }
                                    },
                                    required: ['number', 'title', 'learningObjective', 'addressesGaps', 'estimatedMinutes'],
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
            parsed.chapters = parsed.chapters.map((c, i) => ({
                ...c,
                number: typeof c.number === 'string' ? Number(c.number) || i + 1 : c.number,
                estimatedMinutes: typeof c.estimatedMinutes === 'string' ? Number(c.estimatedMinutes) || 30 : c.estimatedMinutes ?? 30
            }));
            return parsed;
        }
        throw new Error('Outline schema parsed empty.');
    } catch (e) {
        console.warn(`${MODELS.GENERATION} outline failed; falling back to ${MODELS.GENERATION_BACKUP}.`, e);
        const response2 = await callVeniceAPI({
            model: MODELS.GENERATION_BACKUP,
            venice_parameters: { include_venice_system_prompt: false, strip_thinking_response: true },
            messages: [
                { role: 'system', content: 'You output strictly valid JSON with no commentary.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.2,
            max_completion_tokens: 5000
        });
        const content2 = response2.choices?.[0]?.message?.content ?? '';
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

// =====================================================================
// STEP 2: CHAPTER CONTENT — deeply personalized per gap
// =====================================================================

async function generateChapterContent(chapterOutline, userProfile, gapAnalysis, modelOverride = null) {
    const prompt = buildChapterPrompt(chapterOutline, userProfile, gapAnalysis);

    const response = await callVeniceAPI({
        model: modelOverride || MODELS.GENERATION,
        venice_parameters: {
            include_venice_system_prompt: false,
            strip_thinking_response: true,
            disable_thinking: false
        },
        messages: [
            {
                role: 'system',
                content: `You are an expert AI educator creating hyper-personalized content. The learner is transitioning from "${userProfile.currentRole}" to a new target role. Every example, prompt, and exercise you create must reference their actual current work context and the specific requirements of their target job description. Make every lesson feel like it was written specifically for this one person.`
            },
            { role: 'user', content: prompt }
        ],
        temperature: 0.25,
        max_completion_tokens: 12000,
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
        console.warn('Direct JSON parse failed, trying safeParseJSON:', parseError.message);
        content = safeParseJSON(contentText);

        if (!content) {
            console.warn('Safe parse also failed, attempting recovery...');
            const jsonMatch = contentText.match(/\{[\s\S]*/);
            if (jsonMatch) {
                try {
                    let jsonStr = jsonMatch[0];
                    let openBraces = (jsonStr.match(/\{/g) || []).length;
                    let closeBraces = (jsonStr.match(/\}/g) || []).length;
                    if (openBraces > closeBraces) jsonStr += '\n' + '}'.repeat(openBraces - closeBraces);
                    content = JSON.parse(jsonStr);
                } catch (e) {
                    console.error('Recovery parse failed:', e);
                }
            }

            if (!content) {
                console.error('All JSON parsing attempts failed. Creating fallback.');
                content = {
                    introduction: contentText.substring(0, 500) || 'Content generation in progress...',
                    coreConcepts: [],
                    promptingExamples: [],
                    agentPromptExamples: [],
                    tryItYourself: [],
                    keyTakeaways: ['Please try regenerating this chapter if content appears incomplete.'],
                    aiMindsetReflection: {
                        question: 'How can you apply AI to bridge your skill gaps?',
                        confidenceTip: 'Start with small experiments and build from there.'
                    }
                };
            }
        }
    }

    if (!content || typeof content !== 'object') {
        throw new Error('Invalid chapter content structure received from API');
    }

    return { ...chapterOutline, ...content };
}

// =====================================================================
// PROMPT BUILDERS — the heart of personalization
// =====================================================================

function buildOutlinePrompt(userProfile, gapAnalysis) {
    const toolsUsed = (userProfile.aiToolsUsed || []).join(', ') || 'none yet';

    return `Design a ${NUM_CHAPTERS}-chapter AI learning journey that bridges the gap between this learner's current role and their target role.

=== LEARNER PROFILE ===
- Current Role: ${userProfile.currentRole}
- Industry: ${userProfile.industry}
- AI Experience: ${userProfile.aiExperience}
- AI Tools Used: ${toolsUsed}
- Technical Background: ${userProfile.technicalBackground}
- Current Responsibilities: ${userProfile.currentResponsibilities}

=== TARGET ROLE ===
${userProfile.targetJobDescription}

=== GAP ANALYSIS RESULTS ===
**Target Role Summary:** ${gapAnalysis.targetRoleSummary}

**Current Strengths (build on these):**
${gapAnalysis.currentStrengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

**Skill Gaps to Bridge (prioritized):**
${gapAnalysis.skillGaps.map((g, i) => `${i + 1}. [${g.priority.toUpperCase()}] ${g.gap} — Current: "${g.currentLevel}" → Target: "${g.targetLevel}" — AI can help: ${g.aiCanHelp}`).join('\n')}

**AI Opportunities in Target Role:**
${gapAnalysis.aiOpportunities.map((o, i) => `${i + 1}. ${o.opportunity}: ${o.description}`).join('\n')}

**Prioritized Learning Topics:**
${gapAnalysis.learningPriorities.map((l, i) => `${i + 1}. ${l.topic} — ${l.reason}`).join('\n')}

**Transition Narrative:** ${gapAnalysis.transitionNarrative}

=== COURSE DESIGN REQUIREMENTS ===
1. Create exactly ${NUM_CHAPTERS} progressive chapters
2. EVERY chapter must directly address one or more identified skill gaps
3. Start with foundations that leverage their current strengths, then progressively tackle harder gaps
4. Chapter 1 should give quick wins to build momentum (reference the quickWins from the analysis)
5. The final 2-3 chapters should be advanced and directly prepare them for the target role's specific requirements
6. Focus heavily on PRACTICAL APPLICATION — every chapter should include prompts they can use immediately
7. Each chapter must specify which gaps it addresses (in the "addressesGaps" field)
8. Make chapter titles specific and outcome-oriented (not generic like "Introduction to AI")
9. Reference their actual industry (${userProfile.industry}) and current role (${userProfile.currentRole}) throughout
10. The course title and subtitle should reference the transition (current → target)

Generate a course outline with:
- An engaging title that references their career transition
- A subtitle that mentions the AI-powered approach
- A 2-3 sentence description that references their specific situation
- ${NUM_CHAPTERS} chapters, each with: title, learningObjective, addressesGaps (which gaps from the analysis this chapter tackles), and estimatedMinutes`;
}

function buildChapterPrompt(chapterOutline, userProfile, gapAnalysis) {
    // Find the specific gaps this chapter addresses
    const relevantGaps = gapAnalysis.skillGaps
        .filter(g => chapterOutline.addressesGaps && chapterOutline.addressesGaps.toLowerCase().includes(g.gap.toLowerCase().substring(0, 20)))
        .slice(0, 3);

    const relevantOpportunities = gapAnalysis.aiOpportunities.slice(0, 3);

    return `Create deeply personalized content for Chapter ${chapterOutline.number}: "${chapterOutline.title}"

=== CHAPTER CONTEXT ===
**Learning Objective:** ${chapterOutline.learningObjective}
**Gaps This Chapter Addresses:** ${chapterOutline.addressesGaps}

=== LEARNER CONTEXT ===
- Transitioning FROM: ${userProfile.currentRole} (${userProfile.industry})
- Transitioning TO: The target role described below
- AI Experience: ${userProfile.aiExperience}
- Technical Background: ${userProfile.technicalBackground}
- AI Tools They've Used: ${(userProfile.aiToolsUsed || []).join(', ') || 'none yet'}
- Their Current Day-to-Day: ${userProfile.currentResponsibilities}
${userProfile.whatExcitesYou ? `- What Excites Them: ${userProfile.whatExcitesYou}` : ''}

=== TARGET JOB DESCRIPTION ===
${userProfile.targetJobDescription}

=== RELEVANT SKILL GAPS ===
${relevantGaps.length > 0
    ? relevantGaps.map(g => `- ${g.gap}: Currently "${g.currentLevel}" → Need "${g.targetLevel}" | AI can help: ${g.aiCanHelp}`).join('\n')
    : `- ${chapterOutline.addressesGaps}`
}

=== THEIR CURRENT STRENGTHS (leverage these) ===
${gapAnalysis.currentStrengths.map(s => `- ${s}`).join('\n')}

=== AI OPPORTUNITIES IN TARGET ROLE ===
${relevantOpportunities.map(o => `- ${o.opportunity}: ${o.description} (Tools: ${o.toolsToLearn.join(', ')})`).join('\n')}

=== CONTENT REQUIREMENTS ===

Generate ALL of the following sections. Make every example reference their ACTUAL work context (current responsibilities and target job requirements). No generic examples.

1. **Introduction** (2-3 substantial paragraphs):
   - Open with a specific scenario from their CURRENT role that connects to this topic
   - Explain exactly how this skill bridges to their TARGET role — reference specific job description requirements
   - End with what they'll be able to do after this chapter that they can't do now
   - Acknowledge what they already know (their strengths) and build on it

2. **Core Concepts** (3-5 concepts):
   - Each concept should be explained through the lens of their career transition
   - Use examples from their industry (${userProfile.industry}) and current responsibilities
   - Show how each concept applies differently in their current role vs. their target role
   - Keep explanations clear and jargon-free

3. **Prompting Examples** (3-4 complete, ready-to-use prompts):
   - CRITICAL: These must be DIRECTLY USABLE prompts, not descriptions of prompts
   - Each prompt should solve a REAL problem from either their current role or target role
   - Include the full prompt text they can copy-paste into ChatGPT/Claude
   - Explain what makes each prompt effective and the technique behind it
   - Show expected output so they know what good looks like
   - Include customization tips for adapting the prompt to variations of their work

4. **Agent Prompt Examples** (2-3 complete agent workflows):
   - Each agent should solve a complex, multi-step problem relevant to their target role
   - Include a detailed scenario showing when they'd use this agent
   - Write complete agent instructions they can paste into any AI tool
   - Describe the expected behavior step-by-step
   - Explain the use case in terms of their specific career transition

5. **Try It Yourself** (3-4 hands-on exercises):
   - Each exercise should use FREE AI tools they can access immediately
   - Exercises should directly relate to tasks in their current responsibilities OR their target job description
   - Include clear step-by-step instructions
   - Describe expected outcomes so they can self-assess
   - Grade difficulty: beginner → intermediate → advanced
   - At least one exercise should produce something they could show in an interview or portfolio

6. **Key Takeaways** (4-6 bullet points):
   - Summarize the most important concepts for their transition
   - Include specific next steps they can take TODAY
   - Reference how these skills show up in their target job description
   - Warn about common pitfalls specific to their experience level

7. **AI Mindset Reflection**:
   - A thought-provoking question that connects this chapter to their career goals
   - A confidence-building tip that references their existing strengths
   - An ethical consideration relevant to using AI in their target role/industry

Remember: This person is investing time to level up their career. Every word should feel like it was written specifically for someone transitioning from "${userProfile.currentRole}" to their target role. Reference specific details from their responsibilities and the job description.`;
}

// =====================================================================
// SCHEMAS
// =====================================================================

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

// =====================================================================
// LATEST INFORMATION (web search enrichment)
// =====================================================================

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
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.5,
            max_completion_tokens: 2000,
            venice_parameters: {
                enable_web_search: 'on',
                enable_web_citations: true
            }
        });

        const content = response.choices[0].message.content;
        return parseLatestUpdates(content);
    } catch (error) {
        console.error('Error fetching latest information:', error);
        return [];
    }
}

// =====================================================================
// UTILITIES
// =====================================================================

/**
 * Run async tasks with a concurrency limit.
 * @param {Array<() => Promise>} tasks - Array of functions that return promises
 * @param {number} concurrency - Max number of tasks running at once
 * @returns {Promise<Array>} Results in original order
 */
async function runWithConcurrency(tasks, concurrency) {
    const results = new Array(tasks.length);
    let nextIndex = 0;

    async function worker() {
        while (nextIndex < tasks.length) {
            const i = nextIndex++;
            results[i] = await tasks[i]();
        }
    }

    const workers = [];
    for (let w = 0; w < Math.min(concurrency, tasks.length); w++) {
        workers.push(worker());
    }

    await Promise.all(workers);
    return results;
}

async function callVeniceAPI(payload, retries = 2) {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 300000);

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

                if ((response.status === 429 || response.status >= 500) && attempt < retries) {
                    const waitTime = Math.pow(2, attempt) * 1000;
                    console.warn(`Retrying after ${waitTime}ms (attempt ${attempt + 1}/${retries + 1})`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue;
                }

                throw new Error(`Venice API error (${response.status}): ${errorMessage}`);
            }

            return await response.json();
        } catch (error) {
            if (attempt < retries && (error.name === 'AbortError' || error.name === 'TypeError' || error.message.includes('fetch'))) {
                const waitTime = Math.pow(2, attempt) * 1000;
                console.warn(`Network error, retrying after ${waitTime}ms:`, error.message);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            throw error;
        }
    }
}

function safeParseJSON(text) {
    if (!text || typeof text !== 'string') return null;
    try { return JSON.parse(text); } catch (_) {}
    const fenceMatch = text.match(/```json\s*([\s\S]*?)```/i) || text.match(/```\s*([\s\S]*?)```/i);
    if (fenceMatch && fenceMatch[1]) {
        try { return JSON.parse(fenceMatch[1].trim()); } catch (_) {}
    }
    const start = text.indexOf('{');
    if (start >= 0) {
        let depth = 0;
        for (let i = start; i < text.length; i++) {
            if (text[i] === '{') depth++;
            else if (text[i] === '}') {
                depth--;
                if (depth === 0) {
                    try { return JSON.parse(text.slice(start, i + 1)); } catch (_) { break; }
                }
            }
        }
    }
    return null;
}

function parseLatestUpdates(content) {
    const updates = [];
    const lines = content.split('\n');
    let currentUpdate = null;

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('##') || line.startsWith('**')) {
            if (currentUpdate) updates.push(currentUpdate);
            currentUpdate = {
                title: line.replace(/^##\s*/, '').replace(/^\*\*/, '').replace(/\*\*$/, ''),
                summary: ''
            };
        } else if (currentUpdate && line) {
            currentUpdate.summary += line + ' ';
        }
    });

    if (currentUpdate) updates.push(currentUpdate);
    return updates.slice(0, 5);
}

function generateCourseId() {
    return 'course_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function calculateTotalTime(chapters) {
    return chapters.reduce((total, ch) => total + (ch.estimatedMinutes || 30), 0);
}
