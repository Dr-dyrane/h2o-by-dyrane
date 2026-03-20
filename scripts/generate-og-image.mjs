import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const publicDir = path.join(rootDir, "public");
const outputPath = path.join(publicDir, "og-image.png");

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const toDataUri = (relativePath, mimeType) =>
  `data:${mimeType};base64,${fs.readFileSync(path.join(rootDir, relativePath)).toString("base64")}`;

const getCommitCount = () => {
  const projectSource = fs.readFileSync(path.join(rootDir, "src/data/projects.ts"), "utf8");
  const commitMatches = [...projectSource.matchAll(/commits:\s*(\d+)/g)];
  const totalCommits = commitMatches.reduce((sum, match) => sum + Number(match[1]), 0);

  return `${(totalCommits / 1000).toFixed(1).replace(".0", "")}k+`;
};

const findChromeBinary = () => {
  const envCandidates = [
    process.env.CHROME_BIN,
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.BROWSER,
  ].filter(Boolean);

  const platformCandidates = {
    win32: [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
      "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    ],
    darwin: [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    ],
    linux: [
      "/usr/bin/google-chrome",
      "/usr/bin/google-chrome-stable",
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
      "/usr/bin/microsoft-edge",
    ],
  };

  const candidates = [...envCandidates, ...(platformCandidates[process.platform] ?? [])];

  return candidates.find((candidate) => fs.existsSync(candidate));
};

const commitCount = getCommitCount();
const logoHref = toDataUri("public/logo.png", "image/png");
const desktopHref = toDataUri("public/showcase/ivisit-console-light.png", "image/png");
const mobileHref = toDataUri("public/showcase/hop-mobile-light.png", "image/png");
const regularFontHref = toDataUri("public/fonts/SF-Pro-Display-Regular.woff2", "font/woff2");
const semiboldFontHref = toDataUri("public/fonts/SF-Pro-Display-Semibold.woff2", "font/woff2");
const boldFontHref = toDataUri("public/fonts/SF-Pro-Display-Bold.woff2", "font/woff2");

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      @font-face {
        font-family: "SF Pro Display";
        src: url("${regularFontHref}") format("woff2");
        font-weight: 400;
        font-style: normal;
      }

      @font-face {
        font-family: "SF Pro Display";
        src: url("${semiboldFontHref}") format("woff2");
        font-weight: 600;
        font-style: normal;
      }

      @font-face {
        font-family: "SF Pro Display";
        src: url("${boldFontHref}") format("woff2");
        font-weight: 700;
        font-style: normal;
      }

      :root {
        color-scheme: light;
        --surface: #fbf5ee;
        --surface-alt: #f1e6d8;
        --surface-card: rgba(255, 251, 247, 0.82);
        --surface-stroke: rgba(28, 25, 23, 0.06);
        --text: #1c1917;
        --text-muted: rgba(28, 25, 23, 0.78);
        --text-ghost: rgba(28, 25, 23, 0.48);
        --cat-logistics: #2a51c7;
        --cat-intelligence: #7045c4;
        --cat-ux: #9b4f36;
        --cta-bg: #231f20;
        --cta-text: #ffffff;
        --glass: rgba(255, 255, 255, 0.32);
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        width: 1200px;
        height: 630px;
        overflow: hidden;
        background:
          radial-gradient(circle at 86% 14%, rgba(155, 79, 54, 0.24), transparent 28%),
          radial-gradient(circle at 18% 92%, rgba(42, 81, 199, 0.12), transparent 26%),
          radial-gradient(circle at 58% 92%, rgba(112, 69, 196, 0.12), transparent 20%),
          linear-gradient(135deg, var(--surface), var(--surface-alt));
        font-family: "SF Pro Display", system-ui, sans-serif;
      }

      .canvas {
        position: relative;
        width: 1200px;
        height: 630px;
        padding: 40px;
      }

      .shell {
        position: relative;
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: 28px;
        width: 100%;
        height: 100%;
        padding: 30px 30px 24px;
        border-radius: 40px;
        background: var(--surface-card);
        border: 1px solid rgba(255, 255, 255, 0.42);
        box-shadow:
          0 24px 58px rgba(69, 49, 30, 0.10),
          inset 0 1px 0 rgba(255, 255, 255, 0.6);
        overflow: hidden;
      }

      .copy {
        position: relative;
        display: flex;
        flex-direction: column;
        min-width: 0;
      }

      .eyebrow {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        width: fit-content;
        padding: 10px 16px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.42);
        box-shadow: inset 0 0 0 1px var(--surface-stroke);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.12em;
        color: var(--text);
        text-transform: uppercase;
      }

      .eyebrow img {
        width: 18px;
        height: 18px;
      }

      h1 {
        margin: 30px 0 0;
        font-size: 64px;
        line-height: 0.94;
        letter-spacing: -0.06em;
        font-weight: 700;
        color: var(--text);
      }

      .subcopy {
        margin: 24px 0 0;
        max-width: 540px;
        font-size: 22px;
        line-height: 1.24;
        letter-spacing: -0.02em;
        color: var(--text-muted);
      }

      .subcopy.secondary {
        margin-top: 12px;
        color: var(--text-ghost);
      }

      .proof-strip {
        display: flex;
        gap: 12px;
        margin-top: 24px;
        flex-wrap: nowrap;
      }

      .proof-chip {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 12px 14px;
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.42);
        box-shadow: inset 0 0 0 1px var(--surface-stroke);
        font-size: 14px;
        font-weight: 600;
        color: var(--text);
        white-space: nowrap;
      }

      .proof-dot {
        width: 12px;
        height: 12px;
        border-radius: 999px;
        flex: 0 0 auto;
      }

      .actions {
        display: flex;
        align-items: center;
        margin-top: auto;
      }

      .cta {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
        min-width: 396px;
        padding: 18px 22px;
        border-radius: 22px;
        background: var(--cta-bg);
        color: var(--cta-text);
        font-size: 22px;
        font-weight: 700;
        letter-spacing: -0.03em;
      }

      .visual {
        position: relative;
        padding: 22px 20px 20px;
        border-radius: 34px;
        background: rgba(35, 31, 32, 0.96);
        color: #f8f3ef;
        overflow: hidden;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
      }

      .visual-header {
        margin-bottom: 18px;
      }

      .visual-eyebrow {
        margin: 0;
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(248, 243, 239, 0.64);
      }

      .visual-title {
        margin: 10px 0 0;
        font-size: 28px;
        line-height: 1.05;
        letter-spacing: -0.04em;
        font-weight: 700;
      }

      .desktop-wrap {
        position: relative;
        width: 344px;
        height: 252px;
        padding: 16px;
        border-radius: 28px;
        background: rgba(255, 255, 255, 0.08);
      }

      .desktop-frame {
        position: relative;
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: 24px;
        background: #fcf7f1;
        box-shadow: 0 18px 32px rgba(0, 0, 0, 0.24);
      }

      .desktop-frame::before {
        content: "";
        position: absolute;
        inset: 0 0 auto;
        height: 28px;
        background: #ede2d5;
        z-index: 2;
      }

      .traffic {
        position: absolute;
        top: 11px;
        left: 18px;
        display: flex;
        gap: 6px;
        z-index: 3;
      }

      .traffic span {
        width: 8px;
        height: 8px;
        border-radius: 999px;
      }

      .desktop-frame img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center top;
        display: block;
      }

      .phone {
        position: absolute;
        right: 14px;
        bottom: 10px;
        width: 112px;
        height: 228px;
        padding: 6px;
        border-radius: 30px;
        background: #fcf7f1;
        box-shadow: 0 20px 36px rgba(0, 0, 0, 0.26);
      }

      .phone::before {
        content: "";
        position: absolute;
        top: 14px;
        left: 50%;
        width: 44px;
        height: 10px;
        border-radius: 999px;
        background: #d7cdc1;
        transform: translateX(-50%);
        z-index: 3;
      }

      .phone img {
        width: 100%;
        height: 100%;
        border-radius: 24px;
        object-fit: cover;
        object-position: center top;
        display: block;
      }

      .note-card {
        position: absolute;
        left: 20px;
        bottom: 18px;
        width: 216px;
        padding: 16px 16px 14px;
        border-radius: 24px;
        background: rgba(255, 255, 255, 0.06);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
      }

      .note-card .label {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(248, 243, 239, 0.62);
      }

      .note-card p {
        margin: 10px 0 0;
        font-size: 18px;
        line-height: 1.15;
        letter-spacing: -0.03em;
        font-weight: 600;
      }

      .mini-stat {
        position: absolute;
        right: 18px;
        width: 122px;
        height: 44px;
        display: inline-flex;
        align-items: center;
        gap: 12px;
        padding: 0 14px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.07);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        font-size: 14px;
        font-weight: 600;
      }

      .mini-stat.one {
        bottom: 72px;
      }

      .mini-stat.two {
        bottom: 20px;
      }

      .mini-stat .dot {
        width: 12px;
        height: 12px;
        border-radius: 999px;
        flex: 0 0 auto;
      }
    </style>
  </head>
  <body>
    <main class="canvas">
      <section class="shell">
        <div class="copy">
          <div class="eyebrow">
            <img src="${logoHref}" alt="" />
            <span>DYRANE | SOLO PRODUCT ENGINEER</span>
          </div>

          <h1>
            Complex product?<br />
            Make it clear<br />
            before the call.
          </h1>

          <p class="subcopy">
            Websites, internal tools, and AI workflows for operations, clinical AI,
            fintech, and commerce.
          </p>
          <p class="subcopy secondary">For teams that need clarity, trust, and speed.</p>

          <div class="proof-strip">
            <div class="proof-chip">
              <span class="proof-dot" style="background: var(--cat-logistics);"></span>
              <span>${escapeHtml(commitCount)} commits shipped</span>
            </div>
            <div class="proof-chip">
              <span class="proof-dot" style="background: var(--cat-intelligence);"></span>
              <span>3 product lanes</span>
            </div>
            <div class="proof-chip">
              <span class="proof-dot" style="background: var(--cat-ux);"></span>
              <span>Strategy + design + code</span>
            </div>
          </div>

          <div class="actions">
            <div class="cta">
              <span>View case studies at dyrane.tech</span>
              <span>-></span>
            </div>
          </div>
        </div>

        <div class="visual">
          <div class="visual-header">
            <p class="visual-eyebrow">Selected surfaces</p>
            <h2 class="visual-title">Operations, AI, and commerce.</h2>
          </div>

          <div class="desktop-wrap">
            <div class="desktop-frame">
              <div class="traffic">
                <span style="background: var(--cat-ux);"></span>
                <span style="background: var(--cat-intelligence);"></span>
                <span style="background: var(--cat-logistics);"></span>
              </div>
              <img src="${desktopHref}" alt="" />
            </div>
          </div>

          <div class="phone">
            <img src="${mobileHref}" alt="" />
          </div>

          <div class="note-card">
            <div class="label">Why this works</div>
            <p>Clear message. Real surfaces.</p>
            <p>Stronger trust before contact.</p>
          </div>

          <div class="mini-stat one">
            <span class="dot" style="background: var(--cat-logistics);"></span>
            <span>${escapeHtml(commitCount)} commits</span>
          </div>

          <div class="mini-stat two">
            <span class="dot" style="background: var(--cat-ux);"></span>
            <span>Ship-ready proof</span>
          </div>
        </div>
      </section>
    </main>
  </body>
</html>`;

const chromeBinary = findChromeBinary();

if (!chromeBinary) {
  console.error("No Chrome or Edge executable found. Set CHROME_BIN to generate the OG image.");
  process.exit(1);
}

const browser = await puppeteer.launch({
  executablePath: chromeBinary,
  headless: true,
  args: ["--disable-gpu"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    const images = Array.from(document.images);
    await Promise.all(
      images.map((image) =>
        image.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              image.addEventListener("load", resolve, { once: true });
              image.addEventListener("error", resolve, { once: true });
            }),
      ),
    );
  });
  await page.screenshot({ path: outputPath });
} finally {
  await browser.close();
}

console.log(`Generated ${path.relative(rootDir, outputPath)}`);
