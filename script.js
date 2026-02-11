// Popup script for Devvyyxyz
window.addEventListener('DOMContentLoaded', function() {
    // Inject Font Awesome for icons if not already present
    if (!document.querySelector('link[href*="font-awesome"]')) {
      var faLink = document.createElement('link');
      faLink.rel = 'stylesheet';
      faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
      document.head.appendChild(faLink);
    }
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
      animation: dvxyz-bounce-in 0.7s cubic-bezier(.68,-0.55,.27,1.55) !important;
      position: fixed !important;
      right: 24px !important;
      bottom: 24px !important;
      display: flex !important;
      align-items: center !important;
      background: #fff !important;
      border: 1.5px solid #e7eaf3 !important;
      box-shadow: 0 4px 24px 0 rgba(50,50,93,0.13), 0 2px 8px 0 rgba(0,0,0,0.10) !important;
      border-radius: 10px !important;
      padding: 0 28px 0 18px !important;
      height: 54px !important;
      font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif !important;
      font-size: 18px !important;
      font-weight: 600 !important;
      color: #3d3d3d !important;
      text-decoration: none !important;
      z-index: 9999 !important;
      transition: box-shadow 0.16s, border-color 0.13s, background 0.13s !important;
      min-width: 0 !important;
      max-width: 420px !important;
      cursor: pointer !important;
      gap: 12px !important;
      box-sizing: border-box !important;
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
    .dvxyz-popup__text,
    .dvxyz-popup .dvxyz-popup__text {
      font-size: 18px !important;
      font-weight: 600 !important;
      color: #3d3d3d !important;
      font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif !important;
      white-space: normal !important;
      overflow: visible !important;
      text-overflow: unset !important;
      max-width: 220px !important;
      padding: 0 !important;
      margin: 0 !important;
      line-height: 1.2 !important;
      word-break: break-word !important;
      flex: 1 1 auto !important;
      letter-spacing: normal !important;
      text-transform: none !important;
    }
    .dvxyz-popup__iconbtn,
    .dvxyz-popup__iconbtn:link,
    .dvxyz-popup__iconbtn:visited,
    .dvxyz-popup__iconbtn:active,
    .dvxyz-popup__iconbtn:focus,
    .dvxyz-popup__iconbtn:hover,
    .dvxyz-popup__iconbtn *,
    .dvxyz-popup__iconbtn:link *,
    .dvxyz-popup__iconbtn:visited *,
    .dvxyz-popup__iconbtn:active *,
    .dvxyz-popup__iconbtn:focus *,
    .dvxyz-popup__iconbtn:hover * {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: none !important;
      border: none !important;
      color: #24292f;
      font-size: 17px;
      border-radius: 5px;
      width: 32px;
      height: 32px;
      margin: 0 6px 0 0;
      cursor: pointer;
      text-decoration: none !important;
      transition: background 0.13s, border-color 0.13s;
      outline: none;
      padding: 0;
    }
    .dvxyz-popup__iconbtn:last-of-type {
      margin-right: 0;
    }
    .dvxyz-popup__iconbtn:hover, .dvxyz-popup__iconbtn:focus {
      background: none !important;
      border: none !important;
      text-decoration: none;
    }
    .dvxyz-popup__iconbtn i {
      font-size: 18px;
      color: #24292f;
      display: inline-block;
      vertical-align: middle;
      width: 18px;
      height: 18px;
      line-height: 18px;
      text-align: center;
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
    <a class="dvxyz-popup__iconbtn" href="https://github.com/devvyyxyz" target="_blank" rel="noopener" aria-label="GitHub"><i class="fab fa-github"></i></a>
    <a class="dvxyz-popup__iconbtn" href="https://portfolio.devvyy.xyz" target="_blank" rel="noopener" aria-label="Portfolio"><i class="fas fa-briefcase"></i></a>
    <a class="dvxyz-popup__iconbtn" href="https://tools-list.devvyy.xyz" target="_blank" rel="noopener" aria-label="Tools List"><i class="fas fa-toolbox"></i></a>
    <button class="dvxyz-popup__close" aria-label="Close popup">&times;</button>
  `;
  // Remove all inline styles for a clean Webflow look
  popup.style.cursor = 'pointer';
  popup.tabIndex = 0;
  popup.setAttribute('role', 'link');
  popup.setAttribute('aria-label', 'Made by Devvyyxyz, link to devvyy.xyz');
  popup.addEventListener('click', function(e) {
    // Don't trigger link if close button or GitHub button is clicked
    if (
      e.target.classList.contains('dvxyz-popup__close') ||
      e.target.classList.contains('dvxyz-popup__iconbtn') ||
      (e.target.closest && e.target.closest('.dvxyz-popup__iconbtn'))
    ) {
      return;
    }
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
