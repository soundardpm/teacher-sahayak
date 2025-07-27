"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader } from "@/components/ui/loader";
import { 
  BookOpen, 
  ChartBar, 
  Lightbulb, 
  BookType, 
  FileText,
  GraduationCap
} from "lucide-react";

const formSchema = z.object({
  grade: z.string().min(1, "Please select a grade/class."),
  language: z.string().min(1, "Please select a teaching language."),
  description: z.string().min(10, "Topic description must be at least 10 characters."),
  feature: z.string().min(1, "Please select a feature."),
});

type FormValues = z.infer<typeof formSchema>;

const features = [
  {
    id: "content-simplifier",
    title: "Content Simplifier",
    description: "Break down complex topics into easy-to-understand concepts",
    icon: BookOpen,
    color: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300",
  },
  {
    id: "blackboard-diagram",
    title: "Simple Blackboard Diagram Creator",
    description: "Generate clear visual diagrams for better understanding",
    icon: ChartBar,
    color: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
  },
  {
    id: "practical-usecase",
    title: "Practical Use Case",
    description: "Create real-world applications and examples",
    icon: Lightbulb,
    color: "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300",
  },
  {
    id: "story-generator",
    title: "Story Generator",
    description: "Transform lessons into engaging stories and narratives",
    icon: BookType,
    color: "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
  },
  {
    id: "worksheet-creation",
    title: "Worksheet Creation",
    description: "Generate practice exercises and assessment materials",
    icon: FileText,
    color: "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300",
  },
];

export default function ContentHub() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedFeature, setSelectedFeature] = React.useState<string>("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grade: "",
      language: "",
      description: "",
      feature: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedFeatureData = features.find(f => f.id === values.feature);
      
      toast({
        title: "Content Generation Started!",
        description: `Generating ${selectedFeatureData?.title} for Grade ${values.grade} in ${values.language}`,
      });
      
      console.log("Content generation data:", values);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Teaching Content Creator
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Create comprehensive, personalized teaching materials in minutes
        </p>
      </div>

      {/* Main Form Card */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardTitle className="text-2xl">Content Generation Form</CardTitle>
          <CardDescription className="text-base">
            Fill in the details below to generate customized teaching content
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Grade and Language Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-sm"></div>
                        Grade/Class
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select Grade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                            <SelectItem key={grade} value={grade.toString()}>
                              Grade {grade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                        Teaching Language
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select Language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="mandarin">Mandarin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Topic Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
                      Topic/Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Light and Shadows, Fractions, Shakespeare's Sonnets, Chemical Reactions..."
                        className="min-h-[100px] text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Feature Selection */}
              <FormField
                control={form.control}
                name="feature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500 rounded-sm"></div>
                      Select Feature
                    </FormLabel>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {features.map((feature) => {
                        const Icon = feature.icon;
                        const isSelected = selectedFeature === feature.id;
                        return (
                          <Card
                            key={feature.id}
                            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                              isSelected
                                ? "ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30"
                                : "hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                            }`}
                            onClick={() => {
                              setSelectedFeature(feature.id);
                              field.onChange(feature.id);
                            }}
                          >
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg ${feature.color}`}>
                                    <Icon className="w-5 h-5" />
                                  </div>
                                  <h3 className="font-semibold text-sm">{feature.title}</h3>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {feature.description}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? (
                    <>
                      <Loader className="mr-2" />
                      Generating Content...
                    </>
                  ) : (
                    "Generate Content"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white">
                <Loader size="lg" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Creating Your Content</h3>
                <p className="text-muted-foreground">
                  Our AI is working hard to generate personalized teaching materials for you...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
