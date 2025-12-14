import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MessageCircle, Share2, MoreHorizontal, 
  Volume2, VolumeX, ShoppingBag, ExternalLink, 
  CheckCircle, ShieldCheck, Sparkles, ArrowLeft,
  Play, Pause, Bookmark
} from 'lucide-react';
import { Reel } from '../types';
import { Button } from './UIComponents';

interface ReelsViewProps {
  reels: Reel[];
  initialReelIndex?: number;
  onBack: () => void;
}

interface ReelItemProps {
  reel: Reel;
  isActive: boolean;
  isMuted: boolean;
  toggleMute: () => void;
}

const ReelItem: React.FC<ReelItemProps> = ({ 
  reel, 
  isActive, 
  isMuted, 
  toggleMute 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showHeart, setShowHeart] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Autoplay policy might block unmuted playback
        console.log("Autoplay blocked");
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDoubleTap = () => {
    setIsLiked(true);
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  return (
    <div className="relative w-full h-full flex-shrink-0 snap-start overflow-hidden bg-black">
      {/* Video Layer */}
      <div 
        className="absolute inset-0 z-0"
        onClick={togglePlay}
        onDoubleClick={handleDoubleTap}
      >
        {reel.videoUrl ? (
          <video
            ref={videoRef}
            src={reel.videoUrl}
            className="w-full h-full object-cover"
            loop
            playsInline
            muted={isMuted}
            poster={reel.thumbnail}
          />
        ) : (
          <img src={reel.thumbnail} className="w-full h-full object-cover" alt="reel" />
        )}
        
        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 pointer-events-none">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>
        )}
      </div>

      {/* Double Tap Heart Animation */}
      <AnimatePresence>
        {showHeart && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          >
            <Heart className="w-32 h-32 text-red-500 fill-red-500 drop-shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-start z-30 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-2">
           {/* AI Badge */}
           {reel.aiTags && reel.aiTags.length > 0 && (
             <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
               <Sparkles className="w-3 h-3 text-[#33CFFF]" />
               <span className="text-[10px] font-bold text-white uppercase tracking-wide">{reel.aiTags[0]}</span>
             </div>
           )}
        </div>
        <button onClick={toggleMute} className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white">
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Right Action Bar */}
      <div className="absolute bottom-24 right-4 flex flex-col gap-6 z-30 items-center">
        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className="p-3 bg-black/20 backdrop-blur-md rounded-full active:scale-90 transition-transform"
          >
            <Heart className={`w-7 h-7 ${isLiked ? 'text-red-500 fill-red-500' : 'text-white'}`} />
          </button>
          <span className="text-xs font-medium text-white shadow-black drop-shadow-md">{reel.likes + (isLiked ? 1 : 0)}</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <button 
            onClick={() => setShowComments(true)}
            className="p-3 bg-black/20 backdrop-blur-md rounded-full active:scale-90 transition-transform"
          >
            <MessageCircle className="w-7 h-7 text-white" />
          </button>
          <span className="text-xs font-medium text-white shadow-black drop-shadow-md">{reel.comments}</span>
        </div>

        <button className="p-3 bg-black/20 backdrop-blur-md rounded-full active:scale-90 transition-transform">
          <Share2 className="w-7 h-7 text-white" />
        </button>

        <button className="p-3 bg-black/20 backdrop-blur-md rounded-full active:scale-90 transition-transform">
          <Bookmark className="w-7 h-7 text-white" />
        </button>

        <button className="p-2 mt-2 bg-black/20 backdrop-blur-md rounded-full">
          <MoreHorizontal className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Bottom Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black via-black/80 to-transparent pt-32 pb-4 px-4 flex flex-col gap-3">
        {/* Product & Seller Info */}
        <div className="pr-16">
          <div className="flex items-center gap-2 mb-2">
             <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg">
                <ShieldCheck className="w-3 h-3 text-green-400" />
                <span className="text-[10px] text-white font-medium">{reel.product.sellerName}</span>
                {reel.product.isVerified && <CheckCircle className="w-3 h-3 text-[#33CFFF] fill-current" />}
             </div>
             <span className="text-[10px] text-gray-300">• {reel.product.salesCount} Sales</span>
          </div>

          <h3 className="text-lg font-bold text-white leading-tight mb-1">{reel.product.title}</h3>
          
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xl font-bold text-[#33CFFF]">${reel.product.price}</span>
            {reel.product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">${reel.product.originalPrice}</span>
            )}
            {reel.product.discountBadge && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">
                {reel.product.discountBadge}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-300 line-clamp-2 leading-snug w-[85%]">
            {reel.product.description || "Check out this amazing product! Limited stock available."} 
            <span className="text-white font-bold ml-1">more</span>
          </p>
        </div>

        {/* Buy Action */}
        <div className="mt-2">
          <Button 
            className="w-full relative overflow-hidden group border-none"
            style={{ background: 'linear-gradient(90deg, #5A4BFF 0%, #33CFFF 100%)' }}
            onClick={() => window.open(reel.product.externalLink || '#', '_blank')}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-white" />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-sm font-bold text-white">Buy Now</span>
                  <span className="text-[9px] text-white/80 font-normal">Direct from seller</span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-white opacity-80" />
            </div>
          </Button>
        </div>
      </div>

      {/* AI Popup Context (Demo) */}
      <div className="absolute top-24 left-4 z-20">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-2 max-w-[200px] animate-fade-in delay-700 opacity-0" style={{ animationFillMode: 'forwards', animationDelay: '1s' }}>
          <div className="flex gap-2">
             <div className="mt-1 min-w-[16px]">🤖</div>
             <div>
               <p className="text-[10px] text-white font-bold mb-0.5">Why this?</p>
               <p className="text-[9px] text-gray-300 leading-tight">Matched based on your recent "Summer" search. 15% cheaper than Amazon.</p>
             </div>
          </div>
        </div>
      </div>

      {/* Comments Sheet */}
      <AnimatePresence>
        {showComments && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 z-40"
              onClick={() => setShowComments(false)}
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 h-[60%] bg-[#1E1E24] rounded-t-3xl z-50 p-4 flex flex-col"
            >
              <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-4" />
              <h3 className="text-white font-bold text-center mb-4">Comments ({reel.comments})</h3>
              
              <div className="flex-1 overflow-y-auto space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">User {i}</p>
                      <p className="text-sm text-gray-300">Love this product! Does it ship to CA?</p>
                      <div className="flex gap-3 mt-1">
                        <span className="text-[10px] text-gray-500">Reply</span>
                        <span className="text-[10px] text-gray-500">Like</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask a question..." 
                  className="flex-1 bg-black/20 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-[#5A4BFF]"
                />
                <button className="p-2 bg-[#5A4BFF] rounded-full text-white">
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ReelsView: React.FC<ReelsViewProps> = ({ reels, onBack }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollTop / container.clientHeight);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* Global Back Button */}
      <button 
        onClick={onBack} 
        className="absolute top-6 left-4 z-40 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Snap Scroll Container */}
      <div 
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
        onScroll={handleScroll}
      >
        {reels.map((reel, index) => (
          <ReelItem 
            key={reel.id} 
            reel={reel} 
            isActive={index === activeIndex}
            isMuted={isMuted}
            toggleMute={() => setIsMuted(!isMuted)}
          />
        ))}
        
        {/* End of Feed */}
        <div className="h-full snap-start bg-[#111118] flex items-center justify-center flex-col text-center p-8">
           <div className="w-20 h-20 bg-[#5A4BFF]/10 rounded-full flex items-center justify-center mb-4">
             <CheckCircle className="w-10 h-10 text-[#5A4BFF]" />
           </div>
           <h3 className="text-white font-bold text-xl mb-2">You're all caught up!</h3>
           <p className="text-gray-500 text-sm mb-6">Explore more categories to find new reels.</p>
           <Button onClick={onBack} variant="outline">Back to Shop</Button>
        </div>
      </div>
    </div>
  );
};