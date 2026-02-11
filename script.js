// Popup script for Devvyyxyz
window.addEventListener('DOMContentLoaded', function() {
  // Use system font for Webflow style

  // Inject popup CSS
  var style = document.createElement('style');
  style.textContent = `
    @keyframes dvxyz-bounce-in {
      0% { opacity: 0; transform: translateY(60px) scale(0.9); }
      60% { opacity: 1; transform: translateY(-10px) scale(1.05); }
      80% { transform: translateY(4px) scale(0.98); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    @keyframes dvxyz-bounce-out-right {
      0% { opacity: 1; transform: translateX(0) scale(1); }
      30% { opacity: 1; transform: translateX(20px) scale(1.05); }
      100% { opacity: 0; transform: translateX(400px) scale(0.8); }
    }
    .dvxyz-popup {
      animation: dvxyz-bounce-in 0.7s cubic-bezier(.68,-0.55,.27,1.55);
      position: fixed;
      right: 24px;
      bottom: 24px;
      display: flex;
      align-items: center;
      background: #fff;
      border: 1.5px solid #e7eaf3;
      box-shadow: 0 4px 24px 0 rgba(50,50,93,0.13), 0 2px 8px 0 rgba(0,0,0,0.10);
      border-radius: 10px;
      padding: 0 28px 0 18px;
      height: 54px;
      font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: #3d3d3d;
      text-decoration: none;
      z-index: 9999;
      transition: box-shadow 0.16s, border-color 0.13s, background 0.13s;
      min-width: 0;
      max-width: 420px;
      cursor: pointer;
      gap: 12px;
    }
    .dvxyz-popup:hover, .dvxyz-popup:focus-within {
      box-shadow: 0 8px 32px 0 rgba(50,50,93,0.16), 0 4px 16px 0 rgba(0,0,0,0.13);
      border-color: #bdbdbd;
      background: #f8fafd;
    }
    .dvxyz-popup:active {
      box-shadow: 0 1px 4px rgba(50,50,93,0.07), 0 1px 2px rgba(0,0,0,0.05);
      border-color: #e7eaf3;
      background: #fff;
    }
    .dvxyz-popup__icon {
      display: flex;
      align-items: center;
      margin-right: 8px;
      border-radius: 6px;
      padding: 3px;
    }
    .dvxyz-popup__icon img {
      width: 38px;
      height: 38px;
      display: block;
      border-radius: 4px;
    }
    .dvxyz-popup__text {
      font-size: 18px;
      font-weight: 600;
      color: #3d3d3d;
      white-space: normal;
      overflow: visible;
      text-overflow: unset;
      max-width: 220px;
      padding: 0;
      margin: 0;
      line-height: 1.2;
      word-break: break-word;
      flex: 1 1 auto;
    }
    .dvxyz-popup__github {
      display: inline-flex;
      align-items: center;
      background: #f5f5f5;
      border: 1px solid #e7eaf3;
      color: #24292f;
      font-size: 15px;
      font-weight: 600;
      border-radius: 5px;
      padding: 3px 10px 3px 8px;
      margin: 0 8px 0 0;
      cursor: pointer;
      text-decoration: none;
      transition: background 0.13s, border-color 0.13s;
      outline: none;
      gap: 5px;
    }
    .dvxyz-popup__github:hover, .dvxyz-popup__github:focus {
      background: #e7eaf3;
      border-color: #bdbdbd;
      text-decoration: none;
    }
    .dvxyz-popup__github svg {
      width: 18px;
      height: 18px;
      margin-right: 3px;
      fill: #24292f;
      display: inline-block;
      vertical-align: middle;
    }
    .dvxyz-popup__close,
    .dvxyz-popup__close:link,
    .dvxyz-popup__close:visited,
    .dvxyz-popup__close:active,
    .dvxyz-popup__close:focus {
      background: none !important;
      border: none !important;
      color: #bdbdbd !important;
      font-size: 22px !important;
      font-weight: 700 !important;
      cursor: pointer !important;
      padding: 0 0 0 16px !important;
      line-height: 1 !important;
      border-radius: 3px !important;
      transition: background 0.13s, color 0.13s !important;
      align-self: center !important;
      outline: none !important;
      box-shadow: none !important;
      text-decoration: none !important;
      appearance: none !important;
      -webkit-appearance: none !important;
      -moz-appearance: none !important;
    }
    /* No hover/focus effect for close button */
    .dvxyz-popup, .dvxyz-popup:visited, .dvxyz-popup:active {
      color: #3d3d3d;
      text-decoration: none;
    }
  `;
  document.head.appendChild(style);

  // Create popup
  var popup = document.createElement('div');
  popup.className = 'dvxyz-popup';
  popup.innerHTML = `
    <span class="dvxyz-popup__icon"><img src="https://raw.githubusercontent.com/devvyyxyz/devvyyxyz-popup/refs/heads/main/logo.png" alt="Devvyyxyz Logo" /></span>
    <span class="dvxyz-popup__text">Made by Devvyyxyz</span>
    <a class="dvxyz-popup__github" href="https://github.com/devvyyxyz" target="_blank" rel="noopener" aria-label="Visit GitHub">
      <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0.198242C3.58 0.198242 0 3.77824 0 8.19824C0 11.6382 2.29 14.4382 5.47 15.4982C5.87 15.5682 6.02 15.3382 6.02 15.1382C6.02 14.9582 6.01 14.3382 6.01 13.6382C4 14.0382 3.48 12.8982 3.48 12.8982C3.13 12.0382 2.63 11.7982 2.63 11.7982C1.87 11.2782 2.69 11.2882 2.69 11.2882C3.54 11.3482 3.98 12.1582 3.98 12.1582C4.73 13.3982 5.96 13.0382 6.41 12.8382C6.48 12.3382 6.68 11.9982 6.91 11.7982C5.04 11.5982 3.07 10.8982 3.07 7.77824C3.07 6.87824 3.39 6.15824 3.94 5.57824C3.85 5.37824 3.57 4.52824 4.03 3.39824C4.03 3.39824 4.71 3.18824 6.01 4.05824C6.65 3.87824 7.34 3.78824 8.03 3.78824C8.72 3.78824 9.41 3.87824 10.05 4.05824C11.35 3.18824 12.03 3.39824 12.03 3.39824C12.49 4.52824 12.21 5.37824 12.12 5.57824C12.67 6.15824 13 6.87824 13 7.77824C13 10.9082 11.03 11.5982 9.16 11.7882C9.45 12.0282 9.7 12.5182 9.7 13.2582C9.7 14.2582 9.69 14.9382 9.69 15.1382C9.69 15.3382 9.84 15.5782 10.25 15.4982C13.43 14.4382 15.72 11.6382 15.72 8.19824C15.72 3.77824 12.14 0.198242 8 0.198242Z"/></svg>
      GitHub
    </a>
    <button class="dvxyz-popup__close" aria-label="Close popup">&times;</button>
  `;
  // Remove all inline styles for a clean Webflow look
  popup.style.cursor = 'pointer';
  popup.tabIndex = 0;
  popup.setAttribute('role', 'link');
  popup.setAttribute('aria-label', 'Made by Devvyyxyz, link to devvyy.xyz');
  popup.addEventListener('click', function(e) {
    // Don't trigger link if close button is clicked
    if (e.target.classList.contains('dvxyz-popup__close')) return;
    window.open('https://devvyy.xyz', '_blank', 'noopener');
  });
  popup.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      window.open('https://devvyy.xyz', '_blank', 'noopener');
    }
  });
  // Add close button handler
  popup.querySelector('.dvxyz-popup__close').addEventListener('click', function(ev) {
    ev.stopPropagation();
    popup.style.animation = 'dvxyz-bounce-out-right 0.6s cubic-bezier(.68,-0.55,.27,1.55) forwards';
    setTimeout(function() {
      if (popup.parentNode) popup.parentNode.removeChild(popup);
    }, 600);
  });
  document.body.appendChild(popup);
});
