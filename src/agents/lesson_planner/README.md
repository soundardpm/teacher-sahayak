# Lesson Planner Agent

A comprehensive sequential workflow agent for creating detailed weekly lesson plans for teachers with day-by-day breakdown.

## Overview

The Lesson Planner Agent is built using Google's Agent Development Kit (ADK) and implements a sequential workflow pattern to create high-quality, validated lesson plans. The agent coordinates four specialized sub-agents in a linear workflow to ensure comprehensive and educationally sound lesson planning.

## Architecture

### Sequential Workflow Design

The agent follows a 4-stage sequential process:

1. **Teacher Intent Analysis** (`teacher_intent_analysis_agent`)
   - Analyzes teacher's pedagogical intentions and goals
   - Extracts subject, grade level, cultural context, and preferences
   - Outputs structured analysis for subsequent agents

2. **Curriculum Content Retrieval** (`curriculum_content_analysis_agent`)
   - Gathers relevant educational content based on teacher intent
   - Organizes curriculum standards, resources, and materials
   - Provides foundation for lesson plan creation

3. **Lesson Plan Generation** (`lesson_plan_creation_agent`)
   - Creates detailed 5-day lesson plans with structured activities
   - Incorporates pedagogical best practices and cultural adaptations
   - Generates comprehensive markdown-formatted lesson plans

4. **Quality Validation** (`lesson_plan_validation_agent`)
   - Validates lesson plans against educational standards
   - Ensures safety, inclusivity, and age-appropriateness
   - Provides quality assurance and improvement recommendations

### Key Features

- **Sequential Execution**: Each agent builds upon the previous agent's output
- **State Management**: Uses output keys to pass information between agents
- **Comprehensive Coverage**: Monday through Friday detailed planning
- **Cultural Adaptation**: Supports multiple languages and cultural contexts
- **Quality Assurance**: Built-in validation and educational standards compliance
- **Flexible Input**: Accepts natural language teacher requests

## Agent Configuration

### Main Workflow Agent

```python
lesson_planning_workflow = SequentialAgent(
    name="lesson_planning_workflow",
    description="Executes a complete sequence of lesson planning: intent analysis, content retrieval, plan generation, and validation.",
    sub_agents=[
        teacher_intent_analysis_agent,
        curriculum_content_analysis_agent, 
        lesson_plan_creation_agent,
        lesson_plan_validation_agent
    ]
)
```

### Sub-Agent Output Keys

- `teacher_intent_analysis`: Structured pedagogical intent analysis
- `curriculum_content`: Organized educational content and resources
- `generated_lesson_plan`: Complete lesson plan in markdown format
- `validation_result`: Quality validation results and recommendations

## Usage Examples

### Input Examples

```
"Create a weekly lesson plan for Class 8 Science on 'Light and Shadows' in Tamil"
"I need a daily plan for Grade 6 Mathematics covering fractions"
"Plan a week of English lessons for Class 10 on Shakespeare's sonnets"
```

### Output Structure

The agent produces comprehensive lesson plans with:

- **Weekly Overview**: Summary and learning goals
- **Daily Breakdown**: Monday through Friday detailed plans
- **Learning Objectives**: Specific, measurable outcomes
- **Activities**: Engaging, age-appropriate tasks
- **Assessments**: Formative and summative evaluation methods
- **Resources**: Required materials and technology
- **Cultural Adaptations**: Localized content and examples

## Technical Implementation

### Model Configuration
- **Model**: `gemini-2.5-flash`
- **Framework**: Google Agent Development Kit (ADK)
- **Agent Type**: `SequentialAgent` with `LlmAgent` sub-agents

### State Flow
1. User input → Teacher Intent Analysis
2. Intent Analysis → Curriculum Content Retrieval  
3. Intent + Content → Lesson Plan Generation
4. Intent + Plan → Quality Validation
5. Final validated lesson plan → User

## Educational Standards

The agent ensures compliance with:
- Age-appropriate content and complexity
- Pedagogical best practices
- Cultural sensitivity and inclusivity
- Safety considerations
- Assessment validity
- Resource feasibility

## Dependencies

- `google.adk.agents.LlmAgent`
- `google.adk.agents.SequentialAgent`
- `google.adk.tools.agent_tool.AgentTool`

## File Structure

```
lesson_planner/
├── agent.py                    # Main sequential workflow agent
├── prompt.py                   # Workflow orchestration prompts
├── README.md                   # This documentation
├── requirements.txt            # Package dependencies
└── sub_agents/                 # Individual specialized agents
    ├── teacher_intent_processor/
    ├── curriculum_content_retriever/
    ├── lesson_plan_generator/
    └── lesson_plan_validator/
```

## Future Enhancements

- Integration with external curriculum databases
- Support for multimedia content generation
- Advanced assessment rubric creation
- Collaborative lesson planning features
- Performance analytics and optimization