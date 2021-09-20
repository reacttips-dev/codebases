export default {
    load(url, name) {
        (function(d, s, id) {
            var js,
                fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = url;
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', name);
    },

    promisedLoad(url, name, onload = null) {
        const scriptId = `external-script-${name}`;
        if (document.getElementById(scriptId)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const body = document.getElementsByTagName('body')[0];

            let tag = document.createElement('script');
            tag.src = url;
            tag.id = scriptId;
            tag.type = 'text/javascript';
            tag.onload = onload;
            tag.addEventListener('load', resolve);
            tag.addEventListener('error', reject);

            body.appendChild(tag);
            return tag;
        });
    },
};