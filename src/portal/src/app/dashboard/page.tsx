"use client";

import * as React from "react";
import Image from "next/image";
import {
  AudioLines,
  CalendarPlus,
  Gamepad2,
  Languages,
  Paintbrush,
  PanelLeft,
  Presentation,
  Rabbit,
  UsersRound,
  User,
  ChevronDown,
  LogOut,
  HelpCircle,
  Info,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import LocalizedContent from "@/components/features/localized-content";
import DifferentiatedMaterials from "@/components/features/differentiated-materials";
import VisualAids from "@/components/features/visual-aids";
import LessonPlanner from "@/components/features/lesson-planner";
import AudioAssessment from "@/components/features/audio-assessment";
import GameGeneration from "@/components/features/game-generation";
import AudioVisualExplanation from "@/components/features/audio-visual-explanation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import InteractiveStoryteller from "@/components/features/interactive-storyteller";
import QuizGenerator from "@/components/features/quiz-generator";
import ChatAssistant from "@/components/features/chat-assistant";

type Feature =
  | "chat"
  | "localize"
  | "differentiate"
  | "visualize"
  | "plan"
  | "assess"
  | "gamify"
  | "explain"
  | "storytell"
  | "quiz";

function Dashboard() {
  const [activeFeature, setActiveFeature] = React.useState<Feature>("chat");
  const [selectedBoard, setSelectedBoard] = React.useState("CBSE");
  const followerRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (event: MouseEvent) => {
      if (followerRef.current) {
        const { clientX, clientY } = event;
        followerRef.current.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMobile]);

  const renderFeature = () => {
    switch (activeFeature) {
      case "chat":
        return <ChatAssistant />;
      case "localize":
        return <LocalizedContent />;
      case "differentiate":
        return <DifferentiatedMaterials />;
      case "visualize":
        return <VisualAids />;
      case "plan":
        return <LessonPlanner />;
      case "assess":
        return <AudioAssessment />;
      case "gamify":
        return <GameGeneration />;
      case "explain":
        return <AudioVisualExplanation />;
      case "storytell":
        return <InteractiveStoryteller />;
      case "quiz":
        return <QuizGenerator />;
      default:
        return <ChatAssistant />;
    }
  };

  const menuItems = [
    { id: "chat", icon: MessageSquare, label: "Chat Assistant" },
    { id: "localize", icon: Languages, label: "Localized Content" },
    {
      id: "differentiate",
      icon: UsersRound,
      label: "Differentiated Materials",
    },
    { id: "visualize", icon: Paintbrush, label: "Visual Diagrams" },
    { id: "plan", icon: CalendarPlus, label: "Lesson Planner" },
    {
      id: "assess",
      icon: AudioLines,
      label: "Audio Assessments",
      disabled: false,
    },
    { id: "gamify", icon: Gamepad2, label: "Game Generation", disabled: false },
    { id: "explain", icon: Presentation, label: "Audio-Visual Explanation" },
    { id: "storytell", icon: Rabbit, label: "Interactive Storyteller" },
    { id: "quiz", icon: Rabbit, label: "Quiz Generator" },
  ];

  return (
    <>
      {!isMobile && <div ref={followerRef} className="cursor-follower-element" />}
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          <Sidebar className="border-r border-border/50">
            <SidebarHeader className="border-b border-border/50 bg-card/50">
              <div className="flex items-center gap-2 p-2">
                <Image 
                  src="/logo.png" 
                  alt="Sahayak AI Logo" 
                  width={32} 
                  height={32} 
                  className="rounded-lg"
                />
                <span className="text-xl font-semibold font-headline">
                  Sahayak AI
                </span>
              </div>
            </SidebarHeader>
            <SidebarContent className="bg-card/30">
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => setActiveFeature(item.id as Feature)}
                      isActive={activeFeature === item.id}
                      disabled={item.disabled}
                      tooltip={item.label}
                      className={`relative ${
                        activeFeature === item.id ? "sidebar-item active" : "sidebar-item"
                      }`}
                    >
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="border-t border-border/50 bg-card/50">
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">T</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm">
                  <span className="font-semibold">Teacher</span>
                  <span className="text-muted-foreground text-xs">teacher@school.org</span>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="flex flex-col">
            <header className="flex items-center justify-between p-4 border-b border-border/50 bg-card/30 backdrop-blur">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden">
                  <PanelLeft />
                </SidebarTrigger>
                <div className="hidden md:block">
                  <h1 className="text-xl font-semibold text-foreground">Sahayak AI</h1>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition duration-200"
                    >
                      <User className="w-5 h-5 text-primary" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>Board Selection</DropdownMenuLabel>
                    <div className="px-2 py-1">
                      <Select value={selectedBoard} onValueChange={setSelectedBoard}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Board" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CBSE">CBSE</SelectItem>
                          <SelectItem value="ICSE">ICSE</SelectItem>
                          <SelectItem value="State Board">State Board</SelectItem>
                          <SelectItem value="IB">International Baccalaureate</SelectItem>
                          <SelectItem value="Cambridge">Cambridge</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Info className="mr-2 h-4 w-4" />
                      About Sahayak
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help Center
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 dark:text-red-400">
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background/50">
              {renderFeature()}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </>
  );
}

export default function DashboardPage() {
  return <Dashboard />;
}
