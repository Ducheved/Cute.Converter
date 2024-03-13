describe('ConverterView', () => {
    beforeEach(() => {
      cy.visit('/converter');
    });
  
    it('should display the form', () => {
      cy.get('form', { timeout: 10000 }).should('exist');
      cy.get('input[type="file"]').should('exist');
      cy.get('input[type="range"]').should('exist');
      cy.get('input[type="number"]').should('exist');
      cy.get('select').should('exist');
      cy.get('button[type="submit"]').should('exist');
    });
  });