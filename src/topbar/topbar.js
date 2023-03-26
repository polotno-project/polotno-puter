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
  EditableText,
} from '@blueprintjs/core';
import FaGithub from '@meronex/icons/fa/FaGithub';
import FaDiscord from '@meronex/icons/fa/FaDiscord';
import BiCodeBlock from '@meronex/icons/bi/BiCodeBlock';
import { getImageSize } from 'polotno/utils/image';
import { Popover2 } from '@blueprintjs/popover2';
import FaFileImport from '@meronex/icons/fa/FaFileImport';
import { DownloadButton } from './download-button';
import { dataURLtoBlob, blobToDataURL } from '../blob';

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

export default observer(({ store }) => {
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
                  onClick={async () => {
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
                    window.project.id = '';
                    window.project.autosaveEnabled = true;
                    await window.project.save();
                  }}
                />

                <MenuDivider />
                <MenuItem
                  icon="folder-open"
                  text="Open"
                  onClick={async () => {
                    const file = await window.puter.showOpenFilePicker();
                    window.project.openFile(file);
                  }}
                />
                <MenuItem
                  icon="floppy-disk"
                  text="Save"
                  onClick={async () => {
                    const data = JSON.stringify(store.toJSON());
                    // If there is a file already open, overwrite it with the content of editor
                    const file = window.project.storeFile;
                    if (file) {
                      if (file.name.indexOf('.json') >= 0) {
                        file.write(data);
                      } else {
                        const dataURL = await store.toDataURL();
                        const blob = dataURLtoBlob(dataURL);
                        file.write(blob);
                      }
                    } else {
                      const name = 'polotno.json';
                      window.project.storeFile =
                        await window.puter.showSaveFilePicker(data, name);
                      window.project.name = name;
                      window.autosaveEnabled = false;
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
                    const name = 'polotno.json';
                    window.project.storeFile =
                      await window.puter.showSaveFilePicker(data, name);
                    window.project.name = name;
                    window.autosaveEnabled = false;
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
          <Button
            text="My Designs"
            intent="primary"
            style={{
              minHeight: '26px',
            }}
            onClick={() => {
              store.openSidePanel('my-designs');
            }}
          />
          <div
            style={{
              paddingLeft: '50px',
              maxWidth: '200px',
            }}
          >
            <EditableText
              value={window.project.name}
              placeholder="Design name"
              onChange={(name) => {
                window.project.name = name;
                window.project.requestSave();
              }}
            />
          </div>
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
