import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SITE_CONFIG, INITIAL_BLOG_POSTS, INITIAL_USERS } from './constants';
import { Product, CartItem, ViewState, Category, CheckoutDetails, SiteConfig, PaymentMethod, HeroSlide, Testimonial, FeaturedCategory, USPItem, Order, BlogPost, Coupon, User, UserRole } from './types';
import { ShoppingBagIcon, MenuIcon, XIcon, PlusIcon, TrashIcon, SparklesIcon, LogOutIcon, EditIcon, HomeIcon, GridIcon, BoxIcon, TagIcon, SettingsIcon, FacebookIcon, InstagramIcon, TwitterIcon, PhoneIcon, MailIcon, TruckIcon, ShieldIcon, RefreshIcon, CrownIcon, ChevronRightIcon, UploadIcon, SearchIcon, BarChartIcon, LayoutIcon, SlidersIcon, StarIcon, FileTextIcon, UserIcon, BkashIcon, NagadIcon, CardIcon } from './components/Icons';
import { generateProductDescription, generateMarketingTagline } from './services/geminiService';

// --- Styles ---
const GLASS_PANEL = "bg-white/5 backdrop-blur-md border border-white/10 shadow-xl";
const GLASS_CARD = "bg-zinc-900/40 backdrop-blur-sm border border-white/5 hover:border-pink-500/50 hover:bg-zinc-800/60 transition-all duration-300";
const GLASS_MODAL = "bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-2xl";

// --- Utility Components ---

const FadeIn: React.FC<{ children?: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setIsVisible(entry.isIntersecting));
    });
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
        if(currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const HeroCarousel = ({ slides, onShopClick }: { slides: HeroSlide[], onShopClick: () => void }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    
    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const currentSlide = slides[currentIndex] || slides[0];

    return (
        <div className="relative w-full h-[85vh] overflow-hidden bg-zinc-950">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        index === currentIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <div className="absolute inset-0 bg-black/40 z-10"></div>
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className={`w-full h-full object-cover transition-transform duration-[6000ms] ease-linear ${index === currentIndex ? 'scale-110' : 'scale-100'}`}
                    />
                </div>
            ))}
            
            {/* Text Overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
                <div className="max-w-4xl p-8 rounded-3xl bg-black/20 backdrop-blur-sm border border-white/5">
                     <h2 key={`title-${currentIndex}`} className="text-pink-400 font-bold tracking-widest uppercase mb-4 text-sm md:text-base animate-in fade-in slide-in-from-bottom-4 duration-700">
                         {currentSlide.title}
                     </h2>
                     <h1 key={`subtitle-${currentIndex}`} className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                         {currentSlide.subtitle}
                     </h1>
                     <div key={`btn-${currentIndex}`} className="animate-in fade-in zoom-in duration-700 delay-300">
                        <button 
                            onClick={onShopClick}
                            className="px-8 py-3 bg-white/90 text-black font-bold rounded-full hover:bg-pink-500 hover:text-white transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)] backdrop-blur-md"
                        >
                            {currentSlide.cta}
                        </button>
                     </div>
                </div>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-pink-500 w-8 shadow-[0_0_10px_#ec4899]' : 'bg-white/50 hover:bg-white'}`}
                    />
                ))}
            </div>
        </div>
    );
}

const ProductMarquee = ({ products, onProductClick }: { products: Product[], onProductClick: (p: Product) => void }) => {
    return (
        <div className="w-full bg-zinc-950/50 backdrop-blur-sm py-12 border-y border-white/5 overflow-hidden">
             <div className="max-w-7xl mx-auto px-4 mb-6">
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">Featured Collection</h2>
            </div>
            <div className="marquee-container group">
                <div className="marquee-content animate-marquee group-hover:paused flex">
                     {products.map(p => (
                         <div key={`m1-${p.id}`} className={`w-64 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer ${GLASS_CARD}`} onClick={() => onProductClick(p)}>
                             <img src={p.image} className="w-full h-64 object-cover" alt={p.name} />
                             <div className="p-3">
                                 <h4 className="text-white font-medium truncate">{p.name}</h4>
                                 <p className="text-pink-400 text-sm">৳{p.price.toLocaleString()}</p>
                             </div>
                         </div>
                     ))}
                </div>
                {/* Duplicate for seamless loop */}
                <div className="marquee-content animate-marquee group-hover:paused flex" aria-hidden="true">
                     {products.map(p => (
                         <div key={`m2-${p.id}`} className={`w-64 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer ${GLASS_CARD}`} onClick={() => onProductClick(p)}>
                             <img src={p.image} className="w-full h-64 object-cover" alt={p.name} />
                             <div className="p-3">
                                 <h4 className="text-white font-medium truncate">{p.name}</h4>
                                 <p className="text-pink-400 text-sm">৳{p.price.toLocaleString()}</p>
                             </div>
                         </div>
                     ))}
                </div>
            </div>
        </div>
    )
}

