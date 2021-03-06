module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./node_modules/sass-loader/dist/cjs.js!./src/styles.scss":
/*!**********************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./node_modules/sass-loader/dist/cjs.js!./src/styles.scss ***!
  \**********************************************************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.id, "@media only screen and (min-height: 158px) {\n  .source-name {\n    -webkit-line-clamp: 3 !important;\n  }\n}\n.module {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  /* background-color: #3f3f3f; */\n}\n\n.module.visible {\n  background-color: green;\n}\n\n.module.hidden {\n  background-color: red;\n}\n\n.source-name {\n  color: #fff;\n  margin: 10px 0;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n  display: -webkit-box;\n  overflow: hidden;\n  max-width: 80vw;\n  text-align: center;\n}\n\n.source-name.inactive {\n  color: #b6b6b6;\n}\n\n#status-icon {\n  font-size: 45px;\n  width: 50px;\n  height: 50px;\n}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./src/styles.scss":
/*!*************************!*\
  !*** ./src/styles.scss ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


        var result = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!../node_modules/sass-loader/dist/cjs.js!./styles.scss */ "./node_modules/css-loader/dist/cjs.js??ruleSet[1].rules[2].use[1]!./node_modules/sass-loader/dist/cjs.js!./src/styles.scss");

        if (typeof result === "string") {
            module.exports = result;
        } else {
            module.exports = result.toString();
        }
    

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/styles.scss */ "./src/styles.scss");
/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (class extends window.casthub.module {
    /**
     * Initialize the new Module.
     */
    constructor() {
        super();
        // Set the Module HTML using the Template file.
        this.$container.appendChild(this.template());
        // Set the CSS from the external file.
        this.css = (_styles_scss__WEBPACK_IMPORTED_MODULE_0___default());
        /**
         * Used to store all detected sources and scenes
         *
         * @type {Object}
         */
        this.sceneItemMap = {};
        /**
         * The OBS WebSocket Instance for the action.
         *
         * @type {WS|null}
         */
        this.ws = null;
        // HTML Elements to manipulate
        this.$icon = this.$container.querySelector('#status-icon');
        this.$label = this.$container.querySelector('#label');
        this.$module = this.$container;
    }
    /**
     * Run any asynchronous code when the Module is mounted to DOM.
     *
     * @return {Promise}
     */
    async mounted() {
        //
        const { id } = this.identity;
        this.ws = await window.casthub.ws(id);
        this.sceneItemMap = await this.generateSceneItemMap();
        await this.refresh();
        this.ws.on('SceneItemVisibilityChanged', ({ sceneName, itemName }) => {
            if (sceneName !==
                this.sceneItemMap[this.props.sceneItem].sceneName &&
                itemName !== this.sceneItemMap[this.props.sceneItem].sourceName)
                return;
            this.refresh();
        });
        await super.mounted();
    }
    /**
     * Asynchronously builds all of the properties for this Module.
     *
     * @return {Promise}
     */
    async prepareProps() {
        let options = {};
        const items = Object.keys(this.sceneItemMap);
        const itemCount = items.length;
        for (let i = 0; i < itemCount; i++) {
            options[items[i]] = { text: `${this.sceneItemMap[items[i]].sceneName} - ${this.sceneItemMap[items[i]].sourceName} `, icon: 'widgets' };
        }
        const sceneItem = {
            type: "select" /* Select */,
            required: true,
            default: null,
            label: 'Source',
            help: 'Select a source to toggle',
            options
        };
        return {
            sceneItem
        };
    }
    /**
     * Called when the given property has changed.
     *
     * @param {String} key
     * @param {*} value
     * @param {Boolean} initial Whether this is the initial value, `false` if it's an update
     */
    onPropChange(key, value, initial) {
        //
        if (initial)
            return;
        if (key !== 'sceneItem')
            return; // Stop here if it's not sceneItem prop
        this.refresh();
    }
    async generateSceneItemMap() {
        const itemMap = {};
        const scenes = await this.getScenes();
        scenes.forEach(scene => {
            const { sources } = scene;
            sources.forEach(source => {
                const generatedName = `${encodeURI(scene.name)}|${encodeURI(source.name)}`;
                itemMap[generatedName] = {
                    sceneName: scene.name,
                    sourceName: source.name
                };
            });
        });
        return itemMap;
    }
    async refresh() {
        if (!this.sceneItemMap.hasOwnProperty(this.props.sceneItem) ||
            this.props.sceneItem === null) {
            return this.updateSourceState('No Source Selected!');
        }
        const isVisible = await this.getSourceVisibility(this.sceneItemMap[this.props.sceneItem].sceneName, this.sceneItemMap[this.props.sceneItem].sourceName);
        this.updateSourceState(`${this.sceneItemMap[this.props.sceneItem].sceneName} - ${this.sceneItemMap[this.props.sceneItem].sourceName}`, isVisible);
    }
    updateSourceState(text, state = null) {
        switch (state) {
            case null:
                this.$icon.setAttribute('type', 'casthub');
                this.$module.className = 'module';
                break;
            case true:
                this.$icon.setAttribute('type', 'visibility_on');
                this.$module.className = 'module visible';
                break;
            case false:
                this.$icon.setAttribute('type', 'visibility_off');
                this.$module.className = 'module hidden';
                break;
            default:
                this.$module.className = 'module';
                break;
        }
        this.$label.innerText = text;
    }
    async getSourceVisibility(scene, source) {
        const sourceSettings = await this.ws.send('GetSceneItemProperties', {
            'scene-name': scene,
            item: source,
        });
        const { visible } = sourceSettings;
        return visible;
    }
    async getScenes() {
        const { scenes } = await this.ws.send('GetSceneList');
        return scenes;
    }
});
;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/index.ts");
/******/ })()
.default;