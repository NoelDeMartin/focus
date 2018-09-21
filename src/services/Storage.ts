class Storage {

    public set(key: string, value: any): any {
        localStorage.setItem(key, JSON.stringify(value));

        return value;
    }

    public get(key: string, defautlValue: any = null): any {
        const value = localStorage.getItem(key);

        return value ? JSON.parse(value) : defautlValue;
    }

    public has(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    public remove(key: string): boolean {
        if (this.has(key)) {
            localStorage.removeItem(key);

            return true;
        } else {
            return false;
        }
    }

}

export default new Storage();
