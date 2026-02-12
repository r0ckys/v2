import React, { useState, useCallback, useRef } from 'react';
import { ArrowLeft, ChevronRight, Upload, X, Check, Info } from 'lucide-react';
import { RichTextEditor } from '../components/RichTextEditor';

// Payment provider logos
const PROVIDER_LOGOS = {
  bkash: 'https://www.logo.wine/a/logo/BKash/BKash-Icon-Logo.wine.svg',
  nagad: 'https://nagad.com.bd/wp-content/uploads/2022/02/nagad-logo.png',
  rocket: 'https://rocketsalesagent.com/assets/img/logo/logo.png',
  upay: 'https://www.upaybd.com/assets/images/logo.png',
  tap: 'https://www.tapbd.com/assets/images/tap-logo.png',
  aamarpay: 'https://aamarpay.com/images/aamarpay-logo.png',
};

const MFS_PROVIDERS = [
  { id: 'bkash', name: 'bKash', logo: PROVIDER_LOGOS.bkash },
  { id: 'nagad', name: 'Nagad', logo: PROVIDER_LOGOS.nagad },
  { id: 'rocket', name: 'Rocket', logo: PROVIDER_LOGOS.rocket },
  { id: 'upay', name: 'UPay', logo: PROVIDER_LOGOS.upay },
  { id: 'tap', name: 'Tap', logo: PROVIDER_LOGOS.tap },
];

const MFS_TYPES = [
  { value: 'merchant', label: 'Merchant' },
  { value: 'send_money', label: 'Send Money' },
  { value: 'personal', label: 'Personal' },
];

const ADVANCE_PAYMENT_OPTIONS = [
  { id: 'full', label: 'Full Payment' },
  { id: 'delivery_charge', label: 'Delivery Charge Only' },
  { id: 'percentage', label: 'Percentage' },
  { id: 'fixed', label: 'Fixed Amount' },
];

interface PaymentGatewaySettings {
  cashOnDelivery: boolean;
  aamarPay: {
    enabled: boolean;
    storeId?: string;
    signatureKey?: string;
  };
  bkash: {
    enabled: boolean;
    appKey?: string;
    secretKey?: string;
    username?: string;
    password?: string;
  };
  selfMfs: {
    enabled: boolean;
    selectedProviders: string[];
    phoneNumber?: string;
    mfsType: string;
    paymentInstruction?: string;
    qrCodeUrl?: string;
  };
  advancePayment: {
    enabled: boolean;
    type: string;
    percentage?: number;
    fixedAmount?: number;
  };
  paymentProcessMessage?: string;
}

interface AdminPaymentSettingsNewProps {
  onBack: () => void;
  tenantId?: string;
  onSave?: (settings: PaymentGatewaySettings) => void;
}

