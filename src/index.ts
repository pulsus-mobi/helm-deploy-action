import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';

async function run() {
  try {
    const appName = core.getInput('app_name');
    const imageRepo = core.getInput('image_repo');
    const imageTag = core.getInput('image_tag');

    const yaml = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${appName}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${appName}
  template:
    metadata:
      labels:
        app: ${appName}
    spec:
      containers:
      - name: ${appName}
        image: ${imageRepo}:${imageTag}
        ports:
        - containerPort: 80
`;

    fs.writeFileSync('application.yaml', yaml);
    core.info('Manifesto gerado com sucesso: application.yaml');

    await exec.exec('kubectl apply -f application.yaml');
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();

