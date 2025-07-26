# Copyright 2025 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Lesson_planner: Create detailed weekly lesson plans for teachers with day-by-day breakdown."""

from google.adk.agents import LlmAgent, SequentialAgent
from google.adk.tools.agent_tool import AgentTool

# Import sub-agents from sub_agents folder
from .sub_agents.teacher_intent_processor.agent import root_agent as teacher_intent_processor
from .sub_agents.curriculum_content_retriever.agent import root_agent as curriculum_content_retriever
from .sub_agents.lesson_plan_generator.agent import root_agent as lesson_plan_generator
from .sub_agents.lesson_plan_validator.agent import root_agent as lesson_plan_validator

MODEL = "gemini-2.5-flash"

# --- 1. Define Sub-Agents for Each Pipeline Stage ---

# Teacher Intent Processor Agent
# Takes the teacher's request and analyzes their pedagogical intentions
teacher_intent_analysis_agent = LlmAgent(
    name="TeacherIntentAnalysisAgent",
    model=MODEL,
    instruction="""You are an expert educational analyst specializing in understanding and interpreting teacher's pedagogical intentions and goals.

**Your Task:**
Analyze the teacher's request to understand their underlying pedagogical intent, teaching philosophy, and specific objectives.

**Input:** The teacher's original request describing what they want to teach and how.

**Analysis Focus:**
1. **Primary Teaching Goals**: What the teacher wants students to learn or achieve
2. **Pedagogical Approach**: Teaching methodology and philosophy preferred
3. **Student Context**: Grade level, subject area, and student characteristics
4. **Cultural Context**: Language preferences and cultural considerations
5. **Assessment Preferences**: How they want to measure student success
6. **Resource Constraints**: Available materials, time, and technology limitations

**Output Format:**
Provide a structured analysis in JSON format:
```json
{
  "subject_area": "identified subject/topic",
  "grade_level": "target grade level",
  "primary_goals": ["main learning objectives"],
  "pedagogical_approach": "teaching methodology preference",
  "student_engagement_strategy": "preferred engagement methods",
  "assessment_preferences": ["evaluation methods"],
  "cultural_context": {
    "language": "instruction language",
    "cultural_adaptations": ["considerations"]
  },
  "time_constraints": "duration and pacing preferences",
  "learning_outcomes": ["specific outcomes expected"],
  "teaching_style": "collaborative/traditional/interactive/etc."
}
```

**Guidelines:**
- Extract both explicit and implicit intentions from the request
- Be objective and evidence-based in your analysis
- Consider the emotional tone and urgency in the request
- Provide actionable insights for lesson planning

Output *only* the JSON analysis. Do not add explanatory text before or after.""",
    description="Analyzes teacher's pedagogical intentions and goals from their request.",
    output_key="teacher_intent_analysis"
)

# Curriculum Content Retriever Agent
# Takes the teacher intent analysis and retrieves relevant curriculum content
curriculum_content_analysis_agent = LlmAgent(
    name="CurriculumContentAnalysisAgent", 
    model=MODEL,
    instruction="""You are a curriculum content specialist responsible for gathering and organizing relevant educational content.

**Your Task:**
Based on the teacher's analyzed intent, identify and organize curriculum content that aligns with their goals.

**Teacher Intent Analysis:**
```json
{teacher_intent_analysis}
```

**Content Retrieval Focus:**
1. **Subject Standards**: Relevant curriculum standards and benchmarks
2. **Learning Resources**: Textbooks, materials, and supplementary content
3. **Assessment Frameworks**: Evaluation methods and rubrics
4. **Cultural Adaptations**: Localized content and cultural considerations
5. **Prerequisite Knowledge**: What students should know beforehand
6. **Extension Opportunities**: Advanced or enrichment activities

**Output Format:**
Provide organized curriculum content in JSON format:
```json
{
  "curriculum_standards": ["relevant standards and benchmarks"],
  "key_concepts": ["main concepts to be taught"],
  "learning_resources": {
    "primary_materials": ["textbooks, core resources"],
    "supplementary_materials": ["additional resources"],
    "digital_resources": ["online tools, videos, apps"]
  },
  "prerequisite_knowledge": ["required prior learning"],
  "assessment_frameworks": ["evaluation methods and rubrics"],
  "cultural_adaptations": ["localized content suggestions"],
  "vocabulary_terms": ["key terms students should learn"],
  "real_world_connections": ["practical applications"],
  "cross_curricular_links": ["connections to other subjects"]
}
```

**Guidelines:**
- Align content with the identified pedagogical approach
- Consider the grade level and student context
- Include culturally relevant and inclusive materials
- Ensure content supports the specified learning outcomes

Output *only* the JSON content analysis. Do not add explanatory text before or after.""",
    description="Retrieves and organizes relevant curriculum content based on teacher intent.",
    output_key="curriculum_content"
)

