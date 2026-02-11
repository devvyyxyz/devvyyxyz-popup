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
      color: #1a1a1a !important;
    }
    .dvxyz-popup {
      position: fixed;
      right: 36px;
      bottom: 36px;
      display: flex;
      align-items: center;
      background: #fff;
      border: 4px solid #2196f3;
      box-shadow: 0 4px 20px rgba(0,0,0,0.13);
      border-radius: 16px;
      padding: 12px 28px 12px 18px;
      font-family: 'Montserrat', Arial, sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #1a1a1a;
      text-decoration: none;
      z-index: 9999;
      transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
    }
    .dvxyz-popup__icon {
      display: flex;
      align-items: center;
      margin-right: 10px;
    }
    .dvxyz-popup__icon img {
      width: 60px;
      height: 60px;
      display: block;
    }
    .dvxyz-popup__text {
      margin-right: 12px;
    }
    .dvxyz-popup__close {
      background: none;
      border: none;
      color: #888;
      font-size: 32px;
      font-weight: bold;
      cursor: pointer;
      padding: 0 6px;
      line-height: 1;
      border-radius: 4px;
      transition: background 0.2s, color 0.2s;
      align-self: center;
    }
    .dvxyz-popup__close:hover, .dvxyz-popup__close:focus {
      color: #2196f3;
      background: #e3f2fd;
      outline: none;
    }
    .dvxyz-popup, .dvxyz-popup:visited, .dvxyz-popup:active {
      color: #1a1a1a;
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
