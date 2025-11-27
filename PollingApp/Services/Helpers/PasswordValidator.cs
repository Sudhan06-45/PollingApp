using System.Text.RegularExpressions;

namespace PollingApp.Services.Helpers
{
    public static class PasswordValidator
    {
        public static bool IsStrongPassword(string password)
        {
            if (password.Length < 8) return false;

            bool hasUpper = Regex.IsMatch(password, "[A-Z]");
            bool hasLower = Regex.IsMatch(password, "[a-z]");
            bool hasDigit = Regex.IsMatch(password, "[0-9]");
            bool hasSymbol = Regex.IsMatch(password, "[!@#$%^&*(),.?\":{}|<>]");

            return hasUpper && hasLower && hasDigit && hasSymbol;
        }
    }
}
