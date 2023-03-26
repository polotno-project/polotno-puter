import * as mobx from 'mobx';
import * as api from './api';
import { getImageSize } from 'polotno/utils/image';

import { blobToDataURL } from './blob';

const addImage = async (file, store) => {
  const blob = await file.blob();
  blobToDataURL(blob, (data_url) => {
    getImageSize(data_url).then((size) => {
      store.setSize(size.width, size.height);
      store.activePage.addElement({
        type: 'image',
        src: data_url,
        width: size.width,
        height: size.height,
      });
    });
  });
};

class Project {
  id = '';
  name = 'Untitled Design';
  skipSaving = false;
  status = 'saved';
  storeFile = null;
  previewFile = null;
  autosaveEnabled = true;

  constructor({ store }) {
    mobx.makeAutoObservable(this, {
      storeFile: mobx.observable.ref,
      previewFile: mobx.observable.ref,
    });
    this.store = store;

    store.on('change', () => {
      this.requestSave();
    });

    mobx.reaction(
      () => this.name + this.status + this.id,
      () => {
        const prefix = this.status === 'saved' ? '' : '● ';
        window.puter.setWindowTitle(
          prefix + this.name + ' ' + (this.id || '') + ' - Polotno Studio'
        );
      }
    );

    window.puter.onItemsOpened(async (items) => {
      this.openFile(items[0], false);
    });
  }

  async openFile(file, autosaveEnabled = false) {
    this.storeFile = file;
    this.name = this.storeFile.name;
    this.autosaveEnabled = false;
    if (this.storeFile.name.indexOf('.json') >= 0) {
      const file = this.storeFile;
      const text = await file.text();
      this.store.loadJSON(JSON.parse(text));
    } else {
      addImage(this.storeFile, this.store);
    }
  }

  requestSave() {
    this.status = 'unsaved';
    if (this.saveTimeout) {
      return;
    }
    if (!this.autosaveEnabled) {
      return;
    }
    this.saveTimeout = setTimeout(() => {
      this.saveTimeout = null;
      // skip autosave if no project opened
      this.save();
    }, 2000);
  }

  async save() {
    const json = this.store.toJSON();
    const maxWidth = 400;
    const preview = await this.store.toDataURL({
      pixelRatio: maxWidth / json.width,
      mimeType: 'image/jpeg',
    });
    const { storeFile, previewFile, id } = await api.saveDesign({
      id: this.id,
      name: this.name,
      json: this.store.toJSON(),
      preview,
    });
    this.storeFile = storeFile;
    this.previewFile = previewFile;
    this.id = id;
    this.status = 'saved';
  }
}

export const createProject = (...args) => new Project(...args);
export default createProject;
