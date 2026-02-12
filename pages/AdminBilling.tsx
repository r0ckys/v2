import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Calendar,
  CheckCircle,
  Clock,
  Package,
  Receipt,
  TrendingUp,
  AlertCircle,
  Crown,
  Zap,
  Shield,
  ArrowUpRight,
  Download,
  RefreshCw,
  Check,
} from 'lucide-react';
import { Tenant } from '../types';

// Figma-based inline styles
const figmaStyles = {
  container: {
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    position: 'relative' as const,
    padding: '20px',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
    maxWidth: '1146px',
    margin: '0 auto',
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    overflow: 'hidden',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: "'Lato', sans-serif",
    fontWeight: 700,
    fontSize: '22px',
    color: '#023337',
    letterSpacing: '0.11px',
    margin: 0,
  },
  tabContainer: {
    backgroundColor: 'rgba(235, 239, 240, 0.36)',
    borderRadius: '100px',
    padding: '4px',
    display: 'flex',
    gap: '8px',
  },
  tabActive: {
    backgroundColor: '#1d2127',
    borderRadius: '100px',
    padding: '10px',
    width: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    border: 'none',
  },
  tabActiveText: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: '16px',
    color: '#ffffff',
    letterSpacing: '0.32px',
  },
  tabInactive: {
    backgroundColor: 'transparent',
    borderRadius: '100px',
    padding: '10px',
    width: '150px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    cursor: 'pointer',
    border: 'none',
  },
  tabInactiveText: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    fontSize: '16px',
    color: '#1d2127',
    letterSpacing: '0.32px',
  },
  tabDiscount: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 400,
    fontSize: '12px',
    color: '#1d2127',
    letterSpacing: '0.24px',
  },
  plansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '24px',
    marginTop: '24px',
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    minHeight: '338px',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    padding: '30px 19px',
  },
  planTitle: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: '24px',
    color: '#2f2f2f',
    margin: 0,
  },
  planSubtitle: {
    fontFamily: "'Questrial', 'Poppins', sans-serif",
    fontWeight: 400,
    fontSize: '14px',
    color: '#2f2f2f',
    margin: '4px 0 0 0',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  oldPrice: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: '24px',
    color: '#afafaf',
    textDecoration: 'line-through',
    position: 'relative' as const,
  },
  currentPrice: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 700,
    fontSize: '32px',
    color: '#2f2f2f',
  },
  priceMonth: {
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    fontSize: '14px',
    color: '#2f2f2f',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginTop: '24px',
  },
  featureColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
  },
  featureIcon: {
    width: '24px',
    height: '24px',
    flexShrink: 0,
  },
  featureText: {
    fontFamily: "'Questrial', 'Poppins', sans-serif",
    fontWeight: 400,
    fontSize: '16px',
    color: '#454452',
    marginTop: '4px',
  },
  featureSubText: {
    fontFamily: "'Questrial', 'Poppins', sans-serif",
    fontWeight: 400,
    fontSize: '12px',
    color: '#454452',
  },
  subscribeButton: {
    width: '233px',
    height: '40px',
    borderRadius: '69px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 700,
    fontSize: '14px',
  },
  subscribeButtonOutline: {
    border: '1.5px solid',
    backgroundColor: 'transparent',
  },
  subscribeButtonFilled: {
    border: 'none',
    color: '#ffffff',
  },
  adsSection: {
    background: 'linear-gradient(180deg, #ff6a00 0%, #ff9f1c 100%)',
    borderRadius: '8px',
    height: '348px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  adsText: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: '60px',
    color: '#ffffff',
    letterSpacing: '1.2px',
  },
  adsDots: {
    position: 'absolute' as const,
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  dotActive: {
    backgroundColor: '#1e90ff',
  },
  dotInactive: {
    backgroundColor: '#ffffff',
    opacity: 0.5,
  },
  requestCard: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '20px',
    overflow: 'hidden',
  },
  requestTitle: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: '22px',
    color: '#000000',
    margin: 0,
  },
  formRow: {
    display: 'flex',
    gap: '16px',
    marginTop: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  formLabel: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: '16px',
    color: '#000000',
  },
  formInput: {
    backgroundColor: '#f9f9f9',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '10px 12px',
    height: '48px',
    fontFamily: "'Lato', sans-serif",
    fontSize: '15px',
    color: '#909090',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '24px',
  },
  checkboxGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  checkboxItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  checkbox: {
    width: '26px',
    height: '26px',
    border: '2px solid #777',
    borderRadius: '4px',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    fontSize: '15px',
    color: '#777',
  },
  requestButton: {
    backgroundColor: '#00cdba',
    borderRadius: '4px',
    height: '40px',
    width: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'PingFang SC', sans-serif",
    fontWeight: 500,
    fontSize: '16px',
    color: '#ffffff',
  },
};

