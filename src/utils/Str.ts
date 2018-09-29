export default class Str {

    public static random(length: number = 16): string {
        let text = '';
        let alphaNum = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += alphaNum.charAt(Math.floor(Math.random() * alphaNum.length));
        }

        return text;
    }

    public static plural(text: string): string {
        // TODO use inflection library
        if (!text.endsWith('s')) {
            text = text + 's';
        }

        return text;
    }

    public static singular(text: string): string {
        // TODO use inflection library
        if (text.endsWith('s')) {
            text = text.substr(text.length - 2);
        }

        return text;
    }

    public static capitalize(text: string): string {
        return text.substr(0, 1).toUpperCase() + text.substr(1);
    }

}
