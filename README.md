# Conquest 🌌

A **Warhammer 40K** planetary battle tracker and faction control visualization system. Track battles across the grim darkness of the 41st millennium and watch as factions vie for control over entire star systems.

## ✨ Features

### 🚀 Interactive Solar System

- **3D-style planet visualization** with unique designs for each world type
- **Real-time faction control rings** showing territorial dominance
- **Responsive design** optimized for both desktop and mobile
- **Performance-optimized rendering** with intersection observers and lazy loading

### ⚔️ Battle Management

- **Comprehensive battle reporting** with attacker/defender tracking
- **Automatic faction control updates** based on battle outcomes
- **Battle history visualization** with detailed statistics
- **Points tracking and validation** for competitive play

### 👤 User System

- **Secure authentication** via Supabase Auth
- **Player profiles** with faction allegiance and battle statistics
- **Win/loss/draw tracking** with comprehensive leaderboards
- **Profile customization** with faction selection

### 📊 Data Visualization

- **Interactive pie charts** showing faction control percentages
- **Battle timeline** with filterable history
- **Faction-coded visual elements** for quick identification
- **Real-time updates** as battles are reported

## 🛠️ Tech Stack

### Frontend

- **[SvelteKit 2.x](https://kit.svelte.dev/)** with **[Svelte 5](https://svelte.dev/)** (latest features)
- **[TypeScript](https://www.typescriptlang.org/)** with strict mode for type safety
- **[Tailwind CSS 4.x](https://tailwindcss.com/)** for styling and responsive design
- **[Layerchart](https://layerchart.com/)** for data visualization
- **[bits-ui](https://bits-ui.com/)** & **[vaul-svelte](https://vaul.emilkowal.ski/)** for UI components

### Backend & Database

- **[Supabase](https://supabase.com/)** for authentication, database, and real-time features
- **PostgreSQL** with Row Level Security (RLS) policies
- **Real-time subscriptions** for live battle updates

### Performance & Optimization

- **Dynamic imports** for code splitting and faster initial loads
- **Intersection Observer API** for efficient rendering
- **Lazy loading** for components and heavy libraries
- **Bundle analysis** and optimization

### Development & Deployment

- **[Vercel](https://vercel.com/)** deployment with `@sveltejs/adapter-vercel`
- **ESLint** + **Prettier** for code formatting and quality
- **Zod** for runtime validation and type safety

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **npm**, **pnpm**, or **yarn**
- **Supabase account** for backend services

### 1. Clone and Install

```bash
git clone https://github.com/your-username/conquest.git
cd conquest
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
PUBLIC_EMAIL_REDIRECT_URL=http://localhost:5173/auth/confirm
```

### 3. Database Setup

The project requires the following Supabase tables:

- `planets` - Planetary information and characteristics
- `battles` - Battle records and results
- `profiles` - User profiles and statistics
- `control` - Faction control percentages per planet
- `factions` - Available factions and their allegiances

_See `CLAUDE.md` for detailed schema information._

### 4. Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📋 Available Scripts

| Command                 | Description                |
| ----------------------- | -------------------------- |
| `npm run dev`           | Start development server   |
| `npm run build`         | Create production build    |
| `npm run build:analyze` | Build with bundle analysis |
| `npm run preview`       | Preview production build   |
| `npm run check`         | Run TypeScript checks      |
| `npm run lint`          | Run ESLint                 |
| `npm run format`        | Format code with Prettier  |

## 🏗️ Project Structure

```
src/
├── lib/
│   ├── components/           # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   └── planet/          # Planet visualization components
│   ├── hooks/               # Custom Svelte utilities
│   ├── types.ts             # TypeScript type definitions
│   ├── validation.ts        # Zod schemas for validation
│   └── supabaseClient.ts    # Database client configuration
├── routes/
│   ├── auth/                # Authentication pages
│   ├── private/             # Protected user pages
│   │   ├── upload/          # Battle reporting
│   │   └── user/            # Profile management
│   └── +page.svelte         # Main solar system view
└── app.html                 # HTML template
```

## 🎮 Usage Guide

### Reporting Battles

1. **Navigate** to the "Report Battle" button (requires authentication)
2. **Select** the planet where the battle occurred
3. **Choose** attacker and defender from registered players
4. **Enter** battle details (points, type, result)
5. **Submit** to automatically update faction control

### Viewing Planet Details

1. **Click** any planet in the solar system view
2. **Explore** faction control percentages and battle history
3. **Filter** battles by date, faction, or result type

### Managing Your Profile

1. **Access** your profile via the user menu
2. **Update** your faction allegiance and username
3. **View** your battle statistics and win/loss record

## 🚢 Deployment

### Vercel (Recommended)

The project is configured for seamless Vercel deployment:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Environment Variables

Ensure these are set in your deployment environment:

- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `PUBLIC_EMAIL_REDIRECT_URL`

## 🔧 Development

### Performance Monitoring

Use the bundle analyzer to monitor performance:

```bash
npm run build:analyze
```

This generates `bundle-analysis.html` for detailed bundle inspection.

### Type Safety

The project uses strict TypeScript. Run type checking:

```bash
npm run check
```

### Code Quality

Maintain code quality with linting and formatting:

```bash
npm run lint     # Check code style
npm run format   # Auto-format code
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Follow project configuration
- **Prettier**: Auto-formatting required
- **Tests**: Add tests for new features (when test suite is added)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Games Workshop** for the Warhammer 40K universe
- **Svelte Team** for the amazing framework
- **Supabase** for the excellent backend-as-a-service
- **Tailwind CSS** for making styling enjoyable

---

_For the Emperor! In the grim darkness of the far future, there is only war... and comprehensive battle tracking._
