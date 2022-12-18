class FilletWindow {
    #document = null;
    #root_exists = false;
    #root = null;

    #move_start_pos = [];
    #is_moving = false;

    #doc_mouse_down_binded = null;
    #doc_mouse_up_binded = null;
    #doc_mouse_move_binded = null;

    constructor(element=null){
        if (element instanceof HTMLElement){
            this.#root = element;
            this.#root_exists = true;
        } else {
            this.#root = document.createElement("div");
        }

        if (!this.#root_exists){
            document.body.appendChild(this.#root);
        }
    
        this.#document = document;
        this.#root.classList.add("fillet-window");
        
        this.#root.addEventListener("mousedown", this.mouse_down.bind(this));
        this.#root.addEventListener("mouseup",  this.mouse_up.bind(this));
        this.#root.addEventListener("mousemove", this.mouse_move.bind(this));
    }

    doc_mouse_down(e){
        
    }

    doc_mouse_up(e){
        this.mouse_up(e);
    }

    doc_mouse_move(e){
        if (this.#is_moving){
            this.#root.style.left = (this.#move_start_pos[0] + e.clientX - this.#move_start_pos[2]) + "px";
            this.#root.style.top = (this.#move_start_pos[1] + e.clientY - this.#move_start_pos[3]) + "px";
        }
    }

    mouse_down(e){
        this.#is_moving = true;

        let coords = this.#root.getBoundingClientRect();
 
        this.#move_start_pos = [e.clientX + (coords.x - e.clientX), e.clientY + (coords.y - e.clientY), e.clientX, e.clientY];
        
        this.#doc_mouse_down_binded = this.doc_mouse_down.bind(this);
        this.#doc_mouse_up_binded = this.doc_mouse_up.bind(this);
        this.#doc_mouse_move_binded = this.doc_mouse_move.bind(this);

        this.#document.addEventListener("mousedown", this.#doc_mouse_down_binded);
        this.#document.addEventListener("mouseup",  this.#doc_mouse_up_binded);
        this.#document.addEventListener("mousemove", this.#doc_mouse_move_binded);
    }

    mouse_up(e){
        this.#is_moving = false;
        this.#document.removeEventListener("mousedown", this.#doc_mouse_down_binded);
        this.#document.removeEventListener("mouseup", this.#doc_mouse_up_binded);
        this.#document.removeEventListener("mousemove", this.#doc_mouse_move_binded);
    }

    mouse_move(e){
        
    }
}