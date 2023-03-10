/**
 * Creates a new FilletPoint.
 * @class
 */
class FilletPoint {
    #x = null;
    #y = null;

    constructor(x, y){
        this.#x = x;
        this.#y = y;
    }

    getX(){
        return this.#x;
    }

    getY(){
        return this.#y;
    }
}