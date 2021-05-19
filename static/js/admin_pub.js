let filterClass = document.getElementById('filter-class');
var urlParams = new URLSearchParams(window.location.search);

filterClass.addEventListener('change', e => {
    console.log(`/admin/publications?filter=${filterClass.value}`);
    window.location.href = `/admin/publications?filter=${filterClass.value}`;
});

function goNext() {
    let offset;
    if (offset = urlParams.get('offset')) {
        offset = parseInt(offset);
        offset += 10;
    } else {
        offset = 10;
    }
    window.location.href = `/admin/publications?filter=${filterClass.value}&offset=${offset}`;
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
    window.location.href = `/admin/publications?filter=${filterClass.value}&offset=${offset}`;
}


let filterParam = urlParams.get('filter');
if (filterParam)
    filterClass.value = filterParam;