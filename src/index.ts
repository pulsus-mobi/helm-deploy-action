import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';
import * as path from 'path';

async function run() {
  try {
    const appName = core.getInput('app_name');
    const imageRepo = core.getInput('image_repo');
    const imageTag = core.getInput('image_tag');
    const chart = core.getInput('chart'); // Recebe o caminho do chart

    // Verifica se o chart existe
    if (!fs.existsSync(chart)) {
      throw new Error(`O chart '${chart}' não foi encontrado!`);
    }

    core.info(`Deploying ${appName} using Helm`);

    // Comando para instalar ou atualizar o release usando Helm
    const helmCommand = `helm upgrade --install ${appName} ${chart} --set image.repository=${imageRepo} --set image.tag=${imageTag}`;

    // Executa o comando Helm
    await exec.exec(helmCommand);

    core.info('Deploy concluído com sucesso!');
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
