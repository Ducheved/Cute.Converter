import axios from 'axios';

export async function submitFormAPI(
  selectedFile,
  format,
  optimize,
  quality,
  height,
  width,
  onUploadProgress,
) {
  const formData = new FormData();
  formData.append('file', selectedFile);
  let endpoint =
    selectedFile.type === 'image/svg+xml'
      ? '/api/v1/svg/process'
      : '/api/v1/images/process';

  let params = {
    format,
    quality,
  };
  if (optimize === true) {
    params.optimize = optimize;
  }

  let resize = {};
  if (height) {
    resize.height = height;
  }
  if (width) {
    resize.width = width;
  }
  if (Object.keys(resize).length > 0) {
    params.resize = JSON.stringify(resize);
  }

  let url = `${endpoint}?${new URLSearchParams(params).toString()}`;

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
      responseType: 'arraybuffer',
      timeout: 120000,
    });

    let binary = '';
    let bytes = new Uint8Array(response.data);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    const base64 = window.btoa(binary);

    const image = `data:${response.headers['content-type'].toLowerCase()};base64,${base64}`;
    const resultData = response.headers['x-image-data'];
    let decodedJson = null;
    if (resultData) {
      if (/^[a-zA-Z0-9+/]*={0,2}$/.test(resultData)) {
        const decodedData = atob(resultData);
        decodedJson = JSON.parse(decodedData);
      }
    }

    return { image, decodedJson };
  } catch (error) {
    let errorMessage = error.message;
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
    throw new Error(errorMessage);
  }
}

export async function submitForm(context) {
  if (context.cropSelected && !context.croppedImage) {
    await context.cropImage();
  }
  if (!context.selectedFile) {
    context.errorModal.show = true;
    context.errorModal.message = 'File not selected';
    return;
  }
  const allowedTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/webp',
    'image/svg+xml',
    'image/tiff',
    'image/gif',
    'image/avif',
  ];
  if (!allowedTypes.includes(context.selectedFile.type)) {
    context.errorModal.show = true;
    context.errorModal.message = 'Invalid file type';
    return;
  }
  context.isLoading = true;
  let progress = 0;
  let progressInterval = null;
  try {
    progressInterval = setInterval(() => {
      if (progress < 90) {
        progress += 10;
        context.uploadProgress = progress;
      }
    }, 1000);
    if (context.width <= 0 || context.height <= 0) {
      context.errorModal.show = true;
      context.errorModal.message = 'Invalid image dimensions';
      return;
    }
    const { image, decodedJson } = await submitFormAPI(
      context.cropSelected ? context.croppedImage : context.selectedFile,
      context.format,
      context.optimize,
      context.quality,
      context.height,
      context.width,
    );
    context.image = image;
    context.decodedJson = decodedJson;
    context.$nextTick(() => {
      context.initImagePanzoom();
    });
    context.errorModal.show = false;
    context.errorModal.message = '';
    context.cropSelected = false;
  } catch (error) {
    context.errorModal.show = true;
    context.errorModal.message = error.message;
  } finally {
    clearInterval(progressInterval);
    context.uploadProgress = 100;
    setTimeout(() => {
      context.uploadProgress = 0;
      context.isLoading = false;
    }, 2000);
  }
}

export function downloadImage(image, format) {
  const link = document.createElement('a');
  link.href = image;
  link.download = 'processed-image.' + format;
  link.click();
}

export function clearFormFile(context) {
  context.selectedFile = null;
  context.image = null;
  context.decodedJson = null;
  context.cropSelected = false;
  context.showCropper = true;
  context.showDetails = false;
  context.fileName = '';
  context.isLoading = false;
  context.uploadProgress = 0;
  context.errorModal.show = false;
  context.errorModal.message = '';
  context.imageUrl = null;
  context.croppedImage = null;
  context.height = null;
  context.width = null;
  context.quality = 20;
  context.format = 'jpeg';
  context.optimize = true;
}
