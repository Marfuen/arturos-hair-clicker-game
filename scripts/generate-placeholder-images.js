const fs = require("fs");
const path = require("path");

// Create the images directory if it doesn't exist
const imagesDir = path.join(__dirname, "../public/images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Generate a simple SVG for each image
const images = [
  {
    name: "arturo-head.png",
    svg: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="95" fill="#f8d49f" stroke="#e2a23b" stroke-width="5"/>
      <circle cx="70" cy="80" r="10" fill="#333"/>
      <circle cx="130" cy="80" r="10" fill="#333"/>
      <path d="M 70 130 Q 100 150 130 130" fill="none" stroke="#333" stroke-width="5"/>
    </svg>`,
  },
  {
    name: "comb.png",
    svg: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="70" width="100" height="30" fill="#9c59b6" rx="5"/>
      <rect x="50" y="100" width="100" height="30" fill="#9c59b6" rx="5"/>
      <rect x="60" y="100" width="5" height="30" fill="#fff"/>
      <rect x="80" y="100" width="5" height="30" fill="#fff"/>
      <rect x="100" y="100" width="5" height="30" fill="#fff"/>
      <rect x="120" y="100" width="5" height="30" fill="#fff"/>
      <rect x="140" y="100" width="5" height="30" fill="#fff"/>
    </svg>`,
  },
  {
    name: "shampoo.png",
    svg: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect x="70" y="50" width="60" height="100" fill="#3498db" rx="10"/>
      <rect x="80" y="40" width="40" height="20" fill="#2980b9" rx="5"/>
      <rect x="90" y="30" width="20" height="10" fill="#2980b9" rx="5"/>
      <rect x="70" y="150" width="60" height="20" fill="#2980b9" rx="5"/>
      <text x="100" y="110" font-family="Arial" font-size="14" text-anchor="middle" fill="#fff">GROWTH</text>
    </svg>`,
  },
  {
    name: "hat.png",
    svg: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="130" rx="70" ry="20" fill="#e74c3c"/>
      <path d="M 60 130 Q 100 80 140 130" fill="#c0392b"/>
      <circle cx="100" cy="90" r="10" fill="#f1c40f"/>
    </svg>`,
  },
  {
    name: "wig.png",
    svg: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="120" rx="60" ry="70" fill="#8e44ad"/>
      <path d="M 60 80 Q 100 40 140 80" fill="#8e44ad"/>
      <path d="M 60 80 Q 40 100 60 120" fill="#8e44ad"/>
      <path d="M 140 80 Q 160 100 140 120" fill="#8e44ad"/>
      <path d="M 70 150 L 70 180" stroke="#8e44ad" stroke-width="10"/>
      <path d="M 90 150 L 90 190" stroke="#8e44ad" stroke-width="10"/>
      <path d="M 110 150 L 110 190" stroke="#8e44ad" stroke-width="10"/>
      <path d="M 130 150 L 130 180" stroke="#8e44ad" stroke-width="10"/>
    </svg>`,
  },
  {
    name: "salon.png",
    svg: `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="80" width="120" height="80" fill="#e67e22"/>
      <rect x="50" y="100" width="30" height="60" fill="#3498db"/>
      <rect x="120" y="100" width="30" height="60" fill="#3498db"/>
      <rect x="30" y="70" width="140" height="10" fill="#d35400"/>
      <text x="100" y="130" font-family="Arial" font-size="14" text-anchor="middle" fill="#fff">SALON</text>
    </svg>`,
  },
];

// Convert SVG to PNG using a data URL
for (const image of images) {
  const svgPath = path.join(imagesDir, image.name.replace(".png", ".svg"));
  fs.writeFileSync(svgPath, image.svg);
  console.log(`Created ${image.name.replace(".png", ".svg")}`);
}

console.log("\nPlaceholder SVGs created in public/images/");
console.log(
  "Note: These are SVG files with .png extensions. For a production game,"
);
console.log("you should replace them with actual PNG images.");
