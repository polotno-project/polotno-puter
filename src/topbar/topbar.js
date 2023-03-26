import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Navbar,
  Alignment,
  AnchorButton,
  Divider,
  Dialog,
  Classes,
  Position,
  Menu,
  MenuItem,
  MenuDivider,
  HTMLSelect,
  Slider,
} from '@blueprintjs/core';
import FaGithub from '@meronex/icons/fa/FaGithub';
import FaDiscord from '@meronex/icons/fa/FaDiscord';
import BiCodeBlock from '@meronex/icons/bi/BiCodeBlock';
import { getImageSize } from 'polotno/utils/image';
import { downloadFile } from 'polotno/utils/download';
import { Popover2 } from '@blueprintjs/popover2';
import * as unit from 'polotno/utils/unit';
import { t } from 'polotno/utils/l10n';
import FaFileExport from '@meronex/icons/fa/FaFileExport';
import FaFileImport from '@meronex/icons/fa/FaFileImport';
import { DownloadButton } from './download-button';
import { dataURLtoBlob, blobToDataURL } from '../blob';
// import { Cloud } from './cloud';

import styled from 'polotno/utils/styled';

const NavbarContainer = styled('div')`
  @media screen and (max-width: 500px) {
    overflow-x: auto;
    overflow-y: hidden;
    max-width: 100vw;
  }
  &.bp4-navbar,
  & .bp4-navbar-group {
    height: 32px;
    background-color: #fbf9f9;
  }
  & .bp4-button {
    padding: 2px 10px;
  }
`;

const NavInner = styled('div')`
  @media screen and (max-width: 500px) {
    display: flex;
  }
`;

// const DownloadButton = observer(({ store }) => {
//   const [saving, setSaving] = React.useState(false);
//   const [quality, setQuality] = React.useState(1);
//   const [type, setType] = React.useState('png');

//   const getName = () => {
//     const texts = [];
//     store.pages.forEach((p) => {
//       p.children.forEach((c) => {
//         if (c.type === 'text') {
//           texts.push(c.text);
//         }
//       });
//     });
//     const allWords = texts.join(' ').split(' ');
//     const words = allWords.slice(0, 6);
//     return words.join(' ').replace(/\s/g, '-').toLowerCase() || 'polotno';
//   };
//   return (
//     <Popover2
//       content={
//         <Menu>
//           <li class="bp4-menu-header">
//             <h6 class="bp4-heading">File type</h6>
//           </li>
//           <HTMLSelect
//             fill
//             onChange={(e) => {
//               setType(e.target.value);
//               setQuality(1);
//             }}
//             value={type}
//           >
//             <option value="jpeg">JPEG</option>
//             <option value="png">PNG</option>
//             <option value="pdf">PDF</option>
//           </HTMLSelect>
//           <li class="bp4-menu-header">
//             <h6 class="bp4-heading">Size</h6>
//           </li>
//           <div style={{ padding: '10px' }}>
//             <Slider
//               value={quality}
//               labelRenderer={false}
//               // labelStepSize={0.4}
//               onChange={(quality) => {
//                 setQuality(quality);
//               }}
//               stepSize={0.2}
//               min={0.2}
//               max={3}
//               showTrackFill={false}
//             />
//             {type === 'pdf' && (
//               <div>
//                 {unit.pxToUnitRounded({
//                   px: store.width,
//                   dpi: store.dpi / quality,
//                   precious: 0,
//                   unit: 'mm',
//                 })}{' '}
//                 x{' '}
//                 {unit.pxToUnitRounded({
//                   px: store.height,
//                   dpi: store.dpi / quality,
//                   precious: 0,
//                   unit: 'mm',
//                 })}{' '}
//                 mm
//               </div>
//             )}
//             {type !== 'pdf' && (
//               <div>
//                 {Math.round(store.width * quality)} x{' '}
//                 {Math.round(store.height * quality)} px
//               </div>
//             )}
//           </div>
//           <Button
//             fill
//             intent="primary"
//             loading={saving}
//             onClick={async () => {
//               if (type === 'pdf') {
//                 setSaving(true);
//                 await store.saveAsPDF({
//                   fileName: getName() + '.pdf',
//                   dpi: store.dpi / quality,
//                   pixelRatio: 2 * quality,
//                 });
//                 setSaving(false);
//               } else {
//                 store.pages.forEach((page, index) => {
//                   // do not add index if we have just one page
//                   const indexString =
//                     store.pages.length > 1 ? '-' + (index + 1) : '';
//                   store.saveAsImage({
//                     pageId: page.id,
//                     pixelRatio: quality,
//                     mimeType: 'image/' + type,
//                     fileName: getName() + indexString + '.' + type,
//                   });
//                 });
//               }
//             }}
//           >
//             Download {type.toUpperCase()}
//           </Button>

