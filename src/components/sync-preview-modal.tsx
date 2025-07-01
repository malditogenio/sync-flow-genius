import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle, Clock, FileText, FolderOpen } from "lucide-react";

interface TaskPreview {
  id: string;
  title: string;
  project: string;
  source: 'todoist' | 'notion';
  status: 'new' | 'update' | 'conflict';
  dueDate?: string;
  labels?: string[];
}

interface SyncPreview {
  totalTasks: number;
  newTasks: TaskPreview[];
  updateTasks: TaskPreview[];
  conflicts: TaskPreview[];
  projects: string[];
}

interface SyncPreviewModalProps {
  preview: SyncPreview;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SyncPreviewModal({ preview, onConfirm, onCancel, isLoading }: SyncPreviewModalProps) {
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(
    new Set([...preview.newTasks, ...preview.updateTasks].map(t => t.id))
  );

  const toggleTask = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const TaskList = ({ tasks, title, icon: Icon, badgeVariant }: {
    tasks: TaskPreview[];
    title: string;
    icon: any;
    badgeVariant: "default" | "secondary" | "destructive";
  }) => (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <h4 className="font-medium">{title}</h4>
        <Badge variant={badgeVariant} className="text-xs">
          {tasks.length}
        </Badge>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-md ${
              selectedTasks.has(task.id)
                ? 'bg-primary/10 border-primary/50 shadow-sm'
                : 'bg-muted/30 border-border/40 hover:bg-muted/50'
            }`}
            onClick={() => toggleTask(task.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTasks.has(task.id)}
                    onChange={() => toggleTask(task.id)}
                    className="rounded border-border"
                  />
                  <span className="font-medium text-sm">{task.title}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {task.project}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {task.source}
                  </Badge>
                  {task.dueDate && (
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {task.dueDate}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden border-border/40 bg-card/95 backdrop-blur-sm animate-scale-in">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-warning animate-pulse"></div>
                Vista Previa de Sincronización
              </CardTitle>
              <CardDescription>
                Revisa y confirma las tareas que se sincronizarán entre Todoist y Notion
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{preview.totalTasks}</div>
              <div className="text-xs text-muted-foreground">tareas total</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Projects Summary */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              <h4 className="font-medium">Proyectos Afectados</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {preview.projects.map((project) => (
                <Badge key={project} variant="outline" className="animate-slide-in">
                  {project}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* New Tasks */}
          {preview.newTasks.length > 0 && (
            <>
              <TaskList
                tasks={preview.newTasks}
                title="Tareas Nuevas"
                icon={CheckCircle}
                badgeVariant="default"
              />
              <Separator />
            </>
          )}

          {/* Updates */}
          {preview.updateTasks.length > 0 && (
            <>
              <TaskList
                tasks={preview.updateTasks}
                title="Actualizaciones"
                icon={FileText}
                badgeVariant="secondary"
              />
              <Separator />
            </>
          )}

          {/* Conflicts */}
          {preview.conflicts.length > 0 && (
            <>
              <TaskList
                tasks={preview.conflicts}
                title="Conflictos Detectados"
                icon={AlertCircle}
                badgeVariant="destructive"
              />
            </>
          )}

          {/* Summary */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <h4 className="font-medium">Resumen de Sincronización</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg text-success">{selectedTasks.size}</div>
                <div className="text-muted-foreground">Seleccionadas</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-warning">{preview.conflicts.length}</div>
                <div className="text-muted-foreground">Conflictos</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-primary">{preview.projects.length}</div>
                <div className="text-muted-foreground">Proyectos</div>
              </div>
            </div>
          </div>
        </CardContent>

        <div className="p-6 border-t border-border/40 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedTasks.size} de {preview.totalTasks} tareas seleccionadas
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                variant="sync"
                onClick={onConfirm}
                disabled={isLoading || selectedTasks.size === 0}
                className="min-w-[140px]"
              >
                {isLoading ? "Procesando..." : `Sincronizar ${selectedTasks.size} tareas`}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}