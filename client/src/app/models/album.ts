export class Album{

    public title: string;
    public description: string;
    public year: number;
    public image: string;
    public artist: string;

    constructor (title: string, description: string, year: number, image: string, artist: string){
        this.title = title;
        this.description = description;
        this.year = year;
        this.image = image;
        this.artist = artist;
    }
}
