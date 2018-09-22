export default class Str {

    public static random(length: number = 16): string {
        let text = '';
        let alphaNum = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += alphaNum.charAt(Math.floor(Math.random() * alphaNum.length));
        }

        return text;
    }

}
