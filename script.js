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
      max-width: 340px;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 180px;
      padding: 0;
      margin: 0;
      line-height: 1;
    }
    .dvxyz-popup__close {
      background: none;
      border: none;
      color: #bdbdbd;
      font-size: 22px;
      font-weight: 700;
      cursor: pointer;
      padding: 0 0 0 16px;
      line-height: 1;
      border-radius: 3px;
      transition: background 0.13s, color 0.13s;
      align-self: center;
      outline: none;
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
