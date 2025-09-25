import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import StudentLogin from "./pages/StudentLogin";
import About from "./pages/About";
import Features from "./pages/Features";
import Practice from "./pages/Practice";
import Developers from "./pages/Developers";
import AdminDashboard from "./pages/AdminDashboard";
import Exam from "./pages/Exam";
import Analysis from "./pages/Analysis";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import Layout from "./Layout";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<StudentLogin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/developers" element={<Developers />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/exam" element={<Exam />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
