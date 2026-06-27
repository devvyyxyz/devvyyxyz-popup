#!/usr/bin/env python3
"""Build script for devvyy-badge.js v1.3.0
Supports: position, size, borderRadius, bgStyle, panelDirection, showDismiss, autoHide
"""
import base64, sys, os

# ── Read favicon ──
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FAVICON_PATH = os.path.join(SCRIPT_DIR, '..', 'download', 'devvyy-badge', 'FavIcon.png')
# fallback: try public/
if not os.path.exists(FAVICON_PATH):
    FAVICON_PATH = os.path.join(SCRIPT_DIR, '..', 'public', 'FavIcon.png')
if not os.path.exists(FAVICON_PATH):
    # Try finding it anywhere
    import glob
    matches = glob.glob(os.path.join(SCRIPT_DIR, '..', '**', 'FavIcon.png'), recursive=True)
    if matches:
        FAVICON_PATH = matches[0]
    else:
        print("WARNING: FavIcon.png not found, using empty placeholder")
        FAVICON_PATH = None

if FAVICON_PATH and os.path.exists(FAVICON_PATH):
    with open(FAVICON_PATH, 'rb') as f:
        FAVICON_B64 = base64.b64encode(f.read()).decode()
else:
    FAVICON_B64 = ''

# ── Output path ──
OUT = os.path.join(SCRIPT_DIR, '..', 'public', 'devvyy-badge.js')

