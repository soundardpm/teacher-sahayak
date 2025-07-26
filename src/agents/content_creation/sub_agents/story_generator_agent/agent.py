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

"""Story generator sub-agent for creating culturally relevant stories in regional languages."""

from google.adk import Agent

from . import prompt

MODEL = "gemini-2.5-flash"

story_generator_agent = Agent(
    model=MODEL,
    name="story_generator_agent",
    description=(
        "The StoryGeneratorAgent creates culturally relevant stories in regional languages. "
        "It generates engaging narratives that resonate with local cultures and traditions, "
        "making it suitable for educational and entertainment purposes."
    ),
    instruction=prompt.STORY_GENERATOR_PROMPT,
)
