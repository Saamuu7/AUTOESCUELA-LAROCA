import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Alumnos from "./pages/Alumnos";
import Profesores from "./pages/Profesores";
import ClasesPracticas from "./pages/ClasesPracticas";
import ClasesTeoricas from "./pages/ClasesTeoricas";
import Seguimiento from "./pages/Seguimiento";
import Pagos from "./pages/Pagos";
import Notificaciones from "./pages/Notificaciones";
import Estadisticas from "./pages/Estadisticas";
import Documentos from "./pages/Documentos";
import Vehiculos from "./pages/Vehiculos";
import Admin from "./pages/Admin";
import Perfil from "./pages/Perfil";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/profesores" element={<Profesores />} />
                  <Route path="/alumnos" element={<Alumnos />} />
                  <Route path="/clases-practicas" element={<ClasesPracticas />} />
                  <Route path="/clases-teoricas" element={<ClasesTeoricas />} />
                  <Route path="/seguimiento" element={<Seguimiento />} />
                  <Route path="/pagos" element={<Pagos />} />
                  <Route path="/notificaciones" element={<Notificaciones />} />
                  <Route path="/estadisticas" element={<Estadisticas />} />
                  <Route path="/documentos" element={<Documentos />} />
                  <Route path="/vehiculos" element={<Vehiculos />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/perfil" element={<Perfil />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
