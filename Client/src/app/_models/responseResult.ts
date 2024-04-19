export class ResponseResult {
  public statusCode: number | undefined;
  public message: string | undefined;
  public data: any;
}

export enum  StatusCodes
{
    success = 0,
    error = 1,
    exception = 2,
    update = 3,
    add = 4,
    deleted = 5,
    notFound =6,
    nullValue =7,
    alreadyExists =8,
    invalid = 9,
    unauthorize = 10,

}