//           {/* <MenuItem
//             icon="media"
//             text={t('toolbar.saveAsImage')}
//             onClick={async () => {
//               store.pages.forEach((page, index) => {
//                 // do not add index if we have just one page
//                 const indexString =
//                   store.pages.length > 1 ? '-' + (index + 1) : '';
//                 store.saveAsImage({
//                   pageId: page.id,
//                   fileName: getName() + indexString + '.png',
//                 });
//               });
//             }}
//           />
//           <MenuItem
//             icon="document"
//             text={t('toolbar.saveAsPDF')}
//             onClick={async () => {
//               setSaving(true);
//               await store.saveAsPDF({
//                 fileName: getName() + '.pdf',
//               });
//               setSaving(false);
//             }}
//           /> */}
//         </Menu>
//       }
//       position={Position.BOTTOM_RIGHT}
//     >
//       <Button
//         icon="import"
//         text={t('toolbar.download')}
//         intent="primary"
//         loading={saving}
//         onClick={() => {
//           setQuality(1);
//         }}
//       />
//     </Popover2>
//   );
// });

export default observer(({ store }) => {
  const inputRef = React.useRef();

  const [faqOpened, toggleFaq] = React.useState(false);

  const openFile = React.useRef(null);

  const addImage = async (file) => {
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

  React.useEffect(() => {
    window.puter.onItemsOpened(async function (items) {
      openFile.current = items[0];
      if (openFile.current.name.indexOf('.json') >= 0) {
        const file = openFile.current;
        const text = await file.text();
        store.loadJSON(JSON.parse(text));
      } else {
        addImage(openFile.current);
      }
    });
  }, []);

  return (
    <NavbarContainer className="bp4-navbar">
      <NavInner>
        <Navbar.Group align={Alignment.LEFT}>
          <Popover2
            content={
              <Menu>
                {/* <MenuDivider title={t('toolbar.layering')} /> */}
                <MenuItem
                  icon="document"
                  text="New"
                  onClick={() => {
                    const ids = store.pages
                      .map((page) => page.children.map((child) => child.id))
                      .flat();
                    const hasObjects = ids?.length;
                    if (hasObjects) {
                      if (
                        !window.confirm('Remove all content for a new design?')
                      ) {
                        return;
                      }
                    }
                    const pagesIds = store.pages.map((p) => p.id);
                    store.deletePages(pagesIds);
                    store.addPage();
                    openFile.current = null;
                  }}
                />

                <MenuDivider />
                <MenuItem
                  icon="folder-open"
                  text="Open"
                  onClick={async () => {
                    openFile.current = await window.puter.showOpenFilePicker();
                    if (openFile.current.name.indexOf('.json') >= 0) {
                      const file = openFile.current;
                      const text = await file.text();
                      store.loadJSON(JSON.parse(text));
                    } else {
                      addImage(openFile.current);
                    }
                  }}
                />
                <MenuItem
                  icon="floppy-disk"
                  text="Save"
                  onClick={async () => {
                    // const dataURL = await store.toDataURL();
                    // const blob = dataURLtoBlob(dataURL);
                    const data = JSON.stringify(store.toJSON());
                    // If there is a file already open, overwrite it with the content of editor
                    if (openFile.current) {
                      if (openFile.current.name.indexOf('.json') >= 0) {
                        openFile.current.write(data);
                      } else {
                        const dataURL = await store.toDataURL();
                        const blob = dataURLtoBlob(dataURL);
                        openFile.current.write(blob);
                      }
                    } else {
                      openFile.current = await window.puter.showSaveFilePicker(
                        data,
                        'polotno.json'
                      );
                    }
                  }}
                />
                <MenuItem
                  icon={<FaFileImport />}
                  text="Save as"
                  onClick={async () => {
                    // const dataURL = await store.toDataURL();
                    // const blob = dataURLtoBlob(dataURL);
                    const data = JSON.stringify(store.toJSON());
                    // If there is a file already open, overwrite it with the content of editor
                    openFile.current = await window.puter.showSaveFilePicker(
                      data,
                      'polotno.json'
                    );
                  }}
                />
                <MenuItem
                  icon="import"
                  text="Export to image"
                  onClick={async () => {
                    const dataURL = await store.toDataURL();
                    const blob = dataURLtoBlob(dataURL);
                    await window.puter.showSaveFilePicker(blob, 'polotno.png');
                  }}
                />
                <MenuDivider />
                <MenuItem
                  text="About"
                  icon="info-sign"
                  onClick={() => {
                    toggleFaq(true);
                  }}
                />
              </Menu>
            }
            position={Position.BOTTOM_RIGHT}
            minimal
          >
            <Button minimal text="File" />
          </Popover2>
          {/* <Button
            icon="floppy-disk"
            minimal
            onClick={async () => {
              const dataURL = await store.toDataURL();
              const blob = dataURLtoBlob(dataURL);
              openFile.current = await cloud.showSaveFilePicker(
                blob,
                'polotno.png'
              );
            }}
          >
            Save As
          </Button> */}
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          {/* <a
          href="https://www.producthunt.com/posts/polotno-studio?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-polotno-studio"
          target="_blank"
        >
          <img
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=281373&theme=dark"
            alt="Polotno Studio - Canva-like design editor, without signups or ads. | Product Hunt"
            style={{ height: '30px', marginBottom: '-4px' }}
          />
        </a> */}
          {/* <Button
            icon="info-sign"
            minimal
            onClick={() => toggleQuestion(true)}
            intent="danger"
          >
            Important question for you (!)
          </Button> */}
          <AnchorButton
            minimal
            href="https://polotno.com"
            target="_blank"
            icon={
              <BiCodeBlock className="bp4-icon" style={{ fontSize: '20px' }} />
            }
          >
            API
          </AnchorButton>
          <AnchorButton
            minimal
            href="https://github.com/lavrton/polotno-studio"
            target="_blank"
            icon={
              <FaGithub className="bp4-icon" style={{ fontSize: '20px' }} />
            }
          >
            Github
          </AnchorButton>
          <AnchorButton
            minimal
            href="https://discord.gg/W2VeKgsr9J"
            target="_blank"
            icon={
              <FaDiscord className="bp4-icon" style={{ fontSize: '20px' }} />
            }
          >
            Join Chat
          </AnchorButton>

          <Divider />
          <DownloadButton store={store} />
        </Navbar.Group>
        <Dialog
          icon="info-sign"
          onClose={() => toggleFaq(false)}
          title="About Polotno Studio"
          isOpen={faqOpened}
          style={{
            width: '80%',
            maxWidth: '700px',
          }}
        >
          <div className={Classes.DIALOG_BODY}>
            <h2>What is Polotno Studio?</h2>
            <p>
              <strong>Polotno Studio</strong> - is a web application to create
              graphical designs. You can mix image, text and illustrations to
              make social media posts, youtube previews, podcast covers,
              business cards and presentations.
            </p>
            <h2>Is it Open Source?</h2>
            <p>
              Partially. The source code is available in{' '}
              <a
                href="https://github.com/lavrton/polotno-studio"
                target="_blank"
              >
                GitHub repository
              </a>
              . The repository doesn't have full source.{' '}
              <strong>Polotno Studio</strong> is powered by{' '}
              <a href="https://polotno.dev/" target="_blank">
                Polotno SDK project
              </a>
              . All core "canvas editor" functionality are implemented by{' '}
              <strong>polotno</strong> npm package (which is not open source at
              the time of writing this text).
            </p>
            <p>
              Polotno Studio is build on top of Polotno SDK to provide a
              desktop-app-like experience.
            </p>
            <h2>Who is making Polotno Studio?</h2>
            <p>
              My name is Anton Lavrenov{' '}
              <a href="https://twitter.com/lavrton" target="_blank">
                @lavrton
              </a>
              . I am founder of Polotno project. As the maintainer of{' '}
              <a href="https://konvajs.org/" target="_blank">
                Konva 2d canvas framework
              </a>
              , I created several similar apps for different companies around
              the world. So I decided to compile all my knowledge and experience
              into reusable Polotno project.
            </p>
            <h2>
              Why Polotno Studio has no signups and no ads? How are you going to
              support the project financially?
            </h2>
            <p>
              Instead of monetizing the end-user application{' '}
              <strong>Polotno Studio</strong> I decided to make money around
              developers tools with{' '}
              <a href="https://polotno.dev/" target="_blank">
                Polotno SDK
              </a>
              .
            </p>
            <p>
              <strong>Polotno Studio</strong> is a sandbox application and
              polished demonstration of{' '}
              <a href="https://polotno.dev/" target="_blank">
                Polotno SDK
              </a>{' '}
              usage.
            </p>
            <p>
              With{' '}
              <a href="https://polotno.dev/" target="_blank">
                Polotno SDK
              </a>{' '}
              you can build very different application with very different UI.
            </p>
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button onClick={() => toggleFaq(false)}>Close</Button>
            </div>
          </div>
        </Dialog>
      </NavInner>
    </NavbarContainer>
  );
});
