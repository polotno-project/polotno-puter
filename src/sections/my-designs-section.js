import React from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Card,
  Menu,
  MenuItem,
  Position,
  Spinner,
  Popover,
} from '@blueprintjs/core';

import { SectionTab } from 'polotno/side-panel';
import FaFolder from '@meronex/icons/fa/FaFolder';
import * as api from '../api';

const DesignCard = observer(({ design, store, onDelete }) => {
  const [loading, setLoading] = React.useState(false);
  const handleSelect = async () => {
    setLoading(true);
    window.project.id = design.id;
    window.project.autosaveEnabled = true;
    window.project.name = design.name;
    const json = await api.loadById({ id: design.id });
    window.project.skipSaving = true;
    store.loadJSON(json);
    window.project.skipSaving = false;
    store.openSidePanel('photos');
    setLoading(false);
  };

  return (
    <Card
      style={{ margin: '3px', padding: '0px', position: 'relative' }}
      interactive
      onClick={() => {
        handleSelect();
      }}
    >
      <img src={design.previewURL} style={{ width: '100%' }} />
      <div
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: '3px',
        }}
      >
        {design.name}
      </div>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Spinner />
        </div>
      )}
      <div
        style={{ position: 'absolute', top: '5px', right: '5px' }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Popover
          content={
            <Menu>
              <MenuItem
                icon="document-open"
                text="Open"
                onClick={() => {
                  handleSelect();
                }}
              />
              {/* <MenuItem
                icon="duplicate"
                text="Copy"
                onClick={async () => {
                  handleCopy();
                }}
              /> */}
              <MenuItem
                icon="trash"
                text="Delete"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete it?')) {
                    onDelete({ id: design.id });
                  }
                }}
              />
            </Menu>
          }
          position={Position.BOTTOM}
        >
          <Button icon="more" />
        </Popover>
      </div>
    </Card>
  );
});

export const MyDesignsPanel = observer(({ store }) => {
  const [designsLoadings, setDesignsLoading] = React.useState(false);
  const [designs, setDesigns] = React.useState([]);

  const loadProjects = async () => {
    setDesignsLoading(true);
    const list = await api.listDesigns();
    setDesigns(list);
    setDesignsLoading(false);
  };

  const handleProjectDelete = ({ id }) => {
    setDesigns(designs.filter((design) => design.id !== id));
    api.deleteDesign({ id });
  };

  React.useEffect(() => {
    loadProjects();
  }, []);

  const half1 = [];
  const half2 = [];

  designs.forEach((design, index) => {
    if (index % 2 === 0) {
      half1.push(design);
    } else {
      half2.push(design);
    }
  });

  return (
    <div style={{ height: '100%' }}>
      <Button
        fill
        onClick={async () => {
          if (window.project.status !== 'saved') {
            const ids = store.pages
              .map((page) => page.children.map((child) => child.id))
              .flat();
            const hasObjects = ids?.length;
            if (hasObjects) {
              if (!window.confirm('Remove all content for a new design?')) {
                return;
              }
            }
          }
          window.project.skipSaving = true;
          const pagesIds = store.pages.map((p) => p.id);
          store.deletePages(pagesIds);
          store.addPage();
          window.project.skipSaving = false;
          window.project.name = 'Untitled Design';
          window.project.id = '';
          window.project.autosaveEnabled = true;
          store.openSidePanel('photos');
          await window.project.save();
        }}
      >
        Create new design
      </Button>
      {designsLoadings && <div>Loading...</div>}
      {!designsLoadings && !designs.length && <div>No designs yet</div>}
      {designsLoadings && (
        <div style={{ padding: '30px' }}>
          <Spinner />
        </div>
      )}
      <div style={{ display: 'flex', paddingTop: '5px' }}>
        <div style={{ width: '50%' }}>
          {half1.map((design) => (
            <DesignCard
              design={design}
              key={design.id}
              store={store}
              onDelete={handleProjectDelete}
            />
          ))}
        </div>
        <div style={{ width: '50%' }}>
          {half2.map((design) => (
            <DesignCard
              design={design}
              key={design.id}
              store={store}
              onDelete={handleProjectDelete}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

// define the new custom section
export const MyDesignsSection = {
  name: 'my-designs',
  Tab: (props) => (
    <SectionTab name="My Designs" {...props}>
      <FaFolder />
    </SectionTab>
  ),
  visibleInList: false,
  // we need observer to update component automatically on any store changes
  Panel: MyDesignsPanel,
};
