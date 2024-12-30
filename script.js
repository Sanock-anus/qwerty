document.addEventListener('DOMContentLoaded', function() {
    const userList = document.getElementById('user-list');
    const chatTitle = document.getElementById('chat-title');
    const chatMessages = document.getElementById('chat-messages');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const addPhoneInput = document.getElementById('add-phone');
    const addButton = document.getElementById('add-button');
    
    let activeUser = null;
    let users = JSON.parse(localStorage.getItem('qwertyUsers')) || {}; // Загружаем пользователей из localStorage

    function saveUsers() {
        localStorage.setItem('qwertyUsers', JSON.stringify(users)); // Сохраняем пользователей в localStorage
    }


    function renderUsers() {
      userList.innerHTML = '';
      for (const phone in users) {
          const li = document.createElement('li');
          li.textContent = phone;
           li.addEventListener('click', () => selectUser(phone));
          userList.appendChild(li);
      }
    }

    function selectUser(phone) {
      activeUser = phone;
      chatTitle.textContent = `Чат с ${phone}`;

        document.querySelectorAll('.users-list li').forEach(li => li.classList.remove('active'));

         document.querySelectorAll('.users-list li').forEach(li => {
        if(li.textContent === phone){
          li.classList.add('active');
          }
        });
      chatMessages.innerHTML = '';
      renderMockMessages(phone);
    }
    
    function renderMockMessages(phone) {
        if (users[phone] && users[phone].messages) {
            users[phone].messages.forEach(message => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                if (message.senderId == phone){
                messageElement.classList.add('sent');
                }
                messageElement.textContent = message.text;
                chatMessages.appendChild(messageElement);
            });
        }
    }

     function sendMessage() {
         const messageText = messageInput.value.trim();
         if (messageText && activeUser) {
           if (!users[activeUser].messages) {
               users[activeUser].messages = [];
            }
            users[activeUser].messages.push({text: messageText, senderId: activeUser});
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'sent');
             messageElement.textContent = messageText;
             chatMessages.appendChild(messageElement);
            messageInput.value = '';
            saveUsers(); // Сохраняем данные в localStorage
         }
      }

      function addUser(){
          const phone = addPhoneInput.value.trim();
            if(phone && !users[phone])
            {
              users[phone] = { messages: [] };
              addPhoneInput.value = '';
              renderUsers();
              saveUsers(); // Сохраняем данные в localStorage
            }
        }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
     addButton.addEventListener('click', addUser);

   renderUsers(); // Вызываем рендер при загрузке страницы
});