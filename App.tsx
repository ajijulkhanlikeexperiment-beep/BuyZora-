import React, { useState, useEffect } from 'react';
import { 
  User, ShoppingBag, Search, Heart, UserCircle, 
  LayoutDashboard, PlusCircle, Link as LinkIcon, Settings,
  LogOut, Moon, Sun, Camera, Store, ArrowRight, ArrowLeft
} from 'lucide-react';
import { UserRole, ScreenName, Product, Reel } from './types';

// Components
import { Button, Input, Card, NavItem } from './components/UIComponents';
import { ReelsView } from './components/ReelsView';
import { SellerPortal } from './components/SellerPortal';
import { SellerUpload } from './components/SellerUpload';
import * as GeminiService from './services/geminiService';

// --- MOCK DATA ---
const PRODUCTS: Product[] = [
  { 
    id: '1', 
    title: 'Neon Cyber Headset - Noise Cancelling', 
    price: 129, 
    originalPrice: 199, 
    category: 'Electronics', 
    sellerRating: 4.8, 
    image: 'https://picsum.photos/400/400?random=1',
    description: 'Immerse yourself in pure sound with our latest neon-lit headset. Features 40hr battery life and ultra-low latency.',
    sellerName: 'CyberAudio Official',
    isVerified: true,
    salesCount: 1250,
    externalLink: 'https://example.com/buy',
    discountBadge: '35% OFF'
  },
  { 
    id: '2', 
    title: 'Urban Cargo Pants - Waterproof', 
    price: 54, 
    category: 'Fashion', 
    sellerRating: 4.5, 
    image: 'https://picsum.photos/400/500?random=2',
    description: 'Streetwear meets utility. Water-resistant fabric with 6 spacious pockets.',
    sellerName: 'StreetModa',
    isVerified: false,
    salesCount: 890,
    externalLink: 'https://example.com/buy-pants'
  },
  { 
    id: '3', 
    title: 'Minimalist Smart Lamp', 
    price: 89, 
    category: 'Home', 
    sellerRating: 4.9, 
    image: 'https://picsum.photos/400/400?random=3',
    sellerName: 'Lumina Home',
    isVerified: true,
    salesCount: 3200
  },
  { 
    id: '4', 
    title: 'Smart Watch Series 7', 
    price: 299, 
    category: 'Electronics', 
    sellerRating: 4.7, 
    image: 'https://picsum.photos/400/400?random=4',
    sellerName: 'TechGiant',
    isVerified: true,
    salesCount: 5000,
    discountBadge: 'Best Seller'
  },
];

const REELS: Reel[] = [
  { 
    id: 'r1', 
    thumbnail: 'https://picsum.photos/400/800?random=10', 
    // Using a sample MP4 link for demo purposes
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
    product: PRODUCTS[0], 
    likes: 1200, 
    comments: 45,
    shares: 230,
    aiTags: ['Trending', 'Tech Deal']
  },
  { 
    id: 'r2', 
    thumbnail: 'https://picsum.photos/400/800?random=11', 
    // Fallback to image if video fails or just another sample
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
    product: PRODUCTS[1], 
    likes: 850, 
    comments: 20,
    shares: 110,
    aiTags: ['Summer Fit']
  },
   { 
    id: 'r3', 
    thumbnail: 'https://picsum.photos/400/800?random=12', 
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 
    product: PRODUCTS[3], 
    likes: 3400, 
    comments: 120,
    shares: 800,
    aiTags: ['Best Seller']
  },
];

// --- SCREENS ---

