// Data barang (harga bisa diubah pengguna di form)
const barang = [
  { id: "motor",  nama: "Motor",  ikon: "🏍️", harga: 20000000 },
  { id: "mobil",  nama: "Mobil",  ikon: "🚗", harga: 250000000 },
  { id: "kulkas", nama: "Kulkas", ikon: "🧊", harga: 5000000 },
  { id: "laptop", nama: "Laptop", ikon: "💻", harga: 10000000 }
];

const rp = (n) => "Rp " + Math.round(n).toLocaleString("id-ID");
const $ = (id) => document.getElementById(id);

const wadah = $("items");
const kalkulator = $("kalkulator");
const hasil = $("hasil");
let dipilih = null;

// Tampilkan kartu barang
barang.forEach((b) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "item";
  btn.setAttribute("role", "radio");
  btn.setAttribute("aria-checked", "false");
  btn.dataset.id = b.id;
  btn.innerHTML = `<span class="ico" aria-hidden="true">${b.ikon}</span><strong>${b.nama}</strong><span class="p">${rp(b.harga)}</span>`;
  btn.addEventListener("click", () => pilih(b.id));
  wadah.appendChild(btn);
});

function pilih(id) {
  dipilih = barang.find((b) => b.id === id);
  document.querySelectorAll(".item").forEach((el) =>
    el.setAttribute("aria-checked", el.dataset.id === id ? "true" : "false")
  );
  $("namaBarang").textContent = dipilih.nama;
  $("harga").value = dipilih.harga;
  $("error").textContent = "";
  hasil.hidden = true;
  kalkulator.hidden = false; // fitur baru muncul setelah barang dipilih
  kalkulator.scrollIntoView({ behavior: "smooth", block: "start" });
}

$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const harga = parseFloat($("harga").value);
  const dp = parseFloat($("dp").value);
  const bunga = parseFloat($("bunga").value);
  const tenor = parseInt($("tenor").value, 10);

  if (!(harga > 0)) return tampilError("Harga barang harus lebih dari 0.");
  if (isNaN(dp) || dp < 0 || dp > 90) return tampilError("DP harus antara 0 sampai 90 persen.");
  if (isNaN(bunga) || bunga < 0) return tampilError("Bunga tidak boleh kosong atau negatif.");
  $("error").textContent = "";

  const uangMuka = harga * (dp / 100);
  const pokok = harga - uangMuka;
  const totalBunga = pokok * (bunga / 100) * (tenor / 12); // bunga flat
  const cicilan = (pokok + totalBunga) / tenor;

  $("cicilan").textContent = rp(cicilan);
  $("rHarga").textContent = rp(harga);
  $("rDp").textContent = rp(uangMuka);
  $("rPokok").textContent = rp(pokok);
  $("rBunga").textContent = rp(totalBunga);
  $("rTotal").textContent = rp(uangMuka + pokok + totalBunga);
  hasil.hidden = false;
});

function tampilError(pesan) {
  $("error").textContent = pesan;
  hasil.hidden = true;
}

// Kembali ke pilihan barang
$("reset").addEventListener("click", () => {
  dipilih = null;
  kalkulator.hidden = true;
  hasil.hidden = true;
  document.querySelectorAll(".item").forEach((el) => el.setAttribute("aria-checked", "false"));
  window.scrollTo({ top: 0, behavior: "smooth" });
});
