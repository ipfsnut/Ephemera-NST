import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const createAndDownloadZip = async (trialData) => {
  const zip = new JSZip();
  let csvContent = "Trial Number,Response Index,Digit,Response,Correct,Image File\n";

  trialData.forEach((trial) => {
    trial.responses.forEach((response, index) => {
      const imageFileName = response.imageBlob ? `Trial_${trial.trialNumber}_Response_${index}.jpg` : '';
      csvContent += `${trial.trialNumber},${index},${response.digit},${response.response},${response.correct},${imageFileName}\n`;

      if (response.imageBlob) {
        console.log(`Adding image to zip: ${imageFileName}, size: ${response.imageBlob.size}`);
        zip.file(imageFileName, response.imageBlob);
      } else {
        console.log(`No image blob for trial ${trial.trialNumber}, response ${index}`);
      }
    });
  });

  zip.file("experiment_data.csv", csvContent);

  console.log('Generating zip file...');
  const zipBlob = await zip.generateAsync({type: "blob"});
  console.log('Zip file generated, size:', zipBlob.size);
  saveAs(zipBlob, "experiment_results.zip");
};