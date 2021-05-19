let contentElement = document.getElementById('content');
let sourceElement = document.getElementById('source');

contentElement.innerHTML = markdown.toHTML(sourceElement.value);

let elements = contentElement.getElementsByTagName('img');
for (let el of elements) {
    el.classList.add('responsive-img');
}



let commentsSection = document.getElementById('commentsSection');
if (commentsSection) {
    let publicationId = parseInt(document.getElementById("publicationId").value);

    let template = document.getElementById('commentTemplate');
    let commentsPreloaderElement = document.getElementById('commentsPreloader');
    let fetchCommentsBtnElement = document.getElementById('fetchCommentsBtn');

    let lastTimeFetched = 0;
    let offset = 0;

    commentsPreloaderElement.classList.add('hide');
    fetchCommentsBtnElement.classList.add('disabled');

    fetchCommentsBtnElement.addEventListener('click', e => {
        fetchCommentsBtnElement.classList.add('disabled');
        offset += lastTimeFetched;
        getComments(offset);
    });

    commentsSection.innerHTML = '';
    function getComments(offset) {
        commentsPreloaderElement.classList.remove('hide');
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `/api/comments?publication=${publicationId}&offset=${offset}`);
        xhr.addEventListener('loadend', e => {
            commentsPreloaderElement.classList.add('hide');
        });
        xhr.addEventListener('load', e => {
            let commentsObject = JSON.parse(xhr.responseText);
            if (commentsObject.success) {
                for (let commentItem of commentsObject.items) {
                    let clone = template.content.cloneNode(true);
                    clone.querySelector('span.title').innerText = commentItem.user.nick;
                    clone.querySelector('img.circle').setAttribute('src', commentItem.user.avatar);
                    clone.querySelector('a').setAttribute('href', `/users/profile?id=${commentItem.user.id}`);
                    clone.querySelector('p').innerText = commentItem.content;
                    commentsSection.appendChild(clone);
                }

                lastTimeFetched = commentsObject.items.length;
                if (lastTimeFetched < 10) {
                    fetchCommentsBtnElement.classList.add('disabled');
                } else {
                    fetchCommentsBtnElement.classList.remove('disabled');
                }
            } else {
                M.toast({html: `Comments loading error:<br/>${commentsObject.error}`});
            }
        });
        xhr.send();
    }
    getComments(offset);

    let addCommentBtn = document.getElementById('addComentBtn');
    if (addCommentBtn) {
        let formElement = document.getElementById("newCommentForm");

        addCommentBtn.addEventListener('click', e => {
            let textAreaElement = document.getElementById('commentTextarea');
            if (textAreaElement.value.trim().length < 10) {
                M.toast({html: "Minimum comment length is 10"});
                e.preventDefault();
                return false;
            }
            let formData = new URLSearchParams(new FormData(formElement)).toString();
            formElement.reset();
            e.preventDefault();
            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/comments');
            xhr.addEventListener('loadend', e => {
                lastTimeFetched = 0;
                offset = 0;
                commentsSection.innerHTML = '';
                getComments(offset);
            });
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.send(formData);
        });
    }
}