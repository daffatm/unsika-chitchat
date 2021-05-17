document.addEventListener('DOMContentLoaded', () => {
    const chat = document.querySelector('.chat-popup');
    const chatBtn = document.querySelector('#chat-btn');
    const sendBtn = document.querySelector('#submit');
    const inputMsg = document.querySelector('#message');
    const chatArea = document.querySelector('#chat-area');

    yScroll = () => {
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    $(window).scroll(() => {
        var scroll = $(window).scrollTop();
        document.getElementById("my-body").style.marginTop = (-5 - (0.2 * scroll)) + "px";

        if (scroll >= 250) {
            $("#navbar").addClass("bg-danger");
        } else {
            $("#navbar").removeClass("bg-danger");
        }
    })

    // var user = firebase.auth().currentUser;
    chatBtn.addEventListener('click', () => {
        if (userId != '' && ip != '') {
            chat.classList.toggle('show');
            inputMsg.focus();
            yScroll();
        }
    })

    inputMsg.addEventListener('focus', () => {
        yScroll();
    })

    sendBtn.addEventListener('click', () => {
        userMessage();
        // yScroll();
    })

    inputMsg.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            userMessage();
            // yScroll();
        }
    })
});