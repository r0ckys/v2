import React, { useState } from 'react';
import { Truck, CreditCard, MessageCircle, Link2, MessageSquare, Coins, Store, User, Camera, RefreshCw, Download, ChevronRight, Lock } from 'lucide-react';
import { useComingSoon } from '../components/ComingSoonModal';

interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

// Settings card matching Figma design
const SettingsCard: React.FC<SettingsCardProps> = ({ title, description, icon, onClick }) => (
  <button 
    onClick={onClick} 
    style={{
      background: '#ffffff',
      height: '127px',
      borderRadius: '8px',
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      transition: 'box-shadow 0.2s, transform 0.2s',
    }}
    className="hover:shadow-md active:scale-[0.98]"
  >
    {/* Icon container with orange gradient background */}
    <div 
      style={{
        position: 'absolute',
        right: '19px',
        top: '19px',
        width: '89px',
        height: '89px',
        borderRadius: '8px',
        background: 'linear-gradient(to right, rgba(255,156,27,0.04), rgba(255,106,1,0.04))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </div>
    
    {/* Title */}
    <p 
      style={{
        position: 'absolute',
        left: '19px',
        top: '25px',
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 600,
        fontSize: '16px',
        color: 'black',
        margin: 0,
      }}
    >
      {title}
    </p>
    
    {/* Description */}
    <p 
      style={{
        position: 'absolute',
        left: '19px',
        top: '57px',
        width: '220px',
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 400,
        fontSize: '10px',
        color: 'black',
        lineHeight: 'normal',
        margin: 0,
      }}
    >
      {description}
    </p>
  </button>
);

// SVG Icons matching Figma orange gradient style
const DeliveryIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M32 16H36.68C37.52 16 38.28 16.44 38.68 17.14L42.26 23.14C42.74 23.94 43 24.86 43 25.8V32C43 34.21 41.21 36 39 36H37" 
      stroke="url(#truck_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 28H32" stroke="url(#truck_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M32 36H16" stroke="url(#truck_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 40C13.2091 40 15 38.2091 15 36C15 33.7909 13.2091 32 11 32C8.79086 32 7 33.7909 7 36C7 38.2091 8.79086 40 11 40Z" 
      stroke="url(#truck_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M37 40C39.2091 40 41 38.2091 41 36C41 33.7909 39.2091 32 37 32C34.7909 32 33 33.7909 33 36C33 38.2091 34.7909 40 37 40Z" 
      stroke="url(#truck_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M32 12V32H7C5.34 32 4 30.66 4 29V16C4 13.79 5.79 12 8 12H32Z" 
      stroke="url(#truck_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M32 16V28H44" stroke="url(#truck_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="truck_gradient" x1="4" y1="12" x2="44" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ff9c1b"/>
        <stop offset="1" stopColor="#ff6a01"/>
      </linearGradient>
    </defs>
  </svg>
);

const PaymentIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 17H34" stroke="url(#pay_gradient)" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 33H16" stroke="url(#pay_gradient)" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 33H30" stroke="url(#pay_gradient)" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M44 24.68V33.02C44 39.4 41.4 42 35.02 42H12.98C6.6 42 4 39.4 4 33.02V14.98C4 8.6 6.6 6 12.98 6H25.02" 
      stroke="url(#pay_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M38 18C41.3137 18 44 15.3137 44 12C44 8.68629 41.3137 6 38 6C34.6863 6 32 8.68629 32 12C32 15.3137 34.6863 18 38 18Z" 
      stroke="url(#pay_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M38 9V15" stroke="url(#pay_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M35 12H41" stroke="url(#pay_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="pay_gradient" x1="4" y1="6" x2="44" y2="42" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ff9c1b"/>
        <stop offset="1" stopColor="#ff6a01"/>
      </linearGradient>
    </defs>
  </svg>
);

const MarketingIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" 
      stroke="url(#market_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 18V26" stroke="url(#market_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 22H28" stroke="url(#market_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 32C17 32 19.5 29 24 29C28.5 29 31 32 31 32" 
      stroke="url(#market_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="market_gradient" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ff9c1b"/>
        <stop offset="1" stopColor="#ff6a01"/>
      </linearGradient>
    </defs>
  </svg>
);

const DomainIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.84 27.16L27.16 20.84" stroke="url(#domain_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M33.66 21.66L38.14 17.18C40.87 14.45 40.87 10.03 38.14 7.30002C35.41 4.57002 30.99 4.57002 28.26 7.30002L23.78 11.78" 
      stroke="url(#domain_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14.34 26.34L9.86 30.82C7.13 33.55 7.13 37.97 9.86 40.7C12.59 43.43 17.01 43.43 19.74 40.7L24.22 36.22" 
      stroke="url(#domain_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="domain_gradient" x1="7" y1="4" x2="41" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ff9c1b"/>
        <stop offset="1" stopColor="#ff6a01"/>
      </linearGradient>
    </defs>
  </svg>
);

const SMSIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M38 14H10C7.79 14 6 15.79 6 18V36C6 38.21 7.79 40 10 40H14V46L22 40H38C40.21 40 42 38.21 42 36V18C42 15.79 40.21 14 38 14Z" 
      stroke="url(#sms_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 26H32" stroke="url(#sms_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 32H26" stroke="url(#sms_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M34 6H14C11.79 6 10 7.79 10 10V14H38V10C38 7.79 36.21 6 34 6Z" 
      stroke="url(#sms_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="sms_gradient" x1="6" y1="6" x2="42" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ff9c1b"/>
        <stop offset="1" stopColor="#ff6a01"/>
      </linearGradient>
    </defs>
  </svg>
);

const RewardIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" 
      stroke="url(#reward_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 32C28.4183 32 32 28.4183 32 24C32 19.5817 28.4183 16 24 16C19.5817 16 16 19.5817 16 24C16 28.4183 19.5817 32 24 32Z" 
      stroke="url(#reward_gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="reward_gradient" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ff9c1b"/>
        <stop offset="1" stopColor="#ff6a01"/>
      </linearGradient>
    </defs>
  </svg>
);

interface AdminSettingsNewProps {
  onNavigate: (page: string) => void;
  courierConfig?: any;
  onUpdateCourierConfig?: (config: any) => void;
  activeTenant?: any;
  logo?: string | null;
  onUpdateLogo?: (logo: string | null) => void;
  users?: any[];
  roles?: any[];
  onAddUser?: (user: any) => Promise<void>;
  onUpdateUser?: (userId: string, updates: any) => Promise<void>;
  onDeleteUser?: (userId: string) => Promise<void>;
  onAddRole?: (role: any) => Promise<void>;
  onUpdateRole?: (roleId: string, updates: any) => Promise<void>;
  onDeleteRole?: (roleId: string) => Promise<void>;
  onUpdateUserRole?: (userEmail: string, roleId: string) => Promise<void>;
  userPermissions?: Record<string, string[]>;
  onUpgrade?: () => void;
  currentUser?: {
    name?: string;
    email?: string;
    phone?: string;
    username?: string;
    address?: string;
    avatar?: string;
    role?: string;
    createdAt?: string;
  };
  onUpdateProfile?: (updates: any) => Promise<void>;
}

// Figma Design Styles
const figmaStyles = {
  container: {
    background: '#f9f9f9',
    minHeight: '100vh',
    padding: '0',
    fontFamily: "'Poppins', sans-serif",
  },
  headerCard: {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  title: {
    fontFamily: "'Lato', sans-serif",
    fontWeight: 700,
    fontSize: '22px',
    color: '#023337',
    letterSpacing: '0.11px',
    margin: 0,
  },
  tabsContainer: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  tab: {
    display: 'flex',
    gap: '4px',
    height: '48px',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 22px',
    background: 'white',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: 'none',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '16px',
  },
  tabActive: {
    borderBottom: '2px solid #38bdf8',
  },
  tabTextActive: {
    background: 'linear-gradient(to right, #38bdf8, #1e90ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 500,
  },
  tabTextInactive: {
    color: 'black',
    fontWeight: 400,
  },
  profileCard: {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '27px 19px',
    minHeight: '473px',
  },
  profileHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '42px',
  },
  profileTitle: {
    fontFamily: "'Lato', sans-serif",
    fontWeight: 700,
    fontSize: '22px',
    color: '#023337',
    letterSpacing: '0.11px',
    margin: 0,
  },
  buttonGroup: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  resetButton: {
    display: 'flex',
    gap: '4px',
    height: '48px',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 16px 6px 12px',
    background: '#f9f9f9',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  resetButtonText: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: '16px',
    color: '#020202',
    letterSpacing: '-0.32px',
  },
  saveButton: {
    display: 'flex',
    gap: '4px',
    height: '48px',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 16px 6px 12px',
    background: 'linear-gradient(to right, #38bdf8, #1e90ff)',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  saveButtonText: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: '16px',
    color: 'white',
    letterSpacing: '-0.32px',
  },
  avatarSection: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    marginBottom: '30px',
  },
  avatarContainer: {
    position: 'relative' as const,
    width: '160px',
    height: '160px',
  },
  avatar: {
    width: '160px',
    height: '160px',
    borderRadius: '482px',
    background: '#f4f4f4',
    objectFit: 'cover' as const,
  },
  cameraButton: {
    position: 'absolute' as const,
    top: '4px',
    right: '-3px',
    width: '30px',
    height: '30px',
    borderRadius: '37px',
    background: '#f9f9f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1px',
  },
  userName: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    fontSize: '24px',
    color: 'black',
    margin: 0,
  },
  userRole: {
    display: 'flex',
    gap: '9px',
    alignItems: 'center',
  },
  roleText: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 400,
    fontSize: '16px',
    color: 'black',
  },
  sinceBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1px 8px',
    border: '1px solid #ff6a00',
    borderRadius: '24px',
    background: 'white',
  },
  sinceBadgeText: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: '12px',
    background: 'linear-gradient(to bottom, #ff6a00, #ff9f1c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  formContainer: {
    display: 'flex',
    gap: '16px',
  },
  formLeft: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  formRow: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  formLabel: {
    fontFamily: "'Lato', sans-serif",
    fontWeight: 700,
    fontSize: '15px',
    color: '#023337',
    margin: 0,
  },
  formInput: {
    width: '271px',
    height: '48px',
    padding: '10px 12px',
    background: '#f9f9f9',
    borderRadius: '8px',
    border: 'none',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '16px',
    color: 'black',
    outline: 'none',
  },
  formRight: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  addressInput: {
    width: '100%',
    height: '79px',
    padding: '12px',
    background: '#f9f9f9',
    borderRadius: '8px',
    border: 'none',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '16px',
    color: 'black',
    outline: 'none',
    resize: 'none' as const,
  },
  changePasswordButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '48px',
    padding: '10px 12px',
    background: '#f9f9f9',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
  },
  changePasswordLeft: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  changePasswordText: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 400,
    fontSize: '16px',
    color: 'black',
  },
};

