# ncbi-sequence-grabber
to download sequences for CovidMine

Uses puppeteer to download the sequence file we need.

## Developers

You must have nodejs and npm.

1. Clone this repo.
2. Change into the directory.
3. Run `npm install` to install dependencies.
4. Run the script with `npm start`.

When the script exits, you should have a file named *sequences.fasta*. Move this file to wherever you need it. Further invocations will delete the file and redownload it. The script will exit with code 1 if it's not successful.
