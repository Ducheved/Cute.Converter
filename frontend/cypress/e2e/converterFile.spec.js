import 'cypress-file-upload';

describe('Image Upload', () => {
    it('successfully uploads an image', () => {
      cy.visit('/converter'); 
  
      cy.fixture('testImage.png').then(fileContent => {
        cy.get('input[type=file]', { timeout: 10000 }).attachFile({
          fileContent: fileContent.toString(),
          fileName: 'testImage.png',
          mimeType: 'image/png',
          encoding: 'base64'
        });
      });
      cy.get('input[type=range]').as('qualitySlider').invoke('val', 50).trigger('change');
      cy.get('button[type=submit]').click();
      cy.get('img', { timeout: 10000 }).should('be.visible');
    });
});