const TestimonialSection = ({ testimonials }: { testimonials: Testimonial[] }) => {
    return (
        <div className="py-24 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-pink-900/20 rounded-full blur-[100px] -z-10"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn>
                    <h2 className="text-3xl font-bold text-center text-white mb-16">What Our Customers Say</h2>
                </FadeIn>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <FadeIn key={t.id} delay={i * 100}>
                            <div className={`${GLASS_PANEL} p-8 rounded-2xl relative`}>
                                <div className="absolute -top-4 left-8 bg-pink-600 text-white p-2 rounded-full shadow-lg shadow-pink-600/30">
                                    <StarIcon className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-zinc-300 italic mb-6 pt-4">"{t.comment}"</p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-white font-bold">{t.name}</h4>
                                        <span className="text-pink-400 text-xs uppercase tracking-wide">{t.role}</span>
                                    </div>
                                    <div className="flex text-yellow-500">
                                        {[...Array(5)].map((_, idx) => (
                                            <React.Fragment key={idx}>
                                                <StarIcon className={`w-4 h-4 ${idx < t.rating ? 'fill-current' : 'text-zinc-600'}`} />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </div>
    )
}

const CategoryGrid = ({ categories, onCategoryClick }: { categories: FeaturedCategory[], onCategoryClick: (cat: string) => void }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-center text-white mb-8">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => onCategoryClick(cat.filterValue)}
                        className={`group relative rounded-xl overflow-hidden aspect-square cursor-pointer border border-white/10 hover:border-pink-500/50 transition-all duration-500 shadow-lg hover:shadow-[0_0_25px_rgba(236,72,153,0.4)]`}
                    >
                         <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent group-hover:from-pink-900/80 transition-colors duration-500"></div>
                         <div className="absolute bottom-4 left-0 right-0 text-center">
                             <h3 className="text-lg font-bold text-white group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{cat.name}</h3>
                         </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const USPMarquee = ({ usps }: { usps: USPItem[] }) => {
    const getIcon = (iconName: string) => {
        switch(iconName) {
            case 'TRUCK': return <TruckIcon className="w-6 h-6 text-pink-500" />;
            case 'SHIELD': return <ShieldIcon className="w-6 h-6 text-pink-500" />;
            case 'REFRESH': return <RefreshIcon className="w-6 h-6 text-pink-500" />;
            case 'CROWN': return <CrownIcon className="w-6 h-6 text-pink-500" />;
            default: return <SparklesIcon className="w-6 h-6 text-pink-500" />;
        }
    };

    return (
        <div className="w-full bg-zinc-950/80 border-t border-b border-white/5 py-4 overflow-hidden backdrop-blur-md">
            <div className="marquee-container">
                <div className="marquee-content animate-marquee-reverse text-zinc-300 font-medium tracking-wide flex items-center gap-8 md:gap-12">
                    {usps.map((usp, i) => (
                        <div key={i} className="flex items-center gap-3">
                            {getIcon(usp.icon)}
                            <span className="uppercase text-sm">{usp.text}</span>
                        </div>
                    ))}
                    {usps.map((usp, i) => (
                        <div key={`dup-${i}`} className="flex items-center gap-3">
                            {getIcon(usp.icon)}
                            <span className="uppercase text-sm">{usp.text}</span>
                        </div>
                    ))}
                    {usps.map((usp, i) => (
                        <div key={`dup2-${i}`} className="flex items-center gap-3">
                            {getIcon(usp.icon)}
                            <span className="uppercase text-sm">{usp.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const CouponMarquee = ({ text }: { text: string }) => {
    return (
        <div className="w-full bg-pink-900 text-white text-[10px] md:text-xs py-2 overflow-hidden border-b border-white/10 z-[60]">
            <div className="marquee-container">
                <div className="marquee-content animate-marquee-slow flex items-center gap-12 whitespace-nowrap font-medium tracking-widest uppercase">
                    {[...Array(6)].map((_, i) => (
                        <span key={i} className="flex items-center gap-4">
                            <SparklesIcon className="w-3 h-3 text-white" />
                            {text}
                        </span>
                    ))}
                </div>
                {/* Duplicated for seamless loop */}
                <div className="marquee-content animate-marquee-slow flex items-center gap-12 whitespace-nowrap font-medium tracking-widest uppercase" aria-hidden="true">
                    {[...Array(6)].map((_, i) => (
                        <span key={i} className="flex items-center gap-4">
                            <SparklesIcon className="w-3 h-3 text-white" />
                            {text}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PaymentMarquee = () => {
    return (
        <div className="w-full bg-zinc-900 border-t border-white/5 py-6 overflow-hidden">
            <h3 className="text-center text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">We Accept</h3>
            <div className="marquee-container">
                <div className="marquee-content animate-marquee-reverse flex items-center gap-16">
                    {[...Array(6)].map((_, i) => (
                        <React.Fragment key={i}>
                            <div className="flex items-center gap-3">
                                <BkashIcon className="w-8 h-8 text-pink-500" />
                                <span className="text-zinc-300 text-sm font-bold uppercase tracking-wider">bKash</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <NagadIcon className="w-8 h-8 text-orange-500" />
                                <span className="text-zinc-300 text-sm font-bold uppercase tracking-wider">Nagad</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CardIcon className="w-8 h-8 text-blue-400" />
                                <span className="text-zinc-300 text-sm font-bold uppercase tracking-wider">Debit/Credit Card</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <TruckIcon className="w-8 h-8 text-green-400" />
                                <span className="text-zinc-300 text-sm font-bold uppercase tracking-wider">Cash on Delivery</span>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                <div className="marquee-content animate-marquee-reverse flex items-center gap-16" aria-hidden="true">
                    {[...Array(6)].map((_, i) => (
                        <React.Fragment key={i}>
                            <div className="flex items-center gap-3">
                                <BkashIcon className="w-8 h-8 text-pink-500" />
                                <span className="text-zinc-300 text-sm font-bold uppercase tracking-wider">bKash</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <NagadIcon className="w-8 h-8 text-orange-500" />
                                <span className="text-zinc-300 text-sm font-bold uppercase tracking-wider">Nagad</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <CardIcon className="w-8 h-8 text-blue-400" />
                                <span className="text-zinc-300 text-sm font-bold uppercase tracking-wider">Debit/Credit Card</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <TruckIcon className="w-8 h-8 text-green-400" />
                                <span className="text-zinc-300 text-sm font-bold uppercase tracking-wider">Cash on Delivery</span>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SocialMarquee = () => {
    return (
        <div className="w-full bg-zinc-950 border-t border-white/5 py-10 overflow-hidden">
            <div className="marquee-container">
                <div className="marquee-content animate-marquee flex items-center gap-24">
                    <FacebookIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                    <InstagramIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                    <TwitterIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                    <span className="text-2xl font-bold text-zinc-700 uppercase tracking-[0.2em]">Follow Us</span>
                    <FacebookIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                    <InstagramIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                    <TwitterIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                    <span className="text-2xl font-bold text-zinc-700 uppercase tracking-[0.2em]">Velvet & Vogue</span>
                     <FacebookIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                    <InstagramIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                    <TwitterIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                </div>
                 <div className="marquee-content animate-marquee flex items-center gap-24" aria-hidden="true">
                    <FacebookIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                    <InstagramIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                    <TwitterIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                    <span className="text-2xl font-bold text-zinc-700 uppercase tracking-[0.2em]">Follow Us</span>
                    <FacebookIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                    <InstagramIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                    <TwitterIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                    <span className="text-2xl font-bold text-zinc-700 uppercase tracking-[0.2em]">Velvet & Vogue</span>
                     <FacebookIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                    <InstagramIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                    <TwitterIcon className="w-10 h-10 text-zinc-600 hover:text-pink-500 transition-colors cursor-pointer" />
                </div>
            </div>
        </div>
    );
}

const NewsletterSection = () => {
    return (
        <div className="bg-pink-900/10 border-y border-white/5 py-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
            <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                <span className="text-pink-500 font-bold tracking-widest uppercase text-sm mb-2 block">Stay in the Loop</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Unlock Exclusive Benefits</h2>
                <p className="text-zinc-400 mb-8 max-w-xl mx-auto">Join our VIP list for early access to new collections, style tips, and exclusive subscriber-only discounts.</p>
                <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                    <input type="email" placeholder="Enter your email address" className="flex-1 bg-black/40 border border-white/10 rounded-full px-6 py-3 text-white focus:border-pink-500 outline-none" />
                    <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-8 py-3 rounded-full transition-transform hover:scale-105 shadow-lg shadow-pink-600/20">Subscribe</button>
                </div>
            </div>
        </div>
    );
};

const Footer = ({ config, onNavClick }: { config: SiteConfig, onNavClick: (v: ViewState) => void }) => {
    return (
        <footer className="bg-zinc-950 border-t border-white/10 pt-16 pb-24 md:pb-8 w-full mt-auto">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-6">{config.headerTitle}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-6">{config.footerText}</p>
                    <div className="flex gap-4">
                        <FacebookIcon className="w-5 h-5 text-zinc-500 hover:text-white transition cursor-pointer" />
                        <InstagramIcon className="w-5 h-5 text-zinc-500 hover:text-white transition cursor-pointer" />
                        <TwitterIcon className="w-5 h-5 text-zinc-500 hover:text-white transition cursor-pointer" />
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Shop</h4>
                    <ul className="space-y-3 text-sm text-zinc-400">
                        <li className="hover:text-pink-500 cursor-pointer transition" onClick={() => onNavClick('SHOP')}>New Arrivals</li>
                        <li className="hover:text-pink-500 cursor-pointer transition" onClick={() => onNavClick('SHOP')}>Bags</li>
                        <li className="hover:text-pink-500 cursor-pointer transition" onClick={() => onNavClick('SHOP')}>Keychains</li>
                        <li className="hover:text-pink-500 cursor-pointer transition" onClick={() => onNavClick('SHOP')}>Sale</li>
                    </ul>
                </div>
                <div>
                     <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Help</h4>
                     <ul className="space-y-3 text-sm text-zinc-400">
                        <li className="hover:text-pink-500 cursor-pointer transition">Shipping & Returns</li>
                        <li className="hover:text-pink-500 cursor-pointer transition">FAQ</li>
                        <li className="hover:text-pink-500 cursor-pointer transition">Contact Us</li>
                        <li className="hover:text-pink-500 cursor-pointer transition">Track Order</li>
                     </ul>
                </div>
            </div>
            <div className="border-t border-white/5 pt-8 text-center text-zinc-600 text-xs uppercase tracking-wider">
                {config.copyrightText}
            </div>
        </footer>
    );
};

const MobileStickyFooter = ({ 
    activeView, 
    onNavClick, 
    cartCount,
    onCartClick 
}: { 
    activeView: ViewState, 
    onNavClick: (view: ViewState) => void,
    cartCount: number,
    onCartClick: () => void
}) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-lg border-t border-white/10 z-50 md:hidden flex justify-around items-center h-16 px-2 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
            <button onClick={() => onNavClick('HOME')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform ${activeView === 'HOME' ? 'text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]' : 'text-zinc-400'}`}>
                <HomeIcon className="w-5 h-5" />
                <span className="text-[10px] font-medium">Home</span>
            </button>
            <button onClick={() => onNavClick('SHOP')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform ${activeView === 'SHOP' ? 'text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]' : 'text-zinc-400'}`}>
                <ShoppingBagIcon className="w-5 h-5" />
                <span className="text-[10px] font-medium">Shop</span>
            </button>
            <button onClick={onCartClick} className="flex flex-col items-center justify-center w-full h-full space-y-1 text-zinc-400 relative active:scale-95 transition-transform">
                <div className="relative">
                    <ShoppingBagIcon className="w-5 h-5" />
                     {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[8px] font-bold leading-none text-white bg-pink-600 rounded-full animate-bounce">
                          {cartCount}
                        </span>
                      )}
                </div>
                <span className="text-[10px] font-medium">Cart</span>
            </button>
        </div>
    );
};

const MobileDrawer = ({ 
    isOpen, 
    onClose, 
    onNavClick,
    categories,
    onCategoryClick
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    onNavClick: (view: ViewState) => void,
    categories: string[],
    onCategoryClick: (cat: string) => void
}) => {
    return (
        <div className={`fixed inset-0 z-[60] md:hidden transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
            <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>
            <div className={`absolute top-0 bottom-0 left-0 w-72 bg-zinc-900/95 backdrop-blur-xl border-r border-white/10 shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 flex justify-between items-center border-b border-white/5">
                    <h2 className="text-xl font-bold text-white bg-gradient-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent">Menu</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white"><XIcon /></button>
                </div>
                <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-120px)]">
                    <button onClick={() => { onNavClick('HOME'); onClose(); }} className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-white/5 text-zinc-300 hover:text-white transition-colors">
                        <HomeIcon className="w-5 h-5 text-pink-500" />
                        <span>Home</span>
                    </button>
                    <button onClick={() => { onNavClick('SHOP'); onClose(); }} className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-white/5 text-zinc-300 hover:text-white transition-colors">
                        <ShoppingBagIcon className="w-5 h-5 text-pink-500" />
                        <span>Shop All</span>
                    </button>
                    <button onClick={() => { onNavClick('BLOG'); onClose(); }} className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-white/5 text-zinc-300 hover:text-white transition-colors">
                        <FileTextIcon className="w-5 h-5 text-pink-500" />
                        <span>Blog & News</span>
                    </button>
                    <button onClick={() => { onNavClick('USER_DASHBOARD'); onClose(); }} className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-white/5 text-zinc-300 hover:text-white transition-colors">
                        <UserIcon className="w-5 h-5 text-pink-500" />
                        <span>My Account</span>
                    </button>
                    
                    <div className="pt-4 border-t border-white/5">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 px-3">Categories</h3>
                        {categories.map(c => (
                            <button 
                                key={c}
                                onClick={() => { onCategoryClick(c); onClose(); }} 
                                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors text-sm"
                            >
                                <span>{c}</span>
                                <ChevronRightIcon className="w-4 h-4 opacity-50" />
                            </button>
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/5 bg-black/20">
                    <p className="text-xs text-zinc-500 text-center">Velvet & Vogue &copy; 2024</p>
                </div>
            </div>
        </div>
    );
};

const BlogPostModal = ({ post, isOpen, onClose }: { post: BlogPost | null; isOpen: boolean; onClose: () => void }) => {
    if (!isOpen || !post) return null;
    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog">
            <div className={`fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity`} onClick={onClose}></div>
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className={`relative transform overflow-hidden rounded-2xl text-left transition-all sm:max-w-3xl w-full ${GLASS_MODAL}`}>
                    <div className="h-64 w-full relative">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-white/20"><XIcon /></button>
                        <div className="absolute bottom-6 left-6 right-6">
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{post.title}</h2>
                            <div className="flex gap-4 text-sm text-zinc-300">
                                <span>{post.date}</span>
                                <span>•</span>
                                <span>By {post.author}</span>
                            </div>
                        </div>
                    </div>
                    <div className="p-8">
                        <p className="text-zinc-300 leading-relaxed text-lg">{post.content}</p>
                        <div className="mt-8 pt-6 border-t border-white/10 text-center">
                            <button onClick={onClose} className="text-pink-500 font-bold hover:underline">Close Article</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Navbar = ({
  cartCount,
  onCartClick,
  onNavClick,
  activeView,
  siteConfig,
  onMenuClick,
  searchQuery,
  onSearchChange,
  currentUser,
  onLogout
}: {
  cartCount: number;
  onCartClick: () => void;
  onNavClick: (view: ViewState) => void;
  activeView: ViewState;
  siteConfig: SiteConfig;
  onMenuClick: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: User | null;
  onLogout: () => void;
}) => {
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          
          {/* Mobile Search Overlay */}
          {isMobileSearchOpen ? (
              <div className="absolute inset-0 z-50 bg-zinc-900 flex items-center px-4 animate-in fade-in slide-in-from-top-2 w-full">
                <button onClick={() => setIsMobileSearchOpen(false)} className="mr-3 text-zinc-400 hover:text-white p-2">
                  <ChevronRightIcon className="w-5 h-5 transform rotate-180" />
                </button>
                <div className="flex-1 relative">
                   <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500"/>
                   <input 
                     autoFocus 
                     className="w-full bg-black/50 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white focus:border-pink-500 outline-none text-sm"
                     placeholder="Search products..."
                     value={searchQuery}
                     onChange={(e) => onSearchChange(e.target.value)}
                   />
                </div>
              </div>
          ) : (
              <>
                  <div className="flex items-center gap-3">
                      <button onClick={onMenuClick} className="md:hidden text-zinc-300 hover:text-white p-1">
                          <MenuIcon className="w-6 h-6" />
                      </button>
                      <div className="flex-shrink-0 cursor-pointer flex items-center gap-2" onClick={() => onNavClick('HOME')}>
                        {siteConfig.logo ? (
                            <img src={siteConfig.logo} alt={siteConfig.headerTitle} className="h-10 w-auto object-contain hover:scale-105 transition-transform" />
                        ) : (
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-pink-300 bg-clip-text text-transparent hover:scale-105 transition-transform drop-shadow-[0_2px_10px_rgba(236,72,153,0.3)]">
                            {siteConfig.headerTitle}
                            </h1>
                        )}
                      </div>
                  </div>
                  
                  {/* Desktop Search Bar */}
                  <div className="flex-1 max-w-lg mx-8 hidden md:block">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-zinc-500 group-focus-within:text-pink-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => onSearchChange(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-full leading-5 bg-black/20 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:bg-black/50 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 sm:text-sm transition-all"
                                placeholder="Search for bags, accessories..."
                            />
                        </div>
                  </div>

                  <div className="hidden md:flex items-center space-x-4 ml-4">
                      <button onClick={() => onNavClick('HOME')} className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${activeView === 'HOME' ? 'text-pink-400 bg-white/5' : 'text-zinc-300 hover:text-white hover:bg-white/5'}`}>Home</button>
                      <button onClick={() => onNavClick('SHOP')} className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${activeView === 'SHOP' ? 'text-pink-400 bg-white/5' : 'text-zinc-300 hover:text-white hover:bg-white/5'}`}>Shop</button>
                      
                      {currentUser ? (
                          <div className="relative group">
                              <button onClick={() => onNavClick(currentUser.role.includes('ADMIN') ? 'ADMIN' : 'USER_DASHBOARD')} className="flex items-center gap-2 text-zinc-300 hover:text-white px-3 py-2 rounded-md transition-colors hover:bg-white/5">
                                  <UserIcon className="w-5 h-5" />
                                  <span className="text-sm font-medium hidden lg:inline">{currentUser.name}</span>
                              </button>
                          </div>
                      ) : (
                          <button onClick={() => onNavClick('LOGIN')} className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-2 rounded-md hover:bg-white/5">Login</button>
                      )}
                  </div>

                  <div className="flex items-center gap-4 ml-4">
                     {/* Mobile Search Icon */}
                     <div className="md:hidden">
                         <button 
                            onClick={() => setIsMobileSearchOpen(true)}
                            className="p-2 text-zinc-300 hover:text-white transition-colors"
                         >
                             <SearchIcon className="w-6 h-6" />
                         </button>
                     </div>

                     <button
                      onClick={onCartClick}
                      className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-pink-500 group"
                    >
                      <ShoppingBagIcon className="group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                      {cartCount > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-pink-600 rounded-full animate-bounce shadow-lg">
                          {cartCount}
                        </span>
                      )}
                    </button>
                  </div>
              </>
          )}
        </div>
      </div>
    </nav>
  );
};

const ProductCard: React.FC<{ product: Product; onAddToCart: (p: Product) => void; onClick: () => void }> = ({ product, onAddToCart, onClick }) => {
  return (
    <div className={`group relative rounded-xl overflow-hidden flex flex-col h-full ${GLASS_CARD}`}>
      <div onClick={onClick} className="cursor-pointer aspect-w-1 aspect-h-1 w-full overflow-hidden bg-zinc-800/50 xl:aspect-w-7 xl:aspect-h-8 relative h-64">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
        />
        {product.isNew && (
          <div className="absolute top-2 left-2 bg-pink-600/90 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide shadow-lg border border-pink-400/20">
            New Arrival
          </div>
        )}
         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300 backdrop-blur-[2px]">
             <span className="bg-white/90 text-black px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-all shadow-xl">Quick View</span>
         </div>
      </div>
      <div className="p-4 flex flex-col flex-grow bg-transparent">
        <div className="flex justify-between items-start mb-2 cursor-pointer" onClick={onClick}>
           <div>
              <p className="text-sm text-pink-400 font-medium tracking-wider text-xs uppercase">{product.category}</p>
              <h3 className="text-lg font-semibold text-white group-hover:text-pink-300 transition-colors">{product.name}</h3>
           </div>
           <p className="text-lg font-bold text-white drop-shadow-md">৳{product.price.toLocaleString()}</p>
        </div>
        <p className="mt-1 text-sm text-zinc-300 line-clamp-2 flex-grow cursor-pointer" onClick={onClick}>{product.description}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          className="mt-4 w-full bg-white/5 border border-white/10 hover:bg-pink-600 hover:border-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 shadow-lg"
        >
          <ShoppingBagIcon className="w-4 h-4" /> Add to Cart
        </button>
      </div>
    </div>
  );
};

const ProductDetailsModal = ({
    product,
    isOpen,
    onClose,
    onAddToCart
}: {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (p: Product) => void;
}) => {
    const [render, setRender] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen && product) {
            setRender(true);
            setTimeout(() => setVisible(true), 10);
        } else {
            setVisible(false);
            const timer = setTimeout(() => setRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, product]);

    if (!render || !product) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            ></div>

            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                <div 
                    className={`relative transform overflow-hidden rounded-2xl text-left transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] sm:my-8 sm:w-full sm:max-w-4xl ${GLASS_MODAL} ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}
                >
                    <div className="absolute top-4 right-4 z-10">
                        <button
                            type="button"
                            className="rounded-full bg-black/50 p-2 text-zinc-400 hover:text-white hover:bg-black/70 transition-all backdrop-blur-sm"
                            onClick={onClose}
                        >
                            <XIcon className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Image Section */}
                        <div className="h-64 w-full bg-zinc-800 md:h-full min-h-[400px]">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover object-center"
                            />
                        </div>

                        {/* Details Section */}
                        <div className="flex flex-col justify-between p-6 md:p-10 bg-gradient-to-b from-transparent to-black/40">
                            <div>
                                <span className="mb-2 inline-block rounded-full bg-pink-900/40 border border-pink-500/30 px-3 py-1 text-xs font-semibold text-pink-300 uppercase tracking-wide">
                                    {product.category}
                                </span>
                                <h2 className="mb-2 text-3xl font-bold text-white drop-shadow-lg">{product.name}</h2>
                                <p className="mb-6 text-2xl font-bold text-pink-400 drop-shadow-md">৳{product.price.toLocaleString()}</p>
                                
                                <div className="prose prose-invert mb-8">
                                    <p className="text-zinc-200 leading-relaxed">{product.description}</p>
                                    <p className="mt-4 text-zinc-400 text-sm">
                                        Designed with premium materials and crafted for longevity. This item comes with a certificate of authenticity and our signature packaging.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={() => {
                                        onAddToCart(product);
                                        onClose();
                                    }}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-pink-600/20 hover:bg-pink-700 hover:shadow-pink-600/40 hover:scale-[1.02] transition-all duration-300 active:scale-95"
                                >
                                    <ShoppingBagIcon className="h-6 w-6" />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-8 py-3 text-sm font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
                                >
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CheckoutModal = ({
    isOpen,
    onClose,
    total,
    config,
    onCheckout,
    coupons
}: {
    isOpen: boolean;
    onClose: () => void;
    total: number;
    config: SiteConfig['checkout'];
    onCheckout: (details: CheckoutDetails, discount: number, finalTotal: number) => void;
    coupons: Coupon[];
}) => {
    // Initialize paymentMethod to 'COD'
    const [details, setDetails] = useState<CheckoutDetails>({
        fullName: '', email: '', phone: '', address: '', city: '', zip: '', cardNumber: '', expiry: '', cvv: '', paymentMethod: 'COD', bkashTransactionId: ''
    });
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handlePaymentChange = (method: PaymentMethod) => {
        setDetails({...details, paymentMethod: method});
    }

    const applyPromo = () => {
        const foundCoupon = coupons.find(c => c.code === promoCode && c.isActive);
        if (foundCoupon) {
            setDiscount(total * (foundCoupon.discountPercent / 100));
        } else {
            setDiscount(0);
            if(promoCode) alert("Invalid or inactive promo code");
        }
    };

    const finalTotal = total - discount;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCheckout(details, discount, finalTotal);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
                </div>

                <div className={`inline-block align-bottom rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full ${GLASS_MODAL}`}>
                    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-white/10">
                        <div className="flex justify-between items-center pb-2">
                             <h3 className="text-xl font-bold text-white">Secure Checkout</h3>
                             <button onClick={onClose} className="text-zinc-400 hover:text-white"><XIcon /></button>
                        </div>
                    </div>
                    
                    <div className="px-4 pt-4 pb-4 sm:p-6 sm:pb-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-3">
                            <div>
                                <h4 className="text-xs font-bold text-pink-400 mb-2 uppercase tracking-wider">Shipping Info</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    <input required name="fullName" placeholder="Full Name" value={details.fullName} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-white focus:border-pink-500 outline-none placeholder-zinc-600 text-sm" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input required name="email" type="email" placeholder="Email" value={details.email} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-white focus:border-pink-500 outline-none placeholder-zinc-600 text-sm" />
                                        <input required name="phone" type="tel" placeholder="Phone Number" value={details.phone} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-white focus:border-pink-500 outline-none placeholder-zinc-600 text-sm" />
                                    </div>
                                    <input required name="address" placeholder="Address" value={details.address} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-white focus:border-pink-500 outline-none placeholder-zinc-600 text-sm" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input required name="city" placeholder="City" value={details.city} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-white focus:border-pink-500 outline-none placeholder-zinc-600 text-sm" />
                                        <input required name="zip" placeholder="ZIP Code" value={details.zip} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-white focus:border-pink-500 outline-none placeholder-zinc-600 text-sm" />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h4 className="text-xs font-bold text-pink-400 mb-2 uppercase tracking-wider">Payment Method</h4>
                                <div className="flex space-x-2 mb-4">
                                    <button 
                                        type="button"
                                        onClick={() => handlePaymentChange('COD')}
                                        className={`flex-1 py-2 px-1 rounded-md border text-xs font-medium transition-colors ${details.paymentMethod === 'COD' ? 'bg-pink-600 border-pink-600 text-white' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
                                    >
                                        Cash on Delivery
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => handlePaymentChange('CARD')}
                                        className={`flex-1 py-2 px-1 rounded-md border text-xs font-medium transition-colors ${details.paymentMethod === 'CARD' ? 'bg-pink-600 border-pink-600 text-white' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
                                    >
                                        Credit Card
                                    </button>
                                    {config.enableBkash && (
                                        <button 
                                            type="button"
                                            onClick={() => handlePaymentChange('BKASH')}
                                            className={`flex-1 py-2 px-1 rounded-md border text-xs font-medium transition-colors ${details.paymentMethod === 'BKASH' ? 'bg-pink-600 border-pink-600 text-white' : 'bg-black/30 border-white/10 text-zinc-400 hover:bg-white/5'}`}
                                        >
                                            bKash
                                        </button>
                                    )}
                                </div>

                                {details.paymentMethod === 'CARD' && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                        <input required name="cardNumber" placeholder="Card Number" value={details.cardNumber} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-white focus:border-pink-500 outline-none placeholder-zinc-600 text-sm" />
                                        <div className="grid grid-cols-2 gap-3">
                                            <input required name="expiry" placeholder="MM/YY" value={details.expiry} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-white focus:border-pink-500 outline-none placeholder-zinc-600 text-sm" />
                                            <input required name="cvv" placeholder="CVV" value={details.cvv} onChange={handleChange} className="w-full bg-black/30 border border-white/10 rounded-md p-2 text-white focus:border-pink-500 outline-none placeholder-zinc-600 text-sm" />
                                        </div>
                                    </div>
                                )}
                                
                                {details.paymentMethod === 'BKASH' && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 bg-black/30 p-3 rounded-lg border border-pink-500/20">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-6 h-6 rounded bg-[#E2136E] flex items-center justify-center text-white font-bold text-[10px]">bK</div>
                                            <p className="text-white font-medium text-sm">bKash Payment</p>
                                        </div>
                                        <p className="text-xs text-zinc-300 leading-relaxed mb-2">{config.bkashInstructions}</p>
                                        <div className="bg-pink-900/20 p-2 rounded border border-pink-500/30 text-center mb-2">
                                            <span className="text-[10px] text-pink-400 block uppercase tracking-wider">Send Money To</span>
                                            <span className="text-lg font-bold text-white tracking-widest">{config.bkashNumber}</span>
                                        </div>
                                        <input required name="bkashTransactionId" placeholder="Enter Transaction ID / Phone Number" value={details.bkashTransactionId} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-md p-2 text-white focus:border-pink-500 outline-none placeholder-zinc-600 text-sm" />
                                    </div>
                                )}

                                {details.paymentMethod === 'COD' && (
                                    <div className="p-3 bg-black/30 border border-white/10 rounded-md text-zinc-300 text-sm animate-in fade-in slide-in-from-top-2">
                                        <p>You will pay for this order when it is delivered to your address.</p>
                                    </div>
                                )}
                            </div>
                            {/* Promo Code Section */}
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <div className="flex gap-2">
                                    <input 
                                        placeholder="Promo Code" 
                                        value={promoCode} 
                                        onChange={(e) => setPromoCode(e.target.value)} 
                                        className="flex-1 bg-black/30 border border-white/10 rounded-md p-2 text-white focus:border-pink-500 outline-none text-sm"
                                    />
                                    <button type="button" onClick={applyPromo} className="bg-white/10 hover:bg-white/20 text-white px-3 rounded-md text-sm border border-white/10">Apply</button>
                                </div>
                                {discount > 0 && <p className="text-green-400 text-xs mt-1">Discount Applied: -৳{discount.toLocaleString()}</p>}
                            </div>
                        </form>
                    </div>
                    <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-white/10 bg-black/20">
                        <button type="submit" form="checkout-form" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-lg shadow-pink-600/20 px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-transform active:scale-95">
                            {details.paymentMethod === 'COD' ? 'Place Order' : `Pay ৳${finalTotal.toLocaleString()}`}
                        </button>
                        <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-white/10 shadow-sm px-4 py-2 bg-transparent text-base font-medium text-zinc-300 hover:text-white hover:bg-white/5 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const UserDashboard = ({ user, orders, onLogout }: { user: User, orders: Order[], onLogout: () => void }) => {
    const userOrders = orders.filter(o => {
        // Match by email provided in checkout details against registered email
        return o.details.email.toLowerCase() === user.email.toLowerCase();
    });

    return (
        <main className="min-h-screen pt-8 pb-24 px-4 max-w-7xl mx-auto">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                 <div>
                     <h1 className="text-3xl font-bold text-white mb-2">My Account</h1>
                     <p className="text-zinc-400">Welcome back, {user.name}</p>
                 </div>
                 <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors text-sm">
                     <LogOutIcon className="w-4 h-4" /> Sign Out
                 </button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* Profile Card */}
                 <div className={`p-6 rounded-xl h-fit ${GLASS_PANEL}`}>
                     <div className="flex items-center gap-4 mb-6">
                         <div className="w-16 h-16 rounded-full bg-pink-600 flex items-center justify-center text-2xl font-bold text-white">
                             {user.name.charAt(0)}
                         </div>
                         <div>
                             <h3 className="font-bold text-white text-lg">{user.name}</h3>
                             <span className="text-xs px-2 py-1 rounded bg-white/10 text-zinc-300 uppercase">{user.role}</span>
                         </div>
                     </div>
                     <div className="space-y-4">
                         <div>
                             <label className="text-xs text-zinc-500 uppercase block mb-1">Email</label>
                             <p className="text-zinc-300">{user.email}</p>
                         </div>
                         <div>
                             <label className="text-xs text-zinc-500 uppercase block mb-1">Member Since</label>
                             <p className="text-zinc-300">{new Date().getFullYear()}</p>
                         </div>
                     </div>
                 </div>

                 {/* Order History */}
                 <div className={`lg:col-span-2 p-6 rounded-xl ${GLASS_PANEL}`}>
                     <h3 className="text-xl font-bold text-white mb-6">Order History</h3>
                     {userOrders.length === 0 ? (
                         <div className="text-center py-12 text-zinc-500">
                             <p>You haven't placed any orders yet.</p>
                             <p className="text-sm mt-2">When you checkout using {user.email}, your orders will appear here.</p>
                         </div>
                     ) : (
                         <div className="space-y-4">
                             {userOrders.map(order => (
                                 <div key={order.id} className="bg-black/20 p-4 rounded-lg border border-white/5 flex flex-col md:flex-row justify-between gap-4">
                                     <div>
                                         <div className="flex items-center gap-3 mb-2">
                                             <span className="font-bold text-white">#{order.id}</span>
                                             <span className={`px-2 py-0.5 text-[10px] rounded uppercase font-bold ${
                                                  order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' :
                                                  order.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' :
                                                  'bg-yellow-500/20 text-yellow-400'
                                             }`}>
                                                 {order.status}
                                             </span>
                                         </div>
                                         <p className="text-xs text-zinc-500">{new Date(order.date).toLocaleDateString()}</p>
                                         <p className="text-sm text-zinc-300 mt-2">{order.items.length} items</p>
                                     </div>
                                     <div className="flex flex-col justify-between items-end">
                                         <span className="font-bold text-pink-400">৳{order.finalTotal.toLocaleString()}</span>
                                         {/* Placeholder for order details view if needed later */}
                                     </div>
                                 </div>
                             ))}
                         </div>
                     )}
                 </div>
             </div>
        </main>
    );
};

// 5. Admin Dashboard (Sidebar Redesign)
type AdminTab = 'DASHBOARD' | 'ORDERS' | 'PRODUCTS' | 'CATEGORIES' | 'REVIEWS' | 'STORE_DESIGN' | 'GENERAL_INFO' | 'SYSTEM_CONFIG' | 'COUPONS' | 'USERS';

const AdminDashboard = ({
  user,
  products,
  orders,
  categories,
  siteConfig,
  users,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onAddCategory,
  onDeleteCategory,
  onUpdateSiteConfig,
  onUpdateOrder,
  onAddUser,
  onDeleteUser,
  onLogout
}: {
  user: User;
  products: Product[];
  orders: Order[];
  categories: Category[];
  siteConfig: SiteConfig;
  users: User[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAddCategory: (c: string) => void;
  onDeleteCategory: (c: string) => void;
  onUpdateSiteConfig: (config: SiteConfig) => void;
  onUpdateOrder: (order: Order) => void;
  onAddUser: (u: User) => void;
  onDeleteUser: (id: string) => void;
  onLogout: () => void;
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('DASHBOARD');
  
  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const triggerToast = (msg: string) => {
      setToastMsg(msg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
  };
  
  // Product Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState<Category>(categories[0]);
  const [newDesc, setNewDesc] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newFeatured, setNewFeatured] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // New Category State
  const [newCatName, setNewCatName] = useState("");

  // Review Form State
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRole, setNewReviewRole] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  // Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponPercent, setNewCouponPercent] = useState(10);

  // User Form State
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserPass, setNewUserPass] = useState("");
  const [newUserRole, setNewUserRole] = useState<UserRole>('SHOP_ADMIN');

  // Site Config State (Local buffer for form)
  const [config, setConfig] = useState(siteConfig);

  // Dummy Chart Data
  const chartData = [
      { name: 'Mon', sales: 4000 },
      { name: 'Tue', sales: 3000 },
      { name: 'Wed', sales: 2000 },
      { name: 'Thu', sales: 2780 },
      { name: 'Fri', sales: 1890 },
      { name: 'Sat', sales: 2390 },
      { name: 'Sun', sales: 3490 },
  ];

  useEffect(() => {
    if (siteConfig) {
        setConfig(siteConfig);
    }
  }, [siteConfig]);

  const handleGenerateAI = async () => {
    if (!newName) {
        alert("Please enter a product name first.");
        return;
    }
    setIsGenerating(true);
    const desc = await generateProductDescription(newName, newCategory, "luxury, trending, elegant");
    setNewDesc(desc);
    setIsGenerating(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, onComplete: (url: string) => void) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onloadend = () => {
          if (typeof reader.result === 'string') {
              onComplete(reader.result);
          }
      };
      reader.readAsDataURL(file);
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product: Product = {
      id: editingId || Date.now().toString(),
      name: newName,
      price: parseFloat(newPrice),
      category: newCategory,
      description: newDesc,
      image: newImage || `https://picsum.photos/seed/${Date.now()}/600/600`, // Fallback image
      isNew: !editingId,
      isFeatured: newFeatured
    };

    if (editingId) {
        onUpdateProduct(product);
        setEditingId(null);
        triggerToast("Product updated successfully!");
    } else {
        onAddProduct(product);
        triggerToast("Product added successfully!");
    }
    
    // Reset
    setNewName("");
    setNewPrice("");
    setNewDesc("");
    setNewImage("");
    setNewFeatured(false);
  };

  const handleEditClick = (p: Product) => {
      setEditingId(p.id);
      setNewName(p.name);
      setNewPrice(p.price.toString());
      setNewCategory(p.category);
      setNewDesc(p.description);
      setNewImage(p.image);
      setNewFeatured(!!p.isFeatured);
      setActiveTab('PRODUCTS');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
      setEditingId(null);
      setNewName("");
      setNewPrice("");
      setNewDesc("");
      setNewImage("");
      setNewFeatured(false);
  }

  const handleAddCategory = (e: React.FormEvent) => {
      e.preventDefault();
      if(newCatName && !categories.includes(newCatName)) {
          onAddCategory(newCatName);
          setNewCatName("");
          triggerToast("Category added!");
      } else {
          alert("Invalid or duplicate category.");
      }
  }

  const handleSaveConfig = () => {
      onUpdateSiteConfig(config);
      triggerToast("Settings saved successfully!");
  }

  // Helpers for deep editing
  const updateFeaturedCat = (idx: number, field: keyof FeaturedCategory, val: string) => {
      const newCats = [...config.featuredCategories];
      newCats[idx] = { ...newCats[idx], [field]: val };
      setConfig({...config, featuredCategories: newCats});
  }

  const updateHeroSlide = (idx: number, field: keyof HeroSlide, val: string) => {
      const newSlides = [...config.heroSlides];
      newSlides[idx] = { ...newSlides[idx], [field]: val };
      setConfig({...config, heroSlides: newSlides});
  }

  const updateUSP = (idx: number, field: keyof USPItem, val: string) => {
      const newUSPs = [...config.usps];
      newUSPs[idx] = { ...newUSPs[idx], [field]: val };
      setConfig({...config, usps: newUSPs});
  }

  const handleAddReview = () => {
      if(!newReviewName || !newReviewComment) return alert("Name and Comment are required");
      const newTestimonial: Testimonial = {
          id: Date.now().toString(),
          name: newReviewName,
          role: newReviewRole || "Customer",
          comment: newReviewComment,
          rating: newReviewRating
      };
      setConfig({...config, testimonials: [newTestimonial, ...config.testimonials]});
      setNewReviewName("");
      setNewReviewRole("");
      setNewReviewComment("");
      setNewReviewRating(5);
      triggerToast("Review added!");
  }

  const deleteTestimonial = (idx: number) => {
      if(window.confirm("Delete this review?")) {
          const newTestimonials = [...config.testimonials];
          newTestimonials.splice(idx, 1);
          setConfig({...config, testimonials: newTestimonials});
      }
  }

  const handleAddCoupon = () => {
      if (!newCouponCode) return alert("Enter a code");
      const newCoupon: Coupon = {
          code: newCouponCode.toUpperCase(),
          discountPercent: newCouponPercent,
          isActive: true
      };
      const updatedCoupons = [...(config.coupons || []), newCoupon];
      setConfig({...config, coupons: updatedCoupons});
      setNewCouponCode("");
      setNewCouponPercent(10);
      triggerToast("Coupon created!");
  }

  const toggleCoupon = (index: number) => {
      const updatedCoupons = [...config.coupons];
      updatedCoupons[index].isActive = !updatedCoupons[index].isActive;
      setConfig({...config, coupons: updatedCoupons});
  }

  const deleteCoupon = (index: number) => {
      if (window.confirm("Delete this coupon?")) {
          const updatedCoupons = [...config.coupons];
          updatedCoupons.splice(index, 1);
          setConfig({...config, coupons: updatedCoupons});
      }
  }

  const handleCreateUser = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newUserEmail || !newUserPass || !newUserName) return alert("Please fill all fields");
      const newUser: User = {
          id: Date.now().toString(),
          email: newUserEmail,
          password: newUserPass,
          name: newUserName,
          role: newUserRole
      };
      onAddUser(newUser);
      setNewUserEmail("");
      setNewUserName("");
      setNewUserPass("");
      triggerToast("User added successfully!");
  }

  // Define Tabs based on Role
  const canAccess = (role: UserRole, tab: AdminTab) => {
      if (role === 'SUPER_ADMIN') return true;
      if (role === 'SHOP_ADMIN') return ['DASHBOARD', 'PRODUCTS', 'CATEGORIES', 'STORE_DESIGN', 'ORDERS'].includes(tab);
      return false;
  };

  const ALL_TABS: { id: AdminTab, label: string, icon: React.ReactNode }[] = [
      { id: 'DASHBOARD', label: 'Dashboard', icon: <GridIcon className="w-5 h-5"/> },
      { id: 'ORDERS', label: 'Orders', icon: <FileTextIcon className="w-5 h-5"/> },
      { id: 'PRODUCTS', label: 'Products', icon: <BoxIcon className="w-5 h-5"/> },
      { id: 'CATEGORIES', label: 'Categories', icon: <TagIcon className="w-5 h-5"/> },
      { id: 'STORE_DESIGN', label: 'Store Design', icon: <LayoutIcon className="w-5 h-5"/> },
      { id: 'GENERAL_INFO', label: 'General Info', icon: <EditIcon className="w-5 h-5"/> },
      { id: 'SYSTEM_CONFIG', label: 'System Config', icon: <SettingsIcon className="w-5 h-5"/> },
      { id: 'REVIEWS', label: 'Reviews', icon: <StarIcon className="w-5 h-5"/> },
      { id: 'COUPONS', label: 'Coupons', icon: <TagIcon className="w-5 h-5"/> },
      { id: 'USERS', label: 'User Management', icon: <UserIcon className="w-5 h-5"/> },
  ];

  const TABS = ALL_TABS.filter(t => canAccess(user.role, t.id));


  return (
    <div className="flex h-screen overflow-hidden bg-transparent">
        {/* Sidebar */}
        <div className={`w-64 flex flex-col hidden md:flex ${GLASS_PANEL} rounded-r-2xl mr-4 my-4 overflow-y-auto custom-scrollbar`}>
            <div className="p-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                    {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Shop Manager'}
                </h2>
            </div>
            <nav className="flex-1 px-4 space-y-2 pb-6">
                {TABS.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)} 
                        className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-pink-600/20 text-pink-400 border border-pink-500/20' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-white/10">
                <button onClick={onLogout} className="flex items-center space-x-3 w-full px-4 py-2 text-zinc-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors">
                    <LogOutIcon className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>

        {/* Mobile Sidebar */}
        <div className="md:hidden flex flex-col w-full h-full">
             <div className="bg-zinc-900/80 backdrop-blur-md p-4 flex justify-between items-center border-b border-white/10">
                  <h2 className="text-lg font-bold text-white">Admin Panel</h2>
                  <button onClick={onLogout} className="text-zinc-400"><LogOutIcon /></button>
             </div>
             <div className="flex bg-zinc-900/80 backdrop-blur-md border-b border-white/10 overflow-x-auto">
                {TABS.map((t) => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex-1 py-3 px-4 text-sm font-medium whitespace-nowrap ${activeTab === t.id ? 'border-b-2 border-pink-500 text-pink-500' : 'text-zinc-400'}`}>
                        {t.label}
                    </button>
                ))}
             </div>
             <main className="flex-1 overflow-y-auto bg-transparent p-4">
                 {renderAdminContent(activeTab)}
             </main>
        </div>


        {/* Desktop Main Content */}
        <main className="flex-1 overflow-y-auto bg-transparent p-8 hidden md:block relative">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white uppercase tracking-wider">{activeTab.replace('_', ' ')}</h1>
                <div className="text-zinc-400 text-sm">Welcome back, {user.name}</div>
            </header>
            {renderAdminContent(activeTab)}

            {/* Custom Toast Notification */}
            <div className={`fixed bottom-8 right-8 transition-all duration-500 transform ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                <div className={`${GLASS_PANEL} px-6 py-4 rounded-xl flex items-center gap-3 border-l-4 border-l-pink-500 shadow-2xl`}>
                    <div className="bg-pink-500/20 p-2 rounded-full">
                        <SparklesIcon className="w-5 h-5 text-pink-500" />
                    </div>
                    <span className="font-medium text-white">{toastMsg}</span>
                </div>
            </div>
        </main>
    </div>
  );

  function renderAdminContent(tab: AdminTab) {
      // Security Check for rendered content
      if (!canAccess(user.role, tab)) return <div className="text-red-500 p-8">Access Denied</div>;

      switch(tab) {
          case 'DASHBOARD':
              return (
                  <div className="space-y-8 animate-in fade-in duration-500">
                      {/* Redesigned Metric Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          <div className={`${GLASS_PANEL} p-5 rounded-xl relative overflow-hidden group hover:bg-white/10 transition-colors`}>
                              <div className="flex justify-between items-start">
                                  <div>
                                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Total Sales</p>
                                      <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                                          ৳{orders.reduce((sum, o) => sum + o.finalTotal, 0).toLocaleString()}
                                      </h3>
                                  </div>
                                  <div className="p-2 bg-pink-500/20 rounded-lg text-pink-500 group-hover:scale-110 transition-transform">
                                      <BarChartIcon className="w-5 h-5" />
                                  </div>
                              </div>
                          </div>

                          <div className={`${GLASS_PANEL} p-5 rounded-xl relative overflow-hidden group hover:bg-white/10 transition-colors`}>
                              <div className="flex justify-between items-start">
                                  <div>
                                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Total Profit</p>
                                      <h3 className="text-2xl font-bold text-green-400">
                                          ৳{(orders.reduce((sum, o) => sum + o.finalTotal, 0) * 0.35).toLocaleString()}
                                      </h3>
                                      <span className="text-[10px] text-zinc-500 font-medium mt-1 block">Est. 35% Margin</span>
                                  </div>
                                  <div className="p-2 bg-green-500/20 rounded-lg text-green-500 group-hover:scale-110 transition-transform">
                                      <CrownIcon className="w-5 h-5" />
                                  </div>
                              </div>
                          </div>

                          <div className={`${GLASS_PANEL} p-5 rounded-xl relative overflow-hidden group hover:bg-white/10 transition-colors`}>
                              <div className="flex justify-between items-start">
                                  <div>
                                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Total Orders</p>
                                      <h3 className="text-2xl font-bold text-white">
                                          {orders.length}
                                      </h3>
                                  </div>
                                  <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                                      <FileTextIcon className="w-5 h-5" />
                                  </div>
                              </div>
                          </div>

                          <div className={`${GLASS_PANEL} p-5 rounded-xl relative overflow-hidden group hover:bg-white/10 transition-colors`}>
                              <div className="flex justify-between items-start">
                                  <div>
                                      <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1">Inventory</p>
                                      <h3 className="text-2xl font-bold text-white">
                                          {products.length} <span className="text-sm font-normal text-zinc-500">Items</span>
                                      </h3>
                                  </div>
                                  <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400 group-hover:scale-110 transition-transform">
                                      <BoxIcon className="w-5 h-5" />
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className={`${GLASS_PANEL} p-6 rounded-xl h-96`}>
                          <h3 className="text-lg font-bold text-white mb-6">Weekly Sales Performance</h3>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="sales" fill="#ec4899" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                      </div>
                  </div>
              );
          case 'ORDERS':
              return (
                  <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                      <h3 className="text-xl font-bold text-white mb-6">Recent Orders</h3>
                      <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                              <thead>
                                  <tr className="text-zinc-500 border-b border-white/10 text-sm uppercase">
                                      <th className="p-3">ID</th>
                                      <th className="p-3">Customer</th>
                                      <th className="p-3">Total</th>
                                      <th className="p-3">Status</th>
                                      <th className="p-3">Action</th>
                                  </tr>
                              </thead>
                              <tbody className="text-zinc-300 text-sm">
                                  {orders.map(o => (
                                      <tr key={o.id} className="border-b border-white/5 hover:bg-white/5">
                                          <td className="p-3">#{o.id.slice(-6)}</td>
                                          <td className="p-3">{o.details.fullName}</td>
                                          <td className="p-3">৳{o.finalTotal}</td>
                                          <td className="p-3">
                                              <span className={`px-2 py-1 rounded text-xs font-bold ${o.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{o.status}</span>
                                          </td>
                                          <td className="p-3">
                                              <select 
                                                  value={o.status} 
                                                  onChange={(e) => onUpdateOrder({...o, status: e.target.value as any})}
                                                  className="bg-black/40 border border-white/10 rounded px-2 py-1 outline-none text-xs"
                                              >
                                                  <option>Pending</option>
                                                  <option>Processing</option>
                                                  <option>Shipped</option>
                                                  <option>Delivered</option>
                                                  <option>Cancelled</option>
                                              </select>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              );
          case 'PRODUCTS':
              return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                       <div className={`lg:col-span-2 p-6 rounded-xl ${GLASS_PANEL}`}>
                           <h3 className="text-xl font-bold text-white mb-6">Product Inventory</h3>
                           <div className="grid grid-cols-1 gap-4">
                               {products.map(p => (
                                   <div key={p.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-lg border border-white/5 hover:border-pink-500/30 transition-colors">
                                       <img src={p.image} className="w-16 h-16 rounded object-cover" alt={p.name} />
                                       <div className="flex-1">
                                           <h4 className="font-bold text-white">{p.name}</h4>
                                           <p className="text-xs text-zinc-400">{p.category} • ৳{p.price}</p>
                                       </div>
                                       <div className="flex gap-2">
                                           <button onClick={() => handleEditClick(p)} className="p-2 bg-white/10 rounded hover:text-pink-400"><EditIcon className="w-4 h-4" /></button>
                                           <button onClick={() => onDeleteProduct(p.id)} className="p-2 bg-white/10 rounded hover:text-red-400"><TrashIcon className="w-4 h-4" /></button>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                       <div className={`p-6 rounded-xl h-fit ${GLASS_PANEL}`}>
                           <h3 className="text-xl font-bold text-white mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h3>
                           <form onSubmit={handleSubmitProduct} className="space-y-4">
                               <input placeholder="Product Name" value={newName} onChange={e => setNewName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 outline-none focus:border-pink-500 text-sm" />
                               <div className="flex gap-2">
                                   <input type="number" placeholder="Price" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-1/2 bg-black/40 border border-white/10 rounded px-3 py-2 outline-none focus:border-pink-500 text-sm" />
                                   <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-1/2 bg-black/40 border border-white/10 rounded px-3 py-2 outline-none focus:border-pink-500 text-sm text-zinc-300">
                                       {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                   </select>
                               </div>
                               <textarea placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 outline-none focus:border-pink-500 text-sm h-24" />
                               <button type="button" onClick={handleGenerateAI} disabled={isGenerating} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-2 rounded text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90">
                                   {isGenerating ? 'Generating...' : <><SparklesIcon className="w-3 h-3" /> Generate Description with AI</>}
                               </button>
                               <div className="border border-dashed border-white/20 rounded p-4 text-center cursor-pointer hover:bg-white/5 relative">
                                   <input type="file" onChange={(e) => handleFileUpload(e, setNewImage)} className="absolute inset-0 opacity-0 cursor-pointer" />
                                   <UploadIcon className="w-6 h-6 mx-auto mb-2 text-zinc-500" />
                                   <span className="text-xs text-zinc-500">Click to upload image</span>
                               </div>
                               {newImage && <img src={newImage} className="w-full h-32 object-cover rounded" />}
                               <label className="flex items-center gap-2 text-sm text-zinc-400">
                                   <input type="checkbox" checked={newFeatured} onChange={e => setNewFeatured(e.target.checked)} /> Mark as Featured
                               </label>
                               <div className="flex gap-2">
                                   <button type="submit" className="flex-1 bg-pink-600 py-2 rounded font-bold hover:bg-pink-700">{editingId ? 'Update' : 'Add Product'}</button>
                                   {editingId && <button type="button" onClick={handleCancelEdit} className="px-4 bg-white/10 rounded">Cancel</button>}
                               </div>
                           </form>
                       </div>
                  </div>
              );
          case 'CATEGORIES':
              return (
                  <div className={`p-6 rounded-xl ${GLASS_PANEL} max-w-2xl`}>
                      <h3 className="text-xl font-bold text-white mb-6">Manage Categories</h3>
                      <ul className="space-y-2 mb-6">
                          {categories.map(c => (
                              <li key={c} className="flex justify-between items-center bg-white/5 p-3 rounded">
                                  <span>{c}</span>
                                  <button onClick={() => onDeleteCategory(c)} className="text-red-400 hover:text-red-300"><TrashIcon className="w-4 h-4" /></button>
                              </li>
                          ))}
                      </ul>
                      <form onSubmit={handleAddCategory} className="flex gap-2">
                          <input placeholder="New Category Name" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 outline-none focus:border-pink-500" />
                          <button className="bg-pink-600 px-6 rounded font-bold hover:bg-pink-700">Add</button>
                      </form>
                  </div>
              );
          case 'STORE_DESIGN':
              return (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in pb-20">
                      {/* Hero Slides Editor */}
                      <div className={`p-6 rounded-xl ${GLASS_PANEL} col-span-1 lg:col-span-2`}>
                          <h3 className="text-xl font-bold text-white mb-4">Hero Carousel</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {config.heroSlides.map((slide, idx) => (
                                  <div key={idx} className="bg-white/5 p-4 rounded-lg space-y-3">
                                      <span className="text-xs text-zinc-500 font-bold uppercase">Slide {idx + 1}</span>
                                      <input value={slide.title} onChange={e => updateHeroSlide(idx, 'title', e.target.value)} placeholder="Title" className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs" />
                                      <input value={slide.subtitle} onChange={e => updateHeroSlide(idx, 'subtitle', e.target.value)} placeholder="Subtitle" className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs" />
                                      <input value={slide.cta} onChange={e => updateHeroSlide(idx, 'cta', e.target.value)} placeholder="Button Text" className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs" />
                                      <div className="relative h-20 w-full bg-black/50 rounded overflow-hidden group">
                                          <img src={slide.image} className="w-full h-full object-cover opacity-50" />
                                          <input type="file" onChange={(e) => handleFileUpload(e, (url) => updateHeroSlide(idx, 'image', url))} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><span className="text-xs text-zinc-300">Click to Change Image</span></div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Featured Categories */}
                      <div className={`p-6 rounded-xl ${GLASS_PANEL} col-span-1 lg:col-span-2`}>
                          <h3 className="text-xl font-bold text-white mb-4">Featured Categories Grid</h3>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              {config.featuredCategories.map((cat, idx) => (
                                  <div key={idx} className="bg-white/5 p-4 rounded-lg space-y-2">
                                      <input value={cat.name} onChange={e => updateFeaturedCat(idx, 'name', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs" />
                                      <select value={cat.filterValue} onChange={e => updateFeaturedCat(idx, 'filterValue', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-zinc-300">
                                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                      </select>
                                      <div className="relative h-20 w-full bg-black/50 rounded overflow-hidden group">
                                          <img src={cat.image} className="w-full h-full object-cover" />
                                          <input type="file" onChange={(e) => handleFileUpload(e, (url) => updateFeaturedCat(idx, 'image', url))} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* USPs */}
                      <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                          <h3 className="text-xl font-bold text-white mb-4">Unique Selling Points</h3>
                          <div className="space-y-3">
                              {config.usps.map((usp, idx) => (
                                  <div key={idx} className="flex gap-2">
                                      <select value={usp.icon} onChange={e => updateUSP(idx, 'icon', e.target.value)} className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-zinc-300 w-24">
                                          <option value="TRUCK">Truck</option>
                                          <option value="SHIELD">Shield</option>
                                          <option value="REFRESH">Refresh</option>
                                          <option value="CROWN">Crown</option>
                                      </select>
                                      <input value={usp.text} onChange={e => updateUSP(idx, 'text', e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs" />
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* Style Toggles */}
                      <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                          <h3 className="text-xl font-bold text-white mb-4">Visual Settings</h3>
                          <div className="flex items-center justify-between p-3 bg-black/20 rounded mb-2">
                              <span>Show Product Marquee</span>
                              <input type="checkbox" checked={config.showMarquee} onChange={e => setConfig({...config, showMarquee: e.target.checked})} className="accent-pink-500 w-5 h-5" />
                          </div>
                          <div className="flex items-center justify-between p-3 bg-black/20 rounded">
                              <span>Show Top Bar</span>
                              <input type="checkbox" checked={config.showTopBar} onChange={e => setConfig({...config, showTopBar: e.target.checked})} className="accent-pink-500 w-5 h-5" />
                          </div>
                      </div>

                      <button onClick={handleSaveConfig} className="col-span-1 lg:col-span-2 w-full bg-pink-600 hover:bg-pink-700 py-3 rounded-xl font-bold text-lg shadow-lg shadow-pink-600/20">Save Design Changes</button>
                  </div>
              );
          case 'GENERAL_INFO':
              return (
                  <div className={`p-6 rounded-xl ${GLASS_PANEL} max-w-3xl animate-in fade-in`}>
                      <h3 className="text-xl font-bold text-white mb-6">General Information</h3>
                      <div className="space-y-6">
                          <div>
                              <label className="text-xs text-zinc-500 uppercase block mb-1">Store Name</label>
                              <input value={config.headerTitle} onChange={e => setConfig({...config, headerTitle: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 outline-none focus:border-pink-500 text-sm" />
                          </div>
                          <div>
                              <label className="text-xs text-zinc-500 uppercase block mb-1">Logo URL</label>
                              <div className="flex gap-2">
                                  <input value={config.logo} onChange={e => setConfig({...config, logo: e.target.value})} className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 outline-none focus:border-pink-500 text-sm" placeholder="https://..." />
                                  <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center overflow-hidden">
                                      {config.logo ? <img src={config.logo} alt="Logo" className="w-full h-full object-cover" /> : <span className="text-xs">Logo</span>}
                                  </div>
                              </div>
                          </div>
                          <div>
                              <label className="text-xs text-zinc-500 uppercase block mb-1">Footer Text</label>
                              <textarea value={config.footerText} onChange={e => setConfig({...config, footerText: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 outline-none focus:border-pink-500 text-sm" rows={3} />
                          </div>
                          <div>
                              <label className="text-xs text-zinc-500 uppercase block mb-1">Contact Info</label>
                              <div className="grid grid-cols-2 gap-4">
                                  <input value={config.contactInfo.email} onChange={e => setConfig({...config, contactInfo: {...config.contactInfo, email: e.target.value}})} placeholder="Email" className="bg-black/40 border border-white/10 rounded px-3 py-2 outline-none focus:border-pink-500 text-sm" />
                                  <input value={config.contactInfo.phone} onChange={e => setConfig({...config, contactInfo: {...config.contactInfo, phone: e.target.value}})} placeholder="Phone" className="bg-black/40 border border-white/10 rounded px-3 py-2 outline-none focus:border-pink-500 text-sm" />
                              </div>
                          </div>
                          <button onClick={handleSaveConfig} className="bg-pink-600 hover:bg-pink-700 py-2 px-6 rounded font-bold transition-colors">Save Changes</button>
                      </div>
                  </div>
              );

          case 'SYSTEM_CONFIG':
              return (
                  <div className={`p-6 rounded-xl ${GLASS_PANEL} max-w-3xl animate-in fade-in`}>
                      <h3 className="text-xl font-bold text-white mb-6">System Configuration</h3>
                      <div className="space-y-8">
                          <div>
                              <h4 className="font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">Payment Settings (bKash)</h4>
                              <div className="flex items-center gap-4 mb-4">
                                  <span className="text-sm text-zinc-300">Enable bKash</span>
                                  <input type="checkbox" checked={config.checkout.enableBkash} onChange={e => setConfig({...config, checkout: {...config.checkout, enableBkash: e.target.checked}})} className="accent-pink-500 w-4 h-4" />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <input value={config.checkout.bkashNumber} onChange={e => setConfig({...config, checkout: {...config.checkout, bkashNumber: e.target.value}})} placeholder="bKash Number" className="bg-black/40 border border-white/10 rounded px-3 py-2 outline-none focus:border-pink-500 text-sm" />
                                  <textarea value={config.checkout.bkashInstructions} onChange={e => setConfig({...config, checkout: {...config.checkout, bkashInstructions: e.target.value}})} placeholder="Instructions" className="bg-black/40 border border-white/10 rounded px-3 py-2 outline-none focus:border-pink-500 text-sm md:col-span-2" rows={2} />
                              </div>
                          </div>
                          <div>
                              <h4 className="font-bold text-pink-400 mb-4 border-b border-pink-500/20 pb-2">SMTP Settings (Email)</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <input value={config.smtp.host} onChange={e => setConfig({...config, smtp: {...config.smtp, host: e.target.value}})} placeholder="Host" className="bg-black/40 border border-white/10 rounded px-3 py-2 outline-none focus:border-pink-500 text-sm" />
                                  <input value={config.smtp.port} onChange={e => setConfig({...config, smtp: {...config.smtp, port: e.target.value}})} placeholder="Port" className="bg-black/40 border border-white/10 rounded px-3 py-2 outline-none focus:border-pink-500 text-sm" />
                                  <input value={config.smtp.user} onChange={e => setConfig({...config, smtp: {...config.smtp, user: e.target.value}})} placeholder="User" className="bg-black/40 border border-white/10 rounded px-3 py-2 outline-none focus:border-pink-500 text-sm" />
                                  <input value={config.smtp.pass} onChange={e => setConfig({...config, smtp: {...config.smtp, pass: e.target.value}})} type="password" placeholder="Password" className="bg-black/40 border border-white/10 rounded px-3 py-2 outline-none focus:border-pink-500 text-sm" />
                              </div>
                          </div>
                          <button onClick={handleSaveConfig} className="bg-pink-600 hover:bg-pink-700 py-2 px-6 rounded font-bold transition-colors">Save System Config</button>
                      </div>
                  </div>
              );

          case 'REVIEWS':
              return (
                  <div className={`p-6 rounded-xl ${GLASS_PANEL} max-w-4xl`}>
                       <h3 className="text-xl font-bold text-white mb-6">Customer Reviews</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div>
                               <h4 className="font-bold text-zinc-400 mb-4 text-sm uppercase">Add Review</h4>
                               <div className="space-y-3">
                                   <input value={newReviewName} onChange={e => setNewReviewName(e.target.value)} placeholder="Customer Name" className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm" />
                                   <input value={newReviewRole} onChange={e => setNewReviewRole(e.target.value)} placeholder="Role (e.g. Verified Buyer)" className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm" />
                                   <textarea value={newReviewComment} onChange={e => setNewReviewComment(e.target.value)} placeholder="Comment" className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm" rows={3} />
                                   <div className="flex items-center gap-2">
                                       <span className="text-sm text-zinc-400">Rating:</span>
                                       <select value={newReviewRating} onChange={e => setNewReviewRating(Number(e.target.value))} className="bg-black/40 border border-white/10 rounded px-2 py-1 text-sm">
                                           {[1,2,3,4,5].map(r => <option key={r} value={r}>{r}</option>)}
                                       </select>
                                   </div>
                                   <button onClick={handleAddReview} className="bg-pink-600 hover:bg-pink-700 py-2 px-4 rounded text-sm font-bold">Add Review</button>
                               </div>
                           </div>
                           <div className="max-h-96 overflow-y-auto custom-scrollbar">
                               <h4 className="font-bold text-zinc-400 mb-4 text-sm uppercase">Existing Reviews</h4>
                               <div className="space-y-3">
                                   {config.testimonials.map((t, idx) => (
                                       <div key={t.id} className="bg-white/5 p-3 rounded border border-white/5 relative group">
                                           <button onClick={() => deleteTestimonial(idx)} className="absolute top-2 right-2 text-zinc-500 hover:text-red-400"><XIcon className="w-4 h-4"/></button>
                                           <p className="font-bold text-white text-sm">{t.name}</p>
                                           <p className="text-xs text-zinc-400 italic">"{t.comment}"</p>
                                           <div className="flex text-yellow-500 mt-1">
                                               {[...Array(t.rating)].map((_, i) => (
                                                   <React.Fragment key={i}>
                                                       <StarIcon className="w-3 h-3 fill-current" />
                                                   </React.Fragment>
                                               ))}
                                           </div>
                                       </div>
                                   ))}
                               </div>
                           </div>
                       </div>
                       <div className="mt-6 border-t border-white/10 pt-4">
                          <button onClick={handleSaveConfig} className="bg-white/10 hover:bg-white/20 py-2 px-6 rounded font-bold transition-colors">Save Review Changes</button>
                       </div>
                  </div>
              );
          case 'COUPONS':
              return (
                  <div className={`p-6 rounded-xl ${GLASS_PANEL} max-w-4xl`}>
                      <h3 className="text-xl font-bold text-white mb-6">Manage Coupons</h3>
                      <div className="flex flex-col md:flex-row gap-8">
                          <div className="flex-1 space-y-4">
                              <div className="bg-white/5 p-4 rounded-lg">
                                  <h4 className="font-bold text-pink-400 mb-3 text-sm uppercase">Create Coupon</h4>
                                  <div className="flex gap-2 mb-2">
                                      <input value={newCouponCode} onChange={e => setNewCouponCode(e.target.value)} placeholder="Code (e.g. SALE50)" className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-sm uppercase" />
                                      <input type="number" value={newCouponPercent} onChange={e => setNewCouponPercent(Number(e.target.value))} placeholder="%" className="w-20 bg-black/40 border border-white/10 rounded px-3 py-2 text-sm" />
                                  </div>
                                  <button onClick={handleAddCoupon} className="w-full bg-pink-600 hover:bg-pink-700 py-2 rounded text-sm font-bold">Create Coupon</button>
                              </div>
                          </div>
                          <div className="flex-1">
                              <h4 className="font-bold text-zinc-400 mb-3 text-sm uppercase">Active Coupons</h4>
                              <div className="space-y-2">
                                  {config.coupons.map((c, idx) => (
                                      <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded border border-white/5">
                                          <div>
                                              <span className="font-bold text-white block">{c.code}</span>
                                              <span className="text-xs text-pink-400">{c.discountPercent}% Off</span>
                                          </div>
                                          <div className="flex items-center gap-3">
                                              <button onClick={() => toggleCoupon(idx)} className={`text-xs px-2 py-1 rounded ${c.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                  {c.isActive ? 'Active' : 'Inactive'}
                                              </button>
                                              <button onClick={() => deleteCoupon(idx)} className="text-zinc-500 hover:text-red-400"><TrashIcon className="w-4 h-4"/></button>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                       <div className="mt-6 border-t border-white/10 pt-4">
                          <button onClick={handleSaveConfig} className="bg-white/10 hover:bg-white/20 py-2 px-6 rounded font-bold transition-colors">Save Coupon Changes</button>
                       </div>
                  </div>
              );
          case 'USERS':
              return (
                  <div className={`p-6 rounded-xl ${GLASS_PANEL} max-w-4xl`}>
                       <h3 className="text-xl font-bold text-white mb-6">User Management</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div>
                                <h4 className="font-bold text-pink-400 mb-3 text-sm uppercase">Add User</h4>
                                <form onSubmit={handleCreateUser} className="space-y-3">
                                    <input value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="Name" className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm" />
                                    <input type="email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} placeholder="Email" className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm" />
                                    <input type="password" value={newUserPass} onChange={e => setNewUserPass(e.target.value)} placeholder="Password" className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm" />
                                    <select value={newUserRole} onChange={e => setNewUserRole(e.target.value as UserRole)} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-sm text-zinc-300">
                                        <option value="SHOP_ADMIN">Shop Manager</option>
                                        <option value="CUSTOMER">Customer</option>
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                    </select>
                                    <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 py-2 rounded text-sm font-bold">Create User</button>
                                </form>
                           </div>
                           <div>
                               <h4 className="font-bold text-zinc-400 mb-3 text-sm uppercase">Existing Users</h4>
                               <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
                                   {users.map(u => (
                                       <div key={u.id} className="flex items-center justify-between bg-white/5 p-3 rounded border border-white/5">
                                           <div>
                                               <p className="font-bold text-white text-sm">{u.name}</p>
                                               <p className="text-xs text-zinc-400">{u.email}</p>
                                               <span className="text-[10px] bg-white/10 px-1 rounded text-zinc-300">{u.role}</span>
                                           </div>
                                           {u.role !== 'SUPER_ADMIN' && (
                                               <button onClick={() => onDeleteUser(u.id)} className="text-zinc-500 hover:text-red-400"><TrashIcon className="w-4 h-4"/></button>
                                           )}
                                       </div>
                                   ))}
                               </div>
                           </div>
                       </div>
                  </div>
              );
          default:
              return null;
      }
  }
};

// Helper for Cart Sidebar
const CartSidebar = ({ isOpen, onClose, cart, onRemove, onUpdateQty, onCheckout, total }: any) => {
    return (
        <div className={`fixed inset-0 z-[70] transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
            <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose}></div>
            <div className={`absolute top-0 bottom-0 right-0 w-full max-w-md bg-zinc-900/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <ShoppingBagIcon className="w-5 h-5 text-pink-500" /> My Cart
                        </h2>
                        <button onClick={onClose} className="text-zinc-400 hover:text-white"><XIcon /></button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
                        {cart.length === 0 ? (
                            <div className="text-center py-20 text-zinc-500">
                                <p>Your cart is empty.</p>
                            </div>
                        ) : (
                            cart.map((item: CartItem) => (
                                <div key={item.id} className="flex gap-4 bg-white/5 p-3 rounded-lg border border-white/5">
                                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                                    <div className="flex-1">
                                        <h4 className="font-bold text-white text-sm">{item.name}</h4>
                                        <p className="text-pink-400 font-bold text-sm">৳{item.price.toLocaleString()}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center bg-black/40 rounded">
                                                <button onClick={() => onUpdateQty(item.id, -1)} className="px-2 py-1 text-zinc-400 hover:text-white">-</button>
                                                <span className="text-xs font-medium text-white px-1">{item.quantity}</span>
                                                <button onClick={() => onUpdateQty(item.id, 1)} className="px-2 py-1 text-zinc-400 hover:text-white">+</button>
                                            </div>
                                            <button onClick={() => onRemove(item.id)} className="text-zinc-500 hover:text-red-400 ml-auto"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="border-t border-white/10 pt-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-zinc-400">Total</span>
                            <span className="text-xl font-bold text-white">৳{total.toLocaleString()}</span>
                        </div>
                        <button 
                            disabled={cart.length === 0}
                            onClick={onCheckout}
                            className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-zinc-700 disabled:cursor-not-allowed py-3 rounded-xl font-bold text-white shadow-lg shadow-pink-600/20"
                        >
                            Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const App = () => {
  const [activeView, setActiveView] = useState<ViewState>('HOME');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Session
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Modals & Selection
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);

  // Derived
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product: Product) => {
      setCart(prev => {
          const existing = prev.find(item => item.id === product.id);
          if (existing) {
              return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
          }
          return [...prev, { ...product, quantity: 1 }];
      });
  };

  const handleRemoveFromCart = (id: string) => {
      setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
      setCart(prev => prev.map(item => {
          if (item.id === id) {
              const newQty = Math.max(1, item.quantity + delta);
              return { ...item, quantity: newQty };
          }
          return item;
      }));
  };

  const handleCheckout = (details: CheckoutDetails, discount: number, finalTotal: number) => {
      const newOrder: Order = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          details,
          items: [...cart],
          total: cartTotal,
          discountApplied: discount,
          finalTotal,
          status: 'Pending'
      };
      setOrders([newOrder, ...orders]);
      setCart([]);
      setIsCheckoutOpen(false);
      alert(`Order Placed Successfully! ID: ${newOrder.id}`);
  };

  const handleLogin = (email: string, pass: string) => {
      const user = users.find(u => u.email === email && u.password === pass);
      if (user) {
          setCurrentUser(user);
          setActiveView(user.role.includes('ADMIN') ? 'ADMIN' : 'HOME');
      } else {
          alert("Invalid credentials");
      }
  };

  const handleRegister = (name: string, email: string, pass: string) => {
      if(users.find(u => u.email === email)) return alert("Email already exists");
      const newUser: User = {
          id: Date.now().toString(),
          name,
          email,
          role: 'CUSTOMER',
          password: pass
      };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setActiveView('HOME');
  };

  const handleCategoryClick = (cat: string) => {
      setSearchQuery(cat);
      setActiveView('SHOP');
  }

  // --- Views ---

  const renderMainContent = () => {
      if (activeView === 'HOME') {
          return (
              <>
                  <HeroCarousel slides={siteConfig.heroSlides} onShopClick={() => setActiveView('SHOP')} />
                  {siteConfig.showMarquee && <ProductMarquee products={products.filter(p => p.isFeatured)} onProductClick={(p) => { setSelectedProduct(p); setIsProductModalOpen(true); }} />}
                  <CategoryGrid categories={siteConfig.featuredCategories} onCategoryClick={handleCategoryClick} />
                  
                  {/* Newly added All Products Section */}
                  <div className="max-w-7xl mx-auto px-4 py-12 border-t border-white/5">
                      <h2 className="text-2xl font-bold text-center text-white mb-8">Discover Our Collection</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {products.map(p => (
                              <ProductCard
                                  key={p.id}
                                  product={p}
                                  onAddToCart={handleAddToCart}
                                  onClick={() => { setSelectedProduct(p); setIsProductModalOpen(true); }}
                              />
                          ))}
                      </div>
                      <div className="text-center mt-8">
                          <button onClick={() => setActiveView('SHOP')} className="px-8 py-3 border border-white/10 rounded-full text-sm font-bold text-white hover:bg-white/10 transition-colors">
                              View All Products
                          </button>
                      </div>
                  </div>

                  <USPMarquee usps={siteConfig.usps} />
                  <TestimonialSection testimonials={siteConfig.testimonials} />
                  <NewsletterSection />
              </>
          );
      }
      
      if (activeView === 'SHOP') {
          return (
              <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
                  <h2 className="text-3xl font-bold text-white mb-8">Shop Collection</h2>
                  
                  {/* Category Filter Pills */}
                  <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                      <button onClick={() => setSearchQuery('')} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${searchQuery === '' ? 'bg-pink-600 text-white' : 'bg-white/5 text-zinc-400 hover:text-white'}`}>All</button>
                      {categories.map(cat => (
                           <button key={cat} onClick={() => setSearchQuery(cat)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${searchQuery === cat ? 'bg-pink-600 text-white' : 'bg-white/5 text-zinc-400 hover:text-white'}`}>{cat}</button>
                      ))}
                  </div>

                  {filteredProducts.length === 0 ? (
                      <div className="text-center py-20 text-zinc-500">
                          <p>No products found matching your criteria.</p>
                      </div>
                  ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {filteredProducts.map(product => (
                              <ProductCard 
                                  key={product.id} 
                                  product={product} 
                                  onAddToCart={handleAddToCart} 
                                  onClick={() => { setSelectedProduct(product); setIsProductModalOpen(true); }}
                              />
                          ))}
                      </div>
                  )}
              </div>
          );
      }

      if (activeView === 'ADMIN' && currentUser && currentUser.role.includes('ADMIN')) {
          return (
              <AdminDashboard 
                  user={currentUser}
                  products={products}
                  orders={orders}
                  categories={categories}
                  siteConfig={siteConfig}
                  users={users}
                  onAddProduct={(p) => setProducts([...products, p])}
                  onUpdateProduct={(p) => setProducts(products.map(pr => pr.id === p.id ? p : pr))}
                  onDeleteProduct={(id) => setProducts(products.filter(p => p.id !== id))}
                  onAddCategory={(c) => setCategories([...categories, c])}
                  onDeleteCategory={(c) => setCategories(categories.filter(x => x !== c))}
                  onUpdateSiteConfig={setSiteConfig}
                  onUpdateOrder={(o) => setOrders(orders.map(or => or.id === o.id ? o : or))}
                  onAddUser={(u) => setUsers([...users, u])}
                  onDeleteUser={(id) => setUsers(users.filter(u => u.id !== id))}
                  onLogout={() => { setCurrentUser(null); setActiveView('HOME'); }}
              />
          );
      }

      if (activeView === 'USER_DASHBOARD' && currentUser) {
          return <UserDashboard user={currentUser} orders={orders} onLogout={() => { setCurrentUser(null); setActiveView('HOME'); }} />;
      }

      if (activeView === 'LOGIN') {
          return (
              <div className="min-h-screen flex items-center justify-center p-4">
                  <div className={`w-full max-w-md p-8 rounded-2xl ${GLASS_PANEL}`}>
                       <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
                       <form onSubmit={(e: React.FormEvent) => {
                           e.preventDefault();
                           const target = e.target as typeof e.target & {
                               email: { value: string };
                               password: { value: string };
                           };
                           handleLogin(target.email.value, target.password.value);
                       }} className="space-y-4">
                           <input name="email" type="email" placeholder="Email" required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none" />
                           <input name="password" type="password" placeholder="Password" required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none" />
                           <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 py-3 rounded-lg font-bold text-white transition-all">Log In</button>
                       </form>
                       <p className="mt-4 text-center text-zinc-400 text-sm">
                           Don't have an account? <button onClick={() => setActiveView('REGISTER')} className="text-pink-400 hover:underline">Register</button>
                       </p>
                  </div>
              </div>
          );
      }

      if (activeView === 'REGISTER') {
          return (
              <div className="min-h-screen flex items-center justify-center p-4">
                  <div className={`w-full max-w-md p-8 rounded-2xl ${GLASS_PANEL}`}>
                       <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
                       <form onSubmit={(e: React.FormEvent) => {
                           e.preventDefault();
                           const target = e.target as typeof e.target & {
                               name: { value: string };
                               email: { value: string };
                               password: { value: string };
                           };
                           handleRegister(target.name.value, target.email.value, target.password.value);
                       }} className="space-y-4">
                           <input name="name" placeholder="Full Name" required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none" />
                           <input name="email" type="email" placeholder="Email" required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none" />
                           <input name="password" type="password" placeholder="Password" required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none" />
                           <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 py-3 rounded-lg font-bold text-white transition-all">Sign Up</button>
                       </form>
                       <p className="mt-4 text-center text-zinc-400 text-sm">
                           Already have an account? <button onClick={() => setActiveView('LOGIN')} className="text-pink-400 hover:underline">Log In</button>
                       </p>
                  </div>
              </div>
          );
      }

      if (activeView === 'BLOG') {
          return (
              <div className="max-w-7xl mx-auto px-4 py-12">
                  <h2 className="text-3xl font-bold text-white mb-8">Latest Stories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {INITIAL_BLOG_POSTS.map(post => (
                          <div key={post.id} onClick={() => setSelectedBlogPost(post)} className={`group cursor-pointer rounded-xl overflow-hidden ${GLASS_CARD}`}>
                              <div className="h-48 overflow-hidden">
                                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              </div>
                              <div className="p-6">
                                  <div className="flex gap-2 text-xs text-pink-400 mb-2">
                                      <span>{post.date}</span>
                                      <span>•</span>
                                      <span>{post.author}</span>
                                  </div>
                                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">{post.title}</h3>
                                  <p className="text-zinc-400 text-sm line-clamp-3">{post.excerpt}</p>
                                  <span className="inline-block mt-4 text-sm font-medium text-white border-b border-pink-500 pb-0.5">Read More</span>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          );
      }
      
      return null;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-pink-500/30 flex flex-col">
        {siteConfig.showTopBar && <CouponMarquee text={siteConfig.topBarText} />}
        
        <Navbar 
            cartCount={cartCount} 
            onCartClick={() => setIsCartOpen(true)}
            onNavClick={setActiveView}
            activeView={activeView}
            siteConfig={siteConfig}
            onMenuClick={() => setIsDrawerOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentUser={currentUser}
            onLogout={() => { setCurrentUser(null); setActiveView('HOME'); }}
        />

        <div className={`fixed inset-0 z-[70] transition-opacity duration-300 ${isDrawerOpen && activeView !== 'HOME' ? 'pointer-events-auto' : ''} ${isDrawerOpen ? 'visible' : 'invisible'}`}>
            <MobileDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => setIsDrawerOpen(false)} 
                onNavClick={setActiveView} 
                categories={categories}
                onCategoryClick={handleCategoryClick}
            />
        </div>

        <CartSidebar 
             isOpen={isCartOpen} 
             onClose={() => setIsCartOpen(false)} 
             cart={cart} 
             onRemove={handleRemoveFromCart}
             onUpdateQty={handleUpdateQuantity}
             onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
             total={cartTotal}
        />

        <div className="flex-1">
            {renderMainContent()}
        </div>

        {activeView !== 'ADMIN' && siteConfig.showMarquee && <PaymentMarquee />}
        {activeView !== 'ADMIN' && <SocialMarquee />}
        {activeView !== 'ADMIN' && <Footer config={siteConfig} onNavClick={setActiveView} />}
        
        
        <MobileStickyFooter 
            activeView={activeView} 
            onNavClick={setActiveView} 
            cartCount={cartCount} 
            onCartClick={() => setIsCartOpen(true)} 
        />
        
        <ProductDetailsModal 
            product={selectedProduct} 
            isOpen={isProductModalOpen} 
            onClose={() => setIsProductModalOpen(false)} 
            onAddToCart={handleAddToCart}
        />
        
        <CheckoutModal 
            isOpen={isCheckoutOpen} 
            onClose={() => setIsCheckoutOpen(false)} 
            total={cartTotal} 
            config={siteConfig.checkout} 
            onCheckout={handleCheckout}
            coupons={siteConfig.coupons}
        />

        <BlogPostModal 
            post={selectedBlogPost}
            isOpen={!!selectedBlogPost}
            onClose={() => setSelectedBlogPost(null)}
        />

    </div>
  );
};

export default App;