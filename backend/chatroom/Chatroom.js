class Chatroom{
    #users = Map();
    #id;
    #messages;
    #name;

    constructor(id, name){
        this.#id = id;
        this.#messages = [];
        this.#users = Map();
        this.#name = name;
    }

    get id(){
        return this.#id;
    };

    get messages(){
        return this.#messages;
    };

    get users(){
        return this.#users;
    };

    addMessage(message){
        this.#messages.push(message);
    };

    addUser(user){
        this.#users.set(user['id'],user);
    };

    deleteUser(userId){
        this.#users.delete(userId);
    };
}