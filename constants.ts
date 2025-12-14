import { Product, SiteConfig, BlogPost, User } from './types';

export const INITIAL_CATEGORIES: string[] = ['Bag', 'Keychain', 'Accessories', 'Wallets', 'Scarves', 'Jewelry'];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Midnight Rose Tote',
    slug: 'midnight-rose-tote',
    price: 15500,
    category: 'Bag',
    description: 'A luxurious dark leather tote with rose gold accents. Perfect for the modern professional woman who needs elegance and utility.',
    image: 'https://picsum.photos/id/103/600/600',
    isNew: true,
    isFeatured: true
  },
  {
    id: '2',
    name: 'Blush Velvet Clutch',
    slug: 'blush-velvet-clutch',
    price: 10500,
    category: 'Bag',
    description: 'Soft touch velvet clutch in a dusty pink hue. Ideal for evening galas and romantic dinner dates.',
    image: 'https://picsum.photos/id/21/600/600',
    isFeatured: true
  },
  {
    id: '3',
    name: 'Crystal Heart Charm',
    slug: 'crystal-heart-charm',
    price: 2800,
    category: 'Keychain',
    description: 'Sparkling crystal heart keychain that adds a touch of glamour to any bag or set of keys.',
    image: 'https://picsum.photos/id/30/600/600',
    isFeatured: false
  },
  {
    id: '4',
    name: 'Obsidian Satchel',
    slug: 'obsidian-satchel',
    price: 18500,
    category: 'Bag',
    description: 'Structured black satchel with high-durability hardware. A timeless classic for the organized soul.',
    image: 'https://picsum.photos/id/36/600/600',
    isFeatured: true
  },
  {
    id: '5',
    name: 'Pom-Pom Fluff',
    slug: 'pom-pom-fluff',
    price: 1500,
    category: 'Keychain',
    description: 'Fun and flirty faux-fur pom-pom keychain in vibrant magenta. Hard to lose your keys with this around!',
    image: 'https://picsum.photos/id/64/600/600',
    isFeatured: false
  },
  {
    id: '6',
    name: 'Urban Crossbody',
    slug: 'urban-crossbody',
    price: 8500,
    category: 'Bag',
    description: 'Compact crossbody bag designed for city life. Lightweight, secure, and stylishly minimal.',
    image: 'https://picsum.photos/id/91/600/600',
    isNew: true,
    isFeatured: true
  }
];

export const INITIAL_USERS: User[] = [
    {
        id: '1',
        name: 'Super Admin',
        email: 'admin@velvetvogue.com',
        role: 'SUPER_ADMIN',
        password: 'admin'
    },
    {
        id: '2',
        name: 'Shop Manager',
        email: 'shop@velvetvogue.com',
        role: 'SHOP_ADMIN',
        password: 'shop'
    }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
    {
        id: '1',
        title: "The Art of Layering Accessories",
        slug: "art-of-layering-accessories",
        excerpt: "Discover how to mix and match bags and keychains for a unique look that stands out.",
        content: "Layering isn't just for clothes. In the world of accessories, combining textures and sizes can create a visually stunning effect. Start with a structured bag as your base and add a playful, soft keychain to break the rigidity. Don't be afraid to mix metals; gold hardware on a bag looks surprisingly chic with a silver charm.",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2000&auto=format&fit=crop",
        date: "Oct 12, 2024",
        author: "Sarah V."
    },
    {
        id: '2',
        title: "Leather Care 101: Keep It Timeless",
        slug: "leather-care-101",
        excerpt: "Essential tips to ensure your premium leather bags last a lifetime.",
        content: "Your leather bag is an investment. To keep it looking pristine, always store it in a dust bag when not in use. Avoid prolonged exposure to direct sunlight which can fade the color. If it gets wet, blot it gently with a soft cloth—never rub. Conditioning your bag every few months will keep the leather supple and prevent cracking.",
        image: "https://images.unsplash.com/photo-1445633765532-42965f2dac8a?q=80&w=2000&auto=format&fit=crop",
        date: "Oct 05, 2024",
        author: "Velvet Team"
    },
    {
        id: '3',
        title: "Trending: Micro Bags & Macro Charms",
        slug: "micro-bags-macro-charms",
        excerpt: "Why the tiny bag trend is here to stay and how to accessorize it.",
        content: "The micro bag trend continues to dominate runways. While they might not hold much more than a lipstick and a credit card, their style impact is massive. The key to styling them? Oversized keychains. A 'macro' charm on a micro bag plays with proportions in a fun, fashion-forward way.",
        image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=2000&auto=format&fit=crop",
        date: "Sep 28, 2024",
        author: "Fashion Ed."
    }
];

