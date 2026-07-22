export async function onRequestGet(context) {
  try {
    const db = context.env.DB;
    if (!db) return new Response(JSON.stringify([]), { headers: { "Content-Type": "application/json" } });
    
    // Tarik semua data dari tabel produk
    const { results } = await db.prepare("SELECT * FROM produk").all();
    return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const db = env.DB;
    if (!db) return new Response(JSON.stringify({ sukses: false, error: "DB belum terhubung" }), { status: 500, headers: { "Content-Type": "application/json" } });
    
    const d = await request.json();
    const stmt = db.prepare("INSERT INTO produk (kategori, nama, harga, stok, deskripsi, img_url, variants) VALUES (?, ?, ?, ?, ?, ?, ?)");
    await stmt.bind(d.kategori, d.nama, d.harga, d.stok, d.deskripsi, d.img_url, d.variants).run();
    
    return new Response(JSON.stringify({ sukses: true }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ sukses: false, error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
