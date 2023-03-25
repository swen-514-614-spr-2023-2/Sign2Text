class ChatroomCacheDAO extends AbstractDAO{
    #map;

    constructor(){
        this.#map = new Map();
    }

    getChatroom(room_id){
        return this.#map.get(room_id);
    };
    createChatroom(room_id, chatroom){
        this.#map.set(room_id,chatroom);
    };

    updateChatroom(chatroom){
        this.#map.set(chatroom.id,chatroom);
    };

    deleteChatroom(room_id){
        return this.#map.delete(room_id);
    };
}