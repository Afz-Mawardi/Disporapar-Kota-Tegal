const fs = require('fs');

let content = fs.readFileSync('app/api/data/route.ts', 'utf8');

if (!content.includes('import { logAudit }')) {
  content = content.replace("import { authOptions } from '@/lib/auth';", "import { authOptions } from '@/lib/auth';\nimport { logAudit } from '@/lib/audit';");
}

function injectAuthCheck(funcName) {
  const searchStr = `export async function ${funcName}(request: Request) {\n  try {\n`;
  const injectStr = `    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. Akses ditolak.' }, { status: 401 });
    }
    const ip = (request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')) || 'Unknown IP';
    const currentUsername = (session.user as any)?.username || 'Admin';\n\n`;
    
  if (content.includes(searchStr)) {
    // Remove existing `const session = ...` if it exists right after
    const afterSearch = content.substring(content.indexOf(searchStr) + searchStr.length, content.indexOf(searchStr) + searchStr.length + 100);
    let finalInject = injectStr;
    if (afterSearch.includes('const session = await getServerSession(authOptions);')) {
      content = content.replace(`export async function ${funcName}(request: Request) {\n  try {\n    const session = await getServerSession(authOptions);\n`, searchStr);
    }
    content = content.replace(searchStr, searchStr + finalInject);
  }
}

injectAuthCheck('POST');
injectAuthCheck('PUT');
injectAuthCheck('DELETE');

content = content.replace(/return NextResponse\.json\(\{\s*success:\s*true([^}]*)\}\);/g, 
  `await logAudit({ user: currentUsername || 'System', ip: ip || 'Unknown', endpoint: '/api/data', action: 'Operasi API Data Berhasil', status: 'Berhasil' });\n    return NextResponse.json({ success: true$1});`);

fs.writeFileSync('app/api/data/route.ts', content, 'utf8');
console.log('Patched api/data/route.ts');
