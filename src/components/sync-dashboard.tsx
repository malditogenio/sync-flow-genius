import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Eye, Zap, Activity, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SyncPreviewModal } from "./sync-preview-modal";
import { LiveSyncFeedback } from "./live-sync-feedback";

interface SyncStatus {
  isRunning: boolean;
  showPreview: boolean;
  showLiveFeedback: boolean;
  progress: number;
  message: string;
  lastSync?: Date;
  syncStats?: {
    totalSynced: number;
    projectsAffected: number;
    timeElapsed: string;
  };
}

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

export function SyncDashboard() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isRunning: false,
    showPreview: false,
    showLiveFeedback: false,
    progress: 0,
    message: "Listo para sincronizar",
    lastSync: undefined
  });

  const [syncSteps, setSyncSteps] = useState<SyncStep[]>([]);
  const [currentStep, setCurrentStep] = useState<string>();
  const { toast } = useToast();

  // Mock data para la vista previa
  const mockPreview = {
    totalTasks: 47,
    newTasks: [
      {
        id: "1",
        title: "Revisar propuesta de cliente ABC",
        project: "Ventas Q1",
        source: "todoist" as const,
        status: "new" as const,
        dueDate: "2024-01-20",
        labels: ["urgente", "cliente"]
      },
      {
        id: "2",
        title: "Finalizar presentación de productos",
        project: "Marketing",
        source: "notion" as const,
        status: "new" as const,
        dueDate: "2024-01-22"
      },
      {
        id: "3",
        title: "Reunión de seguimiento semanal",
        project: "Equipo",
        source: "todoist" as const,
        status: "new" as const
      }
    ],
    updateTasks: [
      {
        id: "4",
        title: "Actualizar base de datos de clientes",
        project: "CRM",
        source: "notion" as const,
        status: "update" as const,
        dueDate: "2024-01-25"
      },
      {
        id: "5",
        title: "Preparar informe mensual",
        project: "Reportes",
        source: "todoist" as const,
        status: "update" as const
      }
    ],
    conflicts: [
      {
        id: "6",
        title: "Revisar contratos pendientes",
        project: "Legal",
        source: "todoist" as const,
        status: "conflict" as const,
        dueDate: "2024-01-18"
      }
    ],
    projects: ["Ventas Q1", "Marketing", "Equipo", "CRM", "Reportes", "Legal"]
  };

  const handleInitiateSync = () => {
    setSyncStatus(prev => ({ ...prev, showPreview: true }));
  };

  const handlePreviewConfirm = async () => {
    setSyncStatus(prev => ({
      ...prev,
      showPreview: false,
      showLiveFeedback: true,
      isRunning: true,
      progress: 0,
      message: "Iniciando sincronización..."
    }));

    setSyncSteps([]);
    
    // Simulación detallada de sincronización
    const steps = [
      {
        id: "validate",
        type: "validation" as const,
        title: "Validando conexiones",
        subtitle: "Verificando acceso a APIs",
        status: "pending" as const
      },
      {
        id: "fetch-todoist",
        type: "project" as const,
        title: "Ventas Q1",
        subtitle: "Obteniendo tareas de Todoist",
        status: "pending" as const
      },
      {
        id: "fetch-notion-1",
        type: "project" as const,
        title: "Marketing",
        subtitle: "Sincronizando con Notion",
        status: "pending" as const
      },
      {
        id: "task-sync-1",
        type: "task" as const,
        title: "Revisar propuesta de cliente ABC",
        subtitle: "Todoist → Notion",
        status: "pending" as const
      },
      {
        id: "task-sync-2",
        type: "task" as const,
        title: "Finalizar presentación de productos",
        subtitle: "Notion → Todoist",
        status: "pending" as const
      },
      {
        id: "project-crmr",
        type: "project" as const,
        title: "CRM",
        subtitle: "Actualizando tareas existentes",
        status: "pending" as const
      },
      {
        id: "final-validation",
        type: "validation" as const,
        title: "Validación final",
        subtitle: "Verificando integridad de datos",
        status: "pending" as const
      }
    ];

    // Ejecutar pasos uno por uno
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const progress = (i / steps.length) * 100;

      // Marcar como en progreso
      setSyncSteps(prev => {
        const updated = [...prev];
        updated[i] = {
          ...step,
          status: 'in-progress',
          timestamp: new Date(),
          progress: 0
        };
        return updated;
      });
      setCurrentStep(step.id);

      // Simular progreso del paso
      for (let p = 0; p <= 100; p += 25) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setSyncSteps(prev => {
          const updated = [...prev];
          if (updated[i]) {
            updated[i] = { ...updated[i], progress: p };
          }
          return updated;
        });
      }

      // Marcar como completado
      await new Promise(resolve => setTimeout(resolve, 300));
      setSyncSteps(prev => {
        const updated = [...prev];
        updated[i] = {
          ...step,
          status: 'completed',
          timestamp: new Date(),
          details: step.type === 'task' ? 'Sincronizada exitosamente' : 
                   step.type === 'project' ? `${Math.floor(Math.random() * 10) + 1} tareas procesadas` :
                   'Validación completada'
        };
        return updated;
      });

      setSyncStatus(prev => ({
        ...prev,
        progress: progress + (100 / steps.length),
        message: `Procesando ${step.title}...`
      }));
    }

    // Finalizar
    setSyncStatus({
      isRunning: false,
      showPreview: false,
      showLiveFeedback: false,
      progress: 100,
      message: "Sincronización completada",
      lastSync: new Date(),
      syncStats: {
        totalSynced: 47,
        projectsAffected: 6,
        timeElapsed: "2m 34s"
      }
    });

    toast({
      title: "¡Sincronización exitosa!",
      description: "Se sincronizaron 47 tareas en 6 proyectos correctamente.",
      variant: "default"
    });
  };

  const handlePreviewCancel = () => {
    setSyncStatus(prev => ({ ...prev, showPreview: false }));
  };

  const stats = [
    {
      title: "Última Sincronización",
      value: syncStatus.lastSync ? syncStatus.lastSync.toLocaleString() : "Nunca",
      icon: Clock,
      color: "text-muted-foreground"
    },
    {
      title: "Tareas Sincronizadas",
      value: syncStatus.syncStats?.totalSynced || 0,
      icon: RefreshCw,
      color: "text-success"
    },
    {
      title: "Proyectos Afectados",
      value: syncStatus.syncStats?.projectsAffected || 0,
      icon: Activity,
      color: "text-primary"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Sync Card */}
      <Card className="border-border/40 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-success/5"></div>
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-success animate-pulse"></div>
                Centro de Sincronización
                <Badge variant="secondary" className="bg-primary/10 text-primary animate-bounce-in">
                  Pro
                </Badge>
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Sincronización inteligente y bidireccional entre Todoist y Notion
              </CardDescription>
            </div>
            {syncStatus.lastSync && (
              <div className="text-right animate-fade-in">
                <Badge variant="secondary" className="mb-2">
                  Última sincronización
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {syncStatus.lastSync.toLocaleTimeString()}
                </div>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 relative">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
            {stats.map((stat, index) => (
              <div
                key={stat.title}
                className="p-4 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/50 transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <div>
                    <div className="font-bold text-lg">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sync Actions */}
          <div className="space-y-4">
            <Button
              size="xl"
              variant="sync"
              onClick={handleInitiateSync}
              disabled={syncStatus.isRunning}
              className="w-full text-lg h-16 shadow-lg hover:shadow-xl transition-all duration-300 animate-bounce-in"
            >
              <Eye className="h-6 w-6" />
              Previsualizar Sincronización
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300"
                disabled={syncStatus.isRunning}
              >
                <Zap className="h-4 w-4" />
                Sincronización Rápida
              </Button>
              <Button
                variant="ghost"
                className="flex-1 hover:bg-muted/50 transition-all duration-300"
                disabled={syncStatus.isRunning}
              >
                <Activity className="h-4 w-4" />
                Ver Historial
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Feedback */}
      <LiveSyncFeedback
        isActive={syncStatus.showLiveFeedback}
        steps={syncSteps}
        currentStep={currentStep}
        overallProgress={syncStatus.progress}
      />

      {/* Service Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center animate-float">
                <span className="text-white font-bold">T</span>
              </div>
              Todoist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Estado de conexión</span>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  Conectado
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Proyectos activos</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tareas pendientes</span>
                <span className="font-medium">234</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                <span className="text-white font-bold">N</span>
              </div>
              Notion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Estado de conexión</span>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  Conectado
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Base de datos</span>
                <span className="font-medium">Task Manager</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Entradas totales</span>
                <span className="font-medium">189</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Modal */}
      {syncStatus.showPreview && (
        <SyncPreviewModal
          preview={mockPreview}
          onConfirm={handlePreviewConfirm}
          onCancel={handlePreviewCancel}
          isLoading={syncStatus.isRunning}
        />
      )}
    </div>
  );
}