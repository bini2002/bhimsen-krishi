// src/utils/RequestMethod.ts
export enum RequestMethod {
    GET = 0,
    POST = 1,
    PUT = 2,
    DELETE = 3,
    PATCH = 4,
    ALL = 5,
    OPTIONS = 6,
    HEAD = 7,
    SEARCH = 8
}

export const RequestMethodLabels: { [key in RequestMethod]: string } = {
    [RequestMethod.GET]: "GET",
    [RequestMethod.POST]: "POST",
    [RequestMethod.PUT]: "PUT",
    [RequestMethod.DELETE]: "DELETE",
    [RequestMethod.PATCH]: "PATCH",
    [RequestMethod.ALL]: "ALL",
    [RequestMethod.OPTIONS]: "OPTIONS",
    [RequestMethod.HEAD]: "HEAD",
    [RequestMethod.SEARCH]: "SEARCH",
};
