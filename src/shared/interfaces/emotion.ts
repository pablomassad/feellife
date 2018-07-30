export class Emotion{
    id?:string;
    datetime: number;
    emotion: string;
    intensity: number=2; //1:baja - 2:media - 3:alta
    comment: string;
    user:string;
}