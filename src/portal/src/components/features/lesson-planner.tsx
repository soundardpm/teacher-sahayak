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

export default function LessonPlanner() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<string>("");
  
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
      const formData = {
        subject,
        gradeLevel,
        topic,
        language,
        duration,
        specialRequirements
      };
      
      const prompt = constructPrompt(formData);

      // Simulate API call
      setTimeout(() => {
        const generatedResult = `Generated Prompt for AI Orchestrator:

"${prompt}"

Your AI workflow will now process this request through the 4-stage sequential process:

1. Teacher Intent Analysis - Understanding and structuring your requirements
2. Curriculum Content Retrieval - Gathering relevant educational materials  
3. Lesson Plan Generation - Creating detailed, structured lesson plans
4. Quality Validation - Ensuring educational standards and appropriateness

The final validated lesson plan will include:
• Complete daily/weekly structure
• Learning objectives and outcomes  
• Detailed activities and assessments
• Required resources and materials
• Cultural adaptations (when specified)
• Quality assurance confirmation

[In a real implementation, this would connect to your AI orchestrator system]`;

        setResult(generatedResult);
        setIsLoading(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate the lesson plan. Please try again.",
        variant: "destructive",
      });
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
                    Orchestrating AI Workflow...
                  </>
                ) : (
                  "🚀 Generate Lesson Plan"
                )}
              </Button>
            </div>
          </form>
          
          {/* Results */}
          {result && (
            <div className="mt-6 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
              <div className="font-bold text-blue-800 mb-4 text-xl">
                📋 Generated Lesson Plan
              </div>
              <div className="bg-white p-5 rounded-xl whitespace-pre-line leading-relaxed text-gray-700 max-h-96 overflow-y-auto">
                {result}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
