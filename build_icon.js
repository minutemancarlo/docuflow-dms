const fs = require('fs');
const path = require('path');

const srcImg = 'C:/Users/Anubis/.gemini/antigravity/brain/2d613c17-64c5-4729-ae55-010ce1de5fb7/docuflow_app_icon_1786886584739.jpg';

if (fs.existsSync(srcImg)) {
  const buf = fs.readFileSync(srcImg);
  const base64 = buf.toString('base64');
  
  // Ensure directories exist
  fs.mkdirSync(path.join(__dirname, 'src/assets'), { recursive: true });
  fs.mkdirSync(path.join(__dirname, 'public'), { recursive: true });

  // 1. Write TypeScript asset module
  const tsContent = `export const APP_ICON_DATA = "data:image/jpeg;base64,${base64}";\n`;
  fs.writeFileSync(path.join(__dirname, 'src/assets/iconBase64.ts'), tsContent, 'utf-8');

  // 2. Also copy to public/icon.jpg, public/icon.png, public/favicon.ico
  fs.writeFileSync(path.join(__dirname, 'public/icon.jpg'), buf);
  fs.writeFileSync(path.join(__dirname, 'public/icon.png'), buf);
  fs.writeFileSync(path.join(__dirname, 'public/favicon.ico'), buf);

  console.log('Icon built successfully! Bytes:', buf.length);
} else {
  console.error('Source image not found:', srcImg);
}
