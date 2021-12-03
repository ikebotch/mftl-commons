import {
  DocumentData,
  DocumentSnapshot,
  Firestore
} from '@google-cloud/firestore';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigModel } from './config.model';
import { CONFIG_OPTIONS } from './config.token';

@Injectable()
export class CentralizedConfigService {
  private get firestore() {
    return new Firestore({
      keyFilename: this.configOptions.serviceFilePath,
    });
  }

  constructor(@Inject(CONFIG_OPTIONS) private configOptions: ConfigModel) {
    // log config file path
    Logger.log(
      `Using configuration file from ${this.configOptions}`,
      'ConfigService'
    );
  }

  fetchConfig<T>(collection: string, document: string): Promise<T> {
    return new Promise((resolve, reject) => {
      // get data from firestore
      this.firestore
        .collection(collection)
        .doc(document)
        .get()
        .then((response: DocumentSnapshot<DocumentData>) =>
          resolve(response.data() as T)
        )
        .catch((error: any) => reject(error));
    });
  }
}
