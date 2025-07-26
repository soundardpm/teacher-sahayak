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

"""quiz_generator_agent for generating quizzes based on academic topics."""

from google.adk import Agent

from . import prompt

MODEL = "gemini-2.5-flash"

quiz_generator_agent = Agent(
    model=MODEL,
    name="quiz_generator_agent",
    description=(
        "An expert quiz creator for students in Grades 6-10. "
        "Creates educational quizzes based on provided topics and returns clean HTML content."
    ),
    instruction=prompt.ACADEMIC_QUIZ_GENERATOR_PROMPT,
)

