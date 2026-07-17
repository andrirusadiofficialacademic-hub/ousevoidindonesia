<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ousevoid | Login Otoritas</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            margin: 0;
            font-family: 'Inter', sans-serif;
            background-color: #f8f9fa;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: hidden;
            position: relative;
        }

        .bg-animation {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            z-index: 1; opacity: 0.03;
        }
        .floating-logo {
            position: absolute;
            background-image: url('https://i.ibb.co.com/x8MrtzXr/8588.png');
            background-size: contain; background-repeat: no-repeat;
            filter: blur(8px); animation: drift linear infinite;
        }
        @keyframes drift {
            0% { transform: translate(-100px, 0) rotate(0deg); }
            100% { transform: translate(calc(100vw + 100px), 20px) rotate(5deg); }
        }

        .login-container {
            width: 100%;
            max-width: 360px; /* Lebar dikecilin dikit biar proporsional sama tingginya */
            padding: 15px;
            box-sizing: border-box;
            z-index: 10;
        }

        .login-card {
            background: #ffffff;
            padding: 30px 25px; /* Jarak atas bawah dipangkas biar makin pendek */
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
            text-align: center;
        }

        .logo-main { width: 90px; margin-bottom: 15px; } /* Logo dikecilin */
        .title { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
        .input-group { text-align: left; margin-bottom: 12px; } /* Jarak antar kolom dirapatkan */
        .label { display: block; font-size: 10px; font-weight: 700; color: #4a5568; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .input-box { 
            width: 100%; 
            padding: 10px 12px; /* Input box dipendekin */
            border: 1px solid #cbd5e1; 
            border-radius: 6px; 
            font-family: 'Inter', sans-serif; 
            font-size: 13px; 
            box-sizing: border-box; 
            background: #f8fafc; 
            transition: all 0.2s ease; 
        }
        
        .input-box:focus { border-color: #111; background: #fff; outline: none; }
        
        .btn-login { 
            width: 100%; background: #111; color: #fff; border: none; 
            padding: 12px; /* Tombol dipendekin dikit */
            border-radius: 6px; font-weight: 700; font-size: 13px; 
            cursor: pointer; margin-top: 10px; transition: 0.2s; 
        }
        .btn-login:hover { background: #333; }
    </style>
</head>
<body>
    <div class="bg-animation">
        <div class="floating-logo" style="width: 300px; height: 300px; top: 15%; animation-duration: 60s;"></div>
        <div class="floating-logo" style="width: 450px; height: 450px; top: 45%; animation-duration: 80s; animation-delay: -20s;"></div>
    </div>

    <div class="login-container">
        <div class="login-card">
            <img src="https://i.ibb.co.com/x8MrtzXr/8588.png" alt="Ousevoid" class="logo-main">
            <div class="title">Control Center Login</div>
            
            <div class="input-group">
                <label class="label">Username</label>
                <input type="text" id="username" class="input-box" placeholder="Masukkan username">
            </div>
            
            <div class="input-group">
                <label class="label">Password</label>
                <input type="password" id="password" class="input-box" placeholder="••••••••">
            </div>

            <div class="input-group">
                <label class="label">PIN Keamanan</label>
                <input type="password" id="pin" class="input-box" maxlength="6" placeholder="••••••">
            </div>

            <button class="btn-login" onclick="prosesLogin()">Masuk Sistem</button>
        </div>
    </div>

    <script>
        async function prosesLogin() {
            var user = document.getElementById('username').value;
            var pass = document.getElementById('password').value;
            var pin = document.getElementById('pin').value;

            if (!user || !pass || !pin) { alert("Mohon isi semua data login terlebih dahulu!"); return; }

            try {
                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: user, password: pass, pin: pin })
                });

                const hasil = await response.json();

                if (hasil.sukses) {
                    localStorage.setItem("session_ousevoid", hasil.token);
                    window.location.href = "/manajemen"; 
                } else {
                    alert("Kredensial salah! Akses ditolak.");
                }
            } catch (err) { alert("Terjadi gangguan koneksi ke server keamanan."); }
        }
    </script>
</body>
</html>
