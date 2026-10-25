import React, { useState, useEffect } from 'react';
import {
  loadCMSData,
  saveCMSData,
  resetCMSData,
  exportCMSData,
  importCMSData,
  type CMSData,
} from '@/lib/api';
import {
  LayoutDashboard,
  Feather,
  Image as ImageIcon,
  Boxes,
  Search,
  Settings,
  Mail,
  ChevronDown,
  ChevronUp,
  Trash2,
  GripVertical,
  Plus,
  Link as LinkIcon,
  ExternalLink,
  Save,
  CheckCircle,
  RotateCcw,
  Download,
  Upload,
  ArrowLeft,
  MoreHorizontal,
  X,
  FileText,
  Bot,
  Sparkles,
} from 'lucide-react';
import {
  fetchAdminMessages,
  updateAdminMessageStatus,
  deleteAdminMessage,
  seedTestInquiry,
  fetchAdminCMS,
  saveAdminCMS,
  resetAdminCMS,
  type ContactMessageRecord,
} from '@/lib/api';

interface StrapiAdminDashboardProps {
  token: string;
  user: { username: string; role: string };
  onLogout: () => void;
}

type ActiveView =
  | 'HomePage'
  | 'AboutUsPage'
  | 'blogPage'
  | 'CareerPage'
  | 'caseStudyPage'
  | 'ContactPage'
  | 'footer'
  | 'IndustryPage'
  | 'llm'
  | 'Navbar'
  | 'OurApproachPage'
  | 'PrivacyPolicyPage'
  | 'ProductPage'
  | 'robot'
  | 'service'
  | 'ServicePage'
  | 'TermsAndConditionPage'
  | 'redirect'
  | 'sitemap'
  | 'User'
  | 'inbox';

