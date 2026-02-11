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
    .popup__text,
    .popup__text:link,
    .popup__text:visited,
    .popup__text:active,
    .popup__text:hover,
    .popup__text:focus {
      text-decoration: none !important;
      color: #1a1a1a !important;
    }
    .popup {
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
    .popup__icon {
      display: flex;
      align-items: center;
      margin-right: 10px;
    }
    .popup__icon img {
      width: 60px;
      height: 60px;
      display: block;
    }
    .popup:hover {
      box-shadow: 0 6px 28px rgba(0,0,0,0.18);
      transform: translateY(-2px) scale(1.04);
      cursor: pointer;
    }
    .popup, .popup:visited, .popup:active {
      color: #1a1a1a;
      text-decoration: none;
    }
  `;
  document.head.appendChild(style);

  // Create popup
  var popup = document.createElement('div');
  popup.className = 'popup';
  popup.innerHTML = `
    <span class="popup__icon" style="display: flex; align-items: center; margin-right: 20px;">
      <img src="logo.png" alt="Devvyyxyz Logo" style="width: 44px; height: 44px; display: block;" />
    </span>
    <span class="popup__text" style="font-family: 'Montserrat', Arial, sans-serif; font-size: 20px; font-weight: 700; color: #1a1a1a;">Made by Devvyyxyz</span>
  `;
  popup.style.cursor = 'pointer';
  popup.tabIndex = 0;
  popup.setAttribute('role', 'link');
  popup.setAttribute('aria-label', 'Made by Devvyyxyz, link to devvyy.xyz');
  popup.addEventListener('click', function(e) {
    window.open('https://devvyy.xyz', '_blank', 'noopener');
  });
  popup.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      window.open('https://devvyy.xyz', '_blank', 'noopener');
    }
  });
  document.body.appendChild(popup);
});
