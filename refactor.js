const fs = require('fs');

// 1. Refactor page.client.tsx
const clientFile = 'app/page.client.tsx';
let clientContent = fs.readFileSync(clientFile, 'utf8');

const sec2Idx = clientContent.indexOf('      {/* 2. QUICK ACCESS SERVICES */}');
const endIdx = clientContent.lastIndexOf('    </div>\n  );\n}');

if (sec2Idx !== -1 && endIdx !== -1) {
  const staticContent = clientContent.substring(sec2Idx, endIdx);
  const deps = '[newsList, eventsList, galleryPhotos, publicServices, homepageSettings, priorityPrograms, todayWIB, selectedPhoto, activeNewsDetail, isGalleryPaused]';
  const useMemoBlock = `  const staticContent = useMemo(() => (\n    <>\n${staticContent}\n    </>\n  ), ${deps});\n`;
  
  let newContent = clientContent.substring(0, sec2Idx) + '      {staticContent}\n' + clientContent.substring(endIdx);
  const returnIdx = newContent.lastIndexOf('  return (\n    <div');
  newContent = newContent.substring(0, returnIdx) + useMemoBlock + '\n' + newContent.substring(returnIdx);
  
  fs.writeFileSync(clientFile, newContent, 'utf8');
  console.log('Modified app/page.client.tsx');
} else {
  console.log('Could not find indices for page.client.tsx');
}

// 2. Refactor force-dynamic to revalidate = 20
const files = [
    'app/profil/[[...slug]]/page.tsx',
    'app/pelayanan/[[...slug]]/page.tsx',
    'app/pariwisata/page.tsx',
    'app/olahraga/page.tsx',
    'app/kontak/page.tsx',
    'app/kepemudaan/page.tsx',
    'app/galeri/page.tsx',
    'app/berita/page.tsx',
    'app/agenda/page.tsx',
    'app/api/external-links/route.ts',
    'app/api/upload/route.ts',
    'app/api/data/route.ts',
    'app/api/complaints/route.ts',
    'app/api/admins/route.ts',
    'app/api/admins/history/route.ts'
];

for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/export const dynamic = 'force-dynamic';/g, 'export const revalidate = 20;');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  } catch (e) {
    console.log(`Failed ${file}: ${e.message}`);
  }
}

// 3. Remove dependencies from package.json
const pkgFile = 'package.json';
let pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
if (pkg.devDependencies) {
  delete pkg.devDependencies['tw-animate-css'];
  delete pkg.devDependencies['potrace'];
}
fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2), 'utf8');
console.log('Updated package.json');
