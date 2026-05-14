export declare function register(email: string, password: string, name: string): Promise<{
    token: string;
    user: {
        id: import("mongoose").Types.ObjectId;
        email: string;
        name: string;
    };
}>;
export declare function login(email: string, password: string): Promise<{
    token: string;
    user: {
        id: import("mongoose").Types.ObjectId;
        email: string;
        name: string;
    };
}>;
export declare function verifyToken(token: string): {
    id: string;
    email: string;
} | null;
//# sourceMappingURL=auth.service.d.ts.map