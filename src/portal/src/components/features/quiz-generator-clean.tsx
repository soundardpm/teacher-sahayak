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
import { generateQuizWithAgent, type GenerateQuizOutput } from "@/ai/flows/generate-quiz-agent";

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
    try {
      const response = await generateQuizWithAgent(values);
      setQuizResult(response);
      toast({
        title: "Success!",
        description: "Quiz generated successfully.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `Failed to generate quiz: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const formatQuizDisplay = (quiz: GenerateQuizOutput) => {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{quiz.title}</h2>
          {quiz.grade && <p className="text-gray-600">Grade Level: {quiz.grade}</p>}
        </div>
        
        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="border rounded-lg p-4 bg-white">
              <h3 className="font-semibold mb-3 text-lg">
                Question {index + 1}: {question.question_text}
              </h3>
              
              {question.options && question.options.length > 0 && (
                <div className="ml-4 space-y-2">
                  {question.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <span className={
                        option.id === question.correct_answer 
                          ? "text-green-600 font-bold" 
                          : "text-gray-700"
                      }>
                        {option.id}. {option.text}
                        {option.id === question.correct_answer && " ✅"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {question.type === 'fill_blank' && question.correct_answer && (
                <div className="ml-4 mt-2">
                  <p className="text-green-600 font-semibold">
                    <strong>Answer:</strong> {question.correct_answer}
                  </p>
                </div>
              )}
              
              {question.type === 'true_false' && !question.options && question.correct_answer && (
                <div className="ml-4 mt-2">
                  <p className="text-green-600 font-semibold">
                    <strong>Answer:</strong> {question.correct_answer}
                  </p>
                </div>
              )}
              
              {question.explanation && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md border-l-4 border-blue-400">
                  <p className="text-sm text-blue-800">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
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
                Generate Quiz
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

      {quizResult && (
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
