import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const createAndDownloadZip = async (trialData) => {
  const zip = new JSZip();
  let csvContent = "Trial Number,Effort Level,All Correct,Image Name,Responses\n";

  trialData.forEach((trial, index) => {
    const imageName = trial.imageBlob ? `Image${index + 1}.jpg` : 'No Image';
    csvContent += `${trial.trialNumber},${trial.effortLevel},${trial.allCorrect},${imageName},`;
    csvContent += trial.responses.map(r => `${r.digit}:${r.response}:${r.correct}`).join('|');
    csvContent += "\n";

    if (trial.imageBlob) {
      zip.file(imageName, trial.imageBlob);
    }
  });

  zip.file("experiment_data.csv", csvContent);

  const zipBlob = await zip.generateAsync({type: "blob"});
  saveAs(zipBlob, "experiment_results.zip");
};