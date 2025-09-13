
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import LoadingHero from "@/components/LoadingHero";
import React, { useState, useEffect } from "react";
import Dashboard from "@/pages/Dashboard";
import AnimalDiary from "@/pages/AnimalDiary";
import Tasks from "@/pages/Tasks";
import Finances from "@/pages/Finances";
import FinanceForm from "@/pages/FinanceForm";
import Inventory from "@/pages/Inventory";
import Reminders from "@/pages/Reminders";
import Auth from "@/pages/Auth";
import NotFound from "./pages/NotFound";
import More from "./pages/More";

const queryClient = new QueryClient();

// Protected Route wrapper that allows guest access

// Delay before showing the app (ms)
const LOADING_DELAY = 8000;

const App = () => {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoading(false), LOADING_DELAY);
    return () => clearTimeout(timer);
  }, []);

  if (showLoading) {
    return <LoadingHero onComplete={() => setShowLoading(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                <Route path="/diary" element={<Layout><AnimalDiary /></Layout>} />
                <Route path="/tasks" element={<Layout><Tasks /></Layout>} />
                <Route path="/finances" element={<Layout><Finances /></Layout>} />
                <Route path="/finances/add" element={<Layout><FinanceForm /></Layout>} />
                <Route path="/inventory" element={<Layout><Inventory /></Layout>} />
                <Route path="/reminders" element={<Layout><Reminders /></Layout>} />
                <Route path="/more" element={<Layout><More /></Layout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LanguageProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
