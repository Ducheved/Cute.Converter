import axios from 'axios';

export async function submitForm(selectedFile, format, optimize, quality, height, width, onUploadProgress) {
  const formData = new FormData();
  formData.append('file', selectedFile);
  let endpoint = selectedFile.type === 'image/svg+xml' ? '/api/v1/svg/process' : '/api/v1/images/process';

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

export function downloadImage(image, format) {
  const link = document.createElement('a');
  link.href = image;
  link.download = 'processed-image.' + format;
  link.click();
}
