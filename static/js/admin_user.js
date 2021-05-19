var urlParams = new URLSearchParams(window.location.search);

function goNext() {
    let offset;
    if (offset = urlParams.get('offset')) {
        offset = parseInt(offset);
        offset += 10;
    } else {
        offset = 10;
    }
    window.location.href = `/admin/users?offset=${offset}`;
}

function goPrev() {
    let offset;
    if (offset = urlParams.get('offset')) {
        offset = parseInt(offset);
        offset -= 10;
    } else {
        offset = 0;
    }
    if (offset < 0) {
        offset = 0;
    }
    window.location.href = `/admin/users?offset=${offset}`;
}