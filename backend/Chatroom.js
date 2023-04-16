class Chatroom{
    #users = new Map();
    #id;
    #messages;
    #name;

    constructor(id, name){
        this.#id = id;
        this.#messages = []; 
        this.#users = new Map();
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

    get name(){
        return this.#name;
    }

    /**
     * Adds a message to the chatroom
     * @param {*} message message of chatroom
     */
    addMessage(message){
        this.#messages.push(message);
        console.log(`Added Message ${message}`);
    };

    /**
     * Adds a new user to the chatroom
     * @param {*} user format {id: "unique name"}
     */
    addUser(user){
        this.#users.forEach(u=>{
            if(u['id'] === user['id']){
                return false;
            }
        });
        this.#users.set(user['id'],user);
        return true;
    };

    /**
     * Removes a user from the chatroom
     * @param {*} userId 
     */
    deleteUser(userId){
        if(this.#users.get(user['id'])){
            this.#users.delete(userId);
            return true;
        }
        return false;
    };

}


module.exports = Chatroom;