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

"""quiz_generator: Research advice, related literature finding, research area proposals, web knowledge access."""

from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool


from . import prompt
from .sub_agents.quiz_generator_agent import quiz_generator_agent
from .sub_agents.quiz_search_agent import quiz_search_agent

MODEL = "gemini-2.5-flash"


quiz_generator = Agent(
    name="quiz_generator",
    model=MODEL,
    description=(
        "A quiz generator agent that creates educational quizzes for students in Grades 6-10. "
        "Simply provide a topic and the agent will generate a quiz with sensible defaults. "
        "Specializes only in quiz generation and politely declines non-quiz requests."
        "return quiz_generator_agent response directly"
    ),
    instruction=prompt.ACADEMIC_COORDINATOR_PROMPT,    
    tools=[
        AgentTool(agent=quiz_search_agent),
        AgentTool(agent=quiz_generator_agent),
    ],
)

root_agent = quiz_generator
