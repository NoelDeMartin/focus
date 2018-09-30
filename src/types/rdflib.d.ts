import 'rdflib';

declare module 'rdflib' {
    export class Serializer {

        constructor(store: IndexedFormula);

        public toN3(f: any): any;

    }
}
