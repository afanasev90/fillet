class FilletMovePosition {
    #start = null;
    #click = null;

    constructor(start_point, click_point){
        this.#start = start_point;
        this.#click = click_point;
    }



    getStartX(){
        return this.#start.getX();
    }

    getStartY(){
        return this.#start.getY();
    }

    getClickX(){
        return this.#click.getX();
    }

    getClickY(){
        return this.#click.getY();
    }

    changeClickPoint(new_point){
        this.#click = new_point;
    }

    changeStartPoint(new_point){
        this.#start = new_point;
    }
}