export default function StrapiAdminDashboard({ token, user, onLogout }: StrapiAdminDashboardProps) {
  const [cmsData, setCmsData] = useState<CMSData>(loadCMSData);
  const [activeView, setActiveView] = useState<ActiveView>('HomePage');
  const [activeTab, setActiveTab] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [heroExpanded, setHeroExpanded] = useState(true);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [sidebarFilter, setSidebarFilter] = useState('');
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [jsonMode, setJsonMode] = useState(false);

  // Inquiries state (preserved from previous dashboard)
  const [messages, setMessages] = useState<ContactMessageRecord[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  useEffect(() => {
    // 1. Load local cache first
    setCmsData(loadCMSData());

    // 2. Fetch fresh published content from backend database
    if (token) {
      fetchAdminCMS(token).then((remote) => {
        if (remote && remote.homePage) {
          saveCMSData(remote);
          setCmsData(remote);
        }
      });
    }
  }, [token]);

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3500);
  };

  const handleSaveDraft = async () => {
    saveCMSData(cmsData);
    if (token) {
      await saveAdminCMS(token, cmsData);
    }
    triggerToast('Draft saved & persisted to database!');
  };

  const handlePublish = async () => {
    const published = {
      ...cmsData,
      status: 'published' as const,
      lastPublished: new Date().toISOString(),
    };
    saveCMSData(published);
    setCmsData(published);
    if (token) {
      await saveAdminCMS(token, published);
    }
    triggerToast('Published successfully! Live site and AI chatbot updated.');
  };

  const handleResetDefaults = async () => {
    if (window.confirm('Reset all website data to default settings? This will clear custom edits.')) {
      const def = resetCMSData();
      setCmsData(def);
      if (token) {
        await resetAdminCMS(token);
      }
      triggerToast('All content reset to factory defaults.');
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importCMSData(content)) {
        setCmsData(loadCMSData());
        triggerToast('CMS data imported and published successfully!');
      } else {
        alert('Invalid CMS backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Load messages when inbox is active
  useEffect(() => {
    if (activeView === 'inbox') {
      setMessagesLoading(true);
      fetchAdminMessages(token)
        .then((res) => {
          if (res?.messages) setMessages(res.messages);
        })
        .finally(() => setMessagesLoading(false));
    }
  }, [activeView, token]);

  const singleTypesList: Array<{ id: ActiveView; label: string }> = [
    { id: 'AboutUsPage', label: 'AboutUsPage' },
    { id: 'blogPage', label: 'blogPage' },
    { id: 'CareerPage', label: 'CareerPage' },
    { id: 'caseStudyPage', label: 'caseStudyPage' },
    { id: 'ContactPage', label: 'ContactPage' },
    { id: 'footer', label: 'footer' },
    { id: 'HomePage', label: 'HomePage' },
    { id: 'IndustryPage', label: 'IndustryPage' },
    { id: 'llm', label: 'llm' },
    { id: 'Navbar', label: 'Navbar' },
    { id: 'OurApproachPage', label: 'OurApproachPage' },
    { id: 'PrivacyPolicyPage', label: 'PrivacyPolicyPage' },
    { id: 'ProductPage', label: 'ProductPage' },
    { id: 'robot', label: 'robot' },
    { id: 'ServicePage', label: 'ServicePage' },
    { id: 'TermsAndConditionPage', label: 'TermsAndConditionPage' },
  ];

  const collectionTypesList: Array<{ id: ActiveView; label: string; count?: number }> = [
    { id: 'redirect', label: 'redirect', count: cmsData.redirect.length },
    { id: 'service', label: 'service', count: cmsData.services.length },
    { id: 'sitemap', label: 'sitemap', count: cmsData.sitemap.length },
    { id: 'User', label: 'User', count: cmsData.users.length },
  ];

  const filteredSingleTypes = singleTypesList.filter((item) =>
    item.label.toLowerCase().includes(sidebarFilter.toLowerCase())
  );
  const filteredCollectionTypes = collectionTypesList.filter((item) =>
    item.label.toLowerCase().includes(sidebarFilter.toLowerCase())
  );

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-[#f6f8fb] text-[#272b33] font-sans text-sm select-none">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-5 right-6 z-50 bg-[#288226] text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* ========================================================
          1. FAR LEFT SLIM SIDEBAR (56px Icon Nav)
          ======================================================== */}
      <aside className="w-[56px] shrink-0 bg-[#ffffff] border-r border-[#e3e7f0] flex flex-col items-center py-3 justify-between z-30">
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Brand Logo Square */}
          <button
            type="button"
            onClick={() => setActiveView('HomePage')}
            className="w-9 h-9 rounded-lg bg-[#4945ff] text-white flex items-center justify-center font-bold text-base shadow-sm hover:opacity-95 transition-all"
            title="Axia Kairos CMS"
          >
            A
          </button>

          {/* Navigation Icons Stack */}
          <nav className="flex flex-col items-center gap-1.5 w-full px-1">
            <button
              type="button"
              onClick={() => setActiveView('HomePage')}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeView === 'HomePage'
                  ? 'text-[#4945ff] bg-[#f0f3ff]'
                  : 'text-[#8c9ba5] hover:text-[#4945ff] hover:bg-[#f0f3ff]'
              }`}
              title="Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" strokeWidth={1.75} />
            </button>

            {/* Active Pen/Feather Icon with blue indicator (Content Manager) */}
            <div className="relative w-full flex items-center justify-center">
              <button
                type="button"
                onClick={() => setActiveView('HomePage')}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-[#4945ff] bg-[#f0f3ff] transition-all"
                title="Content Manager"
              >
                <Feather className="w-5 h-5" strokeWidth={2} />
              </button>
              <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#4945ff] rounded-r" />
            </div>

            <button
              type="button"
              onClick={() => setActiveView('ProductPage')}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8c9ba5] hover:text-[#4945ff] hover:bg-[#f0f3ff] transition-all"
              title="Media Library"
            >
              <ImageIcon className="w-5 h-5" strokeWidth={1.75} />
            </button>

            <button
              type="button"
              onClick={() => setActiveView('service')}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8c9ba5] hover:text-[#4945ff] hover:bg-[#f0f3ff] transition-all"
              title="Content-Type Builder"
            >
              <Boxes className="w-5 h-5" strokeWidth={1.75} />
            </button>

            <button
              type="button"
              onClick={() => setActiveView('inbox')}
              className={`w-10 h-10 rounded-lg flex items-center justify-center relative transition-all ${
                activeView === 'inbox'
                  ? 'text-[#4945ff] bg-[#f0f3ff]'
                  : 'text-[#8c9ba5] hover:text-[#4945ff] hover:bg-[#f0f3ff]'
              }`}
              title="Inquiries & Messages"
            >
              <Mail className="w-5 h-5" strokeWidth={1.75} />
              {messages.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#4945ff]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveView('robot')}
              className="w-10 h-10 rounded-lg flex items-center justify-center text-[#8c9ba5] hover:text-[#4945ff] hover:bg-[#f0f3ff] transition-all"
              title="Chatbot & AI"
            >
              <Bot className="w-5 h-5" strokeWidth={1.75} />
            </button>

            <button
              type="button"
              onClick={() => setActiveView('llm')}
              className="w-10 h-10 rounded-lg flex items-center justify-center relative text-[#8c9ba5] hover:text-[#4945ff] hover:bg-[#f0f3ff] transition-all"
              title="Settings"
            >
              <Settings className="w-5 h-5" strokeWidth={1.75} />
              <span className="absolute top-1.5 right-1.5 bg-[#4945ff] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                1
              </span>
            </button>
          </nav>
        </div>

        {/* User Avatar Circle (ZG) & Logout */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={onLogout}
            className="w-9 h-9 rounded-full bg-[#4945ff] text-white font-bold text-xs flex items-center justify-center shadow-xs hover:ring-2 hover:ring-[#4945ff]/40 transition-all cursor-pointer"
            title={`${user.username} (${user.role}) - Click to Log Out`}
          >
            ZG
          </button>
        </div>
      </aside>

      {/* ========================================================
          2. SECOND LEFT SIDEBAR (Content Models Tree)
          ======================================================== */}
      <aside className="w-[240px] shrink-0 bg-[#ffffff] border-r border-[#e3e7f0] flex flex-col h-full z-20">
        {/* Search Input */}
        <div className="p-3 border-b border-[#e3e7f0]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8c9ba5] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search content..."
              value={sidebarFilter}
              onChange={(e) => setSidebarFilter(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-md bg-[#f6f8fb] border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] transition-colors"
            />
          </div>
        </div>

        {/* Scrollable Tree */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
          {/* Collection Types */}
          <div className="space-y-0.5">
            {filteredCollectionTypes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                  activeView === item.id
                    ? 'bg-[#f0f3ff] text-[#4945ff] font-semibold'
                    : 'text-[#4a5568] hover:bg-[#f6f8fb] hover:text-[#272b33]'
                }`}
              >
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span className="text-[10px] font-mono text-[#8c9ba5] bg-[#edf2f7] px-1.5 py-0.5 rounded">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* SINGLE TYPES Header */}
          <div>
            <div className="text-[10.5px] font-bold text-[#8c9ba5] tracking-wider uppercase px-3 pb-1">
              SINGLE TYPES
            </div>
            <div className="space-y-0.5">
              {filteredSingleTypes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveView(item.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                    activeView === item.id
                      ? 'bg-[#f0f3ff] text-[#4945ff] font-semibold'
                      : 'text-[#4a5568] hover:bg-[#f6f8fb] hover:text-[#272b33]'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================
          3. MAIN CONTENT WORKSPACE (Center Editor)
          ======================================================== */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#f6f8fb]">
        {/* Top Navigation Bar: Back link, Document ID, Published badge, Options */}
        <header className="px-8 pt-5 pb-3 border-b border-[#e3e7f0] bg-white flex items-center justify-between shrink-0">
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setActiveView('HomePage')}
              className="text-[#4945ff] hover:underline flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#272b33] tracking-tight">
                {activeView === 'HomePage'
                  ? cmsData.documentId
                  : `${activeView} Content`}
              </h1>
              <span className="bg-[#eafbe7] text-[#288226] border border-[#bbf2b6] text-[11px] font-semibold px-2.5 py-0.5 rounded">
                Published
              </span>
            </div>

            {/* DRAFT / PUBLISHED Tabs */}
            <div className="flex items-center gap-6 mt-1 border-b border-transparent">
              <button
                type="button"
                onClick={() => setActiveTab('DRAFT')}
                className={`text-xs font-bold pb-1.5 relative transition-colors ${
                  activeTab === 'DRAFT'
                    ? 'text-[#4945ff] after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#4945ff]'
                    : 'text-[#667085] hover:text-[#272b33]'
                }`}
              >
                DRAFT
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('PUBLISHED')}
                className={`text-xs font-bold pb-1.5 relative transition-colors ${
                  activeTab === 'PUBLISHED'
                    ? 'text-[#4945ff] after:content-[\'\'] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#4945ff]'
                    : 'text-[#667085] hover:text-[#272b33]'
                }`}
              >
                PUBLISHED
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setJsonMode(!jsonMode)}
              className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                jsonMode
                  ? 'bg-[#4945ff] text-white border-[#4945ff]'
                  : 'bg-white text-[#4a5568] border-[#e3e7f0] hover:bg-[#f6f8fb]'
              }`}
              title="Toggle between Visual Form Editor and raw JSON Code Mode"
            >
              {jsonMode ? 'Visual Mode' : 'JSON Mode'}
            </button>
            <button
              type="button"
              onClick={() => setShowOptionsModal(!showOptionsModal)}
              className="p-1.5 rounded hover:bg-[#f6f8fb] border border-[#e3e7f0] text-[#667085]"
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* ========================================================
              VIEW 1: HomePage (Matches attached Strapi screenshot)
              ======================================================== */}
          {activeView === 'HomePage' && (
            <div className="space-y-6 max-w-[1020px]">
              {/* Component Card: HeroSection (3) */}
              <div className="rounded-lg border border-[#e3e7f0] bg-white shadow-xs overflow-hidden">
                <div className="px-5 py-3 border-b border-[#e3e7f0] bg-[#fcfdfe] flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#4a5568]">
                    HeroSection (3)
                  </span>
                </div>

                <div className="p-4">
                  {/* Collapsible Section Card with Lavender-Blue Header (Matches screenshot) */}
                  <div className="rounded-md border border-[#d8e0ff] overflow-hidden bg-white">
                    <div className="p-3 bg-[#f6f8ff] border-b border-[#d8e0ff] flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setHeroExpanded(!heroExpanded)}
                          className="w-5 h-5 rounded-full bg-[#4945ff] text-white flex items-center justify-center hover:bg-[#3d38ee] transition-colors"
                        >
                          {heroExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <span className="font-bold text-xs text-[#4945ff]">
                          {cmsData.homePage.heroSection.header1 || 'Elevate Your Enterprise.'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[#8c9ba5]">
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Clear Hero Section inputs?')) {
                              setCmsData({
                                ...cmsData,
                                homePage: {
                                  ...cmsData.homePage,
                                  heroSection: {
                                    ...cmsData.homePage.heroSection,
                                    header1: '',
                                    header2: '',
                                    description: '',
                                  },
                                },
                              });
                            }
                          }}
                          className="hover:text-red-600 transition-colors"
                          title="Delete content"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <GripVertical className="w-4 h-4 cursor-grab" />
                      </div>
                    </div>

                    {heroExpanded && (
                      <div className="p-5 space-y-4">
                        {/* Two Columns: Header1 and Header2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                              Header1
                            </label>
                            <input
                              type="text"
                              value={cmsData.homePage.heroSection.header1}
                              onChange={(e) =>
                                setCmsData({
                                  ...cmsData,
                                  homePage: {
                                    ...cmsData.homePage,
                                    heroSection: {
                                      ...cmsData.homePage.heroSection,
                                      header1: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                              Header2
                            </label>
                            <input
                              type="text"
                              value={cmsData.homePage.heroSection.header2}
                              onChange={(e) =>
                                setCmsData({
                                  ...cmsData,
                                  homePage: {
                                    ...cmsData.homePage,
                                    heroSection: {
                                      ...cmsData.homePage.heroSection,
                                      header2: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                            />
                          </div>
                        </div>

                        {/* Two Columns: Description and HeroImage */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                              Description
                            </label>
                            <textarea
                              rows={5}
                              value={cmsData.homePage.heroSection.description}
                              onChange={(e) =>
                                setCmsData({
                                  ...cmsData,
                                  homePage: {
                                    ...cmsData.homePage,
                                    heroSection: {
                                      ...cmsData.homePage.heroSection,
                                      description: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white leading-relaxed resize-y"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                              HeroImage (1 / 1)
                            </label>
                            <div className="border border-[#e3e7f0] rounded-md p-2 bg-[#fcfdfe] flex flex-col items-center justify-center">
                              <div className="relative w-full h-28 bg-[#0b192c] rounded overflow-hidden flex items-center justify-center group">
                                <img
                                  src={cmsData.homePage.heroSection.heroImage}
                                  alt="Hero Image"
                                  className="w-full h-full object-cover"
                                />
                                {/* Overlay action buttons: +, Link, Trash, Edit */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const url = prompt('Enter Hero Image URL or /assets path:', cmsData.homePage.heroSection.heroImage);
                                      if (url) {
                                        setCmsData({
                                          ...cmsData,
                                          homePage: {
                                            ...cmsData.homePage,
                                            heroSection: {
                                              ...cmsData.homePage.heroSection,
                                              heroImage: url,
                                            },
                                          },
                                        });
                                      }
                                    }}
                                    className="w-7 h-7 rounded bg-white text-slate-800 hover:bg-slate-100 flex items-center justify-center shadow-xs"
                                    title="Replace Image"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const url = prompt('Enter Image Link:', cmsData.homePage.heroSection.heroImage);
                                      if (url) {
                                        setCmsData({
                                          ...cmsData,
                                          homePage: {
                                            ...cmsData.homePage,
                                            heroSection: {
                                              ...cmsData.homePage.heroSection,
                                              heroImage: url,
                                            },
                                          },
                                        });
                                      }
                                    }}
                                    className="w-7 h-7 rounded bg-white text-slate-800 hover:bg-slate-100 flex items-center justify-center shadow-xs"
                                    title="Edit Link"
                                  >
                                    <LinkIcon className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCmsData({
                                        ...cmsData,
                                        homePage: {
                                          ...cmsData.homePage,
                                          heroSection: {
                                            ...cmsData.homePage.heroSection,
                                            heroImage: '/assets/hero.webp',
                                          },
                                        },
                                      });
                                    }}
                                    className="w-7 h-7 rounded bg-white text-red-600 hover:bg-red-50 flex items-center justify-center shadow-xs"
                                    title="Reset to default"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                              <span className="text-[11px] text-[#8c9ba5] font-mono mt-1.5 truncate max-w-full">
                                {cmsData.homePage.heroSection.heroImage.split('/').pop() || 'Elevate Your Enterprise.png'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Row: HeroImageAltText & Eyebrow */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                              HeroImageAltText
                            </label>
                            <input
                              type="text"
                              value={cmsData.homePage.heroSection.heroImageAltText}
                              onChange={(e) =>
                                setCmsData({
                                  ...cmsData,
                                  homePage: {
                                    ...cmsData.homePage,
                                    heroSection: {
                                      ...cmsData.homePage.heroSection,
                                      heroImageAltText: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                              Eyebrow
                            </label>
                            <input
                              type="text"
                              value={cmsData.homePage.heroSection.eyebrow}
                              onChange={(e) =>
                                setCmsData({
                                  ...cmsData,
                                  homePage: {
                                    ...cmsData.homePage,
                                    heroSection: {
                                      ...cmsData.homePage.heroSection,
                                      eyebrow: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Component Card: ServicesOverviewSection */}
              <div className="rounded-lg border border-[#e3e7f0] bg-white shadow-xs p-5 space-y-4">
                <h3 className="font-semibold text-xs text-[#4a5568] uppercase tracking-wider">
                  Services Overview Section
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                      Section Heading
                    </label>
                    <input
                      type="text"
                      value={cmsData.homePage.servicesOverview.heading}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          homePage: {
                            ...cmsData.homePage,
                            servicesOverview: {
                              ...cmsData.homePage.servicesOverview,
                              heading: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1.5">
                      Section Tagline
                    </label>
                    <input
                      type="text"
                      value={cmsData.homePage.servicesOverview.tagline}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          homePage: {
                            ...cmsData.homePage,
                            servicesOverview: {
                              ...cmsData.homePage.servicesOverview,
                              tagline: e.target.value,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 2: service (Collection Type - Add & Edit Services)
              ======================================================== */}
          {activeView === 'service' && (
            <div className="space-y-6 max-w-[1020px]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#272b33]">
                    Services Collection ({cmsData.services.length})
                  </h2>
                  <p className="text-xs text-[#8c9ba5] mt-0.5">
                    Add, edit, or remove enterprise transformation services.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const title = prompt('Enter new service title:');
                    if (!title) return;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    const newSvc: any = {
                      slug,
                      title,
                      shortDescription: 'Comprehensive enterprise advisory and digital architecture.',
                      seo: {
                        title: `${title} | Axia Kairos`,
                        description: 'Enterprise consulting and architecture transformation.',
                      },
                      hero: {
                        tagline: 'Strategic Enterprise Capability',
                      },
                      intro: {
                        paragraphs: ['Accelerating transformation across modern ecosystems.'],
                      },
                      whyItMatters: {
                        lead: 'Why this service matters to enterprise leaders:',
                        items: [
                          { title: 'Strategic Velocity', text: 'Accelerate organizational readiness.' },
                          { title: 'Scalable Architecture', text: 'Built on robust engineering principles.' },
                        ],
                      },
                      portfolio: {
                        lead: 'Key Capabilities:',
                        items: [],
                      },
                      methodology: {
                        steps: [],
                      },
                    };
                    setCmsData({
                      ...cmsData,
                      services: [newSvc, ...cmsData.services],
                    });
                    triggerToast(`Service "${title}" added! Click Save to persist.`);
                  }}
                  className="px-3 py-1.5 rounded-md bg-[#4945ff] text-white text-xs font-semibold hover:bg-[#3d38ee] flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create new service</span>
                </button>
              </div>

              <div className="space-y-4">
                {cmsData.services.map((svc, idx) => (
                  <div
                    key={svc.slug || idx}
                    className="border border-[#e3e7f0] rounded-lg bg-white p-5 shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase bg-[#f0f3ff] text-[#4945ff] px-2 py-0.5 rounded font-semibold">
                          {svc.hero?.tagline || 'Enterprise Service'}
                        </span>
                        <h4 className="text-sm font-bold text-[#272b33]">
                          {svc.title}
                        </h4>
                        <span className="text-[11px] font-mono text-[#8c9ba5]">
                          /services/{svc.slug}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete service "${svc.title}"?`)) {
                            setCmsData({
                              ...cmsData,
                              services: cmsData.services.filter((_, i) => i !== idx),
                            });
                          }
                        }}
                        className="text-[#8c9ba5] hover:text-red-600 p-1"
                        title="Delete service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                          Service Title
                        </label>
                        <input
                          type="text"
                          value={svc.title}
                          onChange={(e) => {
                            const updated = [...cmsData.services];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setCmsData({ ...cmsData, services: updated });
                          }}
                          className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                          Tagline
                        </label>
                        <input
                          type="text"
                          value={svc.hero?.tagline || ''}
                          onChange={(e) => {
                            const updated = [...cmsData.services];
                            updated[idx] = {
                              ...updated[idx],
                              hero: { ...updated[idx].hero, tagline: e.target.value },
                            };
                            setCmsData({ ...cmsData, services: updated });
                          }}
                          className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                        Short Description
                      </label>
                      <textarea
                        rows={2}
                        value={svc.shortDescription || ''}
                        onChange={(e) => {
                          const updated = [...cmsData.services];
                          updated[idx] = { ...updated[idx], shortDescription: e.target.value };
                          setCmsData({ ...cmsData, services: updated });
                        }}
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 3: blogPage (Add & Edit Blogs)
              ======================================================== */}
          {activeView === 'blogPage' && (
            <div className="space-y-6 max-w-[1020px]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#272b33]">
                    Blog Posts ({cmsData.blogs.length})
                  </h2>
                  <p className="text-xs text-[#8c9ba5] mt-0.5">
                    Manage thought leadership articles and published blogs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const title = prompt('Enter new blog post title:');
                    if (!title) return;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    const newBlog: any = {
                      slug,
                      title,
                      excerpt: 'Executive insights on enterprise transformation and strategic agility.',
                      date: new Date().toISOString(),
                      formattedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                      readingTimeMinutes: 5,
                      coverImage: '/assets/hero.webp',
                      seo: { title, description: 'Insights from Axia Kairos' },
                      body: [],
                    };
                    setCmsData({
                      ...cmsData,
                      blogs: [newBlog, ...cmsData.blogs],
                    });
                    triggerToast(`Blog post "${title}" created!`);
                  }}
                  className="px-3 py-1.5 rounded-md bg-[#4945ff] text-white text-xs font-semibold hover:bg-[#3d38ee] flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create new article</span>
                </button>
              </div>

              <div className="space-y-4">
                {cmsData.blogs.map((b, idx) => (
                  <div key={b.slug || idx} className="border border-[#e3e7f0] rounded-lg bg-white p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase bg-[#f0f3ff] text-[#4945ff] px-2 py-0.5 rounded font-semibold">
                        {b.formattedDate || b.date} · {b.readingTimeMinutes || 5} min read
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete post "${b.title}"?`)) {
                            setCmsData({
                              ...cmsData,
                              blogs: cmsData.blogs.filter((_, i) => i !== idx),
                            });
                          }
                        }}
                        className="text-[#8c9ba5] hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                          Article Title
                        </label>
                        <input
                          type="text"
                          value={b.title}
                          onChange={(e) => {
                            const updated = [...cmsData.blogs];
                            updated[idx] = { ...updated[idx], title: e.target.value };
                            setCmsData({ ...cmsData, blogs: updated });
                          }}
                          className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                          Reading Time (Minutes)
                        </label>
                        <input
                          type="number"
                          value={b.readingTimeMinutes || 5}
                          onChange={(e) => {
                            const updated = [...cmsData.blogs];
                            updated[idx] = { ...updated[idx], readingTimeMinutes: parseInt(e.target.value, 10) || 5 };
                            setCmsData({ ...cmsData, blogs: updated });
                          }}
                          className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                        Excerpt
                      </label>
                      <textarea
                        rows={2}
                        value={b.excerpt}
                        onChange={(e) => {
                          const updated = [...cmsData.blogs];
                          updated[idx] = { ...updated[idx], excerpt: e.target.value };
                          setCmsData({ ...cmsData, blogs: updated });
                        }}
                        className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 4: Navbar
              ======================================================== */}
          {activeView === 'Navbar' && (
            <div className="space-y-6 max-w-[1020px]">
              <div className="border border-[#e3e7f0] rounded-lg bg-white p-5 shadow-xs space-y-4">
                <h3 className="font-semibold text-xs text-[#4a5568] uppercase tracking-wider">
                  Brand Logo & Top Navigation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Brand Text
                    </label>
                    <input
                      type="text"
                      value={cmsData.navbar.brand}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          navbar: { ...cmsData.navbar, brand: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Sub Brand
                    </label>
                    <input
                      type="text"
                      value={cmsData.navbar.sub}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          navbar: { ...cmsData.navbar, sub: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-bold text-[#c2a675]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Trademark Symbol
                    </label>
                    <input
                      type="text"
                      value={cmsData.navbar.trademark}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          navbar: { ...cmsData.navbar, trademark: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      CTA Button Label
                    </label>
                    <input
                      type="text"
                      value={cmsData.navbar.ctaLabel}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          navbar: { ...cmsData.navbar, ctaLabel: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      CTA Destination URL
                    </label>
                    <input
                      type="text"
                      value={cmsData.navbar.ctaHref}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          navbar: { ...cmsData.navbar, ctaHref: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 5: robot (Chatbot Configuration with c.webp)
              ======================================================== */}
          {activeView === 'robot' && (
            <div className="space-y-6 max-w-[1020px]">
              <div className="border border-[#e3e7f0] rounded-lg bg-white p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-[#d8e0ff] bg-slate-900 flex items-center justify-center">
                    <img
                      src={cmsData.robot.avatarUrl}
                      alt="Chatbot Avatar"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#272b33]">
                      AI Chatbot Assistant Profile
                    </h3>
                    <p className="text-xs text-[#8c9ba5]">
                      Managed robot avatar, greeting, status, and system prompts.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Assistant Display Name
                    </label>
                    <input
                      type="text"
                      value={cmsData.robot.name}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          robot: { ...cmsData.robot, name: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Avatar Image Path
                    </label>
                    <input
                      type="text"
                      value={cmsData.robot.avatarUrl}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          robot: { ...cmsData.robot, avatarUrl: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                    Welcome Greeting Message
                  </label>
                  <textarea
                    rows={3}
                    value={cmsData.robot.welcomeMessage}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        robot: { ...cmsData.robot, welcomeMessage: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff] bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 6: Inquiries (Contact Messages Manager)
              ======================================================== */}
          {activeView === 'inbox' && (
            <div className="space-y-6 max-w-[1020px]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#272b33]">
                    Client Inquiries & Contact Submissions ({messages.length})
                  </h2>
                  <p className="text-xs text-[#8c9ba5] mt-0.5">
                    Real-time management for website form submissions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const res = await seedTestInquiry(token);
                    if (res && typeof res === 'object' && 'id' in res) {
                      setMessages([(res as unknown) as ContactMessageRecord, ...messages]);
                      triggerToast('Sample test inquiry generated!');
                    }
                  }}
                  className="px-3 py-1.5 rounded-md bg-[#4945ff] text-white text-xs font-semibold hover:bg-[#3d38ee] flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Seed Test Inquiry</span>
                </button>
              </div>

              {messagesLoading ? (
                <div className="p-8 text-center text-xs text-[#8c9ba5]">
                  Loading inquiries...
                </div>
              ) : messages.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-[#e3e7f0] rounded-lg bg-white">
                  <Mail className="w-8 h-8 text-[#8c9ba5] mx-auto mb-2" />
                  <p className="text-xs text-[#8c9ba5]">No inquiries received yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="border border-[#e3e7f0] rounded-lg bg-white p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#272b33]">
                            {msg.fullName || 'Anonymous Client'}
                          </span>
                          <span className="text-[11px] text-[#4945ff] font-medium">
                            {msg.email}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                              msg.status === 'unread'
                                ? 'bg-amber-100 text-amber-800'
                                : msg.status === 'replied'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {msg.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#4a5568]">{msg.message}</p>
                        <span className="text-[10px] font-mono text-[#8c9ba5]">
                          {msg.company ? `${msg.company} · ` : ''}
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={msg.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value as any;
                            await updateAdminMessageStatus(token, msg.id, newStatus);
                            setMessages(
                              messages.map((m) => (m.id === msg.id ? { ...m, status: newStatus } : m))
                            );
                            triggerToast(`Status updated to "${newStatus}"`);
                          }}
                          className="text-xs px-2.5 py-1.5 rounded border border-[#e3e7f0] bg-white font-medium"
                        >
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="archived">Archived</option>
                        </select>
                        <button
                          type="button"
                          onClick={async () => {
                            if (window.confirm('Delete message?')) {
                              await deleteAdminMessage(token, msg.id);
                              setMessages(messages.filter((m) => m.id !== msg.id));
                              triggerToast('Message deleted.');
                            }
                          }}
                          className="p-1.5 rounded hover:bg-red-50 text-[#8c9ba5] hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================
              VIEW 7: LLM & AI Assistant Configuration
              ======================================================== */}
          {activeView === 'llm' && !jsonMode && (
            <div className="space-y-6 max-w-[1020px]">
              <div className="border border-[#e3e7f0] rounded-lg bg-white p-5 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-[#e3e7f0] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#eafbe7] border border-[#bbf2b6] flex items-center justify-center text-[#288226]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#272b33]">
                        AI Intelligence & LLM Model Settings
                      </h3>
                      <p className="text-xs text-[#8c9ba5]">
                        Configure OpenAI ChatGPT provider, model tier, search groundedness, and token parameters.
                      </p>
                    </div>
                  </div>
                  <span className="bg-[#eafbe7] text-[#288226] border border-[#bbf2b6] text-xs font-bold px-2.5 py-1 rounded">
                    OpenAI ChatGPT Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      AI Provider & Model ID
                    </label>
                    <select
                      value={cmsData.llm.model || 'gpt-4o-mini'}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          llm: { ...cmsData.llm, model: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] bg-white font-medium focus:outline-none focus:border-[#4945ff]"
                    >
                      <option value="gpt-4o-mini">gpt-4o-mini (Recommended · OpenAI ChatGPT High Speed & Accuracy)</option>
                      <option value="gpt-4o">gpt-4o (OpenAI ChatGPT Full Reasoning Model)</option>
                      <option value="claude-haiku-5-5">claude-haiku-5-5 (Anthropic Claude Haiku)</option>
                      <option value="claude-sonnet-5-5">claude-sonnet-5-5 (Anthropic Claude Sonnet)</option>
                    </select>
                    <p className="text-[11px] text-[#8c9ba5] mt-1">
                      Selects the LLM that interprets queries and executes search & handoff tools.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Temperature ({cmsData.llm.temperature ?? 0.2})
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={cmsData.llm.temperature ?? 0.2}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          llm: { ...cmsData.llm, temperature: parseFloat(e.target.value) },
                        })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-[10px] text-[#8c9ba5] mt-0.5">
                      <span>Strict / Grounded (0.0)</span>
                      <span>Balanced (0.5)</span>
                      <span>Creative (1.0)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Max Completion Tokens per Turn
                    </label>
                    <input
                      type="number"
                      value={cmsData.llm.maxTokens || 400}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          llm: { ...cmsData.llm, maxTokens: parseInt(e.target.value) || 400 },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] bg-white font-mono"
                    />
                    <p className="text-[11px] text-[#8c9ba5] mt-1">
                      Target response length is under 120 words (~400 tokens) for crisp answers.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Groundedness Score Threshold
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      value={cmsData.llm.groundednessThreshold ?? 0.85}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          llm: { ...cmsData.llm, groundednessThreshold: parseFloat(e.target.value) || 0.85 },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded-md border border-[#e3e7f0] bg-white font-mono"
                    />
                    <p className="text-[11px] text-[#8c9ba5] mt-1">
                      Rejects hallucinated unverified claims below this threshold.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#f6f8ff] border border-[#d8e0ff] rounded-md flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#272b33] block">
                      Enterprise Knowledge Base RAG Search
                    </span>
                    <span className="text-[11px] text-[#667085]">
                      Enables semantic BM25 search over verified services, case studies, and corporate policies.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={cmsData.llm.searchEnabled ?? true}
                    onChange={(e) =>
                      setCmsData({
                        ...cmsData,
                        llm: { ...cmsData.llm, searchEnabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-[#4945ff] rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 8: caseStudyPage (Case Studies Collection)
              ======================================================== */}
          {activeView === 'caseStudyPage' && !jsonMode && (
            <div className="space-y-6 max-w-[1020px]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#272b33]">
                    Case Studies Collection ({cmsData.caseStudies.length})
                  </h2>
                  <p className="text-xs text-[#8c9ba5] mt-0.5">
                    Manage published client success stories and verified transformation metrics.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const title = prompt('Enter case study title:');
                    if (!title) return;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    const newCs: any = {
                      slug,
                      title,
                      clientSector: 'Enterprise Global Client',
                      industry: 'Cross-Industry',
                      date: new Date().toISOString(),
                      summary: 'Strategic modernization delivering operational excellence.',
                      metrics: ['+40% efficiency', '-30% latency', '99.9% uptime'],
                      challenge: 'Legacy system constraints and siloed enterprise architecture.',
                      solution: 'Deployment of cloud-native architecture and automated data pipelines.',
                    };
                    setCmsData({
                      ...cmsData,
                      caseStudies: [newCs, ...cmsData.caseStudies],
                    });
                    triggerToast(`Case study "${title}" added! Click Save to persist.`);
                  }}
                  className="px-3 py-1.5 rounded-md bg-[#4945ff] text-white text-xs font-semibold hover:bg-[#3d38ee] flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create new Case Study</span>
                </button>
              </div>

              <div className="space-y-4">
                {cmsData.caseStudies.map((cs, idx) => (
                  <div key={cs.slug || idx} className="border border-[#e3e7f0] rounded-lg bg-white p-5 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <label className="block text-[11px] font-bold text-[#8c9ba5] uppercase">
                          Case Study Title
                        </label>
                        <input
                          type="text"
                          value={cs.title}
                          onChange={(e) => {
                            const updated = [...cmsData.caseStudies];
                            updated[idx].title = e.target.value;
                            setCmsData({ ...cmsData, caseStudies: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs font-semibold rounded border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete case study "${cs.title}"?`)) {
                            const updated = cmsData.caseStudies.filter((_, i) => i !== idx);
                            setCmsData({ ...cmsData, caseStudies: updated });
                            triggerToast('Case study removed.');
                          }
                        }}
                        className="p-1.5 text-[#8c9ba5] hover:text-red-600 rounded hover:bg-red-50 mt-6"
                        title="Delete case study"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#8c9ba5] uppercase">
                          Industry / Domain
                        </label>
                        <input
                          type="text"
                          value={cs.industry || (cs as any).clientSector || ''}
                          onChange={(e) => {
                            const updated = [...cmsData.caseStudies];
                            updated[idx].industry = e.target.value;
                            setCmsData({ ...cmsData, caseStudies: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#8c9ba5] uppercase">
                          Key Metrics (comma separated)
                        </label>
                        <input
                          type="text"
                          value={(((cs as any).metrics || cs.results?.items?.map((it) => it.metric).filter(Boolean) || []) as string[]).join(', ')}
                          onChange={(e) => {
                            const updated = [...cmsData.caseStudies];
                            (updated[idx] as any).metrics = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                            setCmsData({ ...cmsData, caseStudies: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#8c9ba5] uppercase">
                        Executive Summary
                      </label>
                      <textarea
                        rows={2}
                        value={cs.summary || ''}
                        onChange={(e) => {
                          const updated = [...cmsData.caseStudies];
                          updated[idx].summary = e.target.value;
                          setCmsData({ ...cmsData, caseStudies: updated });
                        }}
                        className="w-full px-3 py-1.5 text-xs rounded border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 9: CareerPage (Jobs & Hiring Openings)
              ======================================================== */}
          {activeView === 'CareerPage' && !jsonMode && (
            <div className="space-y-6 max-w-[1020px]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#272b33]">
                    Careers & Open Positions ({cmsData.careers.length})
                  </h2>
                  <p className="text-xs text-[#8c9ba5] mt-0.5">
                    Manage active job postings, departments, locations, and hiring requirements.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const title = prompt('Enter Job Title:');
                    if (!title) return;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    const newJob: any = {
                      slug,
                      title,
                      department: 'Technology Consulting',
                      location: 'Toronto, Canada / Remote',
                      employmentType: 'Full-Time',
                      experience: '4+ Years',
                      summary: 'Seeking an exceptional practitioner to drive high-impact transformation engagements.',
                      status: 'open',
                    };
                    setCmsData({
                      ...cmsData,
                      careers: [newJob, ...cmsData.careers],
                    });
                    triggerToast(`Job "${title}" added! Click Save to persist.`);
                  }}
                  className="px-3 py-1.5 rounded-md bg-[#4945ff] text-white text-xs font-semibold hover:bg-[#3d38ee] flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create new Job Opening</span>
                </button>
              </div>

              <div className="space-y-4">
                {cmsData.careers.map((job, idx) => (
                  <div key={job.slug || idx} className="border border-[#e3e7f0] rounded-lg bg-white p-5 shadow-xs space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <label className="block text-[11px] font-bold text-[#8c9ba5] uppercase">
                          Position Title
                        </label>
                        <input
                          type="text"
                          value={job.title}
                          onChange={(e) => {
                            const updated = [...cmsData.careers];
                            updated[idx].title = e.target.value;
                            setCmsData({ ...cmsData, careers: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs font-semibold rounded border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete job opening "${job.title}"?`)) {
                            const updated = cmsData.careers.filter((_, i) => i !== idx);
                            setCmsData({ ...cmsData, careers: updated });
                            triggerToast('Job opening removed.');
                          }
                        }}
                        className="p-1.5 text-[#8c9ba5] hover:text-red-600 rounded hover:bg-red-50 mt-6"
                        title="Delete opening"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-[#8c9ba5] uppercase">
                          Department
                        </label>
                        <input
                          type="text"
                          value={job.department}
                          onChange={(e) => {
                            const updated = [...cmsData.careers];
                            updated[idx].department = e.target.value;
                            setCmsData({ ...cmsData, careers: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#8c9ba5] uppercase">
                          Location
                        </label>
                        <input
                          type="text"
                          value={job.location}
                          onChange={(e) => {
                            const updated = [...cmsData.careers];
                            updated[idx].location = e.target.value;
                            setCmsData({ ...cmsData, careers: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#8c9ba5] uppercase">
                          Type & Experience
                        </label>
                        <input
                          type="text"
                          value={`${job.employmentType} · ${job.experience || ''}`}
                          onChange={(e) => {
                            const updated = [...cmsData.careers];
                            updated[idx].employmentType = e.target.value;
                            setCmsData({ ...cmsData, careers: updated });
                          }}
                          className="w-full px-3 py-1.5 text-xs rounded border border-[#e3e7f0] focus:outline-none focus:border-[#4945ff]"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 10: ContactPage (Corporate Contacts & Hubs)
              ======================================================== */}
          {activeView === 'ContactPage' && !jsonMode && (
            <div className="space-y-6 max-w-[1020px]">
              <div className="border border-[#e3e7f0] rounded-lg bg-white p-5 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-[#272b33]">
                  Contact Information & Official Communication Channels
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      General Inquiries Email
                    </label>
                    <input
                      type="email"
                      value={cmsData.contactPage?.emails?.general || 'contact@axiakairos.com'}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          contactPage: {
                            ...cmsData.contactPage,
                            emails: { ...cmsData.contactPage?.emails, general: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded border border-[#e3e7f0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Direct Sales & Consulting Email
                    </label>
                    <input
                      type="email"
                      value={cmsData.contactPage?.emails?.sales || 'sales@axiakairos.com'}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          contactPage: {
                            ...cmsData.contactPage,
                            emails: { ...cmsData.contactPage?.emails, sales: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded border border-[#e3e7f0]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Direct Contact Phone
                    </label>
                    <input
                      type="text"
                      value={cmsData.contactPage?.phones?.general || '+1 (800) 321-4321'}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          contactPage: {
                            ...cmsData.contactPage,
                            phones: { ...cmsData.contactPage?.phones, general: e.target.value },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded border border-[#e3e7f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Global Headquarters Location
                    </label>
                    <input
                      type="text"
                      value={cmsData.aboutUsPage?.headquarters || 'Toronto, Ontario, Canada'}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          aboutUsPage: {
                            ...cmsData.aboutUsPage,
                            headquarters: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded border border-[#e3e7f0]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 11: AboutUsPage (Corporate Mission & Pillars)
              ======================================================== */}
          {activeView === 'AboutUsPage' && !jsonMode && (
            <div className="space-y-6 max-w-[1020px]">
              <div className="border border-[#e3e7f0] rounded-lg bg-white p-5 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-[#272b33]">
                  About Axia Kairos & Corporate Vision
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Corporate Headline / Tagline
                    </label>
                    <input
                      type="text"
                      value={cmsData.aboutUsPage?.tagline || 'Insight that shapes tomorrow. Execution that defines excellence.'}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          aboutUsPage: {
                            ...cmsData.aboutUsPage,
                            tagline: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded border border-[#e3e7f0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4a5568] mb-1">
                      Company Mission Statement
                    </label>
                    <textarea
                      rows={3}
                      value={cmsData.aboutUsPage?.mission || 'To empower global enterprises to achieve transformative growth...'}
                      onChange={(e) =>
                        setCmsData({
                          ...cmsData,
                          aboutUsPage: {
                            ...cmsData.aboutUsPage,
                            mission: e.target.value,
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-xs rounded border border-[#e3e7f0]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              FALLBACK / JSON MODE: For remaining views or when JSON mode is toggled
              ======================================================== */}
          {(jsonMode ||
            !['HomePage', 'service', 'blogPage', 'Navbar', 'robot', 'inbox', 'llm', 'caseStudyPage', 'CareerPage', 'ContactPage', 'AboutUsPage'].includes(
              activeView
            )) && (
            <div className="p-8 border border-[#e3e7f0] rounded-lg bg-white shadow-xs space-y-4 max-w-[1020px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#4945ff]" />
                  <h3 className="font-bold text-sm text-[#272b33]">
                    {activeView} Model Data ({jsonMode ? 'JSON Mode Active' : 'Model View'})
                  </h3>
                </div>
                <span className="text-[11px] text-[#8c9ba5] font-mono">
                  Real-time sync to DB
                </span>
              </div>
              <p className="text-xs text-[#8c9ba5]">
                Raw JSON configuration for {activeView}. All edits save directly to the PostgreSQL database and update the live website and chatbot.
              </p>
              <textarea
                rows={16}
                value={JSON.stringify(
                  activeView === 'AboutUsPage'
                    ? cmsData.aboutUsPage
                    : activeView === 'ContactPage'
                    ? cmsData.contactPage
                    : activeView === 'footer'
                    ? cmsData.footer
                    : activeView === 'IndustryPage'
                    ? cmsData.industryPage
                    : activeView === 'llm'
                    ? cmsData.llm
                    : activeView === 'OurApproachPage'
                    ? cmsData.ourApproachPage
                    : activeView === 'PrivacyPolicyPage'
                    ? cmsData.privacyPolicyPage
                    : activeView === 'TermsAndConditionPage'
                    ? cmsData.termsAndConditionPage
                    : activeView === 'caseStudyPage'
                    ? cmsData.caseStudies
                    : activeView === 'CareerPage'
                    ? cmsData.careers
                    : activeView === 'redirect'
                    ? cmsData.redirect
                    : activeView === 'sitemap'
                    ? cmsData.sitemap
                    : activeView === 'User'
                    ? cmsData.users
                    : {},
                  null,
                  2
                )}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    const updated = { ...cmsData };
                    if (activeView === 'AboutUsPage') updated.aboutUsPage = parsed;
                    else if (activeView === 'ContactPage') updated.contactPage = parsed;
                    else if (activeView === 'footer') updated.footer = parsed;
                    else if (activeView === 'IndustryPage') updated.industryPage = parsed;
                    else if (activeView === 'llm') updated.llm = parsed;
                    else if (activeView === 'OurApproachPage') updated.ourApproachPage = parsed;
                    else if (activeView === 'PrivacyPolicyPage') updated.privacyPolicyPage = parsed;
                    else if (activeView === 'TermsAndConditionPage') updated.termsAndConditionPage = parsed;
                    else if (activeView === 'caseStudyPage') updated.caseStudies = parsed;
                    else if (activeView === 'CareerPage') updated.careers = parsed;
                    else if (activeView === 'redirect') updated.redirect = parsed;
                    else if (activeView === 'sitemap') updated.sitemap = parsed;
                    else if (activeView === 'User') updated.users = parsed;
                    setCmsData(updated);
                  } catch {}
                }}
                className="w-full p-3 font-mono text-xs rounded border border-[#e3e7f0] bg-[#fcfdfe] focus:outline-none focus:border-[#4945ff] leading-relaxed"
              />
            </div>
          )}
        </div>
      </main>

      {/* ========================================================
          4. RIGHT SIDEBAR (Entry Actions & Preview)
          ======================================================== */}
      <aside className="w-[260px] shrink-0 bg-[#ffffff] border-l border-[#e3e7f0] p-4 flex flex-col gap-5 z-20">
        {/* ENTRY Card (Matches screenshot) */}
        <div className="space-y-2.5">
          <div className="text-[10.5px] font-bold text-[#8c9ba5] uppercase tracking-wider">
            ENTRY
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePublish}
              className="flex-1 py-2 px-3 rounded-md bg-[#e3e7f0] hover:bg-[#d8e0ff] hover:text-[#4945ff] text-[#4a5568] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#4945ff]" />
              <span>Publish</span>
            </button>
            <button
              type="button"
              onClick={() => setShowOptionsModal(!showOptionsModal)}
              className="p-2 rounded-md bg-[#e3e7f0] text-[#4a5568] hover:bg-[#d8e0ff] transition-colors"
              title="More entry options"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="w-full py-2 px-3 rounded-md bg-[#e3e7f0] hover:bg-[#4945ff] hover:text-white text-[#4a5568] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>

        {/* PREVIEW Card (Matches screenshot) */}
        <div className="space-y-2.5">
          <div className="text-[10.5px] font-bold text-[#8c9ba5] uppercase tracking-wider">
            PREVIEW
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-md border border-[#e3e7f0] hover:bg-[#f6f8fb] text-[#272b33] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Set up preview</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#8c9ba5]" />
          </a>
        </div>

        {/* DATA BACKUP & RESET */}
        <div className="space-y-2.5 pt-2 border-t border-[#e3e7f0]">
          <div className="text-[10.5px] font-bold text-[#8c9ba5] uppercase tracking-wider">
            BACKUP & SYNC
          </div>
          <button
            type="button"
            onClick={exportCMSData}
            className="w-full py-1.5 px-3 rounded-md border border-[#e3e7f0] hover:bg-[#f6f8fb] text-[#4a5568] text-xs font-medium flex items-center justify-between"
          >
            <span>Export JSON</span>
            <Download className="w-3.5 h-3.5 text-[#8c9ba5]" />
          </button>

          <label className="w-full py-1.5 px-3 rounded-md border border-[#e3e7f0] hover:bg-[#f6f8fb] text-[#4a5568] text-xs font-medium flex items-center justify-between cursor-pointer">
            <span>Import JSON</span>
            <Upload className="w-3.5 h-3.5 text-[#8c9ba5]" />
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleResetDefaults}
            className="w-full py-1.5 px-3 rounded-md hover:bg-red-50 text-red-600 text-xs font-medium flex items-center justify-between transition-colors"
          >
            <span>Reset Defaults</span>
            <RotateCcw className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      </aside>

      {/* Options Dropdown Modal */}
      {showOptionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl border border-[#e3e7f0] w-80 p-5 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#e3e7f0] pb-3">
              <h4 className="text-xs font-bold text-[#272b33]">Entry Options</h4>
              <button
                type="button"
                onClick={() => setShowOptionsModal(false)}
                className="text-[#8c9ba5] hover:text-[#272b33]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  handlePublish();
                  setShowOptionsModal(false);
                }}
                className="w-full text-left p-2 rounded hover:bg-[#f0f3ff] text-[#4945ff] font-medium"
              >
                Publish immediately
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSaveDraft();
                  setShowOptionsModal(false);
                }}
                className="w-full text-left p-2 rounded hover:bg-[#f6f8fb] text-[#4a5568]"
              >
                Save as draft only
              </button>
              <button
                type="button"
                onClick={() => {
                  exportCMSData();
                  setShowOptionsModal(false);
                }}
                className="w-full text-left p-2 rounded hover:bg-[#f6f8fb] text-[#4a5568]"
              >
                Download entry backup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
