let feedContainerElement = document.getElementById('feedContainer');
let feedItemTemplateElement = document.getElementById('feedItemTemplate');
let feedPreloaderElement = document.getElementById('feedPreloader');
feedContainerElement.innerHTML = '';

let offset = 0;

function getImgFromFeedItem(feedItem) {
    let template = document.createElement('template');
    template.insertAdjacentHTML('afterbegin', markdown.toHTML(feedItem.content));
    console.log(template);
    let imgs = template.getElementsByTagName('img');
    if (imgs.length === 0) {
        return '/public/images/material-bg.jpg';
    } else {
        return imgs[0].getAttribute('src');
    }
}

function appendFeedElement(feedItem) {
    let templateContent = feedItemTemplateElement.content.cloneNode(true);
    templateContent.querySelector('img').setAttribute('src', getImgFromFeedItem(feedItem));
    templateContent.querySelector('.card-title').innerText = feedItem.name;
    templateContent.querySelector('a').setAttribute('href', `/publications?id=${feedItem.id}`);
    feedContainerElement.appendChild(templateContent);
}

let isFetching = false;
let fetchingDisabled = false;

function setFeedFetching(state) {
    if (state) {
        isFetching = true;
        feedPreloaderElement.classList.remove('hide');
    } else {
        isFetching = false;
        feedPreloaderElement.classList.add('hide');
    }
}

function loadFeed() {
    setFeedFetching(true);
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/feed?offset=${offset}`);
    xhr.addEventListener('loadend', e => {
        setFeedFetching(false);
    });
    xhr.addEventListener('load', e => {
        let xhrObject = JSON.parse(xhr.responseText);
        if (xhrObject.success) {
            offset += xhrObject.items.length;
            for (let feedItem of xhrObject.items) {
                appendFeedElement(feedItem);
            }
            if (xhrObject.items.length < 10) {
                fetchingDisabled = true;
            }
        } else {
            M.toast({html: `Error loading feed:<br/>${xhrObject.error}`});
        }
    });
    xhr.send();
}

function executeFeedLoading() {
    if (fetchingDisabled) {
        return;
    }
    if (!isFetching) {
        loadFeed();
    }
}

document.addEventListener('scroll', function(event)
{    var element = document.documentElement;
    console.log(element.clientHeight, element.scrollHeight);
    if (element.scrollHeight - element.scrollTop <= element.clientHeight + 200)
    {
        executeFeedLoading();
    }
});

executeFeedLoading();