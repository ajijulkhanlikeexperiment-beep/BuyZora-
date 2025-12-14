import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, MousePointerClick, Eye, MessageCircle, 
  MoreVertical, Play, Pause, AlertCircle, CheckCircle, 
  Globe, Smartphone, Instagram, BarChart2, Lightbulb,
  Megaphone, Zap, Target, AlertTriangle, ArrowRight
} from 'lucide-react';
import { Card, Button, Input } from './UIComponents';
import { Reel, ReelStatus, LinkType, BoostLevel, PromotionStatus } from '../types';

// --- MOCK DATA FOR SELLER ---
const SELLER_REELS: Reel[] = [
  { 
    id: 'r1', 
    thumbnail: 'https://picsum.photos/400/800?random=10', 
    product: { id: 'p1', title: 'Neon Headset', price: 129, image: '', sellerRating: 5, category: 'Tech' }, 
    likes: 1200, comments: 45, views: 15400, outboundClicks: 850, ctr: 5.5, status: 'ACTIVE',
    aiTags: ['Trending', 'High Engagement'],
    promotionStatus: 'ACTIVE',
    boostLevel: 'MEDIUM',
    adViews: 5400,
    adClicks: 320,
    promotionInsights: {
      audienceTags: ['Gamers', 'Tech Enthusiasts', 'Night Owls'],
      predictedReach: '15k - 20k',
      engagementScore: 88,
      bestTime: '8 PM - 11 PM',
      qualityCheckPassed: true
    }
  },
  { 
    id: 'r2', 
    thumbnail: 'https://picsum.photos/400/800?random=11', 
    product: { id: 'p2', title: 'Urban Cargo', price: 54, image: '', sellerRating: 4.5, category: 'Fashion' }, 
    likes: 340, comments: 12, views: 2100, outboundClicks: 45, ctr: 2.1, status: 'REVIEW',
    aiTags: ['Low Reach'],
    promotionStatus: 'NONE',
    promotionInsights: {
      audienceTags: ['Streetwear', 'Urban Fashion'],
      predictedReach: '2k - 5k',
      engagementScore: 65,
      bestTime: '10 AM - 2 PM',
      qualityCheckPassed: false,
      qualityIssues: ['Video resolution low', 'Price not mentioned in audio']
    }
  },
  { 
    id: 'r3', 
    thumbnail: 'https://picsum.photos/400/800?random=12', 
    product: { id: 'p3', title: 'Smart Lamp', price: 89, image: '', sellerRating: 4.8, category: 'Home' }, 
    likes: 8500, comments: 340, views: 98000, outboundClicks: 4200, ctr: 4.2, status: 'ACTIVE',
    aiTags: ['Viral'],
    promotionStatus: 'PAUSED',
    boostLevel: 'HIGH',
    adViews: 45000,
    adClicks: 1800,
    promotionInsights: {
      audienceTags: ['Home Decor', 'Smart Home', 'Design'],
      predictedReach: '50k - 100k',
      engagementScore: 92,
      bestTime: '6 PM - 9 PM',
      qualityCheckPassed: true
    }
  },
];

// --- SUB-COMPONENTS ---

const MetricCard = ({ label, value, trend, icon, color }: any) => (
  <Card className="flex flex-col justify-between h-full border-none shadow-sm relative overflow-hidden group">
    <div className={`absolute right-[-20px] top-[-20px] w-24 h-24 rounded-full opacity-10 ${color}`}></div>
    <div className="flex justify-between items-start mb-2">
      <div className={`p-2 rounded-xl bg-gray-50 dark:bg-white/5 ${color.replace('bg-', 'text-')}`}>
        {icon}
      </div>
      {trend && (
        <span className="text-[10px] font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-full flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" /> {trend}
        </span>
      )}
    </div>
    <div>
      <h3 className="text-2xl font-bold dark:text-white">{value}</h3>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
    </div>
  </Card>
);

