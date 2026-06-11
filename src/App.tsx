// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { PromoPopup } from "./components/PromoPopup";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Compare from "./pages/Compare";
import Locations from "./pages/Locations";
import LocationPage from "./pages/LocationPage";
import Faq from "./pages/Faq";
import { ScrollToTop } from "./components/ScrollToTop";
import { AdminRoute } from "./components/AdminRoute";
import { AdminProvider } from "./components/AdminProvider";

// Admin pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminOverview } from "./pages/admin/AdminOverview";
import { AdminGallery } from "./pages/admin/AdminGallery";
import { AdminContent } from "./pages/admin/AdminContent";
import { AdminTestimonials } from "./pages/admin/AdminTestimonials";
import { AdminPromo } from "./pages/admin/AdminPromo";
import { AdminAnalytics } from "./pages/admin/AdminAnalytics";

// Helper to get session directly from localStorage (avoids hanging Supabase client)
function getSessionFromStorage(): { userId: string; email: string; accessToken: string } | null {
  try {
    const keys = Object.keys(localStorage);
    const authKey = keys.find((k) => k.startsWith("sb-") && k.endsWith("-auth-token"));
    if (!authKey) return null;

    const data = JSON.parse(localStorage.getItem(authKey) || "null");
    if (!data?.user?.id || !data?.access_token) return null;

    return {
      userId: data.user.id,
      email: data.user.email,
      accessToken: data.access_token,
    };
  } catch {
    return null;
  }
}

// Handles redirecting after sign-out only (admins can freely browse the site while logged in)
function AuthRedirector() {
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect on sign-out - let AdminLogin handle redirect after login
    const { data: sub } = supabase.auth.onAuthStateChange((evt) => {
      if (evt === "SIGNED_OUT") {
        navigate("/", { replace: true });
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  return null;
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AdminProvider>
        <ScrollToTop />
        {/* lives inside Router so it can navigate */}
        <AuthRedirector />

        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <PromoPopup />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/:slug" element={<LocationPage />} />
            <Route path="/faq" element={<Faq />} />

            {/* Admin Dashboard with nested routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="promo" element={<AdminPromo />} />
              <Route path="analytics" element={<AdminAnalytics />} />
            </Route>

            {/* Optional: 404 */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
          <Footer />
        </div>
      </AdminProvider>
    </Router>
  );
}

export default App;
