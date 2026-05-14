import mongoose from 'mongoose';
export declare const User: mongoose.Model<{
    name: string;
    email: string;
    passwordHash: string;
    history: mongoose.Types.DocumentArray<{
        type: string;
        data: any;
        timestamp: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        type: string;
        data: any;
        timestamp: NativeDate;
    }, {}, {}> & {
        type: string;
        data: any;
        timestamp: NativeDate;
    }>;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    passwordHash: string;
    history: mongoose.Types.DocumentArray<{
        type: string;
        data: any;
        timestamp: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        type: string;
        data: any;
        timestamp: NativeDate;
    }, {}, {}> & {
        type: string;
        data: any;
        timestamp: NativeDate;
    }>;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    name: string;
    email: string;
    passwordHash: string;
    history: mongoose.Types.DocumentArray<{
        type: string;
        data: any;
        timestamp: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        type: string;
        data: any;
        timestamp: NativeDate;
    }, {}, {}> & {
        type: string;
        data: any;
        timestamp: NativeDate;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name: string;
    email: string;
    passwordHash: string;
    history: mongoose.Types.DocumentArray<{
        type: string;
        data: any;
        timestamp: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        type: string;
        data: any;
        timestamp: NativeDate;
    }, {}, {}> & {
        type: string;
        data: any;
        timestamp: NativeDate;
    }>;
}, mongoose.Document<unknown, {}, {
    name: string;
    email: string;
    passwordHash: string;
    history: mongoose.Types.DocumentArray<{
        type: string;
        data: any;
        timestamp: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        type: string;
        data: any;
        timestamp: NativeDate;
    }, {}, {}> & {
        type: string;
        data: any;
        timestamp: NativeDate;
    }>;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    name: string;
    email: string;
    passwordHash: string;
    history: mongoose.Types.DocumentArray<{
        type: string;
        data: any;
        timestamp: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        type: string;
        data: any;
        timestamp: NativeDate;
    }, {}, {}> & {
        type: string;
        data: any;
        timestamp: NativeDate;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    name: string;
    email: string;
    passwordHash: string;
    history: mongoose.Types.DocumentArray<{
        type: string;
        data: any;
        timestamp: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        type: string;
        data: any;
        timestamp: NativeDate;
    }, {}, {}> & {
        type: string;
        data: any;
        timestamp: NativeDate;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    email: string;
    passwordHash: string;
    history: mongoose.Types.DocumentArray<{
        type: string;
        data: any;
        timestamp: NativeDate;
    }, mongoose.Types.Subdocument<mongoose.mongo.ObjectId, unknown, {
        type: string;
        data: any;
        timestamp: NativeDate;
    }, {}, {}> & {
        type: string;
        data: any;
        timestamp: NativeDate;
    }>;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=User.d.ts.map