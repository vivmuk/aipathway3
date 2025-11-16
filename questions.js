// ====================================
// AI PATHWAY V3 - ASSESSMENT QUESTIONS
// Personalized questions for AI learning
// ====================================

const assessmentQuestions = [
    // Question 1: Primary Goal
    {
        id: 'primary_goal',
        type: 'single',
        title: 'What is your primary goal for learning AI?',
        description: 'This helps us understand what matters most to you in your AI journey.',
        options: [
            {
                value: 'career_advancement',
                label: 'Career Advancement',
                description: 'I want to advance in my current career or transition to a new role using AI skills'
            },
            {
                value: 'entrepreneurship',
                label: 'Entrepreneurship',
                description: 'I want to start or grow my own business using AI'
            },
            {
                value: 'personal_productivity',
                label: 'Personal Productivity',
                description: 'I want to use AI to be more efficient in my daily work and life'
            },
            {
                value: 'industry_transformation',
                label: 'Industry Transformation',
                description: 'I want to lead AI initiatives and transformation in my organization'
            },
            {
                value: 'lifelong_learning',
                label: 'Lifelong Learning',
                description: 'I\'m curious and want to understand how AI works and its impact on society'
            }
        ]
    },

    // Question 2: Current AI Experience
    {
        id: 'ai_experience',
        type: 'single',
        title: 'How would you describe your current AI knowledge?',
        description: 'Be honest - this helps us create the perfect starting point for you.',
        options: [
            {
                value: 'complete_beginner',
                label: 'Complete Beginner',
                description: 'I\'ve heard about AI but haven\'t used any AI tools yet'
            },
            {
                value: 'curious_explorer',
                label: 'Curious Explorer',
                description: 'I\'ve tried ChatGPT or similar tools a few times'
            },
            {
                value: 'regular_user',
                label: 'Regular User',
                description: 'I use AI tools regularly but want to understand them better'
            },
            {
                value: 'skilled_practitioner',
                label: 'Skilled Practitioner',
                description: 'I understand AI concepts and use advanced features'
            },
            {
                value: 'expert',
                label: 'Expert',
                description: 'I build AI solutions or work professionally with AI technologies'
            }
        ]
    },

    // Question 3: Current Role/Industry
    {
        id: 'industry',
        type: 'single',
        title: 'Which industry or sector best describes your work?',
        description: 'We\'ll tailor examples and use cases to your industry.',
        options: [
            {
                value: 'healthcare',
                label: 'Healthcare & Life Sciences',
                description: 'Medical, pharmaceutical, biotech, or health services'
            },
            {
                value: 'education',
                label: 'Education & Training',
                description: 'Teaching, training, instructional design, or EdTech'
            },
            {
                value: 'technology',
                label: 'Technology & Software',
                description: 'Software development, IT, SaaS, or tech products'
            },
            {
                value: 'business_consulting',
                label: 'Business & Consulting',
                description: 'Management consulting, strategy, or professional services'
            },
            {
                value: 'marketing_creative',
                label: 'Marketing & Creative',
                description: 'Marketing, advertising, content creation, or design'
            },
            {
                value: 'finance',
                label: 'Finance & Banking',
                description: 'Banking, investment, accounting, or financial services'
            },
            {
                value: 'nonprofit_social',
                label: 'Nonprofit & Social Impact',
                description: 'NGO, social enterprise, or community development'
            },
            {
                value: 'other',
                label: 'Other / Multiple Industries',
                description: 'I work across industries or in a different sector'
            }
        ]
    },

    // Question 4: Specific Challenge or Application
    {
        id: 'specific_challenge',
        type: 'single',
        title: 'What specific problem or task do you hope to solve with AI?',
        description: 'Choose the challenge that resonates most with your current needs.',
        options: [
            {
                value: 'content_creation',
                label: 'Content Creation & Writing',
                description: 'Generate reports, emails, articles, or marketing content faster'
            },
            {
                value: 'data_analysis',
                label: 'Data Analysis & Insights',
                description: 'Analyze data, extract insights, and make better decisions'
            },
            {
                value: 'research_summarization',
                label: 'Research & Summarization',
                description: 'Quickly summarize documents, papers, or large amounts of information'
            },
            {
                value: 'automation',
                label: 'Process Automation',
                description: 'Automate repetitive tasks and workflows'
            },
            {
                value: 'customer_service',
                label: 'Customer Service & Support',
                description: 'Improve customer interactions and support efficiency'
            },
            {
                value: 'creative_work',
                label: 'Creative & Design Work',
                description: 'Generate images, designs, or creative ideas'
            },
            {
                value: 'learning_development',
                label: 'Learning & Development',
                description: 'Create training materials or learn new skills faster'
            },
            {
                value: 'general_productivity',
                label: 'General Productivity',
                description: 'Work smarter and save time across various tasks'
            }
        ]
    },

    // Question 5: AI Tools Used
    {
        id: 'ai_tools_used',
        type: 'multiple',
        title: 'Which AI tools have you used? (Select all that apply)',
        description: 'This helps us understand your hands-on experience.',
        options: [
            {
                value: 'chatgpt',
                label: 'ChatGPT',
                description: 'OpenAI\'s conversational AI'
            },
            {
                value: 'claude',
                label: 'Claude',
                description: 'Anthropic\'s AI assistant'
            },
            {
                value: 'gemini',
                label: 'Google Gemini / Bard',
                description: 'Google\'s AI chatbot'
            },
            {
                value: 'perplexity',
                label: 'Perplexity',
                description: 'AI-powered research and search'
            },
            {
                value: 'midjourney',
                label: 'Midjourney / DALL-E / Stable Diffusion',
                description: 'AI image generation tools'
            },
            {
                value: 'github_copilot',
                label: 'GitHub Copilot',
                description: 'AI pair programmer'
            },
            {
                value: 'none',
                label: 'None of these',
                description: 'I haven\'t used any AI tools yet'
            }
        ]
    },

    // Question 6: Learning Style Preference
    {
        id: 'learning_style',
        type: 'single',
        title: 'How do you learn best?',
        description: 'We\'ll customize the content delivery to match your preferred learning style.',
        options: [
            {
                value: 'hands_on',
                label: 'Hands-On Practice',
                description: 'I learn by doing - give me exercises and examples to try immediately'
            },
            {
                value: 'visual',
                label: 'Visual Learning',
                description: 'I prefer diagrams, videos, and visual explanations'
            },
            {
                value: 'reading',
                label: 'Reading & Reflection',
                description: 'I like detailed explanations and time to think things through'
            },
            {
                value: 'mixed',
                label: 'Mixed Approach',
                description: 'I like a combination of all methods'
            }
        ]
    },

    // Question 7: Technical Background
    {
        id: 'technical_background',
        type: 'single',
        title: 'What is your technical or coding background?',
        description: 'This helps us pitch the content at the right level.',
        options: [
            {
                value: 'no_coding',
                label: 'No Coding Experience',
                description: 'I haven\'t written code before and prefer no-code solutions'
            },
            {
                value: 'basic_tech',
                label: 'Basic Tech Literacy',
                description: 'I\'m comfortable with technology and tools but don\'t code'
            },
            {
                value: 'some_coding',
                label: 'Some Coding',
                description: 'I\'ve done basic scripting or taken coding courses'
            },
            {
                value: 'proficient_coder',
                label: 'Proficient Coder',
                description: 'I can build applications and understand programming concepts'
            }
        ]
    },

    // Question 8: Biggest Concern or Barrier
    {
        id: 'biggest_barrier',
        type: 'single',
        title: 'What is your biggest concern about learning AI?',
        description: 'We\'ll address these concerns directly in your learning journey.',
        options: [
            {
                value: 'too_technical',
                label: 'It seems too technical',
                description: 'I\'m worried the concepts will be too complex or mathematical'
            },
            {
                value: 'not_enough_time',
                label: 'Not enough time',
                description: 'I have a busy schedule and worry about fitting this in'
            },
            {
                value: 'job_relevance',
                label: 'Relevance to my job',
                description: 'I\'m not sure how AI applies to my specific role'
            },
            {
                value: 'ethical_concerns',
                label: 'Ethical concerns',
                description: 'I\'m concerned about bias, privacy, or the societal impact of AI'
            },
            {
                value: 'keeping_up',
                label: 'Keeping up with changes',
                description: 'AI is evolving so fast, I worry about staying current'
            },
            {
                value: 'no_concerns',
                label: 'No major concerns',
                description: 'I\'m excited and ready to dive in!'
            }
        ]
    }
];

// Helper function to get question by ID
function getQuestionById(id) {
    return assessmentQuestions.find(q => q.id === id);
}

// Helper function to validate answer
function isAnswerValid(question, answer) {
    if (!answer) return false;

    switch (question.type) {
        case 'single':
            return answer.length > 0;
        case 'multiple':
            return answer.length > 0;
        default:
            return false;
    }
}