const AdminSettingsNew: React.FC<AdminSettingsNewProps> = ({ onNavigate, currentUser, onUpdateProfile }) => {
  const [activeTab, setActiveTab] = useState<'manage_shop' | 'profile_details'>('manage_shop');
  const { showComingSoon, ComingSoonPopup } = useComingSoon();
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || 'Imam Hoshen Ornob',
    username: currentUser?.username || 'ornob423',
    phone: currentUser?.phone || '+88 017XX XXXXXX',
    email: currentUser?.email || 'ornob423@gmail.com',
    address: currentUser?.address || 'Plot No. 23, Sector 7, Uttara Dhaka – 1230 BANGLADESH',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentUser?.avatar || null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (onUpdateProfile) {
      await onUpdateProfile({
        ...profileForm,
        avatar: avatarPreview,
      });
    }
  };

  const handleResetProfile = () => {
    setProfileForm({
      name: currentUser?.name || 'Imam Hoshen Ornob',
      username: currentUser?.username || 'ornob423',
      phone: currentUser?.phone || '+88 017XX XXXXXX',
      email: currentUser?.email || 'ornob423@gmail.com',
      address: currentUser?.address || 'Plot No. 23, Sector 7, Uttara Dhaka – 1230 BANGLADESH',
    });
    setAvatarPreview(currentUser?.avatar || null);
  };

  const formatSinceDate = () => {
    if (currentUser?.createdAt) {
      const date = new Date(currentUser.createdAt);
      return `Since ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    return 'Since 5 Jan 2020';
  };
  const settingsCards = [
    {
      title: 'Delivery Charge',
      description: "Manage your shop's delivery settings to ensure smooth and efficient order fulfillment.",
      icon: <DeliveryIcon />,
      navigateTo: 'settings_delivery',
    },
    {
      title: 'Payment Gateway',
      description: 'Integrate and manage payment options to provide customers with secure and flexible transaction methods.',
      icon: <PaymentIcon />,
      navigateTo: 'settings_payment',
    },
    {
      title: 'Marketing Integrations',
      description: "Enhance your shop's visibility by Google Tag Manager, Facebook Pixel, TikTok Pixel, and SEO tools for better engagement.",
      icon: <MarketingIcon />,
      navigateTo: 'coming_soon', // Special flag for coming soon
      isComingSoon: true,
    },
    {
      title: 'Shop Domain',
      description: "Manage your shop's core configurations, including domain setup and general settings.",
      icon: <DomainIcon />,
      navigateTo: 'settings_domain',
    },
    {
      title: 'SMS Support',
      description: 'Enable SMS notifications and support to keep your customers informed with real-time updates.',
      icon: <SMSIcon />,
      isComingSoon: true,
      navigateTo: 'sms_marketing',
    },
    {
      title: 'Reward Point',
      description: 'Enable SMS notifications and support to keep your customers informed with real-time updates.',
      icon: <RewardIcon />,
      isComingSoon: true,
      navigateTo: 'settings_rewards',
    },
  ];

  return (
    <div style={figmaStyles.container}>
      {/* Header Card with Tabs */}
      <div style={figmaStyles.headerCard}>
        <h1 style={figmaStyles.title}>Settings</h1>
        
        {/* Tabs */}
        <div style={figmaStyles.tabsContainer}>
          <button
            onClick={() => setActiveTab('manage_shop')}
            style={{
              ...figmaStyles.tab,
              ...(activeTab === 'manage_shop' ? figmaStyles.tabActive : {}),
            }}
          >
            <Store size={24} color={activeTab === 'manage_shop' ? '#38bdf8' : 'black'} />
            <span style={activeTab === 'manage_shop' ? figmaStyles.tabTextActive : figmaStyles.tabTextInactive}>
              Manage Shop
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('profile_details')}
            style={{
              ...figmaStyles.tab,
              ...(activeTab === 'profile_details' ? figmaStyles.tabActive : {}),
            }}
          >
            <User size={24} color={activeTab === 'profile_details' ? '#38bdf8' : 'black'} />
            <span style={activeTab === 'profile_details' ? figmaStyles.tabTextActive : figmaStyles.tabTextInactive}>
              Profile Details
            </span>
          </button>
        </div>
      </div>

      {/* Manage Shop Tab Content */}
      {activeTab === 'manage_shop' && (
        <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '0 20px' }}>
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}
          >
            {settingsCards.map((card, index) => (
              <SettingsCard
                key={index}
                title={card.title}
                description={card.description}
                icon={card.icon}
                onClick={() => {
                  if (card.isComingSoon) {
                    showComingSoon(card.title);
                  } else {
                    onNavigate(card.navigateTo);
                  }
                }}
              />
            ))}
            {ComingSoonPopup}
          </div>
        </div>
      )}

      {/* Profile Details Tab Content */}
      {activeTab === 'profile_details' && (
        <div style={{ maxWidth: '1150px', margin: '0 auto', padding: '0 20px' }}>
          <div style={figmaStyles.profileCard}>
            {/* Profile Header */}
            <div style={figmaStyles.profileHeader}>
              <h2 style={figmaStyles.profileTitle}>Profile Details</h2>
              <div style={figmaStyles.buttonGroup}>
                <button onClick={handleResetProfile} style={figmaStyles.resetButton}>
                  <RefreshCw size={24} color="#020202" />
                  <span style={figmaStyles.resetButtonText}>Reset</span>
                </button>
                <button onClick={handleSaveProfile} style={figmaStyles.saveButton}>
                  <Download size={24} color="white" />
                  <span style={figmaStyles.saveButtonText}>Save Changes</span>
                </button>
              </div>
            </div>

            {/* Avatar Section */}
            <div style={figmaStyles.avatarSection}>
              <div style={figmaStyles.avatarContainer}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" style={figmaStyles.avatar} />
                ) : (
                  <div style={figmaStyles.avatar} />
                )}
                <label style={figmaStyles.cameraButton}>
                  <Camera size={24} color="#666" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>
              <div style={figmaStyles.userInfo}>
                <p style={figmaStyles.userName}>{profileForm.name}</p>
                <div style={figmaStyles.userRole}>
                  <span style={figmaStyles.roleText}>{currentUser?.role || 'Owner'}</span>
                  <div style={figmaStyles.sinceBadge}>
                    <span style={figmaStyles.sinceBadgeText}>{formatSinceDate()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div style={figmaStyles.formContainer}>
              {/* Left Column */}
              <div style={figmaStyles.formLeft}>
                <div style={figmaStyles.formRow}>
                  <div style={figmaStyles.formGroup}>
                    <label style={figmaStyles.formLabel}>Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      style={figmaStyles.formInput}
                    />
                  </div>
                  <div style={figmaStyles.formGroup}>
                    <label style={figmaStyles.formLabel}>Username</label>
                    <input
                      type="text"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                      style={figmaStyles.formInput}
                    />
                  </div>
                </div>
                <div style={figmaStyles.formRow}>
                  <div style={figmaStyles.formGroup}>
                    <label style={figmaStyles.formLabel}>Phone</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      style={figmaStyles.formInput}
                    />
                  </div>
                  <div style={figmaStyles.formGroup}>
                    <label style={figmaStyles.formLabel}>Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      style={figmaStyles.formInput}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div style={figmaStyles.formRight}>
                <div style={figmaStyles.formGroup}>
                  <label style={figmaStyles.formLabel}>Address</label>
                  <textarea
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    style={figmaStyles.addressInput}
                  />
                </div>
                <button
                  onClick={() => onNavigate('change_password')}
                  style={figmaStyles.changePasswordButton}
                >
                  <div style={figmaStyles.changePasswordLeft}>
                    <Lock size={24} color="#666" />
                    <span style={figmaStyles.changePasswordText}>Change Password</span>
                  </div>
                  <ChevronRight size={24} color="#666" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettingsNew;
