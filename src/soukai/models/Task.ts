import { Model, FieldType } from 'soukai';

export default class Task extends Model {

    static timestamps = false;

    static fields = {
        id: FieldType.Key,
        name: {
            type: FieldType.String,
            required: true,
        },
        description: FieldType.String,
        author_id: FieldType.Key,
        created_at: FieldType.Date,
        updated_at: FieldType.Date,
        completed_at: FieldType.Date,
    };

    public toggle(): Promise<Task> {
        if (this.completed) {
            this.unsetAttribute('completed_at');
        } else {
            this.setAttribute('completed_at', new Date());
        }

        return this.save();
    }

    get completed(): boolean {
        return !!this.completed_at;
    }

}
