export function rippleEffect(event) {
  const btn = event.currentTarget;
  
  // Get button's position relative to viewport
  const rect = btn.getBoundingClientRect();
  
  const circle = document.createElement("span");
  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
  const radius = diameter / 2;

  // Calculate click position relative to the button
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${x - radius}px`;
  circle.style.top = `${y - radius}px`;
  circle.classList.add("ripple");

  const ripple = btn.getElementsByClassName("ripple")[0];

  if (ripple) {
    ripple.remove();
  }

  btn.appendChild(circle);
}

const rippleStyle = `
  .ripple {
    position: absolute;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;  /* Add this to prevent interference with clicks */
  }

  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .ripple-container {
    position: relative;
    overflow: hidden;
    cursor: pointer;  /* Add this to ensure cursor shows pointer */
  }
`;

// Inject the ripple styles dynamically into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = rippleStyle;
document.head.appendChild(styleSheet); 
