class FilletCoreManager {
    #browser_window_onresize_bind = null;
    #event_listeners = [];

    constructor(){
        this.#browser_window_onresize_bind = this.browser_window_onresize.bind(this);

        window.addEventListener("resize", this.#browser_window_onresize_bind);
    }

    browser_window_onresize(e){

        for (let l of this.#event_listeners){
            l.browserWindowResizeEvent(e);
        }
    }

    addEventListener(listener){
        this.#event_listeners.push(listener);
    }
}

const _FilletLib_CoreManager = new FilletCoreManager();
Object.freeze(_FilletLib_CoreManager);