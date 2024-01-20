export abstract class Model {
  abstract save(): Promise<void>;
}
//TODO: how to make static find method
//https://stackoverflow.com/questions/51859682/typescript-how-to-return-subclass-type-from-inherited-static-property
