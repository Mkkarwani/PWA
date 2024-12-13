// Function to update the theme based on header's background color
function updateTheme() {
  // Select the <header> tag
  const header = document.querySelector('header');

  // Ensure the header exists
  if (!header) return;

  // Get the computed style of the header
  const headerStyle = window.getComputedStyle(header);
  const backgroundColor = headerStyle.backgroundColor;

  // Convert RGB to Hex if needed (for theme-color meta tag)
  function rgbToHex(rgb) {
    const result = rgb.match(/\d+/g)
      .slice(0, 3)
      .map((num) => parseInt(num).toString(16).padStart(2, '0'))
      .join('');
    return `#${result}`;
  }

  const themeColor = backgroundColor.startsWith('rgb') ? rgbToHex(backgroundColor) : backgroundColor;

  // Update the theme-color meta tag
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', themeColor);
  }

  // Optional: Adjust other UI elements for better visibility
  const isDark = themeColor.startsWith('#') && parseInt(themeColor.slice(1), 16) < 0x7fffff;
  document.body.style.color = isDark ? 'white' : 'black';
}

// Call the function on page load
window.addEventListener('DOMContentLoaded', updateTheme);

// Optional: Re-apply the theme if header background changes dynamically
const observer = new MutationObserver(updateTheme);
observer.observe(document.querySelector('header'), { attributes: true, attributeFilter: ['style'] });
