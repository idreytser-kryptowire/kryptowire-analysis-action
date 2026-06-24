# Quokka (Kryptowire) App Submission Action

This action takes the file path, platform & API key as input and submits the app file to Quokka Portal for analysis

## Prerequisite

### Set API Key

- Go to **Settings**
- Select **Secrets** under left column
- Click on **New Secret**
- Provide **Name: QUOKKA_API_KEY** & **Value** as your own Kryptowire API Key
- Click on **Add Secret**

## Inputs

### `pathToFile`

**Required** The path to the artifact file.

### `platform`

**Required** The platform (android/ios) of the app.

### `apiKey`

**Required** API key of the user.
**Default** \${{ secrets.QUOKKA_API_KEY }}

## Outputs

### `Quokka UUID`

UUID of the submitted app for analysis.

## Example usage

steps: &nbsp;
  - name: Quokka Analysis  &nbsp;
    uses: idreytser-kryptowire/kryptowire-analysis-action@v1.29  &nbsp;
      with:<br \>     
        path-to-file: ${{ env.path-to-file }}<br \>     
        platform: android<br \>     
        apiKey: ${{ secrets.QUOKKA_API_KEY }}  <br \> 		
