const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const JSZip = require('jszip');

const ROOT = __dirname;
const TOOLS_DIR = path.join(ROOT, 'tools');
const JAVA = path.join(TOOLS_DIR, 'jdk-17.0.12+7-jre', 'bin', 'java.exe');
const KEYTOOL = path.join(TOOLS_DIR, 'jdk-17.0.12+7-jre', 'bin', 'keytool.exe');
const AAPT2 = path.join(TOOLS_DIR, 'aapt2.exe');
const ANDROID_JAR = path.join(TOOLS_DIR, 'android.jar');
const ECJ_JAR = path.join(TOOLS_DIR, 'ecj.jar');
const R8_JAR = path.join(TOOLS_DIR, 'r8.jar');
const SIGNER_JAR = path.join(TOOLS_DIR, 'uber-apk-signer.jar');
const KEYSTORE = path.join(ROOT, 'release.keystore');
const KS_PASS = 'lifeplan2026';
const KS_ALIAS = 'lifeplan';

// Ensure Release Keystore exists
if (!fs.existsSync(KEYSTORE)) {
  console.log('Generating release.keystore...');
  execSync(`"${KEYTOOL}" -genkeypair -v -keystore "${KEYSTORE}" -alias ${KS_ALIAS} -keyalg RSA -keysize 2048 -validity 10000 -storepass ${KS_PASS} -keypass ${KS_PASS} -dname "CN=LifePlan AI, OU=Engineering, O=LifePlan, L=San Francisco, ST=CA, C=US"`, { stdio: 'inherit' });
}

