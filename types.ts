export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
}

export enum ScreenName {
  ONBOARDING = 'ONBOARDING',
  AUTH = 'AUTH',
  BUYER_HOME = 'BUYER_HOME',
  BUYER_REELS = 'BUYER_REELS',
  BUYER_PRODUCT_DETAIL = 'BUYER_PRODUCT_DETAIL',
  BUYER_PROFILE = 'BUYER_PROFILE',
  SELLER_REGISTRATION = 'SELLER_REGISTRATION',
  SELLER_DASHBOARD = 'SELLER_DASHBOARD', // Main entry for new SellerPortal
  SELLER_UPLOAD = 'SELLER_UPLOAD',
  SELLER_LINK_ANALYZER = 'SELLER_LINK_ANALYZER',
  SELLER_PROFILE = 'SELLER_PROFILE',
}

export type ReelStatus = 'ACTIVE' | 'REVIEW' | 'REJECTED';
export type LinkType = 'WEBSITE' | 'WHATSAPP' | 'INSTAGRAM';

// Advertising Types
export type PromotionStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'NONE';
export type BoostLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface PromotionInsights {
  audienceTags: string[];
  predictedReach: string;
  engagementScore: number;
  bestTime: string;
  qualityCheckPassed: boolean;
  qualityIssues?: string[];
}

export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  sellerRating: number;
  category: string;
  description?: string;
  sellerName?: string;
  isVerified?: boolean;
  externalLink?: string; 
  linkType?: LinkType; // New: Where the user goes
  discountBadge?: string;
  salesCount?: number; // Kept for social proof, but derived from clicks in backend
}

export interface Reel {
  id: string;
  videoUrl?: string; 
  thumbnail: string;
  product: Product;
  likes: number;
  comments: number;
  shares?: number;
  isAd?: boolean;
  aiTags?: string[];
  // Seller Analytics Fields
  status?: ReelStatus;
  views?: number;
  outboundClicks?: number; // Critical: "Buy" button clicks
  ctr?: number; // Click Through Rate
  averageWatchTime?: string; // e.g. "12s"
  
  // Advertising Fields
  promotionStatus?: PromotionStatus;
  boostLevel?: BoostLevel;
  adViews?: number;
  adClicks?: number;
  promotionInsights?: PromotionInsights;
}

export interface AIAnalysisResult {
  category: string;
  suggestedPrice: string;
  seoTags: string[];
  qualityScore: number;
  improvementTips: string[];
}