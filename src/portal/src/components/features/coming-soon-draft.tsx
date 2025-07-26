import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Sparkles } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function ComingSoon({ title, description, icon }: ComingSoonProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              {icon || <Wrench className="w-8 h-8 text-primary" />}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Coming Soon - Draft Feature</span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            This feature is currently in development. It will include all the functionality shown in the Sahayak AI design mockup.
          </p>
          <Button variant="outline" disabled>
            Feature in Development
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
