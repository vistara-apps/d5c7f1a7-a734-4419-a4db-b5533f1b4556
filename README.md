# CollabSphere - Professional Networking Base Mini App

Connect, Create, Collaborate: Achieve Your Goals Together.

## Overview

CollabSphere is a professional networking platform built as a Base Mini App that helps individuals find collaborators based on shared goals, values, and skills to launch joint ventures.

## Features

### 🎯 Goal-Based Matchmaking
- Algorithmic matching based on collaboration goals
- Discover like-minded individuals with shared objectives
- Smart compatibility scoring system

### 👥 Skill and Value Profiles
- Detailed skill and expertise profiles
- Value alignment matching (AI ethics, open-source, sustainability)
- Work style compatibility assessment

### 🚀 Collaborative Project Launchpad
- Customizable project templates
- Role definition and milestone tracking
- Structured project initiation tools

### 📊 Mutual Value Tracking
- Transparent contribution tracking
- Impact measurement and recognition
- Reputation building system

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base Network via OnchainKit
- **Styling**: Tailwind CSS with custom design system
- **TypeScript**: Full type safety
- **Authentication**: Farcaster integration

## Design System

### Color Themes
- **Professional Finance**: Dark navy background with gold accents (#ffd700)
- **Celo**: Black background with yellow accents (#fbcc5c)
- **Solana**: Dark purple with magenta accents
- **Base**: Dark blue with Base blue accents (#0052ff)
- **Coinbase**: Dark navy with Coinbase blue accents

### Components
- ProfileCard (compact/detailed variants)
- ProjectCard with progress tracking
- CollaborationRequestCard (pending/accepted/rejected states)
- ProjectTemplateSelector
- ThemeProvider for dynamic theming

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file:
   ```
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── ProfileCard.tsx
│   ├── ProjectCard.tsx
│   ├── CollaborationRequestCard.tsx
│   ├── ProjectTemplateSelector.tsx
│   └── ThemeProvider.tsx
├── theme-preview/       # Theme preview page
├── globals.css         # Global styles and themes
├── layout.tsx          # Root layout
├── page.tsx           # Main dashboard
├── providers.tsx      # OnchainKit provider setup
├── loading.tsx        # Loading UI
└── error.tsx          # Error boundary

lib/
├── types.ts           # TypeScript interfaces
├── constants.ts       # App constants
└── utils.ts          # Utility functions
```

## Key Features Implementation

### User Matching Algorithm
The `calculateMatchScore` function evaluates compatibility based on:
- Shared goals (30 points each)
- Shared values (20 points each)
- Complementary skills (15 points each)
- Common skills (10 points each)

### Project Templates
Pre-built templates for common collaboration types:
- SaaS Startup
- Content Creation
- Blockchain Project
- Custom templates

### Micro-transaction Model
- Collaboration boosts for enhanced visibility
- Premium project templates
- On-chain value tracking and rewards

## Base Mini App Integration

- **OnchainKit Provider**: Handles wallet connections and Base network integration
- **Farcaster Authentication**: Social login and identity verification
- **Frame Actions**: In-app interactions within Farcaster
- **Micro-transactions**: Low-cost Base network transactions

## Theme System

Dynamic theming system supporting multiple blockchain aesthetics:
- CSS custom properties for consistent theming
- Theme switching with localStorage persistence
- Responsive design with mobile-first approach

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support and questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for the Base ecosystem
