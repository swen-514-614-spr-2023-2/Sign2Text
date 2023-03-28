const ChatroomCacheDAO = require('./dao/ChatroomCacheDAO');
const Chatroom = require('./Chatroom');

class ChatroomService{
    #chatRoomDAO;
    #currentId;

    constructor(){
        this.#currentId = 0;
        this.#chatRoomDAO = new ChatroomCacheDAO();
    }

    enterChatroom(room_id, user){
        const chatroom = this.#chatRoomDAO.getChatroom(room_id);
        chatroom.addUser(user);
    };

    exitChatroom(room_id, user){
        const chatroom = this.#chatRoomDAO.getChatroom(room_id);
        chatroom.deleteUser(user);
    };

    sendMessage(message){
        const chatroom = this.#chatRoomDAO.getChatroom(message['roomId']);
        
        console.log('Adding message to chatroom');
        chatroom.addMessage(message);
    };

    createChatroom(name){
        let cm = new Chatroom(this.#currentId++, name);
        this.#chatRoomDAO.createChatroom(cm)
        console.log(`Chatroom with id ${cm.id} created`);
        return cm.id;
    };

    deleteChatroom(room_id){
        this.#chatRoomDAO.deleteChatroom(room_id);
    };
}

module.exports = ChatroomService;