// Toggle Switch Component
const ToggleSwitch: React.FC<{ enabled: boolean; onChange: (v: boolean) => void }> = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex h-5 w-[38px] items-center rounded-full transition-colors ${
      enabled ? 'bg-[#1e90ff]' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
        enabled ? 'translate-x-5' : 'translate-x-0.5'
      }`}
    />
  </button>
);

// Payment Card Component
const PaymentCard: React.FC<{
  title?: string;
  subtitle: string;
  logo?: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children?: React.ReactNode;
}> = ({ title, subtitle, logo, enabled, onToggle, children }) => (
  <div className="bg-white rounded-lg shadow-[0_2px_6px_rgba(0,0,0,0.03)] px-3 py-2">
    <div className="flex items-center justify-between py-2 pr-2">
      <div className="flex flex-col gap-0.5 w-[553px]">
        {logo ? (
          <img src={logo} alt={title} className="h-7 w-auto object-contain max-w-[120px]" />
        ) : (
          <h4 className="text-lg font-bold text-black tracking-tight">{title}</h4>
        )}
        <p className="text-xs text-[#6f6f6f]">{subtitle}</p>
      </div>
      <ToggleSwitch enabled={enabled} onChange={onToggle} />
    </div>
    {enabled && children && <div className="mt-2">{children}</div>}
  </div>
);

const AdminPaymentSettingsNew: React.FC<AdminPaymentSettingsNewProps> = ({ 
  onBack, 
  tenantId,
  onSave 
}) => {
  // State for all payment settings
  const [settings, setSettings] = useState<PaymentGatewaySettings>({
    cashOnDelivery: true,
    aamarPay: { enabled: false },
    bkash: { enabled: true },
    selfMfs: {
      enabled: true,
      selectedProviders: ['bkash', 'nagad', 'rocket', 'upay', 'tap'],
      phoneNumber: '',
      mfsType: 'merchant',
      paymentInstruction: '',
      qrCodeUrl: '',
    },
    advancePayment: {
      enabled: true,
      type: 'percentage',
      percentage: 0,
    },
    paymentProcessMessage: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateSettings = useCallback(<K extends keyof PaymentGatewaySettings>(
    key: K, 
    value: PaymentGatewaySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateNestedSettings = useCallback(<K extends keyof PaymentGatewaySettings>(
    key: K,
    field: string,
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] as any),
        [field]: value,
      },
    }));
  }, []);

  const toggleMfsProvider = useCallback((providerId: string) => {
    setSettings(prev => ({
      ...prev,
      selfMfs: {
        ...prev.selfMfs,
        selectedProviders: prev.selfMfs.selectedProviders.includes(providerId)
          ? prev.selfMfs.selectedProviders.filter(id => id !== providerId)
          : [...prev.selfMfs.selectedProviders, providerId],
      },
    }));
  }, []);

  const handleQrCodeUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        updateNestedSettings('selfMfs', 'qrCodeUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [updateNestedSettings]);

  const handleSave = useCallback(() => {
    onSave?.(settings);
  }, [settings, onSave]);

  return (
    <div className="w-full max-w-[1146px] mx-auto">
      {/* Main Content Card */}
      <div className="bg-white rounded-lg px-[18px] py-6">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center gap-3.5 h-[42px]">
            <button 
              onClick={onBack}
              className="flex items-center justify-center rotate-180"
            >
              <ChevronRight size={13} className="text-gray-600" />
            </button>
            <div className="flex flex-col gap-1">
              <h2 className="text-xl font-medium text-black font-['Lato']">Payment Gateway</h2>
              <p className="text-xs text-[#a2a2a2] font-['Lato']">Enable and configure your preferred delivery services</p>
            </div>
          </div>

          {/* Payment Options */}
          <div className="flex flex-col gap-4">
            {/* Cash On Delivery */}
            <PaymentCard
              title="Cash On Delivery"
              subtitle="Accept cash payments on delivery"
              enabled={settings.cashOnDelivery}
              onToggle={(v) => updateSettings('cashOnDelivery', v)}
            />

            {/* AamarPay */}
            <PaymentCard
              logo={PROVIDER_LOGOS.aamarpay}
              subtitle="Configure AamarPay credentials"
              enabled={settings.aamarPay.enabled}
              onToggle={(v) => updateNestedSettings('aamarPay', 'enabled', v)}
            />

            {/* bKash Merchant */}
            <PaymentCard
              logo={PROVIDER_LOGOS.bkash}
              subtitle="Configure bKash merchant credentials"
              enabled={settings.bkash.enabled}
              onToggle={(v) => updateNestedSettings('bkash', 'enabled', v)}
            >
              <div className="flex flex-col gap-5 w-full">
                <p className="text-xs text-[#6f6f6f] w-full">
                  Please provide your bKash credentials to integrate bKash merchant
                </p>
                <div className="flex flex-col gap-3">
                  {/* Row 1: App Key, Secret Key */}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Marchant App Key"
                      className="bg-[#f9f9f9] rounded-lg h-10 px-3 text-sm text-[#a2a2a2] w-[429px] focus:outline-none focus:ring-1 focus:ring-[#1e90ff]"
                      value={settings.bkash.appKey || ''}
                      onChange={(e) => updateNestedSettings('bkash', 'appKey', e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Marchant Secret Key"
                      className="bg-[#f9f9f9] rounded-lg h-10 px-3 text-sm text-[#a2a2a2] flex-1 focus:outline-none focus:ring-1 focus:ring-[#1e90ff]"
                      value={settings.bkash.secretKey || ''}
                      onChange={(e) => updateNestedSettings('bkash', 'secretKey', e.target.value)}
                    />
                  </div>
                  {/* Row 2: Username, Password, Save */}
                  <div className="flex gap-3 items-start">
                    <input
                      type="text"
                      placeholder="Marchant Username"
                      className="bg-[#f9f9f9] rounded-lg h-10 px-3 text-sm text-[#a2a2a2] w-[429px] focus:outline-none focus:ring-1 focus:ring-[#1e90ff]"
                      value={settings.bkash.username || ''}
                      onChange={(e) => updateNestedSettings('bkash', 'username', e.target.value)}
                    />
                    <input
                      type="password"
                      placeholder="Marchant Password"
                      className="bg-[#f9f9f9] rounded-lg h-10 px-3 text-sm text-[#a2a2a2] flex-1 focus:outline-none focus:ring-1 focus:ring-[#1e90ff]"
                      value={settings.bkash.password || ''}
                      onChange={(e) => updateNestedSettings('bkash', 'password', e.target.value)}
                    />
                    <button className="bg-[#1e90ff] border border-[#1e90ff] rounded-lg px-4 py-2 h-10 w-[120px] flex items-center justify-center">
                      <span className="text-white text-sm font-semibold font-['Lato']">Save</span>
                    </button>
                  </div>
                </div>
              </div>
            </PaymentCard>

            {/* Self MFS */}
            <div className="bg-white rounded-lg shadow-[0_2px_6px_rgba(0,0,0,0.03)] px-3 py-6">
              {/* Self MFS Header */}
              <div className="flex items-center justify-between pr-2 py-4">
                <div className="flex flex-col gap-0.5 w-[553px]">
                  <h4 className="text-lg font-bold text-black tracking-tight">Manual Payment (Self MFS)</h4>
                  <p className="text-xs text-[#6f6f6f]">Merchant API না থাকলে এখানে manual payment instruction দিন - এটি checkout এ customer দেখবে</p>
                </div>
                <ToggleSwitch 
                  enabled={settings.selfMfs.enabled} 
                  onChange={(v) => updateNestedSettings('selfMfs', 'enabled', v)} 
                />
              </div>

              {settings.selfMfs.enabled && (
                <>
                  {/* Provider Selection & Phone Number */}
                  <div className="flex items-center justify-between w-full mb-4">
                    {/* Provider Pills */}
                    <div className="flex gap-3 items-center">
                      {MFS_PROVIDERS.map((provider) => {
                        const isSelected = settings.selfMfs.selectedProviders.includes(provider.id);
                        return (
                          <button
                            key={provider.id}
                            type="button"
                            onClick={() => toggleMfsProvider(provider.id)}
                            className={`flex gap-1 h-10 items-center justify-center px-2 py-1 rounded-lg border ${
                              isSelected ? 'border-[#1e90ff]' : 'border-gray-300'
                            } bg-white`}
                          >
                            {isSelected && <Check size={18} className="text-[#1e90ff]" />}
                            <img src={provider.logo} alt={provider.name} className="h-7 w-auto object-contain" />
                          </button>
                        );
                      })}
                    </div>

                    {/* Phone Number */}
                    <div className="flex gap-3 items-center text-sm font-['Lato']">
                      <span className="text-black">Phone Number</span>
                      <div className="bg-[#f9f9f9] rounded-lg h-[39px] w-[273px] px-[19px] flex items-center">
                        <span className="text-black">+88</span>
                        <input
                          type="text"
                          placeholder="01XX XXXXXXX"
                          className="bg-transparent ml-2 text-[#a2a2a2] flex-1 focus:outline-none"
                          value={settings.selfMfs.phoneNumber || ''}
                          onChange={(e) => updateNestedSettings('selfMfs', 'phoneNumber', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* MFS Type, Payment Instruction, QR Code */}
                  <div className="flex gap-4">
                    {/* Left Column: MFS Type & Payment Instruction */}
                    <div className="flex-1 flex flex-col gap-4">
                      {/* MFS Type */}
                      <div className="flex flex-col gap-2">
                        <label className="text-base font-medium text-black font-['Lato']">Select MFS type</label>
                        <div className="bg-[#f9f9f9] rounded-lg flex items-center justify-between px-3 py-1">
                          <select
                            className="bg-transparent text-sm text-black font-['Lato'] flex-1 focus:outline-none cursor-pointer appearance-none"
                            value={settings.selfMfs.mfsType}
                            onChange={(e) => updateNestedSettings('selfMfs', 'mfsType', e.target.value)}
                          >
                            {MFS_TYPES.map((type) => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                          <ChevronRight size={24} className="text-gray-500 rotate-90" />
                        </div>
                      </div>

                      {/* Payment Instruction */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <label className="text-base font-medium text-black font-['Lato']">Payment Instruction</label>
                          <div className="group relative">
                            <Info size={14} className="text-gray-400 cursor-help" />
                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg z-10">
                              এই instruction টি checkout page এ customer কে দেখানো হবে যখন তারা bKash/Nagad/Rocket select করবে। Image সহ সুন্দর করে লিখুন।
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#f9f9f9] rounded-lg overflow-hidden">
                          <p className="text-xs text-[#6f6f6f] px-3 py-2 border-b border-gray-200 bg-blue-50">
                            💡 এখানে image সহ manual payment instruction লিখুন। Customer checkout করার সময় এটি দেখবে।
                          </p>
                          <RichTextEditor
                            value={settings.selfMfs.paymentInstruction || ''}
                            onChange={(val) => updateNestedSettings('selfMfs', 'paymentInstruction', val)}
                            placeholder="যেমন: ১. এই নম্বরে Send Money করুন: 01XXXXXXXXX। ২. Transaction ID নোট করুন। ৩. Checkout এ TxnID দিন।"
                            minHeight="min-h-[200px]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column: QR Code Upload */}
                    <div className="w-[330px] h-[330px] border border-dashed border-[#d7d7d7] rounded-lg bg-white flex items-center justify-center">
                      {settings.selfMfs.qrCodeUrl ? (
                        <div className="relative">
                          <img 
                            src={settings.selfMfs.qrCodeUrl} 
                            alt="QR Code" 
                            className="max-w-full max-h-[280px] object-contain" 
                          />
                          <button
                            onClick={() => updateNestedSettings('selfMfs', 'qrCodeUrl', '')}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3">
                          <p className="text-base font-medium text-black font-['Lato']">Add QR Code</p>
                          <div className="w-[105px] h-[105px] bg-gray-100 rounded-lg flex items-center justify-center">
                            <Upload size={40} className="text-gray-400" />
                          </div>
                          <div className="flex flex-col items-center gap-1 text-[#a2a2a2]">
                            <p className="text-sm font-['Lato']">Drag and drop image here, or click add image.</p>
                            <p className="text-[10px] text-center w-[264px] font-['Lato']">
                              Supported formats: JPG, PNG, Max size: 4MB.<br />
                              Note: Use images with a 1:1 aspect ratio (150×150 pixels.)
                            </p>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleQrCodeUpload}
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-[#ff9f1c] rounded-lg px-4 py-2 text-white text-sm font-semibold font-['Lato']"
                          >
                            Add Image
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Advance Payment & Payment Process Message */}
      <div className="flex gap-5 mt-5">
        {/* Advance Payment */}
        <div className="bg-white rounded-lg w-[563px] h-[276px] relative overflow-hidden">
          {/* Header */}
          <div className="absolute top-[19px] left-1/2 -translate-x-1/2 w-[525px] bg-white rounded-lg shadow-[0_2px_6px_rgba(0,0,0,0.03)] px-3 py-2 h-[74px] flex items-center justify-between">
            <div className="flex flex-col gap-0.5 w-[553px]">
              <h4 className="text-xl font-medium text-black font-['Lato']">Advance payment</h4>
              <p className="text-xs text-[#6f6f6f] font-['Lato']">Select how much amount you want to get advance from customer.</p>
            </div>
            <ToggleSwitch 
              enabled={settings.advancePayment.enabled} 
              onChange={(v) => updateNestedSettings('advancePayment', 'enabled', v)} 
            />
          </div>

          {/* Options */}
          {settings.advancePayment.enabled && (
            <>
              {ADVANCE_PAYMENT_OPTIONS.map((option, index) => (
                <div 
                  key={option.id}
                  className="absolute flex gap-3 items-center left-[19px]"
                  style={{ top: 112 + index * 28 + (index >= 2 ? 4 : 0) + (index >= 3 ? 44 : 0) }}
                >
                  <input
                    type="radio"
                    id={option.id}
                    name="advancePaymentType"
                    checked={settings.advancePayment.type === option.id}
                    onChange={() => updateNestedSettings('advancePayment', 'type', option.id)}
                    className="w-3.5 h-3.5 border border-black rounded accent-[#1e90ff]"
                  />
                  <label htmlFor={option.id} className="text-sm text-black font-['Lato']">{option.label}</label>
                </div>
              ))}
              
              {/* Percentage Input */}
              {settings.advancePayment.type === 'percentage' && (
                <div className="absolute left-[45px] top-[189px]">
                  <input
                    type="number"
                    className="bg-[#f9f9f9] rounded-lg h-[39px] w-[138px] px-[19px] text-sm text-black font-['Lato'] focus:outline-none"
                    value={settings.advancePayment.percentage || 0}
                    onChange={(e) => updateNestedSettings('advancePayment', 'percentage', Number(e.target.value))}
                  />
                </div>
              )}

              {/* Fixed Amount Input */}
              {settings.advancePayment.type === 'fixed' && (
                <div className="absolute left-[45px] top-[189px]">
                  <input
                    type="number"
                    className="bg-[#f9f9f9] rounded-lg h-[39px] w-[138px] px-[19px] text-sm text-black font-['Lato'] focus:outline-none"
                    value={settings.advancePayment.fixedAmount || 0}
                    onChange={(e) => updateNestedSettings('advancePayment', 'fixedAmount', Number(e.target.value))}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Payment Process Message Note */}
        <div className="bg-white rounded-lg w-[563px] h-[276px] relative overflow-hidden">
          <p className="absolute left-[31px] top-[36px] text-xl font-medium text-black font-['Lato']">
            Payment process message note
          </p>
          <textarea
            placeholder="Add a custom message for your customers about the payment process..."
            className="absolute left-[30px] top-[75px] bg-[#f9f9f9] rounded-lg w-[515px] h-[165px] px-[19px] py-[11px] text-sm text-[#a2a2a2] font-['Lato'] focus:outline-none resize-none"
            value={settings.paymentProcessMessage || ''}
            onChange={(e) => updateSettings('paymentProcessMessage', e.target.value)}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end w-full mt-5">
        <button 
          onClick={handleSave}
          className="bg-[#1e90ff] border border-[#1e90ff] rounded-lg px-4 py-2"
        >
          <span className="text-white text-sm font-medium font-['Lato']">Update delivery Charges</span>
        </button>
      </div>
    </div>
  );
};

export default AdminPaymentSettingsNew;
