const puppeteer = require('puppeteer');
const fs = require('fs');

const delayBeforeFailing = 10*60*1000;
const downloadFileName = 'sequences.fasta';

function waitForFile(fileName) {
  return new Promise(resolve => {
    fs.watchFile(fileName, {persistent: false}, stat => {
      if (stat.isFile()) resolve(true);
    });
  });
}

function timeout(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms, false);
  });
}

async function main() {
  const browser = await puppeteer.launch({
    headless: true, // Set to false for debugging.
    slowMo: 200     // Without slowMo it can be unreliable.
  });

  const page = await browser.newPage();

  process.on('unhandledRejection', (reason, p) => {
    console.error('Browser automation failed');
    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
    browser.close();
    process.exit(1);
  });

  async function clickContaining(text) {
    const [button] = await page.$x(`//label[contains(text(), '${text}')]`);
    await button.click();
  }

  async function clickNthListboxContaining(nth, text) {
    const [button] = await page.$x(`//div[@class="listbox"][${nth}]//label[contains(text(), '${text}')]`);
    await button.click();
  }

  await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: './'});

  await page.goto('https://www.ncbi.nlm.nih.gov/labs/virus/vssi/#/virus?SeqType_s=Nucleotide&VirusLineage_ss=SARS-CoV-2,%20taxid:2697049');

  // Open download modal
  await page.click(".ncbi-report-download");

  // Click next twice
  await page.click(".btn.btn-success.ncbi-download-btn");
  await page.click(".btn.btn-success.ncbi-download-btn");

  // We will customise what we download
  await clickContaining("Build custom");

  // Add Geo Location
  await clickNthListboxContaining(1, "Geo Location");
  await page.click("button.btn-block.point-right");

  // Add Nucleotide Completeness
  await clickNthListboxContaining(1, "Nucleotide Completeness");
  await page.click("button.btn-block.point-right");

  // Remove GenBank Title
  await clickNthListboxContaining(2, "GenBank Title");
  await page.click("button.btn-block.point-left");

  // Finally, click download button
  await page.click(".btn.btn-success.ncbi-download-btn");

  const isSuccessful = await Promise.race([
    waitForFile(downloadFileName),
    timeout(delayBeforeFailing)
  ]);

  fs.unwatchFile(downloadFileName);

  await browser.close();

  if (!isSuccessful) {
    console.error('Timed out trying to download file: ' + downloadFileName);
    process.exit(1);
  }

  process.exit();
}

fs.unlink(downloadFileName, err => {
  // ENOENT means the file doesn't exist, which we ignore.
  if (err && err.code !== 'ENOENT') throw err;
  main();
});
