import type { User, Chat, ChatMessage, Project } from './types';
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'User A', role: 'user' },
  { id: 'u2', name: 'User B', role: 'user' }
];
export const MOCK_CHATS: Chat[] = [
  { id: 'c1', title: 'General' },
];
export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'm1', chatId: 'c1', userId: 'u1', text: 'Hello', ts: Date.now() },
];
// High-quality external assets for a professional look and smaller database footprint
const EXTERNAL_ASSETS = {
  logos: {
    analyzer: 'https://placehold.co/400x400/6366f1/ffffff?text=AI',
    forge: 'https://placehold.co/400x400/0891b2/ffffff?text=CF',
    pixel: 'https://placehold.co/400x400/ec4899/ffffff?text=PC',
    chain: 'https://placehold.co/400x400/10b981/ffffff?text=CL',
    dash: 'https://placehold.co/400x400/f59e0b/ffffff?text=DB'
  },
  screenshots: {
    dashboard: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?q=80&w=1200&auto=format&fit=crop',
    editor: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop',
    analytics: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    web3: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop',
    design: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=1200&auto=format&fit=crop'
  }
};
export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'AI Analyzer',
    tagline: 'Deep insights for your SaaS metrics using neural networks.',
    description: 'AI Analyzer provides enterprise-grade machine learning insights for modern SaaS platforms. Automatically detect churn patterns, predict growth trends, and optimize your pricing strategy with data-driven confidence.',
    url: 'https://analyzer.ai',
    tags: ['SaaS', 'AI', 'Analytics'],
    ownerId: 'u1',
    createdAt: 1715000000000,
    screenshotUrl: EXTERNAL_ASSETS.screenshots.analytics,
    logoUrl: EXTERNAL_ASSETS.logos.analyzer,
    votes: 128
  },
  {
    id: 'p2',
    title: 'CodeForge',
    tagline: 'The ultimate productivity suite for modern developers.',
    description: 'CodeForge is an all-in-one developer workspace designed to eliminate context switching. It integrates your terminal, debugger, and project management tools into a single, high-performance interface.',
    url: 'https://codeforge.dev',
    tags: ['DevTools', 'Productivity', 'OSS'],
    ownerId: 'u1',
    createdAt: 1715100000000,
    screenshotUrl: EXTERNAL_ASSETS.screenshots.editor,
    logoUrl: EXTERNAL_ASSETS.logos.forge,
    votes: 85
  },
  {
    id: 'p3',
    title: 'PixelCraft',
    tagline: 'Revolutionary UI design tools for creative teams.',
    description: 'PixelCraft bridges the gap between design and production. Our specialized toolset allows designers to create complex, responsive layouts that export directly to production-ready React code.',
    url: 'https://pixelcraft.io',
    tags: ['Design', 'UI/UX', 'No-Code'],
    ownerId: 'u1',
    createdAt: 1715200000000,
    screenshotUrl: EXTERNAL_ASSETS.screenshots.design,
    logoUrl: EXTERNAL_ASSETS.logos.pixel,
    votes: 212
  },
  {
    id: 'p4',
    title: 'ChainLink',
    tagline: 'Decentralized connectivity for the next-gen web.',
    description: 'ChainLink provides secure, reliable blockchain connectivity for enterprise applications. Connect your smart contracts to real-world data and APIs with our robust decentralized oracle network.',
    url: 'https://chainlink.network',
    tags: ['Web3', 'Blockchain', 'Infrastructure'],
    ownerId: 'u1',
    createdAt: 1715300000000,
    screenshotUrl: EXTERNAL_ASSETS.screenshots.web3,
    logoUrl: EXTERNAL_ASSETS.logos.chain,
    votes: 45
  },
  {
    id: 'p5',
    title: 'DashBoardr',
    tagline: 'Real-time data visualization for complex datasets.',
    description: 'DashBoardr turns your messy raw data into beautiful, actionable stories. With support for over 100 data sources, it is the last dashboarding tool your company will ever need to buy.',
    url: 'https://dashboardr.tech',
    tags: ['Analytics', 'Data', 'SaaS'],
    ownerId: 'u1',
    createdAt: 1715400000000,
    screenshotUrl: EXTERNAL_ASSETS.screenshots.dashboard,
    logoUrl: EXTERNAL_ASSETS.logos.dash,
    votes: 310
  }
];