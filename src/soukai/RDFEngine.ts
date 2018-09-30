import { Engine, Model, Database } from "soukai";
import $rdf, { IndexedFormula, Namespace, NamedNode } from 'rdflib';
import Auth from '@/services/Auth';

const FOAF = Namespace('http://xmlns.com/foaf/0.1/');
const LDP = Namespace('http://www.w3.org/ns/ldp#');
const SIOC = $rdf.Namespace('http://rdfs.org/sioc/ns#');
const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const DCT = $rdf.Namespace('http://purl.org/dc/terms/');

export default class RDFEngine implements Engine {

    private idp: string | null = null;

    constructor() {
        Auth.observable.subscribe(loggedIn => {
            if (loggedIn) {
                this.idp = Auth.idp;
            } else {
                this.idp = null;
            }
        });
    }

    public create(model: typeof Model, attributes: Database.Attributes): Promise<Database.Key> {
        return this.withIdp(idp => {
            return new Promise((resolve, reject) => {
                const g = $rdf.graph();
                const me = $rdf.sym(Auth.webId);
                g.add(me, RDF('type'), SIOC('Post'), null as any);
                g.add(me, DCT('title'), $rdf.lit('New task (not a post!)', null as any, null as any), null as any);

                const data = new $rdf.Serializer(g).toN3(g);

                var http = new XMLHttpRequest();
                http.open('POST', idp);
                http.setRequestHeader('Content-Type', 'text/turtle');
                http.setRequestHeader('Link', '<' + LDP('Resource').uri + '>; rel="type"');
                http.withCredentials = true;
                http.onreadystatechange = function () {
                    if (this.readyState == this.DONE) {
                        console.log(this);
                    }
                };
                http.send(data);
            });
        });
    }

    public readOne(model: typeof Model, id: Database.Key): Promise<Database.Document> {
        // TODO
        return Promise.reject('not implemented');
    }

    public readMany(model: typeof Model): Promise<Database.Document[]> {
        // TODO
        return Promise.reject('not implemented');
    }

    public update(
        model: typeof Model,
        id: Database.Key,
        dirtyAttributes: Database.Attributes,
        removedAttributes: string[],
    ): Promise<void> {
        // TODO
        return Promise.reject('not implemented');
    }

    public delete(model: typeof Model, id: Database.Key): Promise<void> {
        // TODO
        return Promise.reject('not implemented');
    }

    private withIdp<T>(callback: (idp: string) => T): T {
        if (this.idp) {
            return callback(this.idp);
        } else {
            throw new Error('User not authenticated');
        }
    }

}
