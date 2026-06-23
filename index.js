const core = require("@actions/core");
const fs = require("fs");
const FormData = require("form-data");

async function downloadArtifact( uuid, apiKey, pathToFile ) {
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
                const contentDisposition = response.headers.get('content-disposition');

                if (contentDisposition) {
                    const arrayBuffer = await response.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    fs.writeFileSync(pathToFile + ".sarif", buffer);

                    console.log(`Download complete. File saved as ${pathToFile}.sarif`);
                    break;
                }
            }
        } catch (error) {
            if (error.name === 'TypeError' || error.code === 'ECONNREFUSED') {
                console.log(`Connection error. Retrying...${elapsed_time}s`);
                break;
            }
            throw error;
        }

        await new Promise(resolve => setTimeout(resolve, 20000));
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

	console.log("hi there");
	
    const platform = core.getInput("platform");
    const apiKey = core.getInput("apiKey");

    const form = new FormData();
    form.append("key", apiKey);
    form.append("platform", platform);
    form.append("app", fs.createReadStream(pathToFile));

    const response = await fetch('https://api.kryptowire.com/api/submit', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });


	console.log(response);
    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const body = await response.json();
    console.log('Upload successful! Server responded with:', JSON.stringify(body));

    let kwResponse = body;
    console.log("KryptowireUUID: ", kwResponse.uuid);
    await downloadArtifact( kwResponse.uuid, apiKey, pathToFile );

  } catch (err) {
    core.setFailed(err.message);
  }
}
run();
