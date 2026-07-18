export async function onRequestPost({ request, env }) {
    try {
        // Menerima data dari halaman login (frontend)
        const body = await request.json();
        const { username, password, pin } = body;

        // AMAN DARI ERROR: Mengambil rahasia dari Dashboard Cloudflare
        // Jika di dashboard lu belum di-set, dia akan otomatis pakai cadangan di sebelah kanan ('admin', dll)
        const validUser = env.ADMIN_USERNAME || "admin";
        const validPass = env.ADMIN_PASSWORD || "ousevoid2026";
        const validPin = env.ADMIN_PIN || "123456";

        // Proses pencocokan data
        if (username === validUser && password === validPass && pin === validPin) {
            // Jika berhasil, kirim kunci (token) rahasia
            return new Response(JSON.stringify({ 
                sukses: true, 
                token: "OV-AUTH-" + Date.now() 
            }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } else {
            // Jika salah password/pin
            return new Response(JSON.stringify({ 
                sukses: false, 
                pesan: "Kredensial tidak valid" 
            }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }

    } catch (error) {
        // Jaring pengaman terakhir agar Cloudflare tidak memunculkan Error 500
        return new Response(JSON.stringify({ 
            sukses: false, 
            pesan: "Gagal memproses data" 
        }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }
}
