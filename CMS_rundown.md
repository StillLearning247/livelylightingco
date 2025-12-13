# CMS Project Setup Guide

A comprehensive guide to building a full-featured CMS with React, Supabase, Cloudinary, and Netlify.

---

## Table of Contents

1. [Tech Stack Overview](#tech-stack-overview)
2. [Project Initialization](#project-initialization)
3. [Supabase Setup](#supabase-setup)
4. [Database Schema](#database-schema)
5. [Authentication System](#authentication-system)
6. [Content Management](#content-management)
7. [Gallery/Media Management](#gallerymedia-management)
8. [Cloudinary Integration](#cloudinary-integration)
9. [Rich Text Editing](#rich-text-editing)
10. [Environment Variables](#environment-variables)
11. [Netlify Deployment](#netlify-deployment)
12. [Content Security Policy](#content-security-policy)
13. [Project Structure](#project-structure)
14. [Common Patterns](#common-patterns)
15. [Troubleshooting](#troubleshooting)

---

## Tech Stack Overview

| Category | Technology | Purpose |
|----------|------------|---------|
| Frontend | React 18 + TypeScript | UI framework |
| Build Tool | Vite | Fast dev server & bundling |
| Styling | Tailwind CSS | Utility-first CSS |
| Routing | React Router v6 | Client-side navigation |
| Database | Supabase (PostgreSQL) | Backend & auth |
| Media Storage | Cloudinary | Image hosting & optimization |
| Rich Text | TipTap | WYSIWYG editor |
| Hosting | Netlify | Deployment & CDN |
| Icons | Lucide React | Icon library |

---

## Project Initialization

### 1. Create Vite Project

```bash
npm create vite@latest my-cms-project -- --template react-ts
cd my-cms-project
npm install
```

### 2. Install Core Dependencies

```bash
# Routing
npm install react-router-dom

# Supabase
npm install @supabase/supabase-js

# Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Icons
npm install lucide-react

# Rich Text Editor
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-text-align @tiptap/extension-underline

# Cloudinary
npm install @cloudinary/url-gen @cloudinary/react

# SEO
npm install react-helmet-async
```

### 3. Configure Tailwind

**tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create account
2. Click "New Project"
3. Choose organization, name, password, and region
4. Wait for project to initialize (~2 minutes)

### 2. Get API Credentials

Navigate to **Project Settings → API** and copy:
- **Project URL** → `VITE_SUPABASE_URL`
- **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### 3. Create Supabase Client

**src/lib/supabase.ts:**
```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## Database Schema

Run these SQL commands in **Supabase SQL Editor** (Database → SQL Editor → New Query):

### 1. Page Content Table

```sql
-- Stores editable content for each page
CREATE TABLE page_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL,
  field_name TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_name, field_name)
);

-- Index for fast lookups
CREATE INDEX idx_page_content_page ON page_content(page_name);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER page_content_updated
  BEFORE UPDATE ON page_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### 2. Gallery Images Table

```sql
-- Stores gallery/portfolio images
CREATE TABLE gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cloudinary_public_id TEXT NOT NULL,
  title TEXT,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for ordering
CREATE INDEX idx_gallery_order ON gallery_images(display_order);

CREATE TRIGGER gallery_images_updated
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### 3. Testimonials Table

```sql
-- Stores customer testimonials/reviews
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_title TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX idx_testimonials_order ON testimonials(display_order);

CREATE TRIGGER testimonials_updated
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### 4. Admin Users Table (Optional - for role-based access)

```sql
-- Tracks admin users (auth handled by Supabase Auth)
CREATE TABLE admin_users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5. Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view published content)
CREATE POLICY "Public read access" ON page_content
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON gallery_images
  FOR SELECT USING (true);

CREATE POLICY "Public read access" ON testimonials
  FOR SELECT USING (true);

-- Admin write access (only authenticated users can modify)
CREATE POLICY "Admin insert" ON page_content
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update" ON page_content
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete" ON page_content
  FOR DELETE USING (auth.role() = 'authenticated');

-- Repeat for gallery_images
CREATE POLICY "Admin insert" ON gallery_images
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update" ON gallery_images
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete" ON gallery_images
  FOR DELETE USING (auth.role() = 'authenticated');

-- Repeat for testimonials
CREATE POLICY "Admin insert" ON testimonials
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update" ON testimonials
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete" ON testimonials
  FOR DELETE USING (auth.role() = 'authenticated');
```

### 6. Seed Initial Content (Optional)

```sql
-- Seed default page content
INSERT INTO page_content (page_name, field_name, content) VALUES
  ('home', 'hero_title', 'Welcome to Our Site'),
  ('home', 'hero_subtitle', 'Your tagline goes here'),
  ('home', 'cta_button_text', 'Get Started'),
  ('about', 'page_title', 'About Us'),
  ('about', 'description', 'Tell your story here...'),
  ('contact', 'form_title', 'Get in Touch'),
  ('contact', 'form_subtitle', 'We would love to hear from you'),
  ('footer', 'tagline', 'Your company tagline'),
  ('footer', 'phone', '(555) 123-4567'),
  ('footer', 'email', 'contact@example.com')
ON CONFLICT (page_name, field_name) DO NOTHING;
```

---

## Authentication System

### 1. Create Admin User

In Supabase Dashboard:
1. Go to **Authentication → Users**
2. Click **Add User → Create New User**
3. Enter email and password
4. Check "Auto Confirm User"

### 2. Auth Context Provider

**src/contexts/AuthContext.tsx:**
```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
```

### 3. Protected Route Component

**src/components/ProtectedRoute.tsx:**
```typescript
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

### 4. Login Page

**src/pages/admin/AdminLogin.tsx:**
```typescript
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};
```

---

## Content Management

### 1. Content Hook

**src/hooks/usePageContent.ts:**
```typescript
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

interface PageContent {
  [fieldName: string]: string;
}

export const usePageContent = (pageName: string) => {
  const [content, setContent] = useState<PageContent>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("page_content")
        .select("field_name, content")
        .eq("page_name", pageName);

      if (error) throw error;

      const contentMap: PageContent = {};
      data?.forEach((item) => {
        contentMap[item.field_name] = item.content || "";
      });

      setContent(contentMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch content");
    } finally {
      setLoading(false);
    }
  }, [pageName]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const updateContent = async (fieldName: string, newContent: string) => {
    try {
      const { error } = await supabase
        .from("page_content")
        .upsert(
          {
            page_name: pageName,
            field_name: fieldName,
            content: newContent,
          },
          { onConflict: "page_name,field_name" }
        );

      if (error) throw error;

      setContent((prev) => ({ ...prev, [fieldName]: newContent }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return { content, loading, error, updateContent, refetch: fetchContent };
};
```

### 2. Editable Area Component

**src/components/EditableArea.tsx:**
```typescript
import { useState, ReactNode } from "react";
import { Pencil } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface EditableAreaProps {
  children: ReactNode;
  fieldName: string;
  onSave: (fieldName: string, content: string) => Promise<{ success: boolean }>;
  currentContent: string;
  multiline?: boolean;
  richText?: boolean;
}

export const EditableArea = ({
  children,
  fieldName,
  onSave,
  currentContent,
  multiline = false,
  richText = false,
}: EditableAreaProps) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(currentContent);
  const [saving, setSaving] = useState(false);

  // Only show edit UI for authenticated admins
  if (!user) {
    return <>{children}</>;
  }

  const handleSave = async () => {
    setSaving(true);
    const result = await onSave(fieldName, content);
    if (result.success) {
      setIsEditing(false);
    }
    setSaving(false);
  };

  if (isEditing) {
    return (
      <div className="relative border-2 border-indigo-500 rounded-lg p-2">
        {multiline ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[100px] p-2 border rounded"
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            autoFocus
          />
        )}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-3 py-1 bg-indigo-600 text-white rounded text-sm"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => {
              setContent(currentContent);
              setIsEditing(false);
            }}
            className="px-3 py-1 bg-slate-200 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative">
      {children}
      <button
        onClick={() => setIsEditing(true)}
        className="absolute -top-2 -right-2 p-1 bg-indigo-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        title={`Edit ${fieldName}`}
      >
        <Pencil className="h-3 w-3" />
      </button>
    </div>
  );
};
```

### 3. Admin Content Editor Page

**src/pages/admin/AdminContent.tsx:**
```typescript
import { useState } from "react";
import { usePageContent } from "../../hooks/usePageContent";
import { RichTextEditor } from "../../components/RichTextEditor";

const TABS = ["home", "about", "contact", "footer"] as const;
type TabType = typeof TABS[number];

// Define fields for each page
const PAGE_FIELDS: Record<TabType, { name: string; label: string; multiline?: boolean; richText?: boolean }[]> = {
  home: [
    { name: "hero_title", label: "Hero Title" },
    { name: "hero_subtitle", label: "Hero Subtitle", multiline: true },
    { name: "cta_button_text", label: "CTA Button Text" },
  ],
  about: [
    { name: "page_title", label: "Page Title" },
    { name: "description", label: "Description", multiline: true, richText: true },
  ],
  contact: [
    { name: "form_title", label: "Form Title" },
    { name: "form_subtitle", label: "Form Subtitle" },
  ],
  footer: [
    { name: "tagline", label: "Tagline" },
    { name: "phone", label: "Phone" },
    { name: "email", label: "Email" },
  ],
};

// Default content for when database is empty
const DEFAULT_CONTENT: Record<TabType, Record<string, string>> = {
  home: {
    hero_title: "Welcome to Our Site",
    hero_subtitle: "Your tagline here",
    cta_button_text: "Get Started",
  },
  about: {
    page_title: "About Us",
    description: "Tell your story...",
  },
  contact: {
    form_title: "Contact Us",
    form_subtitle: "We'd love to hear from you",
  },
  footer: {
    tagline: "Your company tagline",
    phone: "(555) 123-4567",
    email: "contact@example.com",
  },
};

export const AdminContent = () => {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const { content, loading, updateContent } = usePageContent(activeTab);

  const handleSave = async (fieldName: string, newContent: string) => {
    return await updateContent(fieldName, newContent);
  };

  // Get display value (from DB or default)
  const getValue = (fieldName: string) => {
    return content[fieldName] || DEFAULT_CONTENT[activeTab]?.[fieldName] || "";
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Content Management</h1>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium capitalize ${
              activeTab === tab
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Fields */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-6">
          {PAGE_FIELDS[activeTab].map((field) => (
            <div key={field.name} className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {field.label}
              </label>
              {field.richText ? (
                <RichTextEditor
                  content={getValue(field.name)}
                  onSave={(html) => handleSave(field.name, html)}
                />
              ) : field.multiline ? (
                <TextAreaField
                  value={getValue(field.name)}
                  onSave={(value) => handleSave(field.name, value)}
                />
              ) : (
                <InputField
                  value={getValue(field.name)}
                  onSave={(value) => handleSave(field.name, value)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Simple input field component
const InputField = ({ value, onSave }: { value: string; onSave: (v: string) => Promise<any> }) => {
  const [localValue, setLocalValue] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleBlur = async () => {
    if (localValue !== value) {
      setSaving(true);
      await onSave(localValue);
      setSaving(false);
    }
  };

  return (
    <input
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      disabled={saving}
      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
    />
  );
};

// Textarea field component
const TextAreaField = ({ value, onSave }: { value: string; onSave: (v: string) => Promise<any> }) => {
  const [localValue, setLocalValue] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleBlur = async () => {
    if (localValue !== value) {
      setSaving(true);
      await onSave(localValue);
      setSaving(false);
    }
  };

  return (
    <textarea
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      disabled={saving}
      rows={4}
      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
    />
  );
};
```

---

## Gallery/Media Management

### 1. Gallery Hook

**src/hooks/useGallery.ts:**
```typescript
import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export interface GalleryImage {
  id: string;
  cloudinary_public_id: string;
  title: string;
  alt_text: string;
  display_order: number;
}

// Public hook (read-only)
export const useGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("display_order", { ascending: true });

      if (!error && data) {
        setImages(data);
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  return { images, loading };
};

// Admin hook (full CRUD)
export const useAdminGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setImages(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const addImage = async (publicId: string, title: string, altText: string) => {
    const maxOrder = images.length > 0
      ? Math.max(...images.map(img => img.display_order))
      : 0;

    const { data, error } = await supabase
      .from("gallery_images")
      .insert({
        cloudinary_public_id: publicId,
        title,
        alt_text: altText,
        display_order: maxOrder + 1,
      })
      .select()
      .single();

    if (!error && data) {
      setImages((prev) => [...prev, data]);
    }
    return { data, error };
  };

  const updateImage = async (id: string, updates: Partial<GalleryImage>) => {
    const { error } = await supabase
      .from("gallery_images")
      .update(updates)
      .eq("id", id);

    if (!error) {
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
      );
    }
    return { error };
  };

  const deleteImage = async (id: string) => {
    const { error } = await supabase
      .from("gallery_images")
      .delete()
      .eq("id", id);

    if (!error) {
      setImages((prev) => prev.filter((img) => img.id !== id));
    }
    return { error };
  };

  const reorderImages = async (reorderedImages: GalleryImage[]) => {
    const updates = reorderedImages.map((img, index) => ({
      id: img.id,
      display_order: index,
    }));

    for (const update of updates) {
      await supabase
        .from("gallery_images")
        .update({ display_order: update.display_order })
        .eq("id", update.id);
    }

    await fetchImages();
  };

  return {
    images,
    loading,
    addImage,
    updateImage,
    deleteImage,
    reorderImages,
    refetch: fetchImages,
  };
};
```

---

## Cloudinary Integration

### 1. Create Cloudinary Account

1. Go to [cloudinary.com](https://cloudinary.com) and sign up
2. Note your **Cloud Name** from the dashboard

### 2. Create Upload Preset

1. Go to **Settings → Upload → Upload presets**
2. Click **Add upload preset**
3. Configure:
   - **Preset name:** `your_preset_name` (e.g., `my_gallery`)
   - **Signing mode:** **Unsigned** (required for client-side uploads)
   - **Folder:** Optional, e.g., `my-site/gallery`
4. Save the preset

### 3. Cloudinary Client Setup

**src/lib/cloudinary.ts:**
```typescript
import { Cloudinary } from "@cloudinary/url-gen";

const cld = new Cloudinary({
  cloud: {
    cloudName: "YOUR_CLOUD_NAME", // Replace with your cloud name
  },
});

export default cld;
```

### 4. Upload Widget Component

**src/components/CloudinaryUpload.tsx:**
```typescript
import { useEffect, useRef } from "react";

interface CloudinaryUploadProps {
  onUpload: (publicId: string, originalFilename: string) => void;
  onError?: (error: any) => void;
}

// Extend Window interface for Cloudinary
declare global {
  interface Window {
    cloudinary: any;
  }
}

export const CloudinaryUpload = ({ onUpload, onError }: CloudinaryUploadProps) => {
  const widgetRef = useRef<any>(null);

  const openWidget = () => {
    if (!window.cloudinary) {
      alert("Cloudinary widget not loaded. Please refresh the page.");
      return;
    }

    if (!widgetRef.current) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: "YOUR_CLOUD_NAME",
          uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
          sources: ["local", "url", "camera"],
          multiple: true,
          maxFiles: 10,
          resourceType: "image",
          folder: "your-site/gallery",
        },
        (error: any, result: any) => {
          if (error) {
            console.error("Upload error:", error);
            onError?.(error);
            return;
          }

          if (result.event === "success") {
            onUpload(
              result.info.public_id,
              result.info.original_filename || ""
            );
          }
        }
      );
    }

    widgetRef.current.open();
  };

  return (
    <button
      onClick={openWidget}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
    >
      Upload Images
    </button>
  );
};
```

### 5. Add Widget Script to HTML

**index.html:**
```html
<body>
  <div id="root"></div>

  <!-- Cloudinary Upload Widget -->
  <script
    src="https://upload-widget.cloudinary.com/global/all.js"
    type="text/javascript"
  ></script>
</body>
```

### 6. Display Cloudinary Images

```typescript
import cld from "../lib/cloudinary";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { quality } from "@cloudinary/url-gen/actions/delivery";

// Generate optimized image URL
const getImageUrl = (publicId: string, width: number, height: number) => {
  const image = cld.image(publicId);
  image
    .format("auto")
    .delivery(quality("auto"))
    .resize(fill().width(width).height(height));
  return image.toURL();
};

// Usage in component
<img src={getImageUrl(image.cloudinary_public_id, 400, 300)} alt={image.alt_text} />
```

---

## Rich Text Editing

### 1. TipTap Editor Component

**src/components/RichTextEditor.tsx:**
```typescript
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onSave: (html: string) => Promise<any>;
}

export const RichTextEditor = ({ content, onSave }: RichTextEditorProps) => {
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[200px] p-4 focus:outline-none",
      },
    },
  });

  // Update editor when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleSave = async () => {
    if (!editor) return;
    setSaving(true);
    await onSave(editor.getHTML());
    setSaving(false);
  };

  if (!editor) return null;

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-slate-50">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-slate-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-slate-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
        >
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
        >
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
        >
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Save Button */}
      <div className="p-2 border-t bg-slate-50">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

const ToolbarButton = ({
  onClick,
  isActive,
  children,
}: {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`p-2 rounded hover:bg-slate-200 ${
      isActive ? "bg-slate-200 text-indigo-600" : "text-slate-700"
    }`}
  >
    {children}
  </button>
);
```

### 2. Strip HTML Utility

**src/lib/stripHtml.ts:**
```typescript
/**
 * Decode HTML entities in a string
 */
const decodeHtmlEntities = (text: string): string => {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/");
};

/**
 * Strip HTML tags from rich text content
 * Used to display plain text from the CMS rich text editor
 */
export const stripHtml = (html: string): string => {
  if (!html) return "";

  // First decode any HTML entities (handles double-encoded content)
  let decoded = decodeHtmlEntities(html);

  // If we decoded entities that look like tags, decode again
  if (decoded.includes("&lt;") || decoded.includes("&gt;")) {
    decoded = decodeHtmlEntities(decoded);
  }

  // Use DOM parser to strip tags (most reliable)
  if (typeof document !== "undefined") {
    try {
      const tmp = document.createElement("div");
      tmp.innerHTML = decoded;
      const text = tmp.textContent || tmp.innerText || "";
      return text.trim().replace(/\s+/g, " ");
    } catch {
      // Fall through to regex approach
    }
  }

  // Fallback: regex-based stripping
  return decoded
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .trim()
    .replace(/\s+/g, " "); // Normalize whitespace
};
```

---

## Environment Variables

### Local Development (.env)

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Cloudinary
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

# Admin Testing (optional - for Playwright tests)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_password
```

### .env.example (commit this to repo)

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary (for gallery uploads)
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset

# Admin credentials for testing (optional)
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
```

### .gitignore

```
# Environment variables
.env
.env.local
.env.*.local

# Dependencies
node_modules

# Build output
dist

# IDE
.vscode
.idea

# OS
.DS_Store
Thumbs.db
```

---

## Netlify Deployment

### 1. netlify.toml Configuration

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

# SPA routing - redirect all routes to index.html
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Security headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

# Cache control for index.html (no cache)
[[headers]]
  for = "/index.html"
  [headers.values]
    Cache-Control = "no-cache, must-revalidate"

# Cache control for assets (long-term cache)
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### 2. Environment Variables in Netlify

1. Go to **Site configuration → Environment variables**
2. Add all `VITE_*` variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`

### 3. Deploy

```bash
# Option 1: Connect to GitHub
# Netlify will auto-deploy on push

# Option 2: Manual deploy
npm run build
npx netlify deploy --prod --dir=dist
```

---

## Content Security Policy

For sites with external services (analytics, Cloudinary, Supabase), configure CSP in netlify.toml:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = """
      default-src 'self';
      base-uri 'self';
      object-src 'none';
      img-src 'self' data: blob: https://res.cloudinary.com https://*.cloudinary.com https://www.google-analytics.com;
      script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://upload-widget.cloudinary.com https://widget.cloudinary.com;
      script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://upload-widget.cloudinary.com https://widget.cloudinary.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://www.google-analytics.com https://*.supabase.co wss://*.supabase.co https://api.cloudinary.com https://*.cloudinary.com;
      frame-src https://upload-widget.cloudinary.com https://*.cloudinary.com;
      worker-src 'self' blob:
    """
```

**Common CSP Directives:**

| Directive | Purpose |
|-----------|---------|
| `default-src` | Fallback for other directives |
| `script-src` | JavaScript sources |
| `script-src-elem` | `<script>` element sources |
| `style-src` | CSS sources |
| `img-src` | Image sources |
| `font-src` | Font sources |
| `connect-src` | Fetch/XHR/WebSocket targets |
| `frame-src` | Iframe sources |
| `worker-src` | Web worker sources |

---

## Project Structure

```
my-cms-project/
├── public/
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── components/
│   │   ├── EditableArea.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── RichTextEditor.tsx
│   │   └── SEO.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useGallery.ts
│   │   ├── usePageContent.ts
│   │   └── useTestimonials.ts
│   ├── lib/
│   │   ├── cloudinary.ts
│   │   ├── stripHtml.ts
│   │   └── supabase.ts
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminContent.tsx
│   │   │   ├── AdminGallery.tsx
│   │   │   ├── AdminLayout.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   └── AdminTestimonials.tsx
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Gallery.tsx
│   │   └── Home.tsx
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env
├── .env.example
├── .gitignore
├── index.html
├── netlify.toml
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Common Patterns

### 1. Upsert Pattern (Insert or Update)

```typescript
const { error } = await supabase
  .from("page_content")
  .upsert(
    {
      page_name: "home",
      field_name: "hero_title",
      content: "New Title",
    },
    { onConflict: "page_name,field_name" }
  );
```

### 2. Optimistic Updates

```typescript
const updateItem = async (id: string, updates: Partial<Item>) => {
  // Update local state immediately
  setItems((prev) =>
    prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
  );

  // Then sync to database
  const { error } = await supabase
    .from("items")
    .update(updates)
    .eq("id", id);

  // Rollback on error
  if (error) {
    await refetch();
  }
};
```

### 3. Drag and Drop Reordering

```typescript
const handleDragStart = (e: React.DragEvent, index: number) => {
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/plain", String(index));
  setDraggedIndex(index);
};

const handleDragOver = (e: React.DragEvent, index: number) => {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  setDragOverIndex(index);
};

const handleDrop = (e: React.DragEvent, dropIndex: number) => {
  e.preventDefault();
  if (draggedIndex === null) return;

  const newItems = [...items];
  const [draggedItem] = newItems.splice(draggedIndex, 1);
  newItems.splice(dropIndex, 0, draggedItem);

  setItems(newItems);
  setDraggedIndex(null);
  setDragOverIndex(null);
};
```

### 4. Default Content Fallback

```typescript
const DEFAULT_CONTENT = {
  hero_title: "Welcome",
  hero_subtitle: "Your tagline here",
};

// In component
const getValue = (field: string) => {
  return content[field] || DEFAULT_CONTENT[field] || "";
};
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Cloudinary widget not loaded" | CSP blocking script | Add Cloudinary domains to CSP |
| 400 Bad Request on upload | Missing/invalid upload preset | Create unsigned preset in Cloudinary |
| "Row Level Security" error | RLS policies blocking access | Check policies allow authenticated user |
| Content not saving | Missing auth token | Ensure user is logged in |
| Images not displaying | Wrong Cloudinary cloud name | Verify cloud name in config |
| Env vars undefined in production | Not set in Netlify | Add to Netlify environment variables |
| CSP frame-src violation | Widget uses iframe | Add domain to `frame-src` directive |

### Debug Tips

1. **Check browser console** for CSP violations
2. **Check Network tab** for failed requests (400, 401, 403)
3. **Check Supabase logs** (Database → Logs) for SQL errors
4. **Test RLS policies** in SQL Editor with `auth.uid()` check
5. **Verify env vars** with `console.log(import.meta.env.VITE_*)`

### Supabase RLS Debug Query

```sql
-- Check if user is authenticated
SELECT auth.uid(), auth.role();

-- Test a policy manually
SELECT * FROM page_content WHERE true; -- Should work if SELECT policy is correct
```

---

## Quick Start Checklist

- [ ] Create Vite + React + TypeScript project
- [ ] Install dependencies (Supabase, Tailwind, TipTap, Cloudinary, etc.)
- [ ] Set up Supabase project and get API keys
- [ ] Run database schema SQL (tables, indexes, triggers)
- [ ] Configure RLS policies
- [ ] Create admin user in Supabase Auth
- [ ] Set up Cloudinary account and create unsigned upload preset
- [ ] Create `.env` with all required variables
- [ ] Build auth context and protected routes
- [ ] Create content hooks (usePageContent, useGallery, etc.)
- [ ] Build admin pages (login, content editor, gallery manager)
- [ ] Configure netlify.toml with CSP headers
- [ ] Add environment variables to Netlify
- [ ] Deploy and test

---

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Cloudinary Docs](https://cloudinary.com/documentation)
- [TipTap Docs](https://tiptap.dev/docs)
- [Netlify Docs](https://docs.netlify.com)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/en/main)
