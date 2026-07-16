export async function onRequestPost(context) {
    try {
        // 1. Tangkap data pesanan dari index.html
        const requestData = await context.request.json();
        
        // 2. Ambil Kunci Rahasia dari Brankas Cloudflare
        const serverKey = context.env.MIDTRANS_SERVER_KEY;
        const encodedKey = btoa(serverKey + ":"); // Format rahasia Midtrans
        const orderId = "OUSEVOID-" + Date.now(); // Bikin ID pesanan unik

        // 3. Siapkan paket data buat dikirim ke Midtrans
        let payload = {
            payment_type: requestData.metode,
            transaction_details: {
                order_id: orderId,
                gross_amount: requestData.total
            },
            customer_details: {
                first_name: requestData.nama,
                email: requestData.email,
                phone: requestData.wa
            }
        };

        // 4. Aturan Khusus untuk Transfer Bank (VA)
        if (requestData.metode === "bca_va") {
            payload.payment_type = "bank_transfer";
            payload.bank_transfer = { bank: "bca" };
        } else if (requestData.metode === "mandiri_va") {
            payload.payment_type = "echannel";
            payload.echannel = { bill_info1: "Ousevoid", bill_info2: "Payment" };
        } else if (requestData.metode === "echannel") {
            payload.payment_type = "bank_transfer";
            payload.bank_transfer = { bank: "bni" };
        }

        // 5. Tembak ke Core API Midtrans (Mode Sandbox/Testing)
        // Kalau udah mau jualan beneran, ganti linknya jadi: https://api.midtrans.com/v2/charge
        const response = await fetch("https://api.sandbox.midtrans.com/v2/charge", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Basic " + encodedKey
            },
            body: JSON.stringify(payload)
        });

        const midtransResult = await response.json();
        let resultToFrontend = {};

        // 6. Sortir Balasan Midtrans untuk dilempar balik ke HP Pembeli
        if (requestData.metode === "gopay" || requestData.metode === "shopeepay") {
            // Cari link rahasia (deeplink) buat buka aplikasi
            if (midtransResult.actions) {
                const deeplinkAction = midtransResult.actions.find(action => action.name === "deeplink-redirect");
                if (deeplinkAction) {
                    resultToFrontend.deeplink_url = deeplinkAction.url;
                }
            }
        } 
        else if (requestData.metode === "bca_va" || requestData.metode === "echannel") {
            if (midtransResult.va_numbers && midtransResult.va_numbers.length > 0) {
                resultToFrontend.va_number = midtransResult.va_numbers[0].va_number;
            }
        } 
        else if (requestData.metode === "mandiri_va") {
            resultToFrontend.va_number = midtransResult.bill_key; // Mandiri kodenya beda sendiri
        } 
        else if (requestData.metode === "qris") {
            if (midtransResult.actions) {
                const qrAction = midtransResult.actions.find(action => action.name === "generate-qr-code");
                if (qrAction) resultToFrontend.deeplink_url = qrAction.url; // Langsung arahin ke gambar QR
            }
        }

        if (Object.keys(resultToFrontend).length === 0) {
            resultToFrontend.error = "Gagal memproses metode pembayaran ini.";
        }

        // 7. Kirim kembali ke index.html
        return new Response(JSON.stringify(resultToFrontend), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { "Content-Type": "application/json" },
            status: 500
        });
    }
}
