import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const createAndDownloadZip = async (allTrialData) => {
  const zip = new JSZip();
  let csvContent = "Trial Number,Effort Level,All Correct,Image Names,Responses\n";

  allTrialData.forEach((trial, trialIndex) => {
    const allCorrect = trial.responses.every(r => r.correct);
    const imageNames = [];

    trial.responses.forEach((response, responseIndex) => {
      if (response.imageBlob) {
        const imageName = `Trial_${trialIndex}_Response_${responseIndex}.jpg`;
        imageNames.push(imageName);
        zip.file(imageName, response.imageBlob);
      }
    });

    csvContent += `${trial.trialNumber},${trial.effortLevel},${allCorrect},${imageNames.join('|')},`;
    csvContent += trial.responses.map(r => `${r.digit}:${r.response}:${r.correct}`).join('|');
    csvContent += "\n";
  });

  zip.file("experiment_data.csv", csvContent);
  const zipBlob = await zip.generateAsync({type: "blob"});
  saveAs(zipBlob, "experiment_results.zip");
};