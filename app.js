document.addEventListener('DOMContentLoaded', function () {
    const uploadSection = document.getElementById('uploadSection');
    const editorSection = document.getElementById('editorSection');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewCanvas = document.getElementById('previewCanvas');
    const downloadBtn = document.getElementById('downloadBtn');
    const changeImageBtn = document.getElementById('changeImageBtn');
    const textColorInput = document.getElementById('textColor');
    const bgColorInput = document.getElementById('bgColor');
    const bgOpacityInput = document.getElementById('bgOpacity');
    const overlayOpacityInput = document.getElementById('overlayOpacity');
    const bgOpacityValue = document.getElementById('bgOpacityValue');
    const overlayOpacityValue = document.getElementById('overlayOpacityValue');

    const ctx = previewCanvas.getContext('2d');
    let uploadedImage = null;
    let yampLogo = null;

    yampLogo = new Image();
    yampLogo.crossOrigin = 'anonymous';
    yampLogo.src = './images/yamp_transperent.png';

    uploadArea.addEventListener('click', function () {
        fileInput.click();
    });

    uploadArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', function () {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', function (e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    });

    fileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            uploadedImage = new Image();
            uploadedImage.onload = function () {
                uploadSection.style.display = 'none';
                editorSection.style.display = 'block';
                generateOverlay();
            };
            uploadedImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    changeImageBtn.addEventListener('click', function () {
        uploadedImage = null;
        fileInput.value = '';
        editorSection.style.display = 'none';
        uploadSection.style.display = 'block';
    });

    bgOpacityInput.addEventListener('input', function () {
        bgOpacityValue.textContent = this.value + '%';
        generateOverlay();
    });

    overlayOpacityInput.addEventListener('input', function () {
        overlayOpacityValue.textContent = this.value + '%';
        generateOverlay();
    });

    textColorInput.addEventListener('input', function () {
        generateOverlay();
    });

    bgColorInput.addEventListener('input', function () {
        generateOverlay();
    });

    function generateOverlay() {
        if (!uploadedImage) return;

        previewCanvas.width = uploadedImage.width;
        previewCanvas.height = uploadedImage.height;
        ctx.drawImage(uploadedImage, 0, 0);

        const textColor = textColorInput.value;
        const bgColor = bgColorInput.value;
        const bgOpacity = bgOpacityInput.value / 100;
        const overlayOpacity = overlayOpacityInput.value / 100;

        const centerX = previewCanvas.width / 2;
        const centerY = previewCanvas.height / 2;

        const fontSize = Math.min(previewCanvas.width, previewCanvas.height) * 0.12;
        ctx.font = 'bold ' + fontSize + 'px "Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const text = '#FREEYAMP';
        const textMetrics = ctx.measureText(text);
        const textHeight = fontSize;

        const logoHeight = fontSize * 1.5;
        const logoWidth = yampLogo.width * (logoHeight / yampLogo.height);

        const totalHeight = textHeight + 20 + logoHeight;

        ctx.globalAlpha = bgOpacity;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);

        ctx.globalAlpha = overlayOpacity;

        ctx.fillStyle = textColor;
        const textY = centerY - (totalHeight / 2) + (textHeight / 2);
        ctx.fillText(text, centerX, textY);

        if (yampLogo.complete && yampLogo.naturalWidth > 0) {
            const logoX = centerX - logoWidth / 2;
            const logoY = textY + textHeight / 2 + 20;

            ctx.drawImage(yampLogo, logoX, logoY, logoWidth, logoHeight);
        }

        ctx.globalAlpha = 1;
    }

    downloadBtn.addEventListener('click', function () {
        if (!uploadedImage) return;

        const link = document.createElement('a');
        link.download = 'freeyamp_image.png';
        link.href = previewCanvas.toDataURL('image/png');
        link.click();
    });
});
