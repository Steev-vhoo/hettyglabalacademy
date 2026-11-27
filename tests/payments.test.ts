import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";

// payments.ts imports "server-only", which throws outside Next's server bundle; stub it for tests.
mock.module("server-only", { namedExports: {} });
const { paystackSignatureValid, stripeSignatureValid } = await import("../src/lib/payments.ts");
const { tiktokId } = await import("../src/lib/tiktok.ts");

test("Paystack signature: valid, tampered and missing", () => {
  const body = JSON.stringify({ event: "charge.success", data: { reference: "HGA-1" } });
  const sig = createHmac("sha512", "sk_test_x").update(body).digest("hex");
  assert.equal(paystackSignatureValid(body, sig, "sk_test_x"), true);
  assert.equal(paystackSignatureValid(body + " ", sig, "sk_test_x"), false);
  assert.equal(paystackSignatureValid(body, null, "sk_test_x"), false);
});

test("Stripe signature: valid, wrong secret, expired", () => {
  const body = '{"type":"checkout.session.completed"}';
  const t = 1_800_000_000;
  const v1 = createHmac("sha256", "whsec_abc").update(`${t}.${body}`).digest("hex");
  const header = `t=${t},v1=${v1}`;
  assert.equal(stripeSignatureValid(body, header, "whsec_abc", t + 10), true);
  assert.equal(stripeSignatureValid(body, header, "whsec_other", t + 10), false);
  assert.equal(stripeSignatureValid(body, header, "whsec_abc", t + 1000), false);
});

test("TikTok id parsing", () => {
  assert.equal(tiktokId("https://www.tiktok.com/@stylenurse1/video/7312345678901234567?lang=en"), "7312345678901234567");
  assert.equal(tiktokId("https://example.com/video/7312345678901234567"), null);
  assert.equal(tiktokId("not a url"), null);
});

test("TikTok short links are recognised", async () => {
  const { isTikTokShortLink, resolveTikTokUrl } = await import("../src/lib/tiktok.ts");
  assert.equal(isTikTokShortLink("https://vt.tiktok.com/ZSs2ASuhm/"), true);
  assert.equal(isTikTokShortLink("https://www.tiktok.com/t/ZT8abc/"), true);
  assert.equal(isTikTokShortLink("https://www.tiktok.com/@stylenurse1/video/7312345678901234567"), false);
  assert.equal(await resolveTikTokUrl("https://www.tiktok.com/@stylenurse1/video/7312345678901234567?lang=en"), "https://www.tiktok.com/@stylenurse1/video/7312345678901234567");
  assert.equal(await resolveTikTokUrl("https://example.com/x"), null);
});
