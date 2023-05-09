# Quokka (Kryptowire) App Submission Action

This action takes the file path, platform & API key as input and submits the app file to Quokka Portal for analysis

## Prerequisite

### Set API Key

- Go to **Settings**
- Select **Secrets** under left column
- Click on **New Secret**
- Provide **Name: KRYPTOWIRE_API_KEY** & **Value** as your own Kryptowire API Key
- Click on **Add Secret**

## Inputs

### `pathToFile`

**Required** The path to the artifact file.

### `platform`

**Required** The platform (android/ios) of the app.

### `apiKey`

**Required** API key of the user.
**Default** \${{ secrets.KRYPTOWIRE_API_KEY }}

## Outputs

### `Quokka UUID`

UUID of the submitted app for analysis.

## Example usage

steps:

    - uses: actions/download-artifact@v2
        with:
            name: app # Name of artifact holding the app file
            path: path/to/artifact

    - name: Kryptowire Analysis Submission
        id: appSubmission
        uses: pkumar001/kryptowire-analysis-action@master
        with:
            path-to-file: path/to/artifact/app-prod-debug.apk
            platform: "android"
            apiKey: ${{ secrets.KRYPTOWIRE_API_KEY }}
