class AbstractDAO{
    constructor(){

    }
    //returns a chatroom object
    getChatroom(room_id){};
    //returns true if chatroom was created else false
    createChatroom(room_id){};
    //returns true if chatroom was update else false
    updateChatroom(chatroom){};
    //returns true if the chatroom was deleted else false
    deleteChatroom(room_id){};
}

module.exports = AbstractDAO;