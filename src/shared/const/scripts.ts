export const THEME = `
(function() {
    try {
        const themes = {
            'dark': {
                'bg': '#0c0c0c',
                'color': '#FFFFFF'
            },
        }
    
        const scheme = themes['dark'];
        
        const css = 'body { display: block !important; background-color: ' + scheme['bg'] + '; color: ' + scheme['color'] + '; --primary_color: ' + scheme['color'] + '; --secondary_color: ' + scheme['bg'] + '; }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

        head.appendChild(style);
        
        style.type = 'text/css';
        if (style.styleSheet){
          // this is required for IE8 and below.
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
    } catch(e) {
        console.error(e);
    }
})();`;