using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using System.Web.WebPages;

namespace WebAppTemplate.Utils
{
    /// <summary>
    /// Check if request was not modified
    /// </summary>
    public class ValidatePost : AuthorizeAttribute
    {        
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            try
            {
                if (filterContext.HttpContext.Request.IsAjaxRequest())
                {
                    ValidateRequestHeader(filterContext.HttpContext.Request);
                }
                else
                {
                    filterContext.HttpContext.Response.StatusCode = 404;
                    filterContext.Result = new HttpNotFoundResult();
                }
            }
            catch (Exception e)
            {
                filterContext.HttpContext.Response.SetStatus(System.Net.HttpStatusCode.InternalServerError);
                throw new Exception("Failed to validate post data ! Data was tampered");
            }
        }

        private void ValidateRequestHeader(HttpRequestBase request)
        {
            String body2 = request.Headers["_"];
            string body = GetBase64Body(request);

            if (body2 != body)
            {
                throw new Exception("Failed to validate post data ! Data was tampered");
            }
        }

        private string GetBase64Body(HttpRequestBase Request)
        {
            // Make sure the request body stream is resettable
            var originalStream = new MemoryStream();
            //if (Request.InputStream.CanSeek)
            //{
            //    Request.InputStream.Position = 0;
            //}
            Request.InputStream.CopyTo(originalStream);
            originalStream.Position = 0;
            Request.InputStream.Position = 0;

            string documentContents;
            using (StreamReader readStream = new StreamReader(originalStream, Request.ContentEncoding))
            {
                documentContents = readStream.ReadToEnd();
            }
            return Convert.ToBase64String(System.Text.UTF8Encoding.UTF8.GetBytes(documentContents));

        }

    }

    /// <summary>
    /// For using @Html.AntiForgeryToken() via ajax
    /// <code>
    /// var token = $('input[name="__RequestVerificationToken"]').val();
    /// headers: {
    ///     'RequestVerificationToken': token,
    /// },
    /// </code>
    /// </summary>
    public class ValidateAntiForgeryTokenAjax : AuthorizeAttribute
    {
        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            try
            {
                if (filterContext.HttpContext.Request.IsAjaxRequest())
                {
                    ValidateRequestHeader(filterContext.HttpContext.Request);
                }
                else
                {
                    filterContext.HttpContext.Response.StatusCode = 404;
                    filterContext.Result = new HttpNotFoundResult();
                }
            }
            catch (HttpAntiForgeryException e)
            {
                filterContext.HttpContext.Response.SetStatus(System.Net.HttpStatusCode.InternalServerError);
                throw new HttpAntiForgeryException("Anti forgery token cookie not found");
            }
        }

        private void ValidateRequestHeader(HttpRequestBase request)
        {
            String cookieToken = request.Cookies["__RequestVerificationToken"].Value;
            String formToken = request.Headers["RequestVerificationToken"];
            String TokenValue = request.Headers["RequestVerificationToken"];
            
            if (!String.IsNullOrWhiteSpace(TokenValue))
            {
                String[] Tokens = TokenValue.Split(new string[] { "@.@" }, StringSplitOptions.RemoveEmptyEntries);
                if (Tokens.Length == 2)
                {
                    cookieToken = Tokens[0];
                    formToken = Tokens[1];
                }
                AntiForgery.Validate(cookieToken, formToken);
            }
        }

    }

}