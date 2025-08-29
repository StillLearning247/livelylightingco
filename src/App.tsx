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
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { ScrollToTop } from "./components/ScrollToTop";
import { AdminRoute } from "./components/AdminRoute";
import { AdminHome } from "./pages/AdminHome"; // mirrored homepage
import { AdminProvider } from "./components/AdminProvider";

// Handles redirecting after auth changes AND on first load
function AuthRedirector() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Initial session check (covers page refresh / direct load)
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const { data: isAdmin, error } = await supabase.rpc("is_admin");
        if (!error && isAdmin && !location.pathname.startsWith("/admin")) {
          navigate("/admin", { replace: true });
        }
      }
    })();

    // Listen for sign-in/sign-out events
    const { data: sub } = supabase.auth.onAuthStateChange(
      async (evt, session) => {
        if (evt === "SIGNED_IN" && session) {
          const { data: isAdmin, error } = await supabase.rpc("is_admin");
          if (!error && isAdmin) {
            navigate("/admin", { replace: true });
          }
        }
        if (evt === "SIGNED_OUT") {
          navigate("/", { replace: true });
        }
      }
    );

    return () => sub.subscription.unsubscribe();
  }, [navigate, location.pathname]);

  return null;
}

function App() {
  return (
    <Router>
      <AdminProvider>
        <ScrollToTop />
        {/* lives inside Router so it can navigate */}
        <AuthRedirector />

        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Guarded admin mirror homepage */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminHome />
                </AdminRoute>
              }
            />

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
