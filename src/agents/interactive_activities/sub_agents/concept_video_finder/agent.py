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

"""concept_video_finder for generating puzzles based on academic topics."""

from google.adk import Agent
from google.adk.tools import google_search

from . import prompt

MODEL = "gemini-2.5-flash"

concept_video_finder = Agent(
    model=MODEL,
    name="concept_video_finder",
    description=(
        "An expert puzzle creator for students in Grades 6-10. "
        "Creates educational puzzles based on provided topics and returns clean HTML content."
    ),
    instruction=prompt.CONCEPT_VIDEO_FINDER_AGENT,
    tools=[google_search],
)

