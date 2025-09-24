'use client';

import { useTheme } from '../components/ThemeProvider';
import { Header } from '../components/Header';
import { ProfileCard } from '../components/ProfileCard';
import { ProjectCard } from '../components/ProjectCard';
import { User, Project } from '@/lib/types';

const sampleUser: User = {
  userId: 'sample-user',
  displayName: 'Jordan Smith',
  bio: 'Full-stack developer passionate about Web3 and AI',
  skills: ['React', 'Node.js', 'Solidity', 'Python'],
  values: ['Open Source', 'Innovation', 'Decentralization'],
  goals: ['Build DeFi Protocol', 'Create AI Tools'],
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const sampleProject: Project = {
  projectId: 'sample-project',
  projectName: 'DeFi Yield Optimizer',
  description: 'Automated yield farming protocol for maximum returns',
  goals: ['Launch DeFi Protocol', 'Build Analytics Tools'],
  milestones: [
    { id: '1', title: 'Smart Contract Development', description: '', completed: true },
    { id: '2', title: 'Frontend Development', description: '', completed: false },
    { id: '3', title: 'Security Audit', description: '', completed: false },
  ],
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date(),
  creatorUserId: 'sample-user',
};

export default function ThemePreview() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'default', name: 'Professional Finance', description: 'Dark navy with gold accents' },
    { id: 'celo', name: 'Celo', description: 'Black with yellow accents' },
    { id: 'solana', name: 'Solana', description: 'Dark purple with magenta accents' },
    { id: 'base', name: 'Base', description: 'Dark blue with Base blue accents' },
    { id: 'coinbase', name: 'Coinbase', description: 'Dark navy with Coinbase blue accents' },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">Theme Preview</h1>
          <p className="text-xl text-muted mb-8">
            Explore different visual themes for CollabSphere
          </p>
        </div>

        {/* Theme Selector */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-fg mb-6 text-center">Choose Your Theme</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => setTheme(themeOption.id as any)}
                className={`profile-card text-left transition-all duration-200 ${
                  theme === themeOption.id 
                    ? 'border-accent/50 bg-accent/5' 
                    : 'hover:border-accent/30'
                }`}
              >
                <h3 className="font-semibold text-fg mb-2">{themeOption.name}</h3>
                <p className="text-sm text-muted">{themeOption.description}</p>
                {theme === themeOption.id && (
                  <div className="mt-3 text-accent text-sm font-medium">
                    ✓ Active Theme
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Component Previews */}
        <div className="space-y-12">
          {/* Color Palette */}
          <section>
            <h2 className="text-2xl font-semibold text-fg mb-6">Color Palette</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="h-16 w-full bg-bg rounded-lg mb-2 border border-border"></div>
                <span className="text-sm text-muted">Background</span>
              </div>
              <div className="text-center">
                <div className="h-16 w-full bg-surface rounded-lg mb-2 border border-border"></div>
                <span className="text-sm text-muted">Surface</span>
              </div>
              <div className="text-center">
                <div className="h-16 w-full bg-accent rounded-lg mb-2"></div>
                <span className="text-sm text-muted">Accent</span>
              </div>
              <div className="text-center">
                <div className="h-16 w-full bg-primary rounded-lg mb-2"></div>
                <span className="text-sm text-muted">Primary</span>
              </div>
              <div className="text-center">
                <div className="h-16 w-full bg-fg rounded-lg mb-2"></div>
                <span className="text-sm text-muted">Foreground</span>
              </div>
              <div className="text-center">
                <div className="h-16 w-full bg-muted rounded-lg mb-2"></div>
                <span className="text-sm text-muted">Muted</span>
              </div>
            </div>
          </section>

          {/* Typography */}
          <section>
            <h2 className="text-2xl font-semibold text-fg mb-6">Typography</h2>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gradient">Display Text</h1>
              <h2 className="text-2xl font-semibold text-fg">Headline Text</h2>
              <p className="text-base text-fg">Body text with normal weight and color</p>
              <p className="text-sm text-muted">Caption text with muted color</p>
            </div>
          </section>

          {/* Buttons */}
          <section>
            <h2 className="text-2xl font-semibold text-fg mb-6">Buttons</h2>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary">Primary Button</button>
              <button className="btn-secondary">Secondary Button</button>
              <button className="goal-tag">Goal Tag</button>
              <button className="skill-tag">Skill Tag</button>
              <button className="value-tag">Value Tag</button>
            </div>
          </section>

          {/* Cards */}
          <section>
            <h2 className="text-2xl font-semibold text-fg mb-6">Component Previews</h2>
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold text-fg mb-4">Profile Card</h3>
                <ProfileCard user={sampleUser} variant="detailed" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-fg mb-4">Project Card</h3>
                <ProjectCard project={sampleProject} />
              </div>
            </div>
          </section>

          {/* Glass Cards */}
          <section>
            <h2 className="text-2xl font-semibold text-fg mb-6">Glass Effects</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6">
                <h3 className="font-semibold text-fg mb-2">Glass Card</h3>
                <p className="text-muted">Semi-transparent background with backdrop blur</p>
              </div>
              <div className="metric-card">
                <h3 className="font-semibold text-fg mb-2">Metric Card</h3>
                <p className="text-muted">Enhanced glass card with hover effects</p>
              </div>
              <div className="profile-card">
                <h3 className="font-semibold text-fg mb-2">Profile Card</h3>
                <p className="text-muted">Specialized card for user profiles</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