async function buildApk({
  buildDirName,
  packageName,
  versionCode,
  versionName,
  appName,
  activityName,
  javaSource,
  assetsDirSource,
  outputApkName
}) {
  console.log(`\n==================================================`);
  console.log(`Building: ${outputApkName} (${packageName} v${versionName})`);
  console.log(`==================================================`);

  const buildDir = path.join(ROOT, buildDirName);
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true, force: true });
  }
  fs.mkdirSync(buildDir, { recursive: true });

  const resDir = path.join(buildDir, 'res');
  const valuesDir = path.join(resDir, 'values');
  const srcDir = path.join(buildDir, 'src', ...packageName.split('.'));
  const objDir = path.join(buildDir, 'obj');
  const dexDir = path.join(buildDir, 'dex');
  const assetsDir = path.join(buildDir, 'assets');

  [resDir, valuesDir, srcDir, objDir, dexDir, assetsDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

  // 1. AndroidManifest.xml
  const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${packageName}"
    android:versionCode="${versionCode}"
    android:versionName="${versionName}">

    <uses-sdk
        android:minSdkVersion="21"
        android:targetSdkVersion="34" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.NoTitleBar"
        android:usesCleartextTraffic="true">
        
        <activity
            android:name="${packageName}.${activityName}"
            android:exported="true"
            android:screenOrientation="portrait"
            android:configChanges="orientation|screenSize|keyboardHidden|smallestScreenSize|screenLayout"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
  fs.writeFileSync(path.join(buildDir, 'AndroidManifest.xml'), manifestXml, 'utf8');

  // 2. strings.xml
  const stringsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">${appName}</string>
</resources>`;
  fs.writeFileSync(path.join(valuesDir, 'strings.xml'), stringsXml, 'utf8');

  // 3. App icons
  const psScriptPath = path.join(ROOT, 'make_icon.ps1');
  execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${psScriptPath}" -ResDir "${resDir}"`, { stdio: 'inherit' });

  // 4. Copy Assets if provided
  if (assetsDirSource && fs.existsSync(assetsDirSource)) {
    const files = fs.readdirSync(assetsDirSource);
    for (const f of files) {
      fs.copyFileSync(path.join(assetsDirSource, f), path.join(assetsDir, f));
    }
  }

  // 5. Write Java Source
  const javaFile = path.join(srcDir, `${activityName}.java`);
  fs.writeFileSync(javaFile, javaSource, 'utf8');

  // 6. Compile Java with ECJ
  execSync(`"${JAVA}" -jar "${ECJ_JAR}" -cp "${ANDROID_JAR}" -source 1.8 -target 1.8 -d "${objDir}" "${javaFile}"`, { stdio: 'inherit' });

  // 7. Compile DEX with D8
  const classFile = path.join(objDir, ...packageName.split('.'), `${activityName}.class`);
  execSync(`"${JAVA}" -cp "${R8_JAR}" com.android.tools.r8.D8 --min-api 21 --lib "${ANDROID_JAR}" --output "${dexDir}" "${classFile}"`, { stdio: 'inherit' });

  // 8. Compile Resources with AAPT2
  const compiledResZip = path.join(buildDir, 'compiled_res.zip');
  execSync(`"${AAPT2}" compile --dir "${resDir}" -o "${compiledResZip}"`, { stdio: 'inherit' });

  // 9. Link APK with AAPT2
  const rawApk = path.join(buildDir, 'raw.apk');
  const manifestPath = path.join(buildDir, 'AndroidManifest.xml');
  const aaptLinkCmd = fs.existsSync(path.join(assetsDir, 'index.html'))
    ? `"${AAPT2}" link -I "${ANDROID_JAR}" --manifest "${manifestPath}" -o "${rawApk}" -A "${assetsDir}" "${compiledResZip}"`
    : `"${AAPT2}" link -I "${ANDROID_JAR}" --manifest "${manifestPath}" -o "${rawApk}" "${compiledResZip}"`;
  execSync(aaptLinkCmd, { stdio: 'inherit' });

  // 10. Merge classes.dex with correct compression:
  // - resources.arsc and PNGs MUST be STORED (uncompressed)
  // - classes.dex and assets/manifest can be DEFLATED
  const rawApkData = fs.readFileSync(rawApk);
  const zip = await JSZip.loadAsync(rawApkData);
  const dexData = fs.readFileSync(path.join(dexDir, 'classes.dex'));

  // Ensure individual file compression modes:
  const newZip = new JSZip();
  for (const filename of Object.keys(zip.files)) {
    const file = zip.files[filename];
    if (file.dir) continue;
    const content = await file.async('nodebuffer');
    const isStored = filename === 'resources.arsc' || filename.endsWith('.png') || filename.endsWith('.arsc');
    newZip.file(filename, content, {
      compression: isStored ? 'STORE' : 'DEFLATE'
    });
  }
  newZip.file('classes.dex', dexData, { compression: 'DEFLATE' });

  const unalignedApk = path.join(buildDir, 'unaligned.apk');
  const finalZipBuffer = await newZip.generateAsync({ type: 'nodebuffer' });
  fs.writeFileSync(unalignedApk, finalZipBuffer);

  // 11. Sign and Zipalign with Release Keystore
  const targetApk = path.join(ROOT, outputApkName);
  if (fs.existsSync(targetApk)) fs.unlinkSync(targetApk);

  // Clean old signed apks in build dir
  for (const f of fs.readdirSync(buildDir)) {
    if (f.includes('-signed.apk') || f.includes('-aligned')) {
      try { fs.unlinkSync(path.join(buildDir, f)); } catch (_) {}
    }
  }

  execSync(`"${JAVA}" -jar "${SIGNER_JAR}" -a "${unalignedApk}" -o "${buildDir}" --allowResign --ks "${KEYSTORE}" --ksAlias ${KS_ALIAS} --ksPass ${KS_PASS} --ksKeyPass ${KS_PASS}`, { stdio: 'inherit' });

  const signedResult = path.join(buildDir, 'unaligned-aligned-signed.apk');
  if (fs.existsSync(signedResult)) {
    fs.copyFileSync(signedResult, targetApk);
    console.log(`Successfully generated: ${targetApk}`);
  } else {
    throw new Error('Signed output not found: ' + signedResult);
  }

  // 12. Verify with uber-apk-signer and aapt2
  console.log(`\nVerifying ${outputApkName}:`);
  execSync(`"${JAVA}" -jar "${SIGNER_JAR}" -y -a "${targetApk}" --verbose`, { stdio: 'inherit' });
  execSync(`"${AAPT2}" dump badging "${targetApk}"`, { stdio: 'inherit' });
}

