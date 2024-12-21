export class WithId {

    id: string;
    constructor() {
        this.id = crypto.randomUUID();
    }
}
