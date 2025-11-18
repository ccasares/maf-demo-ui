/**
 * Convert hex color to HSL
 * @param {string} hex - Hex color code (e.g., '#0073e6')
 * @returns {object} - HSL values {h, s, l}
 */
export function hexToHSL(hex) {
  // Remove # if present
  hex = hex.replace('#', '')
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255
  const g = parseInt(hex.substring(2, 4), 16) / 255
  const b = parseInt(hex.substring(4, 6), 16) / 255
  
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  
  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  }
}

/**
 * Convert HSL to hex color
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} - Hex color code
 */
export function hslToHex(h, s, l) {
  s /= 100
  l /= 100
  
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = l - c / 2
  let r = 0, g = 0, b = 0
  
  if (0 <= h && h < 60) {
    r = c; g = x; b = 0
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x
  }
  
  const toHex = (val) => {
    const hex = Math.round((val + m) * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Generate a complete color scheme based on a base color
 * @param {string} baseColor - Base hex color
 * @returns {object} - Color scheme with all variables
 */
export function generateColorScheme(baseColor) {
  if (!baseColor || !baseColor.startsWith('#')) {
    return null
  }
  
  const hsl = hexToHSL(baseColor)
  
  // Generate color variations
  const scheme = {
    // Primary colors - based on base color
    primaryColor: hslToHex(hsl.h, Math.min(hsl.s, 80), Math.max(hsl.l - 10, 40)),
    secondaryColor: hslToHex(hsl.h, Math.min(hsl.s, 90), Math.max(hsl.l, 50)),
    accentColor: baseColor,
    accentHover: hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 10, 70)),
    
    // Background colors - darker versions with lower saturation
    bgPrimary: hslToHex(hsl.h, Math.min(hsl.s * 0.4, 30), 8),
    bgSecondary: hslToHex(hsl.h, Math.min(hsl.s * 0.5, 35), 15),
    bgTertiary: hslToHex(hsl.h, Math.min(hsl.s * 0.6, 40), 22),
    
    // Message colors
    messageOwn: hslToHex(hsl.h, Math.min(hsl.s * 0.8, 70), 35),
    messageOther: hslToHex(hsl.h, Math.min(hsl.s * 0.4, 30), 18),
    
    // Border color
    borderColor: hslToHex(hsl.h, Math.min(hsl.s * 0.6, 50), 30),
    
    // Text colors remain light for contrast
    textPrimary: '#E3F2FD',
    textSecondary: hslToHex(hsl.h, 60, 75),
    
    // Error color (keep reddish)
    errorColor: '#e74c3c'
  }
  
  return scheme
}

/**
 * Apply color scheme to CSS variables
 * @param {object} scheme - Color scheme object
 */
export function applyColorScheme(scheme) {
  if (!scheme) return
  
  const root = document.documentElement
  
  root.style.setProperty('--primary-color', scheme.primaryColor)
  root.style.setProperty('--secondary-color', scheme.secondaryColor)
  root.style.setProperty('--accent-color', scheme.accentColor)
  root.style.setProperty('--accent-hover', scheme.accentHover)
  root.style.setProperty('--bg-primary', scheme.bgPrimary)
  root.style.setProperty('--bg-secondary', scheme.bgSecondary)
  root.style.setProperty('--bg-tertiary', scheme.bgTertiary)
  root.style.setProperty('--text-primary', scheme.textPrimary)
  root.style.setProperty('--text-secondary', scheme.textSecondary)
  root.style.setProperty('--message-own', scheme.messageOwn)
  root.style.setProperty('--message-other', scheme.messageOther)
  root.style.setProperty('--border-color', scheme.borderColor)
  root.style.setProperty('--error-color', scheme.errorColor)
}

/**
 * Reset color scheme to default
 */
export function resetColorScheme() {
  const root = document.documentElement
  
  root.style.removeProperty('--primary-color')
  root.style.removeProperty('--secondary-color')
  root.style.removeProperty('--accent-color')
  root.style.removeProperty('--accent-hover')
  root.style.removeProperty('--bg-primary')
  root.style.removeProperty('--bg-secondary')
  root.style.removeProperty('--bg-tertiary')
  root.style.removeProperty('--text-primary')
  root.style.removeProperty('--text-secondary')
  root.style.removeProperty('--message-own')
  root.style.removeProperty('--message-other')
  root.style.removeProperty('--border-color')
  root.style.removeProperty('--error-color')
}

