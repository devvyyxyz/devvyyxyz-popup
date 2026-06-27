'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

const BP = (process.env.NEXT_BASE_PATH || '') as string

type AccentKey = 'blue' | 'cyan' | 'violet' | 'white' | 'electric'
type LabelKey = 'Made by' | 'Built by' | 'Powered by' | 'Created by'
type SpeedKey = 'instant' | 'normal' | 'dramatic'
type FrameworkKey = 'html' | 'react' | 'nextjs' | 'vue' | 'astro' | 'svelte'
type PositionKey = 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
type SizeKey = 'small' | 'medium' | 'large'
type BorderRadiusKey = 'pill' | 'rounded' | 'square'
type BgStyleKey = 'glass' | 'solid' | 'minimal'
type PanelDirectionKey = 'above' | 'below' | 'left' | 'right'
type AutoHideKey = 'never' | '10s' | '30s' | '60s'
type AnimationStyleKey = 'spring' | 'fade' | 'slide' | 'elastic' | 'none'

const FRAMEWORKS: Record<FrameworkKey, { label: string; icon: string }> = {
  html:   { label: 'HTML',     icon: '<>' },
  react:  { label: 'React',    icon: 'Re' },
  nextjs: { label: 'Next.js',  icon: 'Nx' },
  vue:    { label: 'Vue',      icon: 'Vu' },
  astro:  { label: 'Astro',    icon: 'As' },
  svelte: { label: 'Svelte',   icon: 'Sv' },
}

interface ChangelogEntry {
  version: string
  tag: string
  date: string
  type: 'major' | 'minor' | 'patch'
  summary: string
  changes: string[]
  breaking?: string[]
  configAdded?: string[]
  configRemoved?: string[]
  configChanged?: string[]
  migration?: string
}

const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.3.0',
    tag: 'v1.3.0',
    date: '2025-06-26',
    type: 'minor',
    summary: 'Custom logo support, preview containment fix',
    changes: [
      'Added custom logo URL option (logo) — replace the default icon with any image',
      'Added _appendTo internal option for preview containment in customizer',
      'Fixed badge rendering outside preview viewport when changing position',
      'Preview now correctly contains badge within the viewport area',
      'Auto-hide is disabled in preview to prevent badge disappearing during configuration',
    ],
    configAdded: ['logo (string, URL to custom icon image)'],
    migration: 'No action required — new option defaults to embedded favicon.',
  },
  {
    version: '1.2.0',
    tag: 'v1.2.0',
    date: '2025-06-26',
    type: 'minor',
    summary: 'Multi-framework support, duplicate guard, versioned CDN URLs',
    changes: [
      'Added code snippets for React, Next.js, Vue, Astro, and Svelte',
      'Added duplicate instance guard to prevent multiple badges on rapid config changes',
      'Added versioned CDN URLs for pinning specific releases',
      'Improved Shadow DOM cleanup on script reload',
      'Next.js snippet now uses next/script with strategy props',
    ],
    configAdded: ['(none — config interface unchanged)'],
    migration: 'No action required — drop-in update.',
  },
  {
    version: '1.1.0',
    tag: 'v1.1.0',
    date: '2025-06-20',
    type: 'minor',
    summary: 'Sparkle effects, glow intensity control, spring animations overhaul',
    changes: [
      'Added sparkle particle effects on badge hover and mouse move',
      'Added configurable glow intensity (subtle / medium / intense)',
      'Replaced linear animations with spring-based cubic-bezier curves',
      'Added breathing glow animation loop and pulse ring effect',
      'Added favicon base64 embedding — zero external image requests',
      'Added prefers-reduced-motion media query support',
    ],
    configAdded: ['showSparkles (boolean, default: true)'],
    migration: 'No action required — new options default to previous behaviour.',
  },
  {
    version: '1.0.0',
    tag: 'v1.0.0',
    date: '2025-06-15',
    type: 'major',
    summary: 'Initial release — badge widget with social panel and dark/light theme',
    changes: [
      'Fixed-position badge with glassmorphism styling',
      'Expandable social links panel (Website, GitHub, X/Twitter, Discord)',
      'Dark and light theme support with auto-detection',
      'Shadow DOM isolation (mode: closed) for style encapsulation',
      'Configurable accent color, label text, entry delay, and social links',
      'Spring entry animation with configurable delay',
    ],
    configAdded: ['accent', 'label', 'brand', 'url', 'theme', 'delay', 'socials'],
    migration: 'First release. See README for installation guide.',
  },
]

const ACCENTS: Record<AccentKey, { color: string; glow: string; label: string }> = {
  blue:     { color: '#3b82f6', glow: '0.3',  label: 'Blue' },
  cyan:     { color: '#06b6d4', glow: '0.3',  label: 'Cyan' },
  violet:   { color: '#8b5cf6', glow: '0.3',  label: 'Violet' },
  white:    { color: '#e2e8f0', glow: '0.15', label: 'White' },
  electric: { color: '#60a5fa', glow: '0.45', label: 'Electric' },
}

const SPEED_MAP: Record<SpeedKey, number> = { instant: 0, normal: 800, dramatic: 1800 }
const AUTOHIDE_MAP: Record<AutoHideKey, number> = { never: 0, '10s': 10000, '30s': 30000, '60s': 60000 }

interface Config {
  accent: AccentKey
  label: LabelKey
  sparkles: boolean
  speed: SpeedKey
  showWebsite: boolean
  showGithub: boolean
  showTwitter: boolean
  showDiscord: boolean
  position: PositionKey
  size: SizeKey
  borderRadius: BorderRadiusKey
  bgStyle: BgStyleKey
  panelDirection: PanelDirectionKey
  brand: string
  customUrl: string
  customLogo: string
  showDismiss: boolean
  autoHide: AutoHideKey
  animationStyle: AnimationStyleKey
}

const DEFAULT_CONFIG: Config = {
  accent: 'blue',
  label: 'Made by',
  sparkles: true,
  speed: 'normal',
  showWebsite: true,
  showGithub: true,
  showTwitter: true,
  showDiscord: true,
  position: 'bottom-left',
  size: 'medium',
  borderRadius: 'pill',
  bgStyle: 'glass',
  panelDirection: 'above',
  brand: 'Devvyy.xyz',
  customUrl: 'https://devvyy.xyz',
  customLogo: '',
  showDismiss: false,
  autoHide: 'never',
  animationStyle: 'spring',
}

