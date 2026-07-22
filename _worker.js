export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    try {
      // 1. ENDPOINT: LOGIN ADMIN
      if (url.pathname === "/api/login" && request.method === "POST") {
        const body = await request.json();
        
        // Cari admin di tabel users
        const stmt = env.DB.prepare("SELECT * FROM users WHERE username = ? AND password = ? AND pin = ?");
        const admin = await stmt.bind(body.username, body.password, body.pin).first();

        if (admin) {
          return new Response(JSON.stringify({ sukses: true }), { headers: { "Content-Type": "application/json" } });
        } else {
          return new Response(JSON.stringify({ sukses: false, error: "Kredensial salah" }), { status: 401, headers: { "Content-Type": "application/json" } });
        }
      }

      // 2. ENDPOINT: TARIK DATA PRODUK
      if (url.pathname === "/api/produk" && request.method === "GET") {
        const { results } = await env.DB.prepare("SELECT * FROM produk").all();
        return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
      }

      // 3. ENDPOINT: TAMBAH PRODUK DARI MANAJEMEN
      if (url.pathname === "/api/produk" && request.method === "POST") {
        const d = await request.json();
        const stmt = env.DB.prepare(
          "INSERT INTO produk (kategori, nama, harga, stok, deskripsi, img_url, variants) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        await stmt.bind(d.kategori, d.nama, d.harga, d.stok, d.deskripsi, d.img_url, d.variants).run();
        return new Response(JSON.stringify({ sukses: true }), { headers: { "Content-Type": "application/json" } });
      }

      // 4. JIKA BUKAN REQUEST API, KEMBALIKAN HALAMAN HTML (ASSETS)
      // Ini wajib agar index.html dan manajemen.html tetep bisa diakses
      return env.ASSETS.fetch(request);

    } catch (err) {
      return new Response(JSON.stringify({ sukses: false, error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
  }
};
