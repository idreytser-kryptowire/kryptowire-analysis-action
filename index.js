const core = require("@actions/core");
const fs = require("fs");
const path = require("path");

async function downloadArtifact(uuid, apiKey, pathToFile) {
  let elapsed_time = 0;
  while (true) {
    try {
      const url = `https://emm.kryptowire.com/api/results/sarif?uuid=${uuid}&regeneratePDF=false&key=${apiKey}`;
      const response = await fetch(url);
      if (response.status === 404) {
        console.log(`UUID: ${uuid}. Artifacts not ready yet, waiting...${elapsed_time}s`);
      } else if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        const contentDisposition = response.headers.get("content-disposition");
        if (contentDisposition) {
          const arrayBuffer = await response.arrayBuffer();
          fs.writeFileSync(pathToFile + ".sarif", Buffer.from(arrayBuffer));
          console.log(`Download complete. File saved as ${pathToFile}.sarif`);
          break;
        }
      }
    } catch (error) {
      if (error.name === "TypeError" || error.code === "ECONNREFUSED") {
        console.log(`Connection error. Retrying...${elapsed_time}s`);
        break;
      }
      throw error;
    }
    await new Promise((resolve) => setTimeout(resolve, 20000));
    elapsed_time += 20;
  }
}

async function run() {
  try {
    const pathToFile = core.getInput("path-to-file");
    if (fs.existsSync(pathToFile)) {
      console.log(`File Exists: ${pathToFile}`);
    } else {
      console.log(`File Does Not Exist: ${pathToFile}`);
    }
    const platform = core.getInput("platform");
    const apiKey = core.getInput("apiKey");
    console.log("apikey: " + apiKey);

    const formData = new FormData();
    formData.append("app", await fs.openAsBlob(pathToFile), path.basename(pathToFile));
    formData.append("platform", platform);
    formData.append("key", apiKey);

    const uploadResponse = await fetch("https://api.kryptowire.com/api/submit", {
      method: "POST",
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed! status: ${uploadResponse.status}`);
    }

    const kwResponse = await uploadResponse.json();
    console.log("Upload successful! Server responded with:", kwResponse);
    console.log("KryptowireUUID:", kwResponse.uuid);

    await downloadArtifact(kwResponse.uuid, apiKey, pathToFile);
  } catch (err) {
    core.setFailed(err.message);
  }
}

run();