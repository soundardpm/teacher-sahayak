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

"""Worksheet creator sub-agent for generating differentiated worksheets from textbook pages."""

from google.adk import Agent
from google.adk.tools import google_search

from . import prompt

MODEL = "gemini-2.5-flash"

worksheet_creator_agent = Agent(
    model=MODEL,
    name="worksheet_creator_agent",
    description=(
        "The WorksheetCreatorAgent generates differentiated worksheets based on textbook pages. "
        "It analyzes the content, identifies key concepts, and creates engaging exercises tailored to various learning levels. "
        "This agent is designed to assist educators in creating customized worksheets that enhance student understanding and retention."
    ),
    instruction=prompt.WORKSHEET_CREATOR_PROMPT,
    tools=[google_search],
)
