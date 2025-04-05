namespace GhostChat.Api.Middlewares;

public class CorsMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        Console.WriteLine("Request Path: " + context.Request.Path);
        
        // // Add CORS headers to all responses
        // context.Response.Headers["Access-Control-Allow-Origin"] = context.Request.Headers.Origin.ToString();
        // context.Response.Headers["Access-Control-Allow-Methods"] = "POST, GET, OPTIONS";
        // context.Response.Headers["Access-Control-Allow-Headers"] = 
        //     "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,x-grpc-web,grpc-timeout,content-type";
        // context.Response.Headers["Access-Control-Expose-Headers"] = "grpc-status,grpc-message,grpc-encoding,grpc-accept-encoding";
        // context.Response.Headers["Access-Control-Allow-Credentials"] = "true";
        // context.Response.Headers["Access-Control-Max-Age"] = "1728000";
        //
        // // Handle preflight OPTIONS request
        // if (context.Request.Method.Equals(HttpMethods.Options, StringComparison.OrdinalIgnoreCase))
        // {
        //     context.Response.StatusCode = StatusCodes.Status204NoContent;
        //     await context.Response.CompleteAsync();
        //     return;
        // }

        await next(context);
    }
}

// Extension method for easier registration in Program.cs
public static class CorsMiddlewareExtensions
{
    public static IApplicationBuilder UseCustomCorsMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<CorsMiddleware>();
    }
}