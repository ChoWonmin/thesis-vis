/**
 * hex to hsl 변환
 * @param hex ex) #aaaaaa
 * @param type 아무것도 넣지 않거나 'string'을 넣는다
 * @returns {*}
 */
function hexToHsl(hex, type) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);

    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    h = Math.round(360*h);

    // string 으로 반환
    if (type === 'string') {
        return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
    }
    else {
        return {
            h: h,
            s: s,
            l: l
        }
    }
}
