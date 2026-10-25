import { useState, useEffect } from 'react';
import AuthSectionOne from '@/components/ui/auth-section-1';
import StrapiAdminDashboard from '@/components/admin/StrapiAdminDashboard';
import { getStoredAdminToken, getStoredAdminUser, clearStoredAdminSession } from '@/lib/api';
import { SEO } from '@/components/SEO';

export default function AdminPage() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user has an active session
    const existingToken = getStoredAdminToken();
    const existingUser = getStoredAdminUser();

    if (existingToken) {
      setToken(existingToken);
      setUser(existingUser || { username: 'admin', role: 'Administrator' });
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (newToken: string, newUser: { username: string; role: string }) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    clearStoredAdminSession();
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-[#05080e]">
        <div className="w-8 h-8 rounded-full border-2 border-[#0b192c] dark:border-white border-t-transparent animate-spin" />
      </div>
    );
  }

  if (token && user) {
    return (
      <>
        <SEO
          title="Axia Kairos Admin Console"
          description="Confidential enterprise management and inquiry portal."
          ogImage="/l.webp"
        />
        <StrapiAdminDashboard token={token} user={user} onLogout={handleLogout} />
      </>
    );
  }

  return (
    <>
      <SEO
        title="Axia Kairos Admin Console | Authentication"
        description="Confidential enterprise management and inquiry portal."
        ogImage="/l.webp"
      />
      <AuthSectionOne onSuccess={handleLoginSuccess} />
    </>
  );
}
