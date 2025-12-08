import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Alumnos from "./pages/Alumnos";
import Profesores from "./pages/Profesores";
import ClasesPracticas from "./pages/ClasesPracticas";
import Pagos from "./pages/Pagos";
import Vehiculos from "./pages/Vehiculos";
import Estadisticas from "./pages/Estadisticas";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profesores" element={<Profesores />} />
              <Route path="/alumnos" element={<Alumnos />} />
              <Route path="/clases-practicas" element={<ClasesPracticas />} />
              <Route path="/clases-teoricas" element={<PlaceholderPage />} />
              <Route path="/seguimiento" element={<PlaceholderPage />} />
              <Route path="/pagos" element={<Pagos />} />
              <Route path="/notificaciones" element={<PlaceholderPage />} />
              <Route path="/estadisticas" element={<Estadisticas />} />
              <Route path="/documentos" element={<PlaceholderPage />} />
              <Route path="/vehiculos" element={<Vehiculos />} />
              <Route path="/admin" element={<PlaceholderPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
