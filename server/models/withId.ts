export class WithId {
    constructor() {
        this.id = crypto.randomUUID();
    }
    id: string;
}
