import fs from 'fs';
import path from 'path';

// 1. Manually recreate the blog slugs to avoid complex TS transpilation issues in a simple script
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const rawTitles = {
  "New Tank Setup & Nitrogen Cycle": [
    "Why Your New Fish Died in 3 Days (And How AquaOS Prevents It)",
    "New Tank Syndrome: The Silent Killer Every Beginner Needs to Know About",
    "The Complete Guide to Cycling a Fish Tank Without Killing Your Fish",
    "How Long Does a Fish Tank Take to Cycle? The Honest Answer",
    "Fishless Cycling: The Only Safe Way to Start Your First Tank in 2025",
    "Why PetSmart's \"1 Inch Per Gallon\" Rule Is Dangerously Wrong",
    "11 Beginner Aquarium Mistakes That Kill Fish (And How to Avoid Every One)",
    "What Nobody Tells You Before You Buy Your First Fish Tank",
    "The Nitrogen Cycle Explained in Plain English for Beginners",
    "How to Read Water Test Results Without Googling Every Single Time",
    "Ammonia in Fish Tank: What It Means and Exactly What to Do Right Now",
    "Why Your Fish Tank Water Is Cloudy After Setup (And How Long It Lasts)",
    "The First 60 Days of Fish Keeping: A Day-by-Day Survival Guide",
    "How to Set Up a Fish Tank the Right Way in 2025",
    "Can You Add Fish on Day 1? Everything Beginners Get Wrong About Timing",
    "Why Your Fish Are Dying for No Obvious Reason (Root Causes Explained)",
    "7 Things to Do Before Adding Fish to a New Tank",
    "How AquaOS Guides You Through the Nitrogen Cycle Step by Step",
    "The Beginner Fishkeeper Checklist: Everything You Need Before Day One",
    "How to Test Fish Tank Water (And What Every Reading Actually Means)",
    "pH in Fish Tank: What Is It, Why It Matters, and How to Fix It",
    "Nitrite vs. Nitrate in Aquarium Water: The Difference That Saves Fish Lives",
    "How to Dechlorinate Tap Water for Fish: Step-by-Step Guide",
    "Why Fish Get Stressed in New Tanks (And the 3-Week Adjustment Period)",
    "How to Acclimate Fish to a New Tank Without Losing Them",
    "The Best Starter Fish for Beginners in 2025 (And the Worst Ones to Avoid)",
    "Can Goldfish Really Live in a Bowl? The Truth That Pet Stores Hide",
    "How Many Fish Can I Put in a 10-Gallon Tank? The Real Answer",
    "How Many Fish Can I Put in a 20-Gallon Tank? (With Actual Bioload Math)",
    "How Many Fish Can I Put in a 55-Gallon Tank?",
    "How Many Fish Can I Put in a 75-Gallon Tank?",
    "How Many Fish Can I Put in a 100-Gallon Tank?",
    "The Best Fish Tank Size for Beginners: What the Hobby Never Tells You",
    "How to Choose the Right Aquarium Filter for Your Tank Size",
    "Do You Really Need a Heater for a Freshwater Tank?",
    "Best Beginner Fish That Are Actually Hard to Kill",
    "Why Betta Fish Die in Small Tanks (The 0.5-Gallon Myth Debunked)",
    "How to Keep Fish Alive During a Power Outage"
  ],
  "Fish Compatibility & Stocking": [
    "Can You Keep Angelfish With Neon Tetras? The Honest Truth",
    "Best Community Fish That Actually Get Along in 2025",
    "Worst Fish Combinations That Will End in Disaster (Complete List)",
    "Can Betta Fish Live With Other Fish? A Species-by-Species Breakdown",
    "Oscar Fish Tank Mates: Who Survives and Who Gets Eaten",
    "African Cichlid Tank Mates: The Only Compatible Species Guide You Need",
    "Can You Keep Goldfish With Tropical Fish? pH Reality Check",
    "Cichlid Compatibility Chart: Every Species Combination Explained"
  ],
  "Water Chemistry & Parameters": [
    "The Complete Aquarium Water Parameter Guide for 2025",
    "What Water Parameters Do Tropical Fish Need? Full Chart",
    "Ideal Water Parameters for Discus Fish: Why They're So Demanding",
    "Ideal Water Parameters for African Cichlids",
    "Ideal Water Parameters for Goldfish",
    "Ideal Water Parameters for Betta Fish"
  ],
  "Specific Fish Species Guides": [
    "Betta Fish Complete Care Guide 2025: Everything the Pet Store Didn't Tell You",
    "Discus Fish Care Guide: Why They're Called the King of Freshwater",
    "Oscar Fish Care: The Reality of Owning a Fish With Personality"
  ]
};

const BASE_URL = 'https://aquaos.entrext.com';

const staticRoutes = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/dashboard', changefreq: 'daily', priority: 0.9 },
  { url: '/blog', changefreq: 'daily', priority: 0.9 },
  { url: '/signup', changefreq: 'monthly', priority: 0.8 },
  { url: '/login', changefreq: 'monthly', priority: 0.8 },
  { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
  { url: '/terms', changefreq: 'yearly', priority: 0.3 },
  { url: '/cookies', changefreq: 'yearly', priority: 0.3 }
];

const sitemapHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

const sitemapFooter = `\n</urlset>`;

let xmlContent = sitemapHeader;
const today = new Date().toISOString().split('T')[0];

// Add static routes
staticRoutes.forEach(route => {
  xmlContent += `
  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
});

// Add dynamic blog routes
Object.values(rawTitles).flat().forEach((title) => {
  const slug = generateSlug(title);
  xmlContent += `
  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
});

xmlContent += sitemapFooter;
const outPath = './public/sitemap.xml';

fs.writeFileSync(outPath, xmlContent);
console.log('✅ Successfully generated sitemap ' + outPath);
