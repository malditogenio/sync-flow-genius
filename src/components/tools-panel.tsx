import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrphanTask {
  id: string;
  content: string;
  created: string;
}

interface OrphanStatus {
  isSearching: boolean;
  isCleaning: boolean;
  progress: number;
  message: string;
  orphanTasks: OrphanTask[];
}

export function ToolsPanel() {
  const [orphanStatus, setOrphanStatus] = useState<OrphanStatus>({
    isSearching: false,
    isCleaning: false,
    progress: 0,
    message: "Listo para buscar tareas huérfanas",
    orphanTasks: []
  });
  const { toast } = useToast();

  const handlePreviewOrphans = async () => {
    setOrphanStatus(prev => ({
      ...prev,
      isSearching: true,
      progress: 0,
      message: "Buscando tareas sin proyecto..."
    }));

    // Simulación de búsqueda
    const steps = [
      { progress: 25, message: "Conectando con Todoist..." },
      { progress: 50, message: "Analizando tareas..." },
      { progress: 75, message: "Identificando tareas huérfanas..." },
      { progress: 100, message: "Búsqueda completada" }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setOrphanStatus(prev => ({
        ...prev,
        progress: step.progress,
        message: step.message
      }));
    }

    // Simular tareas encontradas
    const mockOrphans: OrphanTask[] = [
      { id: "1", content: "Revisar documentos pendientes", created: "2024-01-15" },
      { id: "2", content: "Llamar al cliente ABC", created: "2024-01-14" },
      { id: "3", content: "Actualizar presentación", created: "2024-01-13" },
      { id: "4", content: "Comprar suministros de oficina", created: "2024-01-12" }
    ];

    setOrphanStatus(prev => ({
      ...prev,
      isSearching: false,
      progress: 100,
      message: `Se encontraron ${mockOrphans.length} tareas huérfanas`,
      orphanTasks: mockOrphans
    }));

    toast({
      title: "Búsqueda completada",
      description: `Se encontraron ${mockOrphans.length} tareas sin proyecto asignado.`,
      variant: "default"
    });
  };

  const handleCleanupOrphans = async () => {
    setOrphanStatus(prev => ({
      ...prev,
      isCleaning: true,
      progress: 0,
      message: "Iniciando limpieza..."
    }));

    const taskCount = orphanStatus.orphanTasks.length;
    
    for (let i = 0; i < taskCount; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const progress = Math.round(((i + 1) / taskCount) * 100);
      setOrphanStatus(prev => ({
        ...prev,
        progress,
        message: `Moviendo tarea ${i + 1}/${taskCount} a Bandeja de entrada...`
      }));
    }

    setOrphanStatus(prev => ({
      ...prev,
      isCleaning: false,
      progress: 100,
      message: "Limpieza completada",
      orphanTasks: []
    }));

    toast({
      title: "Limpieza completada",
      description: `Se movieron ${taskCount} tareas a la Bandeja de entrada.`,
      variant: "default"
    });
  };

  const hasOrphanTasks = orphanStatus.orphanTasks.length > 0;

  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Gestión de Tareas Huérfanas
          </CardTitle>
          <CardDescription>
            Encuentra y organiza tareas que no están asignadas a ningún proyecto en Todoist
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Section */}
          {(orphanStatus.isSearching || orphanStatus.isCleaning) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{orphanStatus.message}</span>
                <span className="text-sm text-muted-foreground">{orphanStatus.progress}%</span>
              </div>
              <Progress 
                value={orphanStatus.progress} 
                className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-warning [&>div]:to-info"
              />
            </div>
          )}

          {/* Search Button */}
          <Button
            onClick={handlePreviewOrphans}
            disabled={orphanStatus.isSearching || orphanStatus.isCleaning}
            variant="default"
            className="w-full"
          >
            <Search className="h-4 w-4" />
            {orphanStatus.isSearching ? "Buscando..." : "Buscar Tareas sin Proyecto"}
          </Button>

          {/* Results */}
          {hasOrphanTasks && !orphanStatus.isSearching && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="bg-warning/10 text-warning">
                  {orphanStatus.orphanTasks.length} tareas encontradas
                </Badge>
              </div>

              {/* Task List */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {orphanStatus.orphanTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{task.content}</p>
                      <p className="text-xs text-muted-foreground">Creada: {task.created}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cleanup Button */}
              <Button
                onClick={handleCleanupOrphans}
                disabled={orphanStatus.isCleaning}
                variant="destructive"
                className="w-full"
              >
                <ArrowDown className="h-4 w-4" />
                {orphanStatus.isCleaning ? "Moviendo..." : "Mover a Bandeja de Entrada"}
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!hasOrphanTasks && !orphanStatus.isSearching && orphanStatus.orphanTasks.length === 0 && orphanStatus.message !== "Listo para buscar tareas huérfanas" && (
            <div className="text-center py-8">
              <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                <Search className="h-6 w-6 text-success" />
              </div>
              <p className="text-sm text-muted-foreground">
                ¡Excelente! No se encontraron tareas huérfanas.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">¿Qué son las tareas huérfanas?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Las tareas huérfanas son aquellas que existen en Todoist pero no están asignadas a ningún proyecto específico.
          </p>
          <p className="text-sm text-muted-foreground">
            Esta herramienta te ayuda a identificarlas y moverlas automáticamente a tu "Bandeja de entrada" para mantener tu espacio de trabajo organizado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}