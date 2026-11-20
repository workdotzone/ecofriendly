"use client";

import { useEffect, useState } from "react";
import { LogOut, LayoutDashboard, ShieldAlert, Trash2, CheckCircle, Clock, Link as LinkIcon, Plus, MapPin, MessageSquareQuote, FileText, Building2, Briefcase, HelpCircle, Pencil } from "lucide-react";

type AdminFaq = {
  _id: string;
  question: string;
  answer: string;
  locationSlug?: string | null;
  serviceSlug?: string | null;
  serviceOverview?: boolean;
};

const builtInFaqServices = [
  { slug: "bed-bugs-control", title: "Bed Bug Control" },
  { slug: "cockroach-control", title: "Cockroach Control" },
  { slug: "mosquito-control", title: "Mosquito Control" },
  { slug: "rodent-control", title: "Rodent Control" },
  { slug: "termite-control", title: "Termite Control" },
  { slug: "wood-borer-control", title: "Wood Borer Control" },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("leads"); // "leads", "menu", "locations", "testimonials", "blogs", "clients", "services", "faqs"
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  
  // Shared States
  const [uploading, setUploading] = useState(false); 
  const [clientUploading, setClientUploading] = useState(false); 
  const [serviceUploading, setServiceUploading] = useState(false); 
  
  // Data States
  const [leads, setLeads] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [clientLogos, setClientLogos] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]); 
  const [faqs, setFaqs] = useState<AdminFaq[]>([]);
  
  // Input states for Add Forms
  const [newMenu, setNewMenu] = useState({ name: "", slug: "", category: "Service" });
  
  // 🚀 UPDATED: Location input state for advanced SEO Schema
  const [newLocation, setNewLocation] = useState({ 
    name: "", slug: "", heading: "", shortDescription: "", detailedContent: "", metaTitle: "", metaDescription: "" 
  });
  
  const [newTestimonial, setNewTestimonial] = useState({ name: "", designation: "", service: "General Pest Control", text: "", rating: 5 });
  const [newBlog, setNewBlog] = useState({ title: "", slug: "", metaDescription: "", image: "/banner.png", content: "" });
  const [newClient, setNewClient] = useState({ name: "", image: "" });
  const emptyService = { title: "", slug: "", shortDescription: "", fullContent: "", image: "", imageAlt: "", metaTitle: "", metaDescription: "", h1: "", quickAnswer: "", keywords: "", order: 100, isActive: true, faqs: [] as { question: string; answer: string }[] };
  const [newService, setNewService] = useState(emptyService);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceSaving, setServiceSaving] = useState(false);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "", locationSlug: "", serviceSlug: "" });
  const [faqScope, setFaqScope] = useState<"home" | "location" | "service" | "services">("home");
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const faqServiceOptions = [
    ...builtInFaqServices,
    ...services.filter(service => !builtInFaqServices.some(builtInService => builtInService.slug === service.slug)),
  ];

  useEffect(() => {
    fetchLeads();
    fetchMenu();
    fetchLocations();
    fetchTestimonials();
    fetchBlogs();
    fetchClients();
    fetchServices();
    fetchFaqs(); 
  }, []);

  // ============================
  // FETCH FUNCTIONS
  // ============================
  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/admin/leads");
      const data = await res.json();
      if (data.success) setLeads(data.leads);
    } catch (error) { console.error("Error fetching leads", error); }
  };

  const fetchMenu = async () => {
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();
      if (data.success) setMenuItems(data.menuItems);
    } catch (error) { console.error("Error fetching menu", error); }
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch("/api/locations");
      const data = await res.json();
      if (data.success) setLocations(data.locations);
    } catch (error) { console.error("Error fetching locations", error); }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/testimonials");
      const data = await res.json();
      if (data.success) setTestimonials(data.testimonials);
    } catch (error) { console.error("Error fetching testimonials", error); }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blogs");
      const data = await res.json();
      if (data.success) setBlogs(data.blogs);
    } catch (error) { console.error("Error fetching blogs", error); }
  };

  const fetchClients = async () => {
    try {
      const res = await fetch("/api/clients");
      const data = await res.json();
      if (data.success) setClientLogos(data.clients);
    } catch (error) { console.error("Error fetching clients", error); }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setServices(data.services);
    } catch (error) { console.error("Error fetching services", error); }
  };

  const fetchFaqs = async () => {
    try {
      const res = await fetch("/api/admin/faqs");
      const data = await res.json();
      if (res.ok && data.success) setFaqs(data.faqs);
      else console.error("Error fetching FAQs:", data.message);
    } catch (error) { console.error("Error fetching faqs", error); }
  };

  // ============================
  // POST & DELETE HANDLERS
  // ============================
  
  // 1. Leads
  const updateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "New" ? "Contacted" : "New";
    await fetch("/api/admin/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: newStatus }) });
    fetchLeads();
  };
  const deleteLead = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this lead?")) {
      await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
      fetchLeads();
    }
  };

  // 2. Menu Settings
  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/admin/menu", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newMenu) });
      setNewMenu({ name: "", slug: "", category: "Service" });
      fetchMenu(); 
    } catch (error) { console.error("Error adding menu", error); }
  };
  const deleteMenu = async (id: string) => {
    if (confirm("Are you sure you want to delete this link from the website?")) {
      await fetch(`/api/admin/menu?id=${id}`, { method: "DELETE" });
      fetchMenu();
    }
  };

  // 3. Service Areas (Locations) - 🚀 UPDATED FOR SEO SCHEMA
  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocation.name.trim()) return;
    try {
      const res = await fetch("/api/admin/locations", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(newLocation) 
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Location added successfully!");
        setNewLocation({ name: "", slug: "", heading: "", shortDescription: "", detailedContent: "", metaTitle: "", metaDescription: "" });
        fetchLocations();
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (error) { console.error("Error adding location", error); }
  };
  const deleteLocation = async (id: string) => {
    if (confirm("Are you sure you want to remove this service area?")) {
      await fetch(`/api/admin/locations?id=${id}`, { method: "DELETE" });
      fetchLocations();
    }
  };

  // 4. Testimonials
  const handleAddTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTestimonial),
      });
      setNewTestimonial({ name: "", designation: "", service: "General Pest Control", text: "", rating: 5 });
      fetchTestimonials();
    } catch (error) { console.error("Error adding testimonial", error); }
  };
  const deleteTestimonial = async (id: string) => {
    if (confirm("Are you sure you want to delete this client review?")) {
      await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
      fetchTestimonials();
    }
  };

  // 5. Blogs Manager
  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBlog),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("✅ Blog Published successfully!");
        setNewBlog({ title: "", slug: "", metaDescription: "", image: "/banner.png", content: "" });
        fetchBlogs();
      } else {
        alert("❌ Error adding blog: " + data.message);
      }
    } catch (error) { console.error("Error adding blog", error); }
  };
  const deleteBlog = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this blog post?")) {
      await fetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
      fetchBlogs();
    }
  };

  // 6. Clients Manager
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newClient.image) return alert("Please upload or paste an image URL for the logo.");
    try {
      const res = await fetch("/api/admin/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Client Logo Added!");
        setNewClient({ name: "", image: "" });
        fetchClients();
      } else {
        alert("❌ Error adding client: " + data.message);
      }
    } catch (error) { console.error("Error adding client", error); }
  };
  const deleteClient = async (id: string) => {
    if (confirm("Are you sure you want to delete this Client Logo?")) {
      await fetch(`/api/admin/clients?id=${id}`, { method: "DELETE" });
      fetchClients();
    }
  };

  // 7. Services Manager (create / edit with SEO fields + FAQs)
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (serviceSaving) return;
    setServiceSaving(true);
    try {
      const payload = {
        ...newService,
        keywords: newService.keywords.split(",").map((k) => k.trim()).filter(Boolean),
        faqs: newService.faqs.filter((f) => f.question.trim() && f.answer.trim()),
      };
      const res = await fetch(editingServiceId ? `/api/admin/services?id=${editingServiceId}` : "/api/admin/services", {
        method: editingServiceId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(editingServiceId ? "✅ Service updated!" : "✅ Service added!");
        setNewService(emptyService);
        setEditingServiceId(null);
        fetchServices();
      } else {
        alert("❌ " + (data.message || "Could not save service."));
      }
    } catch (error) {
      console.error("Error saving service", error);
      alert("❌ Network error while saving the service.");
    } finally {
      setServiceSaving(false);
    }
  };
  const editService = (service: any) => {
    setEditingServiceId(service._id);
    setNewService({
      title: service.title || "", slug: service.slug || "", shortDescription: service.shortDescription || "",
      fullContent: service.fullContent || "", image: service.image || "", imageAlt: service.imageAlt || "",
      metaTitle: service.metaTitle || "", metaDescription: service.metaDescription || "", h1: service.h1 || "",
      quickAnswer: service.quickAnswer || "", keywords: (service.keywords || []).join(", "),
      order: typeof service.order === "number" ? service.order : 100, isActive: service.isActive !== false,
      faqs: Array.isArray(service.faqs) ? service.faqs.map((f: any) => ({ question: f.question || "", answer: f.answer || "" })) : [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const cancelServiceEdit = () => { setEditingServiceId(null); setNewService(emptyService); };
  const importDefaultServices = async () => {
    if (!confirm("Import the 6 core services with full SEO content and 12 FAQs each? Existing services are kept; only their EMPTY SEO fields are filled.")) return;
    try {
      const res = await fetch("/api/admin/services?action=import-defaults", { method: "POST" });
      const data = await res.json();
      alert(data.success ? `✅ ${data.message}` : `❌ ${data.message || "Import failed"}`);
      fetchServices();
    } catch (error) { console.error("Import error", error); alert("❌ Import failed"); }
  };
  const updateServiceFaq = (index: number, key: "question" | "answer", value: string) => {
    setNewService((prev) => ({ ...prev, faqs: prev.faqs.map((f, i) => (i === index ? { ...f, [key]: value } : f)) }));
  };
  const deleteService = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this service?")) {
      await fetch(`/api/admin/services?id=${id}`, { method: "DELETE" });
      fetchServices();
    }
  };

  // 8. FAQ Manager
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(
        editingFaqId ? `/api/admin/faqs?id=${encodeURIComponent(editingFaqId)}` : "/api/admin/faqs",
        {
          method: editingFaqId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...newFaq,
            locationSlug: faqScope === "location" ? newFaq.locationSlug : "",
            serviceSlug: faqScope === "service" ? newFaq.serviceSlug : "",
            serviceOverview: faqScope === "services",
          }),
        },
      );
      const data = await res.json();
      if (res.ok && data.success) {
        alert(editingFaqId ? "✅ FAQ updated successfully!" : "✅ FAQ added successfully!");
        setNewFaq({ question: "", answer: "", locationSlug: "", serviceSlug: "" });
        setFaqScope("home");
        setEditingFaqId(null);
        fetchFaqs();
      } else {
        alert("❌ Error saving FAQ: " + data.message);
      }
    } catch (error) { console.error("Error saving FAQ", error); }
  };
  const editFaq = (faq: AdminFaq) => {
    setEditingFaqId(faq._id);
    setFaqScope(faq.serviceOverview ? "services" : faq.serviceSlug ? "service" : faq.locationSlug ? "location" : "home");
    setNewFaq({
      question: faq.question,
      answer: faq.answer,
      locationSlug: faq.locationSlug || "",
      serviceSlug: faq.serviceSlug || "",
    });
  };
  const cancelFaqEdit = () => {
    setEditingFaqId(null);
    setFaqScope("home");
    setNewFaq({ question: "", answer: "", locationSlug: "", serviceSlug: "" });
  };
  const changeFaqScope = (scope: "home" | "location" | "service" | "services") => {
    setFaqScope(scope);
    setNewFaq({ ...newFaq, locationSlug: "", serviceSlug: "" });
  };
  const deleteFaq = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this FAQ?")) {
      try {
        const res = await fetch(`/api/admin/faqs?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        const data = await res.json();
        if (res.ok && data.success) {
          if (editingFaqId === id) cancelFaqEdit();
          fetchFaqs();
        } else {
          alert("❌ Error deleting FAQ: " + data.message);
        }
      } catch (error) { console.error("Error deleting FAQ", error); }
    }
  };

  // ============================
  // UPLOAD HANDLERS
  // ============================
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) { setNewBlog({ ...newBlog, image: data.url }); alert("✅ Image Uploaded Successfully!"); } 
      else { alert("❌ Image upload failed"); }
    } catch (error) { console.error("Upload error", error); alert("❌ Something went wrong while uploading"); } 
    finally { setUploading(false); }
  };

  const handleClientImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setClientUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) { setNewClient({ ...newClient, image: data.url }); alert("✅ Logo Uploaded Successfully!"); } 
      else { alert("❌ Logo upload failed"); }
    } catch (error) { console.error("Upload error", error); alert("❌ Something went wrong while uploading"); } 
    finally { setClientUploading(false); }
  };

  const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setServiceUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) { setNewService({ ...newService, image: data.url }); alert("✅ Service Image Uploaded Successfully!"); } 
      else { alert("❌ Image upload failed"); }
    } catch (error) { console.error("Upload error", error); alert("❌ Something went wrong while uploading"); } 
    finally { setServiceUploading(false); }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    setLogoutError("");
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
        signal: controller.signal,
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          typeof data?.message === "string" ? data.message : "Unable to sign out. Please try again.",
        );
      }

      window.location.replace("/admin/login?loggedOut=1");
    } catch (error) {
      setLogoutError(
        error instanceof DOMException && error.name === "AbortError"
          ? "Sign-out request timed out. Check your connection and try again."
          : error instanceof Error
            ? error.message
            : "Unable to sign out. Please try again.",
      );
      setLogoutLoading(false);
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const newLeadsCount = leads.filter((l) => l.status === "New").length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* =======================
          SIDEBAR 
          ======================= */}
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col fixed h-full z-10 shadow-xl overflow-y-auto">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-green-500">Eco Admin</h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <button onClick={() => setActiveTab("leads")} className={`flex items-center justify-between px-4 py-3 rounded-xl w-full text-left transition-all ${activeTab === "leads" ? "bg-green-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
            <span className="flex items-center gap-3"><LayoutDashboard size={20} /> Leads</span>
            {newLeadsCount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">{newLeadsCount}</span>}
          </button>
          
          <button onClick={() => setActiveTab("menu")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all ${activeTab === "menu" ? "bg-green-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
            <LinkIcon size={20} /> Menu Settings
          </button>

          <button onClick={() => setActiveTab("locations")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all ${activeTab === "locations" ? "bg-green-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
            <MapPin size={20} /> Service Areas
          </button>

          <button onClick={() => setActiveTab("testimonials")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all ${activeTab === "testimonials" ? "bg-green-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
            <MessageSquareQuote size={20} /> Client Reviews
          </button>

          <button onClick={() => setActiveTab("blogs")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all ${activeTab === "blogs" ? "bg-green-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
            <FileText size={20} /> Blog Manager
          </button>

          <button onClick={() => setActiveTab("clients")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all ${activeTab === "clients" ? "bg-green-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
            <Building2 size={20} /> Client Logos
          </button>

          <button onClick={() => setActiveTab("services")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all ${activeTab === "services" ? "bg-green-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
            <Briefcase size={20} /> Services Manager
          </button>
          
          <button onClick={() => setActiveTab("faqs")} className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all ${activeTab === "faqs" ? "bg-green-600 text-white shadow-md" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
            <HelpCircle size={20} /> FAQ Manager
          </button>
        </nav>
        
      </aside>

      {/* =======================
          MAIN CONTENT AREA
          ======================= */}
      <main className="flex-1 p-8 md:ml-64">
        <div className="sticky top-0 z-20 -mx-8 -mt-8 mb-6 flex flex-wrap items-center justify-end gap-3 border-b border-gray-200 bg-gray-50/95 px-8 py-3 backdrop-blur">
          {logoutError && <p className="w-full text-right text-sm text-red-600" role="alert">{logoutError}</p>}
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={18} /> {logoutLoading ? "Signing out…" : "Secure Logout"}
          </button>
        </div>
        
        {/* === TAB 1: LEADS === */}
        {activeTab === "leads" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-8">
              <ShieldAlert className="text-green-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-red-500 flex items-center justify-between">
                <div>
                  <h3 className="text-gray-500 font-medium mb-1 flex items-center gap-2"><Clock size={16}/> Pending Callbacks</h3>
                  <p className="text-3xl font-bold text-gray-900">{newLeadsCount}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-green-500 flex items-center justify-between">
                <div>
                  <h3 className="text-gray-500 font-medium mb-1 flex items-center gap-2"><CheckCircle size={16}/> Total Received</h3>
                  <p className="text-3xl font-bold text-gray-900">{leads.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-900 text-white text-sm">
                    <tr><th className="p-4 font-semibold">Date</th><th className="p-4 font-semibold">Customer Info</th><th className="p-4 font-semibold">Service</th><th className="p-4 font-semibold">Status</th><th className="p-4 font-semibold text-right">Action</th></tr>
                  </thead>
                  <tbody>
                    {leads.length === 0 ? (
                      <tr><td colSpan={5} className="p-8 text-center text-gray-500">No leads found yet.</td></tr>
                    ) : (
                      leads.map((lead) => (
                        <tr key={lead._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="p-4 text-sm text-gray-500">{new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                          <td className="p-4"><p className="font-bold text-gray-900 text-base">{lead.name}</p><p className="text-sm text-green-700 font-semibold">{lead.phone}</p><p className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={lead.address}>{lead.address}</p></td>
                          <td className="p-4"><span className="inline-block bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-1 rounded border border-gray-200">{lead.service}</span><p className="text-xs text-gray-400 mt-1">Via: {lead.source}</p></td>
                          <td className="p-4"><button onClick={() => updateStatus(lead._id, lead.status)} className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${lead.status === "New" ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>{lead.status === "New" ? "Mark Contacted" : "Contacted ✓"}</button></td>
                          <td className="p-4 text-right"><button onClick={() => deleteLead(lead._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors" title="Delete"><Trash2 size={18}/></button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* === TAB 2: MENU SETTINGS === */}
        {activeTab === "menu" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-8">
              <LinkIcon className="text-green-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">Navbar Menu Manager</h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Add New Website Link</h3>
              <p className="text-sm text-gray-500 mb-6">Create a new service or page link to instantly update the public navbar.</p>
              
              <form onSubmit={handleAddMenu} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Link Name</label>
                  <input type="text" required placeholder="e.g. Cockroach Control" value={newMenu.name} onChange={e => setNewMenu({...newMenu, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">URL Path</label>
                  <input type="text" required placeholder="e.g. /services/cockroach" value={newMenu.slug} onChange={e => setNewMenu({...newMenu, slug: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                </div>
                <div className="flex-1 md:max-w-[250px]">
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Placement</label>
                  <select value={newMenu.category} onChange={e => setNewMenu({...newMenu, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 cursor-pointer transition-all">
                    <option value="Service">Inside Services Dropdown</option><option value="Page">Main Navbar (Direct Link)</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full md:w-auto bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md flex items-center justify-center gap-2"><Plus size={20} /> Publish Link</button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-900 text-white text-sm">
                    <tr><th className="p-4 font-semibold">Link Name</th><th className="p-4 font-semibold">URL Slug</th><th className="p-4 font-semibold">Category Location</th><th className="p-4 font-semibold text-right">Delete</th></tr>
                  </thead>
                  <tbody>
                    {menuItems.length === 0 ? (
                      <tr><td colSpan={4} className="p-8 text-center text-gray-500">No links added yet.</td></tr>
                    ) : (
                      menuItems.map((item) => (
                        <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-bold text-gray-900 text-base">{item.name}</td><td className="p-4 text-sm text-gray-500 font-mono">{item.slug}</td>
                          <td className="p-4"><span className={`text-xs px-2.5 py-1 rounded-md font-bold border ${item.category === "Service" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200"}`}>{item.category === "Service" ? "Service Dropdown" : "Main Navbar"}</span></td>
                          <td className="p-4 text-right"><button onClick={() => deleteMenu(item._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100" title="Delete Link"><Trash2 size={18}/></button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* === TAB 3: LOCATIONS SETTINGS (🚀 ADVANCED SEO UPDATED) === */}
        {activeTab === "locations" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-8">
              <MapPin className="text-green-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">Service Areas (SEO)</h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Add New SEO Location Page</h3>
              <p className="text-sm text-gray-500 mb-6">These areas will automatically generate dedicated SEO pages and update the About/Footer links.</p>
              
              <form onSubmit={handleAddLocation} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">City or Area Name</label>
                    <input 
                      type="text" required placeholder="e.g. Andheri East" 
                      value={newLocation.name} 
                      onChange={e => setNewLocation({
                        ...newLocation, 
                        name: e.target.value, 
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') // Auto slug logic
                      })} 
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">URL Slug (Auto Generated)</label>
                    <input type="text" required placeholder="e.g. andheri-east" value={newLocation.slug} onChange={e => setNewLocation({...newLocation, slug: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Page Heading (H1)</label>
                    <input type="text" placeholder="e.g. Best Pest Control in Andheri East" value={newLocation.heading} onChange={e => setNewLocation({...newLocation, heading: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">SEO Meta Title (For Google)</label>
                    <input type="text" placeholder="e.g. Pest Control in Andheri East | Eco-Friendly Pests" value={newLocation.metaTitle} onChange={e => setNewLocation({...newLocation, metaTitle: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Short Description (Subtitle)</label>
                    <input type="text" placeholder="e.g. Get 100% safe and odorless treatments..." value={newLocation.shortDescription} onChange={e => setNewLocation({...newLocation, shortDescription: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">SEO Meta Description</label>
                    <input type="text" placeholder="Write a 150-160 character description for search results..." value={newLocation.metaDescription} onChange={e => setNewLocation({...newLocation, metaDescription: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Detailed SEO Content (HTML allowed)</label>
                  <textarea placeholder="Write long-form content about why your service is best in this specific area..." value={newLocation.detailedContent} onChange={e => setNewLocation({...newLocation, detailedContent: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 min-h-[120px] transition-all resize-y"></textarea>
                </div>

                <div className="flex justify-end mt-4">
                  <button type="submit" className="w-full md:w-auto bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md flex items-center justify-center gap-2"><Plus size={20} /> Publish Location Page</button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Active Service Areas</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {locations.length === 0 ? <p className="text-gray-500 text-sm col-span-full">No locations added yet.</p> : null}
                {locations.map((loc) => (
                  <div key={loc._id} className="flex flex-col bg-gray-50 border border-gray-200 p-3 rounded-xl group hover:border-gray-300 transition-colors relative">
                    <span className="font-bold text-gray-900 text-sm truncate pr-8" title={loc.name}>{loc.name}</span>
                    <span className="text-xs text-gray-500 truncate" title={loc.slug}>/{loc.slug}</span>
                    <button onClick={() => deleteLocation(loc._id)} className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Remove Area"><Trash2 size={16}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* === TAB 4: TESTIMONIALS === */}
        {activeTab === "testimonials" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-8">
              <MessageSquareQuote className="text-green-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">Manage Client Reviews</h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Add New Testimonial</h3>
              <p className="text-sm text-gray-500 mb-6">Added reviews will display at the top of the Testimonials page.</p>
              
              <form onSubmit={handleAddTestimonial} className="flex flex-col gap-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Client Name</label>
                    <input type="text" required placeholder="e.g. Ramesh Sharma" value={newTestimonial.name} onChange={e => setNewTestimonial({...newTestimonial, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Location / Designation</label>
                    <input type="text" required placeholder="e.g. Resident, Thane" value={newTestimonial.designation} onChange={e => setNewTestimonial({...newTestimonial, designation: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Service Taken</label>
                    <input type="text" required placeholder="e.g. Bed Bugs Control" value={newTestimonial.service} onChange={e => setNewTestimonial({...newTestimonial, service: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Review Text</label>
                  <textarea required placeholder="Write what the client said about your service..." value={newTestimonial.text} onChange={e => setNewTestimonial({...newTestimonial, text: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all resize-none" rows={3}></textarea>
                </div>
                
                <div className="flex justify-end mt-2">
                  <button type="submit" className="bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md flex items-center justify-center gap-2">
                    <Plus size={20} /> Publish Review
                  </button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.length === 0 ? (
                <div className="col-span-1 md:col-span-2 text-center text-gray-500 p-8 bg-white rounded-2xl border border-gray-100">No new reviews added via admin panel. Public page will still show default hardcoded reviews.</div>
              ) : (
                testimonials.map((review) => (
                  <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group">
                    <button onClick={() => deleteTestimonial(review._id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors p-2 bg-gray-50 rounded-lg hover:bg-red-50" title="Delete Review">
                      <Trash2 size={18}/>
                    </button>
                    <div className="font-bold text-gray-900 text-lg mb-1">{review.name}</div>
                    <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-3">{review.designation} {review.service}</div>
                    <p className="text-sm text-gray-600 italic leading-relaxed">"{review.text}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* === TAB 5: BLOG MANAGER === */}
        {activeTab === "blogs" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-8">
              <FileText className="text-green-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">Blog & SEO Manager</h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Write a New Blog Post</h3>
              
              <form onSubmit={handleAddBlog} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Blog Title</label>
                    <input type="text" required placeholder="e.g. 5 Tips to get rid of Ants" value={newBlog.title} onChange={e => setNewBlog({...newBlog, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">URL Slug (No Spaces)</label>
                    <input type="text" required placeholder="e.g. tips-to-get-rid-of-ants" value={newBlog.slug} onChange={e => setNewBlog({...newBlog, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">SEO Meta Description (For Google Search)</label>
                  <input type="text" required placeholder="Write a catchy 1-line summary for Google search results..." value={newBlog.metaDescription} onChange={e => setNewBlog({...newBlog, metaDescription: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Blog Image (Upload from PC or Paste URL)
                  </label>
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <input 
                      type="text" 
                      placeholder="https://ik.imagekit.io/..." 
                      value={newBlog.image} 
                      onChange={e => setNewBlog({...newBlog, image: e.target.value})} 
                      className="flex-1 w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" 
                    />
                    <span className="text-gray-400 font-bold hidden md:block">OR</span>
                    <label className={`cursor-pointer px-6 py-3.5 rounded-xl font-bold transition-all shadow-md text-center w-full md:w-auto ${uploading ? "bg-gray-400 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
                      {uploading ? "Uploading..." : "Upload from PC"}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        disabled={uploading}
                        className="hidden" 
                      />
                    </label>
                  </div>
                  {newBlog.image && newBlog.image !== "/banner.png" && (
                    <div className="mt-4">
                      <img src={newBlog.image} alt="Preview" className="h-32 w-auto object-cover rounded-lg border border-gray-200 shadow-sm" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Full Article Content</label>
                  <textarea required placeholder="Write your full blog post here... You can use paragraph breaks by pressing Enter." value={newBlog.content} onChange={e => setNewBlog({...newBlog, content: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all whitespace-pre-wrap resize-y" rows={8}></textarea>
                </div>

                <div className="flex justify-end mt-4">
                  <button type="submit" className="bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md flex items-center justify-center gap-2">
                    <Plus size={20} /> Publish SEO Blog
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-900 text-white text-sm">
                  <tr><th className="p-4 font-semibold">Title</th><th className="p-4 font-semibold">SEO Slug</th><th className="p-4 font-semibold text-right">Delete</th></tr>
                </thead>
                <tbody>
                  {blogs.length === 0 ? (
                    <tr><td colSpan={3} className="p-8 text-center text-gray-500">No blogs published yet.</td></tr>
                  ) : (
                    blogs.map(blog => (
                      <tr key={blog._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-bold text-gray-900">{blog.title}</td>
                        <td className="p-4 text-sm text-gray-500 font-mono">/blog/{blog.slug}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => deleteBlog(blog._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100" title="Delete Blog">
                            <Trash2 size={18}/>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === TAB 6: CLIENT LOGOS === */}
        {activeTab === "clients" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-8">
              <Building2 className="text-green-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">Trusted Clients Manager</h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">Add New Client Logo</h3>
              
              <form onSubmit={handleAddClient} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Client/Company Name (For SEO)</label>
                  <input type="text" required placeholder="e.g. Taj Hotel, L&T..." value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Logo Image (Upload or Paste URL)</label>
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <input type="text" placeholder="https://ik.imagekit.io/..." value={newClient.image} onChange={e => setNewClient({...newClient, image: e.target.value})} className="flex-1 w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500" />
                    <span className="text-gray-400 font-bold hidden md:block mt-3">OR</span>
                    <label className={`cursor-pointer px-6 py-3.5 rounded-xl font-bold transition-all shadow-md text-center w-full md:w-auto ${clientUploading ? "bg-gray-400 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
                      {clientUploading ? "Uploading..." : "Upload Logo"}
                      <input type="file" accept="image/*" onChange={handleClientImageUpload} disabled={clientUploading} className="hidden" />
                    </label>
                  </div>
                  {newClient.image && (
                    <div className="mt-4 p-4 border border-gray-100 rounded-lg inline-block bg-white shadow-sm">
                      <img src={newClient.image} alt="Preview" className="h-16 w-auto object-contain" />
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-4">
                  <button type="submit" className="bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-700 shadow-md flex items-center gap-2"><Plus size={20} /> Add Client</button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {clientLogos.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 p-8 bg-white rounded-2xl border border-gray-100">No client logos added via Admin Panel. Default hardcoded logos will be shown on website.</div>
              ) : (
                clientLogos.map(client => (
                  <div key={client._id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 relative group flex flex-col items-center justify-center">
                    <button onClick={() => deleteClient(client._id)} className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-1 bg-gray-50 rounded-lg hover:bg-red-50" title="Delete Logo"><Trash2 size={16}/></button>
                    <img src={client.image} alt={client.name} className="h-16 w-auto object-contain my-4" />
                    <span className="text-xs font-bold text-gray-600 uppercase text-center">{client.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* === TAB 7: SERVICES MANAGER === */}
        {activeTab === "services" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-8">
              <Briefcase className="text-green-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">Dynamic Services Manager</h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h3 className="text-lg font-bold text-gray-900">{editingServiceId ? `Editing: ${newService.title || "service"}` : "Add New Service"}</h3>
                <button type="button" onClick={importDefaultServices} className="text-sm font-semibold px-4 py-2 rounded-lg border border-green-200 text-green-700 bg-green-50 hover:bg-green-100">
                  Import default content (6 services + 12 FAQs each)
                </button>
              </div>
              
              <form onSubmit={handleAddService} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Service Title</label>
                    <input type="text" required placeholder="e.g. Cockroach Pest Control" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">URL Slug (No Spaces)</label>
                    <input type="text" required placeholder="e.g. cockroach-control" value={newService.slug} onChange={e => setNewService({...newService, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Short Description (For Cards & SEO)</label>
                  <input type="text" required placeholder="Write a 1-2 line description..." value={newService.shortDescription} onChange={e => setNewService({...newService, shortDescription: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                    Service Icon/Image (Upload from PC or Paste URL)
                  </label>
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <input 
                      type="text" 
                      placeholder="https://ik.imagekit.io/..." 
                      value={newService.image} 
                      onChange={e => setNewService({...newService, image: e.target.value})} 
                      className="flex-1 w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" 
                    />
                    <span className="text-gray-400 font-bold hidden md:block">OR</span>
                    <label className={`cursor-pointer px-6 py-3.5 rounded-xl font-bold transition-all shadow-md text-center w-full md:w-auto ${serviceUploading ? "bg-gray-400 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
                      {serviceUploading ? "Uploading..." : "Upload Image"}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleServiceImageUpload} 
                        disabled={serviceUploading}
                        className="hidden" 
                      />
                    </label>
                  </div>
                  {newService.image && (
                    <div className="mt-4">
                      <img src={newService.image} alt="Preview" className="h-32 w-auto object-cover rounded-lg border border-gray-200 shadow-sm" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Full Details (Read More Content)</label>
                  <p className="text-xs text-gray-500 mb-2">Formatting: blank line = new paragraph, <code>## Heading</code>, <code>### Sub-heading</code>, <code>- bullet</code>, <code>1. step</code>, <code>**bold**</code>, <code>[link](/services/termite-control)</code>. Leave short for core services — curated content is shown automatically.</p>
                  <textarea placeholder="Write full details about the service here..." value={newService.fullContent} onChange={e => setNewService({...newService, fullContent: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all whitespace-pre-wrap resize-y" rows={6}></textarea>
                </div>


                <div className="rounded-xl border border-gray-200 p-4 space-y-4 bg-gray-50/50">
                  <p className="text-sm font-bold text-gray-800">SEO, AEO &amp; voice search (optional — empty fields use the built-in defaults)</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Meta title ({newService.metaTitle.length}/60)</label>
                      <input type="text" maxLength={120} placeholder="e.g. Cockroach Pest Control in Mumbai | Odourless Gel" value={newService.metaTitle} onChange={e => setNewService({...newService, metaTitle: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Page H1</label>
                      <input type="text" maxLength={200} placeholder="e.g. Cockroach Pest Control in Mumbai" value={newService.h1} onChange={e => setNewService({...newService, h1: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Meta description ({newService.metaDescription.length}/155)</label>
                    <textarea rows={2} maxLength={320} value={newService.metaDescription} onChange={e => setNewService({...newService, metaDescription: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500 resize-y" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Quick answer — 40–60 words shown under the H1 (featured snippets, AI answers, voice)</label>
                    <textarea rows={3} maxLength={700} value={newService.quickAnswer} onChange={e => setNewService({...newService, quickAnswer: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500 resize-y" />
                    <p className="text-xs text-gray-500 mt-1">{newService.quickAnswer.trim() ? newService.quickAnswer.trim().split(/\s+/).length : 0} words</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Image alt text (describe the image)</label>
                      <input type="text" maxLength={200} value={newService.imageAlt} onChange={e => setNewService({...newService, imageAlt: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Order</label>
                        <input type="number" min={0} max={9999} value={newService.order} onChange={e => setNewService({...newService, order: Number(e.target.value)})} className="w-full bg-white border border-gray-200 text-gray-900 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
                      </div>
                      <label className="flex items-center gap-2 mt-6 text-sm font-semibold text-gray-700">
                        <input type="checkbox" checked={newService.isActive} onChange={e => setNewService({...newService, isActive: e.target.checked})} className="h-4 w-4 accent-green-600" /> Live
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Keywords (comma separated)</label>
                    <input type="text" value={newService.keywords} onChange={e => setNewService({...newService, keywords: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 p-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Service FAQs ({newService.faqs.length}) — page always shows 12; yours come first</p>
                      <button type="button" onClick={() => setNewService({...newService, faqs: [...newService.faqs, { question: "", answer: "" }]})} className="text-sm font-semibold text-green-700 hover:underline">+ Add FAQ</button>
                    </div>
                    <div className="space-y-3">
                      {newService.faqs.map((faq, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-xl p-3 space-y-2">
                          <div className="flex gap-2">
                            <input type="text" placeholder={`Question ${index + 1}`} value={faq.question} onChange={e => updateServiceFaq(index, "question", e.target.value)} className="flex-1 border border-gray-200 text-gray-900 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-green-500" />
                            <button type="button" onClick={() => setNewService({...newService, faqs: newService.faqs.filter((_, i) => i !== index)})} className="px-3 text-gray-400 hover:text-red-600" aria-label="Remove FAQ"><Trash2 size={16} /></button>
                          </div>
                          <textarea rows={2} placeholder="Answer — first sentence should answer the question directly." value={faq.answer} onChange={e => updateServiceFaq(index, "answer", e.target.value)} className="w-full border border-gray-200 text-gray-900 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-green-500 resize-y" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  {editingServiceId && (
                    <button type="button" onClick={cancelServiceEdit} className="px-6 py-3.5 rounded-xl font-bold border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
                  )}
                  <button type="submit" disabled={serviceSaving} className="bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70">
                    <Plus size={20} /> {serviceSaving ? "Saving…" : editingServiceId ? "Update Service" : "Publish Service"}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-900 text-white text-sm">
                  <tr><th className="p-4 font-semibold">Service Title</th><th className="p-4 font-semibold">URL Slug</th><th className="p-4 font-semibold">SEO</th><th className="p-4 font-semibold text-right">Actions</th></tr>
                </thead>
                <tbody>
                  {services.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-gray-500">No services in the database yet — the website is showing the 6 default services. Click “Import default content” to manage them here.</td></tr>
                  ) : (
                    services.map(service => (
                      <tr key={service._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-bold text-gray-900">{service.title}</td>
                        <td className="p-4 text-sm text-gray-500 font-mono"><a href={`/services/${service.slug}`} target="_blank" rel="noreferrer" className="hover:text-green-700 hover:underline">/services/{service.slug}</a>{service.isActive === false && <span className="ml-2 text-xs font-sans font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Hidden</span>}</td>
                        <td className="p-4 text-xs text-gray-500">{service.metaTitle ? "✅ Meta" : "— Meta"} · {(service.faqs?.length || 0)} FAQs</td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button onClick={() => editService(service)} className="p-2 text-gray-400 hover:text-green-700 transition-colors bg-white rounded-lg hover:bg-green-50 border border-transparent hover:border-green-100 mr-1" title="Edit Service">
                            <Pencil size={18}/>
                          </button>
                          <button onClick={() => deleteService(service._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100" title="Delete Service">
                            <Trash2 size={18}/>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === TAB 8: FAQ MANAGER === */}
        {activeTab === "faqs" && (
          <div className="animate-in fade-in duration-300">
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="text-green-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-900">FAQ Manager</h1>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
              <h3 className="text-lg font-bold text-gray-900 mb-6">{editingFaqId ? "Edit Question" : "Add New Question"}</h3>
              
              <form onSubmit={handleSaveFaq} className="space-y-4">
                <div>
                  <label htmlFor="faq-scope" className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">FAQ section</label>
                  <select
                    id="faq-scope"
                    value={faqScope}
                    onChange={e => {
                      const scope = e.target.value;
                      if (scope === "home" || scope === "location" || scope === "service" || scope === "services") changeFaqScope(scope);
                    }}
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all"
                  >
                    <option value="home">Home / site-wide</option>
                    <option value="location">Location page</option>
                    <option value="service">Service page</option>
                    <option value="services">Services landing page</option>
                  </select>
                  <p className="mt-2 text-sm text-gray-500">Home FAQs appear on the homepage and are the fallback when a location, service, or services landing page has no custom FAQs.</p>
                </div>
                {faqScope === "location" && (
                  <div>
                    <label htmlFor="faq-location" className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Location slug</label>
                    <input
                      id="faq-location"
                      list="faq-location-options"
                      required
                      placeholder="e.g. airoli"
                      value={newFaq.locationSlug}
                      onChange={e => setNewFaq({ ...newFaq, locationSlug: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all"
                    />
                    <datalist id="faq-location-options">
                      {locations.map(location => (
                        <option key={location._id} value={location.slug} label={`${location.name} — /service-locations/${location.slug}`} />
                      ))}
                    </datalist>
                    <p className="mt-2 text-sm text-gray-500">Use the area slug, not the full URL. This FAQ also appears on generated service pages ending in the same slug.</p>
                  </div>
                )}
                {faqScope === "service" && (
                  <div>
                    <label htmlFor="faq-service" className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Service</label>
                    <select
                      id="faq-service"
                      required
                      value={newFaq.serviceSlug}
                      onChange={e => setNewFaq({ ...newFaq, serviceSlug: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all"
                    >
                      <option value="">Select a service</option>
                      {faqServiceOptions.map(service => (
                        <option key={service.slug} value={service.slug}>{service.title} — /services/{service.slug}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Question</label>
                  <input type="text" required placeholder="e.g. Do I need to leave my house?" value={newFaq.question} onChange={e => setNewFaq({...newFaq, question: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Detailed Answer</label>
                  <textarea required placeholder="Write the complete answer here..." value={newFaq.answer} onChange={e => setNewFaq({...newFaq, answer: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 p-3.5 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-green-500 transition-all resize-y" rows={4}></textarea>
                </div>

                <div className="flex justify-end mt-4">
                  {editingFaqId && (
                    <button type="button" onClick={cancelFaqEdit} className="mr-3 rounded-xl px-5 py-3.5 font-semibold text-gray-600 hover:bg-gray-100">
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md flex items-center justify-center gap-2">
                    {editingFaqId ? <Pencil size={18} /> : <Plus size={20} />}
                    {editingFaqId ? "Update FAQ" : "Publish FAQ"}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-900 text-white text-sm">
                  <tr><th className="p-4 font-semibold">Question</th><th className="p-4 font-semibold">Answer Snippet</th><th className="p-4 font-semibold">FAQ scope</th><th className="p-4 font-semibold text-right">Actions</th></tr>
                </thead>
                <tbody>
                  {faqs.length === 0 ? (
                    <tr><td colSpan={4} className="p-8 text-center text-gray-500">No FAQs added yet.</td></tr>
                  ) : (
                    faqs.map(faq => (
                      <tr key={faq._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-bold text-gray-900 w-1/3">{faq.question}</td>
                        <td className="p-4 text-sm text-gray-500 max-w-xs truncate" title={faq.answer}>{faq.answer}</td>
                        <td className="p-4 text-sm text-gray-600">
                          {faq.serviceOverview
                            ? "Services landing page"
                            : faq.serviceSlug
                            ? `Service: ${services.find(service => service.slug === faq.serviceSlug)?.title || faq.serviceSlug}`
                            : faq.locationSlug
                              ? `Location: ${locations.find(location => location.slug === faq.locationSlug)?.name || faq.locationSlug}`
                              : "Home / site-wide"}
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button onClick={() => editFaq(faq)} className="mr-2 rounded-lg border border-transparent bg-white p-2 text-gray-400 transition-colors hover:border-green-100 hover:bg-green-50 hover:text-green-700" title="Edit FAQ">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => deleteFaq(faq._id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-white rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100" title="Delete FAQ">
                            <Trash2 size={18}/>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}