// 1. Onboarding
const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  
  const steps = [
    { title: "Shopping Meets Creativity", desc: "Discover products through short, engaging videos.", img: "https://picsum.photos/600/600?random=20" },
    { title: "Watch. Shop. Earn.", desc: "Found something you love? Buy it instantly while watching.", img: "https://picsum.photos/600/600?random=21" },
    { title: "Sell With Power of AI", desc: "Use advanced AI tools to boost your sales effortlessly.", img: "https://picsum.photos/600/600?random=22" },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#111118] p-6 justify-between animate-fade-in">
      <div className="flex-1 flex flex-col items-center justify-center text-center mt-10">
        <img src={steps[step].img} alt="Onboarding" className="w-64 h-64 object-cover rounded-3xl mb-8 shadow-2xl shadow-[#5A4BFF]/20" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">{steps[step].title}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg px-4">{steps[step].desc}</p>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-[#5A4BFF]' : 'w-2 bg-gray-300 dark:bg-gray-700'}`} />
          ))}
        </div>
        <Button 
          fullWidth 
          onClick={() => {
            if (step < steps.length - 1) setStep(step + 1);
            else onComplete();
          }}
        >
          {step === steps.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

// 2. Auth (Simplified - Only Buyer Entry)
const Auth = ({ onLogin }: { onLogin: () => void }) => {
  const [mobile, setMobile] = useState('');

  return (
    <div className="h-full flex flex-col p-6 justify-center max-w-md mx-auto w-full">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gradient-to-tr from-[#5A4BFF] to-[#33CFFF] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-[#5A4BFF]/30">
          <ShoppingBag className="text-white w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#5A4BFF] to-[#33CFFF]">ByZora</h2>
        <p className="text-gray-500">Shop deeply. Sell smartly.</p>
      </div>

      <div className="space-y-6">
        <Input 
          label="Mobile Number" 
          placeholder="+1 (555) 000-0000" 
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <Button fullWidth onClick={() => onLogin()}>
          Login to Shop
        </Button>
        <p className="text-center text-xs text-gray-400 mt-4">
          By clicking login, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
};

// 3. Buyer Home
const BuyerHome = ({ onNavigate, onProductSelect }: { onNavigate: (s: ScreenName) => void, onProductSelect: (p: Product) => void }) => {
  return (
    <div className="pb-24 pt-4 px-4 space-y-6">
      {/* Search Header */}
      <div className="flex items-center gap-3 sticky top-0 bg-[#F6F6F9] dark:bg-[#111118] z-10 py-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full bg-white dark:bg-[#1E1E24] rounded-2xl py-3 pl-12 pr-4 shadow-sm focus:outline-none dark:text-white"
          />
        </div>
        <button className="p-3 bg-white dark:bg-[#1E1E24] rounded-2xl shadow-sm">
          <Camera className="w-5 h-5 text-[#5A4BFF]" />
        </button>
      </div>

      {/* AI Suggestion */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        <span className="text-xs font-bold text-[#5A4BFF] whitespace-nowrap px-2">AI Picks:</span>
        {['Summer Vibe', 'Tech Essentials', 'Gift Ideas', 'Sustainable'].map(tag => (
          <span key={tag} className="px-3 py-1 bg-white dark:bg-[#1E1E24] border border-[#5A4BFF]/20 rounded-full text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
            ✨ {tag}
          </span>
        ))}
      </div>

      {/* Categories */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg dark:text-white">Categories</h3>
          <span className="text-xs text-[#5A4BFF]">View All</span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {['Electronics', 'Fashion', 'Beauty', 'Home', 'Grocery'].map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-2 min-w-[70px]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#5A4BFF]/10 to-[#33CFFF]/10 flex items-center justify-center border border-[#5A4BFF]/20">
                <ShoppingBag className="w-6 h-6 text-[#5A4BFF]" />
              </div>
              <span className="text-xs font-medium dark:text-gray-300">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Reels Section */}
      <div>
        <h3 className="font-bold text-lg dark:text-white mb-4">Trending Reels</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x">
          {REELS.map(reel => (
            <div 
              key={reel.id} 
              className="min-w-[160px] h-[280px] rounded-2xl relative overflow-hidden snap-start shadow-lg"
              onClick={() => onNavigate(ScreenName.BUYER_REELS)}
            >
              <img src={reel.thumbnail} className="w-full h-full object-cover" alt="reel" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex flex-col justify-end p-3">
                <p className="text-white text-sm font-semibold truncate">{reel.product.title}</p>
                <p className="text-[#FFC748] text-xs font-bold">${reel.product.price}</p>
              </div>
              <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                <Heart className="w-3 h-3 text-white fill-white" />
                <span className="text-[10px] text-white">{reel.likes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Products Grid */}
      <div>
        <h3 className="font-bold text-lg dark:text-white mb-4">Just For You</h3>
        <div className="grid grid-cols-2 gap-4">
          {PRODUCTS.map(product => (
            <div key={product.id} onClick={() => onProductSelect(product)}>
              <Card className="p-0 overflow-hidden h-full flex flex-col cursor-pointer hover:scale-[1.02] transition-transform" noPadding>
                <div className="relative h-40">
                  <img src={product.image} className="w-full h-full object-cover" alt={product.title} />
                  <button className="absolute top-2 right-2 p-1.5 bg-white/80 dark:bg-black/50 rounded-full">
                    <Heart className="w-4 h-4 text-gray-500 hover:text-red-500" />
                  </button>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <h4 className="font-medium text-sm text-gray-800 dark:text-white line-clamp-2 mb-1">{product.title}</h4>
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-[#5A4BFF] font-bold">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through ml-2">${product.originalPrice}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-gray-500">⭐ {product.sellerRating}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 4. Product Details
const ProductDetail = ({ product, onBack }: { product: Product, onBack: () => void }) => {
  return (
    <div className="h-full bg-white dark:bg-[#111118] flex flex-col relative">
      <div className="relative h-[45vh]">
        <img src={product.image} className="w-full h-full object-cover" alt={product.title} />
        <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
      </div>

      <div className="flex-1 bg-white dark:bg-[#111118] -mt-6 rounded-t-3xl p-6 relative shadow-inner overflow-y-auto pb-24">
        <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-6" />
        
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs text-[#5A4BFF] font-bold tracking-wider uppercase">{product.category}</span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{product.title}</h1>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-[#5A4BFF]">${product.price}</span>
            {product.originalPrice && <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded">4.8 ★</span>
          <span className="text-xs text-gray-500">128 Reviews</span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-green-600 dark:text-green-400 font-medium">94% Recommended</span>
        </div>

        {/* AI Recommendation Box */}
        <div className="p-4 bg-gradient-to-r from-[#5A4BFF]/5 to-[#33CFFF]/5 border border-[#5A4BFF]/10 rounded-2xl mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🤖</span>
            <span className="font-bold text-sm bg-clip-text text-transparent bg-gradient-to-r from-[#5A4BFF] to-[#33CFFF]">ByZora AI Match</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">This item pairs perfectly with your recent search for "Urban Sneakers". 85% of buyers bought both.</p>
        </div>

        <h3 className="font-bold mb-3 dark:text-white">Description</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
          Experience premium quality with our latest collection. Designed for comfort and style, this item features durable materials and a modern aesthetic perfect for any occasion.
        </p>

        <h3 className="font-bold mb-3 dark:text-white">Similar Items</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
          {PRODUCTS.filter(p => p.id !== product.id).map(p => (
            <div key={p.id} className="min-w-[120px]">
              <img src={p.image} className="w-full h-32 object-cover rounded-xl mb-2" alt="related" />
              <p className="text-xs font-medium truncate dark:text-white">{p.title}</p>
              <p className="text-xs font-bold text-[#5A4BFF]">${p.price}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#111118] border-t dark:border-white/5 flex gap-4">
        <Button variant="outline" className="flex-1">Add to Cart</Button>
        <Button className="flex-1 shadow-lg shadow-[#5A4BFF]/30">Buy Now</Button>
      </div>
    </div>
  );
};

// 5. Seller Registration / Login
const SellerRegistration = ({ onComplete, onCancel }: { onComplete: () => void, onCancel: () => void }) => {
  const [storeName, setStoreName] = useState('');
  
  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#111118] animate-fade-in relative">
      <button onClick={onCancel} className="absolute top-4 left-4 p-2 text-gray-500">
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="p-6 pt-16 flex-1 overflow-y-auto">
        <h2 className="text-3xl font-bold mb-2 dark:text-white">Become a Seller</h2>
        <p className="text-gray-500 mb-8">Setup your store in seconds and start selling to millions with AI tools.</p>

        <div className="space-y-5">
          <Input 
            label="Store Name" 
            placeholder="e.g. Urban Threads" 
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
          <Input 
            label="Business Email" 
            placeholder="business@example.com" 
          />
           
           <div>
             <label className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-1 mb-2 block">Category</label>
             <div className="grid grid-cols-2 gap-2">
               {['Fashion', 'Electronics', 'Home', 'Beauty'].map(cat => (
                 <div key={cat} className="p-3 border border-gray-200 dark:border-gray-700 rounded-xl text-center text-sm dark:text-gray-300 hover:border-[#5A4BFF] cursor-pointer hover:bg-[#5A4BFF]/5 transition-all">
                   {cat}
                 </div>
               ))}
             </div>
           </div>

           <Input 
            label="Tax ID / SSN" 
            placeholder="XXX-XX-XXXX" 
          />
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
          <h4 className="font-bold text-blue-700 dark:text-blue-400 text-sm mb-1">🚀 Why sell on ByZora?</h4>
          <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1 list-disc pl-4">
            <li>AI-powered SEO and Title generation</li>
            <li>Reel-first shopping experience</li>
            <li>Instant link analysis for competitors</li>
          </ul>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-white/5">
        <Button fullWidth onClick={onComplete} disabled={!storeName}>
          Launch Seller Portal
        </Button>
      </div>
    </div>
  );
};

// 8. Link Analyzer
const LinkAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    const data = await GeminiService.analyzeWebsiteLink(url);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="pb-24 pt-6 px-4 space-y-6 h-full overflow-y-auto">
      <h2 className="text-2xl font-bold dark:text-white">Web Link Analyzer</h2>
      <p className="text-gray-500 text-sm">Paste a competitor's product link or your own website to get AI insights.</p>

      <div className="flex gap-2">
        <Input 
          className="flex-1"
          placeholder="https://example.com/product"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>
      <Button fullWidth onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze with AI'}
      </Button>

      {result && (
        <div className="space-y-4 animate-fade-in">
          <Card>
            <h4 className="font-bold text-[#5A4BFF] mb-2">Detected Category</h4>
            <p className="text-gray-800 dark:text-white">{result.category}</p>
          </Card>

          <Card>
            <h4 className="font-bold text-[#5A4BFF] mb-2">Price Intelligence</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">{result.priceComparison}</p>
          </Card>

          <Card className="bg-[#5A4BFF] text-white">
            <h4 className="font-bold mb-2">AI Suggestions</h4>
            <ul className="list-disc pl-4 text-sm space-y-1">
              {result.suggestions?.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
};

// 9. Profiles (Handles Switch Logic)
const Profile = ({ 
  role, 
  onSwitchMode,
  hasSellerAccount 
}: { 
  role: UserRole, 
  onSwitchMode: () => void,
  hasSellerAccount: boolean
}) => {
  const menu = role === UserRole.BUYER 
    ? ['My Orders', 'Wishlist', 'Addresses', 'Payment Methods', 'Help Center']
    : ['Account Settings', 'Bank Details', 'KYC Verification', 'Settlements', 'Seller Support'];

  return (
    <div className="pb-24 pt-6 px-4">
      {/* Profile Header */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#5A4BFF] to-[#33CFFF] p-1 mb-3">
          <img src={`https://picsum.photos/200/200?random=${role}`} className="w-full h-full rounded-full border-4 border-white dark:border-[#111118]" alt="Profile" />
        </div>
        <h2 className="text-xl font-bold dark:text-white">{role === UserRole.BUYER ? 'Jane Doe' : 'Alex Store'}</h2>
        <p className="text-sm text-gray-500 mb-4">{role}</p>

        {/* Switcher Banner/Button */}
        {role === UserRole.BUYER ? (
          <div 
            onClick={onSwitchMode}
            className="w-full bg-gradient-to-r from-[#111118] to-[#2C2C35] text-white p-4 rounded-2xl shadow-lg cursor-pointer flex items-center justify-between relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full -mr-6 -mt-6 blur-2xl" />
            <div className="z-10">
              <h3 className="font-bold text-sm">Become a Seller</h3>
              <p className="text-[10px] text-gray-400">Start selling your products today.</p>
            </div>
            <div className="bg-white/10 p-2 rounded-full">
              <Store className="w-5 h-5 text-[#5A4BFF]" />
            </div>
          </div>
        ) : (
          <Button variant="outline" fullWidth onClick={onSwitchMode} className="gap-2">
            <ShoppingBag className="w-4 h-4" />
            Switch to Shopping
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {menu.map(item => (
          <button key={item} className="w-full p-4 flex justify-between items-center bg-white dark:bg-[#1E1E24] rounded-2xl shadow-sm">
            <span className="font-medium dark:text-gray-200">{item}</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        ))}
      </div>
      
      <div className="mt-8">
        <Button variant="ghost" fullWidth className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10">
          <LogOut className="w-4 h-4 mr-2" /> Log Out
        </Button>
      </div>
    </div>
  );
};

// --- APP COMPONENT ---

const App = () => {
  const [screen, setScreen] = useState<ScreenName>(ScreenName.ONBOARDING);
  const [role, setRole] = useState<UserRole>(UserRole.BUYER);
  const [hasSellerAccount, setHasSellerAccount] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const handleLogin = () => {
    // Default to Buyer Home
    setRole(UserRole.BUYER);
    setScreen(ScreenName.BUYER_HOME);
  };

  const handleProductSelect = (p: Product) => {
    setSelectedProduct(p);
    setScreen(ScreenName.BUYER_PRODUCT_DETAIL);
  };

  const handleSellerSwitch = () => {
    if (role === UserRole.BUYER) {
      if (hasSellerAccount) {
        setRole(UserRole.SELLER);
        setScreen(ScreenName.SELLER_DASHBOARD);
      } else {
        // Go to registration if not a seller yet
        setScreen(ScreenName.SELLER_REGISTRATION);
      }
    } else {
      // Switch back to Buyer
      setRole(UserRole.BUYER);
      setScreen(ScreenName.BUYER_HOME);
    }
  };

  const handleSellerRegistrationComplete = () => {
    setHasSellerAccount(true);
    setRole(UserRole.SELLER);
    setScreen(ScreenName.SELLER_DASHBOARD);
  };

  // Nav renderer
  const renderBottomNav = () => {
    // Hide nav on these screens
    if ([
      ScreenName.ONBOARDING, 
      ScreenName.AUTH, 
      ScreenName.BUYER_PRODUCT_DETAIL, 
      ScreenName.BUYER_REELS,
      ScreenName.SELLER_REGISTRATION
    ].includes(screen)) return null;

    if (role === UserRole.BUYER) {
      return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#111118]/90 backdrop-blur-md border-t border-gray-100 dark:border-white/5 py-3 px-6 flex justify-between z-50">
          <NavItem icon={<ShoppingBag className="w-5 h-5" />} label="Shop" isActive={screen === ScreenName.BUYER_HOME} onClick={() => setScreen(ScreenName.BUYER_HOME)} />
          <NavItem icon={<div className="bg-black dark:bg-white text-white dark:text-black rounded-md px-1 font-bold text-xs">Reels</div>} label="Reels" isActive={screen === ScreenName.BUYER_REELS} onClick={() => setScreen(ScreenName.BUYER_REELS)} />
          <NavItem icon={<Search className="w-5 h-5" />} label="Search" isActive={false} onClick={() => {}} />
          <NavItem icon={<UserCircle className="w-5 h-5" />} label="Profile" isActive={screen === ScreenName.BUYER_PROFILE} onClick={() => setScreen(ScreenName.BUYER_PROFILE)} />
        </div>
      );
    } else {
      return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-[#111118]/90 backdrop-blur-md border-t border-gray-100 dark:border-white/5 py-3 px-6 flex justify-between z-50">
          <NavItem icon={<LayoutDashboard className="w-5 h-5" />} label="Dash" isActive={screen === ScreenName.SELLER_DASHBOARD} onClick={() => setScreen(ScreenName.SELLER_DASHBOARD)} />
          <NavItem icon={<PlusCircle className="w-5 h-5" />} label="Upload" isActive={screen === ScreenName.SELLER_UPLOAD} onClick={() => setScreen(ScreenName.SELLER_UPLOAD)} />
          <NavItem icon={<LinkIcon className="w-5 h-5" />} label="Analyzer" isActive={screen === ScreenName.SELLER_LINK_ANALYZER} onClick={() => setScreen(ScreenName.SELLER_LINK_ANALYZER)} />
          <NavItem icon={<Settings className="w-5 h-5" />} label="Profile" isActive={screen === ScreenName.SELLER_PROFILE} onClick={() => setScreen(ScreenName.SELLER_PROFILE)} />
        </div>
      );
    }
  };

  // Content Renderer
  const renderScreen = () => {
    switch (screen) {
      case ScreenName.ONBOARDING:
        return <Onboarding onComplete={() => setScreen(ScreenName.AUTH)} />;
      case ScreenName.AUTH:
        return <Auth onLogin={handleLogin} />;
      
      // Buyer
      case ScreenName.BUYER_HOME:
        return <BuyerHome onNavigate={setScreen} onProductSelect={handleProductSelect} />;
      case ScreenName.BUYER_PRODUCT_DETAIL:
        return selectedProduct ? <ProductDetail product={selectedProduct} onBack={() => setScreen(ScreenName.BUYER_HOME)} /> : null;
      case ScreenName.BUYER_REELS:
        return (
          <ReelsView 
             reels={REELS} 
             onBack={() => setScreen(ScreenName.BUYER_HOME)} 
          />
        );
      case ScreenName.BUYER_PROFILE:
        return (
          <Profile 
            role={UserRole.BUYER} 
            onSwitchMode={handleSellerSwitch} 
            hasSellerAccount={hasSellerAccount} 
          />
        );
      
      // Seller
      case ScreenName.SELLER_REGISTRATION:
        return (
          <SellerRegistration 
            onComplete={handleSellerRegistrationComplete}
            onCancel={() => setScreen(ScreenName.BUYER_PROFILE)}
          />
        );
      case ScreenName.SELLER_DASHBOARD:
        return <SellerPortal />;
      case ScreenName.SELLER_UPLOAD:
        return <SellerUpload />;
      case ScreenName.SELLER_LINK_ANALYZER:
        return <LinkAnalyzer />;
      case ScreenName.SELLER_PROFILE:
        return (
          <Profile 
            role={UserRole.SELLER} 
            onSwitchMode={handleSellerSwitch} 
            hasSellerAccount={hasSellerAccount} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`w-full h-screen bg-[#F6F6F9] dark:bg-[#111118] text-[#111118] dark:text-white font-sans overflow-hidden flex justify-center`}>
      {/* Mobile Wrapper */}
      <div className="w-full max-w-[450px] h-full bg-[#F6F6F9] dark:bg-[#111118] relative shadow-2xl flex flex-col">
        {/* Dark Mode Toggle - Floating for demo */}
        {screen !== ScreenName.ONBOARDING && (
          <button 
            onClick={() => setIsDark(!isDark)}
            className="absolute top-4 right-4 z-50 p-2 bg-black/5 dark:bg-white/10 rounded-full text-gray-600 dark:text-gray-300 backdrop-blur"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}

        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          {renderScreen()}
        </main>
        {renderBottomNav()}
      </div>
    </div>
  );
};

export default App;