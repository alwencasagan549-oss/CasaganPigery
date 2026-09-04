import { Toaster } from "@/components/ui/toaster";
import React, { useEffect, useState } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Login from "./pages/Login";
import AvailablePigs from "./pages/AvailablePigs";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/admin/Dashboard";
import PigInventory from "./pages/admin/PigInventory";
import Breeding from "./pages/admin/Breeding";
import Health from "./pages/admin/Health";
import Feed from "./pages/admin/Feed";
import Sales from "./pages/admin/Sales";
import Customers from "./pages/admin/Customers";
import Inquiries from "./pages/admin/Inquiries";
import Reports from "./pages/admin/Reports";
import Admins from "./pages/admin/Admins";

import { CoreProvider } from "./components/Internal/CoreProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CoreProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/available-pigs" element={<AvailablePigs />} />
            <Route path="/privacy" element={<Privacy />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/pigs" element={<PigInventory />} />
            <Route path="/admin/breeding" element={<Breeding />} />
            <Route path="/admin/health" element={<Health />} />
            <Route path="/admin/feed" element={<Feed />} />
            <Route path="/admin/sales" element={<Sales />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/inquiries" element={<Inquiries />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/admins" element={<Admins />} />
            
            {/* ADD ANY NEW ROUTES ABOVE THIS LINE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CoreProvider>
  </QueryClientProvider>
);

export default App;