export const ADMIN_PASSWORD = "admin"; 

export const INITIAL_SITE_CONFIG: SiteConfig = {
    headerTitle: "Velvet & Vogue",
    logo: "", 
    footerText: "Defining modern elegance, one accessory at a time.",
    showMarquee: true, 
    showTopBar: true, 
    topBarText: "FREE SHIPPING ON ORDERS OVER ৳5000 • NEW COLLECTION AVAILABLE • USE CODE: VELVET10",
    copyrightText: "© 2024 Velvet & Vogue. All rights reserved.",
    smtp: {
        host: "smtp.gmail.com",
        port: "587",
        user: "admin@velvetvogue.com",
        pass: "",
        fromEmail: "orders@velvetvogue.com"
    },
    database: {
        supabaseUrl: "",
        supabaseKey: ""
    },
    checkout: {
        enableBkash: true,
        bkashNumber: "017XXXXXXXX",
        bkashInstructions: "Please Send Money to the number above and enter the transaction ID below.",
        shippingCharge: 120,
        freeShippingThreshold: 5000
    },
    heroSlides: [
        {
            image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=2557&auto=format&fit=crop",
            title: "Timeless Elegance",
            subtitle: "Discover our premium leather collection designed for the modern muse.",
            cta: "Shop Bags"
        },
        {
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=2535&auto=format&fit=crop",
            title: "Chic Accessories",
            subtitle: "The perfect finish to every outfit. Sparkle with our artisan keychains.",
            cta: "Shop Keychains"
        },
        {
            image: "https://images.unsplash.com/photo-1559563458-527698bf5295?q=80&w=2670&auto=format&fit=crop",
            title: "New Arrivals",
            subtitle: "Fresh styles, bold colors, and the same velvet touch you love.",
            cta: "View Collection"
        }
    ],
    testimonials: [
        {
            id: '1',
            name: "Sophia Martinez",
            role: "Fashion Blogger",
            comment: "The quality of the leather is absolutely stunning. I've never received so many compliments on a bag before!",
            rating: 5
        },
        {
            id: '2',
            name: "Emily Chen",
            role: "Verified Buyer",
            comment: "Fast shipping and the packaging was so luxurious. It felt like opening a gift to myself.",
            rating: 5
        },
        {
            id: '3',
            name: "Isabella Rossi",
            role: "Stylist",
            comment: "Velvet & Vogue is my go-to for unique accessories. The keychains are little pieces of art.",
            rating: 4
        }
    ],
    contactInfo: {
        email: "support@velvetvogue.com",
        phone: "+1 (555) 123-4567",
        facebook: "facebook.com/velvetvogue",
        instagram: "instagram.com/velvetvogue",
        twitter: "twitter.com/velvetvogue"
    },
    featuredCategories: [
        {
            name: "Bags",
            image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=1000&auto=format&fit=crop",
            filterValue: "Bag"
        },
        {
            name: "Keychains",
            image: "https://images.unsplash.com/photo-1622616233483-20790b407425?q=80&w=1000&auto=format&fit=crop",
            filterValue: "Keychain"
        },
        {
            name: "Purses",
            image: "https://images.unsplash.com/photo-1566150905458-1bf1ae110671?q=80&w=1000&auto=format&fit=crop",
            filterValue: "Wallets"
        },
        {
            name: "Accessories",
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop",
            filterValue: "Accessories"
        }
    ],
    usps: [
        { text: "Fast Delivery", icon: "TRUCK" },
        { text: "Premium Quality", icon: "CROWN" },
        { text: "Trusted Brand", icon: "SHIELD" },
        { text: "Easy Returns", icon: "REFRESH" }
    ],
    coupons: [
        { code: "VELVET10", discountPercent: 10, isActive: true },
        { code: "WELCOME20", discountPercent: 20, isActive: false }
    ],
    productHighlights: {
        showShipping: true,
        shippingText: "Free shipping on orders over ৳5000",
        showWarranty: true,
        warrantyText: "1 year warranty included"
    }
};