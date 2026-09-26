// Notify IndexNow (Bing, Yandex, Naver, Seznam…) of every URL in the live
// sitemap. Run after a production deploy by .github/workflows/indexnow.yml,
// or manually: node scripts/indexnow.js
//
// The key is public by design: search engines verify it by fetching
// https://provisoreview.com/<KEY>.txt, which is passthrough-copied from the
// repo root (see .eleventy.js).
const KEY = "b0c0a93db5c2f2c7e3ec82f1d858f982";
const HOST = "provisoreview.com";
const SITEMAP = `https://${HOST}/sitemap.xml`;

async function main() {
  const res = await fetch(SITEMAP);
  if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  if (urlList.length === 0) throw new Error("No <loc> entries in sitemap");

  const submit = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList,
    }),
  });

  // 200 = accepted, 202 = accepted while the key is still being verified.
  console.log(`IndexNow: ${submit.status} for ${urlList.length} URLs`);
  if (submit.status >= 400) {
    console.error(await submit.text());
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
