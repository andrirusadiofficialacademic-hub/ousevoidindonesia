export async function onRequest(context) {
  return new Response(JSON.stringify({ status: "Layanan Chat API Siap", pesan: "Belum ada implementasi socket." }), {
    headers: { "Content-Type": "application/json" }
  });
}
