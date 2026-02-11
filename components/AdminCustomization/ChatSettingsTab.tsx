import React from 'react';
import { WebsiteConfig } from './types';

interface ChatSettingsTabProps {
  websiteConfiguration: WebsiteConfig;
  setWebsiteConfiguration: React.Dispatch<React.SetStateAction<WebsiteConfig>>;
}

export const ChatSettingsTab: React.FC<ChatSettingsTabProps> = ({
  websiteConfiguration,
  setWebsiteConfiguration
}) => {
  return (
    <div className="space-y-4 sm:space-y-6 max-w-2xl mx-auto">
      <div>
        <h3 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2">Chat Settings</h3>
        <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6">Configure live chat for your store</p>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg sm:rounded-xl bg-gray-50">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm sm:text-base">Enable Live Chat</p>
          <p className="text-xs sm:text-sm text-gray-500">Allow customers to chat with you</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
          <input 
            type="checkbox" 
            checked={websiteConfiguration.chatEnabled ?? false} 
            onChange={e => setWebsiteConfiguration(p => ({ ...p, chatEnabled: e.target.checked }))} 
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      </div>
      
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Welcome Message</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-green-500" 
          placeholder="Hi! How can we help?" 
          value={websiteConfiguration.chatGreeting || ''} 
          onChange={e => setWebsiteConfiguration(p => ({ ...p, chatGreeting: e.target.value }))} 
        />
        <p className="text-xs text-gray-500 mt-1">Appears when chat opens</p>
      </div>
      
      <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Offline Message</label>
        <input 
          type="text" 
          className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-green-500" 
          placeholder="We're offline. Leave a message!" 
          value={websiteConfiguration.chatOfflineMessage || ''} 
          onChange={e => setWebsiteConfiguration(p => ({ ...p, chatOfflineMessage: e.target.value }))} 
        />
      </div>
      
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Support Hours From</label>
          <input 
            type="time" 
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-green-500" 
            value={websiteConfiguration.chatSupportHours?.from || '09:00'} 
            onChange={e => setWebsiteConfiguration(p => ({ ...p, chatSupportHours: { ...(p.chatSupportHours || {}), from: e.target.value } }))} 
          />
        </div>
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Support Hours To</label>
          <input 
            type="time" 
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-green-500" 
            value={websiteConfiguration.chatSupportHours?.to || '18:00'} 
            onChange={e => setWebsiteConfiguration(p => ({ ...p, chatSupportHours: { ...(p.chatSupportHours || {}), to: e.target.value } }))} 
          />
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg sm:rounded-xl bg-gray-50">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 text-sm sm:text-base">WhatsApp Fallback</p>
          <p className="text-xs sm:text-sm text-gray-500">Redirect to WhatsApp when chat disabled</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
          <input 
            type="checkbox" 
            checked={websiteConfiguration.chatWhatsAppFallback ?? false} 
            onChange={e => setWebsiteConfiguration(p => ({ ...p, chatWhatsAppFallback: e.target.checked }))} 
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
        </label>
      </div>
    </div>
  );
};

export default ChatSettingsTab;
