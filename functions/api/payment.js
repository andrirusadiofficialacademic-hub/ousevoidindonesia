export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Metode tidak diizinkan' });

    const { id_trx, nama, email, total } = req.body;

    const payload = {
        transaction_details: { order_id: id_trx, gross_amount: total },
        customer_details: { first_name: nama, email: email }
    };

    try {
        const response = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // Kunci ini otomatis ditarik dari settingan Vercel lu tadi
                'Authorization': 'Basic ' + Buffer.from(process.env.MIDTRANS_SERVER_KEY + ':').toString('base64') 
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        res.status(200).json({ token: data.token, redirect_url: data.redirect_url });
        
    } catch (error) {
        res.status(500).json({ error: 'Gagal menghubungi Midtrans' });
    }
}
