import mongoose from 'mongoose';
export declare const Feedback: mongoose.Model<{
    timestamp: NativeDate;
    rating: string;
    feature: string;
    comments?: string | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    timestamp: NativeDate;
    rating: string;
    feature: string;
    comments?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    timestamp: NativeDate;
    rating: string;
    feature: string;
    comments?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    timestamp: NativeDate;
    rating: string;
    feature: string;
    comments?: string | null;
}, mongoose.Document<unknown, {}, {
    timestamp: NativeDate;
    rating: string;
    feature: string;
    comments?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    timestamp: NativeDate;
    rating: string;
    feature: string;
    comments?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    timestamp: NativeDate;
    rating: string;
    feature: string;
    comments?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    timestamp: NativeDate;
    rating: string;
    feature: string;
    comments?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=Feedback.d.ts.map