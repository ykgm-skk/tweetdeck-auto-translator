document.addEventListener('DOMContentLoaded', function () {
    let target = 'en';
    let sources = [];
    chrome.storage.local.get(['target', 'sources'], function (items) {
        if (items.target !== undefined) {
            target = items.target;
        }
        if (items.sources !== undefined) {
            sources = items.sources;
        }

        const targetOptions = Array.from(document.getElementById('target').children);
        targetOptions.forEach(function (option) {
            if (option.value == target) {
                option.selected = true;
            }
        });

        const sourceChecks = Array.from(document.getElementById('sources').children);
        sourceChecks.forEach(function (check) {
            if (sources.includes(check.value)) {
                check.checked = true;
            }
        })
    });

    saveButton = document.getElementById('save');
    saveButton.addEventListener('click', function () {
        const sourceChecks = Array.from(document.getElementById('sources').children);
        let checked = [];
        sourceChecks.forEach(function (check) {
            if (check.checked) {
                checked.push(check.value);
            }
        })

        chrome.storage.local.set({
            'target': document.getElementById('target').value,
            'sources': checked
        });

        window.alert('Saved.');
    });
});