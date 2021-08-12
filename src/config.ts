import {SchemaOptions} from "mongoose";

export const schemaOptions: SchemaOptions = {
    _id: true,
    id: true,
    toJSON: {getters: true},
    timestamps: true,
    skipVersioning:  true,
    strict: false
};