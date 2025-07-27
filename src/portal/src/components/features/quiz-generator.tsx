"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "@/components/ui/loader";
import { useToast } from "@/hooks/use-toast";

// Define APP_URL with localhost as default
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_AGENT_API_URL || "http://localhost:8000";

// Simple UUID v4 generator
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const formSchema = z.object({
  quizTitle: z.string().min(5, "Quiz title must be at least 5 characters."),
  gradeLevel: z.string().min(1, "Please enter a grade level."),
  questions: z.string().min(10, "Questions must be at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export default function QuizGenerator() {
  const { toast } = useToast();
  const [userId, setUserId] = React.useState<string | null>(null);
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [appName, setAppName] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [quizResult, setQuizResult] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quizTitle: "",
      gradeLevel: "",
      questions: "",
    },
  });

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
    const response = await fetch(`${APP_URL}/apps/quiz_generator/users/u_999/sessions/${generatedSessionId}`, {
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
                console.log('[SSE QUIZ] Processing event:', jsonDataToParse.substring(0, 200) + "...");
                
                try {
                  const parsed = JSON.parse(jsonDataToParse);
                  // Store the latest parsed data as final result
                  finalResult = parsed;
                  
                  // If this contains the final quiz data, we can break early
                  if (parsed.content?.parts?.[0]?.text && parsed.content.parts[0].text.includes('quiz_generator_agent_response')) {
                    console.log('[SSE QUIZ] Found final quiz result');
                  }
                } catch (parseError) {
                  console.error('[SSE QUIZ] Parse error:', parseError);
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
              console.log('[SSE QUIZ] Processing final event:', jsonDataToParse.substring(0, 200) + "...");
              
              try {
                const parsed = JSON.parse(jsonDataToParse);
                finalResult = parsed;
              } catch (parseError) {
                console.error('[SSE QUIZ] Final parse error:', parseError);
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

  const extractQuizData = (result: any) => {
    try {
      // Check if result has the expected structure
      if (result?.content?.parts?.[0]?.text) {
        const textContent = result.content.parts[0].text;
        
        // Try to parse the quiz_generator_agent_response from the text
        if (textContent.includes('quiz_generator_agent_response')) {
          const parsed = JSON.parse(textContent);
          if (parsed.quiz_generator_agent_response) {
            return {
              type: 'quiz',
              data: parsed.quiz_generator_agent_response
            };
          }
        }
      }
      
      // Check for function response with quiz data
      if (result?.content?.parts?.[0]?.functionResponse?.response) {
        const functionResponse = result.content.parts[0].functionResponse.response;
        if (functionResponse.questions) {
          return {
            type: 'quiz',
            data: functionResponse
          };
        }
      }
      
      // Return raw result if no specific quiz format found
      return {
        type: 'raw',
        data: result
      };
    } catch (error) {
      console.error('Error extracting quiz data:', error);
      return {
        type: 'raw',
        data: result
      };
    }
  };

  const formatQuizDisplay = (quizData: any) => {
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      return JSON.stringify(quizData, null, 2);
    }

    let formatted = `# ${quizData.title || 'Quiz'}\n`;
    formatted += `**Grade:** ${quizData.grade || 'N/A'}\n\n`;

    quizData.questions.forEach((question: any, index: number) => {
      formatted += `## Question ${index + 1}\n`;
      formatted += `**${question.question_text}**\n\n`;

      if (question.type === 'mcq' && question.options) {
        question.options.forEach((option: any) => {
          const marker = option.id === question.correct_answer ? '✅' : '⚪';
          formatted += `${marker} ${option.id}. ${option.text}\n`;
        });
      } else if (question.type === 'true_false' && question.options) {
        question.options.forEach((option: any) => {
          const marker = option.id === question.correct_answer ? '✅' : '⚪';
          formatted += `${marker} ${option.text}\n`;
        });
      } else if (question.type === 'fill_blank') {
        formatted += `**Answer:** ${question.correct_answer}\n`;
      }

      if (question.explanation) {
        formatted += `\n**Explanation:** ${question.explanation}\n`;
      }
      
      formatted += '\n---\n\n';
    });

    return formatted;
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setQuizResult(null);

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

      // Prepare the user message
      const userMessage = `Need quiz topic is ${values.quizTitle}, grade is ${values.gradeLevel}. Additional requirements: ${values.questions}`;

      // Call run_sse API with retry logic
      console.log("Calling run_sse API...");
      const callAPI = async () => {
        return await callRunSSE(userMessage, currentUserId!, currentSessionId!, currentAppName!);
      };

      const result = await retryWithBackoff(callAPI);

      // Extract and format quiz data
      const extractedData = extractQuizData(result);
      if (extractedData.type === 'quiz') {
        const formattedQuiz = formatQuizDisplay(extractedData.data);
        setQuizResult(formattedQuiz);
      } else {
        setQuizResult(JSON.stringify(result, null, 2));
      }
      
      toast({
        title: "Success!",
        description: "Quiz generated successfully. Check the response below.",
      });

    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        title: "Error",
        description: `Failed to generate quiz: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline">Quiz Generator</CardTitle>
              <CardDescription>
                Create quizzes tailored to your needs. Fill in the details below to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="quizTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Math Quiz for Grade 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gradeLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade Level</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Grade 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="questions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Questions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., What is 2+2?\nWhat is 5-3?"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <div className="p-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader className="mr-2" />}
                Generate Quiz
              </Button>
            </div>
          </form>
        </Form>
      </Card>

      {/* Loading indicator */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader size="md" />
              <span>Generating your quiz...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Response display */}
      {quizResult && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Generated Successfully!</CardTitle>
            <CardDescription>
              {quizResult.startsWith('#') ? 'Here\'s your formatted quiz:' : 'Here\'s the response from the API:'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quizResult.startsWith('#') ? (
              <div className="prose max-w-none bg-gray-50 p-4 rounded-md">
                <div className="whitespace-pre-wrap text-sm">
                  {quizResult}
                </div>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                {quizResult}
              </pre>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
