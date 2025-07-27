"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Define APP_URL with localhost as default
const APP_URL = "http://localhost:8000";

// Simple UUID v4 generator
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function LessonPlanner() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<string>("");
  const [userId, setUserId] = React.useState<string | null>(null);
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [appName, setAppName] = React.useState<string | null>(null);
  
  // Form state
  const [subject, setSubject] = React.useState("");
  const [topic, setTopic] = React.useState("");
  const [gradeLevel, setGradeLevel] = React.useState("");
  const [language, setLanguage] = React.useState("English");
  const [duration, setDuration] = React.useState("daily");
  const [specialRequirements, setSpecialRequirements] = React.useState("");

  const subjects = [
    "Mathematics",
    "Science", 
    "English",
    "Social Studies",
    "History",
    "Geography",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Art",
    "Music",
    "Physical Education",
  ];

  const grades = [
    "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
    "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"
  ];

  const languages = [
    "English",
    "Tamil",
    "Hindi",
    "Telugu",
    "Kannada",
    "Malayalam",
    "Bengali",
    "Marathi",
    "Gujarati",
  ];

  const handleInputChange = (name: string, value: string) => {
    // This function is no longer needed with individual state variables
  };

  const constructPrompt = (data: {
    subject: string;
    gradeLevel: string;
    topic: string;
    language: string;
    duration: string;
    specialRequirements: string;
  }) => {
    let prompt = `Create a ${data.duration} lesson plan for `;
    
    if (data.gradeLevel) {
      prompt += `${data.gradeLevel} `;
    }
    
    prompt += `${data.subject}`;
    
    if (data.topic) {
      prompt += ` on '${data.topic}'`;
    }
    
    if (data.language && data.language !== 'English') {
      prompt += ` in ${data.language}`;
    }

    if (data.specialRequirements) {
      prompt += `. Special requirements: ${data.specialRequirements}`;
    }

    return prompt;
  };

  const retryWithBackoff = async (
    fn: () => Promise<any>,
    maxRetries: number = 10,
    maxDuration: number = 120000 // 2 minutes
  ): Promise<any> => {
    const startTime = Date.now();
    let lastError: Error;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      if (Date.now() - startTime > maxDuration) {
        throw new Error(`Retry timeout after ${maxDuration}ms`);
      }
      
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000); // Exponential backoff, max 5s
        console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  };

  const createSession = async (): Promise<{userId: string, sessionId: string, appName: string}> => {
    const generatedSessionId = uuidv4();
    console.log(`Creating session with ID: ${generatedSessionId}`);
    console.log(`Using APP_URL: ${APP_URL}`);
    const response = await fetch(`${APP_URL}/apps/lesson_planner/users/u_999/sessions/${generatedSessionId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create session: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      userId: data.userId,
      sessionId: data.id,
      appName: data.appName
    };
  };

  const callRunSSE = async (userText: string, currentUserId: string, currentSessionId: string, currentAppName: string) => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if token is available
      // if (TOKEN) {
      //   headers['Authorization'] = `Bearer ${TOKEN}`;
      // }

      const response = await fetch(`${APP_URL}/run_sse`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          appName: currentAppName,
          userId: currentUserId,
          sessionId: currentSessionId,
          newMessage: {
            role: "user",
            parts: [{
              text: userText
            }]
          },
          streaming: false
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      // Handle SSE streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let lineBuffer = ""; 
      let eventDataBuffer = "";
      let finalResult = null;

      if (reader) {
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();

          if (value) {
            lineBuffer += decoder.decode(value, { stream: true });
          }
          
          let eolIndex;
          // Process all complete lines in the buffer, or the remaining buffer if 'done'
          while ((eolIndex = lineBuffer.indexOf('\n')) >= 0 || (done && lineBuffer.length > 0)) {
            let line: string;
            if (eolIndex >= 0) {
              line = lineBuffer.substring(0, eolIndex);
              lineBuffer = lineBuffer.substring(eolIndex + 1);
            } else { // Only if done and lineBuffer has content without a trailing newline
              line = lineBuffer;
              lineBuffer = "";
            }

            if (line.trim() === "") { // Empty line: dispatch event
              if (eventDataBuffer.length > 0) {
                // Remove trailing newline before parsing
                const jsonDataToParse = eventDataBuffer.endsWith('\n') ? eventDataBuffer.slice(0, -1) : eventDataBuffer;
                console.log('[SSE LESSON] Processing event:', jsonDataToParse.substring(0, 200) + "...");
                
                try {
                  const parsed = JSON.parse(jsonDataToParse);
                  // Store the latest parsed data as final result
                  finalResult = parsed;
                  
                  // If this contains the final lesson plan data, we can break early
                  if (parsed.content?.parts?.[0]?.text && parsed.content.parts[0].text.includes('lesson_planner_agent_response')) {
                    console.log('[SSE LESSON] Found final lesson plan result');
                  }
                } catch (parseError) {
                  console.error('[SSE LESSON] Parse error:', parseError);
                }
                
                eventDataBuffer = ""; // Reset for next event
              }
            } else if (line.startsWith('data:')) {
              eventDataBuffer += line.substring(5).trimStart() + '\n'; // Add newline as per spec for multi-line data
            } else if (line.startsWith(':')) {
              // Comment line, ignore
            } // Other SSE fields (event, id, retry) can be handled here if needed
          }

          if (done) {
            // If the loop exited due to 'done', and there's still data in eventDataBuffer
            if (eventDataBuffer.length > 0) {
              const jsonDataToParse = eventDataBuffer.endsWith('\n') ? eventDataBuffer.slice(0, -1) : eventDataBuffer;
              console.log('[SSE LESSON] Processing final event:', jsonDataToParse.substring(0, 200) + "...");
              
              try {
                const parsed = JSON.parse(jsonDataToParse);
                finalResult = parsed;
              } catch (parseError) {
                console.error('[SSE LESSON] Final parse error:', parseError);
              }
            }
            break; // Exit the while(true) loop
          }
        }
      }

      console.log("API Response (Final):", finalResult);
      return finalResult;
    } catch (error) {
      console.error("Error calling run_sse:", error);
      throw error;
    }
  };

  const extractLessonPlanData = (result: any) => {
    try {
      // Check if result has the expected structure
      if (result?.content?.parts?.[0]?.text) {
        const textContent = result.content.parts[0].text;
        
        // Try to parse the lesson_planner_agent_response from the text
        if (textContent.includes('lesson_planner_agent_response')) {
          const parsed = JSON.parse(textContent);
          if (parsed.lesson_planner_agent_response) {
            return {
              type: 'lesson_plan',
              data: parsed.lesson_planner_agent_response
            };
          }
        }
      }
      
      // Check for function response with lesson plan data
      if (result?.content?.parts?.[0]?.functionResponse?.response) {
        const functionResponse = result.content.parts[0].functionResponse.response;
        if (functionResponse.lesson_plan || functionResponse.title) {
          return {
            type: 'lesson_plan',
            data: functionResponse
          };
        }
      }
      
      // Return raw result if no specific lesson plan format found
      return {
        type: 'raw',
        data: result
      };
    } catch (error) {
      console.error('Error extracting lesson plan data:', error);
      return {
        type: 'raw',
        data: result
      };
    }
  };

  const formatLessonPlanDisplay = (lessonPlanData: any) => {
    if (!lessonPlanData) {
      return JSON.stringify(lessonPlanData, null, 2);
    }

    let formatted = `# ${lessonPlanData.title || 'Lesson Plan'}\n\n`;
    
    if (lessonPlanData.subject) formatted += `**Subject:** ${lessonPlanData.subject}\n`;
    if (lessonPlanData.grade) formatted += `**Grade:** ${lessonPlanData.grade}\n`;
    if (lessonPlanData.topic) formatted += `**Topic:** ${lessonPlanData.topic}\n`;
    if (lessonPlanData.duration) formatted += `**Duration:** ${lessonPlanData.duration}\n`;
    if (lessonPlanData.language) formatted += `**Language:** ${lessonPlanData.language}\n\n`;

    if (lessonPlanData.objectives) {
      formatted += `## Learning Objectives\n`;
      if (Array.isArray(lessonPlanData.objectives)) {
        lessonPlanData.objectives.forEach((objective: any, index: number) => {
          formatted += `${index + 1}. ${objective}\n`;
        });
      } else {
        formatted += `${lessonPlanData.objectives}\n`;
      }
      formatted += '\n';
    }

    if (lessonPlanData.activities) {
      formatted += `## Activities\n`;
      if (Array.isArray(lessonPlanData.activities)) {
        lessonPlanData.activities.forEach((activity: any, index: number) => {
          formatted += `### Activity ${index + 1}\n`;
          if (typeof activity === 'object') {
            if (activity.title) formatted += `**Title:** ${activity.title}\n`;
            if (activity.description) formatted += `**Description:** ${activity.description}\n`;
            if (activity.duration) formatted += `**Duration:** ${activity.duration}\n`;
            if (activity.materials) formatted += `**Materials:** ${activity.materials}\n`;
          } else {
            formatted += `${activity}\n`;
          }
          formatted += '\n';
        });
      } else {
        formatted += `${lessonPlanData.activities}\n\n`;
      }
    }

    if (lessonPlanData.assessment) {
      formatted += `## Assessment\n`;
      formatted += `${lessonPlanData.assessment}\n\n`;
    }

    if (lessonPlanData.resources) {
      formatted += `## Resources\n`;
      if (Array.isArray(lessonPlanData.resources)) {
        lessonPlanData.resources.forEach((resource: any) => {
          formatted += `• ${resource}\n`;
        });
      } else {
        formatted += `${lessonPlanData.resources}\n`;
      }
      formatted += '\n';
    }

    return formatted || JSON.stringify(lessonPlanData, null, 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject || !gradeLevel || !topic) {
      toast({
        title: "Missing Information",
        description: "Please fill in Subject, Grade Level, and Topic fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult("");

    try {
      // Create session if it doesn't exist
      let currentUserId = userId;
      let currentSessionId = sessionId;
      let currentAppName = appName;
      
      if (!currentSessionId || !currentUserId || !currentAppName) {
        console.log('Creating new session...');
        const sessionData = await retryWithBackoff(createSession);
        currentUserId = sessionData.userId;
        currentSessionId = sessionData.sessionId;
        currentAppName = sessionData.appName;
        
        setUserId(currentUserId);
        setSessionId(currentSessionId);
        setAppName(currentAppName);
        console.log('Session created successfully:', { currentUserId, currentSessionId, currentAppName });
      }

      const formData = {
        subject,
        gradeLevel,
        topic,
        language,
        duration,
        specialRequirements
      };
      
      // Prepare the user message
      const userMessage = constructPrompt(formData);

      // Call run_sse API with retry logic
      console.log("Calling run_sse API...");
      const callAPI = async () => {
        return await callRunSSE(userMessage, currentUserId!, currentSessionId!, currentAppName!);
      };

      const result = await retryWithBackoff(callAPI);

      // Extract and format lesson plan data
      const extractedData = extractLessonPlanData(result);
      if (extractedData.type === 'lesson_plan') {
        const formattedLessonPlan = formatLessonPlanDisplay(extractedData.data);
        setResult(formattedLessonPlan);
      } else {
        setResult(JSON.stringify(result, null, 2));
      }
      
      toast({
        title: "Success!",
        description: "Lesson plan generated successfully. Check the response below.",
      });

    } catch (error) {
      console.error("Error generating lesson plan:", error);
      toast({
        title: "Error",
        description: `Failed to generate lesson plan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full min-w-full">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-200/50 w-full min-w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 text-center w-full">
          <h1 className="text-4xl font-bold mb-3">🎓 AI Lesson Plan Generator</h1>
          <p className="text-lg opacity-90">
            Create comprehensive, personalized lesson plans in minutes
          </p>
        </div>

        {/* Form */}
        <div className="p-10 w-full">
          <form onSubmit={handleSubmit} className="space-y-8 w-full">
            {/* First Row: Subject and Grade */}
            <div className="grid lg:grid-cols-2 gap-16 w-full">
              {/* Subject */}
              <div className="space-y-3">
                <label className="text-xl font-semibold text-gray-700 block">
                  📚 Subject
                </label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger className="w-full p-5 text-lg border-2 border-gray-300 rounded-lg">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subj) => (
                      <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Grade/Class */}
              <div className="space-y-3">
                <label className="text-xl font-semibold text-gray-700 block">
                  🎓 Grade/Class
                </label>
                <Select value={gradeLevel} onValueChange={setGradeLevel}>
                  <SelectTrigger className="w-full p-5 text-lg border-2 border-gray-300 rounded-lg">
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Topic/Chapter */}
            <div className="space-y-3 w-full">
              <label className="text-xl font-semibold text-gray-700 block">
                � Topic/Chapter
              </label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Light and Shadows, Fractions, Shakespeare's Sonnets"
                className="w-full p-5 text-lg border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                required
              />
            </div>

            {/* Lesson Duration */}
            <div className="space-y-3 w-full">
              <label className="text-xl font-semibold text-gray-700 block">
                ⏰ Lesson Duration
              </label>
              <div className="flex flex-wrap gap-4">
                {[
                  { value: 'daily', label: 'Daily Plan' },
                  { value: 'weekly', label: 'Weekly Plan' }
                ].map((dur) => (
                  <label key={dur.value} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="duration"
                      value={dur.value}
                      checked={duration === dur.value}
                      onChange={(e) => setDuration(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-lg font-medium text-gray-700 bg-gray-100 px-8 py-4 rounded-lg hover:bg-gray-200 transition-colors">
                      {dur.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Teaching Language */}
            <div className="space-y-3 w-full">
              <label className="text-xl font-semibold text-gray-700 block">
                🌐 Teaching Language
              </label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full p-5 text-lg border-2 border-gray-300 rounded-lg">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Special Requirements */}
            <div className="space-y-3 w-full">
              <label className="text-xl font-semibold text-gray-700 block">
                ✨ Special Requirements (Optional)
              </label>
              <Textarea
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                placeholder="Generate a weekly lesson plan for 6th grade science lesson 2 ..."
                className="w-full p-5 text-lg border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all min-h-[120px] resize-y"
                rows={6}
              />
            </div>           
            {/* Submit Button */}
            <div className="flex justify-center pt-6 w-full">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-6 px-10 rounded-xl text-xl transition-all transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Lesson Plan...
                  </>
                ) : (
                  "🚀 Generate Lesson Plan"
                )}
              </Button>
            </div>
          </form>
          {/* Loading indicator */}
          {isLoading && (
            <div className="mt-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin text-yellow-600" />
                <span className="text-yellow-800 font-medium">Generating your lesson plan...</span>
              </div>
            </div>
          )}
          
          {/* Results */}
          {result && (
            <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="font-bold text-blue-800 mb-4 text-xl">
                📋 Generated Lesson Plan
              </div>
              <div className="bg-white p-5 rounded-xl whitespace-pre-line leading-relaxed text-gray-700 max-h-96 overflow-y-auto">
                {result.startsWith('#') ? (
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-sm">
                      {result}
                    </div>
                  </div>
                ) : (
                  <pre className="whitespace-pre-wrap text-sm overflow-x-auto">
                    {result}
                  </pre>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
