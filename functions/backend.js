export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const data = await request.json();
    
    // URL Midtrans (Pastikan ini URL Production/Asli)
    const url = "https://app.midtrans.com/snap/v1/transactions";

    // Minta link ke Midtrans
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Ini otomatis ngambil kunci dari Environment Variables Cloudflare lu!
        "Authorization": "Basic " + btoa(env.MIDTRANS_SERVER_KEY + ":")
      },
      body: JSON.stringify({
        transaction_details: {
          order_id: "OUSE-" + Date.now(), // Bikin ID unik tiap transaksi
          gross_amount: data.total
        },
        customer_details: {
          first_name: data.nama,
          phone: data.wa,
          email: data.email
        }
      })
    });

    const result = await response.json();

    // Balikin link bayarnya ke web lu
    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    // Kalau ada error, kasih tau webnya
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
