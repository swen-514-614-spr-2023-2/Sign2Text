const AbstractDAO = require('./AbstractDAO');
class ChatroomCacheDAO extends AbstractDAO{
    #map;

    constructor(){
        super();
        this.#map = new Map();
    }

    getChatroom(room_id){
        console.log(`Getting room with id ${room_id}, ${typeof(room_id)}`);
        return this.#map.get(room_id);
    };
    createChatroom(chatroom){
        console.log('Creating Chatroom with id '+chatroom['id']);
        this.#map.set(Number(chatroom['id']),chatroom);
        console.log(`In cache: ${this.#map}`);
        return true;
    };

    updateChatroom(chatroom){
        if(this.#map.has(chatroom['id'])){
            this.#map.set(chatroom.id,chatroom);
            return true;
        }
        else return false;
    };

    /**
     * 
     * @param {*} room_id id of chatroom to be deleted
     * @returns true if chatroom was deleted, else false
     */
    deleteChatroom(room_id){
        return this.#map.delete(room_id);
    };

    getAll(){
        // console.log(this.#map);
        // return this.#map;

        let ret = [];
        this.#map.forEach(e=>{
            let t = {};
            t['roomId'] = e['id'];
            t['name'] = e['name'];
            ret.push(t);
        });

        return ret;
    }
}

module.exports = ChatroomCacheDAO;