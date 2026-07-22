export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      // 1. ENDPOINT: LOGIN MENGGUNAKAN ENVIRONMENT SECRETS
      if (url.pathname === "/api/login" && request.method === "POST") {
        const body = await request.json();
        
        // Mengambil data dari Environment Secrets Cloudflare
        const validUser = env.ADMIN_USERNAME || "admin";
        const validPass = env.ADMIN_PASSWORD || "ousevoid2026";
        const validPin  = env.ADMIN_PIN || "123456";

        if (body.username === validUser && body.password === validPass && body.pin === validPin) {
          return new Response(JSON.stringify({ sukses: true }), { headers: { "Content-Type": "application/json" } });
        } else {
          return new Response(JSON.stringify({ sukses: false, error: "Kredensial tidak valid" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }
      }

      // 2. ENDPOINT: PRODUK (Tetap pakai database D1 "DB" kalau produknya di D1)
      const db = env.DB;
      if (url.pathname === "/api/produk" && request.method === "GET") {
        if (!db) return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
        const { results } = await db.prepare("SELECT * FROM produk").all();
        return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
      }

      if (url.pathname === "/api/produk" && request.method === "POST") {
        if (!db) return new Response(JSON.stringify({ sukses: false, error: "DB belum terhubung" }), { status: 500 });
        const d = await request.json();
        const stmt = db.prepare("INSERT INTO produk (kategori, nama, harga, stok, deskripsi, img_url, variants) VALUES (?, ?, ?, ?, ?, ?, ?)");
        await stmt.bind(d.kategori, d.nama, d.harga, d.stok, d.deskripsi, d.img_url, d.variants).run();
        return new Response(JSON.stringify({ sukses: true }), { headers: { "Content-Type": "application/json" } });
      }

      return env.ASSETS ? env.ASSETS.fetch(request) : new Response("Not Found", { status: 404 });

    } catch (err) {
      return new Response(JSON.stringify({ sukses: false, error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  }
};
