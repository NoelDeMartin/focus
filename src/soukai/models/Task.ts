import { Model, FieldType } from 'soukai';

export default class extends Model {

    static timestamps = false;

    static fields = {
        name: FieldType.String,
    };

}
