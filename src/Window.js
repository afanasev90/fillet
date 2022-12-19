
class FilletWindow {
    #document = null;
    #root_exists = false;
    #root = null;

    #mp = null;
    #is_moving = false;

    #bound_area = null;
    #can_outofbounds = false;

    #doc_mouse_down_binded = null;
    #doc_mouse_up_binded = null;
    #doc_mouse_move_binded = null;

    /**
     * Represents a book.
     * @constructor
     * @param {string} element - User defined HTML element
     */
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

        this.#bound_area = new FilletArea(new FilletPoint(0, 0), window.innerWidth, window.innerHeight);
    }

    getWidth(){
        return this.#root.offsetWidth;
    }

    getHeight(){
        return this.#root.offsetHeight;
    }


    doc_mouse_down(e){
        
    }

    doc_mouse_up(e){
        this.mouse_up(e);
    }

    doc_mouse_move(e){
        if (this.#is_moving){
            let win_x = (this.#mp.getStartX() + e.clientX - this.#mp.getClickX());
            let win_y = (this.#mp.getStartY() + e.clientY - this.#mp.getClickY());
            if (win_x < this.#bound_area.getX()){
                win_x = 0;
                this.#mp.changeClickPoint(new FilletPoint(Math.max(0, e.clientX), this.#mp.getClickY()));
                this.#mp.changeStartPoint(new FilletPoint(0, this.#mp.getStartY()));
            } else if (win_x+this.getWidth() > this.#bound_area.getWidth()){
                win_x = this.#bound_area.getWidth() - this.getWidth(); 
                this.#mp.changeClickPoint(new FilletPoint(Math.min(this.#bound_area.getWidth(), e.clientX), this.#mp.getClickY()));
                this.#mp.changeStartPoint(new FilletPoint(win_x, this.#mp.getStartY()));
            }
            
            if (win_y < this.#bound_area.getY()){
                win_y = 0;
                this.#mp.changeClickPoint(new FilletPoint(this.#mp.getClickX(), Math.max(0, e.clientY)));
                this.#mp.changeStartPoint(new FilletPoint(this.#mp.getStartX(), 0));
            } else if (win_y+this.getHeight() > this.#bound_area.getHeight()){
                win_y = this.#bound_area.getHeight() - this.getHeight(); 
                this.#mp.changeClickPoint(new FilletPoint(this.#mp.getClickX(), Math.min(this.#bound_area.getHeight(), e.clientY)));
                this.#mp.changeStartPoint(new FilletPoint(this.#mp.getStartX(), win_y));
            }

            this.#root.style.left = win_x + "px";
            this.#root.style.top = win_y + "px";
            this.#root.style.cursor = "grabbing";
        }
    }

    mouse_down(e){
        this.#is_moving = true;

        let coords = this.#root.getBoundingClientRect();
        let windowLeftTop = new FilletPoint(coords.x, coords.y);
        let startPoint = new FilletPoint(
            e.clientX + (windowLeftTop.getX() - e.clientX), 
            e.clientY + (windowLeftTop.getY() - e.clientY)
            );
        let clickPoint = new FilletPoint(e.clientX, e.clientY);
        this.#mp = new FilletMovePosition(startPoint, clickPoint);

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

        this.#root.style.cursor = "auto";
    }

    mouse_move(e){
        
    }
}