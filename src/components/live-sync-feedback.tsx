import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle, ArrowRight, Loader2 } from "lucide-react";

interface SyncStep {
  id: string;
  type: 'project' | 'task' | 'validation';
  title: string;
  subtitle?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  progress?: number;
  timestamp?: Date;
  details?: string;
}

interface LiveSyncFeedbackProps {
  isActive: boolean;
  steps: SyncStep[];
  currentStep?: string;
  overallProgress: number;
  onComplete?: () => void;
}

export function LiveSyncFeedback({ isActive, steps, currentStep, overallProgress, onComplete }: LiveSyncFeedbackProps) {
  const [visibleSteps, setVisibleSteps] = useState<SyncStep[]>([]);

  useEffect(() => {
    if (steps.length > visibleSteps.length) {
      const newSteps = steps.slice(visibleSteps.length);
      newSteps.forEach((step, index) => {
        setTimeout(() => {
          setVisibleSteps(prev => [...prev, step]);
        }, index * 200);
      });
    }
  }, [steps, visibleSteps.length]);

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const errorSteps = steps.filter(s => s.status === 'error').length;

  const getStepIcon = (step: SyncStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'in-progress':
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStepBadgeVariant = (step: SyncStep) => {
    switch (step.status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'error':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (!isActive) return null;

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm animate-scale-in">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
            Sincronización en Progreso
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-success/10 text-success">
              {completedSteps} completadas
            </Badge>
            {errorSteps > 0 && (
              <Badge variant="destructive">
                {errorSteps} errores
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progreso General</span>
            <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
          </div>
          <Progress 
            value={overallProgress} 
            className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-success [&>div]:relative [&>div]:overflow-hidden"
          />
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-bold text-primary">{steps.length}</div>
              <div className="text-muted-foreground">Total</div>
            </div>
            <div>
              <div className="font-bold text-success">{completedSteps}</div>
              <div className="text-muted-foreground">Completadas</div>
            </div>
            <div>
              <div className="font-bold text-warning">{steps.length - completedSteps - errorSteps}</div>
              <div className="text-muted-foreground">Pendientes</div>
            </div>
          </div>
        </div>

        {/* Live Steps */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {visibleSteps.map((step, index) => (
            <div
              key={step.id}
              className={`p-4 rounded-lg border transition-all duration-300 animate-slide-in ${
                step.id === currentStep 
                  ? 'border-primary/50 bg-primary/5 shadow-sm' 
                  : 'border-border/40 bg-muted/20'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                {getStepIcon(step)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{step.title}</span>
                    <Badge variant={getStepBadgeVariant(step)} className="text-xs">
                      {step.type}
                    </Badge>
                  </div>
                  {step.subtitle && (
                    <p className="text-xs text-muted-foreground mt-1">{step.subtitle}</p>
                  )}
                  {step.details && step.status === 'completed' && (
                    <p className="text-xs text-success mt-1">{step.details}</p>
                  )}
                  {step.details && step.status === 'error' && (
                    <p className="text-xs text-destructive mt-1">{step.details}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {step.timestamp && (
                    <span className="text-xs text-muted-foreground">
                      {step.timestamp.toLocaleTimeString()}
                    </span>
                  )}
                  {step.status === 'in-progress' && step.progress !== undefined && (
                    <div className="w-12">
                      <Progress value={step.progress} className="h-1" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Connection Visualization */}
        <div className="flex items-center justify-center gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center animate-float">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-xs font-medium">Todoist</span>
          </div>
          
          <div className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary animate-pulse" />
            <div className="h-1 w-8 bg-gradient-to-r from-primary to-success animate-shimmer"></div>
            <ArrowRight className="h-4 w-4 text-primary animate-pulse" />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xs font-medium">Notion</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}