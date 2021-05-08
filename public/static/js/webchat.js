document.addEventListener('DOMContentLoaded', () => {
    // get client public IP
    ip = '';
    $.getJSON('https://api.ipify.org?format=json', data => {
        ip = data.ip;
        console.log(`IP client telah didapatkan : ${ip}`);
    });

    // autentikasi user anonymous
    userId = '';
    firebase.auth().signInAnonymously();
    firebase.auth().onAuthStateChanged(newuser => {
        if (newuser) {
            userId = newuser.uid;
            console.log(`User telah di autentikasi : ${userId}`);

            var d = new Date();
            msgRef = firebase.database().ref(`messages/${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}/${userId}`);
            msgRef.on('value', showData);
        }
    })

    // signOut user anonymous
    window.addEventListener('beforeunload', () => {
        firebase.auth().signOut();
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                console.log('user telah logout');
            }
        })
    }, false)

    // get data pesan
    showData = (items) => {
        var _ul = document.getElementsByTagName('ul')[0];
        var _content = "";

        items.forEach(function (child) {
            if (child.val().sender == botName) {
                if (child.val().type == 'text') {
                    _content += "<li><div class='income-msg d-flex align-items-start my-2'><img src='static/img/bot-ava.png' alt='bot.img' class='avatar mr-1'><span class='msg bg-primary text-white px-3 py-2 mr-4'>" + child.val().message + "</span></div></li>"
                }
                if (child.val().type == 'image') {
                    _content += "<li><div class='income-msg d-flex align-items-start my-2'><img src='static/img/bot-ava.png' alt='bot.img' class='avatar mr-1'><span class='msg mr-4'><img src='" + child.val().message + "' alt='img'></span></div></li>"
                }     
            } else {
                _content += "<li><div class='out-msg d-flex align-items-start justify-content-end my-2'><span class='msg bg-dark text-white px-3 py-2 ml-4'>" + child.val().message + "</span></div></li>"
            }
        });

        _ul.innerHTML = _content;
    };

    // push pesan ke bot API
    botMessage = (msg) => {
        $.ajax({
            url: host,
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({
                'message': msg,
                'sender': ip
            }),
            success: (data, textStatus) => {
                setBotResponse(data);
                console.log(botName + " respond: ", data, "\n status: ", textStatus);
            },
            error: (errorMsg) => {
                console.log("Error: ", errorMsg);
            }
        })
    };

    // bot push pesan
    setBotResponse = (response) => {
        setTimeout(() => {
            if (response != null) {
                for (i = 0; i < response.length; i++) {
                    if (response[i].hasOwnProperty('text')) {
                        saveMessage(botName, response[i].text, 'text');
                    }
                    if (response[i].hasOwnProperty('image')) {
                        saveMessage(botName, String(response[i].image), 'image');
                    }
                }
                yScroll();
                yScroll();
            }
        }, 500);
    };

    // push data pesan ke database
    saveMessage = (sender, msg, type) => {
        var d = new Date();
        msgRef.push(userId).set({
            'sender': sender,
            'message': msg,
            'time': `${d.getHours()}:${d.getMinutes()+1}`,
            'type': type
        });
    };

    // user push pesan
    userMessage = () => {
        var message = document.getElementById('message').value;
        saveMessage(ip, message, 'text');
        botMessage(message);
        document.getElementById('message').value = '';
        yScroll();

        console.log(`Pesan user: ${message}`);
    };
});

// // bot message
// function botMessage(message, sender) {
//     var botRespond = "";
//     var sender = botName;
//     console.log("User message: ", message);
//     $.ajax({
//         url: host,
//         type: 'POST',
//         contentType: 'application/json',
//         data: JSON.stringify({
//             "message": message,
//             "sender": sender
//         }),
//         success: function(data, textStatus) {
//             if (data != null) {
//                 for (i = 0; i < data.length; i++) {
//                     botRespond = data[i].text;
//                 }

//                 msgRef.push().set({
//                     "sender": sender,
//                     "message": botRespond,
//                     "time": Date.now(),
//                     "type": "text"
//                 })
//             }
//             console.log("Rasa Response: ", data, "\n Status:", textStatus);
//             yScroll();
//         },
//         error: function(errorMessage) {
//             botRespond = "";
//             console.log('Error' + errorMessage);
//         }
//     })
// }