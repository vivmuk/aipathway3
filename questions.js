// ====================================
// AI PATHWAY V3 - INTAKE FIELDS
// Two-section single-page intake:
//   Section 1: Current Capabilities
//   Section 2: Future State (Target Role)
// ====================================

const intakeFields = {
    // ── Section 1: Where You Are Now ──────────────────────────────
    currentState: {
        sectionTitle: 'Where You Are Now',
        sectionDescription: 'Tell us about your current skills, role, and experience so we can meet you where you are.',
        fields: [
            {
                id: 'current_role',
                type: 'text',
                label: 'Your Current Role / Title',
                placeholder: 'e.g. Marketing Manager, Data Analyst, Student, Career Changer...',
                required: true
            },
            {
                id: 'industry',
                type: 'select',
                label: 'Your Industry',
                required: true,
                options: [
                    { value: '', label: 'Select your industry...' },
                    { value: 'healthcare', label: 'Healthcare & Life Sciences' },
                    { value: 'education', label: 'Education & Training' },
                    { value: 'technology', label: 'Technology & Software' },
                    { value: 'business_consulting', label: 'Business & Consulting' },
                    { value: 'marketing_creative', label: 'Marketing & Creative' },
                    { value: 'finance', label: 'Finance & Banking' },
                    { value: 'legal', label: 'Legal & Compliance' },
                    { value: 'nonprofit_social', label: 'Nonprofit & Social Impact' },
                    { value: 'government', label: 'Government & Public Sector' },
                    { value: 'retail_ecommerce', label: 'Retail & E-Commerce' },
                    { value: 'hr_people', label: 'HR & People Operations' },
                    { value: 'other', label: 'Other' }
                ]
            },
            {
                id: 'ai_experience',
                type: 'radio',
                label: 'Your AI Experience Level',
                required: true,
                options: [
                    { value: 'none', label: 'Never used AI tools' },
                    { value: 'beginner', label: 'Tried a few times (ChatGPT, etc.)' },
                    { value: 'regular', label: 'Use AI tools weekly' },
                    { value: 'advanced', label: 'Power user / build with AI' }
                ]
            },
            {
                id: 'ai_tools_used',
                type: 'checkbox',
                label: 'AI Tools You\'ve Used (select all that apply)',
                required: false,
                options: [
                    { value: 'chatgpt', label: 'ChatGPT' },
                    { value: 'claude', label: 'Claude' },
                    { value: 'gemini', label: 'Google Gemini' },
                    { value: 'copilot', label: 'Microsoft Copilot' },
                    { value: 'perplexity', label: 'Perplexity' },
                    { value: 'midjourney', label: 'Midjourney / DALL-E' },
                    { value: 'github_copilot', label: 'GitHub Copilot' },
                    { value: 'other_tools', label: 'Other AI tools' },
                    { value: 'none', label: 'None yet' }
                ]
            },
            {
                id: 'technical_background',
                type: 'radio',
                label: 'Technical / Coding Background',
                required: true,
                options: [
                    { value: 'no_coding', label: 'No coding experience' },
                    { value: 'basic_tech', label: 'Comfortable with tech, no coding' },
                    { value: 'some_coding', label: 'Some scripting or coding' },
                    { value: 'proficient', label: 'Proficient developer' }
                ]
            },
            {
                id: 'current_responsibilities',
                type: 'textarea',
                label: 'Your Key Responsibilities & Daily Tasks',
                placeholder: 'Describe what you do day-to-day. What are your main responsibilities? What tasks take up most of your time? What tools and processes do you use?\n\nExample: "I manage a team of 5, create weekly reports, run client meetings, handle budgeting in Excel, write proposals, and coordinate with engineering..."',
                required: true,
                rows: 5
            }
        ]
    },

    // ── Section 2: Where You Want to Be ──────────────────────────
    futureState: {
        sectionTitle: 'Where You Want to Be',
        sectionDescription: 'Paste the job description for the role you\'re targeting. We\'ll build your learning journey to bridge the gap between where you are and where you want to be.',
        fields: [
            {
                id: 'target_job_description',
                type: 'textarea',
                label: 'Target Job Description',
                placeholder: 'Paste the full job description here. Include the title, responsibilities, required qualifications, preferred skills, and anything else listed.\n\nThe more detail you provide, the more personalized your learning journey will be.',
                required: true,
                rows: 12
            },
            {
                id: 'what_excites_you',
                type: 'textarea',
                label: 'What excites you about this role? (Optional)',
                placeholder: 'What drew you to this position? What parts of the role are you most excited about? Is there anything specific you want to make sure you learn?',
                required: false,
                rows: 3
            }
        ]
    }
};

// Validate the intake form
function validateIntake(formData) {
    const errors = [];

    // Check required current state fields
    for (const field of intakeFields.currentState.fields) {
        if (field.required) {
            const value = formData[field.id];
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                errors.push({ field: field.id, message: `${field.label} is required` });
            }
        }
    }

    // Check required future state fields
    for (const field of intakeFields.futureState.fields) {
        if (field.required) {
            const value = formData[field.id];
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                errors.push({ field: field.id, message: `${field.label} is required` });
            }
        }
    }

    return errors;
}
