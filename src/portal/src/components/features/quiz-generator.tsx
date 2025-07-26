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
// import { generateQuizWithAgent, type GenerateQuizOutput } from "@/ai/flows/generate-quiz-agent";

// Temporary mock function until the actual AI flow is implemented
type GenerateQuizOutput = {
  quiz: string;
};

const generateQuizWithAgent = async (data: any): Promise<GenerateQuizOutput> => {
  // Mock implementation
  await new Promise(resolve => setTimeout(resolve, 2000));
  return {
    quiz: `<ol>
      <li><strong>Question 1:</strong> What is the main topic we discussed? <br><em>Answer: ${data.topic}</em></li>
      <li><strong>Question 2:</strong> Which grade level is this quiz designed for? <br><em>Answer: ${data.grade_level}</em></li>
      <li><strong>Question 3:</strong> How many questions were requested? <br><em>Answer: ${data.num_questions}</em></li>
    </ol>`
  };
};

// Interactive Quiz Component to handle answers
function InteractiveQuiz({ htmlContent }: { htmlContent: string }) {
  const [showAnswers, setShowAnswers] = React.useState<{ [key: number]: boolean }>({});
  const [showAllAnswers, setShowAllAnswers] = React.useState(false);

  // Parse HTML content and extract questions with answers
  const parseQuizContent = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const listItems = doc.querySelectorAll('li');
    
    return Array.from(listItems).map((li, index) => ({
      id: index,
      content: li.innerHTML,
      answer: li.getAttribute('data-answer') || '',
      explanation: li.getAttribute('data-explanation') || '',
    }));
  };

  const questions = parseQuizContent(htmlContent);

  const toggleAnswer = (questionId: number) => {
    setShowAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const toggleAllAnswers = () => {
    const newState = !showAllAnswers;
    setShowAllAnswers(newState);
    
    const newShowAnswers: { [key: number]: boolean } = {};
    questions.forEach((_, index) => {
      newShowAnswers[index] = newState;
    });
    setShowAnswers(newShowAnswers);
  };

  return (
    <div className="space-y-4">
      {/* Add custom styles for quiz formatting */}
      <style jsx>{`
        .quiz-question strong {
          color: #2563eb;
          margin-bottom: 8px;
          display: inline-block;
        }
        .quiz-question br {
          margin-bottom: 4px;
        }
      `}</style>

      {/* Toggle All Answers Button */}
      <div className="flex justify-end">
        <Button 
          onClick={toggleAllAnswers}
          variant="outline"
          size="sm"
        >
          {showAllAnswers ? "Hide All Answers" : "Show All Answers"}
        </Button>
      </div>

      {/* Questions List */}
      <ol className="space-y-6">
        {questions.map((question, index) => (
          <li key={question.id} className="border rounded-lg p-4 bg-gray-50">
            <div className="space-y-3">
              {/* Question Content */}
              <div 
                className="quiz-question"
                dangerouslySetInnerHTML={{ __html: question.content }}
              />
              
              {/* Check Answer Button */}
              <div className="flex justify-start">
                <Button
                  onClick={() => toggleAnswer(question.id)}
                  variant="secondary"
                  size="sm"
                >
                  {showAnswers[question.id] ? "Hide Answer" : "Check Answer"}
                </Button>
              </div>

              {/* Answer Section */}
              {showAnswers[question.id] && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                  <div className="space-y-2">
                    <div className="font-semibold text-green-800">
                      ✓ Correct Answer: <span className="font-normal">{question.answer}</span>
                    </div>
                    {question.explanation && (
                      <div className="text-sm text-green-700">
                        <strong>Explanation:</strong> {question.explanation}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

const formSchema = z.object({
  quizTitle: z.string().min(5, "Quiz title must be at least 5 characters."),
  gradeLevel: z.string().min(1, "Please enter a grade level."),
  questions: z.string().min(10, "Questions must be at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

export default function QuizGenerator() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [quizResult, setQuizResult] = React.useState<GenerateQuizOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quizTitle: "",
      gradeLevel: "",
      questions: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setQuizResult(null);
    setError(null);
    
    try {
      const response = await generateQuizWithAgent(values);
      setQuizResult(response);
      toast({
        title: "Success!",
        description: "Quiz generated successfully.",
      });
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const formatQuizDisplay = (quiz: GenerateQuizOutput) => {
    return (
      <div className="space-y-6">
        {/* Only show grade level if available, no duplicate title */}
        {quiz.grade && (
          <div>
            <p className="text-gray-600">Grade Level: {quiz.grade}</p>
          </div>
        )}
        
        {/* Interactive Quiz Component */}
        <InteractiveQuiz htmlContent={quiz.htmlContent} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="font-headline">Quiz Generator</CardTitle>
              <CardDescription>
                Create educational quizzes tailored to your needs using our AI agent. Fill in the details below to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="quizTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quiz Title/Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Math Quiz on Fractions" {...field} />
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
                      <Input placeholder="e.g., Grade 6" {...field} />
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
                    <FormLabel>Additional Requirements</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Focus on comparing fractions, include word problems"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader className="mr-2" />}
                {isLoading ? "Generating Quiz..." : "Generate Quiz"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {isLoading && (
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <Loader size="lg" className="mb-4" />
            <p className="text-muted-foreground">
              Generating quiz using AI agent... this may take a moment.
            </p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="font-headline text-destructive flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              Quiz Generation Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{error}</p>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setError(null);
                    form.reset();
                  }} 
                  variant="outline" 
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {quizResult && !error && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Generated Quiz</CardTitle>
            <CardDescription>
              Here's your customized quiz ready to use!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {formatQuizDisplay(quizResult)}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
