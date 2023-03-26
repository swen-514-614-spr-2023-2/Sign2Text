class AbstractDAO{
    constructor(){

    }
    getChatroom(room_id){};
    createChatroom(room_id){};
    updateChatroom(chatroom){};
    deleteChatroom(room_id){};
}

module.exports = AbstractDAO;