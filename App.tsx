import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
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
            <h4 className="font-bold text-sm text-pink-400">Notification</h4>
            <p className="text-zinc-300 text-xs max-w-[250px] truncate">{message}</p>
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

const createSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

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

const BlogMarquee = ({ posts, onPostClick }: any) => {
    return (
        <div className="py-24 border-t border-white/5 bg-zinc-950 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-pink-900/5 blur-3xl -z-10"></div>
             <div className="max-w-7xl mx-auto px-4 mb-12 flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <span className="text-pink-500 font-bold tracking-widest uppercase text-sm mb-2 block">The Journal</span>
                    <h2 className="text-3xl font-bold text-white">Latest Stories & Trends</h2>
                </div>
            </div>
            <div className="marquee-container group">
                <div className="marquee-content animate-marquee-slow group-hover:paused flex pl-4">
                     {posts.map((post: BlogPost) => (
                         <div key={`bm1-${post.id}`} className={`w-[400px] flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer ${GLASS_CARD}`} onClick={() => onPostClick(post)}>
                             <div className="h-64 overflow-hidden relative">
                                 <img src={post.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={post.title} />
                                 <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                     <span className="text-xs font-bold text-white uppercase tracking-wider">{post.date}</span>
                                 </div>
                             </div>
                             <div className="p-6">
                                 <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors line-clamp-1">{post.title}</h3>
                                 <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                             </div>
                         </div>
                     ))}
                </div>
                <div className="marquee-content animate-marquee-slow group-hover:paused flex pl-4" aria-hidden="true">
                     {posts.map((post: BlogPost) => (
                         <div key={`bm2-${post.id}`} className={`w-[400px] flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer ${GLASS_CARD}`} onClick={() => onPostClick(post)}>
                             <div className="h-64 overflow-hidden relative">
                                 <img src={post.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={post.title} />
                                 <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                     <span className="text-xs font-bold text-white uppercase tracking-wider">{post.date}</span>
                                 </div>
                             </div>
                             <div className="p-6">
                                 <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-400 transition-colors line-clamp-1">{post.title}</h3>
                                 <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                             </div>
                         </div>
                     ))}
                </div>
            </div>
        </div>
    )
}

const TestimonialSection = ({ testimonials }: any) => (
    <div className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-white mb-16">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t: Testimonial) => (
                    <div key={t.id} className={`${GLASS_PANEL} p-8 rounded-2xl relative`}>
                        <p className="text-zinc-300 italic mb-6 pt-4">"{t.comment}"</p>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-white font-bold">{t.name}</h4>
                                <span className="text-pink-400 text-xs uppercase tracking-wide">{t.role}</span>
                            </div>
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, idx) => (
                                    <div key={idx}><StarIcon className={`w-4 h-4 ${idx < t.rating ? 'fill-current' : 'text-zinc-600'}`} /></div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const CategoryGrid = ({ categories, onCategoryClick }: any) => (
    <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center text-white mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat: FeaturedCategory, idx: number) => (
                <div key={idx} onClick={() => onCategoryClick(cat.filterValue)} className={`group relative rounded-xl overflow-hidden aspect-square cursor-pointer border border-white/10 hover:border-pink-500/50 transition-all duration-500 shadow-lg`}>
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

const USPMarquee = ({ usps }: any) => (
    <div className="w-full bg-zinc-950/80 border-t border-b border-white/5 py-4 overflow-hidden backdrop-blur-md">
        <div className="marquee-container">
            <div className="marquee-content animate-marquee-reverse text-zinc-300 font-medium tracking-wide flex items-center gap-8 md:gap-12">
                {usps.map((usp: USPItem, i: number) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="uppercase text-sm">{usp.text}</span>
                    </div>
                ))}
                {usps.map((usp: USPItem, i: number) => (
                    <div key={`dup-${i}`} className="flex items-center gap-3">
                        <span className="uppercase text-sm">{usp.text}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const CouponMarquee = ({ text }: { text: string }) => (
    <div className="w-full bg-pink-900 text-white text-[10px] md:text-xs py-2 overflow-hidden border-b border-white/10 z-[60]">
        <div className="marquee-container">
            <div className="marquee-content animate-marquee-slow flex items-center gap-12 whitespace-nowrap font-medium tracking-widest uppercase">
                {[...Array(10)].map((_, i) => (
                    <span key={i} className="flex items-center gap-4">
                        <SparklesIcon className="w-3 h-3 text-white" />
                        {text}
                    </span>
                ))}
            </div>
        </div>
    </div>
);

const PaymentMarquee = () => (
    <div className="w-full bg-zinc-900 border-t border-white/5 py-6 overflow-hidden">
        <h3 className="text-center text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">We Accept</h3>
        <div className="marquee-container">
            <div className="marquee-content animate-marquee-reverse flex items-center gap-16">
                {[...Array(6)].map((_, i) => (
                    <React.Fragment key={i}>
                        <div className="flex items-center gap-3"><BkashIcon className="w-8 h-8 text-pink-500" /><span className="text-zinc-300 text-sm font-bold uppercase tracking-wider">bKash</span></div>
                        <div className="flex items-center gap-3"><NagadIcon className="w-8 h-8 text-orange-500" /><span className="text-zinc-300 text-sm font-bold uppercase tracking-wider">Nagad</span></div>
                        <div className="flex items-center gap-3"><CardIcon className="w-8 h-8 text-blue-400" /><span className="text-zinc-300 text-sm font-bold uppercase tracking-wider">Card</span></div>
                        <div className="flex items-center gap-3"><TruckIcon className="w-8 h-8 text-green-400" /><span className="text-zinc-300 text-sm font-bold uppercase tracking-wider">COD</span></div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    </div>
);

const SocialMarquee = () => (
    <div className="w-full bg-zinc-950 border-t border-white/5 py-10 overflow-hidden">
        <div className="marquee-container">
            <div className="marquee-content animate-marquee flex items-center gap-24">
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

const NewsletterSection = () => (
    <div className="bg-pink-900/10 border-y border-white/5 py-16 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <span className="text-pink-500 font-bold tracking-widest uppercase text-sm mb-2 block">Stay in the Loop</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Unlock Exclusive Benefits</h2>
            <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
                <input type="email" placeholder="Enter your email address" className="flex-1 bg-black/40 border border-white/10 rounded-full px-6 py-3 text-white focus:border-pink-500 outline-none" />
                <button className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-8 py-3 rounded-full transition-transform hover:scale-105 shadow-lg shadow-pink-600/20">Subscribe</button>
            </div>
        </div>
    </div>
);

const Footer = ({ config, onNavClick }: any) => (
    <footer className="bg-zinc-950 border-t border-white/10 pt-16 pb-24 md:pb-8 w-full mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
                <h3 className="text-2xl font-bold text-white mb-6">{config.headerTitle}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">{config.footerText}</p>
            </div>
            <div>
                <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Shop</h4>
                <ul className="space-y-3 text-sm text-zinc-400">
                    <li className="hover:text-pink-500 cursor-pointer" onClick={() => onNavClick('SHOP')}>Bags</li>
                    <li className="hover:text-pink-500 cursor-pointer" onClick={() => onNavClick('SHOP')}>Keychains</li>
                </ul>
            </div>
            <div>
                 <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Help</h4>
                 <ul className="space-y-3 text-sm text-zinc-400">
                    <li className="hover:text-pink-500 cursor-pointer">Contact Us</li>
                    <li className="hover:text-pink-500 cursor-pointer">Track Order</li>
                 </ul>
            </div>
        </div>
        <div className="border-t border-white/5 pt-8 text-center text-zinc-600 text-lg uppercase tracking-wider">
            {config.copyrightText}
        </div>
    </footer>
);

const MobileStickyFooter = ({ activeView, onNavClick, currentUser }: any) => (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-lg border-t border-white/10 z-50 md:hidden flex justify-around items-center h-16 px-2 pb-safe shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <button onClick={() => onNavClick('HOME')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform ${activeView === 'HOME' ? 'text-pink-500' : 'text-zinc-400'}`}>
            <HomeIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
        </button>
        <button onClick={() => onNavClick(currentUser ? (currentUser.role.includes('ADMIN') ? 'ADMIN' : 'USER_DASHBOARD') : 'LOGIN')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform ${['LOGIN','ADMIN'].includes(activeView) ? 'text-pink-500' : 'text-zinc-400'}`}>
            <UserIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium">Profile</span>
        </button>
        <button onClick={() => onNavClick('SHOP')} className={`flex flex-col items-center justify-center w-full h-full space-y-1 active:scale-95 transition-transform ${activeView === 'SHOP' ? 'text-pink-500' : 'text-zinc-400'}`}>
            <ShoppingBagIcon className="w-5 h-5" />
            <span className="text-[10px] font-medium">Shop</span>
        </button>
    </div>
);

// --- Main App Components ---

const Navbar = ({ cartCount, onCartClick, onNavClick, activeView, siteConfig, onMenuClick, searchQuery, onSearchChange, currentUser, onLogout }: any) => (
    <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="md:hidden text-white hover:text-pink-500 transition-colors"><MenuIcon /></button>
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
                 <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white focus:border-pink-500 focus:bg-white/10 outline-none transition-all pl-10" />
                 <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            </div>
            <div className="flex items-center gap-4">
                {currentUser ? (
                     <div className="hidden md:flex items-center gap-4">
                         <span className="text-sm text-zinc-400">Hi, {currentUser.name.split(' ')[0]}</span>
                         <button onClick={() => onNavClick(currentUser.role.includes('ADMIN') ? 'ADMIN' : 'USER_DASHBOARD')} className="p-2 hover:bg-white/5 rounded-full text-zinc-300 hover:text-white transition-colors"><UserIcon className="w-5 h-5" /></button>
                         <button onClick={onLogout} className="p-2 hover:bg-white/5 rounded-full text-zinc-300 hover:text-red-500 transition-colors"><LogOutIcon className="w-5 h-5" /></button>
                     </div>
                ) : (
                    <button onClick={() => onNavClick('LOGIN')} className="hidden md:block text-sm font-medium text-zinc-300 hover:text-white">Login</button>
                )}
                <button onClick={onCartClick} className="relative p-2 hover:bg-white/5 rounded-full text-white transition-colors">
                    <ShoppingBagIcon className="w-6 h-6" />
                    {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-pink-600 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-lg border border-black">{cartCount}</span>}
                </button>
            </div>
        </div>
    </nav>
);

const MobileDrawer = ({ isOpen, onClose, onNavClick, categories, onCategoryClick }: any) => (
    <div className={`fixed inset-y-0 left-0 w-[80%] max-w-sm bg-zinc-900 border-r border-white/10 p-6 z-[80] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <div className="flex items-center justify-between mb-8"><span className="text-xl font-bold text-white">Menu</span><button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white"><XIcon /></button></div>
         <div className="space-y-6">
             <button onClick={() => { onNavClick('HOME'); onClose(); }} className="block text-lg font-medium text-zinc-300 hover:text-pink-500">Home</button>
             <button onClick={() => { onNavClick('SHOP'); onClose(); }} className="block text-lg font-medium text-zinc-300 hover:text-pink-500">Shop All</button>
             <div className="pl-4 border-l border-white/10 space-y-4">{categories.map((c: string) => <button key={c} onClick={() => { onCategoryClick(c); onClose(); }} className="block text-sm text-zinc-400 hover:text-white">{c}</button>)}</div>
         </div>
    </div>
);

const CartSidebar = ({ isOpen, onClose, cart, onRemove, onUpdateQty, onCheckout, total }: any) => (
    <>
        {isOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]" onClick={onClose} />}
        <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-zinc-900 border-l border-white/10 shadow-2xl transform transition-transform duration-300 z-[70] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
             <div className="flex flex-col h-full">
                 <div className="p-6 border-b border-white/10 flex items-center justify-between"><h2 className="text-xl font-bold text-white">Your Cart ({cart.length})</h2><button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-400 hover:text-white"><XIcon /></button></div>
                 <div className="flex-1 overflow-y-auto p-6 space-y-6">
                     {cart.length === 0 ? <div className="text-center text-zinc-500 mt-20">Your cart is empty.</div> : cart.map((item: CartItem) => (
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
                     ))}
                 </div>
                 <div className="p-6 border-t border-white/10 bg-zinc-900">
                     <div className="flex justify-between mb-4 text-lg font-bold text-white"><span>Total</span><span>৳{total.toLocaleString()}</span></div>
                     <button onClick={onCheckout} disabled={cart.length === 0} className="w-full bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all">Checkout</button>
                 </div>
             </div>
        </div>
    </>
);

const ProductCard = ({ product, onAddToCart, onClick }: any) => (
    <div className={`group relative rounded-xl overflow-hidden ${GLASS_CARD}`}>
        <div className="relative aspect-[4/5] overflow-hidden cursor-pointer" onClick={onClick}>
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            {product.isNew && <span className="absolute top-3 left-3 bg-white text-black text-xs font-bold px-2 py-1 uppercase tracking-wider">New</span>}
            {product.isFeatured && <span className="absolute top-3 right-3 bg-pink-600 text-white text-xs font-bold px-2 py-1 uppercase tracking-wider">Hot</span>}
            <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center pb-6 bg-gradient-to-t from-black/80 to-transparent">
                 <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-pink-500 hover:text-white transition-colors shadow-lg">Add to Cart</button>
            </div>
        </div>
        <div className="p-4 cursor-pointer" onClick={onClick}>
            <h3 className="text-white font-bold truncate group-hover:text-pink-500 transition-colors">{product.name}</h3>
            <p className="text-zinc-400 text-xs mb-2">{product.category}</p>
            <div className="flex items-center justify-between"><span className="text-pink-400 font-bold">৳{product.price.toLocaleString()}</span></div>
        </div>
    </div>
);

const UserDashboard = ({ user, orders, onLogout }: any) => {
    const userOrders = orders.filter((o: Order) => o.details.email === user.email);
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">My Dashboard</h2>
                <button onClick={onLogout} className="text-pink-500 hover:text-white">Sign Out</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                    <h3 className="text-xl font-bold text-white mb-4">Profile Information</h3>
                    <p className="text-zinc-400">Name: <span className="text-white">{user.name}</span></p>
                    <p className="text-zinc-400">Email: <span className="text-white">{user.email}</span></p>
                    <p className="text-zinc-400">Role: <span className="text-white">{user.role}</span></p>
                </div>
                <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                    <h3 className="text-xl font-bold text-white mb-4">Order History</h3>
                    {userOrders.length === 0 ? (
                        <p className="text-zinc-500">No orders found.</p>
                    ) : (
                        <div className="space-y-4">
                            {userOrders.map((order: Order) => (
                                <div key={order.id} className="border border-white/10 p-4 rounded-lg">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-white font-bold">Order #{order.id}</span>
                                        <span className={`text-xs px-2 py-1 rounded ${order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{order.status}</span>
                                    </div>
                                    <p className="text-zinc-400 text-sm">{new Date(order.date).toLocaleDateString()}</p>
                                    <p className="text-pink-400 font-bold mt-2">৳{order.finalTotal.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProductDetailsModal = ({ isOpen, onClose, product, onAddToCart, config }: any) => {
    if (!isOpen || !product) return null;
    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm ${isOpen ? 'animate-in fade-in' : 'animate-out fade-out'}`} onClick={onClose}>
            <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 rounded-2xl border border-white/10 shadow-2xl flex flex-col md:flex-row ${GLASS_MODAL}`} onClick={e => e.stopPropagation()}>
                <div className="w-full md:w-1/2 aspect-square md:aspect-auto">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="w-full md:w-1/2 p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">{product.name}</h2>
                            <span className="bg-pink-600/20 text-pink-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{product.category}</span>
                        </div>
                        <button onClick={onClose} className="text-zinc-400 hover:text-white"><XIcon /></button>
                    </div>
                    <p className="text-2xl font-bold text-white mb-6">৳{product.price.toLocaleString()}</p>
                    <p className="text-zinc-300 leading-relaxed mb-8">{product.description}</p>
                    
                    {config.productHighlights && (
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {config.productHighlights.showShipping && (
                                <div className="flex items-center gap-3 text-sm text-zinc-400">
                                    <TruckIcon className="w-5 h-5 text-pink-500" />
                                    <span>{config.productHighlights.shippingText}</span>
                                </div>
                            )}
                            {config.productHighlights.showWarranty && (
                                <div className="flex items-center gap-3 text-sm text-zinc-400">
                                    <ShieldIcon className="w-5 h-5 text-pink-500" />
                                    <span>{config.productHighlights.warrantyText}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-auto">
                        <button onClick={() => { onAddToCart(product); onClose(); }} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-pink-600/20">
                            Add to Cart - ৳{product.price.toLocaleString()}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CheckoutModal = ({ isOpen, onClose, total, config, onCheckout, coupons }: any) => {
    const [step, setStep] = useState(1);
    const [details, setDetails] = useState<CheckoutDetails>({
        fullName: '', email: '', phone: '', address: '', city: '', zip: '', paymentMethod: 'COD'
    });
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

    if (!isOpen) return null;

    const handleApplyCoupon = () => {
        const coupon = coupons.find((c: Coupon) => c.code === couponCode && c.isActive);
        if (coupon) {
            setDiscount((total * coupon.discountPercent) / 100);
        } else {
            alert("Invalid or expired coupon");
        }
    };

    const shippingCost = total >= config.freeShippingThreshold ? 0 : config.shippingCharge;
    const finalTotal = total - discount + shippingCost;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className={`w-full max-w-2xl bg-zinc-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden ${GLASS_MODAL}`} onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Checkout</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white"><XIcon /></button>
                </div>
                <div className="p-8">
                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right">
                            <h3 className="text-lg font-bold text-pink-400 mb-4">Shipping Details</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="Full Name" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white w-full" value={details.fullName} onChange={e => setDetails({...details, fullName: e.target.value})} />
                                <input placeholder="Email" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white w-full" value={details.email} onChange={e => setDetails({...details, email: e.target.value})} />
                            </div>
                            <input placeholder="Phone Number" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white w-full" value={details.phone} onChange={e => setDetails({...details, phone: e.target.value})} />
                            <input placeholder="Address" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white w-full" value={details.address} onChange={e => setDetails({...details, address: e.target.value})} />
                            <div className="grid grid-cols-2 gap-4">
                                <input placeholder="City" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white w-full" value={details.city} onChange={e => setDetails({...details, city: e.target.value})} />
                                <input placeholder="ZIP Code" className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white w-full" value={details.zip} onChange={e => setDetails({...details, zip: e.target.value})} />
                            </div>
                            <button onClick={() => setStep(2)} className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg mt-4">Next: Payment</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right">
                            <h3 className="text-lg font-bold text-pink-400 mb-4">Payment Method</h3>
                            <div className="grid grid-cols-3 gap-4">
                                <button onClick={() => setDetails({...details, paymentMethod: 'COD'})} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${details.paymentMethod === 'COD' ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 hover:bg-white/5'}`}>
                                    <TruckIcon className="w-6 h-6" />
                                    <span className="text-xs font-bold">COD</span>
                                </button>
                                <button onClick={() => setDetails({...details, paymentMethod: 'BKASH'})} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${details.paymentMethod === 'BKASH' ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 hover:bg-white/5'}`}>
                                    <BkashIcon className="w-6 h-6 text-pink-500" />
                                    <span className="text-xs font-bold">bKash</span>
                                </button>
                                <button onClick={() => setDetails({...details, paymentMethod: 'CARD'})} className={`p-4 rounded-xl border flex flex-col items-center gap-2 ${details.paymentMethod === 'CARD' ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 hover:bg-white/5'}`}>
                                    <CardIcon className="w-6 h-6" />
                                    <span className="text-xs font-bold">Card</span>
                                </button>
                            </div>

                            {details.paymentMethod === 'BKASH' && (
                                <div className="bg-pink-900/20 p-4 rounded-lg border border-pink-500/30">
                                    <p className="text-sm text-zinc-300 mb-2">{config.bkashInstructions}</p>
                                    <p className="text-lg font-bold text-pink-500 mb-4">{config.bkashNumber}</p>
                                    <input placeholder="Transaction ID" className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white w-full text-sm" value={details.bkashTransactionId || ''} onChange={e => setDetails({...details, bkashTransactionId: e.target.value})} />
                                </div>
                            )}

                            <div>
                                <div className="flex gap-2 mb-4">
                                    <input placeholder="Coupon Code" className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white text-sm" value={couponCode} onChange={e => setCouponCode(e.target.value)} />
                                    <button onClick={handleApplyCoupon} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold">Apply</button>
                                </div>
                                <div className="flex justify-between text-zinc-400 text-sm mb-1"><span>Subtotal</span><span>৳{total.toLocaleString()}</span></div>
                                <div className="flex justify-between text-pink-400 text-sm mb-2"><span>Discount</span><span>-৳{discount.toLocaleString()}</span></div>
                                <div className="flex justify-between text-zinc-400 text-sm mb-2"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : `৳${shippingCost.toLocaleString()}`}</span></div>
                                <div className="flex justify-between text-white font-bold text-lg border-t border-white/10 pt-2"><span>Total</span><span>৳{finalTotal.toLocaleString()}</span></div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="w-1/3 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-lg">Back</button>
                                <button onClick={() => onCheckout(details, discount, finalTotal)} className="w-2/3 bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg">Place Order</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const BlogPostModal = ({ isOpen, onClose, post }: any) => {
    if (!isOpen || !post) return null;
    return (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-zinc-900 rounded-2xl border border-white/10 shadow-2xl ${GLASS_MODAL}`} onClick={e => e.stopPropagation()}>
                <div className="relative h-64 md:h-80">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
                    <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-pink-600 transition-colors"><XIcon /></button>
                    <div className="absolute bottom-6 left-6 right-6">
                        <span className="bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">{post.date}</span>
                        <h2 className="text-3xl font-bold text-white leading-tight">{post.title}</h2>
                    </div>
                </div>
                <div className="p-8">
                     <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-6">
                         <div className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center font-bold text-white">{post.author.charAt(0)}</div>
                         <div>
                             <p className="text-white font-bold text-sm">By {post.author}</p>
                             <p className="text-zinc-500 text-xs">Velvet & Vogue Contributor</p>
                         </div>
                     </div>
                     <div className="prose prose-invert max-w-none">
                         <p className="text-zinc-300 leading-relaxed text-lg">{post.content}</p>
                         <p className="text-zinc-300 leading-relaxed mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                     </div>
                </div>
            </div>
         </div>
    );
};

const AdminDashboard = ({ 
    user, products, orders, categories, siteConfig, users, blogPosts,
    onAddProduct, onUpdateProduct, onDeleteProduct, 
    onAddCategory, onDeleteCategory, onUpdateSiteConfig, 
    onUpdateOrder, onAddUser, onDeleteUser, onLogout,
    onAddBlogPost, onUpdateBlogPost, onDeleteBlogPost,
    onSaveConfig 
}: any) => {
    const [tab, setTab] = useState<'OVERVIEW' | 'PRODUCTS' | 'CATEGORIES' | 'ORDERS' | 'USERS' | 'BLOG' | 'DESIGN' | 'SETTINGS'>('OVERVIEW');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
    
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
    
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [generatingDesc, setGeneratingDesc] = useState(false);
    const [prodForm, setProdForm] = useState<Partial<Product>>({});
    const [newUserForm, setNewUserForm] = useState<Partial<User>>({ role: 'CUSTOMER' });
    const [blogForm, setBlogForm] = useState<Partial<BlogPost>>({});
    const [newCoupon, setNewCoupon] = useState({ code: '', discount: 10 });

    const updateConfig = (key: keyof SiteConfig, value: any) => { onUpdateSiteConfig({ ...siteConfig, [key]: value }); };
    const updateNestedConfig = (parent: keyof SiteConfig, key: string, value: any) => { onUpdateSiteConfig({ ...siteConfig, [parent]: { ...siteConfig[parent], [key]: value } }); };
    const updateArrayConfig = (parent: keyof SiteConfig, index: number, key: string, value: any) => { const arr = [...(siteConfig[parent] as any[])]; arr[index] = { ...arr[index], [key]: value }; onUpdateSiteConfig({ ...siteConfig, [parent]: arr }); };
    
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => { 
        const file = e.target.files?.[0]; 
        if (file) { 
            const reader = new FileReader(); 
            reader.onloadend = () => { 
                if (typeof reader.result === 'string') { callback(reader.result); } 
            }; 
            reader.readAsDataURL(file); 
        } 
    };

    const handleSaveProduct = () => {
        if (!prodForm.name || !prodForm.price) return alert("Name and Price required");
        
        // Auto-generate slug if not provided
        let finalSlug = prodForm.slug;
        if (!finalSlug && prodForm.name) {
            finalSlug = createSlug(prodForm.name);
        }

        const product: Product = {
            id: editingProduct ? editingProduct.id : Date.now().toString(),
            name: prodForm.name!,
            slug: finalSlug || '',
            price: Number(prodForm.price),
            category: prodForm.category || categories[0],
            description: prodForm.description || '',
            image: prodForm.image || 'https://picsum.photos/400',
            isNew: prodForm.isNew || false,
            isFeatured: prodForm.isFeatured || false
        };
        if (editingProduct) onUpdateProduct(product); else onAddProduct(product);
        setIsProductModalOpen(false); setEditingProduct(null); setProdForm({});
    };

    const handleSaveBlogPost = () => {
        if (!blogForm.title || !blogForm.content) return alert("Title and Content required");

        let finalSlug = blogForm.slug;
        if (!finalSlug && blogForm.title) {
            finalSlug = createSlug(blogForm.title);
        }

        const post: BlogPost = {
            id: editingBlogPost ? editingBlogPost.id : Date.now().toString(),
            title: blogForm.title!,
            slug: finalSlug || '',
            content: blogForm.content!,
            excerpt: blogForm.excerpt || blogForm.content!.substring(0, 100) + '...',
            image: blogForm.image || 'https://picsum.photos/800/400',
            date: blogForm.date || new Date().toLocaleDateString(),
            author: blogForm.author || user.name
        };

        if (editingBlogPost) onUpdateBlogPost(post); else onAddBlogPost(post);
        setIsBlogModalOpen(false); setEditingBlogPost(null); setBlogForm({});
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
        onAddUser({ id: Date.now().toString(), name: newUserForm.name!, email: newUserForm.email!, password: newUserForm.password!, role: newUserForm.role || 'CUSTOMER' });
        setNewUserForm({ role: 'CUSTOMER' }); setIsUserModalOpen(false);
    };

    const handleAddCoupon = () => {
        if(!newCoupon.code) return;
        const updated = [...siteConfig.coupons, { code: newCoupon.code, discountPercent: Number(newCoupon.discount), isActive: true }];
        onUpdateSiteConfig({...siteConfig, coupons: updated});
        setNewCoupon({ code: '', discount: 10 });
    }

    const handleDeleteCoupon = (index: number) => {
        const updated = siteConfig.coupons.filter((_, i) => i !== index);
        onUpdateSiteConfig({...siteConfig, coupons: updated});
    }

    const handleSave = () => {
        onSaveConfig();
    };

    return (
        <div className="flex h-screen bg-zinc-950 overflow-hidden relative">
             {showToast && <Toast message="Attempting to save configuration..." onClose={() => setShowToast(false)} />}
             {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />}
             
             {/* Admin Sidebar */}
             <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-900 border-r border-white/10 flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:flex`}>
                 <div className="p-6 border-b border-white/10 flex justify-between items-center"><span className="text-xl font-bold text-white tracking-tight">Velvet Admin</span><button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-zinc-400 hover:text-white p-2"><XIcon /></button></div>
                 <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                     {[{ id: 'OVERVIEW', icon: BarChartIcon, label: 'Overview' }, { id: 'PRODUCTS', icon: BoxIcon, label: 'Products' }, { id: 'CATEGORIES', icon: TagIcon, label: 'Categories' }, { id: 'ORDERS', icon: ShoppingBagIcon, label: 'Orders' }, { id: 'USERS', icon: UserIcon, label: 'Users' }, { id: 'BLOG', icon: FileTextIcon, label: 'Blog' }, { id: 'DESIGN', icon: LayoutIcon, label: 'Store Design' }, { id: 'SETTINGS', icon: SettingsIcon, label: 'Settings' }].map(item => (
                         <button key={item.id} onClick={() => { setTab(item.id as any); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${tab === item.id ? 'bg-pink-600 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}><item.icon className="w-5 h-5" /><span className="font-medium">{item.label}</span></button>
                     ))}
                 </nav>
                 <div className="p-4 border-t border-white/10"><button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-red-400 transition-colors"><LogOutIcon className="w-5 h-5" /><span>Sign Out</span></button></div>
             </div>

             {/* Main Content */}
             <div className="flex-1 overflow-y-auto">
                 <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-zinc-900/50 backdrop-blur sticky top-0 z-10">
                     <div className="flex items-center gap-4"><button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-white hover:text-pink-500 transition-colors"><MenuIcon /></button><h2 className="text-xl font-bold text-white">{tab.charAt(0) + tab.slice(1).toLowerCase().replace('_', ' ')}</h2></div>
                     <div className="flex items-center gap-4">{(tab === 'DESIGN' || tab === 'SETTINGS' || tab === 'PRODUCTS' || tab === 'USERS' || tab === 'BLOG') && <button onClick={handleSave} className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-pink-600/20 flex items-center gap-2"><SparklesIcon className="w-4 h-4" /> Save Changes</button>}<div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">{user.name.charAt(0)}</div></div>
                 </header>

                 <main className="p-4 md:p-8">
                     {tab === 'OVERVIEW' && (
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}><h3 className="text-zinc-400 text-sm font-bold uppercase">Total Sales</h3><p className="text-3xl font-bold text-white mt-2">৳{orders.reduce((acc: number, o: Order) => acc + o.finalTotal, 0).toLocaleString()}</p></div>
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}><h3 className="text-zinc-400 text-sm font-bold uppercase">Total Orders</h3><p className="text-3xl font-bold text-white mt-2">{orders.length}</p></div>
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}><h3 className="text-zinc-400 text-sm font-bold uppercase">Products</h3><p className="text-3xl font-bold text-white mt-2">{products.length}</p></div>
                         </div>
                     )}

                     {tab === 'PRODUCTS' && (
                         <div className="space-y-6">
                             <div className="flex justify-end"><button onClick={() => { setEditingProduct(null); setProdForm({}); setIsProductModalOpen(true); }} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><PlusIcon className="w-4 h-4" /> Add Product</button></div>
                             <div className={`rounded-xl overflow-hidden ${GLASS_PANEL} overflow-x-auto`}><table className="w-full text-left min-w-[600px]"><thead className="bg-white/5 text-zinc-400 text-xs uppercase"><tr><th className="p-4">Product</th><th className="p-4">Price</th><th className="p-4">Category</th><th className="p-4">Actions</th></tr></thead><tbody className="divide-y divide-white/5">{products.map((p: Product) => (<tr key={p.id} className="text-sm hover:bg-white/5"><td className="p-4 flex items-center gap-3"><img src={p.image} className="w-10 h-10 rounded object-cover" /><span className="font-medium text-white">{p.name}</span></td><td className="p-4 text-zinc-300">৳{p.price}</td><td className="p-4 text-zinc-300">{p.category}</td><td className="p-4 flex gap-2"><button onClick={() => { setEditingProduct(p); setProdForm(p); setIsProductModalOpen(true); }} className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/40"><EditIcon className="w-4 h-4" /></button><button onClick={() => onDeleteProduct(p.id)} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40"><TrashIcon className="w-4 h-4" /></button></td></tr>))}</tbody></table></div>
                         </div>
                     )}

                     {tab === 'CATEGORIES' && (
                         <div className={`p-6 rounded-xl ${GLASS_PANEL} max-w-2xl`}>
                            <h3 className="text-xl font-bold text-white mb-6">Product Categories</h3>
                            <div className="flex gap-2 mb-6"><input value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} placeholder="New Category Name" className="flex-1 bg-black/40 border border-white/10 rounded px-4 py-2 text-white" /><button onClick={() => { if(newCategoryName && !categories.includes(newCategoryName)) { onAddCategory(newCategoryName); setNewCategoryName(''); } }} className="bg-pink-600 hover:bg-pink-700 text-white px-6 rounded font-bold">Add</button></div>
                            <div className="space-y-2">{categories.map((c: string) => (<div key={c} className="flex items-center justify-between bg-white/5 p-3 rounded border border-white/5"><span className="text-white">{c}</span><button onClick={() => onDeleteCategory(c)} className="text-zinc-500 hover:text-red-400"><TrashIcon className="w-4 h-4" /></button></div>))}</div>
                         </div>
                     )}
                     
                     {tab === 'ORDERS' && <div className={`p-6 rounded-xl ${GLASS_PANEL}`}><h3 className="text-white mb-4 font-bold">All Orders</h3><div className="overflow-x-auto"><table className="w-full text-left"><thead className="text-zinc-400 text-xs uppercase bg-white/5"><tr><th className="p-3">Order ID</th><th className="p-3">Customer</th><th className="p-3">Total</th><th className="p-3">Status</th></tr></thead><tbody className="divide-y divide-white/5">{orders.map((o: Order) => (<tr key={o.id} className="text-sm text-zinc-300"><td className="p-3">#{o.id}</td><td className="p-3">{o.details.fullName}</td><td className="p-3">৳{o.finalTotal}</td><td className="p-3">{o.status}</td></tr>))}</tbody></table></div></div>}
                     
                     {tab === 'USERS' && (
                        <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-white font-bold">Users</h3>
                                <button onClick={() => { setNewUserForm({ role: 'CUSTOMER' }); setIsUserModalOpen(true); }} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><PlusIcon className="w-4 h-4" /> Add User</button>
                            </div>
                            <div className="space-y-2">
                                {users.map((u: User) => (
                                    <div key={u.id} className="flex justify-between items-center bg-white/5 p-3 rounded">
                                        <div>
                                            <p className="text-white font-medium">{u.name}</p>
                                            <p className="text-zinc-400 text-sm">{u.email} <span className="text-zinc-600">({u.role})</span></p>
                                        </div>
                                        <button onClick={() => onDeleteUser(u.id)} className="text-red-400 hover:text-red-300"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                     )}

                     {tab === 'BLOG' && (
                        <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-white font-bold">Blog Posts</h3>
                                <button onClick={() => { setEditingBlogPost(null); setBlogForm({}); setIsBlogModalOpen(true); }} className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><PlusIcon className="w-4 h-4" /> Add Post</button>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {blogPosts.map((post: BlogPost) => (
                                    <div key={post.id} className="bg-white/5 p-4 rounded-xl flex gap-4 items-center">
                                        <img src={post.image} className="w-20 h-20 object-cover rounded-lg bg-black/40" />
                                        <div className="flex-1">
                                            <h4 className="text-white font-bold text-lg">{post.title}</h4>
                                            <p className="text-zinc-500 text-xs italic">/{post.slug}</p>
                                            <p className="text-zinc-400 text-sm line-clamp-1">{post.excerpt}</p>
                                            <p className="text-zinc-500 text-xs mt-1">By {post.author} on {post.date}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setEditingBlogPost(post); setBlogForm(post); setIsBlogModalOpen(true); }} className="p-2 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/40"><EditIcon className="w-4 h-4" /></button>
                                            <button onClick={() => onDeleteBlogPost(post.id)} className="p-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/40"><TrashIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
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
                                                <label className="text-xs text-zinc-500 mt-2 block">Subtitle</label>
                                                <input value={slide.subtitle} onChange={e => updateArrayConfig('heroSlides', i, 'subtitle', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white" />
                                                <label className="text-xs text-zinc-500 mt-2 block">CTA</label>
                                                <input value={slide.cta} onChange={e => updateArrayConfig('heroSlides', i, 'cta', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs text-zinc-500">Image</label>
                                                <div className="flex gap-2">
                                                    <input value={slide.image} onChange={e => updateArrayConfig('heroSlides', i, 'image', e.target.value)} className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white" />
                                                    <label className="bg-white/10 hover:bg-white/20 p-1 rounded cursor-pointer flex items-center justify-center">
                                                        <UploadIcon className="w-4 h-4 text-white" />
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => updateArrayConfig('heroSlides', i, 'image', url))} />
                                                    </label>
                                                </div>
                                                <img src={slide.image} className="w-full h-24 object-cover rounded mt-2 opacity-50" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                             </div>
                             {/* Testimonials */}
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}><h3 className="text-lg font-bold text-white mb-6">Testimonials</h3><div className="space-y-4">{siteConfig.testimonials.map((t: Testimonial, i: number) => (<div key={i} className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-2"><input value={t.name} onChange={e => updateArrayConfig('testimonials', i, 'name', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white" /><textarea value={t.comment} onChange={e => updateArrayConfig('testimonials', i, 'comment', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-2 py-1 text-sm text-white" /></div>))}</div></div>
                         </div>
                     )}

                     {tab === 'SETTINGS' && (
                         <div className="space-y-6 pb-20">
                             {/* General */}
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-lg font-bold text-pink-500 mb-4 border-b border-white/10 pb-2">General Settings</h3>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div><label className="block text-zinc-400 text-sm mb-1">Store Name</label><input className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" value={siteConfig.headerTitle} onChange={e => updateConfig('headerTitle', e.target.value)} /></div>
                                     <div><label className="block text-zinc-400 text-sm mb-1">Footer Text</label><input className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" value={siteConfig.footerText} onChange={e => updateConfig('footerText', e.target.value)} /></div>
                                 </div>
                             </div>

                            {/* Contact & Social */}
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-lg font-bold text-pink-500 mb-4 border-b border-white/10 pb-2">Contact & Social</h3>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                     <div><label className="text-xs text-zinc-500">Email</label><input className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" value={siteConfig.contactInfo.email} onChange={e => updateNestedConfig('contactInfo', 'email', e.target.value)} /></div>
                                     <div><label className="text-xs text-zinc-500">Phone</label><input className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" value={siteConfig.contactInfo.phone} onChange={e => updateNestedConfig('contactInfo', 'phone', e.target.value)} /></div>
                                     <div><label className="text-xs text-zinc-500">Facebook URL</label><input className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" value={siteConfig.contactInfo.facebook} onChange={e => updateNestedConfig('contactInfo', 'facebook', e.target.value)} /></div>
                                     <div><label className="text-xs text-zinc-500">Instagram URL</label><input className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" value={siteConfig.contactInfo.instagram} onChange={e => updateNestedConfig('contactInfo', 'instagram', e.target.value)} /></div>
                                 </div>
                             </div>

                             {/* Checkout Settings */}
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-lg font-bold text-pink-500 mb-4 border-b border-white/10 pb-2">Checkout Settings</h3>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                     <div>
                                         <label className="block text-zinc-400 text-sm mb-1">Standard Shipping Charge (৳)</label>
                                         <input 
                                            type="number"
                                            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" 
                                            value={siteConfig.checkout.shippingCharge} 
                                            onChange={e => updateNestedConfig('checkout', 'shippingCharge', Number(e.target.value))} 
                                         />
                                     </div>
                                     <div>
                                         <label className="block text-zinc-400 text-sm mb-1">Free Shipping Threshold (৳)</label>
                                         <input 
                                            type="number"
                                            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" 
                                            value={siteConfig.checkout.freeShippingThreshold} 
                                            onChange={e => updateNestedConfig('checkout', 'freeShippingThreshold', Number(e.target.value))} 
                                         />
                                     </div>
                                      <div>
                                         <label className="block text-zinc-400 text-sm mb-1">bKash Number</label>
                                         <input 
                                            className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" 
                                            value={siteConfig.checkout.bkashNumber} 
                                            onChange={e => updateNestedConfig('checkout', 'bkashNumber', e.target.value)} 
                                         />
                                     </div>
                                 </div>
                            </div>

                             {/* Coupon Management */}
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-lg font-bold text-pink-500 mb-4 border-b border-white/10 pb-2">Coupons</h3>
                                 <div className="space-y-3 mb-6">
                                     {siteConfig.coupons.map((coupon: Coupon, idx: number) => (
                                         <div key={idx} className="flex gap-4 items-center bg-white/5 p-3 rounded-lg">
                                             <div className="flex-1 font-mono text-white font-bold">{coupon.code}</div>
                                             <div className="text-pink-400">{coupon.discountPercent}% OFF</div>
                                             <button 
                                                onClick={() => updateArrayConfig('coupons', idx, 'isActive', !coupon.isActive)} 
                                                className={`text-xs px-2 py-1 rounded ${coupon.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                                             >
                                                {coupon.isActive ? 'Active' : 'Inactive'}
                                             </button>
                                             <button onClick={() => handleDeleteCoupon(idx)} className="text-zinc-500 hover:text-red-500"><TrashIcon className="w-4 h-4" /></button>
                                         </div>
                                     ))}
                                 </div>
                                 <div className="flex gap-2 items-end">
                                     <div className="flex-1">
                                         <label className="text-xs text-zinc-500">Code</label>
                                         <input className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white uppercase" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} />
                                     </div>
                                     <div className="w-24">
                                         <label className="text-xs text-zinc-500">Discount %</label>
                                         <input type="number" className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" value={newCoupon.discount} onChange={e => setNewCoupon({...newCoupon, discount: Number(e.target.value)})} />
                                     </div>
                                     <button onClick={handleAddCoupon} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded font-bold h-[42px]">Add</button>
                                 </div>
                             </div>

                             {/* Database Settings - Changed for Supabase */}
                             <div className={`p-6 rounded-xl ${GLASS_PANEL}`}>
                                 <h3 className="text-lg font-bold text-pink-500 mb-4 border-b border-white/10 pb-2">Database Connection (Supabase)</h3>
                                 <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg mb-4 space-y-2">
                                     <p className="text-blue-200 text-sm font-bold">Quick Setup Guide:</p>
                                     <ol className="list-decimal list-inside text-blue-200 text-xs space-y-1">
                                         <li>Go to your Supabase Project &gt; <strong>SQL Editor</strong>.</li>
                                         <li>Paste and run the following SQL code:</li>
                                     </ol>
                                     <div className="bg-black/50 p-3 rounded border border-blue-500/30 relative group">
                                         <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-mono select-all">
{`CREATE TABLE IF NOT EXISTS app_settings (
  id bigint PRIMARY KEY,
  config jsonb
);
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON app_settings FOR ALL USING (true) WITH CHECK (true);
INSERT INTO app_settings (id, config) VALUES (1, '{}') ON CONFLICT DO NOTHING;`}
                                         </pre>
                                         <button 
                                             onClick={() => {
                                                 navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS app_settings (
  id bigint PRIMARY KEY,
  config jsonb
);
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Access" ON app_settings FOR ALL USING (true) WITH CHECK (true);
INSERT INTO app_settings (id, config) VALUES (1, '{}') ON CONFLICT DO NOTHING;`);
                                                 alert("SQL copied to clipboard!");
                                             }}
                                             className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                         >
                                             Copy SQL
                                         </button>
                                     </div>
                                     <p className="text-blue-200 text-xs mt-2">
                                         This creates the table and allows public access (for demo purposes). Then enter your URL/Key below.
                                     </p>
                                 </div>
                                 <div className="grid grid-cols-1 gap-4">
                                     <div>
                                         <label className="block text-zinc-400 text-sm mb-1">Supabase URL</label>
                                         <input className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" placeholder="https://xyz.supabase.co" value={siteConfig.database?.supabaseUrl || ''} onChange={e => updateNestedConfig('database', 'supabaseUrl', e.target.value)} />
                                     </div>
                                     <div>
                                         <label className="block text-zinc-400 text-sm mb-1">Supabase Anon Key</label>
                                         <input type="password" className="w-full bg-black/40 border border-white/10 rounded px-3 py-2 text-white" placeholder="eyJh..." value={siteConfig.database?.supabaseKey || ''} onChange={e => updateNestedConfig('database', 'supabaseKey', e.target.value)} />
                                     </div>
                                 </div>
                             </div>
                         </div>
                     )}
                 </main>
                 
                 {/* Modals for Product/User add (simplified here) */}
                 {isProductModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm p-4" onClick={() => setIsProductModalOpen(false)}>
                        <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-900 p-8 rounded-xl ${GLASS_PANEL}`} onClick={e => e.stopPropagation()}>
                            <h3 className="text-2xl font-bold text-white mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-zinc-400 text-sm mb-2">Product Name</label>
                                    <input 
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-pink-500 outline-none"
                                        value={prodForm.name || ''} 
                                        onChange={e => setProdForm({...prodForm, name: e.target.value, slug: createSlug(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-400 text-sm mb-2">Slug (URL)</label>
                                    <input 
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-zinc-400 focus:border-pink-500 outline-none"
                                        value={prodForm.slug || ''} 
                                        onChange={e => setProdForm({...prodForm, slug: createSlug(e.target.value)})}
                                        placeholder="auto-generated"
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-400 text-sm mb-2">Price (৳)</label>
                                    <input 
                                        type="number"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-pink-500 outline-none"
                                        value={prodForm.price || ''} 
                                        onChange={e => setProdForm({...prodForm, price: Number(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-400 text-sm mb-2">Category</label>
                                    <select 
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-pink-500 outline-none"
                                        value={prodForm.category || ''} 
                                        onChange={e => setProdForm({...prodForm, category: e.target.value as Category})}
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-zinc-400 text-sm mb-2">Image</label>
                                    <div className="flex gap-2">
                                        <input 
                                            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-pink-500 outline-none"
                                            value={prodForm.image || ''} 
                                            onChange={e => setProdForm({...prodForm, image: e.target.value})}
                                            placeholder="https://... or upload"
                                        />
                                        <label className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center justify-center">
                                            <UploadIcon className="w-5 h-5" />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setProdForm({...prodForm, image: url}))} />
                                        </label>
                                    </div>
                                    {prodForm.image && <img src={prodForm.image} alt="Preview" className="w-full h-32 object-cover mt-2 rounded-lg opacity-80" />}
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                     <label className="block text-zinc-400 text-sm">Description</label>
                                     <button 
                                        onClick={handleGenerateDesc}
                                        disabled={generatingDesc}
                                        className="text-xs text-pink-500 hover:text-pink-400 flex items-center gap-1"
                                     >
                                        <SparklesIcon className="w-3 h-3" />
                                        {generatingDesc ? 'Generating...' : 'Generate with AI'}
                                     </button>
                                </div>
                                <textarea 
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-pink-500 outline-none h-32"
                                    value={prodForm.description || ''} 
                                    onChange={e => setProdForm({...prodForm, description: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-6 mb-8">
                                <label className="flex items-center gap-2 cursor-pointer text-zinc-300 select-none">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-white/10 bg-black/40 text-pink-600 focus:ring-pink-500"
                                        checked={prodForm.isNew || false}
                                        onChange={e => setProdForm({...prodForm, isNew: e.target.checked})}
                                    />
                                    Mark as New
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-zinc-300 select-none">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-white/10 bg-black/40 text-pink-600 focus:ring-pink-500"
                                        checked={prodForm.isFeatured || false}
                                        onChange={e => setProdForm({...prodForm, isFeatured: e.target.checked})}
                                    />
                                    Mark as Featured
                                </label>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button 
                                    onClick={() => setIsProductModalOpen(false)}
                                    className="px-6 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveProduct}
                                    className="px-6 py-2 rounded-lg bg-pink-600 text-white font-bold hover:bg-pink-700 transition-colors shadow-lg shadow-pink-600/20"
                                >
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Blog Modal */}
                {isBlogModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm p-4" onClick={() => setIsBlogModalOpen(false)}>
                        <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-900 p-8 rounded-xl ${GLASS_PANEL}`} onClick={e => e.stopPropagation()}>
                            <h3 className="text-2xl font-bold text-white mb-6">{editingBlogPost ? 'Edit Blog Post' : 'Add New Post'}</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="md:col-span-2">
                                    <label className="block text-zinc-400 text-sm mb-2">Title</label>
                                    <input 
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-pink-500 outline-none"
                                        value={blogForm.title || ''} 
                                        onChange={e => setBlogForm({...blogForm, title: e.target.value, slug: createSlug(e.target.value)})}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-zinc-400 text-sm mb-2">Slug (URL)</label>
                                    <input 
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-zinc-400 focus:border-pink-500 outline-none"
                                        value={blogForm.slug || ''} 
                                        onChange={e => setBlogForm({...blogForm, slug: createSlug(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-400 text-sm mb-2">Author</label>
                                    <input 
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-pink-500 outline-none"
                                        value={blogForm.author || ''} 
                                        onChange={e => setBlogForm({...blogForm, author: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-zinc-400 text-sm mb-2">Date</label>
                                    <input 
                                        type="date"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-pink-500 outline-none"
                                        value={blogForm.date ? new Date(blogForm.date).toISOString().split('T')[0] : ''} 
                                        onChange={e => setBlogForm({...blogForm, date: e.target.value})}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-zinc-400 text-sm mb-2">Image</label>
                                    <div className="flex gap-2">
                                        <input 
                                            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-pink-500 outline-none"
                                            value={blogForm.image || ''} 
                                            onChange={e => setBlogForm({...blogForm, image: e.target.value})}
                                            placeholder="https://... or upload"
                                        />
                                        <label className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center justify-center">
                                            <UploadIcon className="w-5 h-5" />
                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, (url) => setBlogForm({...blogForm, image: url}))} />
                                        </label>
                                    </div>
                                    {blogForm.image && <img src={blogForm.image} alt="Preview" className="w-full h-48 object-cover mt-2 rounded-lg opacity-80" />}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-zinc-400 text-sm mb-2">Excerpt (Short Summary)</label>
                                <textarea 
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-pink-500 outline-none h-24"
                                    value={blogForm.excerpt || ''} 
                                    onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})}
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-zinc-400 text-sm mb-2">Full Content</label>
                                <textarea 
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-pink-500 outline-none h-64 font-mono"
                                    value={blogForm.content || ''} 
                                    onChange={e => setBlogForm({...blogForm, content: e.target.value})}
                                />
                            </div>

                            <div className="flex justify-end gap-4">
                                <button 
                                    onClick={() => setIsBlogModalOpen(false)}
                                    className="px-6 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleSaveBlogPost}
                                    className="px-6 py-2 rounded-lg bg-pink-600 text-white font-bold hover:bg-pink-700 transition-colors shadow-lg shadow-pink-600/20"
                                >
                                    {editingBlogPost ? 'Update Post' : 'Add Post'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Modal */}
                {isUserModalOpen && (
                    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm p-4" onClick={() => setIsUserModalOpen(false)}>
                        <div className={`w-full max-w-md bg-zinc-900 p-8 rounded-xl ${GLASS_PANEL}`} onClick={e => e.stopPropagation()}>
                            <h3 className="text-xl font-bold text-white mb-6">Add New User</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-zinc-400 text-sm mb-1">Full Name</label>
                                    <input className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white" value={newUserForm.name || ''} onChange={e => setNewUserForm({...newUserForm, name: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-zinc-400 text-sm mb-1">Email</label>
                                    <input className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white" value={newUserForm.email || ''} onChange={e => setNewUserForm({...newUserForm, email: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-zinc-400 text-sm mb-1">Password</label>
                                    <input type="password" className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white" value={newUserForm.password || ''} onChange={e => setNewUserForm({...newUserForm, password: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-zinc-400 text-sm mb-1">Role</label>
                                    <select className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white" value={newUserForm.role} onChange={e => setNewUserForm({...newUserForm, role: e.target.value as any})}>
                                        <option value="CUSTOMER">Customer</option>
                                        <option value="SHOP_ADMIN">Shop Manager</option>
                                        <option value="SUPER_ADMIN">Super Admin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-zinc-400 hover:text-white">Cancel</button>
                                <button onClick={handleAddUserSubmit} className="px-6 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold">Create User</button>
                            </div>
                        </div>
                    </div>
                )}
             </div>
        </div>
    );
};

const App = () => {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);
  const [activeView, setActiveView] = useState<ViewState>('HOME');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // User & Auth State
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });
  
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(INITIAL_BLOG_POSTS);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  // Marketing Tagline
  useEffect(() => {
      const fetchTagline = async () => {
          const tagline = await generateMarketingTagline();
          // Optional: Integrate tagline into UI
      };
      fetchTagline();
  }, []);

  // 1. Load Supabase Credentials from LocalStorage on mount
  // 2. If present, fetch config from Supabase
  useEffect(() => {
      const savedUrl = localStorage.getItem('supabaseUrl');
      const savedKey = localStorage.getItem('supabaseKey');

      if (savedUrl && savedKey) {
          // Update state with saved creds so Admin UI shows them
          setSiteConfig(prev => ({
              ...prev,
              database: { supabaseUrl: savedUrl, supabaseKey: savedKey }
          }));
          
          fetchConfigFromSupabase(savedUrl, savedKey);
      }
  }, []);

  const showToast = (msg: string) => {
      setToastMessage(msg);
      setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchConfigFromSupabase = async (url: string, key: string) => {
      try {
          const supabase = createClient(url, key, {
            auth: {
              persistSession: false
            }
          });
          const { data, error } = await supabase
              .from('app_settings')
              .select('config')
              .eq('id', 1)
              .single();

          if (error) {
              console.warn("Supabase fetch error:", error.message);
              if (error.code === 'PGRST116') {
                  showToast("Connected to Supabase. No config found yet (save to create).");
              } else if (error.code === 'PGRST205') {
                  showToast("Table 'app_settings' not found. Please verify setup.");
              } else {
                  showToast("Supabase Error: " + error.message);
              }
              return;
          }

          if (data && data.config) {
              const remoteConfig = data.config;
              // Update local state with remote data
              setSiteConfig(prev => ({...prev, ...remoteConfig}));
              if(remoteConfig.products) setProducts(remoteConfig.products);
              if(remoteConfig.users) setUsers(remoteConfig.users);
              if(remoteConfig.orders) setOrders(remoteConfig.orders);
              // Add blog posts loading logic
              // Note: Ideally blog posts should be in config too, but for now using state if provided or initial
              // Assuming remote config might have extended interface later, but currently keeping it simple.
              // If you want to persist blog posts, they should be added to the payload in saveConfigToBackend
              if((remoteConfig as any).blogPosts) setBlogPosts((remoteConfig as any).blogPosts);
              
              showToast("Configuration loaded from Supabase!");
          }
      } catch (err) {
          console.error("Supabase connection failed", err);
      }
  };

  const saveConfigToBackend = async () => {
      const url = siteConfig.database.supabaseUrl;
      const key = siteConfig.database.supabaseKey;

      if (!url || !key) {
          showToast("Please enter Supabase URL and Key in Settings first.");
          return;
      }

      // Save credentials to LocalStorage for persistence
      localStorage.setItem('supabaseUrl', url);
      localStorage.setItem('supabaseKey', key);

      // Prepare payload
      const payload = {
          ...siteConfig,
          products: products,
          orders: orders,
          users: users,
          blogPosts: blogPosts // Added blog posts to persistence
      };

      try {
          const supabase = createClient(url, key, {
            auth: {
              persistSession: false
            }
          });
          
          // Upsert logic
          const { error } = await supabase
              .from('app_settings')
              .upsert({ id: 1, config: payload });

          if (error) {
              // Enhanced error handling
              if (error.code === 'PGRST205') {
                  throw new Error("Table 'app_settings' missing. See 'Quick Setup Guide' in Settings.");
              }
              if (error.code === '22P02') {
                  throw new Error("ID Type Mismatch. Ensure 'id' column is type int8/bigint.");
              }
              // Supabase error object usually has message, code, details, hint
              throw new Error(error.message || JSON.stringify(error));
          }

          showToast("Successfully saved to Supabase!");
      } catch (error: any) {
          console.error("Save Error:", error);
          const msg = error instanceof Error ? error.message : "Unknown error occurred";
          showToast("Failed: " + msg);
      }
  };

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

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleCheckout = (details: CheckoutDetails, discount: number, finalTotal: number) => {
      const shippingCost = finalTotal >= siteConfig.checkout.freeShippingThreshold ? 0 : siteConfig.checkout.shippingCharge;
      
      const newOrder: Order = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          details,
          items: [...cart],
          total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0),
          shippingCost: shippingCost,
          discountApplied: discount,
          finalTotal: finalTotal, // Already includes shipping from modal logic
          status: 'Pending'
      };
      setOrders([newOrder, ...orders]);
      setCart([]);
      setIsCheckoutOpen(false);
      alert("Order placed successfully!");
      if(currentUser) {
          setActiveView('USER_DASHBOARD');
      } else {
          setActiveView('HOME');
      }
  };

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const user = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
      if(user) {
          setCurrentUser(user);
          setLoginForm({ email: '', password: '' });
          if(user.role.includes('ADMIN')) {
              setActiveView('ADMIN');
          } else {
              setActiveView('HOME');
          }
      } else {
          alert("Invalid credentials");
      }
  };

  const handleRegister = (e: React.FormEvent) => {
      e.preventDefault();
      if(users.find(u => u.email === registerForm.email)) {
          alert("Email already registered");
          return;
      }
      const newUser: User = {
          id: Date.now().toString(),
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
          role: 'CUSTOMER'
      };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setActiveView('HOME');
  };

  const filteredProducts = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
  });

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if(activeView === 'ADMIN' && currentUser?.role.includes('ADMIN')) {
      return (
          <div className="relative">
            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            <AdminDashboard 
                user={currentUser}
                products={products}
                orders={orders}
                categories={categories}
                siteConfig={siteConfig}
                users={users}
                blogPosts={blogPosts}
                onAddProduct={(p: Product) => setProducts([...products, p])}
                onUpdateProduct={(p: Product) => setProducts(products.map(pr => pr.id === p.id ? p : pr))}
                onDeleteProduct={(id: string) => setProducts(products.filter(p => p.id !== id))}
                onAddCategory={(c: string) => setCategories([...categories, c])}
                onDeleteCategory={(c: string) => setCategories(categories.filter(cat => cat !== c))}
                onUpdateSiteConfig={setSiteConfig}
                onUpdateOrder={(o: Order) => setOrders(orders.map(ord => ord.id === o.id ? o : ord))}
                onAddUser={(u: User) => setUsers([...users, u])}
                onDeleteUser={(id: string) => setUsers(users.filter(u => u.id !== id))}
                onAddBlogPost={(p: BlogPost) => setBlogPosts([...blogPosts, p])}
                onUpdateBlogPost={(p: BlogPost) => setBlogPosts(blogPosts.map(bp => bp.id === p.id ? p : bp))}
                onDeleteBlogPost={(id: string) => setBlogPosts(blogPosts.filter(bp => bp.id !== id))}
                onLogout={() => { setCurrentUser(null); setActiveView('LOGIN'); }}
                onSaveConfig={saveConfigToBackend}
            />
          </div>
      );
  }

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-pink-500 selection:text-white pb-16 md:pb-0">
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
      {siteConfig.showTopBar && <CouponMarquee text={siteConfig.topBarText} />}
      
      <Navbar 
          cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
          onCartClick={() => setIsCartOpen(true)}
          onNavClick={(view: ViewState) => { setActiveView(view); setSelectedCategory(null); }}
          activeView={activeView}
          siteConfig={siteConfig}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentUser={currentUser}
          onLogout={() => { setCurrentUser(null); setActiveView('HOME'); }}
      />

      <MobileDrawer 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
          onNavClick={(view: ViewState) => { setActiveView(view); setSelectedCategory(null); }}
          categories={categories}
          onCategoryClick={(cat: string) => { setSelectedCategory(cat); setActiveView('SHOP'); }}
      />

      <CartSidebar 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cart={cart} 
          onRemove={(id: string) => updateQty(id, -1000)}
          onUpdateQty={updateQty}
          total={cartTotal}
          onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
      />

      {/* Main Content Area */}
      <div className="min-h-screen">
          {activeView === 'HOME' && (
              <>
                  <HeroCarousel slides={siteConfig.heroSlides} onShopClick={() => setActiveView('SHOP')} />
                  {siteConfig.usps.length > 0 && <USPMarquee usps={siteConfig.usps} />}
                  <CategoryGrid categories={siteConfig.featuredCategories} onCategoryClick={(cat) => { setSelectedCategory(cat); setActiveView('SHOP'); }} />
                  {siteConfig.showMarquee && <ProductMarquee products={products.filter(p => p.isFeatured)} onProductClick={(p) => { setSelectedProduct(p); setIsProductModalOpen(true); }} />}
                  
                  {/* All Products Section */}
                  <div className="max-w-7xl mx-auto px-4 py-16 border-t border-white/5">
                      <h2 className="text-3xl font-bold text-white mb-8 text-center">All Products</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {products.slice(0, 8).map(p => (
                              <ProductCard 
                                  key={p.id} 
                                  product={p} 
                                  onAddToCart={addToCart} 
                                  onClick={() => { setSelectedProduct(p); setIsProductModalOpen(true); }} 
                              />
                          ))}
                      </div>
                      <div className="mt-12 text-center">
                          <button 
                              onClick={() => setActiveView('SHOP')} 
                              className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-pink-500 hover:text-white transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                          >
                              View All Products
                          </button>
                      </div>
                  </div>

                  <TestimonialSection testimonials={siteConfig.testimonials} />
                  <BlogMarquee posts={blogPosts} onPostClick={(p) => { setSelectedBlogPost(p); setIsBlogModalOpen(true); }} />
                  <PaymentMarquee />
                  <SocialMarquee />
                  <NewsletterSection />
                  <Footer config={siteConfig} onNavClick={(v) => { setActiveView(v); setSelectedCategory(null); }} />
              </>
          )}

          {activeView === 'SHOP' && (
              <div className="max-w-7xl mx-auto px-4 py-8">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                      <h2 className="text-3xl font-bold uppercase tracking-wider">{selectedCategory ? selectedCategory : 'All Products'}</h2>
                      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                          <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${!selectedCategory ? 'bg-pink-600 text-white' : 'bg-white/10 text-zinc-400 hover:text-white'}`}>All</button>
                          {categories.map(c => (
                              <button key={c} onClick={() => setSelectedCategory(c)} className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${selectedCategory === c ? 'bg-pink-600 text-white' : 'bg-white/10 text-zinc-400 hover:text-white'}`}>{c}</button>
                          ))}
                      </div>
                  </div>
                  
                  {filteredProducts.length === 0 ? (
                       <div className="text-center py-20 text-zinc-500">No products found.</div>
                  ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {filteredProducts.map(p => (
                              <ProductCard 
                                  key={p.id} 
                                  product={p} 
                                  onAddToCart={addToCart} 
                                  onClick={() => { setSelectedProduct(p); setIsProductModalOpen(true); }} 
                              />
                          ))}
                      </div>
                  )}
                  <Footer config={siteConfig} onNavClick={(v) => { setActiveView(v); setSelectedCategory(null); }} />
              </div>
          )}

          {activeView === 'LOGIN' && (
              <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-full bg-pink-900/10 -z-10"></div>
                   <div className={`w-full max-w-md p-8 rounded-2xl ${GLASS_PANEL}`}>
                       <h2 className="text-3xl font-bold text-center mb-8">Welcome Back</h2>
                       <form onSubmit={handleLogin} className="space-y-6">
                           <div>
                               <label className="block text-zinc-400 text-sm mb-2">Email Address</label>
                               <input type="email" required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} />
                           </div>
                           <div>
                               <label className="block text-zinc-400 text-sm mb-2">Password</label>
                               <input type="password" required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
                           </div>
                           <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-pink-600/20 transition-transform active:scale-95">Sign In</button>
                       </form>
                       <div className="mt-6 text-center text-sm text-zinc-400">
                           Don't have an account? <button onClick={() => setActiveView('REGISTER')} className="text-pink-500 font-bold hover:underline">Create one</button>
                       </div>
                   </div>
              </div>
          )}

          {activeView === 'REGISTER' && (
              <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-full bg-pink-900/10 -z-10"></div>
                   <div className={`w-full max-w-md p-8 rounded-2xl ${GLASS_PANEL}`}>
                       <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>
                       <form onSubmit={handleRegister} className="space-y-6">
                           <div>
                               <label className="block text-zinc-400 text-sm mb-2">Full Name</label>
                               <input type="text" required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none" value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} />
                           </div>
                           <div>
                               <label className="block text-zinc-400 text-sm mb-2">Email Address</label>
                               <input type="email" required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} />
                           </div>
                           <div>
                               <label className="block text-zinc-400 text-sm mb-2">Password</label>
                               <input type="password" required className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-pink-500 outline-none" value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} />
                           </div>
                           <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-pink-600/20 transition-transform active:scale-95">Create Account</button>
                       </form>
                       <div className="mt-6 text-center text-sm text-zinc-400">
                           Already have an account? <button onClick={() => setActiveView('LOGIN')} className="text-pink-500 font-bold hover:underline">Sign In</button>
                       </div>
                   </div>
              </div>
          )}

          {activeView === 'USER_DASHBOARD' && currentUser && (
              <UserDashboard 
                  user={currentUser} 
                  orders={orders} 
                  onLogout={() => { setCurrentUser(null); setActiveView('HOME'); }} 
              />
          )}

          {/* Modals */}
          <ProductDetailsModal 
              isOpen={isProductModalOpen} 
              onClose={() => { setIsProductModalOpen(false); setSelectedProduct(null); }} 
              product={selectedProduct} 
              onAddToCart={addToCart} 
              config={siteConfig}
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
              isOpen={isBlogModalOpen}
              onClose={() => { setIsBlogModalOpen(false); setSelectedBlogPost(null); }}
              post={selectedBlogPost}
          />

          <MobileStickyFooter 
              activeView={activeView} 
              onNavClick={(view) => { setActiveView(view); setSelectedCategory(null); }} 
              currentUser={currentUser}
          />
      </div>
    </div>
  );
};

export default App;