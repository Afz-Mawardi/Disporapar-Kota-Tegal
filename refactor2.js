const fs = require('fs');

const clientFile = 'app/page.client.tsx';
let clientContent = fs.readFileSync(clientFile, 'utf8');

const sec2Idx = clientContent.indexOf('      {/* 2. QUICK ACCESS SERVICES */}');
const endIdx = clientContent.lastIndexOf('    </div >\n  );\n}'); // Fixed the space!

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
  console.log('sec2Idx', sec2Idx, 'endIdx', endIdx);
}
