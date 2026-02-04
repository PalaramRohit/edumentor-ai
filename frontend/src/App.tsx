import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardContent from "./components/dashboard/DashboardContent";
import AppShell from "./components/layout/AppShell";
import Roadmap from "./pages/Roadmap";
import Syllabus from "./pages/Syllabus";
import Analysis from "./pages/Analysis";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ResumeBuilder from "./pages/ResumeBuilder";
import PaperGenerator from "./pages/PaperGenerator";

const queryClient = new QueryClient();

import LandingPage from "./pages/LandingPage";
import { useAuth, AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import History from "./pages/History";
import MockInterview from "./pages/MockInterview";
import Feedback from "./pages/Feedback";
import { LanguageProvider } from "./context/LanguageContext";

const Root = () => {
  const { token, isLoading } = useAuth();
  if (isLoading) return null;
  return token ? (
    <AppShell>
      <DashboardContent />
    </AppShell>
  ) : (
    <LandingPage />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<Root />} />
              <Route element={<ProtectedRoute />}>
                <Route element={<AppShell />}>
                  <Route path="/roadmap" element={<Roadmap />} />
                  <Route path="/syllabus" element={<Syllabus />} />
                  <Route path="/analysis" element={<Analysis />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/resume" element={<ResumeBuilder />} />
                  <Route path="/paper" element={<PaperGenerator />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/interview" element={<MockInterview />} />
                  <Route path="/feedback" element={<Feedback />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

// Force Rebuild
