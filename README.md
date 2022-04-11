# Firebase function for basic auth
More info about `Firebase` and `Google cloud functions` https://firebase.google.com/docs/functions

How `basic auth` works https://developer.mozilla.org/docs/Web/HTTP/Authentication

## Step 1
Copy the `functions` folder to the root of the project

## Step 2
Create service account
https://cloud.google.com/iam/docs/creating-managing-service-accounts
 
A service account will be needed
with the following roles:

- Service accout user (`iam.serviceAccountUser`)
- Cloud Functions Admin (`cloudfunctions.admin`):
  - Can create, update, and delete functions.
  - Can set IAM policies and view source code.

## Step 3
Set repository secrets:

- `SERVICE_ACCOUNT` - Service account credentials https://cloud.google.com/iam/docs/creating-managing-service-account-keys

- `BASIC_AUTH_USERNAME` - Username for auth

- `BASIC_AUTH_PASSWORD` - Password for auth


## Step 4
Setup/update build workflow

### Update build command: 
```
- name: Build
        run: npm run build && mv dist/index.html functions/index.html
```
For this function, the functions folder must contain the index.html file, which is created after build

(**Important**) You must move the file, not copy it, otherwise rewrite in firebase.json will not work

### Add authorize in to GCP by credentials
```
- name: GCP auth by service account
        uses: 'google-github-actions/auth@v0'
        with:
         credentials_json: '${{ secrets.SERVICE_ACCOUNT }}'
```

### Add deploy cloud function
Name and runtime are required
```
 - name: Deploy cloud function
        uses: 'google-github-actions/deploy-cloud-functions@v0'
        with:
         name: # Function name here
         project_id: # Project id here
         runtime: 'nodejs16'
         description: 'Basic auth function'
         source_dir: 'functions'
         env_vars: 'USERNAME=${{ secrets.BASIC_AUTH_USERNAME }},PASSWORD=${{ secrets.BASIC_AUTH_PASSWORD }}'
```


Example: https://github.com/devteamclub/gc-function-basic-auth/blob/master/workflows-example/build-and-deploy-fb-function


## Step 5
Update `firebase.json`

Rewrite all calls to basic auth function

```
"rewrites": [
  {
    "source": "**",
    "function": "yourFunctionName"
  },
]