// Plan data matching Figma design
const PLANS = [
  {
    id: 'startup',
    name: 'Startup',
    subtitle: 'Hands-free hosting & updates.',
    oldPrice: 500,
    price: 300,
    buttonColor: '#008c09',
    buttonStyle: 'outline' as const,
    features: [
      ['Free Sub-Domain & Hosting', 'User Friendly Dashboard', 'Unlimited Product Upload', 'Live Chat Support', 'Next.js Performance', 'Initial Load Time 0.2 sec'],
      ['SSL & Security', 'Mobile First Approach', 'Customizable Theme'],
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    subtitle: 'Hands-free hosting & updates.',
    oldPrice: 1000,
    price: 600,
    buttonColor: '#1e90ff',
    buttonStyle: 'outline' as const,
    features: [
      ['Free Sub-Domain & Hosting', 'User Friendly Dashboard', 'Unlimited Product Upload', 'Live Chat Support', 'Next.js Performance', 'Initial Load Time 0.2 sec'],
      ['SSL & Security', 'Mobile First Approach', 'Customizable Theme', 'Business Report'],
    ],
  },
  {
    id: 'advanced',
    name: 'Advanced',
    subtitle: 'Hands-free hosting & updates.',
    oldPrice: 1500,
    price: 900,
    buttonColor: '#f17800',
    buttonStyle: 'outline' as const,
    features: [
      ['Free Sub-Domain & Hosting', 'User Friendly Dashboard', 'Unlimited Product Upload', 'Live Chat Support', 'Next.js Performance', 'Initial Load Time 0.2 sec'],
      ['SSL & Security', 'Mobile First Approach', 'Customizable Theme', 'Business Report', 'Theme Customization Request'],
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    subtitle: 'Hands-free hosting & updates.',
    oldPrice: 2000,
    price: 1200,
    buttonColor: '#3855f8',
    buttonStyle: 'filled' as const,
    features: [
      ['Free Sub-Domain & Hosting', 'User Friendly Dashboard', 'Unlimited Product Upload', 'Live Chat Support', 'Next.js Performance', 'Initial Load Time 0.2 sec'],
      ['SSL & Security', 'Mobile First Approach', 'Customizable Theme', 'Business Report', 'Full Frontend Customization'],
    ],
  },
];

interface AdminBillingProps {
  tenant?: Tenant | null;
  onUpgrade?: () => void;
}

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  invoiceUrl?: string;
}

const PLAN_FEATURES: Record<string, { name: string; price: number; features: string[]; color: string; icon: React.ReactNode }> = {
  starter: {
    name: 'Starter',
    price: 0,
    features: ['Up to 50 products', 'Basic analytics', 'Email support', '1 Admin user'],
    color: 'from-gray-500 to-gray-600',
    icon: <Package size={24} />
  },
  growth: {
    name: 'Growth',
    price: 999,
    features: ['Up to 500 products', 'Advanced analytics', 'Priority support', '5 Admin users', 'Custom domain'],
    color: 'from-blue-500 to-cyan-500',
    icon: <TrendingUp size={24} />
  },
  enterprise: {
    name: 'Enterprise',
    price: 2999,
    features: ['Unlimited products', 'Full analytics suite', '24/7 support', 'Unlimited users', 'Multiple domains', 'API access'],
    color: 'from-purple-500 to-pink-500',
    icon: <Crown size={24} />
  }
};

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  trialing: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  suspended: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  pending: { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' }
};

const AdminBilling: React.FC<AdminBillingProps> = ({ tenant, onUpgrade }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [platforms, setPlatforms] = useState({ android: false, ios: false });
  const [priority, setPriority] = useState<string>('');
  const [appTitle, setAppTitle] = useState('');
  const [appDescription, setAppDescription] = useState('');

  // Calculate price based on billing cycle
  const getPrice = (monthlyPrice: number) => {
    if (billingCycle === 'yearly') {
      return Math.round(monthlyPrice * 12 * 0.8); // 20% off for yearly
    }
    return monthlyPrice;
  };

  const getOldPrice = (oldPrice: number) => {
    if (billingCycle === 'yearly') {
      return oldPrice * 12;
    }
    return oldPrice;
  };

  // Check icon component
  const CheckIcon = ({ color = '#008c09' }: { color?: string }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
      <path d="M8 12l3 3 5-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div style={figmaStyles.container}>
      <div style={figmaStyles.mainContent}>
        {/* Header Card with Plans */}
        <div style={figmaStyles.headerCard}>
          <div style={figmaStyles.headerRow}>
            <h1 style={figmaStyles.title}>Billing & Subscription</h1>
            
            {/* Monthly/Yearly Toggle */}
            <div style={figmaStyles.tabContainer}>
              <button
                style={billingCycle === 'monthly' ? figmaStyles.tabActive : figmaStyles.tabInactive}
                onClick={() => setBillingCycle('monthly')}
              >
                <span style={billingCycle === 'monthly' ? figmaStyles.tabActiveText : figmaStyles.tabInactiveText}>
                  Monthly
                </span>
              </button>
              <button
                style={billingCycle === 'yearly' ? figmaStyles.tabActive : figmaStyles.tabInactive}
                onClick={() => setBillingCycle('yearly')}
              >
                <span style={billingCycle === 'yearly' ? figmaStyles.tabActiveText : figmaStyles.tabInactiveText}>
                  Yearly
                </span>
                {billingCycle !== 'yearly' && (
                  <span style={figmaStyles.tabDiscount}>-20% off</span>
                )}
              </button>
            </div>
          </div>

          {/* Pricing Plans Grid */}
          <div style={figmaStyles.plansGrid}>
            {PLANS.map((plan) => (
              <div key={plan.id} style={figmaStyles.planCard}>
                {/* Plan Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={figmaStyles.planTitle}>{plan.name}</h2>
                    <p style={figmaStyles.planSubtitle}>{plan.subtitle}</p>
                  </div>
                  
                  {/* Price */}
                  <div style={figmaStyles.priceContainer}>
                    <span style={figmaStyles.oldPrice}>
                      ৳{getOldPrice(plan.oldPrice)}
                    </span>
                    <span>
                      <span style={figmaStyles.currentPrice}>৳{getPrice(plan.price)}</span>
                      <span style={figmaStyles.priceMonth}>/{billingCycle === 'yearly' ? 'Year' : 'Month'}</span>
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div style={figmaStyles.featuresGrid}>
                  {plan.features.map((column, colIdx) => (
                    <div key={colIdx} style={figmaStyles.featureColumn}>
                      {column.map((feature, idx) => (
                        <div key={idx} style={figmaStyles.featureItem}>
                          <CheckIcon color={plan.buttonColor} />
                          <div>
                            <span style={figmaStyles.featureText}>
                              {feature === 'Initial Load Time 0.2 sec' ? (
                                <>
                                  Initial Load Time 0.2 sec
                                  <br />
                                  <span style={figmaStyles.featureSubText}>(no reload time)</span>
                                </>
                              ) : feature}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Subscribe Button */}
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingTop: '24px' }}>
                  <button
                    style={{
                      ...figmaStyles.subscribeButton,
                      ...(plan.buttonStyle === 'outline' 
                        ? { ...figmaStyles.subscribeButtonOutline, borderColor: plan.buttonColor, color: plan.buttonColor }
                        : { ...figmaStyles.subscribeButtonFilled, backgroundColor: plan.buttonColor }
                      ),
                    }}
                    onClick={onUpgrade}
                  >
                    SUBSCRIBE NOW
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ads Section */}
        <div style={figmaStyles.adsSection}>
          <span style={figmaStyles.adsText}>Ads Section</span>
          <div style={figmaStyles.adsDots}>
            <div style={{ ...figmaStyles.dot, ...figmaStyles.dotActive }} />
            <div style={{ ...figmaStyles.dot, ...figmaStyles.dotInactive }} />
            <div style={{ ...figmaStyles.dot, ...figmaStyles.dotInactive }} />
            <div style={{ ...figmaStyles.dot, ...figmaStyles.dotInactive }} />
            <div style={{ ...figmaStyles.dot, ...figmaStyles.dotInactive }} />
          </div>
        </div>

        {/* Request a New App */}
        <div style={figmaStyles.requestCard}>
          <h2 style={figmaStyles.requestTitle}>Request a New App</h2>
          
          <div style={figmaStyles.formRow}>
            {/* App Title */}
            <div style={{ ...figmaStyles.formGroup, flex: '0 0 364px' }}>
              <label style={figmaStyles.formLabel}>App Title:</label>
              <input
                type="text"
                placeholder="Ex E-commerce Delivery App"
                value={appTitle}
                onChange={(e) => setAppTitle(e.target.value)}
                style={figmaStyles.formInput}
              />
            </div>

            {/* Brief Description */}
            <div style={{ ...figmaStyles.formGroup, flex: 1 }}>
              <label style={figmaStyles.formLabel}>Brief Description:</label>
              <input
                type="text"
                placeholder="Ex E-commerce Delivery App"
                value={appDescription}
                onChange={(e) => setAppDescription(e.target.value)}
                style={figmaStyles.formInput}
              />
            </div>
          </div>

          <div style={{ ...figmaStyles.formRow, justifyContent: 'space-between', alignItems: 'center' }}>
            {/* Platform */}
            <div style={figmaStyles.checkboxRow}>
              <span style={figmaStyles.formLabel}>Platform:</span>
              <div style={figmaStyles.checkboxGroup}>
                <div 
                  style={figmaStyles.checkboxItem}
                  onClick={() => setPlatforms({ ...platforms, android: !platforms.android })}
                >
                  <div style={{
                    ...figmaStyles.checkbox,
                    backgroundColor: platforms.android ? '#00cdba' : 'transparent',
                    borderColor: platforms.android ? '#00cdba' : '#777',
                  }}>
                    {platforms.android && <Check size={16} color="#fff" />}
                  </div>
                  <span style={figmaStyles.checkboxLabel}>Android</span>
                </div>
                <div 
                  style={figmaStyles.checkboxItem}
                  onClick={() => setPlatforms({ ...platforms, ios: !platforms.ios })}
                >
                  <div style={{
                    ...figmaStyles.checkbox,
                    backgroundColor: platforms.ios ? '#00cdba' : 'transparent',
                    borderColor: platforms.ios ? '#00cdba' : '#777',
                  }}>
                    {platforms.ios && <Check size={16} color="#fff" />}
                  </div>
                  <span style={figmaStyles.checkboxLabel}>iOS</span>
                </div>
              </div>
            </div>

            {/* Priority */}
            <div style={figmaStyles.checkboxRow}>
              <span style={figmaStyles.formLabel}>Priority:</span>
              <div style={figmaStyles.checkboxGroup}>
                {['Low', 'Standard', 'High (ASAP)'].map((p) => (
                  <div 
                    key={p}
                    style={figmaStyles.checkboxItem}
                    onClick={() => setPriority(p)}
                  >
                    <div style={{
                      ...figmaStyles.checkbox,
                      backgroundColor: priority === p ? '#00cdba' : 'transparent',
                      borderColor: priority === p ? '#00cdba' : '#777',
                    }}>
                      {priority === p && <Check size={16} color="#fff" />}
                    </div>
                    <span style={figmaStyles.checkboxLabel}>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Button */}
            <button style={figmaStyles.requestButton}>
              Request App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBilling;
