import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ApiSettings {
  todoistToken: string;
  notionToken: string;
  notionDbId: string;
}

export function SettingsPanel() {
  const [settings, setSettings] = useState<ApiSettings>({
    todoistToken: "",
    notionToken: "",
    notionDbId: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!settings.todoistToken || !settings.notionToken || !settings.notionDbId) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos de configuración.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simular guardado
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    toast({
      title: "Configuración guardada",
      description: "Las claves de API han sido guardadas correctamente.",
      variant: "default"
    });
  };

  const isConfigured = settings.todoistToken && settings.notionToken && settings.notionDbId;

  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Configuración de API</CardTitle>
              <CardDescription>
                Configure las claves de acceso para Todoist y Notion
              </CardDescription>
            </div>
            {isConfigured && (
              <Badge variant="secondary" className="bg-success/10 text-success">
                Configurado
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Todoist Token */}
          <div className="space-y-2">
            <Label htmlFor="todoist-token">Token de API de Todoist</Label>
            <Input
              id="todoist-token"
              type="password"
              placeholder="Ingresa tu token de Todoist"
              value={settings.todoistToken}
              onChange={(e) => setSettings(prev => ({ ...prev, todoistToken: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Puedes obtener tu token en: Todoist → Configuración → Integraciones
            </p>
          </div>

          {/* Notion Token */}
          <div className="space-y-2">
            <Label htmlFor="notion-token">Token de Integración de Notion</Label>
            <Input
              id="notion-token"
              type="password"
              placeholder="Ingresa tu token de Notion"
              value={settings.notionToken}
              onChange={(e) => setSettings(prev => ({ ...prev, notionToken: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Crea una integración en: notion.so/my-integrations
            </p>
          </div>

          {/* Notion Database ID */}
          <div className="space-y-2">
            <Label htmlFor="notion-db">ID de Base de Datos de Notion</Label>
            <Input
              id="notion-db"
              placeholder="Ingresa el ID de tu base de datos"
              value={settings.notionDbId}
              onChange={(e) => setSettings(prev => ({ ...prev, notionDbId: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">
              Copia el ID desde la URL de tu base de datos de tareas en Notion
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full"
            variant={isConfigured ? "default" : "default"}
          >
            {isLoading ? "Guardando..." : "Guardar Configuración"}
          </Button>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Guía de Configuración</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">1. Token de Todoist</h4>
            <p className="text-sm text-muted-foreground">
              Ve a Todoist → Configuración → Integraciones → Token de API y copia el token.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">2. Integración de Notion</h4>
            <p className="text-sm text-muted-foreground">
              Visita notion.so/my-integrations, crea una nueva integración y copia el token.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">3. Base de Datos de Notion</h4>
            <p className="text-sm text-muted-foreground">
              Crea una base de datos para tus tareas en Notion y comparte la página con tu integración.
              El ID está en la URL: notion.so/[workspace]/[database-id]
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}