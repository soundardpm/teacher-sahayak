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

"""Interactive_activities: Create engaging classroom activities and games for effective learning."""

from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool

from . import prompt
from .sub_agents.game_builder_agent import game_builder_agent
from .sub_agents.group_activity_designer_agent import group_activity_designer_agent
from .sub_agents.interactive_quiz_creator_agent import interactive_quiz_creator_agent
from .sub_agents.role_play_generator_agent import role_play_generator_agent

MODEL = "gemini-2.5-flash"


interactive_activities_coordinator = LlmAgent(
    name="interactive_activities_coordinator",
    model=MODEL,
    description=(
        "The InteractiveActivitiesCoordinator is the central coordinator in a multi-agent system for creating engaging classroom activities. "
        "It interprets user inputs, validates them, and initiates downstream processing by specialized agents. "
        "It ensures seamless user interaction and maintains flow integrity. "
        "It excels in orchestrating the creation of comprehensive, structured, and localized interactive learning activities for educators."
    ),
    instruction=prompt.INTERACTIVE_ACTIVITIES_COORDINATOR_PROMPT,
    tools=[
        AgentTool(agent=game_builder_agent),
        AgentTool(agent=group_activity_designer_agent),
        AgentTool(agent=interactive_quiz_creator_agent),
        AgentTool(agent=role_play_generator_agent),
    ],
)

root_agent = interactive_activities_coordinator
