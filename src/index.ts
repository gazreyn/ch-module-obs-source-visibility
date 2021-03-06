import { CardIO, PropType, PropList, PropItem, PropOptions, WS } from '@casthub/types';
import { Scene } from 'obs-websocket-js';
import css from '@/styles.scss'

export default class extends window.casthub.module<{
    sceneItem: string
}>{
    ws: WS;
    /**
     * Initialize the new Module.
     */
    constructor() {
        super();

        // Set the Module HTML using the Template file.
        this.$container.appendChild(this.template());

        // Set the CSS from the external file.
        this.css = css;

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
    public async mounted(): Promise<void> {
        //

        const { id } = this.identity;
        this.ws = await window.casthub.ws(id);

        this.sceneItemMap = await this.generateSceneItemMap();

        await this.refresh();

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
    async prepareProps(): Promise<PropList> {
        let options: PropOptions = {};

        const items: string[] = Object.keys(this.sceneItemMap);
        const itemCount: number = items.length;

        for(let i = 0; i < itemCount; i++) {
            options[items[i]] = { text: `${this.sceneItemMap[items[i]].sceneName} - ${this.sceneItemMap[items[i]].sourceName} `, icon: 'widgets'};
        }

        const sceneItem : PropItem = {
            type: PropType.Select,
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
    public onPropChange(key: string, value: any, initial: boolean): void {
        //
        if (initial) return;
        if (key !== 'sceneItem') return; // Stop here if it's not sceneItem prop

        this.refresh();
    }

    public async generateSceneItemMap(): Promise<any> {

        const itemMap = {};

        const scenes = await this.getScenes();
        
        scenes.forEach(scene => {
            const { sources } = scene;
            sources.forEach(source => {
                const generatedName: string = `${encodeURI(scene.name)}|${encodeURI(source.name)}`;
                itemMap[generatedName] = {
                    sceneName: scene.name,
                    sourceName: source.name
                }
            });
        });

        return itemMap;
    }

    public async refresh(): Promise<void> {
        
        if (
            !this.sceneItemMap.hasOwnProperty(this.props.sceneItem) ||
            this.props.sceneItem === null
        ) {
            return this.updateSourceState('No Source Selected!');
        }

        const isVisible: boolean = await this.getSourceVisibility(
            this.sceneItemMap[this.props.sceneItem].sceneName,
            this.sceneItemMap[this.props.sceneItem].sourceName
        );

        this.updateSourceState(
            `${this.sceneItemMap[this.props.sceneItem].sceneName} - ${
                this.sceneItemMap[this.props.sceneItem].sourceName
            }`,
            isVisible
        );
    }

    public updateSourceState(text: string, state: boolean = null): void {
        switch (state) {
            case null:
                this.$icon.setAttribute('type', 'obs');
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

    public async getSourceVisibility(scene: string, source: string): Promise<boolean> {
        const sourceSettings = await this.ws.send('GetSceneItemProperties', {
            'scene-name': scene,
            item: source,
        });

        const { visible } = sourceSettings;
        return visible;
    }

    public async getScenes(): Promise<Scene[]> {
        const { scenes } = await this.ws.send('GetSceneList');
        return scenes;
    }
};
