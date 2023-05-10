const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");
const FormData = require("form-data");
const request = require("request")


async function run() {
  try {
    // `path-to-file` input defined in action metadata file
    const pathToFile = core.getInput("path-to-file");
    console.log(`Path: ${pathToFile}`);
    if (fs.existsSync(pathToFile)) {
      console.log(`File Exists`);
    } else {
      console.log(`File Does Not Exist`);
    }

    // `platform` input defined in action metadata file
    const platform = core.getInput("platform");
    console.log(`Platform: ${platform}`);

    // `apiKey` input defined in action metadata file
    const apiKey = core.getInput("apiKey");
    console.log("API KEY: " + apiKey );

    const formData = {
      "app": fs.createReadStream( pathToFile ),
      "key": apiKey,
      "platform": platform
    }

    request.post({url:'https://emm.kryptowire.com/api/submit', formData: formData}, function optionalCallback(err, httpResponse, body) {
      if (err) {
        console.error('upload failed:', err);
      }
      console.log('Upload successful!  Server responded with:', body);
      const jj = JSON.parse(body);
      console.log("Quokka UUID: ", jj.uuid);
      console.log("Now Scanning apk...");
    });
  
    
  } catch (err) {
      console.log("Error with upload:", err);
  }
}
run();
