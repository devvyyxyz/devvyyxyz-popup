// Popup script for Devvyyxyz
window.addEventListener('DOMContentLoaded', function() {
  // Inject Google Fonts
  var fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700&display=swap';
  document.head.appendChild(fontLink);

  // Inject popup CSS
  var style = document.createElement('style');
  style.textContent = `
    .dvxyz-popup__text,
    .dvxyz-popup__text:link,
    .dvxyz-popup__text:visited,
    .dvxyz-popup__text:active,
    .dvxyz-popup__text:hover,
    .dvxyz-popup__text:focus {
      text-decoration: none !important;
      color: #222 !important;
      letter-spacing: 0.01em;
      text-shadow: 0 1px 2px rgba(0,0,0,0.07);
    }
    .dvxyz-popup {
      position: fixed;
      right: 36px;
      bottom: 36px;
      display: flex;
      align-items: center;
      background: rgba(255,255,255,0.75);
      border: 2.5px solid #2196f3;
      box-shadow: 0 8px 32px rgba(33,150,243,0.13), 0 2px 8px rgba(0,0,0,0.10);
      border-radius: 18px;
      padding: 14px 32px 14px 20px;
      font-family: 'Montserrat', Arial, sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #222;
      text-decoration: none;
      z-index: 9999;
      transition: box-shadow 0.22s, transform 0.18s, border-color 0.18s, background 0.18s;
      backdrop-filter: blur(8px) saturate(1.2);
      -webkit-backdrop-filter: blur(8px) saturate(1.2);
      overflow: hidden;
      gap: 10px;
    }
    .dvxyz-popup:hover, .dvxyz-popup:focus-within {
      box-shadow: 0 12px 40px rgba(33,150,243,0.18), 0 4px 16px rgba(0,0,0,0.13);
      border-color: #1769aa;
      background: rgba(255,255,255,0.92);
      transform: translateY(-2px) scale(1.025);
    }
    .dvxyz-popup:active {
      box-shadow: 0 4px 16px rgba(33,150,243,0.10), 0 1px 4px rgba(0,0,0,0.08);
      border-color: #2196f3;
      background: rgba(255,255,255,0.85);
      transform: scale(0.98);
    }
    .dvxyz-popup__icon {
      display: flex;
      align-items: center;
      margin-right: 10px;
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      border-radius: 12px;
      padding: 4px;
      box-shadow: 0 2px 8px rgba(33,150,243,0.07);
    }
    .dvxyz-popup__icon img {
      width: 54px;
      height: 54px;
      display: block;
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(33,150,243,0.10);
    }
    .dvxyz-popup__text {
      margin-right: 14px;
      font-size: 21px;
      font-weight: 700;
      color: #222;
      text-shadow: 0 1px 2px rgba(0,0,0,0.07);
    }
    .dvxyz-popup__close {
      background: rgba(33,150,243,0.08);
      border: none;
      color: #1769aa;
      font-size: 28px;
      font-weight: 900;
      cursor: pointer;
      padding: 2px 10px 2px 10px;
      line-height: 1;
      border-radius: 50%;
      transition: background 0.18s, color 0.18s, box-shadow 0.18s;
      align-self: center;
      box-shadow: 0 1px 4px rgba(33,150,243,0.10);
      outline: none;
      margin-left: 2px;
    }
    .dvxyz-popup__close:hover, .dvxyz-popup__close:focus {
      color: #fff;
      background: #2196f3;
      box-shadow: 0 2px 8px rgba(33,150,243,0.18);
      outline: none;
    }
    .dvxyz-popup, .dvxyz-popup:visited, .dvxyz-popup:active {
      color: #222;
      text-decoration: none;
    }
  `;
  document.head.appendChild(style);

  // Create popup
  var popup = document.createElement('div');
  popup.className = 'dvxyz-popup';
  popup.style.position = 'fixed';
  popup.style.right = '36px';
  popup.style.bottom = '36px';
  popup.style.display = 'flex';
  popup.style.alignItems = 'center';
  popup.style.background = '#fff';
  popup.style.border = '4px solid #2196f3';
  popup.style.boxShadow = '0 4px 20px rgba(0,0,0,0.13)';
  popup.style.borderRadius = '16px';
  popup.style.padding = '12px 28px 12px 18px';
  popup.style.fontFamily = "'Montserrat', Arial, sans-serif";
  popup.style.fontSize = '20px';
  popup.style.fontWeight = '700';
  popup.style.color = '#1a1a1a';
  popup.style.textDecoration = 'none';
  popup.style.zIndex = '9999';
  popup.style.transition = 'box-shadow 0.2s, transform 0.2s, border-color 0.2s';
  popup.style.position = 'fixed';
  popup.style.top = '';
  popup.style.left = '';
  popup.style.width = '';
  popup.style.height = '';
  popup.style.boxSizing = 'border-box';
  popup.innerHTML = `
    <span class="dvxyz-popup__icon" style="display: flex; align-items: center; margin-right: 10px;">
      <img src="https://raw.githubusercontent.com/devvyyxyz/devvyyxyz-popup/refs/heads/main/logo.png" alt="Devvyyxyz Logo" style="width: 60px; height: 60px; display: block;" />
    </span>
    <span class="dvxyz-popup__text" style="font-family: 'Montserrat', Arial, sans-serif; font-size: 20px; font-weight: 700; color: #1a1a1a; margin-right: 12px;">Made by Devvyyxyz</span>
    <button class="dvxyz-popup__close" aria-label="Close popup">&times;</button>
  `;
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
    popup.style.opacity = '0';
    setTimeout(function() {
      if (popup.parentNode) popup.parentNode.removeChild(popup);
    }, 250);
  });
  document.body.appendChild(popup);
});
