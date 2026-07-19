export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);

    // MENGAMBIL PESAN DARI DATABASE (READ)
    if (request.method === "GET") {
        const session_id = url.searchParams.get("session_id");
        if (!session_id) return new Response(JSON.stringify([]), { status: 200 });

        try {
            const { results } = await env.DB.prepare(
                "SELECT * FROM pesan_chat WHERE session_id = ? ORDER BY waktu ASC"
            ).bind(session_id).all();
            
            return new Response(JSON.stringify(results), { 
                headers: { "Content-Type": "application/json" } 
            });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    // MENGIRIM PESAN KE DATABASE (CREATE)
    if (request.method === "POST") {
        try {
            const data = await request.json();
            const { session_id, nama, pesan, is_admin } = data;

            await env.DB.prepare(
                "INSERT INTO pesan_chat (session_id, nama_pengirim, pesan, is_admin) VALUES (?, ?, ?, ?)"
            ).bind(session_id, nama || "Pelanggan", pesan, is_admin || 0).run();

            return new Response(JSON.stringify({ sukses: true }), { 
                headers: { "Content-Type": "application/json" } 
            });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }
}
