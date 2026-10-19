const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const JSZip = require('jszip');

const ROOT = __dirname;
const BUILD_DIR = path.join(ROOT, 'android_build');
const TOOLS_DIR = path.join(ROOT, 'tools');
const JAVA = path.join(TOOLS_DIR, 'jdk-17.0.12+7-jre', 'bin', 'java.exe');
const AAPT2 = path.join(TOOLS_DIR, 'aapt2.exe');
const ANDROID_JAR = path.join(TOOLS_DIR, 'android.jar');
const ECJ_JAR = path.join(TOOLS_DIR, 'ecj.jar');
const R8_JAR = path.join(TOOLS_DIR, 'r8.jar');
const SIGNER_JAR = path.join(TOOLS_DIR, 'uber-apk-signer.jar');

console.log('=== Step 1: Preparing directories ===');
if (fs.existsSync(BUILD_DIR)) {
  fs.rmSync(BUILD_DIR, { recursive: true, force: true });
}
fs.mkdirSync(BUILD_DIR, { recursive: true });

const resDir = path.join(BUILD_DIR, 'res');
const valuesDir = path.join(resDir, 'values');
const srcDir = path.join(BUILD_DIR, 'src', 'com', 'lifeplan', 'ai');
const objDir = path.join(BUILD_DIR, 'obj');
const dexDir = path.join(BUILD_DIR, 'dex');
const assetsDir = path.join(BUILD_DIR, 'assets');

[resDir, valuesDir, srcDir, objDir, dexDir, assetsDir].forEach(d => fs.mkdirSync(d, { recursive: true }));

console.log('=== Step 2: Creating AndroidManifest.xml ===');
const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.lifeplan.ai"
    android:versionCode="1"
    android:versionName="1.0">

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
            android:name="com.lifeplan.ai.MainActivity"
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
fs.writeFileSync(path.join(BUILD_DIR, 'AndroidManifest.xml'), manifestXml, 'utf8');

console.log('=== Step 3: Creating strings.xml ===');
const stringsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">LifePlan AI</string>
</resources>`;
fs.writeFileSync(path.join(valuesDir, 'strings.xml'), stringsXml, 'utf8');

console.log('=== Step 4: Generating multi-density app icons ===');
const psScriptPath = path.join(ROOT, 'make_icon.ps1');
execSync(`powershell -NoProfile -ExecutionPolicy Bypass -File "${psScriptPath}" -ResDir "${resDir}"`, { stdio: 'inherit' });

console.log('=== Step 5: Copying web assets ===');
fs.copyFileSync(path.join(ROOT, 'index.html'), path.join(assetsDir, 'index.html'));

console.log('=== Step 6: Creating MainActivity.java ===');
const mainActivityJava = `package com.lifeplan.ai;

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
fs.writeFileSync(path.join(srcDir, 'MainActivity.java'), mainActivityJava, 'utf8');

console.log('=== Step 7: Compiling Java with ECJ ===');
const javaFile = path.join(srcDir, 'MainActivity.java');
execSync(`"${JAVA}" -jar "${ECJ_JAR}" -cp "${ANDROID_JAR}" -source 1.8 -target 1.8 -d "${objDir}" "${javaFile}"`, { stdio: 'inherit' });
console.log('ECJ compilation succeeded!');

console.log('=== Step 8: Converting to DEX with D8 ===');
const classFile = path.join(objDir, 'com', 'lifeplan', 'ai', 'MainActivity.class');
execSync(`"${JAVA}" -cp "${R8_JAR}" com.android.tools.r8.D8 --min-api 21 --lib "${ANDROID_JAR}" --output "${dexDir}" "${classFile}"`, { stdio: 'inherit' });
console.log('D8 conversion succeeded!');

console.log('=== Step 9: Compiling Resources with AAPT2 ===');
const compiledResZip = path.join(BUILD_DIR, 'compiled_res.zip');
execSync(`"${AAPT2}" compile --dir "${resDir}" -o "${compiledResZip}"`, { stdio: 'inherit' });
console.log('AAPT2 compile succeeded!');

console.log('=== Step 10: Linking APK with AAPT2 ===');
const unalignedApk = path.join(BUILD_DIR, 'unaligned.apk');
const manifestPath = path.join(BUILD_DIR, 'AndroidManifest.xml');
execSync(`"${AAPT2}" link -I "${ANDROID_JAR}" --manifest "${manifestPath}" -o "${unalignedApk}" -A "${assetsDir}" "${compiledResZip}"`, { stdio: 'inherit' });
console.log('AAPT2 link succeeded!');

console.log('=== Step 11: Adding classes.dex to APK ===');
async function packageDex() {
  const apkData = fs.readFileSync(unalignedApk);
  const zip = await JSZip.loadAsync(apkData);
  const dexData = fs.readFileSync(path.join(dexDir, 'classes.dex'));
  zip.file('classes.dex', dexData);
  const outputApkData = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });
  fs.writeFileSync(unalignedApk, outputApkData);
  console.log('classes.dex successfully merged into unaligned.apk!');

  console.log('=== Step 12: Signing APK with uber-apk-signer ===');
  const targetApk = path.join(ROOT, 'LifePlanAI.apk');
  if (fs.existsSync(targetApk)) {
    fs.unlinkSync(targetApk);
  }
  // Remove any old signed APKs in current dir
  const currentFiles = fs.readdirSync(ROOT);
  for (const f of currentFiles) {
    if (f.startsWith('unaligned-aligned-debugSigned')) {
      fs.unlinkSync(path.join(ROOT, f));
    }
  }

  execSync(`"${JAVA}" -jar "${SIGNER_JAR}" -a "${unalignedApk}" -o "${ROOT}" --allowResign`, { stdio: 'inherit' });

  const signedApk = path.join(ROOT, 'unaligned-aligned-debugSigned.apk');
  if (fs.existsSync(signedApk)) {
    if (fs.existsSync(targetApk)) fs.unlinkSync(targetApk);
    fs.renameSync(signedApk, targetApk);
    console.log(`Successfully created: ${targetApk}`);
  } else {
    throw new Error('Signed APK not found at: ' + signedApk);
  }

  // Clean up idsig files if any
  for (const f of fs.readdirSync(ROOT)) {
    if (f.endsWith('.idsig')) {
      try { fs.unlinkSync(path.join(ROOT, f)); } catch (_) {}
    }
  }

  console.log('=== Step 13: Verifying final APK ===');
  execSync(`"${JAVA}" -jar "${SIGNER_JAR}" -y -a "${targetApk}" --verbose`, { stdio: 'inherit' });
  console.log('=== BUILD COMPLETE AND VERIFIED! ===');
}

packageDex().catch(err => {
  console.error('Packaging failed:', err);
  process.exit(1);
});
