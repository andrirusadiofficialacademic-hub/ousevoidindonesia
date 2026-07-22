export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json();

    // Ambil data rahasia dari Environment Variables Cloudflare lu
    const validUser = env.ADMIN_USERNAME || "admin";
    const validPass = env.ADMIN_PASSWORD || "ousevoid2026";
    const validPin  = env.ADMIN_PIN || "123456";

    if (body.username === validUser && body.password === validPass && body.pin === validPin) {
      return new Response(JSON.stringify({ sukses: true }), { headers: { "Content-Type": "application/json" } });
    } else {
      return new Response(JSON.stringify({ sukses: false, error: "Kredensial tidak valid" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }
  } catch (err) {
    return new Response(JSON.stringify({ sukses: false, error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
