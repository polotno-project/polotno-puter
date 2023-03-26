import { nanoid } from 'nanoid';
import { dataURLtoBlob } from './blob';

const LIST_FILE_NAME = 'designs-list.json';

export async function listDesigns() {
  const listFile = await window.puter.readAppDataFile(LIST_FILE_NAME);
  if (!listFile) {
    return [];
  }
  const list = await listFile.json();
  return list;
}

export async function deleteDesign({ id }) {
  const listFile = await window.puter.readAppDataFile(LIST_FILE_NAME);
  if (!listFile) {
    return [];
  }
  const list = await listFile.json();
  const newList = list.filter((design) => design.id !== id);
  await listFile.write(JSON.stringify(newList));
  return newList;
}

export async function loadById({ id }) {
  const storeFile = await window.puter.readAppDataFile(id + '.json');
  if (!storeFile) {
    throw new Error('Design not found');
  }
  return await storeFile.json();
}

export async function saveDesign({ json, preview, name, id = nanoid(10) }) {
  const storeFile = await window.puter.saveToAppData(
    id + '.json',
    JSON.stringify(json)
  );
  const previewFile = await window.puter.saveToAppData(
    id + '.png',
    dataURLtoBlob(preview)
  );

  let listFile = await window.puter.readAppDataFile(LIST_FILE_NAME);
  if (!listFile) {
    listFile = await window.puter.saveToAppData(LIST_FILE_NAME, '[]');
  }
  const list = listFile ? await listFile.json() : [];
  const existing = list.find((design) => design.id === id);
  if (existing) {
    existing.previewURL = previewFile.readURL;
    existing.name = name;
  } else {
    list.push({ id, previewURL: previewFile.readURL, name });
  }
  await listFile.write(JSON.stringify(list));

  return { storeFile, previewFile, id };
}
