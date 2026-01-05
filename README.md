# Portfolio Website

A highly interactive and visually engaging portfolio website built with modern web technologies. This project showcases creative development skills through dynamic animations, theming capabilities, and gamified elements.

## 🚀 Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: CSS Modules with CSS Variables for theming
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Typing Effect**: [React Typed](https://www.npmjs.com/package/react-typed)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)

## 📂 Project Structure

```bash
src/
├── app/
│   ├── layout.tsx      # Root layout (Fonts, ThemeProvider, Cursor, Analytics)
│   ├── page.tsx        # Main entry point (Hero, GameSection)
│   └── globals.css     # Global styles and CSS variables
├── components/
│   ├── Hero.tsx        # Interactive hero section (Typing text, Gift box)
│   ├── GameSection.tsx # Gamified experience (Mario-style platformer)
│   ├── ThemeContext.tsx# React Context for managing application theme
│   ├── ThemeEditor.tsx # UI for customizing theme colors
│   └── Cursor.tsx      # Custom animated cursor
└── ...
```

## ✨ Key Features

### 1. Interactive Hero Section (`Hero.tsx`)
- **Dynamic Typing**: Rotating keywords ("IMAGINE", "CREATE", "INSPIRE", etc.) using `react-typed`.
- **Gift Box Surprise**: A 3D interactive gift box that users can open.
- **Confetti Animation**: Celebration effect triggers upon opening the gift.
- **Resume Unlock**: Users can choose to "unlock" the resume directly or via a "hard way" (Game).

### 2. Gamification (`GameSection.tsx`)
- **Canvas-based Platformer**: A fully functional Mario-style platformer game built with HTML5 Canvas.
- **Mechanics**: Jumping, running, enemy collision (Goombas), breakable bricks, and item interactions (Mushrooms).
- **Secret Resume**: Players can unlock the resume by collecting 2 hidden mushrooms or by completing the level.
- **Controls**: Keyboard (Arrows/WASD/Space) and Touch controls for mobile.

### 3. Dynamic Theming (`ThemeContext.tsx` & `ThemeEditor.tsx`)
- **Global State**: Manages colors (Primary, Secondary, Accent, Background, Text) via React Context.
- **Persistence**: Saves user preferences to `localStorage`.
- **Live Editor**: `ThemeEditor` component allows real-time color customization via a sidebar interface.

### 4. Custom Cursor (`Cursor.tsx`)
- A custom-styled cursor that reacts to user interaction, enhancing the immersive feel.

### 5. Analytics
- Integrated `@vercel/analytics/next` for tracking user engagement and page views.

## 🛠️ Usage & Workflow

### Development
To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Theme Workflow
1. The `ThemeProvider` wraps the entire application in `layout.tsx`.
2. It initializes CSS variables `--primary-color`, etc., and syncs them with `localStorage`.
3. `ThemeEditor` consumes the context to provide color pickers.
4. Any change updates the Context state -> Updates CSS Variables -> Immediate visual feedback.

### Resume Access Workflow
1. User lands on Hero section.
2. Clicks the "Gift Box".
3. Modal appears asking to choose a path:
   - **Easy Way**: Immediately opens the Resume PDF in a modal.
   - **Hard Way**: Scrolls to the `GameSection` for a challenge.

