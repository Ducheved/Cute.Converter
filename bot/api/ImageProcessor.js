const axios = require('axios');
const FormData = require('form-data');
const apiServer = require('../utils/apiServer');

class ImageProcessor {
  constructor(fileBuffer, fileType, format, optimize, quality) {
    this.fileBuffer = fileBuffer;
    this.fileType = fileType;
    this.format = format;
    this.optimize = optimize;
    this.quality = quality;
  }

  async sendToEndpoints() {
    const isSvg = this.fileType.toLowerCase().includes('svg+xml');
    let url = isSvg
      ? `${apiServer}/api/v1/svg/process?format=${this.format}`
      : `${apiServer}/api/v1/images/process?format=${this.format}`;

    // Добавляем параметры optimize и quality, если они не пустые
    if (this.optimize !== undefined && this.optimize !== null) {
      url += `&optimize=${this.optimize}`;
    }
    if (this.quality !== undefined && this.quality !== null) {
      url += `&quality=${this.quality}`;
    }

    const formData = new FormData();
    formData.append('file', this.fileBuffer, { filename: 'image', contentType: 'image/' + this.format });

    try {
      const response = await axios.post(url, formData, {
        headers: {
          ...formData.getHeaders()
        },
        responseType: 'arraybuffer'
      });

      if (response.status !== 200) {
        throw new Error('Server returned an error: ' + response.statusText);
      }

      return response;
    } catch (error) {
      console.error('Error message:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      throw error;
    } 
  }
}

module.exports = ImageProcessor;