// Master build execution
async function main() {
  // 1. Build Production App APK: LifePlanAI.apk
  const mainJava = `package com.lifeplan.ai;

import android.app.Activity;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.Window;
import android.view.KeyEvent;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);

        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#0B0F19"));
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }

        webView.setWebViewClient(new WebViewClient());
        webView.setWebChromeClient(new WebChromeClient());

        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if ((keyCode == KeyEvent.KEYCODE_BACK) && webView != null && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
`;

  // Prepare full offline asset package
  const assetsTemp = path.join(ROOT, 'temp_assets');
  if (fs.existsSync(assetsTemp)) {
    fs.rmSync(assetsTemp, { recursive: true, force: true });
  }
  fs.mkdirSync(assetsTemp, { recursive: true });
  
  // Use offline bundled HTML as index.html
  fs.copyFileSync(path.join(ROOT, 'bundled_app.html'), path.join(assetsTemp, 'index.html'));
  fs.copyFileSync(path.join(ROOT, 'tailwind.js'), path.join(assetsTemp, 'tailwind.js'));
  fs.copyFileSync(path.join(ROOT, 'material-symbols.ttf'), path.join(assetsTemp, 'material-symbols.ttf'));

  await buildApk({
    buildDirName: 'android_build_prod',
    packageName: 'com.lifeplan.ai',
    versionCode: 3,
    versionName: '1.0.2',
    appName: 'LifePlan AI',
    activityName: 'MainActivity',
    javaSource: mainJava,
    assetsDirSource: assetsTemp,
    outputApkName: 'LifePlanAI.apk'
  });

  // 2. Build Minimal Test APK: LifePlanAI_MinimalTest.apk
  const testJava = `package com.lifeplan.ai.test;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.view.Gravity;
import android.view.Window;
import android.widget.LinearLayout;
import android.widget.TextView;

public class TestActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setBackgroundColor(Color.parseColor("#0B0F19"));
        layout.setGravity(Gravity.CENTER);
        layout.setPadding(48, 48, 48, 48);

        TextView title = new TextView(this);
        title.setText("LifePlan AI");
        title.setTextColor(Color.parseColor("#10B981"));
        title.setTextSize(28);
        title.setGravity(Gravity.CENTER);
        title.setPadding(0, 0, 0, 24);
        layout.addView(title);

        TextView subtitle = new TextView(this);
        subtitle.setText("✓ Test APK Installed Successfully!\\n\\nYour device accepts packages from com.lifeplan.ai with Release Keystore verification.");
        subtitle.setTextColor(Color.parseColor("#F3F4F6"));
        subtitle.setTextSize(16);
        subtitle.setGravity(Gravity.CENTER);
        layout.addView(subtitle);

        setContentView(layout);
    }
}
`;

  await buildApk({
    buildDirName: 'android_build_test',
    packageName: 'com.lifeplan.ai.test',
    versionCode: 1,
    versionName: '1.0.0',
    appName: 'LifePlan Test',
    activityName: 'TestActivity',
    javaSource: testJava,
    assetsDirSource: null,
    outputApkName: 'LifePlanAI_MinimalTest.apk'
  });

  console.log('\n==================================================');
  console.log('ALL BUILDS SUCCEEDED AND VERIFIED!');
  console.log('1. Production APK: LifePlanAI.apk (versionCode 2, v1.0.1)');
  console.log('2. Minimal Test APK: LifePlanAI_MinimalTest.apk');
  console.log('==================================================\n');
}

main().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
