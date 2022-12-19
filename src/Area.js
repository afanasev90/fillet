class FilletArea {
    #topLeftPoint = null;
    #width = null;
    #height = null;
    
    constructor(topleft, width, height){
        this.#topLeftPoint = topleft;
        this.#width = width;
        this.#height = height;
    }

    getWidth(){
        return this.#width;
    }

    getHeight(){
        return this.#height;
    }

    getX(){
        return this.#topLeftPoint.getX();
    }

    getY(){
        return this.#topLeftPoint.getY();
    }
}