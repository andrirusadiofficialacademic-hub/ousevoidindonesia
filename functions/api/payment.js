export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    const body = await request.json(); // Data pesanan dari index.html

    // Cek apakah key Midtrans udah dipasang di Cloudflare Secret
    const serverKey = env.MIDTRANS_SERVER_KEY;
    if (!serverKey) {
      return new Response(JSON.stringify({ error: "Server Key Midtrans belum di-set di Cloudflare" }), { status: 500 });
    }

    // Encoding Server Key Midtrans untuk header Auth
    const encodedKey = btoa(serverKey + ":");

    // Persiapan data untuk dilempar ke Midtrans
    const midtransPayload = {
      transaction_details: {
        order_id: body.idTrx,
        gross_amount: body.total
      },
      customer_details: {
        first_name: body.nama,
        email: body.email,
        phone: body.wa
      }
    };

    // Eksekusi (Fetch) ke API Midtrans SNAP (Pakai Sandbox untuk tes, ubah ke /v1/ nanti kalau live beneran)
    const midtransResponse = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Basic " + encodedKey
      },
      body: JSON.stringify(midtransPayload)
    });

    const midtransData = await midtransResponse.json();

    // Kembalikan redirect URL ke index.html supaya pembeli masuk ke layar bayar
    if (midtransData.redirect_url) {
      return new Response(JSON.stringify({ redirect_url: midtransData.redirect_url }), { headers: { "Content-Type": "application/json" } });
    } else {
      return new Response(JSON.stringify({ error: "Gagal membuat transaksi", detail: midtransData }), { status: 400 });
    }

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