/* ── Presets ── */
interface Preset {
  id: string
  label: string
  description: string
  icon: string
  config: Partial<Config>
}

const PRESETS: Preset[] = [
  {
    id: 'default', label: 'Default', description: 'Classic spring badge',
    icon: '✦',
    config: { accent: 'blue', size: 'medium', borderRadius: 'pill', bgStyle: 'glass', sparkles: true, animationStyle: 'spring', speed: 'normal', showDismiss: false, autoHide: 'never' },
  },
  {
    id: 'minimal', label: 'Minimal', description: 'Clean, subtle, no effects',
    icon: '○',
    config: { accent: 'white', size: 'small', borderRadius: 'square', bgStyle: 'minimal', sparkles: false, animationStyle: 'fade', speed: 'instant', showDismiss: false, autoHide: 'never' },
  },
  {
    id: 'glow', label: 'Neon Glow', description: 'Electric with intense glow',
    icon: '◈',
    config: { accent: 'electric', size: 'large', borderRadius: 'pill', bgStyle: 'glass', sparkles: true, animationStyle: 'spring', speed: 'dramatic', showDismiss: false, autoHide: 'never' },
  },
  {
    id: 'floating', label: 'Floating', description: 'Cyan glass, smooth slide-in',
    icon: '◎',
    config: { accent: 'cyan', size: 'medium', borderRadius: 'rounded', bgStyle: 'glass', sparkles: true, animationStyle: 'slide', speed: 'normal', showDismiss: false, autoHide: 'never' },
  },
  {
    id: 'stealth', label: 'Stealth', description: 'Auto-hides after 10 seconds',
    icon: '◕',
    config: { accent: 'white', size: 'small', borderRadius: 'square', bgStyle: 'minimal', sparkles: false, animationStyle: 'fade', speed: 'instant', showDismiss: true, autoHide: '10s' },
  },
  {
    id: 'bouncy', label: 'Bouncy', description: 'Elastic overshoot animation',
    icon: '◆',
    config: { accent: 'violet', size: 'medium', borderRadius: 'pill', bgStyle: 'glass', sparkles: true, animationStyle: 'elastic', speed: 'dramatic', showDismiss: false, autoHide: 'never' },
  },
]

/* ── Reusable mini-button for button groups ── */
function BtnGroup<T extends string>({
  options,
  value,
  onChange,
  accentColor,
  renderLabel,
}: {
  options: T[]
  value: T
  onChange: (v: T) => void
  accentColor: string
  renderLabel?: (v: T) => React.ReactNode
}) {
  return (
    <div className="flex gap-1.5">
      {options.map((opt) => {
        const active = value === opt
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className="flex-1 py-1.5 rounded-md border text-[11px] font-mono transition-all duration-300 cursor-pointer"
            style={{
              background: active ? `${accentColor}10` : 'transparent',
              borderColor: active ? `${accentColor}30` : 'rgba(255,255,255,0.05)',
              color: active ? 'rgb(255 255 255 / 0.8)' : 'rgb(255 255 255 / 0.3)',
            }}
          >
            {renderLabel ? renderLabel(opt) : opt}
          </button>
        )
      })}
    </div>
  )
}

/* ── Toggle switch ── */
function ToggleSwitch({
  checked,
  onChange,
  accentColor,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  accentColor: string
  label: string
}) {
  return (
    <div className="flex items-center justify-between">
      <label className="text-[10px] font-mono tracking-widest uppercase text-foreground/30">
        {label}
      </label>
      <button
        onClick={() => onChange(!checked)}
        className="relative w-11 h-6 rounded-full border transition-all duration-300 cursor-pointer"
        style={{
          background: checked ? `${accentColor}20` : 'transparent',
          borderColor: checked ? `${accentColor}40` : 'rgba(255,255,255,0.08)',
        }}
      >
        <span
          className="absolute rounded-full transition-all duration-300"
          style={{
            width: '18px',
            height: '18px',
            top: '2px',
            left: checked ? '20px' : '2px',
            background: checked ? accentColor : 'rgb(255 255 255 / 0.2)',
            boxShadow: checked ? `0 0 8px ${accentColor}50` : 'none',
            transition: 'all 0.3s ease',
          }}
        />
      </button>
    </div>
  )
}

