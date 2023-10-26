import firebase from "firebase/compat/app";
import  "firebase/compat/auth";
import 'firebase/compat/firestore';

import firebaseConfig from './firebaseConfig';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

export default {
   fbPopup: async () => {
      const provider = new firebase.auth.FacebookAuthProvider();
      try {
         const result = await firebaseApp.auth().signInWithPopup(provider);
         return result;
      } catch (error) {
         console.error('Error signing in with Facebook:', error);
         throw error;
      }
   },
   addUser: async (u) => {
      try {
         await db.collection('users').doc(u.id).set({
            name: u.name,
            avatar: u.avatar,
         }, { merge: true });
      } catch (error) {
         console.error('Error adding user:', error);
         throw error;
      }
   },
   getContactList: async (userId) => {
      try {
         let list = [];
         let results = await db.collection('users').get();
         results.forEach(result => {
            let data = result.data();
            if (result.id !== userId) {
               list.push({
                  id: result.id,
                  name: data.name,
                  avatar: data.avatar,
               });
            }
         });
         return list;
      } catch (error) {
         console.error('Error getting contact list:', error);
         throw error;
      }
   },
   addNewChat: async (user, user2) => {
      try {
         let newChat = await db.collection('chats').add({
            messages: [],
            users: [user.id, user2.id],
         });

         // Utiliza "firebase.firestore.FieldValue.arrayUnion"
         await db.collection('users').doc(user.id).update({
            chats: firebase.firestore.FieldValue.arrayUnion({
               chatId: newChat.id,
               title: user2.name,
               image: user2.avatar,
               with: user2.id,
            }),
         });
         // Utiliza "firebase.firestore.FieldValue.arrayUnion"
         await db.collection('users').doc(user2.id).update({
            chats: firebase.firestore.FieldValue.arrayUnion({
               chatId: newChat.id,
               title: user.name,
               image: user.avatar,
               with: user.id,
            }),
         });
      } catch (error) {
         console.error('Error adding a new chat:', error);
         throw error;
      }
   },
   onChatList: (userId, setChatlist) => {
      try {
         return db.collection('users').doc(userId).onSnapshot((doc) => {
            if (doc.exists) {
               let data = doc.data();
               if (data.chats) {
                  let chats = [...data.chats];

                  chats.sort((a, b) => {
                     if (a.lastMessageDate === undefined) {
                        return -1;
                     }
                     if (b.lastMessageDate === undefined) {
                        return 1;
                     }
                     if (a.lastMessageDate.seconds < b.lastMessageDate.seconds) {
                        return 1;
                     } else {
                        return -1;
                     }
                  });

                  setChatlist(chats);
               }
            }
         });
      } catch (error) {
         console.error('Error listening to chat list:', error);
         throw error;
      }
   },
   onChatContent: (chatId, setList, setUsers) => {
      try {
         return db.collection('chats').doc(chatId).onSnapshot((doc) => {
            if (doc.exists) {
               let data = doc.data();
               setList(data.messages);
               setUsers(data.users);
            }
         });
      } catch (error) {
         console.error('Error listening to chat content:', error);
         throw error;
      }
   },
   sendMessage: async (chatData, userId, type, body, users) => {
      try {
         let now = new Date();

         await db.collection('chats').doc(chatData.chatId).update({
            messages: firebase.firestore.FieldValue.arrayUnion({
               type,
               author: userId,
               body,
               date: now,
            }),
         });

         for (let i in users) {
            let u = await db.collection('users').doc(users[i]).get();
            let uData = u.data();
            if (uData.chats) {
               let chats = [...uData.chats];

               for (let e in chats) {
                  if (chats[e].chatId === chatData.chatId) {
                     chats[e].lastMessage = body;
                     chats[e].lastMessageDate = now;
                  }
               }
               await db.collection('users').doc(users[i]).update({
                  chats,
               });
            }
         }
      } catch (error) {
         console.error('Error sending a message:', error);
         throw error;
      }
   },
};
// Archivo de API

{
   "allowed_domains" ["http://localhost:3000/"]
 }