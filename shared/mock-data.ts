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
    screenshotUrl: 'https://images.unsplash.com/photo-1551288049-bbda38a10ad5?auto=format&fit=crop&q=80&w=1000',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=analyzer'
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
    screenshotUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=forge'
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
    screenshotUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?auto=format&fit=crop&q=80&w=1000',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=pixel'
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
    screenshotUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=chain'
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
    screenshotUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=dash'
  }
];