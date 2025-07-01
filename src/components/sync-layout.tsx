import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SyncDashboard } from "./sync-dashboard";
import { SettingsPanel } from "./settings-panel";
import { ToolsPanel } from "./tools-panel";
import { RefreshCw, Settings, Search } from "lucide-react";

export function SyncLayout() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container flex h-20 items-center">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary via-primary to-success flex items-center justify-center shadow-lg animate-float">
              <RefreshCw className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
                Sync Genius
              </h1>
              <p className="text-sm text-muted-foreground">
                Sincronización profesional Todoist ↔ Notion
              </p>
            </div>
          </div>
          <div className="ml-auto">
            <Badge variant="secondary" className="bg-primary/10 text-primary animate-pulse">
              v2.0 Pro
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Sincronización
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Herramientas
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configuración
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <SyncDashboard />
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <ToolsPanel />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}