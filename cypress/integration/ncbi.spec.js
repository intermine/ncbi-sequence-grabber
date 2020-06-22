describe('My First Test', () => {
  it('Does not do much!', () => {
    //visit ncbi covid page
    cy.visit("https://www.ncbi.nlm.nih.gov/labs/virus/vssi/#/virus?SeqType_s=Nucleotide&VirusLineage_ss=SARS-CoV-2,%20taxid:2697049")

    //download
    cy.get(".ncbi-report-download").click()

    //next, next!
    cy.get(".btn.btn-success.ncbi-download-btn").click()
    cy.get(".btn.btn-success.ncbi-download-btn").first().click()

    //we will customise what we download
    cy.get("#customTitle").next().click()

    //remove the genbank!
    cy.get(".listbox").eq(1).find("label").contains("GenBank Title").click()
    cy.get("uswds-ncbi-app-custom-listbox .button-bar .point-left").click()

    //add Add geo location, nucleotide completeness
    cy.get(".listbox").eq(0).find("label").contains("Geo Location").click()
    cy.get("uswds-ncbi-app-custom-listbox .button-bar .point-right").click()

    cy.get(".listbox").eq(0).find("label").contains("Nucleotide Completeness").click()
    cy.get("uswds-ncbi-app-custom-listbox .button-bar .point-right").click()

    //Click download
    cy.get(".btn.btn-success.ncbi-download-btn").first().click()

    expect(true).to.equal(true)
  })
})
