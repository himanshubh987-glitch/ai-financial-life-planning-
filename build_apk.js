const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');
const { PackageSigner } = require('@chromeos/android-package-signer');

async function buildApk() {
  console.log('--- Starting LifePlan AI APK Generation ---');

  const baseApkPath = 'test_base.apk';
  if (!fs.existsSync(baseApkPath)) {
    throw new Error('Base APK not found at: ' + baseApkPath);
  }

  console.log('[1/5] Loading base Android WebView APK archive...');
  const baseApkBuffer = fs.readFileSync(baseApkPath);
  const zip = await JSZip.loadAsync(baseApkBuffer);

  console.log('[2/5] Preparing app assets to inject into APK...');
  const indexHtml = fs.readFileSync('index.html', 'utf8');
  const manifestJson = fs.readFileSync('manifest.json', 'utf8');

  // Helper to add directory recursively to zip
  function addDirToZip(zipFolder, localDirPath) {
    if (!fs.existsSync(localDirPath)) return;
    const items = fs.readdirSync(localDirPath);
    for (const item of items) {
      const fullPath = path.join(localDirPath, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        const subFolder = zipFolder.folder(item);
        addDirToZip(subFolder, fullPath);
      } else {
        const content = fs.readFileSync(fullPath);
        zipFolder.file(item, content);
      }
    }
  }

  // Inject web assets into assets/web/
  const webFolder = zip.folder('assets/web');
  webFolder.file('index.html', indexHtml);
  webFolder.file('manifest.json', manifestJson);

  // Inject screens and stitch_downloads into assets/web/
  addDirToZip(webFolder.folder('screens'), 'screens');
  addDirToZip(webFolder.folder('stitch_downloads'), 'stitch_downloads');

  // Also replace assets/local/index.html and assets/demo/index.html so all entry points work
  zip.file('assets/local/index.html', indexHtml);
  zip.file('assets/demo/index.html', indexHtml);

  // Configure settings.json
  const settings = {
    sites: [
      {
        url: "https://appassets.androidplatform.net/assets/web/index.html",
        title: "LifePlan AI Financial Planner"
      }
    ],
    other: "https://appassets.androidplatform.net/assets/web/index.html",
    match: [
      ["host", "endsWith", "androidplatform.net"],
      ["host", "endsWith", "tailwindcss.com"],
      ["host", "endsWith", "googleapis.com"],
      ["host", "endsWith", "gstatic.com"],
      ["host", "endsWith", "googleusercontent.com"],
      ["host", "equals", "localhost"],
      ["host", "equals", "127.0.0.1"]
    ],
    skip: [],
    remote_debug: true,
    console_log: false,
    js_interface: true,
    context_menu: false,
    not_matching: true,
    local_sites: true,
    update_zip: "",
    web_settings: {
      JavaScriptEnabled: true,
      DomStorageEnabled: true,
      AllowFileAccess: true,
      AllowContentAccess: true
    },
    source: "assets",
    timestamp: "2026-10-19T12:00:00Z"
  };
  zip.file('assets/settings.json', JSON.stringify(settings, null, 2));

  console.log('[3/5] Stripping old cryptographic signatures from META-INF...');
  const filesToRemove = [];
  zip.forEach((relativePath) => {
    if (relativePath.startsWith('META-INF/') && 
        (relativePath.endsWith('.SF') || relativePath.endsWith('.RSA') || relativePath.endsWith('.DSA') || relativePath.endsWith('.EC') || relativePath === 'META-INF/MANIFEST.MF')) {
      filesToRemove.push(relativePath);
    }
  });
  filesToRemove.forEach(f => zip.remove(f));
  console.log(` Removed ${filesToRemove.length} signature files.`);

  console.log('[4/5] Compressing unsigned APK archive...');
  const unsignedApkBuffer = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
  console.log(` Unsigned APK archive size: ${(unsignedApkBuffer.length / (1024 * 1024)).toFixed(2)} MB`);

  console.log('[5/5] Generating RSA keystore and signing APK with PackageSigner...');
  const signer = new PackageSigner('lifeplan2026', 'lifeplan');
  const dname = {
    commonName: 'LifePlan AI',
    organizationName: 'LifePlan Financial Intelligence',
    organizationUnit: 'Wealth Systems',
    countryCode: 'IN'
  };

  const key = await signer.generateKey(dname);
  const blob = new Blob([unsignedApkBuffer]);
  const signedDataUrl = await signer.signPackage(blob, key, 'LifePlan AI APK Packager v1.0');

  const base64Data = signedDataUrl.split('base64,')[1];
  const finalApkBuffer = Buffer.from(base64Data, 'base64');

  const outputApkPath = 'LifePlanAI.apk';
  fs.writeFileSync(outputApkPath, finalApkBuffer);
  console.log(`\n Successfully generated ${outputApkPath}!`);
  console.log(` Final Signed APK Size: ${(finalApkBuffer.length / (1024 * 1024)).toFixed(2)} MB (${finalApkBuffer.length} bytes)`);

  // Copy to artifact directory
  const brainDir = 'C:\\Users\\HIMANSHU\\.gemini\\antigravity\\brain\\19441efb-7522-45d5-9446-8100a2c47a24';
  if (fs.existsSync(brainDir)) {
    const artifactApkPath = path.join(brainDir, 'LifePlanAI.apk');
    fs.writeFileSync(artifactApkPath, finalApkBuffer);
    console.log(` Copied APK to artifact directory: ${artifactApkPath}`);

    // Also copy QR code
    if (fs.existsSync('apk_qr_code.png')) {
      fs.copyFileSync('apk_qr_code.png', path.join(brainDir, 'apk_qr_code.png'));
    }
  }

  return outputApkPath;
}

buildApk().catch(err => {
  console.error('APK build failed:', err);
  process.exit(1);
});
