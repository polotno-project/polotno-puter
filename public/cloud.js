window.Cloud = class Cloud {
  #appInstanceID;
  #callbackFunctions = [];
  onWindowClose;
  onItemsOpened;
  constructor(options) {
    (options = options ?? {}).onWindowClose &&
      'function' == typeof options.onWindowClose &&
      (this.onWindowClose = options.onWindowClose),
      options.onItemsOpened &&
        'function' == typeof options.onItemsOpened &&
        (this.onItemsOpened = options.onItemsOpened);
    options = new URLSearchParams(window.location.search);
    options.has('puter.app_instance_id') &&
      (this.#appInstanceID = decodeURIComponent(
        options.get('puter.app_instance_id')
      )),
      window.parent.postMessage(
        {
          msg: 'READY',
          appInstanceID: this.#appInstanceID,
        },
        '*'
      ),
      this.#bindEvent(window, 'message', async (e) => {
        if (void 0 !== e.data.msg && 'focus' === e.data.msg) window.focus();
        else if (void 0 !== e.data.msg && 'click' === e.data.msg) {
          var clicked_el = document.elementFromPoint(e.data.x, e.data.y);
          null !== clicked_el && clicked_el.click();
        } else if (void 0 !== e.data.msg && 'windowWillClose' === e.data.msg)
          void 0 === this.onWindowClose
            ? window.parent.postMessage(
                {
                  msg: !0,
                  appInstanceID: this.#appInstanceID,
                  original_msg_id: e.data.msg_id,
                },
                '*'
              )
            : (window.parent.postMessage(
                {
                  msg: !1,
                  appInstanceID: this.#appInstanceID,
                  original_msg_id: e.data.msg_id,
                },
                '*'
              ),
              this.onWindowClose());
        else if ('itemsOpened' === e.data.msg)
          if (void 0 === this.onItemsOpened)
            window.parent.postMessage(
              {
                msg: !0,
                appInstanceID: this.#appInstanceID,
                original_msg_id: e.data.msg_id,
              },
              '*'
            );
          else {
            window.parent.postMessage(
              {
                msg: !1,
                appInstanceID: this.#appInstanceID,
                original_msg_id: e.data.msg_id,
              },
              '*'
            );
            var items = [];
            if (0 < e.data.items.length)
              for (let index = 0; index < e.data.items.length; index++)
                items.push(new CloudFile(e.data.items[index]));
            this.onItemsOpened(items);
          }
        else
          e.data.original_msg_id &&
            this.#callbackFunctions[e.data.original_msg_id] &&
            ('fileOpenPicked' === e.data.msg
              ? this.#callbackFunctions[e.data.original_msg_id](
                  new CloudFile({
                    uid: e.data.uid,
                    name: e.data.fsentry_name,
                    readURL: e.data.read_url,
                    writeURL: e.data.write_url,
                  })
                )
              : 'colorPicked' === e.data.msg
              ? this.#callbackFunctions[e.data.original_msg_id](e.data.color)
              : 'FONT_PICKED' === e.data.msg
              ? this.#callbackFunctions[e.data.original_msg_id](e.data.font)
              : 'getItemSucceeded' === e.data.msg
              ? this.#callbackFunctions[e.data.original_msg_id](e.data.value)
              : 'alertResponded' === e.data.msg
              ? this.#callbackFunctions[e.data.original_msg_id](e.data.response)
              : 'FILE_SAVED' === e.data.msg
              ? this.#callbackFunctions[e.data.original_msg_id](
                  new CloudFile({
                    uid: e.data.saved_file.uid,
                    name: e.data.saved_file.name,
                    readURL: e.data.saved_file.readURL,
                    writeURL: e.data.saved_file.writeURL,
                  })
                )
              : this.#callbackFunctions[e.data.original_msg_id](e.data),
            delete this.#callbackFunctions[e.data.original_msg_id]);
      }),
      options.has('puter.item.name') &&
        options.has('puter.item.uid') &&
        options.has('puter.item.read_url') &&
        window.postMessage(
          {
            msg: 'itemsOpened',
            appInstanceID: this.#appInstanceID,
            items: [
              {
                name: options.get('puter.item.name'),
                uid: options.get('puter.item.uid'),
                readURL: options.get('puter.item.read_url'),
                writeURL: options.get('puter.item.write_url'),
              },
            ],
          },
          '*'
        );
  }
  #uuidv4 = function () {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  };
  #bindEvent = function (element, eventName, eventHandler) {
    element.addEventListener
      ? element.addEventListener(eventName, eventHandler, !1)
      : element.attachEvent &&
        element.attachEvent('on' + eventName, eventHandler);
  };
  alert = function (message, buttons, options, callback) {
    return new Promise((resolve) => {
      var msg_id = this.#uuidv4();
      window.parent.postMessage(
        {
          msg: 'ALERT',
          message: message,
          buttons: buttons,
          options: options,
          appInstanceID: this.#appInstanceID,
          uuid: msg_id,
        },
        '*'
      ),
        (this.#callbackFunctions[msg_id] = resolve);
    });
  };
  env = function (callback) {
    return new Promise((resolve) => {
      var msg_id = this.#uuidv4();
      window.parent.postMessage(
        {
          msg: 'env',
          appInstanceID: this.#appInstanceID,
          uuid: msg_id,
        },
        '*'
      ),
        (this.#callbackFunctions[msg_id] = resolve);
    });
  };
  getItem = function (key, callback) {
    return new Promise((resolve) => {
      var msg_id = this.#uuidv4();
      window.parent.postMessage(
        {
          msg: 'getItem',
          key: key,
          appInstanceID: this.#appInstanceID,
          uuid: msg_id,
        },
        '*'
      ),
        (this.#callbackFunctions[msg_id] = resolve);
    });
  };
  removeItem = function (key, callback) {
    return new Promise((resolve) => {
      var msg_id = this.#uuidv4();
      window.parent.postMessage(
        {
          msg: 'REMOVE_ITEM',
          key: key,
          appInstanceID: this.#appInstanceID,
          uuid: msg_id,
        },
        '*'
      ),
        (this.#callbackFunctions[msg_id] = resolve);
    });
  };
  showOpenFilePicker = function (options, callback) {
    return new Promise((resolve) => {
      var msg_id = this.#uuidv4();
      window.parent.postMessage(
        {
          msg: 'showOpenFilePicker',
          appInstanceID: this.#appInstanceID,
          uuid: msg_id,
          options: options,
        },
        '*'
      ),
        (this.#callbackFunctions[msg_id] = resolve);
    });
  };
  showFontPicker = function (options) {
    return new Promise((resolve) => {
      var msg_id = this.#uuidv4();
      window.parent.postMessage(
        {
          msg: 'showFontPicker',
          appInstanceID: this.#appInstanceID,
          options: options,
          uuid: msg_id,
        },
        '*'
      ),
        (this.#callbackFunctions[msg_id] = resolve);
    });
  };
  showColorPicker = function (options) {
    return new Promise((resolve) => {
      var msg_id = this.#uuidv4();
      window.parent.postMessage(
        {
          msg: 'showColorPicker',
          appInstanceID: this.#appInstanceID,
          options: options,
          uuid: msg_id,
        },
        '*'
      ),
        (this.#callbackFunctions[msg_id] = resolve);
    });
  };
  showSaveFilePicker = function (content, suggestedName) {
    return new Promise((resolve) => {
      var msg_id = this.#uuidv4();
      window.parent.postMessage(
        {
          msg: 'showSaveFilePicker',
          appInstanceID: this.#appInstanceID,
          content: content,
          suggestedName: suggestedName ?? '',
          uuid: msg_id,
        },
        '*'
      ),
        (this.#callbackFunctions[msg_id] = resolve);
    });
  };
  saveToPictures = function (filename, content) {
    return new Promise((resolve) => {
      var msg_id = this.#uuidv4();
      window.parent.postMessage(
        {
          msg: 'saveToPictures',
          appInstanceID: this.#appInstanceID,
          content: content,
          filename: filename ?? '',
          uuid: msg_id,
        },
        '*'
      ),
        (this.#callbackFunctions[msg_id] = resolve);
    });
  };
  saveToDocuments = function (filename, content) {
    return new Promise((resolve) => {
      var msg_id = this.#uuidv4();
      window.parent.postMessage(
        {
          msg: 'saveToDocuments',
          appInstanceID: this.#appInstanceID,
          content: content,
          filename: filename ?? '',
          uuid: msg_id,
        },
        '*'
      ),
        (this.#callbackFunctions[msg_id] = resolve);
    });
  };
  saveToDesktop = function (filename, content) {
    return new Promise((resolve) => {
      var msg_id = this.#uuidv4();
      window.parent.postMessage(
        {
          msg: 'saveToDesktop',
          appInstanceID: this.#appInstanceID,
          content: content,
          filename: filename ?? '',
          uuid: msg_id,
        },
        '*'
      ),
        (this.#callbackFunctions[msg_id] = resolve);
    });
  };
  saveToAudio = function (filename, content) {
    return new Promise((resolve) => {
      var msg_id = this.#uuidv4();
      window.parent.postMessage(
        {
          msg: 'saveToAudio',
          appInstanceID: this.#appInstanceID,
          content: content,
          filename: filename ?? '',
          uuid: msg_id,
        },
        '*'
      ),
        (this.#callbackFunctions[msg_id] = resolve);
    });
  };
  saveToVideos = function (filename, content) {
    return new Promise((resolve) => {
      var msg_id = this.#uuidv4();
      window.parent.postMessage(
        {
          msg: 'saveToVideos',
          appInstanceID: this.#appInstanceID,
          content: content,
          filename: filename ?? '',
          uuid: msg_id,
        },
        '*'
      ),
        (this.#callbackFunctions[msg_id] = resolve);
    });
  };
  setWindowTitle = function (title, callback) {
    return new Promise((resolve) => {
      var msg_id = this.#uuidv4();
      window.parent.postMessage(
        {
          msg: 'setWindowTitle',
          new_title: title,
          appInstanceID: this.#appInstanceID,
          uuid: msg_id,
        },
        '*'
      ),
        (this.#callbackFunctions[msg_id] = resolve);
    });
  };
  launchApp = function (appName, callback) {
    return new Promise((resolve) => {
      var msg_id = this.#uuidv4();
      window.parent.postMessage(
        {
          msg: 'launchApp',
          app_name: appName,
          appInstanceID: this.#appInstanceID,
        },
        '*'
      ),
        (this.#callbackFunctions[msg_id] = resolve);
    });
  };
  createWindow = function (options, callback) {
    var msg_id = this.#uuidv4();
    window.parent.postMessage(
      {
        msg: 'createWindow',
        options: options ?? {},
        appInstanceID: this.#appInstanceID,
        uuid: msg_id,
      },
      '*'
    ),
      (this.#callbackFunctions[msg_id] = callback);
  };
  setItem = function (key, value, callback) {
    var msg_id = this.#uuidv4();
    window.parent.postMessage(
      {
        msg: 'setItem',
        key: key,
        value: value,
        appInstanceID: this.#appInstanceID,
        uuid: msg_id,
      },
      '*'
    ),
      (this.#callbackFunctions[msg_id] = callback);
  };
  exit = function (callback) {
    var msg_id = this.#uuidv4();
    window.parent.postMessage(
      {
        msg: 'exit',
        appInstanceID: this.#appInstanceID,
        uuid: msg_id,
      },
      '*'
    ),
      (this.#callbackFunctions[msg_id] = callback);
  };
  menubar = function () {
    document.addEventListener('click', function (e) {
      if ($(e.target).hasClass('dropdown-item-disabled')) return !1;
      $(e.target).is('.menubar-item') ||
        ($('.menubar-item.menubar-item-open').removeClass('menubar-item-open'),
        $('.dropdown').hide());
    }),
      window.addEventListener('blur', function (e) {
        $(e.target).is('.menubar > li') ||
          ($('.dropdown').hide(),
          $('.menubar-item.menubar-item-open').removeClass(
            'menubar-item-open'
          ));
      }),
      $('.menubar-item').on('mousedown', function (e) {
        $('.dropdown').hide(),
          $('.menubar-item.menubar-item-open')
            .not(this)
            .removeClass('menubar-item-open'),
          $(this).hasClass('menubar-item-open')
            ? $('.menubar-item.menubar-item-open').removeClass(
                'menubar-item-open'
              )
            : $(e.target).hasClass('dropdown-item') ||
              ($(this).addClass('menubar-item-open'),
              $(this).siblings('.dropdown').show());
      });
  };
};
class CloudFile {
  constructor(options) {
    (this.readURL = options.readURL),
      (this.writeURL = options.writeURL),
      (this.name = options.name),
      (this.uid = options.uid);
  }
  write = function (data) {
    var formData = new FormData();
    return (
      formData.append('file', new File([data], 'whatever')),
      fetch(this.writeURL, {
        method: 'POST',
        body: formData,
      })
    );
  };
  blob = async function () {
    return (await fetch(this.readURL)).blob();
  };
  arrayBuffer = async function () {
    return (await fetch(this.readURL)).arrayBuffer();
  };
  formData = async function () {
    return (await fetch(this.readURL)).formData();
  };
  text = async function () {
    return (await fetch(this.readURL)).text();
  };
  json = async function () {
    return (await fetch(this.readURL)).json();
  };
}
