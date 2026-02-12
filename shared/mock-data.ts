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
// Inline SVG assets for a self-contained experience
const SVG_LOGOS = {
  analyzer: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIxMiIgZmlsbD0iIzYzNjZGMSIvPjxwYXRoIGQ9Ik0xMCAyNEwyMCAxNEwzMCAyNFYyN0wyMCAxN0wxMCAyN1YyNFoiIGZpbGw9IndoaXRlIi8+PC9zdmc+',
  forge: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIxMiIgZmlsbD0iIzA4OTFCUiIvPjxwYXRoIGQ9Ik0x十三IDE1TDI3IDE1TDE十三IDIwSDI3TDE十三IDI1SDIwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==',
  pixel: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIxMiIgZmlsbD0iI0VDNDg5OSIvPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjgiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMyIvPjwvc3ZnPg==',
  chain: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIxMiIgZmlsbD0iIzEwQjk4MSIvPjxwYXRoIGQ9Ik0xNSAxNUwyNSAyNU0yNSAxNUwxNSAyNSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=',
  dash: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHJ4PSIxMiIgZmlsbD0iI0Y1OTBFOCIvPjxyZWN0IHg9IjEyIiB5PSIxOCIgd2lkdGg9IjQiIGhlaWdodD0iMTAiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iMTgiIHk9IjEzIiB3aWR0aD0iNCIgaGVpZ2h0PSIxNSIgZmlsbD0id2hpdGUiLz48cmVjdCB4PSIyNCIgeT0iMjIiIHdpZHRoPSI0IiBoZWlnaHQ9IjYiIGZpbGw9IndoaXRlIi8+PC9zdmc+'
};
const SVG_SCREENS = {
  dashboard: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiNGOEZBRkMiLz48cmVjdCB4PSI1MCIgeT0iNTAiIHdpZHRoPSI3MDAiIGhlaWdodD0iMzUwIiByeD0iOCIgZmlsbD0id2hpdGUiIHN0cm9rZT0iI0UxRTdFUiIgc3Ryb2tlLXdpZHRoPSIyIi8+PHJlY3QgeD0iNzAiIHk9IjcwIiB3aWR0aD0iMTUwIiBoZWlnaHQ9IjMxMCIgcng9IjQiIGZpbGw9IiNGMUY1RjkiLz48cmVjdCB4PSIyNDAiIHk9IjcwIiB3aWR0aD0iNDkwIiBoZWlnaHQ9IjQwIiByeD0iNCIgZmlsbD0iI0YxRjVGOSIvPjxyZWN0IHg9Ij2NDAiIHk9IjEzMCIgd2lkdGg9IjE0MCIgaGVpZ2h0PSIxMDAiIHJ4PSI0IiBmaWxsPSIjNjM2NkYxIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjxyZWN0IHg9IjQxNSIgeT0iMTMwIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjEwMCIgcng9IjQiIGZpbGw9IiM2MzY2RjEiIGZpbGwtb3BhY2l0eT0iMC41Ii8+PHJlY3QgeD0iNTkwIiB5PSIxMzAiIHdpZHRoPSIxNDAiIGhlaWdodD0iMTAwIiByeD0iNCIgZmlsbD0iIzYzNjZGMSIgZmlsbC1vcGFjaXR5PSIwLjEiLz48cmVjdCB4PSIyNDAiIHk9IjI1MCIgd2lkdGg9IjQ5MCIgaGVpZ2h0PSIxMzAiIHJ4PSI0IiBmaWxsPSIjRjFGNUY5Ii8+PC9zdmc+',
  editor: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQ1MCIgdmlld0JveD0iMCAwIDgwMCA0NTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiMwRjE3MkEiLz48cmVjdCB4PSI1MCIgeT0iNTAiIHdpZHRoPSI3MDAiIGhlaWdodD0iMzUwIiByeD0iOCIgZmlsbD0iIzFFMjlワクIgc3Ryb2tlPSIjMzM0MTU1Ii8+PHJlY3QgeD0iODAiIHk9IjgwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwIiByeD0iMTAiIGZpbGw9IiMzMzQxNTUiLz48cmVjdCB4PSI4MCIgeT0iMTE1IiB3aWR0aD0iMzUwIiBoZWlnaHQ9IjIwIiByeD0iMTAiIGZpbGw9IiM2MzY2RjEiIGZpbGwtb3BhY2l0eT0iMC40Ii8+PHJlY3QgeD0iODAiIHk9IjE1MCIgd2lkdGg9IjI1MCIgaGVpZ2h0PSIyMCIgcng9IjEwIiBmaWxsPSIjMzM0MTU1Ii8+PHJlY3QgeD0iODAiIHk9IjE4NSIgd2lkdGg9IjQwMCIgaGVpZ2h0PSIyMCIgcng9IjEwIiBmaWxsPSIjMzM0MTU1Ii8+PC9zdmc+'
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
    screenshotUrl: SVG_SCREENS.dashboard,
    logoUrl: SVG_LOGOS.analyzer,
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
    screenshotUrl: SVG_SCREENS.editor,
    logoUrl: SVG_LOGOS.forge,
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
    screenshotUrl: SVG_SCREENS.dashboard,
    logoUrl: SVG_LOGOS.pixel,
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
    screenshotUrl: SVG_SCREENS.editor,
    logoUrl: SVG_LOGOS.chain,
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
    screenshotUrl: SVG_SCREENS.dashboard,
    logoUrl: SVG_LOGOS.dash,
    votes: 310
  }
];