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

"""Visual_learning: Generate educational visual aids for teachers including charts, mind maps, and blackboard-friendly diagrams."""

from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool

from . import prompt
from .sub_agents.chart_generator_agent import chart_generator_agent
from .sub_agents.visual_image_generator_agent import visual_image_generator_agent

MODEL = "gemini-2.5-flash"


visual_learning_coordinator = LlmAgent(
    name="visual_learning_coordinator",
    model=MODEL,
    description=(
        "The VisualLearningCoordinator is the central coordinator in a multi-agent system for creating educational visual aids. "
        "It interprets user inputs, validates them, and initiates downstream processing by specialized agents. "
        "It ensures seamless user interaction and maintains flow integrity. "
        "It excels in orchestrating the creation of comprehensive, blackboard-friendly visual aids including charts, mind maps, and diagrams for educators."
    ),
    instruction=prompt.VISUAL_LEARNING_COORDINATOR_PROMPT,
    tools=[
        AgentTool(agent=chart_generator_agent),
        AgentTool(agent=visual_image_generator_agent),
    ],
)

root_agent = visual_learning_coordinator
