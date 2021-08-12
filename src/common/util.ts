import {Response} from "express";

export namespace Util {

    export function sendSuccess(res: Response, data: any) {
        res.send({success: true, data: data, message: null});
    }

    export function sendError(res: Response, error: any, errorCode = 0) {
        if (typeof error === 'string') {
            res.send({success: false, error: error, errorCode: errorCode});
        } else {
            if (!error) {
                // noinspection AssignmentToFunctionParameterJS
                error = {stack: null, message: "Unknown Error"};
            }
            res.send({success: false, error: error.message, errorData: error, errorCode: errorCode});
        }
    }
}