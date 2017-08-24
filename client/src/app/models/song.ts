export class Song {
    public number: number;
    public name: string;
    public duration: string;
    public file: string;
    public album: string;

    constructor(number: number, name: string, duration: string, file: string, album: string){
        this.number = number;
        this.name = name;
        this.duration = duration;
        this.file = file;
        this.album = album; 
    }
}
