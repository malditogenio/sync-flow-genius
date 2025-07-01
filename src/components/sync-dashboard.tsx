import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SyncStatus {
  isRunning: boolean;
  progress: number;
  message: string;
  lastSync?: Date;
}

export function SyncDashboard() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isRunning: false,
    progress: 0,
    message: "Listo para sincronizar",
    lastSync: undefined
  });
  const { toast } = useToast();

  const handleSync = async () => {
    setSyncStatus({
      isRunning: true,
      progress: 0,
      message: "Iniciando sincronización..."
    });

    // Simulación del progreso de sincronización
    const steps = [
      { progress: 10, message: "Conectando con Todoist..." },
      { progress: 25, message: "Obteniendo tareas de Todoist..." },
      { progress: 40, message: "Conectando con Notion..." },
      { progress: 55, message: "Obteniendo datos de Notion..." },
      { progress: 70, message: "Comparando tareas..." },
      { progress: 85, message: "Sincronizando cambios..." },
      { progress: 100, message: "Sincronización completada" }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSyncStatus(prev => ({
        ...prev,
        progress: step.progress,
        message: step.message
      }));
    }

    setSyncStatus({
      isRunning: false,
      progress: 100,
      message: "Sincronización completada con éxito",
      lastSync: new Date()
    });

    toast({
      title: "Sincronización exitosa",
      description: "Todas las tareas han sido sincronizadas correctamente.",
      variant: "default"
    });
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
                Estado de Sincronización
              </CardTitle>
              <CardDescription>
                Mantén tus tareas de Todoist y Notion perfectamente sincronizadas
              </CardDescription>
            </div>
            {syncStatus.lastSync && (
              <Badge variant="secondary">
                Última: {syncStatus.lastSync.toLocaleTimeString()}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{syncStatus.message}</span>
              <span className="text-sm text-muted-foreground">{syncStatus.progress}%</span>
            </div>
            <Progress 
              value={syncStatus.progress} 
              className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-success"
            />
          </div>

          {/* Sync Button */}
          <Button
            size="xl"
            variant="sync"
            onClick={handleSync}
            disabled={syncStatus.isRunning}
            className={`w-full ${syncStatus.isRunning ? 'animate-pulse-sync' : ''}`}
          >
            <RefreshCw className="h-5 w-5" />
            {syncStatus.isRunning ? "Sincronizando..." : "Sincronizar Ahora"}
          </Button>
        </CardContent>
      </Card>

      {/* Service Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Todoist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success"></div>
              <span className="text-sm text-muted-foreground">Conectado</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <span className="text-xs text-muted-foreground">Sincronización</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Notion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success"></div>
              <span className="text-sm text-muted-foreground">Conectado</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}