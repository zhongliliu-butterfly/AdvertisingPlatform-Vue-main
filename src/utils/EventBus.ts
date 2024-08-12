import mitt from 'mitt';

type Emits<EventType extends string | symbol | object, T> = {
    on(type: EventType, handler: (arg: T) => void): void;
    off(type: EventType, handler: (arg: T) => void): void;
    emit(type: EventType, arg: T): void;
};
type Emitter = Emits<any, any>;
const emitter: Emitter = mitt();
export default emitter;
