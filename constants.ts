
export interface Theme {
  id: string;
  label: string;
  cost: number;
  color: string; // Tailwind class for preview
  accent: string; // RGB values for CSS variables
}

export const THEMES: Theme[] = [
  { id: 'default', label: 'Nexus Blue', cost: 0, color: 'bg-blue-500', accent: '59 130 246' },
  { id: 'neon_pink', label: 'Cyber Pink', cost: 500, color: 'bg-pink-500', accent: '244 114 182' },
  { id: 'gold', label: 'Elite Gold', cost: 2000, color: 'bg-amber-500', accent: '251 191 36' },
  { id: 'cyber_ocean', label: 'Cyber Ocean', cost: 1500, color: 'bg-cyan-500', accent: '6 182 212' },
  { id: 'ruby', label: 'Crimson Red', cost: 1000, color: 'bg-rose-500', accent: '225 29 72' },
  { id: 'emerald', label: 'Digital Green', cost: 1000, color: 'bg-emerald-500', accent: '16 185 129' },
  { id: 'neon', label: 'Neon Pulse', cost: 1200, color: 'bg-fuchsia-500', accent: '255 0 255' },
  { id: 'matrix', label: 'Matrix', cost: 1800, color: 'bg-green-500', accent: '0 255 0' },
  { id: 'obsidian', label: 'Obsidian', cost: 3000, color: 'bg-slate-800', accent: '161 161 170' },
  { id: 'royal', label: 'Royal Purple', cost: 2500, color: 'bg-violet-600', accent: '139 92 246' },
  { id: 'mars', label: 'Planète Mars', cost: 1500, color: 'bg-orange-700', accent: '255 69 0' },
  { id: 'atlantis', label: 'Atlantis', cost: 2000, color: 'bg-teal-500', accent: '0 255 255' },
  { id: 'midnight', label: 'Minuit', cost: 1000, color: 'bg-slate-950', accent: '128 128 128' },
  { id: 'sakura', label: 'Sakura Zen', cost: 1200, color: 'bg-pink-200', accent: '255 183 197' },
  { id: 'arctic', label: 'Banquise', cost: 1300, color: 'bg-blue-100', accent: '200 230 255' },
  { id: 'jungle', label: 'Amazonie', cost: 1100, color: 'bg-green-800', accent: '34 139 34' },
  { id: 'sunset', label: 'Coucher de Soleil', cost: 1400, color: 'bg-orange-500', accent: '255 140 0' },
  { id: 'void', label: 'Le Vide', cost: 5000, color: 'bg-indigo-950', accent: '138 43 226' },
  { id: 'solar', label: 'Éclat Solaire', cost: 1600, color: 'bg-yellow-400', accent: '255 255 0' },
  { id: 'nebula', label: 'Nébuleuse', cost: 3500, color: 'bg-purple-900', accent: '255 0 255' },
  { id: 'concrete', label: 'Brutalisme', cost: 800, color: 'bg-gray-500', accent: '128 128 128' },
  { id: 'lavender', label: 'Lavande', cost: 900, color: 'bg-purple-300', accent: '230 190 255' },
  { id: 'coffee', label: 'Caféine', cost: 700, color: 'bg-amber-900', accent: '111 78 55' },
  { id: 'mint', label: 'Menthe Fraîche', cost: 1000, color: 'bg-emerald-200', accent: '152 255 152' },
  { id: 'electric', label: 'Voltage', cost: 2200, color: 'bg-yellow-300', accent: '255 255 51' },
  { id: 'phantom', label: 'Fantôme', cost: 4000, color: 'bg-gray-100', accent: '192 192 192' },
  { id: 'vaporwave', label: 'Vaporwave', cost: 2800, color: 'bg-pink-400', accent: '255 113 206' },
  { id: 'steampunk', label: 'Engrenage', cost: 2600, color: 'bg-orange-800', accent: '184 115 51' },
  { id: 'minimal', label: 'Pureté', cost: 1500, color: 'bg-white', accent: '255 255 255' },
  { id: 'cyber_gold', label: 'Or Cybernétique', cost: 10000, color: 'bg-yellow-600', accent: '218 165 32' },
  { id: 'nordic', label: 'Nordique', cost: 1200, color: 'bg-sky-200', accent: '135 206 235' },
  { id: 'supernova', label: 'Supernova', cost: 6000, color: 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600', accent: '255 100 0' },
  { id: 'abyss', label: 'Abyss', cost: 4500, color: 'bg-blue-900', accent: '0 50 150' },
  { id: 'cyberpunk_2077', label: 'Cyberpunk 77', cost: 3000, color: 'bg-yellow-400', accent: '255 230 0' },
  { id: 'chrome', label: 'Chrome', cost: 8000, color: 'bg-slate-300', accent: '200 200 200' },
  { id: 'zenith', label: 'Zenith', cost: 2500, color: 'bg-sky-400', accent: '0 120 255' },
  { id: 'magma', label: 'Magma', cost: 2800, color: 'bg-orange-600', accent: '255 60 0' },
  { id: 'aurora', label: 'Aurora', cost: 3200, color: 'bg-emerald-400', accent: '100 255 200' },
  { id: 'titan', label: 'Titan', cost: 1900, color: 'bg-zinc-600', accent: '120 120 150' },
  { id: 'onyx', label: 'Onyx', cost: 5500, color: 'bg-neutral-950', accent: '50 50 50' },
  { id: 'quartz', label: 'Quartz', cost: 2400, color: 'bg-rose-300', accent: '255 150 200' },
  { id: 'hyperdrive', label: 'Hyperdrive', cost: 7000, color: 'bg-blue-600', accent: '0 200 255' },
  { id: 'glitch', label: 'Glitch', cost: 3600, color: 'bg-indigo-500', accent: '150 0 255' },
  { id: 'biohazard', label: 'Biohazard', cost: 2100, color: 'bg-lime-500', accent: '180 255 0' },
  { id: 'carbon', label: 'Carbon', cost: 1700, color: 'bg-zinc-800', accent: '80 80 80' },
  { id: 'inferno', label: 'Inferno', cost: 2900, color: 'bg-red-600', accent: '255 30 0' },
  { id: 'skyline', label: 'Skyline', cost: 1500, color: 'bg-blue-500', accent: '50 100 255' },
  { id: 'retro', label: 'Retro 8-bit', cost: 3300, color: 'bg-purple-600', accent: '200 50 255' },
  { id: 'ethereal', label: 'Ethereal', cost: 4200, color: 'bg-violet-200', accent: '220 180 255' },
  { id: 'genesis', label: 'Genesis', cost: 9000, color: 'bg-slate-50', accent: '255 255 255' },
  { id: 'singularity', label: 'Singularity', cost: 10000, color: 'bg-black', accent: '255 255 255' }
];