const ReelListItem: React.FC<{ reel: Reel, onClick: () => void }> = ({ reel, onClick }) => {
  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    REVIEW: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };

  const adStatusColors: Record<string, string> = {
    ACTIVE: 'border-[#5A4BFF] bg-[#5A4BFF]/5',
    PAUSED: 'border-orange-300 bg-orange-50 dark:bg-orange-900/10',
    NONE: 'border-transparent',
  };

  return (
    <div 
      onClick={onClick}
      className={`flex gap-3 p-3 bg-white dark:bg-[#1E1E24] rounded-2xl border shadow-sm active:scale-[0.99] transition-transform cursor-pointer ${adStatusColors[reel.promotionStatus || 'NONE'] || 'border-gray-100 dark:border-white/5'}`}
    >
      <div className="w-16 h-24 rounded-lg bg-gray-200 overflow-hidden relative flex-shrink-0">
        <img src={reel.thumbnail} className="w-full h-full object-cover" alt="thumb" />
        {reel.promotionStatus === 'ACTIVE' && (
          <div className="absolute top-1 left-1 bg-[#5A4BFF] text-white p-0.5 rounded-full shadow-md">
            <Zap className="w-3 h-3 fill-current" />
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start">
            <h4 className="font-semibold text-sm line-clamp-1 dark:text-white">{reel.product.title}</h4>
            {reel.promotionStatus && reel.promotionStatus !== 'NONE' && (
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#5A4BFF]">
                {reel.promotionStatus} CAMPAIGN
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
             {reel.views ? `${(reel.views / 1000).toFixed(1)}k views` : '0 views'}
             {reel.adViews ? ` • ${(reel.adViews / 1000).toFixed(1)}k promoted` : ''}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-2">
           {reel.promotionStatus !== 'NONE' ? (
             <div className="w-full">
               <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-gray-500">Boost Level</span>
                  <span className="font-bold text-[#5A4BFF]">{reel.boostLevel}</span>
               </div>
               <div className="h-1.5 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-[#5A4BFF] ${
                      reel.boostLevel === 'LOW' ? 'w-1/3' : 
                      reel.boostLevel === 'MEDIUM' ? 'w-2/3' : 'w-full'
                    }`} 
                  />
               </div>
             </div>
           ) : (
             <span className="text-[10px] text-gray-400 italic">Tap to start promotion</span>
           )}
        </div>
      </div>
    </div>
  );
};

const AdControlPanel = ({ reel, onBack }: { reel: Reel, onBack: () => void }) => {
  const [status, setStatus] = useState<PromotionStatus>(reel.promotionStatus || 'NONE');
  const [boost, setBoost] = useState<BoostLevel>(reel.boostLevel || 'LOW');

  const canPromote = reel.promotionInsights?.qualityCheckPassed;

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full">
           <svg className="w-5 h-5 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div>
          <h2 className="text-lg font-bold dark:text-white">Ad Control Center</h2>
          <p className="text-xs text-gray-500">AI-Powered Boosting</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pb-20">
        {/* Preview Card */}
        <div className="bg-white dark:bg-[#1E1E24] p-4 rounded-3xl border border-gray-100 dark:border-white/5 flex gap-4 items-center">
           <img src={reel.thumbnail} className="w-16 h-24 object-cover rounded-xl shadow-sm" alt="thumb" />
           <div className="flex-1">
              <h3 className="font-bold dark:text-white line-clamp-1">{reel.product.title}</h3>
              <div className="flex gap-2 mt-1">
                <span className="text-xs bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                  {reel.views} Views
                </span>
                <span className="text-xs bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded text-blue-600 dark:text-blue-300">
                  {reel.outboundClicks} Clicks
                </span>
              </div>
           </div>
        </div>

        {/* Quality Check Status */}
        <Card className={`${canPromote ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/20' : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20'}`}>
          <div className="flex items-start gap-3">
             <div className={`p-2 rounded-full ${canPromote ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
               {canPromote ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
             </div>
             <div>
                <h4 className={`font-bold text-sm mb-1 ${canPromote ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                  {canPromote ? 'AI Quality Check Passed' : 'Quality Issues Detected'}
                </h4>
                <p className={`text-xs ${canPromote ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {canPromote 
                    ? 'Your reel meets all standards for advertising. You are ready to boost!' 
                    : 'Resolve these issues to start: ' + reel.promotionInsights?.qualityIssues?.join(', ')}
                </p>
             </div>
          </div>
        </Card>

        {canPromote && (
          <>
            {/* Boost Controls */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                 <h4 className="font-bold dark:text-white flex items-center gap-2">
                   <Megaphone className="w-4 h-4 text-[#5A4BFF]" /> Promotion Status
                 </h4>
                 <div className={`px-3 py-1 rounded-full text-xs font-bold ${status === 'ACTIVE' ? 'bg-[#5A4BFF] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {status}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                 <Button 
                    variant={status === 'ACTIVE' ? 'outline' : 'primary'} 
                    onClick={() => setStatus('ACTIVE')}
                    disabled={status === 'ACTIVE'}
                    className="h-12"
                 >
                   <Play className="w-4 h-4" /> Start
                 </Button>
                 <Button 
                    variant={status === 'PAUSED' ? 'outline' : 'ghost'} 
                    onClick={() => setStatus('PAUSED')}
                    disabled={status === 'PAUSED' || status === 'NONE'}
                    className="h-12"
                 >
                   <Pause className="w-4 h-4" /> Pause
                 </Button>
              </div>

              <h4 className="font-bold dark:text-white mb-3 text-sm">Boost Intensity</h4>
              <div className="flex gap-2 bg-gray-50 dark:bg-black/20 p-1 rounded-xl">
                 {(['LOW', 'MEDIUM', 'HIGH'] as BoostLevel[]).map((level) => (
                   <button
                     key={level}
                     onClick={() => setBoost(level)}
                     className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${
                       boost === level 
                         ? 'bg-white dark:bg-[#5A4BFF] shadow-sm text-[#5A4BFF] dark:text-white' 
                         : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                     }`}
                   >
                     {level}
                   </button>
                 ))}
              </div>
              <p className="text-center text-xs text-gray-500 mt-3">
                 Estimated Reach: <span className="font-bold text-[#5A4BFF]">{
                   boost === 'LOW' ? '1k - 5k' : boost === 'MEDIUM' ? '10k - 50k' : '50k - 100k+'
                 } views</span>
              </p>
            </Card>

            {/* AI Insights */}
            <Card className="bg-gradient-to-br from-[#5A4BFF]/5 to-[#33CFFF]/5 border-[#5A4BFF]/10">
               <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-[#5A4BFF] text-white rounded-lg">
                    <Target className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm dark:text-white">AI Audience Targeting</h4>
               </div>
               
               <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                 ByZora AI automatically identifies users interested in <strong>{reel.aiTags?.join(', ')}</strong> and optimizes delivery for max engagement.
               </p>

               <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-xl">
                     <span className="text-xs text-gray-500">Predicted Engagement</span>
                     <span className="text-sm font-bold text-green-500">{reel.promotionInsights?.engagementScore}/100</span>
                  </div>
                  <div className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-xl">
                     <span className="text-xs text-gray-500">Best Delivery Time</span>
                     <span className="text-sm font-bold dark:text-white">{reel.promotionInsights?.bestTime}</span>
                  </div>
               </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

export const SellerPortal = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reels' | 'advertising' | 'settings'>('overview');
  const [selectedReel, setSelectedReel] = useState<Reel | null>(null);
  const [editingAdReel, setEditingAdReel] = useState<Reel | null>(null);
  const [buyLink, setBuyLink] = useState('https://mystore.com');
  const [linkType, setLinkType] = useState<LinkType>('WEBSITE');

  // Logic to render detail views
  if (selectedReel) {
    // Regular Analytics Detail
    return (
      <div className="h-full flex flex-col pt-6 px-4">
         <div className="flex items-center gap-3 mb-4">
           <button onClick={() => setSelectedReel(null)} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full">
             <svg className="w-5 h-5 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
           </button>
           <h2 className="text-lg font-bold dark:text-white">Reel Analytics</h2>
         </div>
         {/* Simplified view reuse or rebuild here, for now just a placeholder to go back */}
         <div className="p-10 text-center text-gray-500">Detailed analytics view...</div>
      </div>
    ); 
  }

  if (editingAdReel) {
    return <AdControlPanel reel={editingAdReel} onBack={() => setEditingAdReel(null)} />;
  }

  return (
    <div className="flex flex-col h-full bg-[#F6F6F9] dark:bg-[#111118] pt-6 px-4 pb-24">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
           <h1 className="text-2xl font-bold dark:text-white">Seller Portal</h1>
           <p className="text-xs text-gray-500">Traffic & Engagement Dashboard</p>
        </div>
        <div className="flex bg-white dark:bg-white/5 p-1 rounded-xl shadow-sm">
           <button onClick={() => setActiveTab('overview')} className={`p-2 rounded-lg transition-all ${activeTab === 'overview' ? 'bg-[#5A4BFF] text-white' : 'text-gray-400'}`}>
             <BarChart2 className="w-5 h-5" />
           </button>
           <button onClick={() => setActiveTab('reels')} className={`p-2 rounded-lg transition-all ${activeTab === 'reels' ? 'bg-[#5A4BFF] text-white' : 'text-gray-400'}`}>
             <Play className="w-5 h-5" />
           </button>
           <button onClick={() => setActiveTab('advertising')} className={`p-2 rounded-lg transition-all ${activeTab === 'advertising' ? 'bg-[#5A4BFF] text-white' : 'text-gray-400'}`}>
             <Megaphone className="w-5 h-5" />
           </button>
           <button onClick={() => setActiveTab('settings')} className={`p-2 rounded-lg transition-all ${activeTab === 'settings' ? 'bg-[#5A4BFF] text-white' : 'text-gray-400'}`}>
             <Globe className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
             {/* Add a promo card for Advertising if not used yet */}
             <div 
               onClick={() => setActiveTab('advertising')}
               className="bg-gradient-to-r from-[#5A4BFF] to-[#33CFFF] p-5 rounded-3xl shadow-lg shadow-[#5A4BFF]/30 text-white relative overflow-hidden cursor-pointer"
             >
                <div className="absolute right-0 top-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-3xl" />
                <div className="relative z-10 flex justify-between items-center">
                   <div>
                     <h3 className="font-bold text-lg mb-1">Boost Your Sales 🚀</h3>
                     <p className="text-xs opacity-90">Use AI to target the right buyers.</p>
                   </div>
                   <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                     <ArrowRight className="w-5 h-5" />
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <MetricCard 
                 label="Total Views" 
                 value="124.5k" 
                 trend="+12%" 
                 icon={<Eye className="w-5 h-5" />} 
                 color="bg-blue-500"
               />
               <MetricCard 
                 label="Buy Clicks" 
                 value="5,230" 
                 trend="+8.5%" 
                 icon={<MousePointerClick className="w-5 h-5" />} 
                 color="bg-[#5A4BFF]"
               />
               <MetricCard 
                 label="Likes" 
                 value="8.2k" 
                 trend="-2%" 
                 icon={<TrendingUp className="w-5 h-5" />} 
                 color="bg-pink-500"
               />
               <MetricCard 
                 label="Comments" 
                 value="450" 
                 icon={<MessageCircle className="w-5 h-5" />} 
                 color="bg-orange-500"
               />
             </div>
          </div>
        )}

        {/* REELS TAB */}
        {activeTab === 'reels' && (
          <div className="space-y-4 animate-fade-in">
             <div className="flex justify-between items-center">
               <h3 className="font-bold dark:text-white">My Reels</h3>
               <select className="bg-white dark:bg-white/5 border-none text-xs p-2 rounded-lg dark:text-white">
                 <option>All Status</option>
                 <option>Active</option>
                 <option>Review</option>
               </select>
             </div>
             {SELLER_REELS.map(reel => (
               <ReelListItem key={reel.id} reel={reel} onClick={() => setSelectedReel(reel)} />
             ))}
          </div>
        )}

        {/* ADVERTISING TAB */}
        {activeTab === 'advertising' && (
          <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-2 gap-4">
               <Card className="bg-[#5A4BFF] text-white border-none">
                  <p className="text-xs opacity-80 mb-1">Promoted Views</p>
                  <h3 className="text-2xl font-bold">50.4k</h3>
                  <div className="flex items-center gap-1 mt-2 text-[10px] bg-white/20 w-fit px-2 py-0.5 rounded-full">
                     <TrendingUp className="w-3 h-3" /> +15%
                  </div>
               </Card>
               <Card>
                  <p className="text-xs text-gray-500 mb-1">Active Campaigns</p>
                  <h3 className="text-2xl font-bold dark:text-white">2</h3>
                  <p className="text-[10px] text-green-500 mt-2">1 Paused</p>
               </Card>
             </div>

             <div>
               <h3 className="font-bold dark:text-white mb-3">Select Reel to Promote</h3>
               <p className="text-xs text-gray-500 mb-4">Choose a reel to boost visibility using AI targeting.</p>
               <div className="space-y-3">
                 {SELLER_REELS.map(reel => (
                   <ReelListItem key={reel.id} reel={reel} onClick={() => setEditingAdReel(reel)} />
                 ))}
               </div>
             </div>
          </div>
        )}

        {/* SETTINGS / LINKS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in">
             <Card>
               <h3 className="font-bold mb-1 dark:text-white">Traffic Destination</h3>
               <p className="text-xs text-gray-500 mb-4">Where should the "Buy Now" button take your customers?</p>

               <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => setLinkType('WEBSITE')}
                    className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${linkType === 'WEBSITE' ? 'border-[#5A4BFF] bg-[#5A4BFF]/5 text-[#5A4BFF]' : 'border-gray-200 dark:border-white/10 dark:text-gray-400'}`}
                  >
                    <Globe className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Website</span>
                  </button>
                  <button 
                    onClick={() => setLinkType('WHATSAPP')}
                    className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${linkType === 'WHATSAPP' ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-200 dark:border-white/10 dark:text-gray-400'}`}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-[10px] font-bold">WhatsApp</span>
                  </button>
                  <button 
                    onClick={() => setLinkType('INSTAGRAM')}
                    className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${linkType === 'INSTAGRAM' ? 'border-pink-500 bg-pink-50 text-pink-600' : 'border-gray-200 dark:border-white/10 dark:text-gray-400'}`}
                  >
                    <Instagram className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Instagram</span>
                  </button>
               </div>

               <Input 
                 label="Destination URL" 
                 value={buyLink} 
                 onChange={(e) => setBuyLink(e.target.value)}
                 placeholder={linkType === 'WHATSAPP' ? 'https://wa.me/1234567890' : 'https://mystore.com'}
               />
               <Button className="mt-4" fullWidth>Update Buy Link</Button>
             </Card>

             <Card>
               <h3 className="font-bold mb-4 dark:text-white">Seller Profile</h3>
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                   <img src="https://picsum.photos/200" alt="logo" className="w-full h-full object-cover" />
                 </div>
                 <Button variant="outline" className="py-2 px-4 h-auto text-xs">Change Logo</Button>
               </div>
               <Input label="Business Name" defaultValue="Neon Tech Store" className="mb-4" />
               <Input label="Support Email" defaultValue="help@neontech.com" />
             </Card>
          </div>
        )}

      </div>
    </div>
  );
};