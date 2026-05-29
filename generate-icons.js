const fs = require('fs');
const https = require('https');
const path = require('path');

const BUILD_ICONS = [
  'Activity', 'Star', 'Heart', 'Smile', 'Book', 'Code', 'Apple', 'Sun', 
  'Briefcase', 'Camera', 'Car', 'Plane', 'Droplets', 'Dumbbell', 'Target', 'Trophy'
];

const BREAK_ICONS = [
  'Wine', 'Coffee', 'Pizza', 'Gamepad2', 'Smartphone', 'Tv', 'Cigarette', 'Pill', 'Cake', 'Moon', 'Flame', 'Ban', 'XCircle'
];

const allIcons = [...BUILD_ICONS, ...BREAK_ICONS];

// Convert PascalCase to lowercase-kebab
function toKebabCase(str) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase().replace(/^-/, '');
}

// Convert PascalCase to lowercase_snake (for Android resources)
function toSnakeCase(str) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1_$2').toLowerCase().replace(/^_/, '');
}

const outDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'res', 'drawable');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

console.log('Downloading Lucide icon paths from Iconify...');

fetch('https://raw.githubusercontent.com/iconify/icon-sets/master/json/lucide.json')
    .then(res => res.json())
    .then(iconData => {
        allIcons.forEach(pascalName => {
            const kebabName = toKebabCase(pascalName);
            const snakeName = 'ic_' + toSnakeCase(pascalName); // Android prefix
            
            const iconObj = iconData.icons[kebabName];
            if (!iconObj || !iconObj.body) {
                console.error(`Warning: Icon ${kebabName} not found in lucide JSON.`);
                return;
            }

            let svgBody = iconObj.body;
            // Convert standard SVG attributes to Android Vector Drawable attributes
            svgBody = svgBody.replace(/fill="none"/g, 'android:fillColor="#00000000"');
            svgBody = svgBody.replace(/fill="currentColor"/g, 'android:fillColor="#FFFFFF"');
            svgBody = svgBody.replace(/stroke="currentColor"/g, 'android:strokeColor="#FFFFFF"');
            svgBody = svgBody.replace(/stroke-width="2"/g, 'android:strokeWidth="2"');
            svgBody = svgBody.replace(/stroke-linecap="round"/g, 'android:strokeLineCap="round"');
            svgBody = svgBody.replace(/stroke-linejoin="round"/g, 'android:strokeLineJoin="round"');
            svgBody = svgBody.replace(/ d="/g, ' android:pathData="');

            // Quick hack to handle <circle cx="12" cy="12" r="10"/> inside body
            // We convert basic circles to pathData approximations
            svgBody = svgBody.replace(/<circle([^>]+)cx="([^"]+)"([^>]+)cy="([^"]+)"([^>]+)r="([^"]+)"([^>]*)>/g, (match, p1, cx, p3, cy, p5, r, p7) => {
                const fCx = parseFloat(cx);
                const fCy = parseFloat(cy);
                const fR = parseFloat(r);
                const d = `M ${fCx} ${fCy - fR} A ${fR} ${fR} 0 1 0 ${fCx} ${fCy + fR} A ${fR} ${fR} 0 1 0 ${fCx} ${fCy - fR}`;
                return `<path android:fillColor="#00000000" android:strokeColor="#FFFFFF" android:strokeWidth="2" android:strokeLineCap="round" android:strokeLineJoin="round" android:pathData="${d}" />`;
            });

            const xml = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
${svgBody}</vector>
`;
            fs.writeFileSync(path.join(outDir, `${snakeName}.xml`), xml);
            console.log(`Generated ${snakeName}.xml`);
        });

        console.log('✅ Successfully generated all Android VectorDrawables!');
    })
    .catch(e => {
        console.error('Error fetching lucide icons:', e);
    });
