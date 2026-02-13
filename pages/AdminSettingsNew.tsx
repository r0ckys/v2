import React, { useState, useRef, useEffect } from 'react';
import { Truck, CreditCard, MessageCircle, Link2, MessageSquare, Coins, Store, User, Camera, RefreshCw, Download, ChevronRight, Lock, Image as ImageIcon, X, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useComingSoon } from '../components/ComingSoonModal';
import { GalleryPicker } from '../components/GalleryPicker';
import toast from 'react-hot-toast';
import { convertFileToWebP, dataUrlToFile } from '../services/imageUtils';
import { uploadPreparedImageToServer } from '../services/imageUploadService';

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
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  formLeft: {
    gridColumn: 'span 2',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  formRow: {
    display: 'contents',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  formLabel: {
    fontFamily: "'Lato', sans-serif",
    fontWeight: 700,
    fontSize: '15px',
    color: '#023337',
    margin: 0,
  },
  formInput: {
    width: '100%',
    height: '48px',
    padding: '12px 16px',
    background: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '15px',
    color: '#111827',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  formRight: {
    gridColumn: 'span 1',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  addressInput: {
    width: '100%',
    height: '100px',
    padding: '12px 16px',
    background: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '15px',
    color: '#111827',
    outline: 'none',
    resize: 'none' as const,
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  changePasswordButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '48px',
    padding: '10px 16px',
    background: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
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

const AdminSettingsNew: React.FC<AdminSettingsNewProps> = ({ onNavigate, currentUser, onUpdateProfile, activeTenant }) => {
  const [activeTab, setActiveTab] = useState<'manage_shop' | 'profile_details'>('manage_shop');
  const { showComingSoon, ComingSoonPopup } = useComingSoon();
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    username: currentUser?.username || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentUser?.avatar || null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  // Sync form with currentUser when it loads/changes
  useEffect(() => {
    if (currentUser && !hasInitialized.current) {
      setProfileForm({
        name: currentUser.name || '',
        username: currentUser.username || '',
        phone: currentUser.phone || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
      });
      setAvatarPreview(currentUser.avatar || null);
      hasInitialized.current = true;
    }
  }, [currentUser]);
  
  // Password change state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const tenantId = activeTenant?.tenantId || activeTenant?.id || '';

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploadingAvatar(true);
    try {
      // Convert to WebP for optimization
      const webpDataUrl = await convertFileToWebP(file, { quality: 0.85, maxDimension: 400 });
      
      // Upload to server
      if (tenantId) {
        const webpFile = dataUrlToFile(webpDataUrl, `profile-${Date.now()}.webp`);
        const uploadedUrl = await uploadPreparedImageToServer(webpFile, tenantId, 'gallery');
        setAvatarPreview(uploadedUrl);
        toast.success('Photo uploaded - save to apply');
      } else {
        // Fallback to base64 if no tenant
        setAvatarPreview(webpDataUrl);
        toast.success('Photo ready - save to apply');
      }
    } catch (error) {
      toast.error('Failed to upload photo');
      console.error('Avatar upload error:', error);
    }
    setIsUploadingAvatar(false);
    if (e.target) e.target.value = '';
  };

  const handleGallerySelect = (imageUrl: string) => {
    setAvatarPreview(imageUrl);
    setIsGalleryOpen(false);
    toast.success('Photo selected - save to apply');
  };

  const handleSaveProfile = async () => {
    if (!profileForm.name.trim()) {
      toast.error('Name is required');
      return;
    }
    if (!profileForm.email.trim()) {
      toast.error('Email is required');
      return;
    }
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: profileForm.name,
          username: profileForm.username,
          phone: profileForm.phone,
          email: profileForm.email,
          address: profileForm.address,
          image: avatarPreview,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      // Also call the legacy handler if exists
      if (onUpdateProfile) {
        await onUpdateProfile({
          ...profileForm,
          avatar: avatarPreview,
        });
      }
      
      toast.success('Profile saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile');
    }
    setIsSaving(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword.length < 9) {
      toast.error('Password must be at least 9 characters');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setIsChangingPassword(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }
      
      toast.success('Password changed successfully!');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setIsPasswordModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    }
    setIsChangingPassword(false);
  };

  const handleResetProfile = () => {
    setProfileForm({
      name: currentUser?.name || '',
      username: currentUser?.username || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      address: currentUser?.address || '',
    });
    setAvatarPreview(currentUser?.avatar || null);
    toast.success('Form reset to original values');
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
    <>
      <style>{`
        .profile-input:focus {
          border-color: #0ea5e9 !important;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15) !important;
        }
        .profile-input::placeholder {
          color: #9ca3af;
        }
        .change-password-btn:hover {
          background: #f3f4f6 !important;
          border-color: #0ea5e9 !important;
        }
        @media (max-width: 900px) {
          .profile-form-container {
            grid-template-columns: 1fr !important;
          }
          .profile-form-left {
            grid-column: span 1 !important;
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
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
                <button onClick={handleResetProfile} style={figmaStyles.resetButton} disabled={isSaving}>
                  <RefreshCw size={24} color="#020202" />
                  <span style={figmaStyles.resetButtonText}>Reset</span>
                </button>
                <button onClick={handleSaveProfile} style={{...figmaStyles.saveButton, opacity: isSaving ? 0.7 : 1}} disabled={isSaving}>
                  <Download size={24} color="white" />
                  <span style={figmaStyles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>

            {/* Avatar Section */}
            <div style={figmaStyles.avatarSection}>
              <div style={{...figmaStyles.avatarContainer, position: 'relative'}}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" style={figmaStyles.avatar} />
                ) : (
                  <div style={{...figmaStyles.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6'}}>
                    <User size={48} color="#9ca3af" />
                  </div>
                )}
                {isUploadingAvatar && (
                  <div style={{position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Loader2 size={24} className="animate-spin text-sky-500" />
                  </div>
                )}
                <div style={{position: 'absolute', bottom: 0, right: 0, display: 'flex', gap: 4}}>
                  <label style={{...figmaStyles.cameraButton, cursor: 'pointer'}}>
                    <Camera size={20} color="#666" />
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <button
                    onClick={() => setIsGalleryOpen(true)}
                    style={{...figmaStyles.cameraButton, border: 'none', cursor: 'pointer'}}
                    title="Select from Gallery"
                  >
                    <ImageIcon size={20} color="#666" />
                  </button>
                </div>
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
            <div style={figmaStyles.formContainer} className="profile-form-container">
              {/* Left Column - 2 columns grid */}
              <div style={figmaStyles.formLeft} className="profile-form-left">
                <div style={figmaStyles.formGroup}>
                  <label style={figmaStyles.formLabel}>Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    placeholder="Enter your name"
                    className="profile-input"
                    style={figmaStyles.formInput}
                  />
                </div>
                <div style={figmaStyles.formGroup}>
                  <label style={figmaStyles.formLabel}>Username</label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                    placeholder="Enter username"
                    className="profile-input"
                    style={figmaStyles.formInput}
                  />
                </div>
                <div style={figmaStyles.formGroup}>
                  <label style={figmaStyles.formLabel}>Phone</label>
                  <input
                    type="text"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="Enter phone number"
                    className="profile-input"
                    style={figmaStyles.formInput}
                  />
                </div>
                <div style={figmaStyles.formGroup}>
                  <label style={figmaStyles.formLabel}>Email</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    placeholder="Enter email address"
                    className="profile-input"
                    style={figmaStyles.formInput}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div style={figmaStyles.formRight}>
                <div style={figmaStyles.formGroup}>
                  <label style={figmaStyles.formLabel}>Address</label>
                  <textarea
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    placeholder="Enter your address"
                    className="profile-input"
                    style={figmaStyles.addressInput}
                  />
                </div>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  style={figmaStyles.changePasswordButton}
                  className="change-password-btn"
                >
                  <div style={figmaStyles.changePasswordLeft}>
                    <Lock size={24} color="#0ea5e9" />
                    <span style={figmaStyles.changePasswordText}>Change Password</span>
                  </div>
                  <ChevronRight size={24} color="#666" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Picker Modal */}
      <GalleryPicker
        isOpen={isGalleryOpen}
        onSelect={handleGallerySelect}
        onClose={() => setIsGalleryOpen(false)}
        multiple={false}
        title="Select Profile Photo"
      />

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16,
          }}
          onClick={() => setIsPasswordModalOpen(false)}
        >
          <div 
            style={{
              background: 'white',
              borderRadius: 16,
              width: '100%',
              maxWidth: 420,
              overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
            }}>
              <h3 style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: 18,
                margin: 0,
              }}>Change Password</h3>
              <button 
                onClick={() => setIsPasswordModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                <X size={24} color="#666" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleChangePassword} style={{ padding: 20 }}>
              <p style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 13,
                color: '#6b7280',
                marginBottom: 16,
              }}>
                Password must be at least 9 characters long.
              </p>

              {/* Old Password */}
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#374151',
                  marginBottom: 6,
                }}>Current Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 14,
                      outline: 'none',
                    }}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 4,
                    }}
                  >
                    {showOldPassword ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div style={{ marginBottom: 16 }}>
                <label style={{
                  display: 'block',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#374151',
                  marginBottom: 6,
                }}>New Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                    minLength={9}
                    style={{
                      width: '100%',
                      padding: '10px 40px 10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: 8,
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: 14,
                      outline: 'none',
                    }}
                    placeholder="Min 9 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 4,
                    }}
                  >
                    {showNewPassword ? <EyeOff size={18} color="#9ca3af" /> : <Eye size={18} color="#9ca3af" />}
                  </button>
                </div>
                {passwordForm.newPassword && passwordForm.newPassword.length < 9 && (
                  <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                    Password must be at least 9 characters ({9 - passwordForm.newPassword.length} more needed)
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#374151',
                  marginBottom: 6,
                }}>Confirm New Password *</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: 8,
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 14,
                    outline: 'none',
                  }}
                  placeholder="Re-enter new password"
                />
                {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
                  <p style={{ color: '#ef4444', fontSize: 12, marginTop: 4 }}>
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isChangingPassword || passwordForm.newPassword.length < 9 || passwordForm.newPassword !== passwordForm.confirmPassword}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  background: isChangingPassword ? '#9ca3af' : '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: isChangingPassword ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Lock size={18} />
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default AdminSettingsNew;
