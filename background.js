const endpoint = 'https://script.google.com/macros/s/AKfycbxdBex_DygDQF9HgmDsrccyxDy4s_Ll1atxpt5dqS7OQMs6Ru3lHqonUmcw-7X92raE/exec';
let sources = [];  // default sources
let target = 'en';  // default target

chrome.storage.local.get(['target', 'sources'], function (items) {
    target = items.target;
    sources = items.sources;
});

async function autoTranslate() {
    const columns = await getColumns([], 0);
    Array.from(columns).forEach(function (column) {
        watchColumn(column);
    })
}

async function getColumns(element, i) {
    if (element.length !== 0) {
        return element;
    } else if (i > 100) {
        console.log('failed');
        window.alert('Failed to start tweetdeck auto translator. Please reload tweetdeck.');
        return;  // @todo: throw Exception
    }
    
    return await new Promise(resolve => setTimeout(() => {
        resolve(getColumns(document.querySelectorAll('.js-column'), ++i))
    }, 500));
};

function watchColumn(column) {
    const mo = new MutationObserver(function (mutationList) {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(async function (node) {
                    if (node.nodeName === 'ARTICLE') {
                        await insertTranslated(node);
                    }
                })
            }
        }
    });

    const config = {
        childList: true,
        subtree: true,
    }

    mo.observe(column, config);
}

function getApi(url, header, i) {
    return fetch(url, header)
        .then(async (res) => {
            return await res.json();
        }).catch(async (error) => {
            // network error: retry 3 times
            return await new Promise((resolve, reject) => setTimeout(() => {
                if (i < 3) {
                    resolve(getApi(url, header, ++i));
                } else {
                    reject('API access attempt count exceeded');
                }
            }, 500));
        });
}

async function getTranslated(text, source, i) {
    return getApi(
            `${endpoint}?text=${encodeURIComponent(text)}&source=${source}&target=${target}`,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            },
            0
        ).then((translated) => {
            if (translated.code === 200) {
                return translated;
            } else if (translated.code === 400) {
                return Promise.reject(new Error('API Bad Request'));
            } else {
                return Promise.reject(new Error('API undefined error'));
            }
        });
}

function insertText(dom, originalText, inserting) {
    dom.innerHTML = `${originalText}<div class="translated-text">${inserting}</div>`;
}

async function insertTranslated(article) {
    try {
        if (article.classList.contains('translated')) {
            return;
        } else {
            // flag as translated
            article.classList.add('translated');
        }
        
        const tweet = article.getElementsByClassName('js-tweet')[0];
                
        const username = tweet.getElementsByClassName('username')[0].getInnerHTML();
        const tweetText = tweet.getElementsByClassName('tweet-text')[0];

        const text  = tweetText.getInnerHTML();
        const lang = tweetText.getAttribute('lang');

        if (sources.includes(lang)) {
            getTranslated(text, lang, 0)
                .then((translated) => {
                    console.log(username + ': ' + translated.text);  // @todo: for debugging
                    // tweetText.innerHTML = text + '<br />' + translated.text;
                    insertText(tweetText, text, translated.text);
                }).catch((error) => {
                    console.log(error.toString());
                    // tweetText.innerHTML = text + '<br />' + 'translation failed.';
                    insertText(tweetText, text, '*translation failed*');
                })
        }
    } catch (e) {
        if (e instanceof TypeError) {
            // probably getting DOM before completely rendering
            return;
        } else {
            console.log(e.toString());
            return;  // @todo: investigate possible errors
        }
    }
}

autoTranslate();
