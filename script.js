const token = '7533623731:AAEOfprbcXTbUNru1W833tX-VOvxzk11Qyc';

function formatNumberInput(input) {
    const value = input.value.replace(/\D/g, '');
    input.value = new Intl.NumberFormat('en-US').format(value);
}

function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) == 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return "";
}

document.getElementById('add-product').addEventListener('click', (event) => {
    event.preventDefault();
    const container = document.getElementById('product-container');
    const productDiv = document.createElement('div');
    productDiv.className = 'product form-group';
    productDiv.innerHTML = `
        <label>Nama Produk: </label>
        <input type="text" class="product-name" placeholder="Masukan nama produk">
        <label>Harga: </label>
        <input type="text" class="price formatted-input" placeholder="Masukan harga" oninput="formatNumberInput(this)" inputmode="numeric">
        <label>Jumlah: </label>
        <input type="number" class="quantity" placeholder="Jumlah produk" min="0" step="1" inputmode="numeric">
    `;
    container.appendChild(productDiv);
});

document.getElementById('calculate-total').addEventListener('click', (event) => {
    event.preventDefault();
    let total = 0;
    const prices = document.querySelectorAll('.price');
    const quantities = document.querySelectorAll('.quantity');

    prices.forEach((priceInput, index) => {
        const price = parseFloat(priceInput.value.replace(/,/g, '')) || 0;
        const quantity = parseInt(quantities[index].value) || 0;
        total += price * quantity;
    });

    document.getElementById('total-amount').textContent = formatNumber(total.toFixed(2));
    document.getElementById('send-to-bot').style.display = 'inline-block';
});

document.getElementById('calculate-change').addEventListener('click', (event) => {
    event.preventDefault();
    const total = parseFloat(document.getElementById('total-amount').textContent.replace(/,/g, '')) || 0;
    const cashGiven = parseFloat(document.getElementById('cash-given').value.replace(/,/g, '')) || 0;
    const change = cashGiven - total;
    document.getElementById('change').textContent = change >= 0 ? formatNumber(change.toFixed(2)) : `Kurang ${formatNumber(Math.abs(change).toFixed(2))}`;
});

document.getElementById('send-to-bot').addEventListener('click', (event) => {
    event.preventDefault();
    let message = 'Struk Belanja:\n\n';
    const productNames = document.querySelectorAll('.product-name');
    const prices = document.querySelectorAll('.price');
    const quantities = document.querySelectorAll('.quantity');

    productNames.forEach((nameInput, index) => {
        const name = nameInput.value || 'N/A';
        const price = prices[index].value || '0';
        const quantity = quantities[index].value || '0';
        message += `Nama Produk: ${name}\nHarga: ${price}\nJumlah: ${quantity}\n\n`;
    });

    const totalAmount = document.getElementById('total-amount').textContent;
    const cashGiven = document.getElementById('cash-given').value || '0';
    const change = document.getElementById('change').textContent || '0';
    const dateTime = new Date().toLocaleString();
    message += `Jumlah Total: ${totalAmount}\nUang Cash: ${cashGiven}\nKembalian: ${change}\n\nTanggal & Waktu: ${dateTime}\n`;

    const chatId = getCookie('chatId');
    if (!chatId) {
        Swal.fire({
            title: 'Chat ID tidak ditemukan',
            text: 'Silakan jalankan miniapp ini dari bot Telegram.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message
        })
    }).then(response => response.json())
      .then(data => {
          if (data.ok) {
              Swal.fire('Success', 'Data berhasil dikirim ke bot!', 'success');
          } else {
              Swal.fire({
                  title: 'Error',
                  text: 'Gagal mengirim data ke bot. Periksa kembali Chat ID telegram anda!',
                  icon: 'error',
                  confirmButtonText: 'OK'
              });
          }
      });
});

document.querySelectorAll('.formatted-input').forEach(input => {
    input.addEventListener('input', () => formatNumberInput(input));
});

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
    });
});