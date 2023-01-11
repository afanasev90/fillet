/**
 * Creates a new FilletWindow.
 * @class
 */
class FilletWindow {
    /** 
     * Browser Document object
     * @type {Object} 
     * @private
    */
    #document = null;

    /** 
     * Flag. True if root element exists 
     * @type {boolean} 
     * @private
    */
    #root_exists = false;

    /** 
     * Root element object
     * @type {Object} 
     * @private
    */
    #root = null;

    /** 
     * Position of the top left corner of the window
     * @type {FilletPoint} 
     * @private
    */
    #topLeft = null;

    /** 
     * Title of the window
     * @type {string} 
     * @private
    */
    #title = null;

     /** 
     * FilletMovePosition object
     * @type {FilletMovePosition} 
     * @private
    */
    #mp = null;

    /** 
     * Flag. True if the window is moving
     * @type {boolean} 
     * @private
    */
    #is_moving = false;

    /** 
     * Area of the window
     * @type {FilletArea} 
     * @private
    */
    #bound_area = null;

    /** 
     * Flag. Window can be moved out of bounds
     * @type {boolean} 
     * @private
    */
    #can_outofbounds = false;

    /** 
     * Flag. Window can be sticked to browser window edge
     * @type {boolean} 
     * @private
    */
    #can_edgestick = true;

    /** 
     * Size of zone where window can be sticked
     * @type {number} 
     * @private
    */
    #stickAreaWidth = 20;

    /** 
     * Binded function "mouse down"
     * @type {function} 
     * @private
    */
    #doc_mouse_down_binded = null;

    /** 
     * Binded function "mouse up"
     * @type {function} 
     * @private
    */
    #doc_mouse_up_binded = null;

    /** 
     * Binded function "mouse move"
     * @type {function} 
     * @private
    */
    #doc_mouse_move_binded = null;

    /** 
     * Core manager object
     * @type {FilletCoreManager} 
     * @private
    */
    #core_manager = null;

    /**
     * Represents a window.
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
    
        this.#core_manager = _FilletLib_CoreManager;
        this.#document = document;
        this.#root.classList.add("fillet-window");

        this.#title = document.createElement("div");
        this.#title.classList.add("fillet-window-title");
        this.#root.appendChild(this.#title);

        let coords = this.#root.getBoundingClientRect();
        this.#topLeft = new FilletPoint(coords.x, coords.y);
        
        this.#title.addEventListener("mousedown", this.mouse_down.bind(this));
        this.#title.addEventListener("mouseup",  this.mouse_up.bind(this));
        this.#title.addEventListener("mousemove", this.mouse_move.bind(this));
        this.#root.addEventListener("mousedown", this.mouse_down.bind(this));
        this.#root.addEventListener("mouseup",  this.mouse_up.bind(this));
        this.#root.addEventListener("mousemove", this.mouse_move.bind(this));

        this.#bound_area = new FilletArea(new FilletPoint(0, 0), window.innerWidth, window.innerHeight);
        this.#core_manager.registerWindow(this);
        this.#core_manager.addEventListener(this);
    }

    getWidth(){
        return this.#root.offsetWidth;
    }

    getHeight(){
        return this.#root.offsetHeight;
    }

    getRoot(){
        return this.#root;
    }


    doc_mouse_down(e){
        
    }

    doc_mouse_up(e){
        this.mouse_up(e);
    }

    doc_mouse_move(e){
        if (this.#is_moving){
            let curPos = new FilletPoint(e.clientX, e.clientY);
            
            let win_x = (this.#mp.getStartX() + curPos.getX() - this.#mp.getClickX());
            let win_y = (this.#mp.getStartY() + curPos.getY() - this.#mp.getClickY());
    
            if (!this.#can_outofbounds) {
                if (win_x < this.#bound_area.getX()){
                    win_x = 0;
                    this.#mp.changeClickPoint(new FilletPoint(Math.max(0, curPos.getX()), this.#mp.getClickY()));
                    this.#mp.changeStartPoint(new FilletPoint(0, this.#mp.getStartY()));
                } 
                else if (win_x+this.getWidth() > this.#bound_area.getWidth()){
                    win_x = this.#bound_area.getWidth() - this.getWidth(); 
                    this.#mp.changeClickPoint(new FilletPoint(Math.min(this.#bound_area.getWidth(), curPos.getX()), this.#mp.getClickY()));
                    this.#mp.changeStartPoint(new FilletPoint(win_x, this.#mp.getStartY()));
                }
                
                if (win_y < this.#bound_area.getY()){
                    win_y = 0;
                    this.#mp.changeClickPoint(new FilletPoint(this.#mp.getClickX(), Math.max(0, curPos.getY())));
                    this.#mp.changeStartPoint(new FilletPoint(this.#mp.getStartX(), 0));
                } 
                else if (win_y+this.getHeight() > this.#bound_area.getHeight()){
                    win_y = this.#bound_area.getHeight() - this.getHeight(); 
                    this.#mp.changeClickPoint(new FilletPoint(this.#mp.getClickX(), Math.min(this.#bound_area.getHeight(), curPos.getY())));
                    this.#mp.changeStartPoint(new FilletPoint(this.#mp.getStartX(), win_y));
                }
            }

            if (this.#can_edgestick){
                if (win_x < this.#stickAreaWidth && win_x > this.#bound_area.getX()){
                    win_x = 0;
                }
                else if (win_x > this.#bound_area.getWidth() - this.getWidth() - this.#stickAreaWidth && win_x < this.#bound_area.getWidth() - this.getWidth()){
                    win_x = this.#bound_area.getWidth() - this.getWidth();
                }

                if (win_y < this.#stickAreaWidth && win_y > this.#bound_area.getY()){
                    win_y = 0;
                }
                else if (win_y > this.#bound_area.getHeight() - this.getHeight() - this.#stickAreaWidth && win_y < this.#bound_area.getHeight() - this.getHeight()){
                    win_y = this.#bound_area.getHeight() - this.getHeight();
                }
            }

            this.placeWindow(win_x, win_y);

            this.#root.style.cursor = "grabbing";
        }
    }

    hide(){
        this.#root.style.display = "none";
    }


    show(){
        this.#root.style.display = "block";
    }

    placeWindow(x, y){
        this.#topLeft = new FilletPoint(x, y);
        this.#root.style.left = x + "px";
        this.#root.style.top = y + "px";
    }

    moveWindowInBounds(){
        let nx = this.#topLeft.getX();
        let ny = this.#topLeft.getY();

        if (this.#topLeft.getX() < this.#bound_area.getX()){
            nx = 0;
        } 
        else if (this.#topLeft.getX() + this.getWidth() > this.#bound_area.getWidth()){
            nx = this.#bound_area.getWidth() - this.getWidth();
        }

        if (this.#topLeft.getY() < this.#bound_area.getY()){
            ny = 0;
        } 
        else if (this.#topLeft.getY() + this.getHeight() > this.#bound_area.getHeight()){
            ny = this.#bound_area.getHeight() - this.getHeight();
        }

        this.placeWindow(nx, ny);
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

    browserWindowResizeEvent(e){
        this.#bound_area.setDimensions(window.innerWidth, window.innerHeight);
        this.moveWindowInBounds();
    }

    resize(w, h){
        this.#root.style.width = w + "px";
        this.#root.style.height = h + "px";

        if (!this.#can_outofbounds){
            this.moveWindowInBounds();
        }
    }
}