JS = r"""(function(){
'use strict';

/* ── Config ──────────────────────────────────── */
var DEFAULTS = {
  url: 'https://devvyy.xyz',
  label: 'Made by',
  brand: 'Devvyy.xyz',
  position: 'bottom-left',
  accent: '#3b82f6',
  logo: '',
  socials: {
    website:  'https://devvyy.xyz',
    github:   'https://github.com/Devvyy',
    twitter:  'https://x.com/Devvyyxyz',
    discord:  'https://discord.gg/devvyy'
  },
  theme: 'dark',
  delay: 800,
  showSparkles: true,
  size: 'medium',
  borderRadius: 'pill',
  bgStyle: 'glass',
  panelDirection: 'above',
  showDismiss: false,
  autoHide: 0,
  animationStyle: 'spring',
  _appendTo: ''
};

function merge(a, b) {
  var out = {};
  for (var k in a) out[k] = a[k];
  for (var k in b) if (b.hasOwnProperty(k)) out[k] = b[k];
  return out;
}

var cfg = merge(DEFAULTS, window.DevvyyBadge || {});
cfg.socials = merge(DEFAULTS.socials, (cfg.socials || {}));

/* ── Embedded Favicon (data URI) ─────────────── */
var FAVICON = 'data:image/png;base64,FAVICON_PLACEHOLDER';

/* ── SVG Icons ───────────────────────────────── */
var ICONS = {
  website: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.694.825.576C20.565 21.795 24 17.295 24 12 24 5.37 18.627 0 12 0z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  discord: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  dismiss: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
};

/* ── Theme Detection ─────────────────────────── */
function getTheme() {
  if (cfg.theme === 'dark' || cfg.theme === 'light') return cfg.theme;
  return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
}
var currentTheme = getTheme();

/* ── Helpers ─────────────────────────────────── */
function hexToRgb(hex) {
  var r = parseInt(hex.slice(1,3),16);
  var g = parseInt(hex.slice(3,5),16);
  var b = parseInt(hex.slice(5,7),16);
  return r+','+g+','+b;
}

var SIZE = {
  small:  { icon:24, label:9,  brand:12, pad:'5px 10px 5px 5px',  gap:7,  chev:12, panelW:200, panelPad:12 },
  medium: { icon:32, label:10, brand:14, pad:'8px 14px 8px 8px',  gap:10, chev:14, panelW:240, panelPad:16 },
  large:  { icon:40, label:11, brand:16, pad:'10px 18px 10px 10px', gap:12, chev:16, panelW:260, panelPad:18 }
};
var sz = SIZE[cfg.size] || SIZE.medium;

var RAD = { pill: 50, rounded: 16, square: 8 };
var rad = RAD[cfg.borderRadius] || RAD.pill;

var POS = {
  'bottom-left':  'bottom:24px;left:24px;top:;right:;',
  'bottom-right': 'bottom:24px;right:24px;top:;left:;',
  'top-left':     'top:24px;left:24px;bottom:;right:;',
  'top-right':    'top:24px;right:24px;bottom:;left:;'
};
var posCss = (POS[cfg.position] || POS['bottom-left']).split(';');

var PANEL_DIR = {
  above: { anchor:'bottom:calc(100% + 12px);left:0;top:;right:',         origin:'bottom left',  axis:'Y' },
  below: { anchor:'top:calc(100% + 12px);left:0;bottom:;right:',         origin:'top left',    axis:'Y' },
  left:  { anchor:'right:calc(100% + 12px);bottom:0;top:;left:',         origin:'bottom right', axis:'X' },
  right: { anchor:'left:calc(100% + 12px);bottom:0;top:;right:',         origin:'bottom left',  axis:'X' }
};
var pd = PANEL_DIR[cfg.panelDirection] || PANEL_DIR.above;
var pdAnchors = pd.anchor.split(';');

function buildCSS(theme) {
  var dark = theme === 'dark';
  var blur = cfg.bgStyle === 'glass' ? 20 : 0;
  var sat  = cfg.bgStyle === 'glass' ? 1.6 : 1;
  var bgA  = dark
    ? (cfg.bgStyle === 'solid' ? 0.92 : cfg.bgStyle === 'minimal' ? 0.5 : 0.75)
    : (cfg.bgStyle === 'solid' ? 0.95 : cfg.bgStyle === 'minimal' ? 0.6 : 0.85);
  var brdA = cfg.bgStyle === 'minimal' ? 0.03 : cfg.bgStyle === 'solid' ? 0.1 : 0.06;
  var panelBlur = cfg.bgStyle === 'glass' ? 24 : 0;
  var panelSat  = cfg.bgStyle === 'glass' ? 1.8 : 1;

  /* Entry animation direction based on position */
  var enterY = (cfg.position === 'top-left' || cfg.position === 'top-right') ? '-24px' : '24px';

  /* Animation style presets */
  var animKeyframes = '';
  var animWrap = '';
  var animStyle = cfg.animationStyle || 'spring';
  if (animStyle === 'spring') {
    animKeyframes = '@keyframes db-enter{0%{transform:translateY(' + enterY + ') scale(0.3);opacity:0}60%{transform:translateY(' + (enterY === '-24px' ? '4px' : '-4px') + ') scale(1.06);opacity:1}80%{transform:translateY(' + (enterY === '-24px' ? '-2px' : '2px') + ') scale(0.97)}100%{transform:translateY(0) scale(1);opacity:1}}';
    animWrap = 'animation:db-enter 0.7s cubic-bezier(0.34,1.56,0.64,1) '+cfg.delay+'ms both;';
  } else if (animStyle === 'fade') {
    animKeyframes = '@keyframes db-enter{0%{opacity:0}100%{opacity:1}}';
    animWrap = 'animation:db-enter 0.5s ease '+cfg.delay+'ms both;';
  } else if (animStyle === 'slide') {
    animKeyframes = '@keyframes db-enter{0%{transform:translateY(' + enterY + ');opacity:0}100%{transform:translateY(0);opacity:1}}';
    animWrap = 'animation:db-enter 0.4s ease-out '+cfg.delay+'ms both;';
  } else if (animStyle === 'elastic') {
    animKeyframes = '@keyframes db-enter{0%{transform:scale(0);opacity:0}55%{transform:scale(1.15);opacity:1}75%{transform:scale(0.92)}100%{transform:scale(1);opacity:1}}';
    animWrap = 'animation:db-enter 0.8s cubic-bezier(0.68,-0.55,0.27,1.55) '+cfg.delay+'ms both;';
  } else {
    animKeyframes = '';
    animWrap = 'opacity:1;';
  }

  return ''
  + animKeyframes
  + '@keyframes db-breathe{0%,100%{box-shadow:0 4px 24px -4px var(--db-glow),0 0 0 0 var(--db-glow)}50%{box-shadow:0 4px 32px -2px var(--db-glow),0 0 20px -4px var(--db-glow)}}'
  + '@keyframes db-sparkle{0%{transform:scale(0) rotate(0deg);opacity:1}50%{transform:scale(1) rotate(180deg);opacity:1}100%{transform:scale(0) rotate(360deg);opacity:0}}'
  + '@keyframes db-icon-enter{0%{transform:scale(0) rotate(-20deg);opacity:0}60%{transform:scale(1.15) rotate(3deg);opacity:1}100%{transform:scale(1) rotate(0deg);opacity:1}}'
  + '@keyframes db-panel-in{0%{transform:scale' + pd.axis + '(0.92) scale' + (pd.axis==='Y'?'X':'Y') + '(0.95);opacity:0}100%{transform:scale' + pd.axis + '(1) scale' + (pd.axis==='Y'?'X':'Y') + '(1);opacity:1}}'
  + '@keyframes db-pulse-ring{0%{transform:scale(1);opacity:0.5}100%{transform:scale(1.8);opacity:0}}'
  + ':host{all:initial;font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}'
  + '*{box-sizing:border-box;margin:0;padding:0}'
  + '.db-wrap{'
  +   '--db-accent:'+cfg.accent+';'
  +   '--db-glow:rgba('+hexToRgb(cfg.accent)+',0.35);'
  +   '--db-bg:rgba('+(dark?'0,0,0':'245,245,245')+','+bgA+');'
  +   '--db-fg:'+(dark?'#ffffff':'#0a0a0a')+';'
  +   '--db-muted:'+(dark?'rgba(255,255,255,0.45)':'rgba(0,0,0,0.45)')+';'
  +   '--db-border:rgba('+(dark?'255,255,255':'0,0,0')+','+brdA+');'
  +   '--db-card-bg:'+(dark?'rgba(8,8,12,0.95)':'rgba(255,255,255,0.95)')+';'
  +   '--db-hover-bg:'+(dark?'rgba(255,255,255,0.05)':'rgba(0,0,0,0.03)')+';'
  +   'pointer-events:auto;position:relative;'
  +   animWrap
  + '}'
  + '.db-badge{'
  +   'display:flex;align-items:center;gap:'+sz.gap+'px;padding:'+sz.pad+';'
  +   'background:var(--db-bg);'
  +   'backdrop-filter:blur('+blur+'px) saturate('+sat+');-webkit-backdrop-filter:blur('+blur+'px) saturate('+sat+');'
  +   'border:1px solid var(--db-border);border-radius:'+rad+'px;'
  +   'cursor:pointer;user-select:none;position:relative;overflow:visible;'
  +   'transition:transform 0.5s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.4s ease;'
  +   'animation:db-breathe 3.5s ease-in-out '+(cfg.delay+700)+'ms infinite;'
  +   'will-change:transform;text-decoration:none;outline:none;'
  + '}'
  + '.db-badge:hover{transform:scale(1.08);box-shadow:0 8px 40px -4px var(--db-glow),0 0 30px -4px var(--db-glow);animation-play-state:paused}'
  + '.db-badge:active{transform:scale(0.96);transition-duration:0.12s}'
  + '.db-badge img.db-icon{width:'+sz.icon+'px;height:'+sz.icon+'px;border-radius:'+(rad > 20 ? '50%' : rad+'px')+';object-fit:cover;flex-shrink:0;'
  +   'border:2px solid rgba(255,255,255,0.15);box-shadow:0 0 16px -4px var(--db-glow);'
  +   'transition:transform 0.5s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.4s ease;}'
  + '.db-badge:hover img.db-icon{transform:rotate(15deg) scale(1.12);box-shadow:0 0 20px 0 var(--db-glow)}'
  + '.db-text{display:flex;flex-direction:column;line-height:1.2;white-space:nowrap}'
  + '.db-label{font-size:'+sz.label+'px;font-weight:500;color:var(--db-muted);letter-spacing:0.5px;text-transform:uppercase;transition:color 0.3s ease}'
  + '.db-brand{font-size:'+sz.brand+'px;font-weight:700;color:var(--db-fg);letter-spacing:-0.2px;transition:color 0.3s ease}'
  + '.db-badge:hover .db-brand{color:var(--db-accent)}'
  + '.db-chevron{width:'+sz.chev+'px;height:'+sz.chev+'px;color:var(--db-muted);margin-left:2px;flex-shrink:0;'
  +   'transition:transform 0.4s cubic-bezier(0.34,1.56,0.64,1),color 0.3s ease}'
  + '.db-badge:hover .db-chevron{color:var(--db-accent);transform:translateX(2px)}'
  + '.db-wrap.expanded .db-chevron{transform:rotate(180deg)!important}'
  + '.db-sparkle-box{position:absolute;top:50%;left:50%;width:0;height:0;pointer-events:none;z-index:10}'
  + '.db-sparkle{position:absolute;width:6px;height:6px;background:var(--db-accent);border-radius:50%;'
  +   'animation:db-sparkle 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards;pointer-events:none}'
  + '.db-sparkle.star{width:8px;height:8px;clip-path:polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)}'
  + '.db-pulse-ring{position:absolute;top:-2px;left:-2px;right:-2px;bottom:-2px;border-radius:'+(rad+2)+'px;border:2px solid var(--db-accent);opacity:0;pointer-events:none}'
  + '.db-wrap:not(.expanded) .db-pulse-ring{animation:db-pulse-ring 2.5s ease-out '+(cfg.delay+2000)+'ms infinite}'
  /* Dismiss button */
  + '.db-dismiss{position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;'
  +   'background:var(--db-card-bg);border:1px solid var(--db-border);color:var(--db-muted);'
  +   'display:flex;align-items:center;justify-content:center;cursor:pointer;'
  +   'opacity:0;transform:scale(0.5);transition:opacity 0.2s,transform 0.3s cubic-bezier(0.34,1.56,0.64,1),color 0.2s;z-index:5;}'
  + '.db-badge:hover .db-dismiss{opacity:1;transform:scale(1)}'
  + '.db-dismiss:hover{color:#f472b6;border-color:rgba(244,114,182,0.3)}'
  + '.db-dismiss svg{width:10px;height:10px}'
  /* Panel */
  + '.db-panel{position:absolute;'+pdAnchors[0]+';'+pdAnchors[1]+';'+pdAnchors[2]+';'+pdAnchors[3]+';width:'+sz.panelW+'px;'
  +   'background:var(--db-card-bg);'
  +   'backdrop-filter:blur('+panelBlur+'px) saturate('+panelSat+');-webkit-backdrop-filter:blur('+panelBlur+'px) saturate('+panelSat+');'
  +   'border:1px solid var(--db-border);border-radius:'+(rad > 20 ? 20 : rad+4)+'px;padding:'+sz.panelPad+'px;'
  +   'opacity:0;visibility:hidden;transform-origin:'+pd.origin+';'
  +   'transform:scale'+pd.axis+'(0.92) scale'+(pd.axis==='Y'?'X':'Y')+'(0.95) translate'+pd.axis+'(8px);'
  +   'transition:opacity 0.35s cubic-bezier(0.34,1.56,0.64,1),transform 0.4s cubic-bezier(0.34,1.56,0.64,1),visibility 0s 0.35s;'
  +   'pointer-events:none;'
  +   'box-shadow:0 20px 60px -12px rgba(0,0,0,'+(dark?'0.8':'0.15')+'),0 0 40px -8px var(--db-glow);'
  + '}'
  + '.db-wrap.expanded .db-panel{'
  +   'opacity:1;visibility:visible;transform:scale'+pd.axis+'(1) scale'+(pd.axis==='Y'?'X':'Y')+'(1) translate'+pd.axis+'(0);'
  +   'transition:opacity 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.05s,transform 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.05s,visibility 0s 0s;'
  +   'pointer-events:auto;'
  +   'animation:db-panel-in 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.05s both;'
  + '}'
  + '.db-panel-header{display:flex;align-items:center;gap:10px;margin-bottom:14px;padding-bottom:12px;border-bottom:1px solid var(--db-border)}'
  + '.db-panel-header img{width:40px;height:40px;border-radius:12px;object-fit:cover;border:2px solid rgba(255,255,255,0.12)}'
  + '.db-panel-title{font-size:15px;font-weight:700;color:var(--db-fg)}'
  + '.db-panel-sub{font-size:11px;color:var(--db-muted);margin-top:1px}'
  + '.db-social-list{display:flex;flex-direction:column;gap:4px}'
  + '.db-social-link{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:12px;'
  +   'color:var(--db-fg);text-decoration:none;font-size:13px;font-weight:500;'
  +   'transition:background 0.25s ease,transform 0.35s cubic-bezier(0.34,1.56,0.64,1),color 0.25s ease;'
  +   'opacity:0;transform:translate'+pd.axis+'(-10px) scale(0.9);'
  + '}'
  + '.db-wrap.expanded .db-social-link{opacity:1;transform:translate'+pd.axis+'(0) scale(1)}'
  + '.db-wrap.expanded .db-social-link:nth-child(1){transition-delay:0.08s;animation:db-icon-enter 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.08s both}'
  + '.db-wrap.expanded .db-social-link:nth-child(2){transition-delay:0.14s;animation:db-icon-enter 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.14s both}'
  + '.db-wrap.expanded .db-social-link:nth-child(3){transition-delay:0.20s;animation:db-icon-enter 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.20s both}'
  + '.db-wrap.expanded .db-social-link:nth-child(4){transition-delay:0.26s;animation:db-icon-enter 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.26s both}'
  + '.db-wrap.expanded .db-social-link:nth-child(5){transition-delay:0.32s;animation:db-icon-enter 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.32s both}'
  + '.db-social-link:hover{background:var(--db-hover-bg);transform:translate'+pd.axis+'(4px) scale(1.02)!important;color:var(--db-accent)}'
  + '.db-social-link:active{transform:translate'+pd.axis+'(2px) scale(0.97)!important;transition-duration:0.1s}'
  + '.db-social-link svg{width:18px;height:18px;flex-shrink:0;transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1)}'
  + '.db-social-link:hover svg{transform:scale(1.2) rotate(-5deg)}'
  + '.db-panel-footer{margin-top:12px;padding-top:10px;border-top:1px solid var(--db-border);'
  +   'text-align:center;font-size:10px;color:var(--db-muted);opacity:0;transform:translateY(6px);'
  +   'transition:opacity 0.3s ease 0.35s,transform 0.3s ease 0.35s}'
  + '.db-wrap.expanded .db-panel-footer{opacity:0.6;transform:translateY(0)}'
  + '@media(max-width:480px){.db-panel{width:220px;padding:14px}.db-label{font-size:9px}.db-brand{font-size:13px}}'
  + '@media(prefers-reduced-motion:reduce){'
  +   '.db-wrap,.db-badge,.db-panel,.db-social-link,.db-sparkle,.db-pulse-ring{animation:none!important;transition-duration:0.01s!important}'
  +   '.db-wrap{opacity:1;transform:none}.db-panel{opacity:1;visibility:visible;transform:none}.db-social-link{opacity:1;transform:none}'
  + '}';
}

/* ── Container & Position Mode ───────────────── */
var _container = cfg._appendTo ? document.querySelector(cfg._appendTo) : null;
var _posMode = _container ? 'absolute' : 'fixed';

/* ── Load Font ──────────────────────────────── */
(function(){
  var fid = 'db-inter-font';
  if (!document.getElementById(fid)) {
    var lk = document.createElement('link');
    lk.id = fid;
    lk.rel = 'stylesheet';
    lk.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    document.head.appendChild(lk);
  }
})();

/* ── Create Host ─────────────────────────────── */
var _prev = document.getElementById('devvyy-badge-root');
if (_prev) _prev.remove();

var host = document.createElement('div');
host.id = 'devvyy-badge-root';
var hostPos = posCss[0] ? posCss[0] : '';
var hostPos2 = posCss[1] ? posCss[1] : '';
var hostPos3 = posCss[2] ? posCss[2] : '';
var hostPos4 = posCss[3] ? posCss[3] : '';
host.style.cssText = 'all:initial;position:'+_posMode+';z-index:999999;'+hostPos+';'+hostPos2+';'+hostPos3+';'+hostPos4+'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;pointer-events:none;transition:opacity 0.4s ease;';
(_container || document.body).appendChild(host);

/* ── Shadow DOM ──────────────────────────────── */
var shadow = host.attachShadow({ mode: 'closed' });

/* ── Style Element ───────────────────────────── */
var style = document.createElement('style');
style.textContent = buildCSS(currentTheme);
shadow.appendChild(style);

/* ── Build DOM ───────────────────────────────── */
var wrap = document.createElement('div');
wrap.className = 'db-wrap';

var badge = document.createElement('a');
badge.className = 'db-badge';
badge.href = cfg.url;
badge.target = '_blank';
badge.rel = 'noopener noreferrer';
badge.setAttribute('aria-label', cfg.brand + ' - ' + cfg.label);

var iconSrc = cfg.logo || FAVICON;
var icon = document.createElement('img');
icon.className = 'db-icon';
icon.src = iconSrc;
icon.alt = '';
icon.draggable = false;

var text = document.createElement('span');
text.className = 'db-text';
var labelEl = document.createElement('span');
labelEl.className = 'db-label';
labelEl.textContent = cfg.label;
var brandEl = document.createElement('span');
brandEl.className = 'db-brand';
brandEl.textContent = cfg.brand;
text.appendChild(labelEl);
text.appendChild(brandEl);

var chevron = document.createElement('span');
chevron.className = 'db-chevron';
chevron.innerHTML = ICONS.chevron;

badge.appendChild(icon);
badge.appendChild(text);
badge.appendChild(chevron);

/* Dismiss button */
if (cfg.showDismiss) {
  var dismissBtn = document.createElement('span');
  dismissBtn.className = 'db-dismiss';
  dismissBtn.innerHTML = ICONS.dismiss;
  dismissBtn.title = 'Dismiss';
  dismissBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    host.style.opacity = '0';
    setTimeout(function() { host.remove(); }, 400);
  });
  badge.appendChild(dismissBtn);
}

var pulseRing = document.createElement('div');
pulseRing.className = 'db-pulse-ring';
var sparkleBox = document.createElement('div');
sparkleBox.className = 'db-sparkle-box';

var panel = document.createElement('div');
panel.className = 'db-panel';

var panelHeader = document.createElement('div');
panelHeader.className = 'db-panel-header';
var panelIcon = document.createElement('img');
panelIcon.src = iconSrc;
panelIcon.alt = '';
var panelTitleWrap = document.createElement('div');
var panelTitle = document.createElement('div');
panelTitle.className = 'db-panel-title';
panelTitle.textContent = cfg.brand;
var panelSub = document.createElement('div');
panelSub.className = 'db-panel-sub';
panelSub.textContent = 'Developer & Creator';
panelTitleWrap.appendChild(panelTitle);
panelTitleWrap.appendChild(panelSub);
panelHeader.appendChild(panelIcon);
panelHeader.appendChild(panelTitleWrap);

var socialList = document.createElement('div');
socialList.className = 'db-social-list';

var socialEntries = [];
if (cfg.socials.website) socialEntries.push({key:'website',label:'Website',url:cfg.socials.website,icon:ICONS.website});
if (cfg.socials.github)  socialEntries.push({key:'github',label:'GitHub',url:cfg.socials.github,icon:ICONS.github});
if (cfg.socials.twitter) socialEntries.push({key:'twitter',label:'X / Twitter',url:cfg.socials.twitter,icon:ICONS.twitter});
if (cfg.socials.discord) socialEntries.push({key:'discord',label:'Discord',url:cfg.socials.discord,icon:ICONS.discord});

for (var i = 0; i < socialEntries.length; i++) {
  var entry = socialEntries[i];
  var link = document.createElement('a');
  link.className = 'db-social-link';
  link.href = entry.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.innerHTML = entry.icon + '<span>' + entry.label + '</span>';
  socialList.appendChild(link);
}

var panelFooter = document.createElement('div');
panelFooter.className = 'db-panel-footer';
panelFooter.textContent = 'Built with love';

panel.appendChild(panelHeader);
panel.appendChild(socialList);
panel.appendChild(panelFooter);

wrap.appendChild(pulseRing);
wrap.appendChild(badge);
wrap.appendChild(sparkleBox);
wrap.appendChild(panel);
shadow.appendChild(wrap);

/* ── Sparkle Effect ──────────────────────────── */
function emitSparkles(cx, cy) {
  if (!cfg.showSparkles) return;
  for (var i = 0; i < 4; i++) {
    var s = document.createElement('div');
    s.className = 'db-sparkle' + (Math.random() > 0.5 ? ' star' : '');
    var angle = Math.random() * Math.PI * 2;
    var dist = 20 + Math.random() * 25;
    var x = Math.cos(angle) * dist;
    var y = Math.sin(angle) * dist;
    s.style.left = cx + 'px';
    s.style.top = cy + 'px';
    s.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(0)';
    s.style.animationDelay = (Math.random() * 0.12) + 's';
    sparkleBox.appendChild(s);
    (function(el){ setTimeout(function(){ el.remove(); }, 900); })(s);
  }
}

/* ── Events ──────────────────────────────────── */
var isExpanded = false;

badge.addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  isExpanded = !isExpanded;
  if (isExpanded) wrap.classList.add('expanded');
  else wrap.classList.remove('expanded');
});

badge.addEventListener('mouseenter', function(e) {
  var rect = badge.getBoundingClientRect();
  emitSparkles(e.clientX - rect.left, e.clientY - rect.top);
});

badge.addEventListener('mousemove', function() {
  if (Math.random() > 0.75) {
    var rect = badge.getBoundingClientRect();
    emitSparkles(rect.width / 2, rect.height / 2);
  }
});

var _clickRoot = _container || document;
_clickRoot.addEventListener('click', function(e) {
  if (isExpanded) {
    if (!host.contains(e.target)) {
      isExpanded = false;
      wrap.classList.remove('expanded');
    }
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && isExpanded) {
    isExpanded = false;
    wrap.classList.remove('expanded');
  }
});

/* ── Auto-hide Timer ────────────────────────── */
if (cfg.autoHide && cfg.autoHide > 0) {
  setTimeout(function() {
    host.style.opacity = '0';
    setTimeout(function() { host.remove(); }, 400);
  }, cfg.autoHide);
}

/* ── Theme Change Listener ───────────────────── */
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    currentTheme = e.matches ? 'dark' : 'light';
    style.textContent = buildCSS(currentTheme);
  });
}

})();
"""

# ── Replace favicon placeholder ──
JS = JS.replace('FAVICON_PLACEHOLDER', FAVICON_B64)

# ── Write output ──
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, 'w') as f:
    f.write(JS)

print(f"Built {OUT} ({len(JS)} bytes)")