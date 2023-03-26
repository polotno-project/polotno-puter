import { nanoid } from 'nanoid';
import { dataURLtoBlob } from './blob';

export async function listDesigns() {
  const listFile = await window.puter.readAppDataFile('designs-list.json');
  if (!listFile) {
    return [];
  }
  const list = await listFile.json();
  return list;
}

export async function deleteDesign({ id }) {
  const listFile = await window.puter.readAppDataFile('designs-list.json');
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

export async function saveDesign({ json, preview }) {
  const id = nanoid(10);
  const storeFile = await window.puter.writeAppDataFile(
    id + '.json',
    JSON.stringify(json)
  );
  const previewFile = await window.puter.writeAppDataFile(
    id + '.png',
    dataURLtoBlob(preview)
  );

  const listFile = await window.puter.readAppDataFile('designs-list.json');
  const list = listFile ? await listFile.json() : [];
  list.push({ id, previewURL: previewFile.readURL });
  await listFile.write(JSON.stringify(list));
}
