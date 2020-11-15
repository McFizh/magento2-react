import { readFileSync, existsSync } from 'fs';
import { Logger } from './Logger';

const Config = {
  elasticuri: 'localhost:9200',
  magentouri: 'http://localhost:3090',
  consumerKey: '',
  consumerSecret: '',
  token: '',
  tokenSecret: '',
};

export const readConfigJson = (): void => {
  const fileName = '../shared/config.json';

  if(!existsSync(fileName)) {
    Logger.error('config.json file not found!');
    process.exit(-1);
  }

  const rawConfig = JSON.parse(readFileSync(fileName).toString());
  Config.consumerKey = rawConfig?.consumerKey ?? '';
  Config.consumerSecret = rawConfig?.consumerSecret ?? '';
  Config.token = rawConfig?.token ?? '';
  Config.tokenSecret = rawConfig?.tokenSecret ?? '';
};


export default Config;