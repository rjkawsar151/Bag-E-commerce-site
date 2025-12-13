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

const Toast = ({ message, onClose }: { message: string, onClose: () => void }) => (
    <div className="fixed bottom-6 right-6 bg-zinc-900 border border-pink-500/50 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-5 z-[200]">
        <div className="bg-pink-600 rounded-full p-2 shadow-[0_0_10px_rgba(236,72,153,0.5)]">
            <SparklesIcon className="w-4 h-4 text-white" />
        </div>
        <div>
            <h4 className="font-bold text-sm text-pink-400">Success</h4>
            <p className="text-zinc-300 text-xs">{message}</p>
        </div>
        <button onClick={onClose} className="text-zinc-500 hover:text-white ml-2"><XIcon className="w-4 h-4" /></button>
    </div>
);

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
                    <h3 className="text-2xl font-bold text-white mb-6">
                        {config.logo ? (
                            <img src={config.logo} alt={config.headerTitle} className="h-12 w-auto object-contain" />
                        ) : (
                            config.headerTitle
                        )}
                    </h3>
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
            <div className="border-t border-white/5 pt-8 text-center text-zinc-600 text-lg uppercase tracking-wider">
                {config.copyrightText}
            </div>
        </footer>
    );
};

const MobileStickyFooter = ({ 
    activeView, 
    onNavClick,
    currentUser
}: { 
    activeView: ViewState, 
    onNavClick: (view: ViewState) => void,
    currentUser: User | null
}) => {
    const handleProfileClick = () => {
        if (currentUser) {
            onNavClick(currentUser.role.includes('ADMIN') ? 'ADMIN' : 'USER_DASHBOARD');
        } else {
            onNavClick('LOGIN');
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-lg border-t border-white/10 z-50 md:hidden flex justify-around items-center h-16 px-2 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
            <button onClick={() => onNavClick('HOME')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform ${activeView === 'HOME' ? 'text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]' : 'text-zinc-400'}`}>
                <HomeIcon className="w-5 h-5" />
                <span className="text-[10px] font-medium">Home</span>
            </button>
            
            <button onClick={handleProfileClick} className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform ${['LOGIN', 'REGISTER', 'USER_DASHBOARD', 'ADMIN', 'VERIFY_OTP'].includes(activeView) ? 'text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]' : 'text-zinc-400'}`}>
                <UserIcon className="w-5 h-5" />
                <span className="text-[10px] font-medium">Profile</span>
            </button>

            <button onClick={() => onNavClick('SHOP')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform ${activeView === 'SHOP' ? 'text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]' : 'text-zinc-400'}`}>
                <ShoppingBagIcon className="w-5 h-5" />
                <span className="text-[10px] font-medium">Shop</span>
            </button>
        </div>
    );
};

// --- Main App Components ---

const Navbar = ({ cartCount, onCartClick, onNavClick, activeView, siteConfig, onMenuClick, searchQuery, onSearchChange, currentUser, onLogout }: any) => {
    return (
        <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button onClick={onMenuClick} className="md:hidden text-white hover:text-pink-500 transition-colors">
                        <MenuIcon />
                    </button>
                    <div className="text-2xl font-bold tracking-tighter text-white cursor-pointer flex items-center gap-2" onClick={() => onNavClick('HOME')}>
                        {siteConfig.logo && <img src={siteConfig.logo} alt="Logo" className="h-8 w-auto object-contain" />}
                        {siteConfig.headerTitle}
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <button onClick={() => onNavClick('HOME')} className={`text-sm font-medium hover:text-pink-500 transition-colors ${activeView === 'HOME' ? 'text-pink-500' : 'text-zinc-300'}`}>Home</button>
                    <button onClick={() => onNavClick('SHOP')} className={`text-sm font-medium hover:text-pink-500 transition-colors ${activeView === 'SHOP' ? 'text-pink-500' : 'text-zinc-300'}`}>Shop</button>
                </div>

                <div className="flex-1 max-w-md hidden md:block relative">
                     <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white focus:border-pink-500 focus:bg-white/10 outline-none transition-all pl-10"
                     />
                     <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                </div>

                <div className="flex items-center gap-4">
                    {currentUser ? (
                         <div className="hidden md:flex items-center gap-4">
                             <span className="text-sm text-zinc-400">Hi, {currentUser.name.split(' ')[0]}</span>
                             <button onClick={() => onNavClick(currentUser.role.includes('ADMIN') ? 'ADMIN' : 'USER_DASHBOARD')} className="p-2 hover:bg-white/5 rounded-full text-zinc-300 hover:text-white transition-colors">
                                 <UserIcon className="w-5 h-5" />
                             </button>
                             <button onClick={onLogout} className="p-2 hover:bg-white/5 rounded-full text-zinc-300 hover:text-red-500 transition-colors">
                                 <LogOutIcon className="w-5 h-5" />
                             </button>
                         </div>
                    ) : (
                        <button onClick={() => onNavClick('LOGIN')} className="hidden md:block text-sm font-medium text-zinc-300 hover:text-white">Login</button>
                    )}
                    
                    <button onClick={onCartClick} className="relative p-2 hover:bg-white/5 rounded-full text-white transition-colors">
                        <ShoppingBagIcon className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-pink-600 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg border border-black">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}

const MobileDrawer = ({ isOpen, onClose, onNavClick, categories, onCategoryClick }: any) => {
    return (
        <div className={`fixed inset-y-0 left-0 w-[80%] max-w-sm bg-zinc-900 border-r border-white/10 p-6 z-[80] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
             <div className="flex items-center justify-between mb-8">
                 <span className="text-xl font-bold text-white">Menu</span>
                 <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white">
                     <XIcon />
                 </button>
             </div>
             <div className="space-y-6">
                 <button onClick={() => { onNavClick('HOME'); onClose(); }} className="block text-lg font-medium text-zinc-300 hover:text-pink-500">Home</button>
                 <button onClick={() => { onNavClick('SHOP'); onClose(); }} className="block text-lg font-medium text-zinc-300 hover:text-pink-500">Shop All</button>
                 <div className="pl-4 border-l border-white/10 space-y-4">
                     {categories.map((c: string) => (
                         <button key={c} onClick={() => { onCategoryClick(c); onClose(); }} className="block text-sm text-zinc-400 hover:text-white">{c}</button>
                     ))}
                 </div>
             </div>
        </div>
    );
}

const CartSidebar = ({ isOpen, onClose, cart, onRemove, onUpdateQty, onCheckout, total }: any) => {
    return (
        <>
            {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={onClose} />}
            <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-zinc-900 border-l border-white/10 shadow-2xl transform transition-transform duration-300 z-[70] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                 <div className="flex flex-col h-full">
                     <div className="p-6 border-b border-white/10 flex items-center justify-between">
                         <h2 className="text-xl font-bold text-white">Your Cart ({cart.length})</h2>
                         <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white"><XIcon /></button>
                     </div>
                     <div className="flex-1 overflow-y-auto p-6 space-y-6">
                         {cart.length === 0 ? (
                             <div className="text-center text-zinc-500 mt-20">Your cart is empty.</div>
                         ) : (
                             cart.map((item: CartItem) => (
                                 <div key={item.id} className="flex gap-4">
                                     <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-zinc-800" />
                                     <div className="flex-1">
                                         <h3 className="text-white font-medium line-clamp-1">{item.name}</h3>
                                         <p className="text-pink-400 text-sm mb-2">৳{item.price.toLocaleString()}</p>
                                         <div className="flex items-center gap-3">
                                             <div className="flex items-center border border-white/10 rounded-lg">
                                                 <button onClick={() => onUpdateQty(item.id, -1)} className="px-3 py-1 text-zinc-400 hover:text-white hover:bg-white/5">-</button>
                                                 <span className="text-sm text-white px-2">{item.quantity}</span>
                                                 <button onClick={() => onUpdateQty(item.id, 1)} className="px-3 py-1 text-zinc-400 hover:text-white hover:bg-white/5">+</button>
                                             </div>
                                             <button onClick={() => onRemove(item.id)} className="text-zinc-500 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                         </div>
                                     </div>
                                 </div>
                             ))
                         )}
                     </div>
                     <div className="p-6 border-t border-white/10 bg-zinc-900">
                         <div className="flex justify-between mb-4 text-lg font-bold text-white">
                             <span>Total</span>
                             <span>৳{total.toLocaleString()}</span>
                         </div>
                         <button 
                             onClick={onCheckout}
                             disabled={cart.length === 0}
                             className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all"
                         >
                             Checkout
                         </button>
                     </div>
                 </div>
            </div>
        </>
    );
}

const ProductCard = ({ product, onAddToCart, onClick }: any) => {
    return (
        <div className={`group relative rounded-xl overflow-hidden ${GLASS_CARD}`}>
            <div className="relative aspect-[4/5] overflow-hidden cursor-pointer" onClick={onClick}>
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {product.isNew && <span className="absolute top-3 left-3 bg-white text-black text-xs font-bold px-2 py-1 uppercase tracking-wider">New</span>}
                {product.isFeatured && <span className="absolute top-3 right-3 bg-pink-600 text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">Hot</span>}
                
                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center pb-6 bg-gradient-to-t from-black/80 to-transparent">
                     <button 
                        onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                        className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-pink-500 hover:text-white transition-colors shadow-lg"
                     >
                        Add to Cart
                     </button>
                </div>
            </div>
            <div className="p-4 cursor-pointer" onClick={onClick}>
                <h3 className="text-white font-bold truncate group-hover:text-pink-500 transition-colors">{product.name}</h3>
                <p className="text-zinc-400 text-xs mb-2">{product.category}</p>
                <div className="flex items-center justify-between">
                    <span className="text-pink-400 font-bold">৳{product.price.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}

const ProductDetailsModal = ({ product, isOpen, onClose, onAddToCart, config }: any) => {
    if (!isOpen || !product) return null;
    const highlights = config?.productHighlights || { showShipping: true, shippingText: '', showWarranty: true, warrantyText: '' };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
             <div className={`relative w-full max-w-4xl h-[80vh] overflow-y-auto md:h-auto rounded-3xl ${GLASS_MODAL} flex flex-col md:flex-row overflow-hidden`}>
                  <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors">
                      <XIcon />
                  </button>
                  <div className="w-full md:w-1/2 h-64 md:h-auto bg-zinc-800">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full md:w-1/2 p-8 flex flex-col">
                      <div className="flex-1">
                          <span className="text-pink-500 text-sm font-bold uppercase tracking-wider mb-2 block">{product.category}</span>
                          <h2 className="text-3xl font-bold text-white mb-4">{product.name}</h2>
                          <p className="text-2xl text-white font-light mb-6">৳{product.price.toLocaleString()}</p>
                          <p className="text-zinc-400 leading-relaxed mb-8">{product.description}</p>
                          
                          <div className="space-y-4 mb-8">
                              {highlights.showShipping && (
                                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                                      <TruckIcon className="w-4 h-4" /> <span>{highlights.shippingText || "Free shipping on orders over ৳5000"}</span>
                                  </div>
                              )}
                              {highlights.showWarranty && (
                                  <div className="flex items-center gap-3 text-sm text-zinc-300">
                                      <ShieldIcon className="w-4 h-4" /> <span>{highlights.warrantyText || "1 year warranty included"}</span>
                                  </div>
                              )}
                          </div>
                      </div>
                      
                      <button 
                          onClick={() => { onAddToCart(product); onClose(); }}
                          className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-pink-500 hover:text-white transition-all transform active:scale-95 shadow-lg"
                      >
                          Add to Bag
                      </button>
                  </div>
             </div>
        </div>
    );
}

const CheckoutModal = ({ isOpen, onClose, total, config, onCheckout, coupons }: any) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<CheckoutDetails>({
        fullName: '', email: '', phone: '', address: '', city: '', zip: '', paymentMethod: 'COD'
    });
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const handleApplyCoupon = () => {
        const coupon = coupons.find((c: Coupon) => c.code === couponCode && c.isActive);
        if (coupon) {
            const discAmount = (total * coupon.discountPercent) / 100;
            setDiscount(discAmount);
            alert(`Coupon Applied! Saved ৳${discAmount}`);
        } else {
            alert('Invalid or expired coupon code');
            setDiscount(0);
        }
    };

    const finalTotal = total - discount;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCheckout(formData, discount, finalTotal);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
             <div className={`relative w-full max-w-2xl rounded-2xl ${GLASS_MODAL} p-8 max-h-[90vh] overflow-y-auto`}>
                 <div className="flex items-center justify-between mb-8">
                     <h2 className="text-2xl font-bold text-white">Checkout</h2>
                     <button onClick={onClose} className="text-zinc-400 hover:text-white"><XIcon /></button>
                 </div>

                 <div className="flex items-center gap-4 mb-8">
                     <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-pink-500' : 'bg-zinc-800'}`}></div>
                     <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-pink-500' : 'bg-zinc-800'}`}></div>
                 </div>

                 <form onSubmit={handleSubmit}>
                     {step === 1 ? (
                         <div className="space-y-4">
                             <div className="grid grid-cols-2 gap-4">
                                 <input required placeholder="Full Name" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                                 <input required placeholder="Phone Number" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                             </div>
                             <input required type="email" placeholder="Email Address" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                             <textarea required placeholder="Shipping Address" rows={3} className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                             <div className="grid grid-cols-2 gap-4">
                                 <input required placeholder="City" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                                 <input required placeholder="Zip Code" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-pink-500" value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
                             </div>
                             <button type="button" onClick={() => setStep(2)} className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-pink-500 hover:text-white transition-colors mt-4">Next: Payment</button>
                         </div>
                     ) : (
                         <div className="space-y-6">
                             <div>
                                 <label className="block text-zinc-400 text-sm mb-2">Select Payment Method</label>
                                 <div className="grid grid-cols-3 gap-4">
                                     {['COD', 'BKASH', 'CARD'].map((method) => (
                                         <div 
                                             key={method}
                                             onClick={() => setFormData({...formData, paymentMethod: method as PaymentMethod})}
                                             className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ${formData.paymentMethod === method ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 hover:border-white/30'}`}
                                         >
                                             {method === 'COD' && <TruckIcon />}
                                             {method === 'BKASH' && <BkashIcon className="w-6 h-6" />}
                                             {method === 'CARD' && <CardIcon />}
                                             <span className="text-xs font-bold">{method}</span>
                                         </div>
                                     ))}
                                 </div>
                             </div>

                             {formData.paymentMethod === 'BKASH' && config.enableBkash && (
                                 <div className="bg-pink-900/20 border border-pink-500/30 p-4 rounded-lg">
                                     <p className="text-sm text-pink-200 mb-2">{config.bkashInstructions}</p>
                                     <p className="text-lg font-bold text-white mb-4">Send to: {config.bkashNumber}</p>
                                     <input required placeholder="Enter Transaction ID" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white outline-none focus:border-pink-500" value={formData.bkashTransactionId || ''} onChange={e => setFormData({...formData, bkashTransactionId: e.target.value})} />
                                 </div>
                             )}

                             {formData.paymentMethod === 'CARD' && (
                                  <div className="space-y-3 p-4 border border-white/10 rounded-lg">
                                     <input placeholder="Card Number" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white outline-none" />
                                     <div className="grid grid-cols-2 gap-3">
                                         <input placeholder="MM/YY" className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white outline-none" />
                                         <input placeholder="CVV" className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white outline-none" />
                                     </div>
                                  </div>
                             )}

                             <div className="border-t border-white/10 pt-6">
                                 <div className="flex gap-2 mb-4">
                                     <input 
                                         placeholder="Coupon Code" 
                                         className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white outline-none"
                                         value={couponCode}
                                         onChange={e => setCouponCode(e.target.value)}
                                     />
                                     <button type="button" onClick={handleApplyCoupon} className="bg-zinc-800 hover:bg-zinc-700 px-4 rounded-lg text-white font-medium">Apply</button>
                                 </div>
                                 
                                 <div className="space-y-2 text-sm text-zinc-400">
                                     <div className="flex justify-between"><span>Subtotal</span><span>৳{total.toLocaleString()}</span></div>
                                     {discount > 0 && <div className="flex justify-between text-pink-400"><span>Discount</span><span>-৳{discount.toLocaleString()}</span></div>}
                                     <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10 mt-2"><span>Total</span><span>৳{finalTotal.toLocaleString()}</span></div>
                                 </div>
                             </div>

                             <div className="flex gap-4">
                                 <button type="button" onClick={() => setStep(1)} className="flex-1 bg-zinc-800 text-white font-bold py-3 rounded-lg hover:bg-zinc-700">Back</button>
                                 <button type="submit" className="flex-1 bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 shadow-lg shadow-pink-600/20">Place Order</button>
                             </div>
                         </div>
                     )}
                 </form>
             </div>
        </div>
    );
}

const BlogPostModal = ({ post, isOpen, onClose }: any) => {
    if (!isOpen || !post) return null;
    return (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose}></div>
             <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl ${GLASS_MODAL}`}>
                 <div className="h-64 sm:h-80 relative">
                     <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                     <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"><XIcon /></button>
                     <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/50 to-transparent p-8">
                         <h2 className="text-3xl font-bold text-white mb-2">{post.title}</h2>
                         <div className="flex gap-4 text-sm text-zinc-300">
                             <span>{post.date}</span>
                             <span>By {post.author}</span>
                         </div>
                     </div>
                 </div>
                 <div className="p-8">
                     <p className="text-lg text-zinc-300 leading-relaxed whitespace-pre-line">{post.content}</p>
                 </div>
             </div>
         </div>
    );
}

const UserDashboard = ({ user, orders, onLogout }: any) => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Account</h1>
                    <p className="text-zinc-400">Welcome back, {user.name}</p>
                </div>
                <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">
                    <LogOutIcon className="w-4 h-4" /> Sign Out
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-white mb-4">Order History</h2>
                    {orders.length === 0 ? (
                        <div className={`p-8 text-center rounded-xl ${GLASS_PANEL}`}>
                            <p className="text-zinc-400">No orders yet.</p>
                        </div>
                    ) : (
                        orders.map((order: Order) => (
                            <div key={order.id} className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-zinc-400">Order #{order.id}</p>
                                        <p className="text-xs text-zinc-500">{new Date(order.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="space-y-3 border-t border-white/5 pt-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-zinc-300">{item.quantity}x {item.name}</span>
                                            <span className="text-white">৳{(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between font-bold text-white">
                                    <span>Total</span>
                                    <span>৳{order.finalTotal.toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                <div className="space-y-6">
                    <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                        <h3 className="text-lg font-bold text-white mb-4">Account Details</h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <label className="block text-zinc-500">Name</label>
                                <div className="text-white">{user.name}</div>
                            </div>
                            <div>
                                <label className="block text-zinc-500">Email</label>
                                <div className="text-white">{user.email}</div>
                            </div>
                            <div>
                                <label className="block text-zinc-500">Role</label>
                                <div className="text-pink-400 font-medium">{user.role}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const AdminDashboard = ({ 
    user, products, orders, categories, siteConfig, users, 
    onAddProduct, onUpdateProduct, onDeleteProduct, 
    onAddCategory, onDeleteCategory, onUpdateSiteConfig, 
    onUpdateOrder, onAddUser, onDeleteUser, onLogout,
    onSaveConfig 
}: any) => {
    const [tab, setTab] = useState<'OVERVIEW' | 'PRODUCTS' | 'CATEGORIES' | 'ORDERS' | 'USERS' | 'DESIGN' | 'SETTINGS'>('OVERVIEW');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showToast, setShowToast] = useState(false);

    // AI Generation States
    const [generatingDesc, setGeneratingDesc] = useState(false);

    // Temp states for product form
    const [prodForm, setProdForm] = useState<Partial<Product>>({});
    
    // Temp states for user form
    const [newUserForm, setNewUserForm] = useState<Partial<User>>({ role: 'CUSTOMER' });

    // Helper for SiteConfig Updates
    const updateConfig = (key: keyof SiteConfig, value: any) => {
        onUpdateSiteConfig({ ...siteConfig, [key]: value });
    };

    const updateNestedConfig = (parent: keyof SiteConfig, key: string, value: any) => {
        onUpdateSiteConfig({
            ...siteConfig,
            [parent]: { ...siteConfig[parent], [key]: value }
        });
    }

    const updateArrayConfig = (parent: keyof SiteConfig, index: number, key: string, value: any) => {
        const arr = [...siteConfig[parent]];
        arr[index] = { ...arr[index], [key]: value };
        onUpdateSiteConfig({ ...siteConfig, [parent]: arr });
    };

    // Helper for File Upload Simulation
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    callback(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProduct = () => {
        if (!prodForm.name || !prodForm.price) return alert("Name and Price required");
        const product: Product = {
            id: editingProduct ? editingProduct.id : Date.now().toString(),
            name: prodForm.name!,
            price: Number(prodForm.price),
            category: prodForm.category || categories[0],
            description: prodForm.description || '',
            image: prodForm.image || 'https://picsum.photos/400',
            isNew: prodForm.isNew || false,
            isFeatured: prodForm.isFeatured || false
        };

        if (editingProduct) {
            onUpdateProduct(product);
        } else {
            onAddProduct(product);
        }
        setIsProductModalOpen(false);
        setEditingProduct(null);
        setProdForm({});
    };

    const handleGenerateDesc = async () => {
        if(!prodForm.name || !prodForm.category) return alert("Please enter name and category first");
        setGeneratingDesc(true);
        const desc = await generateProductDescription(prodForm.name, prodForm.category, "luxury, elegant, high quality");
        setProdForm({...prodForm, description: desc});
        setGeneratingDesc(false);
    };

    const handleAddUserSubmit = () => {
        if(!newUserForm.name || !newUserForm.email || !newUserForm.password) return alert("All fields are required");
        
        onAddUser({
            id: Date.now().toString(),
            name: newUserForm.name!,
            email: newUserForm.email!,
            password: newUserForm.password!,
            role: newUserForm.role || 'CUSTOMER'
        });
        setNewUserForm({ role: 'CUSTOMER' });
        setIsUserModalOpen(false);
    };

    const handleSave = () => {
        onSaveConfig();
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    return (
        <div className="flex h-screen bg-zinc-950 overflow-hidden relative">
             {showToast && <Toast message="Store configuration saved successfully." onClose={() => setShowToast(false)} />}
             
             {/* Admin Sidebar */}
             <div className="w-64 bg-zinc-900 border-r border-white/10 hidden md:flex flex-col">
                 <div className="p-6 border-b border-white/10">
                     <span className="text-xl font-bold text-white tracking-tight">Velvet Admin</span>
                 </div>
                 <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                     {[
                         { id: 'OVERVIEW', icon: BarChartIcon, label: 'Overview' },
                         { id: 'PRODUCTS', icon: BoxIcon, label: 'Products' },
                         { id: 'CATEGORIES', icon: TagIcon, label: 'Categories' },
                         { id: 'ORDERS', icon: ShoppingBagIcon, label: 'Orders' },
                         { id: 'USERS', icon: UserIcon, label: 'Users' },
                         { id: 'DESIGN', icon: LayoutIcon, label: 'Store Design' },
                         { id: 'SETTINGS', icon: SettingsIcon, label: 'Settings' },
                     ].map(item => (
                         <button 
                             key={item.id}
                             onClick={() => setTab(item.id as any)}
                             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${tab === item.id ? 'bg-pink-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                         >
                             <item.icon className="w-5 h-5" />
                             <span className="font-medium">{item.label}</span>
                         </button>
                     ))}
                 </nav>
                 <div className="p-4 border-t border-white/10">
                     <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-red-400 transition-colors">
                         <LogOutIcon className="w-5 h-5" />
                         <span>Sign Out</span>
                     </button>
                 </div>
             </div>

             {/* Main Content */}
             <div className="flex-1 overflow-y-auto">
                 <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-zinc-900/50 backdrop-blur sticky top-0 z-10">
                     <h2 className="text-xl font-bold text-white">{tab.charAt(0) + tab.slice(1).toLowerCase().replace('_', ' ')}</h2>
                     <div className="flex items-center gap-4">
                         {(tab === 'DESIGN' || tab === 'SETTINGS') && (
                             <button onClick={handleSave} className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-pink-600/20 flex items-center gap-2">
                                 <SparklesIcon className="w-4 h-4" /> Save Changes
                             </button>
                         )}
                         <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                             {user.name.charAt(0)}
                         </div>
                     </div>
                 </header>

                 <main className="p-8">
                     {tab === 'OVERVIEW' && (
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-zinc-400 text-sm font-bold uppercase">Total Sales</h3>
                                 <p className="text-3xl font-bold text-white mt-2">৳{orders.reduce((acc: number, o: Order) => acc + o.finalTotal, 0).toLocaleString()}</p>
                             </div>
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-zinc-400 text-sm font-bold uppercase">Total Orders</h3>
                                 <p className="text-3xl font-bold text-white mt-2">{orders.length}</p>
                             </div>
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-zinc-400 text-sm font-bold uppercase">Products</h3>
                                 <p className="text-3xl font-bold text-white mt-2">{products.length}</p>
                             </div>
                         </div>
                     )}

                     {tab === 'PRODUCTS' && (
                         <div className="space-y-6">
                             <div className="flex justify-end">
                                 <button onClick={() => { setEditingProduct(null); setProdForm({}); setIsProductModalOpen(true); }} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                                     <PlusIcon className="w-4 h-4" /> Add Product
                                 </button>
                             </div>
                             <div className={`rounded-xl overflow-hidden ${GLASS_PANEL}`}>
                                 <table className="w-full text-left">
                                     <thead className="bg-white/5 text-zinc-400 text-xs uppercase">
                                         <tr>
                                             <th className="p-4">Product</th>
                                             <th className="p-4">Price</th>
                                             <th className="p-4">Category</th>
                                             <th className="p-4">Actions</th>
                                         </tr>
                                     </thead>
                                     <tbody className="divide-y divide-white/5">
                                         {products.map((p: Product) => (
                                             <tr key={p.id} className="text-sm hover:bg-white/5">
                                                 <td className="p-4 flex items-center gap-3">
                                                     <img src={p.image} className="w-10 h-10 rounded object-cover" />
                                                     <span className="font-medium text-white">{p.name}</span>
                                                 </td>
                                                 <td className="p-4 text-zinc-300">৳{p.price}</td>
                                                 <td className="p-4 text-zinc-300">{p.category}</td>
                                                 <td className="p-4 flex gap-2">
                                                     <button onClick={() => { setEditingProduct(p); setProdForm(p); setIsProductModalOpen(true); }} className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/40"><EditIcon className="w-4 h-4" /></button>
                                                     <button onClick={() => onDeleteProduct(p.id)} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40"><TrashIcon className="w-4 h-4" /></button>
                                                 </td>
                                             </tr>
                                         ))}
                                     </tbody>
                                 </table>
                             </div>
                         </div>
                     )}

                     {tab === 'CATEGORIES' && (
                         <div className={`p-6 rounded-xl ${GLASS_PANEL} max-w-2xl`}>
                            <h3 className="text-xl font-bold text-white mb-6">Product Categories</h3>
                            <div className="flex gap-2 mb-6">
                                <input 
                                    value={newCategoryName} 
                                    onChange={e => setNewCategoryName(e.target.value)} 
                                    placeholder="New Category Name" 
                                    className="flex-1 bg-black/40 border border-white/10 rounded px-4 py-2 text-white"
                                />
                                <button 
                                    onClick={() => {
                                        if(newCategoryName && !categories.includes(newCategoryName)) {
                                            onAddCategory(newCategoryName);
                                            setNewCategoryName('');
                                        }
                                    }}
                                    className="bg-pink-600 hover:bg-pink-700 text-white px-6 rounded font-bold"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="space-y-2">
                                {categories.map((c: string) => (
                                    <div key={c} className="flex items-center justify-between bg-white/5 p-3 rounded border border-white/5">
                                        <span className="text-white">{c}</span>
                                        <button onClick={() => onDeleteCategory(c)} className="text-zinc-500 hover:text-red-400">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                         </div>
                     )}
                     
                     {tab === 'ORDERS' && (
                         <div className={`rounded-xl overflow-hidden ${GLASS_PANEL}`}>
                             <table className="w-full text-left">
                                 <thead className="bg-white/5 text-zinc-400 text-xs uppercase">
                                     <tr>
                                         <th className="p-4">Order ID</th>
                                         <th className="p-4">Customer</th>
                                         <th className="p-4">Total</th>
                                         <th className="p-4">Status</th>
                                         <th className="p-4">Actions</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-white/5">
                                     {orders.map((o: Order) => (
                                         <tr key={o.id} className="text-sm hover:bg-white/5">
                                             <td className="p-4 text-zinc-300">#{o.id}</td>
                                             <td className="p-4 text-white font-medium">{o.details.fullName}</td>
                                             <td className="p-4 text-zinc-300">৳{o.finalTotal}</td>
                                             <td className="p-4">
                                                 <span className={`px-2 py-1 rounded text-xs font-bold ${o.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{o.status}</span>
                                             </td>
                                             <td className="p-4">
                                                 <select 
                                                    value={o.status} 
                                                    onChange={(e) => onUpdateOrder({...o, status: e.target.value})}
                                                    className="bg-black/40 border border-white/10 rounded px-2 py-1 text-white text-xs outline-none"
                                                 >
                                                     <option value="Pending">Pending</option>
                                                     <option value="Processing">Processing</option>
                                                     <option value="Shipped">Shipped</option>
                                                     <option value="Delivered">Delivered</option>
                                                     <option value="Cancelled">Cancelled</option>
                                                 </select>
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                     )}

                     {tab === 'USERS' && (
                         <div className="space-y-6">
                             <div className="flex justify-end">
                                 <button onClick={() => { setNewUserForm({role: 'CUSTOMER'}); setIsUserModalOpen(true); }} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                                     <PlusIcon className="w-4 h-4" /> Add User
                                 </button>
                             </div>
                             <div className={`rounded-xl overflow-hidden ${GLASS_PANEL}`}>
                                 <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                     <h3 className="font-bold text-white">Registered Users</h3>
                                 </div>
                                 <table className="w-full text-left">
                                     <thead className="bg-white/5 text-zinc-400 text-xs uppercase">
                                         <tr>
                                             <th className="p-4">Name</th>
                                             <th className="p-4">Email</th>
                                             <th className="p-4">Role</th>
                                             <th className="p-4">Action</th>
                                         </tr>
                                     </thead>
                                     <tbody className="divide-y divide-white/5">
                                         {users.map((u: User) => (
                                             <tr key={u.id} className="text-sm hover:bg-white/5">
                                                 <td className="p-4 text-white">{u.name}</td>
                                                 <td className="p-4 text-zinc-300">{u.email}</td>
                                                 <td className="p-4"><span className="bg-white/10 px-2 py-1 rounded text-xs">{u.role}</span></td>
                                                 <td className="p-4">
                                                     {u.role !== 'SUPER_ADMIN' && (
                                                         <button onClick={() => onDeleteUser(u.id)} className="text-red-400 hover:text-red-300"><TrashIcon className="w-4 h-4"/></button>
                                                     )}
                                                 </td>
                                             </tr>
                                         ))}
                                     </tbody>
                                 </table>
                             </div>
                         </div>
                     )}

                     {tab === 'DESIGN' && (
                         <div className="space-y-8 pb-20">
                             {/* Hero Slides */}
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-lg font-bold text-white mb-6">Hero Carousel Slides</h3>
                                 <div className="grid grid-cols-1 gap-6">
                                     {siteConfig.heroSlides.map((slide: HeroSlide, i: number) => (
                                         <div key={i} className="bg-black/20 p-4 rounded-xl border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <div className="space-y-2">
                                                 <label className="text-xs text-zinc-500">Title</label>
                                                 <input value={slide.title} onChange={e => updateArrayConfig('heroSlides', i, 'title', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white" />
                                                 <label className="text-xs text-zinc-500">Subtitle</label>
                                                 <input value={slide.subtitle} onChange={e => updateArrayConfig('heroSlides', i, 'subtitle', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white" />
                                                 <label className="text-xs text-zinc-500">Button Text</label>
                                                 <input value={slide.cta} onChange={e => updateArrayConfig('heroSlides', i, 'cta', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white" />
                                             </div>
                                             <div className="space-y-2">
                                                  <label className="text-xs text-zinc-500">Image</label>
                                                  <div className="flex gap-2">
                                                      <input value={slide.image} onChange={e => updateArrayConfig('heroSlides', i, 'image', e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white" placeholder="Image URL" />
                                                      <label className="bg-white/10 hover:bg-white/20 text-white px-3 rounded cursor-pointer flex items-center justify-center">
                                                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => updateArrayConfig('heroSlides', i, 'image', url))} />
                                                          <UploadIcon className="w-4 h-4" />
                                                      </label>
                                                  </div>
                                                  <img src={slide.image} className="h-24 w-full object-cover rounded-lg mt-2 opacity-50" />
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>

                             {/* Featured Categories */}
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-lg font-bold text-white mb-6">Featured Category Grid</h3>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {siteConfig.featuredCategories.map((cat: FeaturedCategory, i: number) => (
                                         <div key={i} className="bg-black/20 p-4 rounded-xl border border-white/5 flex gap-4 items-center">
                                             <img src={cat.image} className="w-16 h-16 rounded object-cover" />
                                             <div className="flex-1 space-y-2">
                                                 <input value={cat.name} onChange={e => updateArrayConfig('featuredCategories', i, 'name', e.target.value)} placeholder="Display Name" className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white" />
                                                 <div className="flex gap-2">
                                                     <input value={cat.image} onChange={e => updateArrayConfig('featuredCategories', i, 'image', e.target.value)} placeholder="Image URL" className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white" />
                                                     <label className="bg-white/10 hover:bg-white/20 text-white px-3 rounded cursor-pointer flex items-center justify-center">
                                                         <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => updateArrayConfig('featuredCategories', i, 'image', url))} />
                                                         <UploadIcon className="w-4 h-4" />
                                                     </label>
                                                 </div>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>

                             {/* Testimonials */}
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-lg font-bold text-white mb-6">Customer Testimonials</h3>
                                 <div className="space-y-4">
                                     {siteConfig.testimonials.map((t: Testimonial, i: number) => (
                                         <div key={i} className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-2">
                                             <div className="flex gap-2">
                                                 <input value={t.name} onChange={e => updateArrayConfig('testimonials', i, 'name', e.target.value)} className="w-1/3 bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white" placeholder="Customer Name" />
                                                 <input value={t.role} onChange={e => updateArrayConfig('testimonials', i, 'role', e.target.value)} className="w-1/3 bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white" placeholder="Role (e.g. Verified Buyer)" />
                                                 <input type="number" value={t.rating} onChange={e => updateArrayConfig('testimonials', i, 'rating', Number(e.target.value))} className="w-16 bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white" max={5} min={1} />
                                             </div>
                                             <textarea value={t.comment} onChange={e => updateArrayConfig('testimonials', i, 'comment', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white" rows={2} />
                                         </div>
                                     ))}
                                 </div>
                             </div>

                             {/* USPs */}
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-lg font-bold text-white mb-6">Unique Selling Points</h3>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     {siteConfig.usps.map((usp: USPItem, i: number) => (
                                         <div key={i} className="flex gap-2">
                                             <select value={usp.icon} onChange={e => updateArrayConfig('usps', i, 'icon', e.target.value)} className="bg-black/40 border border-white/10 rounded px-2 py-1 text-white text-xs w-24">
                                                 <option value="TRUCK">Truck</option>
                                                 <option value="SHIELD">Shield</option>
                                                 <option value="REFRESH">Refresh</option>
                                                 <option value="CROWN">Crown</option>
                                             </select>
                                             <input value={usp.text} onChange={e => updateArrayConfig('usps', i, 'text', e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-white text-sm" />
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         </div>
                     )}

                     {tab === 'SETTINGS' && (
                         <div className="space-y-6 pb-20">
                             {/* General */}
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-lg font-bold text-pink-500 mb-4 border-b border-white/10 pb-2">General Settings</h3>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div>
                                         <label className="block text-zinc-400 text-sm mb-1">Store Name</label>
                                         <input className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" value={siteConfig.headerTitle} onChange={e => updateConfig('headerTitle', e.target.value)} />
                                     </div>
                                     <div>
                                         <label className="block text-zinc-400 text-sm mb-1">Footer Text</label>
                                         <input className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" value={siteConfig.footerText} onChange={e => updateConfig('footerText', e.target.value)} />
                                     </div>
                                     <div className="md:col-span-2">
                                         <label className="block text-zinc-400 text-sm mb-1">Footer Copyright Text</label>
                                         <input className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" value={siteConfig.copyrightText} onChange={e => updateConfig('copyrightText', e.target.value)} />
                                     </div>
                                     <div className="md:col-span-2">
                                         <label className="block text-zinc-400 text-sm mb-1">Store Logo</label>
                                         <div className="flex gap-4 items-center">
                                             {siteConfig.logo ? (
                                                 <img src={siteConfig.logo} alt="Logo" className="h-12 w-auto object-contain bg-white/5 rounded p-1" />
                                             ) : (
                                                 <div className="h-12 w-12 bg-white/5 rounded flex items-center justify-center text-xs text-zinc-500">No Logo</div>
                                             )}
                                             <div className="flex-1 flex gap-2">
                                                 <input 
                                                     className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2 text-white" 
                                                     placeholder="Logo URL"
                                                     value={siteConfig.logo} 
                                                     onChange={e => updateConfig('logo', e.target.value)} 
                                                 />
                                                 <label className="bg-pink-600 hover:bg-pink-700 text-white px-4 rounded cursor-pointer flex items-center gap-2 font-medium text-sm transition-colors">
                                                     <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => updateConfig('logo', url))} />
                                                     <UploadIcon className="w-4 h-4" /> Upload
                                                 </label>
                                             </div>
                                         </div>
                                     </div>
                                     <div className="md:col-span-2">
                                         <label className="block text-zinc-400 text-sm mb-1">Top Bar Announcement</label>
                                         <input className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" value={siteConfig.topBarText} onChange={e => updateConfig('topBarText', e.target.value)} />
                                     </div>
                                     <div className="flex items-center gap-4">
                                         <label className="flex items-center gap-2 text-zinc-300"><input type="checkbox" checked={siteConfig.showMarquee} onChange={e => updateConfig('showMarquee', e.target.checked)} /> Show Product Marquee</label>
                                         <label className="flex items-center gap-2 text-zinc-300"><input type="checkbox" checked={siteConfig.showTopBar} onChange={e => updateConfig('showTopBar', e.target.checked)} /> Show Top Bar</label>
                                     </div>
                                 </div>
                             </div>

                             {/* Product Highlights */}
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-lg font-bold text-pink-500 mb-4 border-b border-white/10 pb-2">Product Highlights</h3>
                                 <div className="space-y-4">
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                         <div>
                                             <label className="block text-zinc-400 text-sm mb-1">Shipping Text</label>
                                             <input 
                                                placeholder="e.g. Free shipping on orders over ৳5000" 
                                                value={siteConfig.productHighlights?.shippingText || ''} 
                                                onChange={e => updateNestedConfig('productHighlights', 'shippingText', e.target.value)} 
                                                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-sm" 
                                             />
                                         </div>
                                         <div className="mb-2">
                                             <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                                                 <input 
                                                     type="checkbox" 
                                                     checked={siteConfig.productHighlights?.showShipping ?? true} 
                                                     onChange={e => updateNestedConfig('productHighlights', 'showShipping', e.target.checked)} 
                                                 /> 
                                                 Show Shipping Info
                                             </label>
                                         </div>
                                     </div>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                         <div>
                                             <label className="block text-zinc-400 text-sm mb-1">Warranty Text</label>
                                             <input 
                                                placeholder="e.g. 1 year warranty included" 
                                                value={siteConfig.productHighlights?.warrantyText || ''} 
                                                onChange={e => updateNestedConfig('productHighlights', 'warrantyText', e.target.value)} 
                                                className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-sm" 
                                             />
                                         </div>
                                         <div className="mb-2">
                                             <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
                                                 <input 
                                                     type="checkbox" 
                                                     checked={siteConfig.productHighlights?.showWarranty ?? true} 
                                                     onChange={e => updateNestedConfig('productHighlights', 'showWarranty', e.target.checked)} 
                                                 /> 
                                                 Show Warranty Info
                                             </label>
                                         </div>
                                     </div>
                                 </div>
                             </div>

                             {/* Contact Info */}
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-lg font-bold text-pink-500 mb-4 border-b border-white/10 pb-2">Contact Information</h3>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div>
                                         <label className="block text-zinc-400 text-sm mb-1">Support Email</label>
                                         <input placeholder="Support Email" value={siteConfig.contactInfo.email} onChange={e => updateNestedConfig('contactInfo', 'email', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                                     </div>
                                     <div>
                                         <label className="block text-zinc-400 text-sm mb-1">Support Phone</label>
                                         <input placeholder="Support Phone" value={siteConfig.contactInfo.phone} onChange={e => updateNestedConfig('contactInfo', 'phone', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                                     </div>
                                     <div className="md:col-span-2">
                                         <label className="block text-zinc-400 text-sm mb-1">Facebook URL</label>
                                         <input placeholder="Facebook URL" value={siteConfig.contactInfo.facebook} onChange={e => updateNestedConfig('contactInfo', 'facebook', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                                     </div>
                                     <div className="md:col-span-2">
                                         <label className="block text-zinc-400 text-sm mb-1">Instagram URL</label>
                                         <input placeholder="Instagram URL" value={siteConfig.contactInfo.instagram} onChange={e => updateNestedConfig('contactInfo', 'instagram', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                                     </div>
                                     <div className="md:col-span-2">
                                         <label className="block text-zinc-400 text-sm mb-1">Twitter URL</label>
                                         <input placeholder="Twitter URL" value={siteConfig.contactInfo.twitter} onChange={e => updateNestedConfig('contactInfo', 'twitter', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                                     </div>
                                 </div>
                             </div>

                             {/* Payment */}
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-lg font-bold text-pink-500 mb-4 border-b border-white/10 pb-2">Payment Settings (bKash)</h3>
                                 <div className="space-y-4">
                                      <label className="flex items-center gap-2 text-zinc-300"><input type="checkbox" checked={siteConfig.checkout.enableBkash} onChange={e => updateNestedConfig('checkout', 'enableBkash', e.target.checked)} /> Enable bKash Payment</label>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <div>
                                              <label className="block text-zinc-400 text-sm mb-1">bKash Number</label>
                                              <input className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" value={siteConfig.checkout.bkashNumber} onChange={e => updateNestedConfig('checkout', 'bkashNumber', e.target.value)} />
                                          </div>
                                          <div>
                                              <label className="block text-zinc-400 text-sm mb-1">Instructions</label>
                                              <input className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" value={siteConfig.checkout.bkashInstructions} onChange={e => updateNestedConfig('checkout', 'bkashInstructions', e.target.value)} />
                                          </div>
                                      </div>
                                 </div>
                             </div>

                             {/* Coupons */}
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-lg font-bold text-pink-500 mb-4 border-b border-white/10 pb-2">Coupons & Marketing</h3>
                                 <div className="space-y-2">
                                     {siteConfig.coupons.map((c: Coupon, i: number) => (
                                         <div key={i} className="flex gap-2 items-center">
                                              <input value={c.code} onChange={e => updateArrayConfig('coupons', i, 'code', e.target.value)} className="w-32 bg-black/40 border border-white/10 rounded px-2 py-1 text-white uppercase text-sm font-bold" />
                                              <input type="number" value={c.discountPercent} onChange={e => updateArrayConfig('coupons', i, 'discountPercent', Number(e.target.value))} className="w-16 bg-black/40 border border-white/10 rounded px-2 py-1 text-white text-sm" />
                                              <span className="text-zinc-400 text-sm">% Off</span>
                                              <label className="flex items-center gap-1 ml-4 text-sm text-zinc-300">
                                                  <input type="checkbox" checked={c.isActive} onChange={e => updateArrayConfig('coupons', i, 'isActive', e.target.checked)} /> Active
                                              </label>
                                         </div>
                                     ))}
                                 </div>
                             </div>

                             {/* System */}
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-lg font-bold text-pink-500 mb-4 border-b border-white/10 pb-2">System Config (SMTP)</h3>
                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                     <input placeholder="Host" value={siteConfig.smtp.host} onChange={e => updateNestedConfig('smtp', 'host', e.target.value)} className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                                     <input placeholder="Port" value={siteConfig.smtp.port} onChange={e => updateNestedConfig('smtp', 'port', e.target.value)} className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                                     <input placeholder="User" value={siteConfig.smtp.user} onChange={e => updateNestedConfig('smtp', 'user', e.target.value)} className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                                     <input type="password" placeholder="Pass" value={siteConfig.smtp.pass} onChange={e => updateNestedConfig('smtp', 'pass', e.target.value)} className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white text-sm" />
                                 </div>
                             </div>
                         </div>
                     )}
                 </main>
             </div>

             {/* Admin Product Modal */}
             {isProductModalOpen && (
                 <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                     <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)}></div>
                     <div className={`relative w-full max-w-lg p-6 rounded-xl ${GLASS_MODAL} max-h-[90vh] overflow-y-auto`}>
                         <h3 className="text-xl font-bold text-white mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                         <div className="space-y-4">
                             <input placeholder="Product Name" className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white" value={prodForm.name || ''} onChange={e => setProdForm({...prodForm, name: e.target.value})} />
                             <div className="grid grid-cols-2 gap-4">
                                 <input type="number" placeholder="Price" className="bg-black/40 border border-white/10 rounded px-4 py-2 text-white" value={prodForm.price || ''} onChange={e => setProdForm({...prodForm, price: Number(e.target.value)})} />
                                 <select className="bg-black/40 border border-white/10 rounded px-4 py-2 text-white" value={prodForm.category || ''} onChange={e => setProdForm({...prodForm, category: e.target.value})}>
                                     <option value="">Select Category</option>
                                     {categories.map((c: string) => <option key={c} value={c}>{c}</option>)}
                                 </select>
                             </div>
                             <div>
                                 <div className="flex justify-between items-center mb-1">
                                     <label className="text-zinc-400 text-xs">Description</label>
                                     <button type="button" onClick={handleGenerateDesc} disabled={generatingDesc} className="text-pink-400 text-xs hover:text-pink-300 flex items-center gap-1">
                                         {generatingDesc ? 'Generating...' : <><SparklesIcon className="w-3 h-3" /> Generate with AI</>}
                                     </button>
                                 </div>
                                 <textarea rows={4} className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white" value={prodForm.description || ''} onChange={e => setProdForm({...prodForm, description: e.target.value})} />
                             </div>
                             <div>
                                 <label className="text-zinc-400 text-xs mb-1 block">Product Image</label>
                                 <div className="flex gap-2">
                                     <input 
                                         placeholder="Image URL" 
                                         className="flex-1 bg-black/40 border border-white/10 rounded px-4 py-2 text-white" 
                                         value={prodForm.image || ''} 
                                         onChange={e => setProdForm({...prodForm, image: e.target.value})} 
                                     />
                                     <label className="bg-white/10 hover:bg-white/20 text-white p-2 rounded cursor-pointer transition-colors flex items-center justify-center">
                                         <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setProdForm({...prodForm, image: url}))} />
                                         <UploadIcon className="w-5 h-5" />
                                     </label>
                                 </div>
                             </div>
                             <div className="flex gap-4">
                                 <label className="flex items-center gap-2 text-zinc-300"><input type="checkbox" checked={prodForm.isNew || false} onChange={e => setProdForm({...prodForm, isNew: e.target.checked})} /> New Arrival</label>
                                 <label className="flex items-center gap-2 text-zinc-300"><input type="checkbox" checked={prodForm.isFeatured || false} onChange={e => setProdForm({...prodForm, isFeatured: e.target.checked})} /> Featured</label>
                             </div>
                             <div className="flex gap-4 pt-4">
                                 <button onClick={() => setIsProductModalOpen(false)} className="flex-1 bg-zinc-700 text-white py-2 rounded">Cancel</button>
                                 <button onClick={handleSaveProduct} className="flex-1 bg-pink-600 text-white py-2 rounded font-bold">Save Product</button>
                             </div>
                         </div>
                     </div>
                 </div>
             )}

             {/* Admin User Modal */}
             {isUserModalOpen && (
                 <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                     <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsUserModalOpen(false)}></div>
                     <div className={`relative w-full max-w-md p-6 rounded-xl ${GLASS_MODAL}`}>
                         <h3 className="text-xl font-bold text-white mb-4">Add New User</h3>
                         <div className="space-y-4">
                             <input placeholder="Full Name" className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white" value={newUserForm.name || ''} onChange={e => setNewUserForm({...newUserForm, name: e.target.value})} />
                             <input type="email" placeholder="Email Address" className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white" value={newUserForm.email || ''} onChange={e => setNewUserForm({...newUserForm, email: e.target.value})} />
                             <input type="password" placeholder="Password" className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white" value={newUserForm.password || ''} onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} />
                             <div>
                                 <label className="block text-zinc-400 text-sm mb-1">Role</label>
                                 <select className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white" value={newUserForm.role || 'CUSTOMER'} onChange={e => setNewUserForm({...newUserForm, role: e.target.value as any})}>
                                     <option value="CUSTOMER">Customer</option>
                                     <option value="SHOP_ADMIN">Shop Admin</option>
                                     <option value="SUPER_ADMIN">Super Admin</option>
                                 </select>
                             </div>
                             <div className="flex gap-4 pt-4">
                                 <button onClick={() => setIsUserModalOpen(false)} className="flex-1 bg-zinc-700 text-white py-2 rounded">Cancel</button>
                                 <button onClick={handleAddUserSubmit} className="flex-1 bg-pink-600 text-white py-2 rounded font-bold">Add User</button>
                             </div>
                         </div>
                     </div>
                 </div>
             )}
        </div>
    );
};

const App = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  
  // Initialize SiteConfig from LocalStorage if available for persistence
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
      const savedConfig = localStorage.getItem('site_config');
      if (savedConfig) {
          try {
              const parsed = JSON.parse(savedConfig);
              // Ensure productHighlights exists in saved config to prevent crash if old config is loaded
              if (!parsed.productHighlights) {
                  parsed.productHighlights = INITIAL_SITE_CONFIG.productHighlights;
              }
              return parsed;
          } catch (e) {
              return INITIAL_SITE_CONFIG;
          }
      }
      return INITIAL_SITE_CONFIG;
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'ALL'>('ALL');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);

  // Authentication State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  // OTP State
  const [tempRegData, setTempRegData] = useState<User | null>(null);
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Computed
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const filteredProducts = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'ALL' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
  });

  // Handlers
  const addToCart = (product: Product) => {
      setCart(prev => {
          const existing = prev.find(item => item.id === product.id);
          if (existing) {
              return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
          }
          return [...prev, { ...product, quantity: 1 }];
      });
      setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
      setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
      setCart(prev => prev.map(item => {
          if (item.id === id) {
              const newQty = item.quantity + delta;
              if (newQty < 1) return item;
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
          items: cart,
          total: cartTotal,
          discountApplied: discount,
          finalTotal,
          status: 'Pending'
      };
      setOrders([newOrder, ...orders]);
      setCart([]);
      setIsCartOpen(false);
      setIsCheckoutOpen(false);
      alert("Order Placed Successfully!");
      if(currentUser) setView('USER_DASHBOARD');
      else setView('HOME');
  };

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
      if (user) {
          setCurrentUser(user);
          if (user.role.includes('ADMIN')) setView('ADMIN');
          else setView('HOME');
      } else {
          alert('Invalid credentials');
      }
  };

  const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      if(users.find(u => u.email === regEmail)) return alert("Email already exists");
      
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(code);
      alert(`Your Verification Code is: ${code}`);

      const newUser: User = {
          id: Date.now().toString(),
          name: regName,
          email: regEmail,
          password: regPassword,
          role: 'CUSTOMER'
      };
      setTempRegData(newUser);
      setView('VERIFY_OTP');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
      e.preventDefault();
      if(otpInput === generatedOtp && tempRegData) {
          setUsers([...users, tempRegData]);
          setCurrentUser(tempRegData);
          setTempRegData(null);
          setOtpInput('');
          setGeneratedOtp('');
          setView('HOME');
          alert("Registration Successful!");
      } else {
          alert("Invalid OTP");
      }
  };

  const handleSaveConfig = () => {
      localStorage.setItem('site_config', JSON.stringify(siteConfig));
  };

  // If Admin View
  if (view === 'ADMIN' && currentUser?.role.includes('ADMIN')) {
      return (
          <AdminDashboard 
              user={currentUser}
              products={products}
              orders={orders}
              categories={categories}
              siteConfig={siteConfig}
              users={users}
              onAddProduct={(p: Product) => setProducts([...products, p])}
              onUpdateProduct={(p: Product) => setProducts(products.map(pr => pr.id === p.id ? p : pr))}
              onDeleteProduct={(id: string) => setProducts(products.filter(p => p.id !== id))}
              onAddCategory={(c: string) => setCategories([...categories, c])}
              onDeleteCategory={(c: string) => setCategories(categories.filter(cat => cat !== c))}
              onUpdateSiteConfig={setSiteConfig}
              onUpdateOrder={(o: Order) => setOrders(orders.map(ord => ord.id === o.id ? o : ord))}
              onAddUser={(u: User) => setUsers([...users, u])}
              onDeleteUser={(id: string) => setUsers(users.filter(u => u.id !== id))}
              onLogout={() => { setCurrentUser(null); setView('HOME'); }}
              onSaveConfig={handleSaveConfig}
          />
      );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
        {siteConfig.showTopBar && <CouponMarquee text={siteConfig.topBarText} />}
        
        <Navbar 
            cartCount={cartCount} 
            onCartClick={() => setIsCartOpen(true)}
            onNavClick={setView}
            activeView={view}
            siteConfig={siteConfig}
            onMenuClick={() => setIsDrawerOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={(q: string) => { setSearchQuery(q); if(view !== 'SHOP') setView('SHOP'); }}
            currentUser={currentUser}
            onLogout={() => { setCurrentUser(null); setView('HOME'); }}
        />

        <MobileDrawer 
            isOpen={isDrawerOpen} 
            onClose={() => setIsDrawerOpen(false)} 
            onNavClick={setView}
            categories={categories}
            onCategoryClick={(c: string) => { setActiveCategory(c); setView('SHOP'); }}
        />

        <CartSidebar 
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cart={cart}
            onRemove={removeFromCart}
            onUpdateQty={updateQty}
            onCheckout={() => setIsCheckoutOpen(true)}
            total={cartTotal}
        />

        {/* View Content */}
        <div className="flex-1">
            {view === 'HOME' && (
                <>
                    <HeroCarousel slides={siteConfig.heroSlides} onShopClick={() => setView('SHOP')} />
                    {siteConfig.showMarquee && <ProductMarquee products={products.filter(p => p.isFeatured)} onProductClick={setSelectedProduct} />}
                    <CategoryGrid categories={siteConfig.featuredCategories} onCategoryClick={(c) => { setActiveCategory(c); setView('SHOP'); }} />
                    <USPMarquee usps={siteConfig.usps} />
                    <div className="max-w-7xl mx-auto px-4 py-16">
                        <div className="flex justify-between items-end mb-8">
                            <h2 className="text-3xl font-bold text-white">All Products</h2>
                            <button onClick={() => setView('SHOP')} className="text-pink-500 font-bold hover:text-pink-400 flex items-center gap-2">Explore All <ChevronRightIcon className="w-4 h-4" /></button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {products.slice(0, 20).map(p => (
                                <ProductCard key={p.id} product={p} onAddToCart={addToCart} onClick={() => setSelectedProduct(p)} />
                            ))}
                        </div>
                        <div className="mt-12 text-center">
                            <button onClick={() => setView('SHOP')} className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-pink-500 hover:text-white transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                View All Products
                            </button>
                        </div>
                    </div>
                    <TestimonialSection testimonials={siteConfig.testimonials} />
                    <PaymentMarquee />
                    <SocialMarquee />
                    <NewsletterSection />
                </>
            )}

            {view === 'SHOP' && (
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h1 className="text-3xl font-bold text-white">Shop Collection</h1>
                        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2">
                             <button onClick={() => setActiveCategory('ALL')} className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${activeCategory === 'ALL' ? 'bg-pink-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}>All</button>
                             {categories.map(c => (
                                 <button key={c} onClick={() => setActiveCategory(c)} className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${activeCategory === c ? 'bg-pink-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}>{c}</button>
                             ))}
                        </div>
                    </div>
                    
                    {filteredProducts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-zinc-500 text-lg">No products found.</p>
                            <button onClick={() => { setActiveCategory('ALL'); setSearchQuery(''); }} className="mt-4 text-pink-500 hover:underline">Clear Filters</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {filteredProducts.map(p => (
                                <ProductCard key={p.id} product={p} onAddToCart={addToCart} onClick={() => setSelectedProduct(p)} />
                            ))}
                        </div>
                    )}
                </div>
            )}
            
            {view === 'BLOG' && (
                <div className="max-w-4xl mx-auto px-4 py-16">
                     <h1 className="text-4xl font-bold text-white mb-12 text-center">The Velvet Journal</h1>
                     <div className="space-y-12">
                         {INITIAL_BLOG_POSTS.map(post => (
                             <div key={post.id} className={`group cursor-pointer ${GLASS_CARD} rounded-2xl overflow-hidden`} onClick={() => setSelectedBlogPost(post)}>
                                 <div className="aspect-video overflow-hidden">
                                     <img src={post.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                 </div>
                                 <div className="p-8">
                                     <div className="flex items-center gap-4 text-sm text-pink-500 mb-4 font-bold uppercase tracking-wider">
                                         <span>{post.date}</span>
                                         <span>•</span>
                                         <span>{post.author}</span>
                                     </div>
                                     <h2 className="text-2xl font-bold text-white mb-4 group-hover:text-pink-500 transition-colors">{post.title}</h2>
                                     <p className="text-zinc-400 line-clamp-2">{post.excerpt}</p>
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            )}

            {view === 'LOGIN' && (
                <div className="flex items-center justify-center min-h-[80vh] px-4">
                    <div className={`w-full max-w-md p-8 rounded-2xl ${GLASS_PANEL}`}>
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-zinc-400 text-sm mb-1">Email</label>
                                <input type="email" required className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:border-pink-500 outline-none" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-zinc-400 text-sm mb-1">Password</label>
                                <input type="password" required className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:border-pink-500 outline-none" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                            </div>
                            <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-all">Sign In</button>
                        </form>
                        <p className="text-center text-zinc-500 mt-6 text-sm">
                            Don't have an account? <button onClick={() => setView('REGISTER')} className="text-pink-500 hover:underline">Create one</button>
                        </p>
                    </div>
                </div>
            )}
            
            {view === 'REGISTER' && (
                <div className="flex items-center justify-center min-h-[80vh] px-4">
                    <div className={`w-full max-w-md p-8 rounded-2xl ${GLASS_PANEL}`}>
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
                        <form onSubmit={handleRegister} className="space-y-4">
                             <div>
                                <label className="block text-zinc-400 text-sm mb-1">Full Name</label>
                                <input required className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:border-pink-500 outline-none" value={regName} onChange={e => setRegName(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-zinc-400 text-sm mb-1">Email</label>
                                <input type="email" required className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:border-pink-500 outline-none" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-zinc-400 text-sm mb-1">Password</label>
                                <input type="password" required className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:border-pink-500 outline-none" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                            </div>
                            <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-all">Register</button>
                        </form>
                        <p className="text-center text-zinc-500 mt-6 text-sm">
                            Already have an account? <button onClick={() => setView('LOGIN')} className="text-pink-500 hover:underline">Sign In</button>
                        </p>
                    </div>
                </div>
            )}

            {view === 'VERIFY_OTP' && (
                <div className="flex items-center justify-center min-h-[80vh] px-4">
                    <div className={`w-full max-w-md p-8 rounded-2xl ${GLASS_PANEL} text-center`}>
                        <ShieldIcon className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Verify Email</h2>
                        <p className="text-zinc-400 mb-6 text-sm">We've sent a 4-digit code to your email. Please enter it below.</p>
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <input 
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-center text-2xl tracking-[1em] text-white focus:border-pink-500 outline-none" 
                                value={otpInput} 
                                onChange={e => setOtpInput(e.target.value)} 
                                maxLength={4}
                                placeholder="0000"
                            />
                            <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-xl transition-all">Verify Account</button>
                        </form>
                        <button onClick={() => setView('REGISTER')} className="mt-4 text-sm text-zinc-500 hover:text-white">Back to Register</button>
                    </div>
                </div>
            )}

            {view === 'USER_DASHBOARD' && currentUser && (
                <UserDashboard user={currentUser} orders={orders.filter(o => o.details.email === currentUser.email)} onLogout={() => { setCurrentUser(null); setView('HOME'); }} />
            )}
        </div>

        <Footer config={siteConfig} onNavClick={setView} />
        <MobileStickyFooter activeView={view} onNavClick={setView} currentUser={currentUser} />

        {/* Modals */}
        <ProductDetailsModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} config={siteConfig} />
        <BlogPostModal post={selectedBlogPost} isOpen={!!selectedBlogPost} onClose={() => setSelectedBlogPost(null)} />
        <CheckoutModal 
            isOpen={isCheckoutOpen} 
            onClose={() => setIsCheckoutOpen(false)}
            total={cartTotal}
            config={siteConfig.checkout}
            coupons={siteConfig.coupons}
            onCheckout={handleCheckout}
        />
    </div>
  );
};

export default App;