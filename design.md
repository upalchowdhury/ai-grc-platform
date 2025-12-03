# AI Governance Platform - Modern Design System

## 1. Design Philosophy
**"Premium, Trustworthy, & Futuristic"**
The design should feel like a high-end enterprise tool but with the polish of a consumer app.
- **Visual Style**: Clean lines, generous whitespace, subtle glassmorphism, and high-contrast typography.
- **Interaction**: Smooth transitions, hover states that provide feedback, and micro-animations.
- **Theme**: Dark Mode first (optional but recommended for "sleekness") or a crisp, high-end Light Mode with Slate/Zinc neutrals.

## 2. Color Palette (Tailwind CSS)
Avoid default generic colors. Use a curated palette.

### Primary Brand (Trust & Intelligence)
- **Primary**: `bg-indigo-600` / `text-indigo-600` (Actionable elements)
- **Primary Hover**: `hover:bg-indigo-500`
- **Accent**: `violet-500` (For gradients or highlights)

### Neutrals (Sleek & Modern)
- **Background**: `bg-slate-50` (Light) or `bg-slate-900` (Dark)
- **Surface**: `bg-white` (Light) or `bg-slate-800` (Dark)
- **Borders**: `border-slate-200` (Light) or `border-slate-700` (Dark)
- **Text Main**: `text-slate-900` (Light) or `text-slate-50` (Dark)
- **Text Muted**: `text-slate-500` (Light) or `text-slate-400` (Dark)

### Functional Colors
- **Success**: `emerald-500` (Audit Pass, Compliant)
- **Warning**: `amber-500` (Review Needed)
- **Danger**: `rose-500` (Non-Compliant, High Risk)
- **Info**: `sky-500` (Governance Notes)

## 3. Typography
Use a modern sans-serif font family.
- **Font Family**: `font-sans` (Configure Tailwind to use **Inter**, **Outfit**, or **Plus Jakarta Sans**).
- **Headings**: Bold, tight tracking. `tracking-tight font-bold`.
- **Body**: Readable, relaxed line height. `leading-relaxed`.

## 4. Layout Structure

### A. Side Navigation (Sidenav)
**Style**: Fixed width (e.g., `w-64`), full height, distinct background.
- **Container**: `h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 border-r border-slate-800 shadow-2xl z-50`
- **Logo Area**: `h-16 flex items-center px-6 border-b border-slate-800 font-bold text-xl tracking-wider bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent`
- **Navigation Links**:
    - **Container**: `flex-1 py-6 space-y-1`
    - **Item Base**: `flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 group relative`
    - **Item Inactive**: `text-slate-400 hover:text-white hover:bg-white/5`
    - **Item Active**: `text-white bg-indigo-600/10 border-r-4 border-indigo-500`
    - **Icon**: `w-5 h-5 mr-3 opacity-70 group-hover:opacity-100`

**Menu Items**:
1.  **Intake Form** (Icon: `PlusCircle` / `FileText`)
2.  **Compliance** (Icon: `ShieldCheck`)
3.  **Security** (Icon: `Lock`)
4.  **Governance** (Icon: `Scale` / `Library`)
5.  **Audit** (Icon: `ClipboardCheck`)

### B. Main Content Area
- **Container**: `ml-64 min-h-screen bg-slate-50 p-8` (Offset by sidenav width)
- **Header**: `mb-8 flex justify-between items-center`
    - **Title**: `text-3xl font-bold text-slate-900 tracking-tight`
    - **Breadcrumbs**: `text-sm text-slate-500`

## 5. Component Designs

### A. Intake Form (The Core Feature)
Make it less overwhelming. Use a "Wizard" or "Sectioned" approach.
- **Container**: `bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden`
- **Section Header**: `bg-slate-50 px-8 py-4 border-b border-slate-200 font-semibold text-slate-700 uppercase text-xs tracking-wider`
- **Form Grid**: `grid grid-cols-12 gap-6 p-8`
- **Input Fields**:
    - **Label**: `block text-sm font-medium text-slate-700 mb-1.5`
    - **Input**: `block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 transition-shadow`
    - **Focus State**: `focus:ring-2 focus:ring-offset-0`
- **Textarea**: `min-h-[120px] resize-y`
- **Select**: Custom styled select or standard with consistent padding.

### B. Cards (Dashboard/Overview)
- **Style**: `bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 p-6`
- **Metric**: `text-3xl font-bold text-slate-900 mt-2`
- **Label**: `text-sm font-medium text-slate-500`

### C. Tables (Audit/Compliance Lists)
- **Container**: `overflow-hidden rounded-xl border border-slate-200 shadow-sm`
- **Header**: `bg-slate-50 border-b border-slate-200`
- **Header Cell**: `px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider`
- **Row**: `bg-white hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0`
- **Cell**: `px-6 py-4 whitespace-nowrap text-sm text-slate-700`

### D. Buttons
- **Primary**: `inline-flex justify-center items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all active:scale-95`
- **Secondary**: `bg-white text-slate-700 border border-slate-300 hover:bg-slate-50`

## 6. Implementation Checklist
1.  **Install Tailwind**: Ensure `tailwindcss`, `postcss`, `autoprefixer` are configured.
2.  **Configure Fonts**: Add Inter or Outfit to `tailwind.config.js`.
3.  **Install Icons**: Use `lucide-react` or `heroicons` for the sidenav.
4.  **Apply Layout**: Wrap your main `App` or `Layout` component with the Sidenav structure.
5.  **Refactor Form**: Break the 35-40 question form into logical `<Section />` components using the styling above.

## 7. Example Code Snippet (Sidenav)

```tsx
// components/Sidebar.tsx
import { FileText, ShieldCheck, Lock, Scale, ClipboardCheck } from 'lucide-react';

const navItems = [
  { name: 'Intake Form', icon: FileText, active: true },
  { name: 'Compliance', icon: ShieldCheck, active: false },
  { name: 'Security', icon: Lock, active: false },
  { name: 'Governance', icon: Scale, active: false },
  { name: 'Audit', icon: ClipboardCheck, active: false },
];

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 border-r border-slate-800 shadow-2xl">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
          AI GRC
        </span>
      </div>
      <nav className="flex-1 py-6 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className={`flex items-center px-6 py-3 text-sm font-medium transition-all duration-200 group relative ${
              item.active
                ? 'text-white bg-white/10 border-r-4 border-indigo-500'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon className={`w-5 h-5 mr-3 ${item.active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-white'}`} />
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
}
```
