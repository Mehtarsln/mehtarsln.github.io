document.addEventListener('DOMContentLoaded', () => {
  // Şablon kartları
  const tplCards = {
    1: document.getElementById('tpl1-card'),
    2: document.getElementById('tpl2-card'),
    3: document.getElementById('tpl3-card')
  };

  const previewBg = document.getElementById('preview-bg');
  const textLayer = document.getElementById('text-layer');
  const inputFoto = document.getElementById('input-foto');

  let selectedTemplate = 1;
  let photoDataURL = '';

  // Şablon seçimi fonksiyonu
  function selectTemplate(num) {
    selectedTemplate = num;
    for (const key in tplCards) {
      if (Number(key) === num) {
        tplCards[key].classList.add('selected');
      } else {
        tplCards[key].classList.remove('selected');
      }
    }
    previewBg.src = `img/CV${num}.png`;
    updatePreview();
  }

  // Önizleme güncelleme
  function updatePreview() {
    const adsoyad = document.getElementById('input-adsoyad').value.trim() || 'Ad Soyad';
    const telefon = document.getElementById('input-telefon').value.trim() || 'Telefon';
    const hakkimda = document.getElementById('input-hakkimda').value.trim() || 'Hakkımda';
    const egitim = document.getElementById('input-egitim').value.trim() || 'Eğitim Bilgileri';
    const deneyim = document.getElementById('input-deneyim').value.trim() || 'Deneyim Bilgileri';
    const yetenek = document.getElementById('input-yetenek').value.trim() || 'Yetenekler';

    if (inputFoto && inputFoto.files && inputFoto.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        photoDataURL = e.target.result;
        renderPreview(adsoyad, telefon, hakkimda, egitim, deneyim, yetenek, photoDataURL);
      };
      reader.readAsDataURL(inputFoto.files[0]);
    } else {
      photoDataURL = '';
      renderPreview(adsoyad, telefon, hakkimda, egitim, deneyim, yetenek, '');
    }
  }

  // Önizleme render fonksiyonu
  function renderPreview(adsoyad, telefon, hakkimda, egitim, deneyim, yetenek, fotoData) {
  textLayer.innerHTML = `
    <h1 style="position:absolute; top:150px; left:40px; font-size: 24px; font-weight: bold; text-align: left; width: 50%;">${adsoyad}</h1>

    <strong style="position:absolute; top:190px; left:40px; text-align: left; width: 50%;">Hakkımda</strong>
    <p style="position:absolute; top:210px; left:40px; white-space: pre-wrap; text-align: left; width: 50%;">${hakkimda}</p>

    <strong style="position:absolute; top:280px; left:40px; text-align: left; width: 50%;">Eğitim Bilgileri</strong>
    <p style="position:absolute; top:300px; left:40px; white-space: pre-wrap; text-align: left; width: 50%;">${egitim}</p>

    <strong style="position:absolute; top:370px; left:40px; text-align: left; width: 50%;">Deneyim Bilgileri</strong>
    <p style="position:absolute; top:390px; left:40px; white-space: pre-wrap; text-align: left; width: 50%;">${deneyim}</p>

    <strong style="position:absolute; top:460px; left:40px; text-align: left; width: 50%;">Sertifikalar</strong>
    <p style="position:absolute; top:480px; left:40px; white-space: pre-wrap; text-align: left; width: 50%;">${yetenek}</p>

    <p style="position:absolute; top:550px; left:40px; white-space: pre-wrap; text-align: left; width: 50%; font-weight: bold;">İletişim Bilgileri: ${telefon}</p>

    ${fotoData ? `<img src="${fotoData}" alt="Fotoğraf" style="position:absolute; top:140px; right:20px; width:120px; height:140px; object-fit: cover; border-radius: 8px; border: 2px solid #1e3a8a;">` : ''}
  `;
}


  // PDF indir fonksiyonu
  function downloadPDF() {
    const element = document.getElementById('preview');
    // html2pdf için pozisyonları resetle
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
      // PDF sonrası pozisyonları eski haline getir
      previewBg.style.position = 'absolute';
      textLayer.style.position = 'absolute';
    }).catch(err => console.error("PDF oluşturma hatası:", err));
  }

  // Başlangıçta seçili şablonu göster
  selectTemplate(selectedTemplate);

  // Event listenerlar

  // Şablon kartlarına tıklama ve klavye ile seçme
  for (const key in tplCards) {
    if (tplCards[key]) {
      tplCards[key].addEventListener('click', () => {
        selectTemplate(Number(key));
      });
      tplCards[key].addEventListener('keydown', (e) => {
        if(e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectTemplate(Number(key));
        }
      });
    }
  }

  // Form inputlarında değişiklikte önizlemeyi güncelle
  const cvForm = document.getElementById('cv-form');
  if (cvForm) {
    cvForm.addEventListener('input', updatePreview);
  }

  // Fotoğraf input değişince önizleme güncelle
  if (inputFoto) {
    inputFoto.addEventListener('change', updatePreview);
  }

  // PDF indir butonu
  const btnDownload = document.getElementById('btn-download');
  if (btnDownload) {
    btnDownload.addEventListener('click', downloadPDF);
  }
});