/* ── Collapsible editor section ── */
function EditorSection({
  id,
  title,
  icon,
  children,
  isOpen,
  onToggle,
  accentColor,
}: {
  id: string
  title: string
  icon: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
  accentColor: string
}) {
  return (
    <div className="border-b border-white/5">
      <button onClick={onToggle} className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-white/[0.02] transition-colors cursor-pointer">
        <span className="text-[10px]" style={{ color: accentColor + '80' }}>{icon}</span>
        <span className="text-[11px] font-mono font-medium text-foreground/60 flex-1 uppercase tracking-wider">{title}</span>
        <svg className="w-3.5 h-3.5 text-foreground/20 transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
          <polyline points="4 7 8 11 12 7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  )
}

/* ── Code block with syntax highlighting ── */
function CodeBlock({ code, accentColor }: { code: string; accentColor: string }) {
  const html = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Comments (// and <!-- -->)
    .replace(/(\/\/.*)/g, '<span style="color:rgb(255 255 255 / 0.2)">$1</span>')
    .replace(/(&lt;!--.*?--&gt;)/g, '<span style="color:rgb(255 255 255 / 0.2)">$1</span>')
    // HTML/script tags
    .replace(/(&lt;script)/g, `<span style="color:${accentColor}">$1</span>`)
    .replace(/(&lt;\/script&gt;)/g, `<span style="color:${accentColor}">$1</span>`)
    .replace(/(&lt;\/?template&gt;)/g, `<span style="color:${accentColor}">$1</span>`)
    .replace(/(&lt;\/?slot\s*\/?&gt;)/g, `<span style="color:${accentColor}">$1</span>`)
    .replace(/(&lt;html&gt;)/g, `<span style="color:${accentColor}">$1</span>`)
    .replace(/(&lt;\/html&gt;)/g, `<span style="color:${accentColor}">$1</span>`)
    .replace(/(&lt;body&gt;)/g, `<span style="color:${accentColor}">$1</span>`)
    .replace(/(&lt;\/body&gt;)/g, `<span style="color:${accentColor}">$1</span>`)
    // URLs
    .replace(/("(?:https?:\/\/[^"]+)")/g, '<span style="color:#6fffb0">$1</span>')
    // Config keys (existing + new)
    .replace(/\b(accent|label|brand|url|theme|delay|showSparkles|position|size|borderRadius|bgStyle|panelDirection|showDismiss|autoHide|socials|website|github|twitter|discord|animationStyle|logo)\b(?=\s*:)/g, `<span style="color:${accentColor}">$1</span>`)
    // Global object
    .replace(/\b(window\.DevvyyBadge)\b/g, '<span style="color:#f59e0b">$1</span>')
    // Booleans
    .replace(/\b(true|false)\b/g, '<span style="color:#f472b6">$1</span>')
    // Keywords
    .replace(/\b(import|from|export|default|function|const|return|onMounted|onUnmounted|onMount)\b/g, '<span style="color:#c084fc">$1</span>')
    // JSX/Component names
    .replace(/\b(Script|App|RootLayout)\b/g, `<span style="color:${accentColor}">$1</span>`)
    // Numbers
    .replace(/\b(\d+)\b/g, '<span style="color:#60a5fa">$1</span>')
    // Astro frontmatter dashes
    .replace(/^(\s*---\s*)$/gm, '<span style="color:rgb(255 255 255 / 0.15)">$1</span>')

  return <code dangerouslySetInnerHTML={{ __html: html }} />
}

export default function Home() {
  const [config, setConfig] = useState<Config>(DEFAULT_CONFIG)
  const [framework, setFramework] = useState<FrameworkKey>('html')
  const [selectedTag, setSelectedTag] = useState(CHANGELOG[0].tag)
  const [copied, setCopied] = useState(false)
  const [expandedChangelog, setExpandedChangelog] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['presets', 'appearance', 'animation', 'layout', 'content'])
  )
  const [activePreset, setActivePreset] = useState<string>('default')
  const widgetLoadKey = useRef(0)

  useEffect(() => { setMounted(true) }, [])

  const toggleSection = useCallback((id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  useEffect(() => {
    if (!mounted) return

    const a = ACCENTS[config.accent]
    const gen = ++widgetLoadKey.current

    ;(window as any).DevvyyBadge = {
      _gen: gen,
      accent: a.color,
      label: config.label,
      brand: config.brand,
      url: config.customUrl,
      theme: 'dark',
      delay: SPEED_MAP[config.speed],
      showSparkles: config.sparkles,
      position: config.position,
      size: config.size,
      borderRadius: config.borderRadius,
      bgStyle: config.bgStyle,
      panelDirection: config.panelDirection,
      showDismiss: config.showDismiss,
      autoHide: 0,
      animationStyle: config.animationStyle,
      logo: config.customLogo || undefined,
      _appendTo: '#preview-viewport',
      socials: {
        website: config.showWebsite ? 'https://devvyy.xyz' : false,
        github: config.showGithub ? 'https://github.com/Devvyy' : false,
        twitter: config.showTwitter ? 'https://x.com/Devvyyxyz' : false,
        discord: config.showDiscord ? 'https://discord.gg/devvyy' : false,
      },
    }

    // Thorough cleanup — nuke everything from any previous generation
    const oldRoot = document.getElementById('devvyy-badge-root')
    if (oldRoot) oldRoot.remove()
    document.querySelectorAll('script#devvyy-badge-script').forEach(s => s.remove())

    const script = document.createElement('script')
    script.id = 'devvyy-badge-script'
    script.src = (document.querySelector('meta[name="base-path"]')?.getAttribute('content') || '') + '/devvyy-badge.js?v=' + gen
    // NOT async — synchronous load prevents race conditions with rapid clicks
    document.body.appendChild(script)

    return () => {
      const root = document.getElementById('devvyy-badge-root')
      if (root) root.remove()
      const s = document.getElementById('devvyy-badge-script')
      if (s) s.remove()
    }
  }, [config, mounted])

  const update = useCallback(<K extends keyof Config>(key: K, value: Config[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }, [])

  const applyPreset = useCallback((preset: Preset) => {
    setActivePreset(preset.id)
    setConfig(prev => ({ ...prev, ...preset.config }))
  }, [])

  const handleReset = useCallback(() => {
    setConfig(DEFAULT_CONFIG)
    setActivePreset('default')
    setFramework('html')
    setSelectedTag(CHANGELOG[0].tag)
  }, [])

  // ── Config object shared across all frameworks ──
  const buildConfigLines = useCallback(() => {
    const a = ACCENTS[config.accent]
    const lines: string[] = [
      `  accent: "${a.color}"`,
      `  label: "${config.label}"`,
      `  brand: "${config.brand}"`,
      `  url: "${config.customUrl}"`,
      `  theme: "dark"`,
      `  delay: ${SPEED_MAP[config.speed]}`,
      `  showSparkles: ${config.sparkles}`,
      `  position: "${config.position}"`,
      `  size: "${config.size}"`,
      `  borderRadius: "${config.borderRadius}"`,
      `  bgStyle: "${config.bgStyle}"`,
      `  panelDirection: "${config.panelDirection}"`,
      `  showDismiss: ${config.showDismiss}`,
      `  autoHide: ${AUTOHIDE_MAP[config.autoHide]}`,
      `  animationStyle: "${config.animationStyle}"`,
    ]
    if (config.customLogo) {
      lines.push(`  logo: "${config.customLogo}"`)
    }
    const socials: string[] = []
    if (config.showWebsite) socials.push('    website:  "https://devvyy.xyz"')
    if (config.showGithub)  socials.push('    github:   "https://github.com/Devvyy"')
    if (config.showTwitter) socials.push('    twitter:  "https://x.com/Devvyyxyz"')
    if (config.showDiscord) socials.push('    discord:  "https://discord.gg/devvyy"')
    if (socials.length > 0 && socials.length < 4) {
      lines.push('  socials: {')
      lines.push(socials.join(',\n') + ',')
      lines.push('  }')
    }
    return lines
  }, [config])

  const CDN_URL = `https://cdn.jsdelivr.net/gh/Devvyy/devvyy-badge@${selectedTag}/devvyy-badge.js`

  const generateCode = useCallback((fw: FrameworkKey) => {
    const lines = buildConfigLines()
    const configBlock = `window.DevvyyBadge = {\n${lines.join(',\n')}\n};`

    switch (fw) {
      case 'html':
        return [
          '<!-- Add before </body> -->',
          '<script>',
          configBlock,
          '<\/script>',
          `<script src="${CDN_URL}"><\/script>`,
        ].join('\n')

      case 'react':
        return [
          '// In your root component (e.g. App.tsx)',
          'import { useEffect } from "react";',
          '',
          'export default function App() {',
          '  useEffect(() => {',
          `    window.DevvyyBadge = {`,
          ...lines.map(l => '      ' + l.replace(/^  /, '')),
          '    };',
          '',
          `    const script = document.createElement("script");`,
          `    script.src = "${CDN_URL}";`,
          '    script.id = "devvyy-badge-script";',
          '    document.body.appendChild(script);',
          '',
          '    return () => {',
          '      document.getElementById("devvyy-badge-root")?.remove();',
          '      document.getElementById("devvyy-badge-script")?.remove();',
          '    };',
          '  }, []);',
          '',
          '  return <>{/* Your app */}</>;',
          '}',
        ].join('\n')

      case 'nextjs':
        return [
          '// app/layout.tsx — add to your root layout',
          'import Script from "next/script";',
          '',
          'export default function RootLayout({ children }) {',
          '  const badgeConfig = {',
          ...lines.map(l => '    ' + l.replace(/^  /, '')),
          '  };',
          '',
          '  return (',
          '    <html>',
          '      <body>',
          '        {children}',
          '        <Script id="devvyy-badge-config" strategy="beforeInteractive">',
          `          window.DevvyyBadge = ${JSON.stringify({ accent: ACCENTS[config.accent].color, label: config.label, brand: config.brand, url: config.customUrl, theme: 'dark', delay: SPEED_MAP[config.speed], showSparkles: config.sparkles, position: config.position, size: config.size, borderRadius: config.borderRadius, bgStyle: config.bgStyle, panelDirection: config.panelDirection, showDismiss: config.showDismiss, autoHide: AUTOHIDE_MAP[config.autoHide], animationStyle: config.animationStyle, ...(config.customLogo ? { logo: config.customLogo } : {}), socials: { website: config.showWebsite ? 'https://devvyy.xyz' : false, github: config.showGithub ? 'https://github.com/Devvyy' : false, twitter: config.showTwitter ? 'https://x.com/Devvyyxyz' : false, discord: config.showDiscord ? 'https://discord.gg/devvyy' : false } }, null, 2).replace(/^\s+/gm, (m) => '          ' + m).trim()};`,
          '        </Script>',
          `        <Script src="${CDN_URL}" strategy="afterInteractive" />`,
          '      </body>',
          '    </html>',
          '  );',
          '}',
        ].join('\n')

      case 'vue':
        return [
          '// In App.vue (Composition API)',
          '<script setup>',
          'import { onMounted, onUnmounted } from "vue";',
          '',
          'onMounted(() => {',
          `  window.DevvyyBadge = {`,
          ...lines.map(l => '    ' + l.replace(/^  /, '')),
          '  };',
          '',
          '  const script = document.createElement("script");',
          `  script.src = "${CDN_URL}";`,
          '  script.id = "devvyy-badge-script";',
          '  document.body.appendChild(script);',
          '});',
          '',
          'onUnmounted(() => {',
          '  document.getElementById("devvyy-badge-root")?.remove();',
          '  document.getElementById("devvyy-badge-script")?.remove();',
          '});',
          '<\/script>',
          '',
          '<template>',
          '  <!-- Your app -->',
          '</template>',
        ].join('\n')

      case 'astro':
        return [
          '<!-- In your Layout.astro -->',
          '---',
          'const badgeConfig = {',
          ...lines.map(l => '  ' + l.replace(/^  /, '')),
          '};',
          '---',
          '',
          '<html>',
          '  <body>',
          '    <slot />',
          '',
          '    <script define:vars={{ badgeConfig }}>',
          '      window.DevvyyBadge = badgeConfig;',
          '      const s = document.createElement("script");',
          `      s.src = "${CDN_URL}";`,
          '      s.id = "devvyy-badge-script";',
          '      document.body.appendChild(s);',
          '    </script>',
          '  </body>',
          '</html>',
        ].join('\n')

      case 'svelte':
        return [
          '// In +layout.svelte',
          '<script>',
          'import { onMount } from "svelte";',
          '',
          'onMount(() => {',
          `  window.DevvyyBadge = {`,
          ...lines.map(l => '    ' + l.replace(/^  /, '')),
          '  };',
          '',
          '  const script = document.createElement("script");',
          `  script.src = "${CDN_URL}";`,
          '  script.id = "devvyy-badge-script";',
          '  document.body.appendChild(script);',
          '',
          '  return () => {',
          '    document.getElementById("devvyy-badge-root")?.remove();',
          '    document.getElementById("devvyy-badge-script")?.remove();',
          '  };',
          '});',
          '<\/script>',
          '',
          '<slot />',
        ].join('\n')
    }
  }, [buildConfigLines, config, CDN_URL])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generateCode(framework)).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [generateCode, framework])

  const code = generateCode(framework)
  const accentColor = ACCENTS[config.accent].color

  /* ── Position indicator ── */
  const PositionIndicator = ({ pos }: { pos: PositionKey }) => {
    const dotStyle: Record<PositionKey, React.CSSProperties> = {
      'bottom-left':  { bottom: '1px', left: '1px' },
      'bottom-right': { bottom: '1px', right: '1px' },
      'top-left':     { top: '1px', left: '1px' },
      'top-right':    { top: '1px', right: '1px' },
    }
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="relative w-4 h-3 rounded-sm border border-current/20">
          <span
            className="absolute w-1 h-1 rounded-full"
            style={dotStyle[pos]}
          />
        </span>
        <span>{pos}</span>
      </span>
    )
  }

  /* ── Border radius shape preview ── */
  const RadiusShape = ({ type }: { type: BorderRadiusKey }) => {
    const styles: Record<BorderRadiusKey, React.CSSProperties> = {
      pill:    { width: '18px', height: '10px', borderRadius: '999px' },
      rounded: { width: '16px', height: '12px', borderRadius: '4px' },
      square:  { width: '14px', height: '14px', borderRadius: '1px' },
    }
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="inline-block bg-current/50" style={styles[type]} />
        <span>{type}</span>
      </span>
    )
  }

  /* ── Panel direction arrow icon ── */
  const DirArrow = ({ dir }: { dir: PanelDirectionKey }) => {
    const arrows: Record<PanelDirectionKey, string> = {
      above: '↑',
      below: '↓',
      left:  '←',
      right: '→',
    }
    return (
      <span className="inline-flex items-center gap-1.5">
        <span className="text-[10px] leading-none">{arrows[dir]}</span>
        <span>{dir}</span>
      </span>
    )
  }

  /* ── Animation style icons ── */
  const animStyleIcons: Record<AnimationStyleKey, string> = {
    spring:  '↗',
    fade:    '◌',
    slide:   '→',
    elastic: '⇑',
    none:    '—',
  }

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    background: focused ? `${accentColor}08` : 'rgba(255,255,255,0.03)',
    borderColor: focused ? `${accentColor}30` : 'rgba(255,255,255,0.06)',
    color: 'rgb(255 255 255 / 0.7)',
  })

  return (
    <div className="relative h-screen flex flex-col bg-background text-foreground overflow-hidden" suppressHydrationWarning>
      {/* ── TOP TOOLBAR ── */}
      <header className="flex items-center justify-between px-4 h-11 border-b border-white/5 flex-shrink-0 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <img src={`${BP}/FavIcon.png`} alt="" className="w-5 h-5 rounded" />
          <span className="text-[12px] font-mono text-foreground/60 tracking-tight">Badge Editor</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-foreground/20">v1.3.0</span>
          <button
            onClick={handleReset}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono text-foreground/30 hover:text-foreground/60 hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </header>

      {/* ── MAIN SPLIT ── */}
      <div className="flex flex-1 min-h-0">
        {/* ═══════ LEFT: Preview Viewport ═══════ */}
        <div className="w-[55%] h-full flex flex-col">
          {/* Viewport title bar */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
            <span className="text-[10px] font-mono tracking-widest uppercase text-foreground/30">Preview</span>
          </div>

          {/* Viewport frame */}
          <div id="preview-viewport" className="flex-1 relative overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: '#0a0a0a',
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />

            {/* Mock nav bar */}
            <div className="relative z-10 mx-4 mt-4 h-9 rounded-lg bg-white/[0.04] border border-white/[0.04]" />

            {/* Mock content blocks */}
            <div className="relative z-10 mx-4 mt-3 space-y-3">
              <div className="h-3 w-1/3 rounded bg-white/[0.03]" />
              <div className="h-24 rounded-lg bg-white/[0.03]" />
              <div className="h-3 w-2/5 rounded bg-white/[0.03]" />
              <div className="grid grid-cols-3 gap-3">
                <div className="h-20 rounded-lg bg-white/[0.03]" />
                <div className="h-20 rounded-lg bg-white/[0.03]" />
                <div className="h-20 rounded-lg bg-white/[0.03]" />
              </div>
              <div className="h-3 w-1/4 rounded bg-white/[0.03]" />
              <div className="h-32 rounded-lg bg-white/[0.03]" />
            </div>
          </div>
        </div>

        {/* ═══════ RIGHT: Editor Panel ═══════ */}
        <div
          className="w-[45%] h-full overflow-y-auto border-l border-white/5 bg-[#0a0a0a]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* ── 1. PRESETS ── */}
          <EditorSection
            id="presets"
            title="Presets"
            icon="◆"
            isOpen={expandedSections.has('presets')}
            onToggle={() => toggleSection('presets')}
            accentColor={accentColor}
          >
            <div className="grid grid-cols-2 gap-1.5">
              {PRESETS.map((preset) => {
                const isActive = activePreset === preset.id
                return (
                  <button
                    key={preset.id}
                    onClick={() => applyPreset(preset)}
                    className="flex flex-col justify-between rounded-lg border px-3 py-2.5 text-left transition-all duration-200 cursor-pointer min-h-[72px]"
                    style={{
                      background: isActive ? `${accentColor}08` : 'transparent',
                      borderColor: isActive ? `${accentColor}30` : 'rgba(255,255,255,0.05)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[18px] leading-none" style={{ color: isActive ? accentColor : 'rgb(255 255 255 / 0.3)' }}>{preset.icon}</span>
                      <span className="text-[11px] font-mono font-medium" style={{ color: isActive ? 'rgb(255 255 255 / 0.8)' : 'rgb(255 255 255 / 0.5)' }}>{preset.label}</span>
                    </div>
                    <span className="text-[9px] font-mono text-foreground/25 mt-1.5 leading-snug">{preset.description}</span>
                  </button>
                )
              })}
            </div>
          </EditorSection>

          {/* ── 2. APPEARANCE ── */}
          <EditorSection
            id="appearance"
            title="Appearance"
            icon="◉"
            isOpen={expandedSections.has('appearance')}
            onToggle={() => toggleSection('appearance')}
            accentColor={accentColor}
          >
            <div className="flex flex-col gap-3.5">
              {/* Accent Color — compact circles */}
              <div>
                <label className="block text-[10px] font-mono tracking-widest uppercase text-foreground/30 mb-2">Accent Color</label>
                <div className="flex gap-2">
                  {(Object.keys(ACCENTS) as AccentKey[]).map((key) => {
                    const a = ACCENTS[key]
                    const active = config.accent === key
                    return (
                      <button
                        key={key}
                        onClick={() => update('accent', key)}
                        className="relative w-8 h-8 rounded-full border transition-all duration-300 cursor-pointer"
                        style={{
                          background: active ? `${a.color}20` : 'transparent',
                          borderColor: active ? `${a.color}50` : 'rgba(255,255,255,0.06)',
                        }}
                        title={a.label}
                      >
                        <span
                          className="absolute inset-0 m-auto w-3 h-3 rounded-full transition-all duration-300"
                          style={{
                            background: a.color,
                            boxShadow: active ? `0 0 8px ${a.color}60` : 'none',
                          }}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="block text-[10px] font-mono tracking-widest uppercase text-foreground/30 mb-2">Size</label>
                <BtnGroup
                  options={['small', 'medium', 'large'] as SizeKey[]}
                  value={config.size}
                  onChange={(v) => update('size', v)}
                  accentColor={accentColor}
                />
              </div>

              {/* Border Radius */}
              <div>
                <label className="block text-[10px] font-mono tracking-widest uppercase text-foreground/30 mb-2">Border Radius</label>
                <BtnGroup
                  options={['pill', 'rounded', 'square'] as BorderRadiusKey[]}
                  value={config.borderRadius}
                  onChange={(v) => update('borderRadius', v)}
                  accentColor={accentColor}
                  renderLabel={(v) => <RadiusShape type={v} />}
                />
              </div>

              {/* Background Style */}
              <div>
                <label className="block text-[10px] font-mono tracking-widest uppercase text-foreground/30 mb-2">Background</label>
                <BtnGroup
                  options={['glass', 'solid', 'minimal'] as BgStyleKey[]}
                  value={config.bgStyle}
                  onChange={(v) => update('bgStyle', v)}
                  accentColor={accentColor}
                />
              </div>
            </div>
          </EditorSection>

          {/* ── 3. ANIMATION ── */}
          <EditorSection
            id="animation"
            title="Animation"
            icon="↗"
            isOpen={expandedSections.has('animation')}
            onToggle={() => toggleSection('animation')}
            accentColor={accentColor}
          >
            <div className="flex flex-col gap-3.5">
              {/* Animation Style */}
              <div>
                <label className="block text-[10px] font-mono tracking-widest uppercase text-foreground/30 mb-2">Style</label>
                <BtnGroup
                  options={['spring', 'fade', 'slide', 'elastic', 'none'] as AnimationStyleKey[]}
                  value={config.animationStyle}
                  onChange={(v) => update('animationStyle', v)}
                  accentColor={accentColor}
                  renderLabel={(v) => (
                    <span className="inline-flex items-center gap-1">
                      <span className="text-[10px] leading-none">{animStyleIcons[v]}</span>
                      {v}
                    </span>
                  )}
                />
              </div>

              {/* Speed */}
              <div>
                <label className="block text-[10px] font-mono tracking-widest uppercase text-foreground/30 mb-2">Speed</label>
                <BtnGroup
                  options={['instant', 'normal', 'dramatic'] as SpeedKey[]}
                  value={config.speed}
                  onChange={(v) => update('speed', v)}
                  accentColor={accentColor}
                />
              </div>

              {/* Sparkles */}
              <ToggleSwitch
                checked={config.sparkles}
                onChange={(v) => update('sparkles', v)}
                accentColor={accentColor}
                label="Sparkle Effects"
              />
            </div>
          </EditorSection>

          {/* ── 4. LAYOUT ── */}
          <EditorSection
            id="layout"
            title="Layout"
            icon="⊞"
            isOpen={expandedSections.has('layout')}
            onToggle={() => toggleSection('layout')}
            accentColor={accentColor}
          >
            <div className="flex flex-col gap-3.5">
              {/* Position */}
              <div>
                <label className="block text-[10px] font-mono tracking-widest uppercase text-foreground/30 mb-2">Position</label>
                <BtnGroup
                  options={['bottom-left', 'bottom-right', 'top-left', 'top-right'] as PositionKey[]}
                  value={config.position}
                  onChange={(v) => update('position', v)}
                  accentColor={accentColor}
                  renderLabel={(v) => <PositionIndicator pos={v} />}
                />
              </div>

              {/* Panel Direction */}
              <div>
                <label className="block text-[10px] font-mono tracking-widest uppercase text-foreground/30 mb-2">Panel Direction</label>
                <BtnGroup
                  options={['above', 'below', 'left', 'right'] as PanelDirectionKey[]}
                  value={config.panelDirection}
                  onChange={(v) => update('panelDirection', v)}
                  accentColor={accentColor}
                  renderLabel={(v) => <DirArrow dir={v} />}
                />
              </div>
            </div>
          </EditorSection>

          {/* ── 5. CONTENT ── */}
          <EditorSection
            id="content"
            title="Content"
            icon="✎"
            isOpen={expandedSections.has('content')}
            onToggle={() => toggleSection('content')}
            accentColor={accentColor}
          >
            <div className="flex flex-col gap-3.5">
              {/* Label Text */}
              <div>
                <label className="block text-[10px] font-mono tracking-widest uppercase text-foreground/30 mb-2">Label Text</label>
                <BtnGroup
                  options={['Made by', 'Built by', 'Powered by', 'Created by'] as LabelKey[]}
                  value={config.label}
                  onChange={(v) => update('label', v)}
                  accentColor={accentColor}
                />
              </div>

              {/* Brand */}
              <div>
                <img src={`${BP}/wordmark.png`} className="h-5 mb-2 opacity-60" alt="" />
                <label className="block text-[10px] font-mono tracking-widest uppercase text-foreground/30 mb-2">Brand</label>
                <input
                  type="text"
                  value={config.brand}
                  onChange={(e) => update('brand', e.target.value)}
                  className="w-full border rounded-md px-2.5 py-1.5 text-[11px] font-mono focus:outline-none transition-colors"
                  style={inputStyle(false)}
                  onFocus={(e) => {
                    e.currentTarget.style.background = `${accentColor}08`
                    e.currentTarget.style.borderColor = `${accentColor}30`
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                  }}
                />
              </div>

              {/* URL */}
              <div>
                <label className="block text-[10px] font-mono tracking-widest uppercase text-foreground/30 mb-2">URL</label>
                <input
                  type="text"
                  value={config.customUrl}
                  onChange={(e) => update('customUrl', e.target.value)}
                  className="w-full border rounded-md px-2.5 py-1.5 text-[11px] font-mono focus:outline-none transition-colors"
                  style={inputStyle(false)}
                  onFocus={(e) => {
                    e.currentTarget.style.background = `${accentColor}08`
                    e.currentTarget.style.borderColor = `${accentColor}30`
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                  }}
                />
              </div>

              {/* Custom Logo */}
              <div>
                <label className="block text-[10px] font-mono tracking-widest uppercase text-foreground/30 mb-2">Custom Logo URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={config.customLogo}
                    onChange={(e) => update('customLogo', e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full border rounded-md px-2.5 py-1.5 text-[11px] font-mono focus:outline-none transition-colors placeholder:text-foreground/15"
                    style={inputStyle(false)}
                    onFocus={(e) => {
                      e.currentTarget.style.background = `${accentColor}08`
                      e.currentTarget.style.borderColor = `${accentColor}30`
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                    }}
                  />
                  {config.customLogo && (
                    <img
                      src={config.customLogo}
                      alt=""
                      className="w-7 h-7 rounded-md border border-white/10 object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  )}
                </div>
                <span className="text-[9px] font-mono text-foreground/20 mt-1 block">Leave empty to use default Devvyy icon</span>
              </div>
            </div>
          </EditorSection>

          {/* ── 6. SOCIALS ── */}
          <EditorSection
            id="socials"
            title="Socials"
            icon="⬡"
            isOpen={expandedSections.has('socials')}
            onToggle={() => toggleSection('socials')}
            accentColor={accentColor}
          >
            <div className="flex flex-col gap-2.5">
              {([
                { key: 'showWebsite' as const, label: 'Website',  icon: '◎' },
                { key: 'showGithub'  as const, label: 'GitHub',   icon: '◈' },
                { key: 'showTwitter' as const, label: 'X / Twitter', icon: '✕' },
                { key: 'showDiscord' as const, label: 'Discord',  icon: '◆' },
              ]).map(({ key, label, icon }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-foreground/30 flex items-center gap-2">
                    <span className="text-[11px]" style={{ color: config[key] ? accentColor : 'rgb(255 255 255 / 0.15)' }}>{icon}</span>
                    {label}
                  </span>
                  <button
                    onClick={() => update(key, !config[key])}
                    className="relative w-11 h-6 rounded-full border transition-all duration-300 cursor-pointer"
                    style={{
                      background: config[key] ? `${accentColor}20` : 'transparent',
                      borderColor: config[key] ? `${accentColor}40` : 'rgba(255,255,255,0.08)',
                    }}
                  >
                    <span
                      className="absolute rounded-full transition-all duration-300"
                      style={{
                        width: '18px',
                        height: '18px',
                        top: '2px',
                        left: config[key] ? '20px' : '2px',
                        background: config[key] ? accentColor : 'rgb(255 255 255 / 0.2)',
                        boxShadow: config[key] ? `0 0 8px ${accentColor}50` : 'none',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </EditorSection>

          {/* ── 7. BEHAVIOR (default closed) ── */}
          <EditorSection
            id="behavior"
            title="Behavior"
            icon="⚙"
            isOpen={expandedSections.has('behavior')}
            onToggle={() => toggleSection('behavior')}
            accentColor={accentColor}
          >
            <div className="flex flex-col gap-3.5">
              <ToggleSwitch
                checked={config.showDismiss}
                onChange={(v) => update('showDismiss', v)}
                accentColor={accentColor}
                label="Dismiss Button"
              />

              <div>
                <label className="block text-[10px] font-mono tracking-widest uppercase text-foreground/30 mb-2">Auto-hide</label>
                <BtnGroup
                  options={['never', '10s', '30s', '60s'] as AutoHideKey[]}
                  value={config.autoHide}
                  onChange={(v) => update('autoHide', v)}
                  accentColor={accentColor}
                />
              </div>
            </div>
          </EditorSection>

          {/* ── 8. CODE ── */}
          <EditorSection
            id="code"
            title="Code"
            icon="</>"
            isOpen={expandedSections.has('code')}
            onToggle={() => toggleSection('code')}
            accentColor={accentColor}
          >
            <div className="flex flex-col gap-0 -mx-4 -mb-4">
              {/* Version selector row */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
                <span className="text-[10px] font-mono tracking-widest uppercase text-foreground/25">
                  Version
                </span>
                <div className="flex items-center gap-1.5">
                  {CHANGELOG.map((entry) => {
                    const active = selectedTag === entry.tag
                    return (
                      <button
                        key={entry.tag}
                        onClick={() => setSelectedTag(entry.tag)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono transition-all duration-200 cursor-pointer"
                        style={{
                          background: active ? `${accentColor}15` : 'transparent',
                          color: active ? accentColor : 'rgb(255 255 255 / 0.3)',
                          border: active ? `1px solid ${accentColor}25` : '1px solid transparent',
                        }}
                      >
                        {entry.version}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Framework tabs */}
              <div className="flex items-center border-b border-white/5 overflow-x-auto">
                <div className="flex min-w-0 px-2 py-1.5 gap-0.5">
                  {(Object.keys(FRAMEWORKS) as FrameworkKey[]).map((fw) => {
                    const active = framework === fw
                    return (
                      <button
                        key={fw}
                        onClick={() => setFramework(fw)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono whitespace-nowrap transition-all duration-200 cursor-pointer"
                        style={{
                          background: active ? `${accentColor}15` : 'transparent',
                          color: active ? accentColor : 'rgb(255 255 255 / 0.3)',
                        }}
                      >
                        <span
                          className="text-[9px] font-bold tracking-tight"
                          style={{
                            opacity: active ? 1 : 0.4,
                            color: active ? accentColor : 'rgb(255 255 255 / 0.25)',
                          }}
                        >
                          {FRAMEWORKS[fw].icon}
                        </span>
                        {FRAMEWORKS[fw].label}
                      </button>
                    )
                  })}
                </div>
                <div className="ml-auto pr-3 flex-shrink-0">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-300 cursor-pointer"
                    style={{
                      background: copied ? 'rgba(34,197,94,0.1)' : `${accentColor}10`,
                      borderColor: copied ? 'rgba(34,197,94,0.2)' : `${accentColor}25`,
                      color: copied ? '#22c55e' : accentColor,
                    }}
                  >
                    {copied ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code block */}
              <pre
                className="px-4 py-4 overflow-x-auto text-foreground/40 max-h-80 overflow-y-auto"
                style={{
                  fontFamily: 'var(--font-mono), ui-monospace, monospace',
                  fontSize: '0.7rem',
                  lineHeight: '1.8',
                  margin: 0,
                  scrollbarWidth: 'none',
                }}
              >
                <CodeBlock code={code} accentColor={accentColor} />
              </pre>
            </div>
          </EditorSection>

          {/* ── 9. CHANGELOG (default closed) ── */}
          <EditorSection
            id="changelog"
            title="Changelog"
            icon="☰"
            isOpen={expandedSections.has('changelog')}
            onToggle={() => toggleSection('changelog')}
            accentColor={accentColor}
          >
            <div className="flex flex-col gap-2">
              {CHANGELOG.map((entry, i) => {
                const isExpanded = expandedChangelog === i
                const typeColors: Record<string, { bg: string; text: string }> = {
                  major:  { bg: '#f472b620', text: '#f472b6' },
                  minor:  { bg: `${accentColor}15`, text: accentColor },
                  patch:  { bg: '#6fffb015', text: '#6fffb0' },
                }
                const tc = typeColors[entry.type]

                return (
                  <div
                    key={entry.tag}
                    className="rounded-lg border border-white/5 overflow-hidden transition-all duration-300"
                    style={{
                      borderColor: isExpanded ? `${accentColor}15` : 'rgba(255,255,255,0.03)',
                    }}
                  >
                    <button
                      onClick={() => setExpandedChangelog(isExpanded ? null : i)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left cursor-pointer group"
                    >
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold flex-shrink-0"
                        style={{ background: tc.bg, color: tc.text }}
                      >
                        {entry.version}
                      </span>
                      <span className="text-[11px] text-foreground/50 flex-1 truncate group-hover:text-foreground/70 transition-colors">
                        {entry.summary}
                      </span>
                      <span className="text-[9px] font-mono text-foreground/15 flex-shrink-0 hidden sm:block">
                        {entry.date}
                      </span>
                      <svg
                        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                        className="text-foreground/15 flex-shrink-0 transition-transform duration-300"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', color: isExpanded ? accentColor : undefined }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>

                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{
                        maxHeight: isExpanded ? '600px' : '0px',
                        opacity: isExpanded ? 1 : 0,
                      }}
                    >
                      <div className="px-3 pb-3 border-t border-white/5 pt-2.5">
                        {/* Changes */}
                        <div className="mb-3">
                          <span className="text-[9px] font-mono tracking-widest uppercase text-foreground/25 mb-1.5 block">
                            Changes
                          </span>
                          <ul className="flex flex-col gap-1">
                            {entry.changes.map((c, ci) => (
                              <li key={ci} className="flex items-start gap-2 text-[11px] text-foreground/45 leading-relaxed">
                                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ background: accentColor, opacity: 0.6 }} />
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Config changes grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                          {entry.configAdded && entry.configAdded[0] !== '(none — config interface unchanged)' && (
                            <div className="rounded border border-white/5 px-2.5 py-2">
                              <span className="text-[8px] font-mono tracking-widest uppercase text-foreground/20 block mb-1">
                                Added
                              </span>
                              <div className="flex flex-col gap-0.5">
                                {entry.configAdded.map((c, ci) => (
                                  <span key={ci} className="text-[10px] font-mono text-foreground/40">
                                    + {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {entry.configRemoved && (
                            <div className="rounded border border-white/5 px-2.5 py-2">
                              <span className="text-[8px] font-mono tracking-widest uppercase text-foreground/20 block mb-1">
                                Removed
                              </span>
                              <div className="flex flex-col gap-0.5">
                                {entry.configRemoved.map((c, ci) => (
                                  <span key={ci} className="text-[10px] font-mono text-foreground/40">
                                    - {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {entry.configChanged && (
                            <div className="rounded border border-white/5 px-2.5 py-2">
                              <span className="text-[8px] font-mono tracking-widest uppercase text-foreground/20 block mb-1">
                                Changed
                              </span>
                              <div className="flex flex-col gap-0.5">
                                {entry.configChanged.map((c, ci) => (
                                  <span key={ci} className="text-[10px] font-mono text-foreground/40">
                                    ~ {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Migration note */}
                        {entry.migration && (
                          <div
                            className="rounded px-2.5 py-2 text-[11px] text-foreground/45 leading-relaxed"
                            style={{ background: `${accentColor}08`, borderLeft: `2px solid ${accentColor}30` }}
                          >
                            <span className="font-mono text-foreground/25 text-[9px] uppercase tracking-widest block mb-0.5">
                              Migration
                            </span>
                            {entry.migration}
                          </div>
                        )}

                        {/* CDN URL for this version */}
                        <div className="mt-2.5 flex items-center gap-2">
                          <span className="text-[8px] font-mono tracking-widest uppercase text-foreground/15">
                            CDN
                          </span>
                          <code
                            className="text-[9px] font-mono text-foreground/30 px-2 py-0.5 rounded border border-white/5 cursor-pointer hover:text-foreground/50 hover:border-white/10 transition-colors"
                            onClick={() => {
                              navigator.clipboard.writeText(`https://cdn.jsdelivr.net/gh/Devvyy/devvyy-badge@${entry.tag}/devvyy-badge.js`)
                            }}
                            title="Click to copy CDN URL"
                          >
                            ...@{entry.tag}/devvyy-badge.js
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </EditorSection>

          {/* Bottom spacer for scroll */}
          <div className="h-16" />
        </div>
      </div>
    </div>
  )
}