# Lesson Plan Generator Agent  
# Takes the teacher intent and curriculum content to create detailed lesson plans
lesson_plan_creation_agent = LlmAgent(
    name="LessonPlanCreationAgent",
    model=MODEL,
    instruction="""You are an expert lesson plan designer who creates comprehensive, structured weekly lesson plans.

**Your Task:**
Create a detailed 5-day lesson plan based on the teacher's intent and available curriculum content.

**Teacher Intent Analysis:**
```json
{teacher_intent_analysis}
```

**Curriculum Content:**
```json
{curriculum_content}
```

**Lesson Plan Requirements:**
1. **Weekly Structure**: Monday through Friday with logical progression
2. **Daily Components**: Learning objectives, activities, assessments, resources
3. **Pedagogical Alignment**: Match the teacher's preferred approach
4. **Grade Appropriateness**: Suitable for the identified grade level
5. **Cultural Sensitivity**: Incorporate cultural adaptations
6. **Assessment Integration**: Include formative and summative assessments

**Output Format:**
Create a comprehensive lesson plan in structured format:

```markdown
# Weekly Lesson Plan: [Subject/Topic] for [Grade Level]

## Week Overview
**Duration:** 5 days
**Subject:** [Subject Area]
**Grade Level:** [Grade]
**Main Learning Goals:** [2-3 primary objectives]

---

## Day 1 (Monday): [Daily Topic]
**Learning Objectives:**
- [Specific objective 1]
- [Specific objective 2]

**Opening Activity (10 min):**
[Engaging starter activity]

**Main Instruction (25 min):**
[Core teaching content and methods]

**Guided Practice (15 min):**
[Students practice with support]

**Assessment:**
[How learning will be measured]

**Resources Needed:**
- [List of materials and resources]

**Homework/Extension:**
[Optional additional work]

---

## Day 2 (Tuesday): [Daily Topic]
[Same structure as Day 1]

---

## Day 3 (Wednesday): [Daily Topic]
[Same structure as Day 1]

---

## Day 4 (Thursday): [Daily Topic]
[Same structure as Day 1]

---

## Day 5 (Friday): [Daily Topic]
[Same structure as Day 1]

---

## Weekly Assessment Summary
**Formative Assessments:** [Ongoing evaluation methods]
**Summative Assessment:** [End-of-week evaluation]
**Differentiation Strategies:** [Accommodations for diverse learners]

## Materials List
[Complete list of all resources needed for the week]
```

**Guidelines:**
- Ensure logical progression throughout the week
- Include variety in teaching methods and activities
- Balance individual, group, and whole-class activities
- Incorporate technology where appropriate
- Plan for different learning styles and abilities

Output *only* the complete markdown lesson plan. Do not add explanatory text before or after.""",
    description="Creates detailed 5-day lesson plans based on teacher intent and curriculum content.",
    output_key="generated_lesson_plan"
)

# Lesson Plan Validator Agent
# Takes the generated lesson plan and validates it against educational standards
lesson_plan_validation_agent = LlmAgent(
    name="LessonPlanValidationAgent",
    model=MODEL,
    instruction="""You are an educational quality assurance specialist responsible for validating lesson plans.

**Your Task:**
Review the generated lesson plan to ensure it meets educational standards, safety requirements, and pedagogical best practices.

**Teacher Intent Analysis:**
```json
{teacher_intent_analysis}
```

**Generated Lesson Plan:**
```markdown
{generated_lesson_plan}
```

**Validation Criteria:**
1. **Educational Standards Alignment**: Meets curriculum requirements
2. **Age Appropriateness**: Suitable for the specified grade level
3. **Safety Considerations**: No unsafe activities or materials
4. **Inclusivity**: Accessible to diverse learners
5. **Cultural Sensitivity**: Respectful and inclusive content
6. **Pedagogical Soundness**: Follows best teaching practices
7. **Assessment Validity**: Appropriate evaluation methods
8. **Resource Feasibility**: Realistic material requirements

**Validation Process:**
- Check each day's activities against criteria
- Identify any potential issues or improvements
- Ensure progression makes pedagogical sense
- Verify alignment with teacher's original intent

**Output Format:**
If issues are found, provide specific feedback:
```json
{
  "validation_status": "REQUIRES_REVISION",
  "issues_found": [
    {
      "day": "Monday/Tuesday/etc.",
      "section": "specific section",
      "issue": "description of problem",
      "recommendation": "suggested fix"
    }
  ],
  "overall_feedback": "summary of main concerns"
}
```

If no issues are found:
```json
{
  "validation_status": "APPROVED",
  "quality_score": "rating out of 10",
  "strengths": ["positive aspects of the plan"],
  "minor_suggestions": ["optional improvements"]
}
```

**Guidelines:**
- Be thorough but constructive in feedback
- Focus on student safety and learning effectiveness
- Ensure cultural sensitivity and inclusivity
- Validate against the teacher's original intent

Output *only* the JSON validation result. Do not add explanatory text before or after.""",
    description="Validates lesson plans against educational standards and best practices.",
    output_key="validation_result"
)

# --- 2. Create the SequentialAgent ---
# This agent orchestrates the pipeline by running the sub_agents in order.
lesson_planning_workflow = SequentialAgent(
    name="lesson_planning_workflow",
    description="Executes a complete sequence of lesson planning: intent analysis, content retrieval, plan generation, and validation.",
    sub_agents=[
        teacher_intent_analysis_agent,
        curriculum_content_analysis_agent, 
        lesson_plan_creation_agent,
        lesson_plan_validation_agent
    ]
    # The agents will run in order: Intent Analysis -> Content Retrieval -> Plan Generation -> Validation
)

# For ADK tools compatibility, the root agent must be named `root_agent`
root_agent = lesson_planning_workflow
