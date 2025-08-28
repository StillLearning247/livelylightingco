// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import { ScrollToTop } from "./components/ScrollToTop";
import { AdminRoute } from "./components/AdminRoute";
import { AdminHome } from "./pages/AdminHome"; // mirrored homepage
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabase";

function AuthRedirector() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(
      async (evt, session) => {
        if (evt === "SIGNED_IN" && session) {
          // Only redirect if the signed-in user is an admin
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
  }, [navigate]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      {/* auth listener lives inside Router so it can navigate */}
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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
