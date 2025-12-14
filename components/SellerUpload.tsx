import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Upload, X, CheckCircle, Smartphone, 
  Sparkles, AlertCircle, FileVideo, HardDrive, 
  Tag, DollarSign, AlignLeft, Layers, ArrowRight
} from 'lucide-react';
import { Button, Input, Card } from './UIComponents';
import * as GeminiService from '../services/geminiService';

const CATEGORIES = ['Fashion', 'Electronics', 'Home', 'Beauty', 'Fitness', 'Toys', 'Art'];

export const SellerUpload = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Metadata State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('Fashion');

  // UI State
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationReason, setOptimizationReason] = useState('');
  const [publishState, setPublishState] = useState<'IDLE' | 'PUBLISHING' | 'SUCCESS'>('IDLE');

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleAIOptimize = async () => {
    if (!title) return;
    setIsOptimizing(true);
    const result = await GeminiService.optimizeReelMetadata(title, description, category);
    
    if (result) {
      setTitle(result.optimizedTitle);
      setDescription(result.optimizedDescription);
      setTags(result.suggestedTags);
      setOptimizationReason(result.reasoning);
    }
    setIsOptimizing(false);
  };

  const handlePublish = async () => {
    setPublishState('PUBLISHING');
    
    // Simulate network delay for metadata sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("--- PUBLISHING REEL ---");
    console.log("VIDEO: Kept Local/Client-side");
    console.log("METADATA: Sent to DB", { title, price, category, tags });
    
    setPublishState('SUCCESS');
  };

  const resetForm = () => {
    setPublishState('IDLE');
    setVideoFile(null);
    setPreviewUrl(null);
    setTitle('');
    setDescription('');
    setPrice('');
    setTags([]);
    setOptimizationReason('');
  };

  // --- Success View ---
  if (publishState === 'SUCCESS') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-[#111118]"
      >
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center relative z-10">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold dark:text-white mb-3">You're Live!</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Reel metadata synced to ByZora servers.<br/>
          Video is streaming from <span className="text-[#5A4BFF] font-medium">optimized local storage</span>.
        </p>
        
        <div className="w-full space-y-3">
          <Button fullWidth onClick={resetForm}>Upload Another Reel</Button>
          <Button variant="ghost" fullWidth>View Analytics</Button>
        </div>
      </motion.div>
    );
  }

  // --- Main Upload View ---
  return (
    <div className="pb-32 pt-6 px-4 space-y-6 h-full overflow-y-auto no-scrollbar relative">
      
      {/* Header */}
      <div className="flex justify-between items-center sticky top-0 bg-[#F6F6F9] dark:bg-[#111118] z-20 py-2">
         <div>
           <h2 className="text-2xl font-bold dark:text-white">New Reel</h2>
           <p className="text-xs text-gray-500">Share your product story</p>
         </div>
         {/* Storage Badge */}
         <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-white/5 rounded-full border border-gray-200 dark:border-white/10 shadow-sm">
            <div className="relative">
              <HardDrive className="w-3 h-3 text-green-500" />
              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full border border-white dark:border-[#111118]"></span>
            </div>
            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">Local Storage</span>
         </div>
      </div>

      {/* 1. Video Picker - 9:16 Aspect Ratio Enforced */}
      <div className="relative mx-auto max-w-[280px]">
        <input 
          type="file" 
          accept="video/*" 
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />
        
        <AnimatePresence mode="wait">
          {!previewUrl ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-[9/16] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-[#5A4BFF] transition-all group shadow-inner"
            >
              <div className="w-20 h-20 bg-white dark:bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-[#5A4BFF]" />
              </div>
              <p className="font-bold text-gray-700 dark:text-white text-lg">Select Video</p>
              <p className="text-xs text-gray-400 mt-2 text-center px-6">9:16 Vertical • 60s Max<br/>Stored on device</p>
            </motion.div>
          ) : (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="relative w-full aspect-[9/16] bg-black rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white dark:border-[#1E1E24]"
            >
              <video 
                src={previewUrl} 
                className="w-full h-full object-cover" 
                controls={false}
                autoPlay
                muted
                loop
                playsInline
              />
              
              {/* Overlay Controls */}
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={handleRemoveVideo}
                  className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-red-500/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl flex items-center gap-3 border border-white/10">
                 <div className="p-2 bg-green-500/20 rounded-full">
                   <Smartphone className="w-4 h-4 text-green-400" />
                 </div>
                 <div>
                   <p className="text-[10px] font-bold text-white uppercase tracking-wider">Local Asset</p>
                   <p className="text-[10px] text-gray-300">Optimized for streaming</p>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Metadata Form */}
      <div className="space-y-6 animate-fade-in delay-100">
        
        {/* AI Header */}
        <div className="flex items-center justify-between">
           <div>
             <h3 className="font-bold dark:text-white flex items-center gap-2">
               <Layers className="w-4 h-4 text-[#5A4BFF]" /> Reel Details
             </h3>
           </div>
           <button 
             onClick={handleAIOptimize}
             disabled={isOptimizing || !title}
             className="text-xs font-bold text-white bg-gradient-to-r from-[#5A4BFF] to-[#33CFFF] px-3 py-1.5 rounded-full flex items-center gap-1.5 disabled:opacity-50 shadow-lg shadow-[#5A4BFF]/20 active:scale-95 transition-transform"
           >
             {isOptimizing ? (
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                 <Sparkles className="w-3 h-3" />
               </motion.div>
             ) : <Sparkles className="w-3 h-3" />}
             {isOptimizing ? 'Analyzing...' : 'AI Auto-Fill'}
           </button>
        </div>

        {optimizationReason && (
           <motion.div 
             initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
             className="p-3 bg-gradient-to-r from-[#5A4BFF]/10 to-transparent border-l-4 border-[#5A4BFF] rounded-r-xl"
           >
             <p className="text-xs text-[#5A4BFF] font-medium leading-relaxed">
               <span className="font-bold">✨ AI Insight:</span> {optimizationReason}
             </p>
           </motion.div>
        )}

        <div className="space-y-4">
          <Input 
            label="Title" 
            placeholder="e.g. Vintage Denim Jacket" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            icon={<AlignLeft className="w-4 h-4" />}
          />

          {/* Category Pills */}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-1 mb-2 block">Category</label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-fade">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    category === cat 
                      ? 'bg-[#111118] dark:bg-white text-white dark:text-black shadow-lg' 
                      : 'bg-white dark:bg-[#1E1E24] text-gray-500 border border-gray-100 dark:border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <Input 
            label="Price ($)" 
            type="number" 
            placeholder="0.00" 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            icon={<DollarSign className="w-4 h-4" />}
          />

          <div className="relative">
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-1 mb-2 block">Description</label>
            <textarea 
              className="w-full bg-white dark:bg-[#1E1E24] border border-gray-100 dark:border-white/10 rounded-2xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A4BFF] focus:outline-none h-32 resize-none shadow-sm text-sm leading-relaxed"
              placeholder="Tell a story about your product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-1 mb-2 block">Tags</label>
            <div className="flex flex-wrap gap-2 mb-3">
               {tags.map((tag, i) => (
                 <span key={i} className="px-2 py-1 bg-[#5A4BFF]/5 border border-[#5A4BFF]/20 rounded-lg text-xs font-medium text-[#5A4BFF] flex items-center gap-1">
                   #{tag}
                   <button onClick={() => setTags(tags.filter((_, idx) => idx !== i))} className="hover:text-red-500">&times;</button>
                 </span>
               ))}
            </div>
            <Input 
               placeholder="Add tag and press Enter" 
               icon={<Tag className="w-4 h-4" />}
               onKeyDown={(e) => {
                 if (e.key === 'Enter') {
                   const val = e.currentTarget.value.trim();
                   if (val) {
                     setTags([...tags, val]);
                     e.currentTarget.value = '';
                   }
                 }
               }}
            />
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl flex gap-3">
           <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
           <p className="text-xs text-gray-500 leading-relaxed">
             <strong>No Payment Processing:</strong> ByZora is a discovery tool. Users will be redirected to your external link to purchase.
           </p>
        </div>

        <Button 
          fullWidth 
          onClick={handlePublish}
          disabled={!videoFile || !title || !price || publishState === 'PUBLISHING'}
          className="h-14 text-base relative overflow-hidden"
        >
          {publishState === 'PUBLISHING' ? (
             <div className="flex items-center gap-2">
               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
               <span>Syncing Metadata...</span>
             </div>
          ) : (
             <div className="flex items-center gap-2">
               <span>Publish Reel</span>
               <ArrowRight className="w-5 h-5" />
             </div>
          )}
        </Button>
      </div>
    </div>
  );
};
