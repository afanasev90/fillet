class FilletCoreManager {
    #browser_window_onresize_bind = null;
    #event_listeners = [];
    #windows = [];

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

    registerWindow(window){
        this.#windows.push(window);
    }

    illuminateAllWindows(){
        for (let w of this.#windows){
            this.illuminateWindow(w);
        }
    }

    illuminateWindow(window){
        let r = window.getRoot();
        r.addEventListener("transitionend", function(){
            r.classList.remove("fillet_illuminate");
        }, true);
        r.classList.add("fillet_illuminate");
    }
}

const _FilletLib_CoreManager = new FilletCoreManager();
Object.freeze(_FilletLib_CoreManager);