export class User{

    public _id: string;
    public name: string;
    public surname: string;
    public email: string;
    public password: string;
    public role: string;
    public image: string;

    constructor(_id: string, name: string, surname: string, email: string, password: string, role: string, image: string){
        this._id = _id;
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.role = role;
        this.image = image;
    }
}
