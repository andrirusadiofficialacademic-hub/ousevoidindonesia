export async function onRequest(context) {
    const { request, env } = context;

    // GET: Dipakai buat nampilin produk di web utama
    if (request.method === "GET") {
        try {
            const { results } = await env.DB.prepare("SELECT * FROM produk ORDER BY id DESC").all();
            return new Response(JSON.stringify(results), { 
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
            });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    // POST: Dipakai buat nyimpen produk dari panel manajemen
    if (request.method === "POST") {
        try {
            const data = await request.json();
            const { nama, harga, stok, deskripsi, img_url } = data;

            await env.DB.prepare(
                "INSERT INTO produk (nama, harga, stok, deskripsi, img_url) VALUES (?, ?, ?, ?, ?)"
            ).bind(nama, parseInt(harga), parseInt(stok), deskripsi, img_url).run();

            return new Response(JSON.stringify({ sukses: true, pesan: "Produk berhasil disimpan!" }), { 
                headers: { "Content-Type": "application/json" } 
            });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }
}
