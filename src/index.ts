import css from '@/styles.scss'

export default class extends window.casthub.module<{
    sceneItem: string
}>{
    /**
     * Initialize the new Module.
     */
    constructor() {
        super();

        // Set the Module HTML using the Template file.
        this.$container.appendChild(this.template());

        // Set the CSS from the external file.
        this.css = css;

        this.$icon = this.$container.querySelector('#status-icon');
        this.$label = this.$container.querySelector('#label');
        this.$module = this.$container;

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

        await this.fetch();
        await this.refresh();

        // When the active Scene is changed, run with it.
        this.ws.on('SceneItemVisibilityChanged', ({ sceneName, itemName }) => {
            if (
                sceneName !==
                    this.sceneItemMap[this.props.sceneItem].sceneName &&
                itemName !== this.sceneItemMap[this.props.sceneItem].sourceName
            ) return;
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
        //

        let options = {};

        const items = Object.keys(this.sceneItemMap);
        const itemCount = items.length;

        for (let i = 0; i < itemCount; i++) {
            options[items[i]] = {
                text: `${this.sceneItemMap[items[i]].sceneName} - ${
                    this.sceneItemMap[items[i]].sourceName
                } `,
                icon: 'widgets',
            };
        }

        return {
            sceneItem: {
                type: 'select',
                required: true,
                default: null,
                label: 'Source',
                help: 'Select a source to toggle',
                options,
            },
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
        if (initial) return;
        if (key !== 'sceneItem') return; // Stop here if it's not sceneItem prop

        this.refresh();
    }

    async fetch() {

        const scenes = await this.getScenes();

        scenes.forEach((scene) => {
            const { sources } = scene;
            sources.forEach((source) => {
                const generatedName = `${encodeURI(scene.name)}|${encodeURI(
                    source.name
                )}`;
                this.sceneItemMap[generatedName] = {
                    sceneName: scene.name,
                    sourceName: source.name,
                };
            });
        });
    }

    async refresh() {
        
        if (
            !this.sceneItemMap.hasOwnProperty(this.props.sceneItem) ||
            this.props.sceneItem === null
        ) {
            return this.updateSourceState('No Source Selected!');
        }

        const visible = await this.getSourceVisibility(
            this.sceneItemMap[this.props.sceneItem].sceneName,
            this.sceneItemMap[this.props.sceneItem].sourceName
        );

        return this.updateSourceState(
            `${this.sceneItemMap[this.props.sceneItem].sceneName} - ${
                this.sceneItemMap[this.props.sceneItem].sourceName
            }`,
            visible
        );
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
};
