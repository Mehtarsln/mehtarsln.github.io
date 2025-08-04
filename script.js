// Sayfa yüklendiğinde tüm işlemleri başlat
document.addEventListener('DOMContentLoaded', () => {

  // --- ŞABLON SEÇİMİYLE İLGİLİ KISIMLAR ---
  
  // Şablon kartlarını DOM'dan seçiyoruz
  const tplCards = {
    1: document.getElementById('tpl1-card'),
    2: document.getElementById('tpl2-card'),
    3: document.getElementById('tpl3-card')
  };

  // Önizleme için arka plan ve yazı katmanı
  const previewBg = document.getElementById('preview-bg');
  const textLayer = document.getElementById('text-layer');
  const inputFoto = document.getElementById('input-foto');

  let selectedTemplate = 1;         // Varsayılan olarak 1. şablon seçili
  let photoDataURL = '';            // Kullanıcının yüklediği fotoğrafın Base64 verisi

  // --- FORM ve BİLDİRİM KISMI ---

  const form = document.getElementById("basvuru-form");              // Başvuru formu
  const bildirim = document.getElementById("basvuru-bildirim");      // Bildirim alanı (başarı mesajı için)

  // Bildirimi göstermek için kullanılan fonksiyon
  function showNotification() {
    bildirim.classList.remove("hidden");
    bildirim.classList.add("opacity-100");

    // 3 saniye sonra yavaşça kaybolacak
    setTimeout(() => {
      bildirim.classList.remove("opacity-100");
      setTimeout(() => {
        bildirim.classList.add("hidden");
      }, 500);
    }, 3000);
  }

  // Form gönderildiğinde yapılacak işlemler
  form.addEventListener("submit", (e) => {
    // HTML form doğrulamasını çalıştır
    if (!form.checkValidity()) {
      e.preventDefault();          // Formu gönderme
      form.reportValidity();       // Tarayıcı uyarısı çıkar
      return;
    }

    e.preventDefault();            // Sayfanın yenilenmesini önle

    // Bildirim göster ve formu temizle
    showNotification();
    form.reset();
  });

  // --- ŞABLON SEÇİMİ ve GÖRÜNÜM GÜNCELLEME ---

  // Şablon seçildiğinde arka planı değiştir ve önizlemeyi güncelle
  function selectTemplate(num) {
    selectedTemplate = num;
    for (const key in tplCards) {
      tplCards[key].classList.toggle('selected', Number(key) === num);
    }
    previewBg.src = `img/CV${num}.png`;
    updatePreview();
  }

  // Kullanıcının girdiği bilgilerle önizleme alanını güncelle
  function updatePreview() {
    const adsoyad = document.getElementById('input-adsoyad').value.trim() || 'Ad Soyad';
    const telefon = document.getElementById('input-telefon').value.trim() || 'Telefon';
    const hakkimda = document.getElementById('input-hakkimda').value.trim() || 'Hakkımda';
    const egitim = document.getElementById('input-egitim').value.trim() || 'Eğitim Bilgileri';
    const deneyim = document.getElementById('input-deneyim').value.trim() || 'Deneyim Bilgileri';
    const yetenek = document.getElementById('input-yetenek').value.trim() || 'Yetenekler';

    // Fotoğraf varsa yükle, yoksa boş bırak
    if (inputFoto && inputFoto.files && inputFoto.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        photoDataURL = e.target.result;
        renderPreview(adsoyad, telefon, hakkimda, egitim, deneyim, yetenek, photoDataURL);
      };
      reader.readAsDataURL(inputFoto.files[0]);
    } else {
      renderPreview(adsoyad, telefon, hakkimda, egitim, deneyim, yetenek, '');
    }
  }

  // Önizleme katmanına verileri bas
  function renderPreview(adsoyad, telefon, hakkimda, egitim, deneyim, yetenek, fotoData) {
    textLayer.innerHTML = `
      <h1 style="position:absolute; top:150px; left:40px; font-size: 24px; font-weight: bold; text-align: left; width: 50%;">${adsoyad}</h1>
      <strong style="position:absolute; top:190px; left:40px;">Hakkımda</strong>
      <p style="position:absolute; top:210px; left:40px; width: 50%;">${hakkimda}</p>
      <strong style="position:absolute; top:280px; left:40px;">Eğitim Bilgileri</strong>
      <p style="position:absolute; top:300px; left:40px; width: 50%;">${egitim}</p>
      <strong style="position:absolute; top:370px; left:40px;">Deneyim Bilgileri</strong>
      <p style="position:absolute; top:390px; left:40px; width: 50%;">${deneyim}</p>
      <strong style="position:absolute; top:460px; left:40px;">Sertifikalar</strong>
      <p style="position:absolute; top:480px; left:40px; width: 50%;">${yetenek}</p>
      <p style="position:absolute; top:550px; left:40px; font-weight: bold;">İletişim Bilgileri: ${telefon}</p>
      ${fotoData ? `<img src="${fotoData}" alt="Fotoğraf" style="position:absolute; top:140px; right:20px; width:120px; height:140px; object-fit: cover; border-radius: 8px; border: 2px solid #1e3a8a;">` : ''}
    `;
  }

  // --- PDF İNDİRME ---

  function downloadPDF() {
    const element = document.getElementById('preview');

    // PDF'e düzgün dönüşüm için geçici stil ayarı
    previewBg.style.position = 'static';
    textLayer.style.position = 'static';

    const opt = {
      margin: 0,
      filename: 'cv.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      // PDF sonrası stilleri eski haline döndür
      previewBg.style.position = 'absolute';
      textLayer.style.position = 'absolute';
    });
  }

  // Sayfa ilk açıldığında varsayılan şablonu seç
  selectTemplate(selectedTemplate);

  // Her şablon kartına tıklanabilirlik ekle
  for (const key in tplCards) {
    if (tplCards[key]) {
      tplCards[key].addEventListener('click', () => selectTemplate(Number(key)));
      tplCards[key].addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectTemplate(Number(key));
        }
      });
    }
  }

  // CV formundaki bilgiler değiştiğinde anlık önizleme
  const cvForm = document.getElementById('cv-form');
  if (cvForm) {
    cvForm.addEventListener('input', updatePreview);
  }

  // Fotoğraf değişince önizlemeyi güncelle
  if (inputFoto) {
    inputFoto.addEventListener('change', updatePreview);
  }

  // PDF indir butonuna tıklanınca indirme işlemini başlat
  const btnDownload = document.getElementById('btn-download');
  if (btnDownload) {
    btnDownload.addEventListener('click', downloadPDF);
  }
});
